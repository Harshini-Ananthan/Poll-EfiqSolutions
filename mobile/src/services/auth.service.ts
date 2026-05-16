import { api } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthService = {
  async login(phoneNumber: string) {
    const response = await api.post('/auth/mobile-login', { phoneNumber });
    const { access_token, user } = response.data;
    await AsyncStorage.setItem('token', access_token);
    await AsyncStorage.setItem('user', JSON.stringify(user));
    return user;
  },

  async logout() {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
  },

  async getUser() {
    const userStr = await AsyncStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  async getToken() {
    return await AsyncStorage.getItem('token');
  }
};
