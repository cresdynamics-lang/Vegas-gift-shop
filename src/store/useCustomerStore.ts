import { create } from 'zustand';

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface CustomerState {
  user: CustomerUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: CustomerUser, token: string) => void;
  logout: () => void;
  updateUser: (user: CustomerUser) => void;
}

const storedToken = localStorage.getItem('customer_token');
const storedUser = localStorage.getItem('customer_user');

let initialUser: CustomerUser | null = null;
if (storedUser) {
  try {
    initialUser = JSON.parse(storedUser);
  } catch {
    localStorage.removeItem('customer_user');
  }
}

export const useCustomerStore = create<CustomerState>((set) => ({
  user: initialUser,
  token: storedToken,
  isAuthenticated: !!storedToken,
  login: (user, token) => {
    localStorage.setItem('customer_token', token);
    localStorage.setItem('customer_user', JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('customer_token');
    localStorage.removeItem('customer_user');
    set({ user: null, token: null, isAuthenticated: false });
  },
  updateUser: (user) => {
    localStorage.setItem('customer_user', JSON.stringify(user));
    set({ user });
  },
}));
