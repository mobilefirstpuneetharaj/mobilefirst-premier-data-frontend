import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'react-hot-toast';

// User interface
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'user';
  phone?: string;
  isVerified: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// League interface (added directly here)
interface League {
  _id: string;
  id: string;
  name: string;
  country: string;
  season: string;
  competitionsCount: number;
  status: 'Active' | 'Ongoing' | 'Complete' | 'Draft';
  description?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  // Auth state
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // League state
  leagues: League[];
  currentLeague: League | null;
  isLeagueLoading: boolean;
  leagueError: string | null;

  // Auth actions
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => Promise<{ success: boolean}>;
  logout: () => void;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resendOtp: (email: string) => Promise<void>;
  verifyResetOtp: (email: string, otp: string) => Promise<{ success: boolean}>;
  resetPassword: (email: string, newPassword: string) => Promise<void>;
  clearError: () => void;

  // League actions
  getAllLeagues: () => Promise<void>;
  getLeague: (id: string) => Promise<void>;
  createLeague: (leagueData: Omit<League, '_id' | 'createdBy' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateLeague: (id: string, leagueData: Partial<League>) => Promise<void>;
  deleteLeague: (id: string) => Promise<void>;
  clearLeagueError: () => void;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://mobilefirst-premier-data-backend.onrender.com/api/v1';

// Custom error type for API responses
interface ApiError extends Error {
  message: string;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      leagues: [],
      currentLeague: null,
      isLeagueLoading: false,
      leagueError: null,

      // Auth actions
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || 'Login failed');
          }

          set({
            user: data.data.user,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
          });

