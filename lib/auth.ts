
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase, type Profile } from './supabase';
import toast from 'react-hot-toast';

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
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (user: Partial<User>) => Promise<void>;
  uploadAvatar: (file: File) => Promise<string>;
  initializeAuth: () => Promise<void>;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  farmName: string;
}

const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true' || !process.env.NEXT_PUBLIC_SUPABASE_URL;

const transformProfile = (profile: Profile): User => ({
  id: profile.id,
  email: profile.email,
  name: profile.name,
  role: profile.role,
  farmId: profile.farm_id,
  avatar: profile.avatar_url || undefined,
  farmName: profile.farm_name || undefined,
  preferences: profile.preferences || {
    currency: 'USD',
    language: 'English',
    timezone: 'America/Los_Angeles',
    dateFormat: 'MM/DD/YYYY',
    temperatureUnit: 'Celsius',
    weightUnit: 'Kilograms',
  }
});

const createDemoUser = (email: string, name: string, farmName?: string): User => ({
  id: 'demo-user-' + Math.random().toString(36).substr(2, 9),
  email,
  name,
  role: 'admin' as const,
  farmId: 'demo-farm-' + Math.random().toString(36).substr(2, 9),
  avatar: undefined,
  farmName: farmName || 'Demo Farm',
  preferences: {
    currency: 'USD',
    language: 'English',
    timezone: 'America/Los_Angeles',
    dateFormat: 'MM/DD/YYYY',
    temperatureUnit: 'Celsius',
    weightUnit: 'Kilograms',
  }
});

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      loading: true,

      initializeAuth: async () => {
        try {
          if (isDemoMode) {
            // In demo mode, start with no user
            set({ user: null, isAuthenticated: false, loading: false });
            return;
          }

          const { data: { session } } = await supabase.auth.getSession();
          
          if (session?.user) {
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (error) throw error;

            if (profile) {
              const user = transformProfile(profile);
              set({ user, isAuthenticated: true, loading: false });
            }
          } else {
            set({ user: null, isAuthenticated: false, loading: false });
          }
        } catch (error) {
          console.error('Error initializing auth:', error);
          set({ user: null, isAuthenticated: false, loading: false });
        }
      },

      login: async (email: string, password: string) => {
        try {
          set({ loading: true });
          
          if (isDemoMode) {
            // Demo mode login - simulate successful authentication
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
            
            const demoUser = createDemoUser(email, 'Demo User');
            set({ user: demoUser, isAuthenticated: true, loading: false });
            toast.success('Welcome to demo mode!');
            return true;
          }
          
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) throw error;

          if (data.user) {
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', data.user.id)
              .single();

            if (profileError) throw profileError;

            if (profile) {
              const user = transformProfile(profile);
              set({ user, isAuthenticated: true, loading: false });
              toast.success('Welcome back!');
              return true;
            }
          }
          
          set({ loading: false });
          return false;
        } catch (error: any) {
          console.error('Login error:', error);
          toast.error(error.message || 'Failed to login');
          set({ loading: false });
          return false;
        }
      },

      register: async (data: RegisterData) => {
        try {
          set({ loading: true });
          
          if (isDemoMode) {
            // Demo mode registration - simulate successful account creation
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
            
            const demoUser = createDemoUser(data.email, data.name, data.farmName);
            set({ user: demoUser, isAuthenticated: true, loading: false });
            toast.success('Demo account created successfully!');
            return true;
          }
          
          const { data: authData, error } = await supabase.auth.signUp({
            email: data.email,
            password: data.password,
            options: {
              data: {
                name: data.name,
                farm_name: data.farmName,
              }
            }
          });

          if (error) throw error;

          if (authData.user) {
            // Profile will be created automatically by the trigger
            // Check if profile exists and update farm name
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', authData.user.id)
              .single();

            if (profile) {
              // Update the profile with farm name
              const { error: updateError } = await supabase
                .from('profiles')
                .update({ 
                  name: data.name,
                  farm_name: data.farmName,
                  role: 'admin'
                })
                .eq('id', authData.user.id);

              if (updateError) throw updateError;

              const user = transformProfile({
                ...profile,
                name: data.name,
                farm_name: data.farmName,
                role: 'admin'
              });
              
              set({ user, isAuthenticated: true, loading: false });
              toast.success('Account created successfully!');
              return true;
            }
          }
          
          set({ loading: false });
          toast.success('Please check your email to verify your account');
          return true;
        } catch (error: any) {
          console.error('Registration error:', error);
          toast.error(error.message || 'Failed to create account');
          set({ loading: false });
          return false;
        }
      },

      logout: async () => {
        try {
          const { error } = await supabase.auth.signOut();
          if (error) throw error;
          
          set({ user: null, isAuthenticated: false });
          toast.success('Logged out successfully');
        } catch (error: any) {
          console.error('Logout error:', error);
          toast.error('Failed to logout');
        }
      },

      updateUser: async (userData: Partial<User>) => {
        try {
          const currentUser = get().user;
          if (!currentUser) return;

          const updateData: any = {};
          
          if (userData.name) updateData.name = userData.name;
          if (userData.farmName) updateData.farm_name = userData.farmName;
          if (userData.avatar) updateData.avatar_url = userData.avatar;
          if (userData.preferences) updateData.preferences = userData.preferences;

          const { data, error } = await supabase
            .from('profiles')
            .update(updateData)
            .eq('id', currentUser.id)
            .select()
            .single();

          if (error) throw error;

          const updatedUser = transformProfile(data);
          set({ user: updatedUser });
          toast.success('Profile updated successfully');
        } catch (error: any) {
          console.error('Update user error:', error);
          toast.error('Failed to update profile');
        }
      },

      uploadAvatar: async (file: File) => {
        try {
          const currentUser = get().user;
          if (!currentUser) throw new Error('No authenticated user');

          const fileExt = file.name.split('.').pop();
          const fileName = `${currentUser.id}-${Math.random()}.${fileExt}`;
          const filePath = `avatars/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, file, { upsert: true });

          if (uploadError) throw uploadError;

          const { data } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath);

          const avatarUrl = data.publicUrl;

          // Update profile with new avatar URL
          await get().updateUser({ avatar: avatarUrl });

          return avatarUrl;
        } catch (error: any) {
          console.error('Avatar upload error:', error);
          toast.error('Failed to upload avatar');
          throw error;
        }
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

// Listen to auth changes
supabase.auth.onAuthStateChange(async (event, session) => {
  const { initializeAuth } = useAuth.getState();
  
  if (event === 'SIGNED_IN' && session) {
    await initializeAuth();
  } else if (event === 'SIGNED_OUT') {
    useAuth.setState({ user: null, isAuthenticated: false });
  }
});
