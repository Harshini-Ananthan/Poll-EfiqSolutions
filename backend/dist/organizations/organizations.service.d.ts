import { PrismaService } from '../prisma/prisma.service';
export declare class OrganizationsService {
    private prisma;
    constructor(prisma: PrismaService);
    getProfile(id: string): Promise<any>;
    updateProfile(id: string, data: any): Promise<any>;
}
