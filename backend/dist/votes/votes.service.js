"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VotesService = void 0;
const common_1 = require("@nestjs/common");
const firebase_1 = require("../config/firebase");
let VotesService = class VotesService {
    async create(pollId, optionId, userId, organizationId) {
        const votesRef = firebase_1.db.collection('votes');
        const existingVote = await votesRef
            .where('pollId', '==', pollId)
            .where('userId', '==', userId)
            .limit(1)
            .get();
        if (!existingVote.empty) {
            throw new common_1.ConflictException('You have already voted on this poll');
        }
        const voteData = {
            pollId,
            optionId,
            userId,
            organizationId,
            createdAt: new Date().toISOString(),
        };
        const docRef = await votesRef.add(voteData);
        return { id: docRef.id, ...voteData };
    }
};
exports.VotesService = VotesService;
exports.VotesService = VotesService = __decorate([
    (0, common_1.Injectable)()
], VotesService);
//# sourceMappingURL=votes.service.js.map