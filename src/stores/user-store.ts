import { create } from "zustand";
import { getLevelForXP } from "@/lib/xp";

interface UserState {
  userId: string | null;
  name: string;
  role: "learner" | "mentor";
  totalXP: number;
  currentStreak: number;
  longestStreak: number;
  language: "en" | "ar";

  // Derived
  currentLevel: ReturnType<typeof getLevelForXP>;

  // Actions
  setUser: (user: Partial<UserState>) => void;
  addXP: (amount: number) => void;
  setLanguage: (lang: "en" | "ar") => void;
  reset: () => void;
}

const initialState = {
  userId: null,
  name: "",
  role: "learner" as const,
  totalXP: 0,
  currentStreak: 0,
  longestStreak: 0,
  language: "en" as const,
  currentLevel: getLevelForXP(0),
};

export const useUserStore = create<UserState>((set) => ({
  ...initialState,

  setUser: (user) =>
    set((state) => {
      const newState = { ...state, ...user };
      return {
        ...newState,
        currentLevel: getLevelForXP(newState.totalXP),
      };
    }),

  addXP: (amount) =>
    set((state) => {
      const newXP = state.totalXP + amount;
      return {
        totalXP: newXP,
        currentLevel: getLevelForXP(newXP),
      };
    }),

  setLanguage: (lang) => set({ language: lang }),

  reset: () => set(initialState),
}));
