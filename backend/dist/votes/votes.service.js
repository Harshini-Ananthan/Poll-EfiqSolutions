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
exports.VotesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let VotesService = class VotesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(pollId, optionId, userId, organizationId) {
        const existingVote = await this.prisma.vote.findUnique({
            where: {
                pollId_userId: { pollId, userId },
            },
        });
        if (existingVote) {
            throw new common_1.ConflictException('You have already voted on this poll');
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
};
exports.VotesService = VotesService;
exports.VotesService = VotesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], VotesService);
//# sourceMappingURL=votes.service.js.map