import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrganizationsService {
  constructor(private prisma: PrismaService) {}

  async getProfile(id: string) {
    const org = await this.prisma.organization.findUnique({
      where: { id },
    });
    if (!org) throw new NotFoundException('Organization not found');
    return org;
  }

  async updateProfile(id: string, data: any) {
    return this.prisma.organization.update({
      where: { id },
      data,
    });
  }
}
