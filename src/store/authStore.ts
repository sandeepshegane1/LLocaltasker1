import { create } from 'zustand';
import api from '../lib/axios';

export interface Location {
  type: string;
  coordinates: [number, number];
}

export interface Farmers {
  professionalProfile: {
    name: {
      firstName: string;
      lastName?: string;
    };
    contactDetails: {
      phone: {
        primary: string;
      };
      email: string;
    };
  };
  serviceExpertise: {
    primarySpecialization: string;
    supportedCropTypes: string[];
  };
  services: Array<{
    serviceName: string;
    description: string;
    pricingModel: {
      basePrice: number;
      priceUnit: string;
    };
    serviceArea: {
      radius?: number;
      districts: string[];
      states: string[];
    };
    availability: {
      daysAvailable: string[];
      seasonalAvailability: {
        startMonth: string;
        endMonth: string;
      };
    };
  }>;
  resources: {
    machineryOwned: Array<{
      type: string;
      model: string;
      manufacturingYear: number;
      condition: string;
    }>;
    additionalEquipment: string[];
  };
  businessCredentials: {
    registrationType: string;
    businessRegistrationNumber: string;
  };
}

interface AuthState {
  user: Farmers | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<Farmers> & { password: string }) => Promise<void>;
  farmerregister: (userData: Farmers) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<Farmers>) => Promise<void>;
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
        isAuthenticated: true,
      });
    } catch (error) {
      console.error('Login error:', error);
      localStorage.removeItem('token');
      set({ user: null, token: null, isAuthenticated: false });
      throw error;
    }
  },

  register: async (userData: Partial<Farmers> & { password: string }) => {
    try {
      const response = await api.post('/auth/register', userData);
      localStorage.setItem('token', response.data.token);
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

  farmerregister: async (userData: Farmers) => {
    try {
      console.log('Sending farmer registration data:', userData);

      const response = await api.post('/auth/farmerregister', userData);

      if (!response.data.token) {
        throw new Error('No token received from server');
      }

      localStorage.setItem('token', response.data.token);
      set({
        user: response.data.user,
        token: response.data.token,
        isAuthenticated: true,
      });
    } catch (error: any) {
      console.error('Farmer registration error:', error.response?.data || error.message);
      localStorage.removeItem('token');
      set({ user: null, token: null, isAuthenticated: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  updateUser: async (userData: Partial<Farmers>) => {
    try {
      const response = await api.put('/auth/update', userData);
      set({ user: response.data.user });
    } catch (error) {
      console.error('User update error:', error);
      throw error;
    }
  },
}));

export default useAuthStore;


// import { create } from 'zustand';
// import api from '../lib/axios';

// export interface Location {
//   type: string;
//   coordinates: [number, number];
// }

// export interface Farmers {
//   role: "FARMER" | "SERVICE_PROVIDER";
//   professionalProfile: {
//     name: {
//       firstName: string;
//       lastName?: string;
//     };
//     contactDetails: {
//       phone: {
//         primary: string;
//       };
//       email: string;
//     };
//   };
//   serviceExpertise: {
//     primarySpecialization: string;
//     supportedCropTypes: string[];
//   };
//   services: Array<{
//     serviceName: string;
//     description: string;
//     pricingModel: {
//       basePrice: number;
//       priceUnit: string;
//     };
//     serviceArea: {
//       radius?: number;
//       districts: string[];
//       states: string[];
//     };
//     availability: {
//       daysAvailable: string[];
//       seasonalAvailability: {
//         startMonth: string;
//         endMonth: string;
//       };
//     };
//   }>;
//   resources: {
//     machineryOwned: Array<{
//       type: string;
//       model: string;
//       manufacturingYear: number;
//       condition: string;
//     }>;
//     additionalEquipment: string[];
//   };
//   businessCredentials: {
//     registrationType: string;
//     businessRegistrationNumber: string;
//   };
//   location: Location;
// }

// interface AuthState {
//   user: Farmers | null;
//   token: string | null;
//   isAuthenticated: boolean;
//   login: (email: string, password: string) => Promise<void>;
//   register: (userData: Partial<Farmers> & { password: string }) => Promise<void>;
//   farmerregister: (userData: Partial<Farmers> & { password: string }) => Promise<void>;
//   logout: () => void;
//   updateUser: (userData: Partial<Farmers>) => Promise<void>;
// }

// export const useAuthStore = create<AuthState>((set) => ({
//   user: null,
//   token: localStorage.getItem('token'),
//   isAuthenticated: !!localStorage.getItem('token'),

//   login: async (email: string, password: string) => {
//     try {
//       const response = await api.post('/auth/login', { email, password });
//       localStorage.setItem('token', response.data.token);
//       set({
//         user: response.data.user,
//         token: response.data.token,
//         isAuthenticated: true,
//       });
//     } catch (error) {
//       console.error('Login error:', error);
//       localStorage.removeItem('token');
//       set({ user: null, token: null, isAuthenticated: false });
//       throw error;
//     }
//   },

//   register: async (userData: Partial<Farmers> & { password: string }) => {
//     try {
//       const response = await api.post('/auth/register', userData);
//       localStorage.setItem('token', response.data.token);
//       set({
//         user: response.data.user,
//         token: response.data.token,
//         isAuthenticated: true,
//       });
//     } catch (error) {
//       console.error('Registration error:', error);
//       throw error;
//     }
//   },

//   farmerregister: async (userData: Partial<Farmers> & { password: string }) => {
//     try {
//       console.log('Sending farmer registration data:', userData);

//       // Ensure the role is set to "FARMER"
//       const farmerData = { ...userData, role: "FARMER" as const };

//       const response = await api.post('/auth/farmerregister', farmerData);

//       if (!response.data.token) {
//         throw new Error('No token received from server');
//       }

//       localStorage.setItem('token', response.data.token);
//       set({
//         user: response.data.user,
//         token: response.data.token,
//         isAuthenticated: true,
//       });
//     } catch (error: any) {
//       console.error('Farmer registration error:', error.response?.data || error.message);
//       localStorage.removeItem('token');
//       set({ user: null, token: null, isAuthenticated: false });
//       throw error;
//     }
//   },

//   logout: () => {
//     localStorage.removeItem('token');
//     set({ user: null, token: null, isAuthenticated: false });
//   },

//   updateUser: async (userData: Partial<Farmers>) => {
//     try {
//       const response = await api.put('/auth/update', userData);
//       set({ user: response.data.user });
//     } catch (error) {
//       console.error('User update error:', error);
//       throw error;
//     }
//   },
// }));

// export default useAuthStore;

