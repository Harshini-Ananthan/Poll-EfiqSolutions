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
            question: any;
            scheduledAt: any;
            options: {
                text: any;
                count: number;
                type: any;
            }[];
        } | null;
    }>;
    getUsers(req: any): Promise<{
        id: string;
        name: any;
        email: any;
        role: any;
        status: any;
        mobileNo: any;
        department: any;
        createdAt: any;
    }[]>;
}
