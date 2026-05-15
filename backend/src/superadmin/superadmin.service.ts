import { Injectable } from '@nestjs/common';
import { db, auth } from '../config/firebase';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SuperadminService {
  async getDashboardStats(organizationId: string) {
    const stats = {
      totalCustomers: 0,
      votedToday: 0,
      notVotedToday: 0,
      monthMealsServed: 0,
      latestPoll: null as any,
    };

    try {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      // Fetch each metric with individual try-catch to prevent total failure
      try {
        const totalUsersSnap = await db.collection('users').where('organizationId', '==', organizationId).get();
        stats.totalCustomers = totalUsersSnap.size;
      } catch (e) {
        console.error('Failed to fetch total users:', e.message);
      }

      try {
        const votedTodaySnap = await db.collection('votes')
          .where('organizationId', '==', organizationId)
          .where('createdAt', '>=', startOfDay.toISOString())
          .get();
        stats.votedToday = votedTodaySnap.size;
      } catch (e) {
        console.warn('Failed to fetch today votes (index probably missing):', e.message);
      }

      try {
        const monthVotesSnap = await db.collection('votes')
          .where('organizationId', '==', organizationId)
          .where('createdAt', '>=', startOfMonth.toISOString())
          .get();
        stats.monthMealsServed = monthVotesSnap.size;
      } catch (e) {
        console.warn('Failed to fetch month votes (index probably missing):', e.message);
      }

      try {
        const latestPollSnap = await db.collection('polls')
          .where('organizationId', '==', organizationId)
          .where('isActive', '==', true)
          .orderBy('createdAt', 'desc')
          .limit(1)
          .get();

        if (!latestPollSnap.empty) {
          const latestPollDoc = latestPollSnap.docs[0];
          const pollData = latestPollDoc.data() as any;
          
          // Options are in a subcollection
          const optionsSnap = await latestPollDoc.ref.collection('options').get();
          const options = [];
          
          for (const optDoc of optionsSnap.docs) {
            const optData = optDoc.data() as any;
            const optVotesSnap = await db.collection('votes')
              .where('optionId', '==', optDoc.id)
              .get();
            
            options.push({
              text: optData.optionText,
              count: optVotesSnap.size,
              type: optData.type
            });
          }

          stats.latestPoll = {
            id: latestPollDoc.id,
            question: pollData.question,
            scheduledAt: pollData.scheduledAt,
            options
          };
        }
      } catch (e) {
        console.warn('Failed to fetch latest poll (index probably missing):', e.message);
      }

      stats.notVotedToday = Math.max(0, stats.totalCustomers - stats.votedToday);
      return stats;
    } catch (error) {
      console.error('Fatal error in getDashboardStats:', error);
      // Return empty stats instead of throwing to prevent 500
      return stats;
    }
  }

  async getOrganizationUsers(organizationId: string) {
    try {
      const snapshot = await db.collection('users')
        .where('organizationId', '==', organizationId)
        .get();
      
      const users = snapshot.docs.map(doc => {
        const data = doc.data() as any;
        return {
          id: doc.id,
          name: data.name,
          email: data.email,
          role: data.role,
          status: data.status,
          mobileNo: data.mobileNo,
          department: data.department,
          createdAt: data.createdAt,
        };
      });

      // Sort in memory to avoid index requirements
      return users.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    } catch (e) {
      console.error('Failed to fetch organization users:', e.message);
      return [];
    }
  }
  async createUser(organizationId: string, userData: any) {
    try {
      const { name, email, password, mobileNo, countryCode, department, role } = userData;
      
      // Hash password
      const passwordHash = await bcrypt.hash(password || 'Temporary123!', 10);
      
      const newUser: any = {
        name,
        email: email || '', // Optional email
        passwordHash,
        organizationId,
        role: role || 'employee',
        status: 'Active',
        mobileNo: mobileNo || '',
        countryCode: countryCode || '+91',
        department: department || '',
        createdAt: new Date().toISOString(),
      };

      const docRef = await db.collection('users').add(newUser);
      
      // Also create in Firebase Auth if email is provided
      if (email) {
        try {
          await auth.createUser({
            uid: docRef.id,
            email,
            password: password || 'Temporary123!',
            displayName: name,
          });
        } catch (authError) {
          console.error('Firebase Auth creation failed:', authError.message);
        }
      }

      return { id: docRef.id, ...newUser };
    } catch (e) {
      console.error('Failed to create user:', e.message);
      throw e;
    }
  }

  async updateUser(organizationId: string, userId: string, userData: any) {
    try {
      const { name, email, mobileNo, countryCode, department, role, status } = userData;
      
      const updateData: any = {
        name,
        email: email || '',
        mobileNo: mobileNo || '',
        countryCode: countryCode || '+91',
        department: department || '',
        role: role || 'employee',
        status: status || 'Active',
        updatedAt: new Date().toISOString(),
      };

      // Verify ownership before update
      const userRef = db.collection('users').doc(userId);
      const doc = await userRef.get();
      const existingData = doc.data();
      
      if (!doc.exists || !existingData || existingData.organizationId !== organizationId) {
        throw new Error('User not found or unauthorized');
      }

      await userRef.update(updateData);
      
      // Update in Firebase Auth if email changed or exists
      if (email && email !== existingData.email) {
        try {
          await auth.updateUser(userId, { email, displayName: name });
        } catch (authError) {
          console.error('Firebase Auth update failed:', authError.message);
        }
      }

      return { id: userId, ...existingData, ...updateData };
    } catch (e) {
      console.error('Failed to update user:', e.message);
      throw e;
    }
  }
}
