import axios from 'axios';
import { toast } from 'react-hot-toast';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
  timeout: 10000, // 10 second timeout
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    let errorMessage = 'An error occurred. Please try again.';
    
    if (error.response) {
      // Server responded with error
      errorMessage = error.response.data.error || errorMessage;
    } else if (error.request) {
      // No response received
      errorMessage = 'Unable to connect to server. Please check your connection.';
    }
    
    toast.error(errorMessage);
    throw error;
  }
);

export default api;