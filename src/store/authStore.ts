import { create } from 'zustand';
import api from '../lib/axios';

interface Location {
  type: string;
  coordinates: [number, number];
}

interface User {
  _id: string;
  email: string;
  name: string;
  role: 'CLIENT' | 'PROVIDER';
  skills: string[];
  location: Location;
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User>) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      set({ 
        user: response.data.user,
        token: response.data.token,
        isAuthenticated: true 
      });
    } catch (error) {
      localStorage.removeItem('token');
      set({ user: null, token: null, isAuthenticated: false });
      throw error;
    }
  },
  
  register: async (userData) => {
    try {
      const formattedUserData = {
        ...userData,
        location: userData.location || {
          type: 'Point',
          coordinates: [0, 0]
        },
        skills: userData.skills || []
      };
      
      console.log("Sending registration data:", formattedUserData);
      
      const response = await api.post('/auth/register', formattedUserData);
      
      if (!response.data.token) {
        throw new Error('No token received from server');
      }
      
      localStorage.setItem('token', response.data.token);
      set({ 
        user: response.data.user,
        token: response.data.token,
        isAuthenticated: true 
      });
    } catch (error: any) {
      console.error("Registration error:", error.response?.data || error.message);
      localStorage.removeItem('token');
      set({ user: null, token: null, isAuthenticated: false });
      throw error;
    }
  },
  
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  updateUser: (userData) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...userData } : null
    }));
  }
}));

