import { SuperadminService } from './superadmin.service';
export declare class SuperadminController {
    private readonly superadminService;
    constructor(superadminService: SuperadminService);
    getStats(req: any): Promise<{
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
    getUsers(req: any): Promise<{
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
