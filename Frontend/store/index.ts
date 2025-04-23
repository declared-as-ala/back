// store.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { createAuthSlice, AuthSlice } from "./authSlice";
import { createStatsSlice, StatsSlice } from "./statsSlice";

export type ThemeMode = "light" | "dark";
interface ThemeSlice {
  theme: ThemeMode;
  toggleTheme: () => void;
}

// Combine AuthSlice, StatsSlice, and ThemeSlice
export const useAppStore = create<AuthSlice & StatsSlice & ThemeSlice>()(
  persist(
    (set, get, store) => ({
      // Auth slice (needs store too)
      ...createAuthSlice(set, get, store),

      // Stats slice (also needs store)
      ...createStatsSlice(set, get, store),

      // Theme slice
      theme: "light",
      toggleTheme: () =>
        set({ theme: get().theme === "light" ? "dark" : "light" }),
    }),
    {
      name: "myHealthApp-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