          toast.success('Login successful!');
        } catch (err) {
          const error = err as ApiError;
          set({ error: error.message, isLoading: false });
          toast.error(error.message);
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`${API_BASE_URL}/auth/signup`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || 'Registration failed');
          }

          // set({
          //   user: data.data.user,
          //   token: data.token,
          //   isAuthenticated: false, // User needs to verify email
          //   isLoading: false,
          // });

           // Don't set authentication state since we want user to login manually
          set({ isLoading: false });
          
          // toast.success('Registration successful! Please verify your email with the OTP sent.');
          toast.success(data.message || 'Registration successful! You can now login.');

          return { success: true };
          
        } catch (err) {
          const error = err as ApiError;
          set({ error: error.message, isLoading: false });
          toast.error(error.message);
          return { success: false };
        }
      },

      verifyOtp: async (email, otp) => {
        set({ isLoading: true });
        try {
          const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, otp }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || 'OTP verification failed');
          }

          set((state) => ({
            user: state.user ? { ...state.user, isVerified: true } : null,
            isAuthenticated: true,
            isLoading: false,
          }));

          toast.success('Email verified successfully!');
        } catch (err) {
          const error = err as ApiError;
          set({ error: error.message, isLoading: false });
          toast.error(error.message);
        }
      },

      forgotPassword: async (email) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`${API_BASE_URL}/password/forgot-password`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || 'Failed to send OTP');
          }

          set({ isLoading: false });
          toast.success('OTP sent to your email!');
        } catch (err) {
          const error = err as ApiError;
          set({ error: error.message, isLoading: false });
          toast.error(error.message);
        }
      },

      resendOtp: async (email: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`${API_BASE_URL}/auth/resend-otp`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || 'Failed to resend OTP');
          }

          set({ isLoading: false });
          toast.success('New OTP sent to your email!');
        } catch (err) {
          const error = err as ApiError;
          set({ error: error.message, isLoading: false });
          toast.error(error.message);
        }
      },

      // verifyResetOtp action
      verifyResetOtp: async (email, otp) => {
        set({ isLoading: true });
        try {
          const response = await fetch(`${API_BASE_URL}/password/verify-reset-otp`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, otp }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || 'Invalid OTP');
          }

          set({ isLoading: false });
          toast.success('OTP verified successfully!');
          return { success: true }; // Return success status
        } catch (err) {
          const error = err as ApiError;
          set({ error: error.message, isLoading: false });
          toast.error(error.message);
          return { success: false, error: error.message }; // Return failure status
        }
      },

      resetPassword: async (email, newPassword) => {
        set({ isLoading: true });
        try {
          const response = await fetch(`${API_BASE_URL}/password/reset-password`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password: newPassword }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || 'Password reset failed');
          }

          set({ isLoading: false });
          toast.success('Password reset successfully!');
        } catch (err) {
          const error = err as ApiError;
          set({ error: error.message, isLoading: false });
          toast.error(error.message);
        }
      },

      logout: () => {
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false,
          error: null,
          leagues: [],
          currentLeague: null,
          leagueError: null
        });
        toast.success('Logged out successfully');
      },

      clearError: () => set({ error: null }),

      // League actions
      getAllLeagues: async () => {
        set({ isLeagueLoading: true, leagueError: null });
        try {
          const response = await fetch(`${API_BASE_URL}/leagues`, {
            headers: {
              'Authorization': `Bearer ${get().token}`
            }
          });
          
          if (!response.ok) {
            throw new Error('Failed to fetch leagues');
          }

          const data = await response.json();
          set({ leagues: data.data.leagues || [], isLeagueLoading: false });
        } catch (err) {
          const error = err as ApiError;
          set({ leagueError: error.message, isLeagueLoading: false });
          toast.error(error.message);
        }
      },

      getLeague: async (id: string) => {
        set({ isLeagueLoading: true, leagueError: null });
        try {
          const response = await fetch(`${API_BASE_URL}/leagues/${id}`, {
            headers: {
              'Authorization': `Bearer ${get().token}`
            }
          });
          
          if (!response.ok) {
            throw new Error('Failed to fetch league');
          }

          const data = await response.json();
          set({ currentLeague: data.data.league || null, isLeagueLoading: false });
        } catch (err) {
          const error = err as ApiError;
          set({ leagueError: error.message, isLeagueLoading: false });
          toast.error(error.message);
        }
      },

      createLeague: async (leagueData) => {
        set({ isLeagueLoading: true, leagueError: null });
        try {
          const response = await fetch(`${API_BASE_URL}/leagues`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${get().token}`
            },
            body: JSON.stringify(leagueData)
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to create league');
          }

          const data = await response.json();
          set(state => ({
            leagues: [data.data.league, ...state.leagues],
            isLeagueLoading: false
          }));
          toast.success('League created successfully!');
        } catch (err) {
          const error = err as ApiError;
          set({ leagueError: error.message, isLeagueLoading: false });
          toast.error(error.message);
        }
      },

      updateLeague: async (id: string, leagueData: Partial<League>) => {
        set({ isLeagueLoading: true, leagueError: null });
        try {
          const response = await fetch(`${API_BASE_URL}/leagues/${id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${get().token}`
            },
            body: JSON.stringify(leagueData)
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update league');
          }

          const data = await response.json();
          set(state => ({
            leagues: state.leagues.map(league => 
              league._id === id ? data.data.league : league
            ),
            currentLeague: state.currentLeague?._id === id ? data.data.league : state.currentLeague,
            isLeagueLoading: false
          }));
          toast.success('League updated successfully!');
        } catch (err) {
          const error = err as ApiError;
          set({ leagueError: error.message, isLeagueLoading: false });
          toast.error(error.message);
        }
      },

      deleteLeague: async (id: string) => {
        set({ isLeagueLoading: true, leagueError: null });
        try {
          const response = await fetch(`${API_BASE_URL}/leagues/${id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${get().token}`
            }
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to delete league');
          }

          set(state => ({
            leagues: state.leagues.filter(league => league._id !== id),
            currentLeague: state.currentLeague?._id === id ? null : state.currentLeague,
            isLeagueLoading: false
          }));
          toast.success('League deleted successfully!');
        } catch (err) {
          const error = err as ApiError;
          set({ leagueError: error.message, isLeagueLoading: false });
          toast.error(error.message);
        }
      },

      clearLeagueError: () => set({ leagueError: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);