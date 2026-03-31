import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePollDto } from './dto/create-poll.dto';

@Injectable()
export class PollsService {
  constructor(private prisma: PrismaService) {}

  async create(createPollDto: CreatePollDto, creatorId: string, organizationId: string) {
    const { options, ...pollData } = createPollDto;

    return this.prisma.poll.create({
      data: {
        ...pollData,
        creator: { connect: { id: creatorId } },
        organization: { connect: { id: organizationId } },
        options: {
          create: options.map((opt) => ({
            optionText: opt.optionText,
            type: opt.type,
          })),
        },
      },
      include: {
        options: true,
      },
    });
  }

  async findAll(organizationId: string) {
    return this.prisma.poll.findMany({
      where: { organizationId },
      include: {
        _count: {
          select: { votes: true },
        },
        options: {
          include: {
            _count: {
              select: { votes: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const poll = await this.prisma.poll.findUnique({
      where: { id },
      include: {
        options: {
          include: {
            _count: {
              select: { votes: true },
            },
          },
        },
        votes: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!poll) {
      throw new NotFoundException(`Poll with ID ${id} not found`);
    }

    return poll;
  }

  async remove(id: string) {
    return this.prisma.poll.delete({
      where: { id },
    });
  }
}
