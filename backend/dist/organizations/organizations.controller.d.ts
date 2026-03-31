import { OrganizationsService } from './organizations.service';
export declare class OrganizationsController {
    private readonly organizationsService;
    constructor(organizationsService: OrganizationsService);
    getProfile(req: any): Promise<{
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
    updateProfile(req: any, data: any): Promise<{
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
