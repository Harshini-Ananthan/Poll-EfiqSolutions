export declare class SuperadminService {
    getDashboardStats(organizationId: string): Promise<{
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
    getOrganizationUsers(organizationId: string): Promise<{
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
