import { BASE_URL } from './constants';
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 6000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);
export default axiosInstance;
