import { Injectable } from '@nestjs/common';
import { db } from '../config/firebase';

@Injectable()
export class SuperadminService {
  async getDashboardStats(organizationId: string) {
    const stats = {
      totalCustomers: 0,
      votedToday: 0,
      notVotedToday: 0,
      monthMealsServed: 0,
      latestPoll: null as any,
    };

    try {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      // Fetch each metric with individual try-catch to prevent total failure
      try {
        const totalUsersSnap = await db.collection('users').where('organizationId', '==', organizationId).get();
        stats.totalCustomers = totalUsersSnap.size;
      } catch (e) {
        console.error('Failed to fetch total users:', e.message);
      }

      try {
        const votedTodaySnap = await db.collection('votes')
          .where('organizationId', '==', organizationId)
          .where('createdAt', '>=', startOfDay.toISOString())
          .get();
        stats.votedToday = votedTodaySnap.size;
      } catch (e) {
        console.warn('Failed to fetch today votes (index probably missing):', e.message);
      }

      try {
        const monthVotesSnap = await db.collection('votes')
          .where('organizationId', '==', organizationId)
          .where('createdAt', '>=', startOfMonth.toISOString())
          .get();
        stats.monthMealsServed = monthVotesSnap.size;
      } catch (e) {
        console.warn('Failed to fetch month votes (index probably missing):', e.message);
      }

      try {
        const latestPollSnap = await db.collection('polls')
          .where('organizationId', '==', organizationId)
          .where('isActive', '==', true)
          .orderBy('createdAt', 'desc')
          .limit(1)
          .get();

        if (!latestPollSnap.empty) {
          const latestPollDoc = latestPollSnap.docs[0];
          const pollData = latestPollDoc.data() as any;
          
          // Options are in a subcollection
          const optionsSnap = await latestPollDoc.ref.collection('options').get();
          const options = [];
          
          for (const optDoc of optionsSnap.docs) {
            const optData = optDoc.data() as any;
            const optVotesSnap = await db.collection('votes')
              .where('optionId', '==', optDoc.id)
              .get();
            
            options.push({
              text: optData.optionText,
              count: optVotesSnap.size,
              type: optData.type
            });
          }

          stats.latestPoll = {
            id: latestPollDoc.id,
            question: pollData.question,
            scheduledAt: pollData.scheduledAt,
            options
          };
        }
      } catch (e) {
        console.warn('Failed to fetch latest poll (index probably missing):', e.message);
      }

      stats.notVotedToday = Math.max(0, stats.totalCustomers - stats.votedToday);
      return stats;
    } catch (error) {
      console.error('Fatal error in getDashboardStats:', error);
      // Return empty stats instead of throwing to prevent 500
      return stats;
    }
  }

  async getOrganizationUsers(organizationId: string) {
    try {
      const snapshot = await db.collection('users')
        .where('organizationId', '==', organizationId)
        .orderBy('name', 'asc')
        .get();

      return snapshot.docs.map(doc => {
        const data = doc.data() as any;
        return {
          id: doc.id,
          name: data.name,
          email: data.email,
          role: data.role,
          status: data.status,
          mobileNo: data.mobileNo,
          department: data.department,
          createdAt: data.createdAt,
        };
      });
    } catch (e) {
      console.error('Failed to fetch organization users:', e.message);
      return [];
    }
  }
}
