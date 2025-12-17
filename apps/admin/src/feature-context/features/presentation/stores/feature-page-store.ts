import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FeaturePageStore {
  isAddModalOpen: boolean;
  setIsAddModalOpen: (isAddModalOpen: boolean) => void;
}

export const useFeaturePageStore = create<FeaturePageStore>()(
  persist(
    (set) => ({
      isAddModalOpen: false,
      setIsAddModalOpen: (isAddModalOpen) => set({ isAddModalOpen }),
    }),
    { name: 'feature-page-store' },
  ),
);
