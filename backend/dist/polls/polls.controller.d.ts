import { PollsService } from './polls.service';
import { CreatePollDto } from './dto/create-poll.dto';
export declare class PollsController {
    private readonly pollsService;
    constructor(pollsService: PollsService);
    create(createPollDto: CreatePollDto, req: any): Promise<{
        options: {
            id: string;
            optionText: string;
            type: string | null;
            pollId: string;
        }[];
    } & {
        id: string;
        organizationId: string;
        createdAt: Date;
        updatedAt: Date;
        question: string;
        scheduledAt: Date | null;
        sendPushNotification: boolean;
        allowVoteEdit: boolean;
        sendReminder: boolean;
        isActive: boolean;
        createdBy: string;
    }>;
    findAll(req: any): Promise<({
        options: ({
            _count: {
                votes: number;
            };
        } & {
            id: string;
            optionText: string;
            type: string | null;
            pollId: string;
        })[];
        _count: {
            votes: number;
        };
    } & {
        id: string;
        organizationId: string;
        createdAt: Date;
        updatedAt: Date;
        question: string;
        scheduledAt: Date | null;
        sendPushNotification: boolean;
        allowVoteEdit: boolean;
        sendReminder: boolean;
        isActive: boolean;
        createdBy: string;
    })[]>;
    findOne(id: string): Promise<{
        votes: ({
            user: {
                id: string;
                name: string;
            };
        } & {
            id: string;
            organizationId: string;
            createdAt: Date;
            pollId: string;
            userId: string;
            optionId: string;
        })[];
        options: ({
            _count: {
                votes: number;
            };
        } & {
            id: string;
            optionText: string;
            type: string | null;
            pollId: string;
        })[];
    } & {
        id: string;
        organizationId: string;
        createdAt: Date;
        updatedAt: Date;
        question: string;
        scheduledAt: Date | null;
        sendPushNotification: boolean;
        allowVoteEdit: boolean;
        sendReminder: boolean;
        isActive: boolean;
        createdBy: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        organizationId: string;
        createdAt: Date;
        updatedAt: Date;
        question: string;
        scheduledAt: Date | null;
        sendPushNotification: boolean;
        allowVoteEdit: boolean;
        sendReminder: boolean;
        isActive: boolean;
        createdBy: string;
    }>;
}
