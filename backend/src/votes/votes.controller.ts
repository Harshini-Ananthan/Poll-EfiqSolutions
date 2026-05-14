import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { VotesService } from './votes.service';
import { FirebaseAuthGuard } from '../auth/guards/firebase-auth.guard';

@Controller('votes')
@UseGuards(FirebaseAuthGuard)
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @Post()
  async create(@Body() body: { pollId: string; optionId: string }, @Request() req: any) {
    return this.votesService.create(body.pollId, body.optionId, req.user.id, req.user.organizationId);
  }
}
