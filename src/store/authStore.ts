import { create } from 'zustand';
import { AuthState, User } from '../types';
import { authAPI } from '../api';

interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
}

const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authAPI.login({ email, password });
      const user = response.data.data;
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },
  
  register: async (username, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authAPI.register({ username, email, password });
      const user = response.data.data;
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },
  
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
}));

export default useAuthStore