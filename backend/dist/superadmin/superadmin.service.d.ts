import { PrismaService } from '../prisma/prisma.service';
export declare class SuperadminService {
    private prisma;
    constructor(prisma: PrismaService);
    getDashboardStats(organizationId: string): Promise<{
        totalCustomers: number;
        votedToday: number;
        notVotedToday: number;
        monthMealsServed: number;
        latestPoll: {
            id: string;
            question: string;
            scheduledAt: Date | null;
            options: {
                text: string;
                count: number;
                type: string | null;
            }[];
        } | null;
    }>;
    getOrganizationUsers(organizationId: string): Promise<{
        id: string;
        email: string;
        name: string;
        role: import(".prisma/client").$Enums.Role;
        status: string;
        mobileNo: string | null;
        department: string | null;
        createdAt: Date;
    }[]>;
}
