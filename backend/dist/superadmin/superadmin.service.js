"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuperadminService = void 0;
const common_1 = require("@nestjs/common");
const firebase_1 = require("../config/firebase");
let SuperadminService = class SuperadminService {
    async getDashboardStats(organizationId) {
        try {
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);
            const startOfMonth = new Date();
            startOfMonth.setDate(1);
            startOfMonth.setHours(0, 0, 0, 0);
            const [totalUsersSnap, votedTodaySnap, monthVotesSnap, latestPollSnap] = await Promise.all([
                firebase_1.db.collection('users').where('organizationId', '==', organizationId).get(),
                firebase_1.db.collection('votes')
                    .where('organizationId', '==', organizationId)
                    .where('createdAt', '>=', startOfDay.toISOString())
                    .get(),
                firebase_1.db.collection('votes')
                    .where('organizationId', '==', organizationId)
                    .where('createdAt', '>=', startOfMonth.toISOString())
                    .get(),
                firebase_1.db.collection('polls')
                    .where('organizationId', '==', organizationId)
                    .where('isActive', '==', true)
                    .orderBy('createdAt', 'desc')
                    .limit(1)
                    .get(),
            ]);
            const totalUsers = totalUsersSnap.size;
            const votedToday = votedTodaySnap.size;
            const monthVotes = monthVotesSnap.size;
            const latestPollDoc = latestPollSnap.empty ? null : latestPollSnap.docs[0];
            let latestPoll = null;
            if (latestPollDoc) {
                const pollData = latestPollDoc.data();
                const optionsSnap = await latestPollDoc.ref.collection('options').get();
                const options = [];
                for (const optDoc of optionsSnap.docs) {
                    const optData = optDoc.data();
                    const optVotesSnap = await firebase_1.db.collection('votes')
                        .where('optionId', '==', optDoc.id)
                        .get();
                    options.push({
                        text: optData.optionText,
                        count: optVotesSnap.size,
                        type: optData.type
                    });
                }
                latestPoll = {
                    id: latestPollDoc.id,
                    question: pollData.question,
                    scheduledAt: pollData.scheduledAt,
                    options
                };
            }
            return {
                totalCustomers: totalUsers,
                votedToday,
                notVotedToday: totalUsers - votedToday,
                monthMealsServed: monthVotes,
                latestPoll
            };
        }
        catch (error) {
            console.error('Error fetching dashboard stats:', error);
            throw error;
        }
    }
    async getOrganizationUsers(organizationId) {
        const snapshot = await firebase_1.db.collection('users')
            .where('organizationId', '==', organizationId)
            .orderBy('name', 'asc')
            .get();
        return snapshot.docs.map(doc => {
            const data = doc.data();
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
    }
};
exports.SuperadminService = SuperadminService;
exports.SuperadminService = SuperadminService = __decorate([
    (0, common_1.Injectable)()
], SuperadminService);
//# sourceMappingURL=superadmin.service.js.map