import { PrismaService } from '../prisma/prisma.service';
export declare class VotesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(pollId: string, optionId: string, userId: string, organizationId: string): Promise<{
        id: string;
        organizationId: string;
        createdAt: Date;
        pollId: string;
        userId: string;
        optionId: string;
    }>;
}
