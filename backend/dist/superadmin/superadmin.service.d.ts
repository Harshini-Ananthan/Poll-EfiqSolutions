import { PrismaService } from '../prisma/prisma.service';
export declare class SuperadminService {
    private prisma;
    constructor(prisma: PrismaService);
    getDashboardStats(organizationId: string): Promise<{
        totalCustomers: any;
        votedToday: any;
        notVotedToday: number;
        monthMealsServed: any;
        latestPoll: {
            id: any;
            question: any;
            scheduledAt: any;
            options: any;
        } | null;
    }>;
    getOrganizationUsers(organizationId: string): Promise<any>;
}
