import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface HealthPageStore {
  lastChecked: Date | undefined;
  setLastChecked: (lastChecked: Date | undefined) => void;
}

export const useHealthPageStore = create<HealthPageStore>()(
  persist(
    (set) => ({
      lastChecked: undefined,
      setLastChecked: (lastChecked) => set({ lastChecked }),
    }),
    { name: 'health-page-store' },
  ),
);
