import { create } from 'zustand';
import api from '../lib/axios';

export interface Location {
  type: string;
  coordinates: [number, number];  // [longitude, latitude]
}

export interface User {
  _id?: string;
  name: string;
  email: string;
  role: 'USER' | 'PROVIDER' | 'FARMER';
  skills: string[];
  location: Location;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User> & { password: string }) => Promise<void>;
  farmerregister: (userData: User) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<void>;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),

  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      set({
        user: response.data.user,
        token: response.data.token,
        isAuthenticated: true,
      });
    } catch (error) {
      console.error('Login error:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      set({ user: null, token: null, isAuthenticated: false });
      throw error;
    }
  },

  register: async (userData: Partial<User> & { password: string }) => {
    try {
      const response = await api.post('/auth/register', userData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      set({
        user: response.data.user,
        token: response.data.token,
        isAuthenticated: true,
      });
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  farmerregister: async (userData: User) => {
    try {
      console.log('Sending farmer registration data:', userData);

      const response = await api.post('/auth/farmerregister', userData);

      if (!response.data.token) {
        throw new Error('No token received from server');
      }

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      set({
        user: response.data.user,
        token: response.data.token,
        isAuthenticated: true,
      });
    } catch (error: any) {
      console.error('Farmer registration error:', error.response?.data || error.message);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      set({ user: null, token: null, isAuthenticated: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null, isAuthenticated: false });
  },

  updateUser: async (userData: Partial<User>) => {
    try {
      // Ensure location data is properly formatted
      let locationData = userData.location;
      if (locationData) {
        locationData = {
          type: 'Point',
          coordinates: Array.isArray(locationData.coordinates) 
            ? [Number(locationData.coordinates[0]), Number(locationData.coordinates[1])]
            : [0, 0]
        };
      }

      console.log('Sending update data:', { ...userData, location: locationData });

      const response = await api.patch(`/users/profile`, {
        ...userData,
        location: locationData
      });

      const updatedUser = response.data;
      console.log('Received updated user:', updatedUser);
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      set({ user: updatedUser });
      return updatedUser;
    } catch (error) {
      console.error('User update error:', error);
      throw error;
    }
  },

  loadUser: async () => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (!token || !userStr) {
      set({ user: null, token: null, isAuthenticated: false });
      return;
    }

    try {
      const user = JSON.parse(userStr);
      set({
        user,
        token,
        isAuthenticated: true
      });
    } catch (error) {
      console.error('Error parsing stored user data:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      set({ user: null, token: null, isAuthenticated: false });
    }
  },
}));

export default useAuthStore;
