"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuperadminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SuperadminService = class SuperadminService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboardStats(organizationId) {
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
    async getOrganizationUsers(organizationId) {
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
};
exports.SuperadminService = SuperadminService;
exports.SuperadminService = SuperadminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SuperadminService);
//# sourceMappingURL=superadmin.service.js.map