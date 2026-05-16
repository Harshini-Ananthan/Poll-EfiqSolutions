import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { db, auth } from '../config/firebase';
import * as bcrypt from 'bcrypt';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Injectable()
export class SuperadminService {
  async getTenantDashboardStats(organizationId: string) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [totalUsersSnap, votedTodaySnap, monthVotesSnap, latestPollSnap] = await Promise.all([
      db.collection('users').where('organizationId', '==', organizationId).get(),
      db.collection('votes').where('organizationId', '==', organizationId).where('createdAt', '>=', startOfDay.toISOString()).get().catch(() => null),
      db.collection('votes').where('organizationId', '==', organizationId).where('createdAt', '>=', startOfMonth.toISOString()).get().catch(() => null),
      db.collection('polls')
        .where('organizationId', '==', organizationId)
        .where('isActive', '==', true)
        .orderBy('createdAt', 'desc')
        .limit(1)
        .get()
        .catch(() => null),
    ]);

    let latestPoll: any = null;
    if (latestPollSnap && !latestPollSnap.empty) {
      const latestPollDoc = latestPollSnap.docs[0];
      const pollData = latestPollDoc.data() as any;
      const optionsSnap = await latestPollDoc.ref.collection('options').get();
      const options = await Promise.all(optionsSnap.docs.map(async (optDoc) => {
        const optData = optDoc.data() as any;
        const optVotesSnap = await db.collection('votes').where('optionId', '==', optDoc.id).get();
        return {
          text: optData.optionText,
          count: optVotesSnap.size,
          type: optData.type,
        };
      }));

      latestPoll = {
        id: latestPollDoc.id,
        question: pollData.question,
        scheduledAt: pollData.scheduledAt,
        options,
      };
    }

    const votedToday = votedTodaySnap?.size || 0;
    const totalCustomers = totalUsersSnap.size;

