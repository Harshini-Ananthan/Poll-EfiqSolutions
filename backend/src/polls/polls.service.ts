import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from '../config/firebase';
import { CreatePollDto } from './dto/create-poll.dto';

@Injectable()
export class PollsService {
  async create(createPollDto: CreatePollDto, creatorId: string, organizationId: string) {
    const { options, ...pollData } = createPollDto;

    const pollRef = db.collection('polls').doc();
    const pollId = pollRef.id;

    const poll = {
      ...pollData,
      isActive: pollData.isActive ?? true,
      scheduledAt: pollData.scheduledAt ?? new Date().toISOString(),
      cutoffTime: pollData.cutoffTime ?? null,
      allowVoteEdit: pollData.allowVoteEdit ?? false,
      creatorId,
      organizationId,
      createdAt: new Date().toISOString(),
    };

    await pollRef.set(poll);

    const optionsBatch = db.batch();
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

  async findAll(organizationId: string) {
    const snapshot = await db.collection('polls')
      .where('organizationId', '==', organizationId)
      .orderBy('createdAt', 'desc')
      .get();

    const now = new Date().toISOString();
    const polls = [];
    for (const doc of snapshot.docs) {
      const data = doc.data() as any;
      if (data.isActive && data.cutoffTime && data.cutoffTime < now) {
        db.collection('polls').doc(doc.id).update({ isActive: false }).catch(() => null);
        data.isActive = false;
      }
      const poll = { id: doc.id, ...data } as any;
      
      const optionsSnapshot = await doc.ref.collection('options').get();
      poll.options = optionsSnapshot.docs.map(oDoc => {
        const oData = oDoc.data() as any;
        return { 
          id: oDoc.id, 
          ...oData,
          label: oData.optionText || oData.label // Fallback if label already exists
        };
      });
      
      const votesSnapshot = await db.collection('votes')
        .where('pollId', '==', doc.id)
        .where('organizationId', '==', organizationId)
        .get();
      poll._count = { votes: votesSnapshot.size };
      
      polls.push(poll);
    }
    return polls;
  }

  async findOne(id: string, organizationId: string) {
    const doc = await db.collection('polls').doc(id).get();
    if (!doc.exists || (doc.data() as any)?.organizationId !== organizationId) {
      throw new NotFoundException(`Poll with ID ${id} not found`);
    }

    const poll = { id: doc.id, ...(doc.data() as any) } as any;
    
    const optionsSnapshot = await doc.ref.collection('options').get();
    poll.options = optionsSnapshot.docs.map(oDoc => {
      const oData = oDoc.data() as any;
      return { 
        id: oDoc.id, 
        ...oData,
        label: oData.optionText || oData.label 
      };
    });

    const votesSnapshot = await db.collection('votes')
      .where('pollId', '==', id)
      .get();
    poll.votes = votesSnapshot.docs.map(vDoc => ({ id: vDoc.id, ...(vDoc.data() as any) }));

    return poll;
  }

  async remove(id: string, organizationId: string) {
    await this.findOne(id, organizationId);
    return db.collection('polls').doc(id).delete();
  }
}
