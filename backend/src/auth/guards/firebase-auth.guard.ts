import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { auth, db } from '../../config/firebase';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  private readonly jwtService = new JwtService();

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const header = request.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
      throw new UnauthorizedException('No token provided');
    }

    const token = header.split(' ')[1];

    try {
      const decodedToken = await this.decodeToken(token);
      let userId = decodedToken.uid || decodedToken.sub;
      let email = decodedToken.email;
      let organizationId = decodedToken.organizationId;
      let role = decodedToken.role;
      let userData: any = null;

      let userDoc = userId ? await db.collection('users').doc(userId).get() : null;
      if ((!userDoc || !userDoc.exists) && email) {
        const userSnap = await db.collection('users').where('email', '==', email).limit(1).get();
        userDoc = userSnap.empty ? null : userSnap.docs[0];
        userId = userDoc?.id || userId;
      }

      if (userDoc?.exists) {
        userData = userDoc.data() as any;
        organizationId = userData.organizationId || organizationId;
        role = userData.role || role;
        email = userData.email || email;
      }

      if (!userId || !role) {
        throw new UnauthorizedException('User profile is incomplete');
      }

      if (userData?.isEnabled === false) {
        throw new ForbiddenException('ACCOUNT_DISABLED');
      }

      if (role !== 'SUPER_ADMIN' && !organizationId) {
        throw new UnauthorizedException('User has no associated organization');
      }

      if (organizationId) {
        let organizationDoc = await db.collection('organizations').doc(organizationId).get();
        if (!organizationDoc.exists) {
          const organizationSnap = await db.collection('organizations').where('organizationId', '==', organizationId).limit(1).get();
          organizationDoc = organizationSnap.empty ? organizationDoc : organizationSnap.docs[0];
        }
        if (!organizationDoc.exists) {
          throw new ForbiddenException('ORGANIZATION_NOT_FOUND');
        }
        const organization = organizationDoc.data() as any;
        if (organization?.isEnabled === false) {
          throw new ForbiddenException('ACCOUNT_DISABLED');
        }
      }

      request.user = {
        id: userId,
        email,
        role,
        organizationId,
        isEnabled: userData?.isEnabled !== false,
      };
      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException || error instanceof ForbiddenException) {
        throw error;
      }
      console.error('Auth Guard Error:', error);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private async decodeToken(token: string): Promise<any> {
    try {
      return await auth.verifyIdToken(token);
    } catch {
      return this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET || 'secret',
      });
    }
  }
}
