import { CreatePollDto } from './dto/create-poll.dto';
export declare class PollsService {
    create(createPollDto: CreatePollDto, creatorId: string, organizationId: string): Promise<{
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
    findAll(organizationId: string): Promise<any[]>;
    findOne(id: string): Promise<any>;
    remove(id: string): Promise<FirebaseFirestore.WriteResult>;
}
