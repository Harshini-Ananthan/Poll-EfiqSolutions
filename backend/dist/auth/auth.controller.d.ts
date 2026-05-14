import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(body: any): Promise<{
        access_token: string;
        user: {
            id: any;
            name: any;
            email: any;
            role: any;
            organizationId: any;
        };
    }>;
    changePassword(req: any, body: any): Promise<{
        message: string;
    }>;
}
