import { Injectable, ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { db } from '../config/firebase';

@Injectable()
export class VotesService {
  async create(pollId: string, optionId: string, userId: string, organizationId: string) {
    const pollDoc = await db.collection('polls').doc(pollId).get();
    if (!pollDoc.exists) throw new NotFoundException('Poll not found');
    if ((pollDoc.data() as any)?.organizationId !== organizationId) {
      throw new ForbiddenException('Invalid organization access');
    }

    const optionDoc = await db.collection('polls').doc(pollId).collection('options').doc(optionId).get();
    if (!optionDoc.exists || (optionDoc.data() as any)?.organizationId !== organizationId) {
      throw new NotFoundException('Poll option not found');
    }

    const votesRef = db.collection('votes');
    const existingVote = await votesRef
      .where('pollId', '==', pollId)
      .where('userId', '==', userId)
      .limit(1)
      .get();

    if (!existingVote.empty) {
      throw new ConflictException('You have already voted on this poll');
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
}
