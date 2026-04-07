import { VotesService } from './votes.service';
export declare class VotesController {
    private readonly votesService;
    constructor(votesService: VotesService);
    create(body: {
        pollId: string;
        optionId: string;
    }, req: any): Promise<any>;
}
