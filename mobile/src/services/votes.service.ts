import { api } from './api';

export const VotesService = {
  async submitVote(pollId: string, optionId: string, comment?: string) {
    const response = await api.post('/votes', { pollId, optionId, comment });
    return response.data;
  },
  
  async getMyVotes() {
    const response = await api.get('/votes/me');
    return response.data;
  }
};
