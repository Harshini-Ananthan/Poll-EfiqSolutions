import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from '../config/firebase';

@Injectable()
export class OrganizationsService {
  async getProfile(id: string) {
    const doc = await db.collection('organizations').doc(id).get();
    if (!doc.exists) throw new NotFoundException('Organization not found');
    return { id: doc.id, ...(doc.data() as any) };
  }

  async updateProfile(id: string, data: any) {
    await db.collection('organizations').doc(id).update(data);
    return this.getProfile(id);
  }
}
