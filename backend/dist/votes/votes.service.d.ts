import { PrismaService } from '../prisma/prisma.service';
export declare class VotesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(pollId: string, optionId: string, userId: string, organizationId: string): Promise<any>;
}
