import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { auth, db } from '../../config/firebase';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const header = request.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
      throw new UnauthorizedException('No token provided');
    }

    const token = header.split(' ')[1];

    try {
      const decodedToken = await auth.verifyIdToken(token);
      
      let organizationId = decodedToken.organizationId;
      let role = decodedToken.role;

      // If claims are missing, try fetching user info from Firestore
      if (!organizationId) {
        const userDoc = await db.collection('users').doc(decodedToken.uid).get();
        if (userDoc.exists) {
          const userData = userDoc.data() as any;
          organizationId = userData.organizationId;
          role = userData.role;
        }
      }

      if (!organizationId) {
        throw new UnauthorizedException('User has no associated organization');
      }

      request.user = {
        id: decodedToken.uid,
        email: decodedToken.email,
        role: role || 'USER',
        organizationId: organizationId,
      };
      return true;
    } catch (error) {
      console.error('Auth Guard Error:', error);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
