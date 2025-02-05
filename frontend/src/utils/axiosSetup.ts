import axios from 'axios';
import { notifications } from '@mantine/notifications';


const baseURL = 'https://true-bacons-assignment.onrender.com/';

export const axiosInstance = axios.create({
  baseURL,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 403) {
      notifications.show({
        title: 'Unauthorized or session expired',
        message: 'Please login to continue',
      });
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);
