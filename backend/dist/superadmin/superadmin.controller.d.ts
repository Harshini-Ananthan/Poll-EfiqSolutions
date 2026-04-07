import { SuperadminService } from './superadmin.service';
export declare class SuperadminController {
    private readonly superadminService;
    constructor(superadminService: SuperadminService);
    getStats(req: any): Promise<{
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
    getUsers(req: any): Promise<any>;
}
