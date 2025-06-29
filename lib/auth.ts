import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'worker';
  farmId: string;
  avatar?: string;
  farmName?: string;
  preferences?: {
    currency: string;
    language: string;
    timezone: string;
    dateFormat: string;
    temperatureUnit: string;
    weightUnit: string;
  };
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  uploadAvatar: (file: File) => Promise<string>;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  farmName: string;
}

// Mock users for demo - each with unique farmId
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@agroinsight.com',
    name: 'John Doe',
    role: 'admin',
    farmId: 'farm-1',
    farmName: 'Green Valley Ranch',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
    preferences: {
      currency: 'USD',
      language: 'English',
      timezone: 'America/Los_Angeles',
      dateFormat: 'MM/DD/YYYY',
      temperatureUnit: 'Celsius',
      weightUnit: 'Kilograms',
    }
  },
  {
    id: '2',
    email: 'manager@farm.com',
    name: 'Sarah Johnson',
    role: 'manager',
    farmId: 'farm-2',
    farmName: 'Sunrise Farms',
    avatar: 'https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg?auto=compress&cs=tinysrgb&w=150',
    preferences: {
      currency: 'EUR',
      language: 'English',
      timezone: 'Europe/London',
      dateFormat: 'DD/MM/YYYY',
      temperatureUnit: 'Celsius',
      weightUnit: 'Kilograms',
    }
  }
];

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      login: async (email: string, password: string) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const user = mockUsers.find(u => u.email === email);
        if (user && (password === 'password' || email === 'admin@agroinsight.com')) {
          set({ user, isAuthenticated: true });
          return true;
        }
        return false;
      },
      register: async (data: RegisterData) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const newUser: User = {
          id: Date.now().toString(),
          email: data.email,
          name: data.name,
          role: 'admin',
          farmId: `farm-${Date.now()}`, // Unique farm ID for each user
          farmName: data.farmName,
          preferences: {
            currency: 'USD',
            language: 'English',
            timezone: 'America/Los_Angeles',
            dateFormat: 'MM/DD/YYYY',
            temperatureUnit: 'Celsius',
            weightUnit: 'Kilograms',
          }
        };
        
        set({ user: newUser, isAuthenticated: true });
        return true;
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...userData } });
        }
      },
      uploadAvatar: async (file: File) => {
        // Simulate file upload
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Create a blob URL for the uploaded file
        const avatarUrl = URL.createObjectURL(file);
        
        const currentUser = get().user;
        if (currentUser) {
          const updatedUser = { ...currentUser, avatar: avatarUrl };
          set({ user: updatedUser });
        }
        
        return avatarUrl;
      },
    }),
    {
      name: 'auth-storage',
      version: 1,
      migrate: (persistedState: any) => {
        return persistedState;
      },
    }
  )
);