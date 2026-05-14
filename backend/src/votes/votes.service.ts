import { Injectable, ConflictException } from '@nestjs/common';
import { db } from '../config/firebase';

@Injectable()
export class VotesService {
  async create(pollId: string, optionId: string, userId: string, organizationId: string) {
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
