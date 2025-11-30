import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthPageStore {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
}

export const useAuthPageStore = create<AuthPageStore>()(
  persist(
    (set) => ({
      email: '',
      setEmail: (email) => set({ email }),
      password: '',
      setPassword: (password) => set({ password }),
    }),
    { name: 'auth-page-store' },
  ),
);