    return {
      totalCustomers,
      votedToday,
      notVotedToday: Math.max(0, totalCustomers - votedToday),
      monthMealsServed: monthVotesSnap?.size || 0,
      latestPoll,
    };
  }

  async getDashboardStats() {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const [organizationsSnap, usersSnap, activePollsSnap, votesTodaySnap] = await Promise.all([
      db.collection('organizations').get(),
      db.collection('users').get(),
      db.collection('polls').where('isActive', '==', true).get(),
      db.collection('votes').where('createdAt', '>=', startOfDay.toISOString()).get(),
    ]);

    const organizations = organizationsSnap.docs.map((doc) => doc.data() as any);
    const users = usersSnap.docs.map((doc) => doc.data() as any);

    return {
      totalOrganizations: organizationsSnap.size,
      totalAdmins: users.filter((user) => user.role === 'ADMIN').length,
      totalUsers: users.filter((user) => user.role === 'USER' || user.role === 'employee').length,
      activePolls: activePollsSnap.size,
      totalVotesToday: votesTodaySnap.size,
      activeOrganizations: organizations.filter((organization) => organization.isEnabled !== false).length,
      disabledOrganizations: organizations.filter((organization) => organization.isEnabled === false).length,
    };
  }

  async listOrganizations(search?: string) {
    const [organizationsSnap, adminSnap, pollsSnap, votesSnap] = await Promise.all([
      db.collection('organizations').get(),
      db.collection('users').where('role', '==', 'ADMIN').get(),
      db.collection('polls').get(),
      db.collection('votes').get(),
    ]);

    const adminsByOrganization = new Map<string, any>();
    adminSnap.docs.forEach((doc) => {
      const admin = this.sanitizeUser(doc.id, doc.data() as any);
      if (admin.organizationId) adminsByOrganization.set(admin.organizationId, admin);
    });

    const pollCounts = this.countByOrganization(pollsSnap.docs.map((doc) => doc.data() as any));
    const voteCounts = this.countByOrganization(votesSnap.docs.map((doc) => doc.data() as any));

    return organizationsSnap.docs
      .map((doc) => {
        const data = doc.data() as any;
        const organizationId = data.organizationId || doc.id;
        return {
          id: doc.id,
          organizationId,
          companyName: data.companyName,
          isEnabled: data.isEnabled !== false,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          settings: data.settings || {},
          admin: adminsByOrganization.get(organizationId) || null,
          stats: {
            polls: pollCounts.get(organizationId) || 0,
            votes: voteCounts.get(organizationId) || 0,
          },
        };
      })
      .filter((organization) => {
        if (!search) return true;
        const needle = search.toLowerCase();
        return (
          organization.companyName?.toLowerCase().includes(needle) ||
          organization.admin?.email?.toLowerCase().includes(needle) ||
          organization.admin?.name?.toLowerCase().includes(needle)
        );
      })
      .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
  }

  async listAdmins(search?: string) {
    const [adminSnap, organizationsSnap] = await Promise.all([
      db.collection('users').where('role', '==', 'ADMIN').get(),
      db.collection('organizations').get(),
    ]);

    const organizations = new Map<string, any>();
    organizationsSnap.docs.forEach((doc) => {
      const data = doc.data() as any;
      organizations.set(data.organizationId || doc.id, { id: doc.id, ...data });
    });

    return adminSnap.docs
      .map((doc) => {
        const admin = this.sanitizeUser(doc.id, doc.data() as any);
        return {
          ...admin,
          organization: admin.organizationId ? organizations.get(admin.organizationId) || null : null,
        };
      })
      .filter((admin) => {
        if (!search) return true;
        const needle = search.toLowerCase();
        return (
          admin.name?.toLowerCase().includes(needle) ||
          admin.email?.toLowerCase().includes(needle) ||
          admin.organization?.companyName?.toLowerCase().includes(needle)
        );
      })
      .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
  }

  async createAdmin(data: CreateAdminDto) {
    const email = data.email.trim().toLowerCase();
    const duplicate = await db.collection('users').where('email', '==', email).limit(1).get();
    if (!duplicate.empty) {
      throw new ConflictException('Email already exists');
    }

    const organizationRef = db.collection('organizations').doc();
    const organizationId = organizationRef.id;
    const now = new Date().toISOString();
    const passwordHash = await bcrypt.hash(data.password, 12);

    const firebaseUser = await auth.createUser({
      email,
      password: data.password,
      displayName: data.name,
    });

    try {
      await auth.setCustomUserClaims(firebaseUser.uid, {
        role: 'ADMIN',
        organizationId,
      });

      const userRef = db.collection('users').doc(firebaseUser.uid);
      await db.runTransaction(async (transaction) => {
        transaction.set(organizationRef, {
          organizationId,
          companyName: data.companyName,
          isEnabled: true,
          createdAt: now,
          updatedAt: now,
          settings: {
            timezone: 'Asia/Kolkata',
            pollAccess: true,
            mobileAccess: true,
          },
        });

        transaction.set(userRef, {
          userId: firebaseUser.uid,
          name: data.name,
          email,
          mobileNo: data.mobileNo || '',
          passwordHash,
          organizationId,
          role: 'ADMIN',
          isEnabled: true,
          createdAt: now,
          updatedAt: now,
        });
      });

      return {
        organization: { id: organizationId, organizationId, companyName: data.companyName, isEnabled: true, createdAt: now },
        admin: this.sanitizeUser(firebaseUser.uid, {
          userId: firebaseUser.uid,
          name: data.name,
          email,
          mobileNo: data.mobileNo || '',
          organizationId,
          role: 'ADMIN',
          isEnabled: true,
          createdAt: now,
        }),
      };
    } catch (error) {
      await auth.deleteUser(firebaseUser.uid).catch(() => undefined);
      throw error;
    }
  }

  async updateOrganizationStatus(organizationId: string, isEnabled: boolean) {
    const organizationRef = await this.resolveOrganizationRef(organizationId);
    const organizationDoc = await organizationRef.get();
    if (!organizationDoc.exists) throw new NotFoundException('Organization not found');

    const now = new Date().toISOString();
    await organizationRef.update({ isEnabled, updatedAt: now });

    const admins = await db.collection('users')
      .where('organizationId', '==', organizationId)
      .where('role', '==', 'ADMIN')
      .get();

    const batch = db.batch();
    admins.docs.forEach((doc) => batch.update(doc.ref, { isEnabled, updatedAt: now }));
    await batch.commit();

    await Promise.all(admins.docs.map((doc) => auth.updateUser(doc.id, { disabled: !isEnabled }).catch(() => undefined)));
    return this.getOrganization(organizationId);
  }

  async getOrganization(organizationId: string) {
    const organizations = await this.listOrganizations();
    const organization = organizations.find((item) => item.organizationId === organizationId || item.id === organizationId);
    if (!organization) throw new NotFoundException('Organization not found');
    return organization;
  }

  async updateAdmin(adminId: string, data: UpdateAdminDto) {
    const userRef = db.collection('users').doc(adminId);
    const userDoc = await userRef.get();
    if (!userDoc.exists) throw new NotFoundException('Admin not found');

    const existing = userDoc.data() as any;
    if (existing.role !== 'ADMIN') throw new NotFoundException('Admin not found');

    const updateData: any = { updatedAt: new Date().toISOString() };
    if (data.name !== undefined) updateData.name = data.name;
    if (data.mobileNo !== undefined) updateData.mobileNo = data.mobileNo;
    if (data.isEnabled !== undefined) updateData.isEnabled = data.isEnabled;

    if (data.email && data.email.toLowerCase() !== existing.email) {
      const duplicate = await db.collection('users').where('email', '==', data.email.toLowerCase()).limit(1).get();
      if (!duplicate.empty && duplicate.docs[0].id !== adminId) {
        throw new ConflictException('Email already exists');
      }
      updateData.email = data.email.toLowerCase();
    }

    if (data.password) {
      updateData.passwordHash = await bcrypt.hash(data.password, 12);
    }

    await userRef.update(updateData);

    const authUpdate: any = {};
    if (updateData.email) authUpdate.email = updateData.email;
    if (updateData.name) authUpdate.displayName = updateData.name;
    if (data.password) authUpdate.password = data.password;
    if (data.isEnabled !== undefined) authUpdate.disabled = !data.isEnabled;
    if (Object.keys(authUpdate).length) {
      await auth.updateUser(adminId, authUpdate).catch(() => undefined);
    }

    return this.sanitizeUser(adminId, { ...existing, ...updateData });
  }

  async getActivity() {
    const [usersSnap, pollsSnap, votesSnap, organizationsSnap] = await Promise.all([
      db.collection('users').orderBy('createdAt', 'desc').limit(10).get().catch(() => null),
      db.collection('polls').orderBy('createdAt', 'desc').limit(10).get().catch(() => null),
      db.collection('votes').orderBy('createdAt', 'desc').limit(10).get().catch(() => null),
      db.collection('organizations').orderBy('updatedAt', 'desc').limit(10).get().catch(() => null),
    ]);

    return {
      recentLogins: [],
      recentAdmins: usersSnap?.docs.map((doc) => this.sanitizeUser(doc.id, doc.data() as any)) || [],
      recentPollCreations: pollsSnap?.docs.map((doc) => ({ id: doc.id, ...(doc.data() as any) })) || [],
      recentVotes: votesSnap?.docs.map((doc) => ({ id: doc.id, ...(doc.data() as any) })) || [],
      organizationActivity: organizationsSnap?.docs.map((doc) => ({ id: doc.id, ...(doc.data() as any) })) || [],
    };
  }

  async getOrganizationUsers(organizationId: string, startDate?: string, endDate?: string) {
    let votesQuery = db.collection('votes').where('organizationId', '==', organizationId);

    if (startDate) {
      votesQuery = votesQuery.where('createdAt', '>=', new Date(startDate).toISOString());
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      votesQuery = votesQuery.where('createdAt', '<=', end.toISOString());
    }

    const [usersSnap, votesSnap] = await Promise.all([
      db.collection('users').where('organizationId', '==', organizationId).get(),
      votesQuery.get(),
    ]);

    const voteCounts = new Map<string, number>();
    votesSnap.docs.forEach((doc) => {
      const data = doc.data();
      const userId = data.userId;
      if (userId) {
        voteCounts.set(userId, (voteCounts.get(userId) || 0) + 1);
      }
    });

    return usersSnap.docs.map((doc) => {
      const user = this.sanitizeUser(doc.id, doc.data() as any);
      return {
        ...user,
        votes: voteCounts.get(doc.id) || 0,
      };
    });
  }

  async createUser(organizationId: string, userData: any) {
    const passwordHash = await bcrypt.hash(userData.password || 'Temporary123!', 10);
    const now = new Date().toISOString();
    const newUser = {
      name: userData.name,
      email: userData.email || '',
      passwordHash,
      organizationId,
      role: userData.role || 'USER',
      isEnabled: true,
      status: 'Active',
      mobileNo: userData.mobileNo || '',
      countryCode: userData.countryCode || '+91',
      department: userData.department || '',
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await db.collection('users').add(newUser);
    return this.sanitizeUser(docRef.id, newUser);
  }

  private countByOrganization(items: any[]) {
    const counts = new Map<string, number>();
    items.forEach((item) => {
      if (!item.organizationId) return;
      counts.set(item.organizationId, (counts.get(item.organizationId) || 0) + 1);
    });
    return counts;
  }

  private sanitizeUser(id: string, data: any) {
    const { passwordHash, ...user } = data;
    return {
      id,
      userId: data.userId || id,
      ...user,
      isEnabled: data.isEnabled !== false,
    };
  }

  private async resolveOrganizationRef(organizationId: string) {
    const directRef = db.collection('organizations').doc(organizationId);
    const directDoc = await directRef.get();
    if (directDoc.exists) return directRef;

    const snap = await db.collection('organizations').where('organizationId', '==', organizationId).limit(1).get();
    if (snap.empty) throw new NotFoundException('Organization not found');
    return snap.docs[0].ref;
  }
}
