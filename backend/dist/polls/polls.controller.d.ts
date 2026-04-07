import { PollsService } from './polls.service';
import { CreatePollDto } from './dto/create-poll.dto';
export declare class PollsController {
    private readonly pollsService;
    constructor(pollsService: PollsService);
    create(createPollDto: CreatePollDto, req: any): Promise<any>;
    findAll(req: any): Promise<any>;
    findOne(id: string): Promise<any>;
    remove(id: string): Promise<any>;
}
