import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { PollsService } from './polls.service';
import { CreatePollDto } from './dto/create-poll.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('polls')
@UseGuards(JwtAuthGuard)
export class PollsController {
  constructor(private readonly pollsService: PollsService) {}

  @Post()
  create(@Body() createPollDto: CreatePollDto, @Request() req: any) {
    return this.pollsService.create(createPollDto, req.user.userId, req.user.organizationId);
  }

  @Get()
  findAll(@Request() req: any) {
    return this.pollsService.findAll(req.user.organizationId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pollsService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pollsService.remove(id);
  }
}
