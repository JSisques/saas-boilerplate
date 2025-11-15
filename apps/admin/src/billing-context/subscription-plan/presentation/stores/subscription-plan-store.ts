import { SubscriptionPlanViewModel } from "@/billing-context/subscription-plan/domain/view-models/subscription-plan.view-model";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SubscriptionPlanStore {
  currentSubscriptionPlan: SubscriptionPlanViewModel | null;
  setCurrentSubscriptionPlan: (
    subscriptionPlan: SubscriptionPlanViewModel | null
  ) => void;
  clearCurrentSubscriptionPlan: () => void;
}

export const useSubscriptionPlanStore = create<SubscriptionPlanStore>()(
  persist(
    (set) => ({
      currentSubscriptionPlan: null,
      setCurrentSubscriptionPlan: (subscriptionPlan) =>
        set({ currentSubscriptionPlan: subscriptionPlan }),
      clearCurrentSubscriptionPlan: () =>
        set({ currentSubscriptionPlan: null }),
    }),
    { name: "subscription-plan-store" }
  )
);
