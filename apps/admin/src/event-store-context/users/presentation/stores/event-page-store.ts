import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface EventPageStore {
  isReplayModalOpen: boolean;
  setIsReplayModalOpen: (isReplayModalOpen: boolean) => void;
}

export const useEventPageStore = create<EventPageStore>()(
  persist(
    (set) => ({
      isReplayModalOpen: false,
      setIsReplayModalOpen: (isReplayModalOpen) => set({ isReplayModalOpen }),
    }),
    { name: 'event-page-store' },
  ),
);
