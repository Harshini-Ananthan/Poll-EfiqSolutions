import { PrismaService } from '../prisma/prisma.service';
import { CreatePollDto } from './dto/create-poll.dto';
export declare class PollsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createPollDto: CreatePollDto, creatorId: string, organizationId: string): Promise<any>;
    findAll(organizationId: string): Promise<any>;
    findOne(id: string): Promise<any>;
    remove(id: string): Promise<any>;
}
