import { Injectable, UnauthorizedException } from '@nestjs/common';
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
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { 
      email: user.email, 
      sub: user.id, 
      role: user.role,
      organizationId: user.organizationId 
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        organizationId: user.organizationId,
      }
    };
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
}
