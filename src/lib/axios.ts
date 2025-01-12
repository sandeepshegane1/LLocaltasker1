import axios from 'axios';
import { toast } from 'react-hot-toast';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
  timeout: 10000, // 10 second timeout
});

// Keep track of displayed error messages to prevent duplicates
let lastErrorMessage = '';
let lastErrorTime = 0;
const ERROR_COOLDOWN = 2000; // 2 seconds cooldown between same error messages

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

    // Prevent duplicate error messages in quick succession
    const now = Date.now();
    if (errorMessage !== lastErrorMessage || now - lastErrorTime > ERROR_COOLDOWN) {
      lastErrorMessage = errorMessage;
      lastErrorTime = now;
     // toast.error(errorMessage);
    }
    
    throw error;
  }
);

export default api;