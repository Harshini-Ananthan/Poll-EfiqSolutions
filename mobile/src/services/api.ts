import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:8081' : 'http://localhost:8081';
const API_URL = 'http://192.168.1.40:8081';

export const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
