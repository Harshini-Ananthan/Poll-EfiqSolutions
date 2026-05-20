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

    const usersSnapshot = await db.collection('users')
      .where('organizationId', '==', organizationId)
      .get();

    const usersMap = new Map<string, any>();
    const customers = usersSnapshot.docs
      .map(uDoc => {
        const uData = uDoc.data();
        const userObj = {
          id: uDoc.id,
          userId: uData.userId || uDoc.id,
          name: uData.name || 'Unknown',
          email: uData.email || '',
          mobileNo: uData.mobileNo || '',
          countryCode: uData.countryCode || '',
          department: uData.department || '',
          branch: uData.branch || '',
          role: uData.role || '',
          isEnabled: uData.isEnabled !== false
        };
        usersMap.set(uDoc.id, userObj);
        if (uData.userId) {
          usersMap.set(uData.userId, userObj);
        }
        return userObj;
      })
      .filter(u => {
        const r = u.role || '';
        return (r === 'USER' || r === 'employee' || r === 'EMPLOYEE') && u.isEnabled !== false;
      });

    poll.customers = customers;

    let companyName = 'Unknown';
    const orgRef = db.collection('organizations').doc(organizationId);
    const orgDoc = await orgRef.get();
    if (orgDoc.exists) {
      const data = orgDoc.data() as any;
      companyName = data.companyName || data.name || 'Unknown';
    } else {
      const orgSnap = await db.collection('organizations').where('organizationId', '==', organizationId).limit(1).get();
      if (!orgSnap.empty) {
        const data = orgSnap.docs[0].data() as any;
        companyName = data.companyName || data.name || 'Unknown';
      }
    }
    poll.companyName = companyName;

    // Build options lookup map
    const optionsMap = new Map<string, string>();
    poll.options.forEach((opt: any) => {
      optionsMap.set(opt.id, opt.label || opt.optionText || opt.text || 'Option');
    });

    poll.votes = votesSnapshot.docs.map(vDoc => {
      const vData = vDoc.data() as any;
      const user = usersMap.get(vData.userId) || null;

      // Resolve option text
      let optionText = optionsMap.get(vData.optionId) || '';
      if (vData.optionId === 'other') {
        optionText = vData.comment ? `Others (${vData.comment})` : 'Others';
      }
      if (!optionText) {
        optionText = vData.optionId === 'other' ? 'Others' : (optionsMap.values().next().value || 'Option');
      }

      return { 
        id: vDoc.id, 
        ...vData,
        userName: user ? user.name : 'Unknown',
        user,
        optionText
      };
    });

    return poll;
  }

  async updateStatus(id: string, isActive: boolean, organizationId: string) {
    await this.findOne(id, organizationId);
    await db.collection('polls').doc(id).update({ isActive, updatedAt: new Date().toISOString() });
    return { success: true };
  }

  async remove(id: string, organizationId: string) {
    await this.findOne(id, organizationId);
    
    // Delete the poll document
    await db.collection('polls').doc(id).delete();
    
    // Delete the options subcollection
    const optionsSnapshot = await db.collection('polls').doc(id).collection('options').get();
    const batch = db.batch();
    optionsSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    // Delete associated votes
    const votesSnapshot = await db.collection('votes').where('pollId', '==', id).get();
    votesSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    return { success: true };
  }
}
