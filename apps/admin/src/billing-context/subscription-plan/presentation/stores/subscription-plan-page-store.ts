import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SubscriptionPlanPageStore {
  isAddModalOpen: boolean;
  setIsAddModalOpen: (isAddModalOpen: boolean) => void;
}

export const useSubscriptionPlanPageStore = create<SubscriptionPlanPageStore>()(
  persist(
    (set) => ({
      isAddModalOpen: false,
      setIsAddModalOpen: (isAddModalOpen) => set({ isAddModalOpen }),
    }),
    { name: "subscription-plan-page-store" }
  )
);
