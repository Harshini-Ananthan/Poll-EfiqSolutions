import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VotesService {
  constructor(private prisma: PrismaService) {}

  async create(pollId: string, optionId: string, userId: string, organizationId: string) {
    // Check if already voted (Prisma will also throw error due to unique constraint, but we handle it explicitly)
    const existingVote = await this.prisma.vote.findUnique({
      where: {
        pollId_userId: { pollId, userId },
      },
    });

    if (existingVote) {
      throw new ConflictException('You have already voted on this poll');
    }

    return this.prisma.vote.create({
      data: {
        poll: { connect: { id: pollId } },
        option: { connect: { id: optionId } },
        user: { connect: { id: userId } },
        organization: { connect: { id: organizationId } },
      },
    });
  }
}
