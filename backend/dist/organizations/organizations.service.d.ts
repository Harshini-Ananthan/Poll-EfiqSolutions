import { PrismaService } from '../prisma/prisma.service';
export declare class OrganizationsService {
    private prisma;
    constructor(prisma: PrismaService);
    getProfile(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        shortName: string | null;
        logo: string | null;
        adminEmail: string | null;
        phone: string | null;
        address: string | null;
        dailyPollReminder: boolean;
        cutoffReminder: boolean;
        adminCommentAlert: boolean;
    }>;
    updateProfile(id: string, data: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        shortName: string | null;
        logo: string | null;
        adminEmail: string | null;
        phone: string | null;
        address: string | null;
        dailyPollReminder: boolean;
        cutoffReminder: boolean;
        adminCommentAlert: boolean;
    }>;
}
