import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private jwtService;
    constructor(jwtService: JwtService);
    validateUser(email: string, pass: string): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
        user: {
            id: any;
            name: any;
            email: any;
            role: any;
            organizationId: any;
        };
    }>;
    changePassword(userId: string, currentPass: string, newPass: string): Promise<{
        message: string;
    }>;
}
