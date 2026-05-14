"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PollsService = void 0;
const common_1 = require("@nestjs/common");
const firebase_1 = require("../config/firebase");
let PollsService = class PollsService {
    async create(createPollDto, creatorId, organizationId) {
        const { options, ...pollData } = createPollDto;
        const pollRef = firebase_1.db.collection('polls').doc();
        const pollId = pollRef.id;
        const poll = {
            ...pollData,
            isActive: pollData.isActive ?? true,
            scheduledAt: pollData.scheduledAt ?? new Date().toISOString(),
            creatorId,
            organizationId,
            createdAt: new Date().toISOString(),
        };
        await pollRef.set(poll);
        const optionsBatch = firebase_1.db.batch();
        options.forEach((opt) => {
            const optRef = pollRef.collection('options').doc();
            optionsBatch.set(optRef, {
                ...opt,
                pollId,
                organizationId
            });
        });
        await optionsBatch.commit();
        return { id: pollId, ...poll, options };
    }
    async findAll(organizationId) {
        const snapshot = await firebase_1.db.collection('polls')
            .where('organizationId', '==', organizationId)
            .orderBy('createdAt', 'desc')
            .get();
        const polls = [];
        for (const doc of snapshot.docs) {
            const poll = { id: doc.id, ...doc.data() };
            const optionsSnapshot = await doc.ref.collection('options').get();
            poll.options = optionsSnapshot.docs.map(oDoc => ({ id: oDoc.id, ...oDoc.data() }));
            const votesSnapshot = await firebase_1.db.collection('votes')
                .where('pollId', '==', doc.id)
                .where('organizationId', '==', organizationId)
                .get();
            poll._count = { votes: votesSnapshot.size };
            polls.push(poll);
        }
        return polls;
    }
    async findOne(id) {
        const doc = await firebase_1.db.collection('polls').doc(id).get();
        if (!doc.exists) {
            throw new common_1.NotFoundException(`Poll with ID ${id} not found`);
        }
        const poll = { id: doc.id, ...doc.data() };
        const optionsSnapshot = await doc.ref.collection('options').get();
        poll.options = optionsSnapshot.docs.map(oDoc => ({ id: oDoc.id, ...oDoc.data() }));
        const votesSnapshot = await firebase_1.db.collection('votes')
            .where('pollId', '==', id)
            .get();
        poll.votes = votesSnapshot.docs.map(vDoc => ({ id: vDoc.id, ...vDoc.data() }));
        return poll;
    }
    async remove(id) {
        return firebase_1.db.collection('polls').doc(id).delete();
    }
};
exports.PollsService = PollsService;
exports.PollsService = PollsService = __decorate([
    (0, common_1.Injectable)()
], PollsService);
//# sourceMappingURL=polls.service.js.map