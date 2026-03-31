import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SuperadminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats(organizationId: string) {
    const today = new Array(0);
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [totalUsers, votedToday, monthVotes, latestPoll] = await Promise.all([
      this.prisma.user.count({ where: { organizationId } }),
      this.prisma.vote.count({
        where: {
          organizationId,
          createdAt: { gte: startOfDay },
        },
      }),
      this.prisma.vote.count({
        where: {
          organizationId,
          createdAt: { gte: startOfMonth },
        },
      }),
      this.prisma.poll.findFirst({
        where: { organizationId, isActive: true },
        orderBy: { createdAt: 'desc' },
        include: {
          options: {
            include: {
              _count: {
                select: { votes: true },
              },
            },
          },
        },
      }),
    ]);

    return {
      totalCustomers: totalUsers,
      votedToday,
      notVotedToday: totalUsers - votedToday,
      monthMealsServed: monthVotes,
      latestPoll: latestPoll ? {
        id: latestPoll.id,
        question: latestPoll.question,
        scheduledAt: latestPoll.scheduledAt,
        options: latestPoll.options.map(opt => ({
          text: opt.optionText,
          count: opt._count.votes,
          type: opt.type
        }))
      } : null
    };
  }

  async getOrganizationUsers(organizationId: string) {
    return this.prisma.user.findMany({
      where: { organizationId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        mobileNo: true,
        department: true,
        createdAt: true,
      },
      orderBy: { name: 'asc' },
    });
  }
}
