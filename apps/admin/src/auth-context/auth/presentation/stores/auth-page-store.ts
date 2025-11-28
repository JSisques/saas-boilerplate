import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthPageStore {
  isLogin: boolean;
  setIsLogin: (isLogin: boolean) => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (confirmPassword: string) => void;
}

export const useAuthPageStore = create<AuthPageStore>()(
  persist(
    (set) => ({
      isLogin: true,
      setIsLogin: (isLogin) => set({ isLogin }),
      email: '',
      setEmail: (email) => set({ email }),
      password: '',
      setPassword: (password) => set({ password }),
      confirmPassword: '',
      setConfirmPassword: (confirmPassword) => set({ confirmPassword }),
    }),
    { name: 'auth-page-store' },
  ),
);
