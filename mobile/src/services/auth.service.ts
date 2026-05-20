import { api } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const toBranding = (org: any) => ({
  companyName: org.name || org.companyName || '',
  shortName: org.shortName || '',
  logoBase64: org.logoBase64 || null,
  brandColor: org.brandColor || '#F97316',
  darkMode: org.darkMode || false,
  compactMode: org.compactMode || false,
});

export const AuthService = {
  async login(phoneNumber: string) {
    const response = await api.post('/auth/mobile-login', { phoneNumber });
    const { access_token, user, organization } = response.data;
    await AsyncStorage.setItem('token', access_token);
    await AsyncStorage.setItem('user', JSON.stringify(user));
    const branding = organization ? toBranding(organization) : null;
    if (branding) {
      await AsyncStorage.setItem('organization', JSON.stringify(branding));
    }
    return { user, organization: branding };
  },

  async logout() {
    await AsyncStorage.multiRemove(['token', 'user', 'organization']);
  },

  async getUser() {
    const userStr = await AsyncStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  async saveUser(user: any) {
    await AsyncStorage.setItem('user', JSON.stringify(user));
  },

  async fetchCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  async getOrganization() {
    const orgStr = await AsyncStorage.getItem('organization');
    return orgStr ? JSON.parse(orgStr) : null;
  },

  async getToken() {
    return await AsyncStorage.getItem('token');
  },

  async fetchOrganizationBranding() {
    const response = await api.get('/organizations/profile');
    const branding = toBranding(response.data);
    await AsyncStorage.setItem('organization', JSON.stringify(branding));
    return branding;
  },
};
