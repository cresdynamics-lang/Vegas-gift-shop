import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  // Initialize from localStorage if available
  const storedToken = localStorage.getItem('admin_token');
  const storedUser = localStorage.getItem('admin_user');
  
  let initialUser = null;
  if (storedUser) {
    try {
      initialUser = JSON.parse(storedUser);
    } catch (e) {
      console.error('Failed to parse stored user');
    }
  }

  return {
    user: initialUser,
    token: storedToken,
    isAuthenticated: !!storedToken,
    login: (user, token) => {
      localStorage.setItem('admin_token', token);
      localStorage.setItem('admin_user', JSON.stringify(user));
      set({ user, token, isAuthenticated: true });
    },
    logout: () => {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      set({ user: null, token: null, isAuthenticated: false });
    },
  };
});
