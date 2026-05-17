import { Injectable, ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { db } from '../config/firebase';

@Injectable()
export class VotesService {
  async create(pollId: string, optionId: string, userId: string, organizationId: string, comment?: string) {
    const pollDoc = await db.collection('polls').doc(pollId).get();
    if (!pollDoc.exists) throw new NotFoundException('Poll not found');
    const pollData = pollDoc.data() as any;
    if (pollData?.organizationId !== organizationId) {
      throw new ForbiddenException('Invalid organization access');
    }

    if (pollData.cutoffTime && pollData.cutoffTime < new Date().toISOString()) {
      throw new ConflictException('This poll is no longer active');
    }

    if (optionId !== 'other') {
      const optionDoc = await db.collection('polls').doc(pollId).collection('options').doc(optionId).get();
      if (!optionDoc.exists || (optionDoc.data() as any)?.organizationId !== organizationId) {
        throw new NotFoundException('Poll option not found');
      }
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
        const updateData: any = {
          optionId,
          updatedAt: new Date().toISOString(),
        };
        if (comment !== undefined) updateData.comment = comment;
        await votesRef.doc(voteId).update(updateData);
        return { id: voteId, pollId, optionId, userId, organizationId, comment, updatedAt: new Date().toISOString() };
      }
    }

    const voteData: any = {
      pollId,
      optionId,
      userId,
      organizationId,
      createdAt: new Date().toISOString(),
    };
    if (comment !== undefined) voteData.comment = comment;

    const docRef = await votesRef.add(voteData);
    return { id: docRef.id, ...voteData };
  }

  async findUserVotes(userId: string, organizationId: string) {
    const snapshot = await db.collection('votes')
      .where('userId', '==', userId)
      .where('organizationId', '==', organizationId)
      .get();
      
    const voteDocs = snapshot.docs.map(doc => ({ id: doc.id, data: doc.data() as any }));
    voteDocs.sort((a, b) => new Date(b.data.createdAt).getTime() - new Date(a.data.createdAt).getTime());

    const votes = await Promise.all(voteDocs.map(async (doc) => {
      const vote = doc.data;
      let pollDoc: any, optionDoc: any;
      if (vote.optionId === 'other') {
        pollDoc = await db.collection('polls').doc(vote.pollId).get();
        optionDoc = { exists: true, data: () => ({ optionText: 'Others', label: 'Others', type: 'Other' }) };
      } else {
        const [p, o] = await Promise.all([
          db.collection('polls').doc(vote.pollId).get(),
          db.collection('polls').doc(vote.pollId).collection('options').doc(vote.optionId).get()
        ]);
        pollDoc = p;
        optionDoc = o;
      }
      
      if (pollDoc.exists && optionDoc.exists) {
        const optionData = optionDoc.data() as any;
        let mealLabel = optionData.optionText || optionData.label || '';
        
        if (vote.optionId === 'other' && vote.comment) {
          mealLabel = `Others (${vote.comment})`;
        }

        let mealType = optionData.type;
        if (!mealType) {
          mealType = mealLabel.toLowerCase().includes('non-veg') ? 'Non-veg' : 'Veg';
        }

        return {
          id: doc.id,
          createdAt: vote.createdAt,
          pollId: vote.pollId,
          question: (pollDoc.data() as any).question,
          optionId: vote.optionId,
          meal: mealLabel,
          type: mealType,
          comment: vote.comment,
        };
      }
      return null;
    }));
    
    return votes.filter(v => v !== null);
  }
}
