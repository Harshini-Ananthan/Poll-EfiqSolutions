import { OrganizationsService } from './organizations.service';
export declare class OrganizationsController {
    private readonly organizationsService;
    constructor(organizationsService: OrganizationsService);
    getProfile(req: any): Promise<any>;
    updateProfile(req: any, data: any): Promise<any>;
}
