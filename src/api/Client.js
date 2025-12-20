


import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config';

const client = axios.create({
  baseURL: API_BASE_URL, // MUST be PC IP, not localhost
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});
client.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');

  console.log('🧪 REQUEST URL:', config.url);
  console.log('🧪 TOKEN FROM STORAGE:', token);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('🧪 AUTH HEADER SET:', config.headers.Authorization);
  } else {
    console.log('🧪 NO TOKEN FOUND');
  }

  return config;
});


export default client;
