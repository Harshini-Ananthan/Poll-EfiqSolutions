import { PollsService } from './polls.service';
import { CreatePollDto } from './dto/create-poll.dto';
export declare class PollsController {
    private readonly pollsService;
    constructor(pollsService: PollsService);
    create(createPollDto: CreatePollDto, req: any): Promise<{
        options: {
            optionText: string;
            type?: string;
        }[];
        isActive: boolean;
        scheduledAt: string;
        creatorId: string;
        organizationId: string;
        createdAt: string;
        question: string;
        sendPushNotification?: boolean;
        allowVoteEdit?: boolean;
        sendReminder?: boolean;
        id: string;
    }>;
    findAll(req: any): Promise<any[]>;
    findOne(id: string): Promise<any>;
    remove(id: string): Promise<FirebaseFirestore.WriteResult>;
}
