export declare class VotesService {
    create(pollId: string, optionId: string, userId: string, organizationId: string): Promise<{
        pollId: string;
        optionId: string;
        userId: string;
        organizationId: string;
        createdAt: string;
        id: string;
    }>;
}
