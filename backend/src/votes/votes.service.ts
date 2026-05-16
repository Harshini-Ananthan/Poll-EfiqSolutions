import { Injectable, ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { db } from '../config/firebase';

@Injectable()
export class VotesService {
  async create(pollId: string, optionId: string, userId: string, organizationId: string) {
    const pollDoc = await db.collection('polls').doc(pollId).get();
    if (!pollDoc.exists) throw new NotFoundException('Poll not found');
    const pollData = pollDoc.data() as any;
    if (pollData?.organizationId !== organizationId) {
      throw new ForbiddenException('Invalid organization access');
    }

    if (pollData.cutoffTime && pollData.cutoffTime < new Date().toISOString()) {
      throw new ConflictException('This poll is no longer active');
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
      if (!pollData.allowVoteEdit) {
        throw new ConflictException('You have already voted on this poll. Editing is not allowed.');
      } else {
        const voteId = existingVote.docs[0].id;
        await votesRef.doc(voteId).update({
          optionId,
          updatedAt: new Date().toISOString(),
        });
        return { id: voteId, pollId, optionId, userId, organizationId, updatedAt: new Date().toISOString() };
      }
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

  async findUserVotes(userId: string, organizationId: string) {
    const snapshot = await db.collection('votes')
      .where('userId', '==', userId)
      .where('organizationId', '==', organizationId)
      .orderBy('createdAt', 'desc')
      .get();
      
    const votes = [];
    for (const doc of snapshot.docs) {
      const vote = doc.data() as any;
      const pollDoc = await db.collection('polls').doc(vote.pollId).get();
      const optionDoc = await db.collection('polls').doc(vote.pollId).collection('options').doc(vote.optionId).get();
      
      if (pollDoc.exists && optionDoc.exists) {
        const optionData = optionDoc.data() as any;
        votes.push({
          id: doc.id,
          createdAt: vote.createdAt,
          pollId: vote.pollId,
          question: (pollDoc.data() as any).question,
          optionId: vote.optionId,
          meal: optionData.label,
          type: optionData.label.toLowerCase().includes('non-veg') ? 'Non-veg' : 'Veg',
        });
      }
    }
    return votes;
  }
}
