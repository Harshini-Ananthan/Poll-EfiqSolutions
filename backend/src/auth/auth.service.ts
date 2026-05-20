import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { db, auth } from '../config/firebase';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('email', '==', email).limit(1).get();
    
    if (snapshot.empty) return null;
    
    const userDoc = snapshot.docs[0];
    const user = { id: userDoc.id, ...userDoc.data() } as any;
    
    if (user && await bcrypt.compare(pass, user.passwordHash)) {
      await this.assertAccountEnabled(user);
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async validateMobileUser(phoneNumber: string): Promise<any> {
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('mobileNo', '==', phoneNumber).limit(1).get();
    
    if (snapshot.empty) return null;
    
    const userDoc = snapshot.docs[0];
    const user = { id: userDoc.id, ...userDoc.data() } as any;
    
    if (user.role !== 'USER' && user.role !== 'employee') {
      throw new UnauthorizedException('Only mobile users can login');
    }

    await this.assertAccountEnabled(user);
    const { passwordHash, ...result } = user;
    return result;
  }

  async login(user: any) {
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
      organizationId: user.organizationId
    };

    let organization = null;
    if (user.organizationId && user.role !== 'SUPER_ADMIN') {
      const orgDoc = await db.collection('organizations').doc(user.organizationId).get();
      if (orgDoc.exists) {
        const org = orgDoc.data() as any;
        organization = {
          companyName: org.name || org.companyName || '',
          shortName: org.shortName || '',
          logoBase64: org.logoBase64 || null,
          brandColor: org.brandColor || '#F97316',
          darkMode: org.darkMode || false,
          compactMode: org.compactMode || false,
        };
      }
    }

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber || user.mobileNo || '',
        mobileNo: user.mobileNo || user.phoneNumber || '',
        countryCode: user.countryCode || '',
        department: user.department || '',
        role: user.role,
        organizationId: user.organizationId,
        isEnabled: user.isEnabled !== false,
      },
      organization,
    };
  }

  async getCurrentUser(userId: string) {
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) throw new UnauthorizedException('User not found');

    const user = { id: userDoc.id, ...userDoc.data() } as any;
    await this.assertAccountEnabled(user);

    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }

  async changePassword(userId: string, currentPass: string, newPass: string) {
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) throw new UnauthorizedException('User not found');
    
    const user = userDoc.data() as any;
    const isValid = await bcrypt.compare(currentPass, user.passwordHash);
    if (!isValid) throw new UnauthorizedException('Current password incorrect');
    
    const hashedPassword = await bcrypt.hash(newPass, 10);
    await db.collection('users').doc(userId).update({ passwordHash: hashedPassword });
    
    try {
      await auth.updateUser(userId, { password: newPass });
    } catch (e) {
      // Ignore if user doesn't exist in Firebase Auth yet
    }
    
    return { message: 'Password updated successfully' };
  }

  private async assertAccountEnabled(user: any) {
    if (user.isEnabled === false) {
      throw new ForbiddenException('ACCOUNT_DISABLED');
    }

    if (user.role !== 'SUPER_ADMIN' && user.organizationId) {
      let organizationDoc = await db.collection('organizations').doc(user.organizationId).get();
      if (!organizationDoc.exists) {
        const organizationSnap = await db.collection('organizations').where('organizationId', '==', user.organizationId).limit(1).get();
        organizationDoc = organizationSnap.empty ? organizationDoc : organizationSnap.docs[0];
      }
      const organization = organizationDoc.data() as any;
      if (!organizationDoc.exists || organization?.isEnabled === false) {
        throw new ForbiddenException('ACCOUNT_DISABLED');
      }
    }
  }
}
