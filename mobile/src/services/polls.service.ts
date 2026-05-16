import { api } from './api';

export const PollsService = {
  async getMobilePolls() {
    const response = await api.get('/polls/mobile');
    return response.data;
  }
};
