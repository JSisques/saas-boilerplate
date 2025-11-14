import { UserViewModel } from "@/user-context/users/domain/view-models/user.view-model";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserStore {
  currentUser: UserViewModel | null;
  setCurrentUser: (user: UserViewModel | null) => void;
  clearCurrentUser: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      currentUser: null,
      setCurrentUser: (user) => set({ currentUser: user }),
      clearCurrentUser: () => set({ currentUser: null }),
    }),
    { name: "user-store" }
  )
);
