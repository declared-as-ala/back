// store/themeStore.ts
import { create } from "zustand";

type ThemeState = {
  mode: "light" | "dark";
  toggleTheme: () => void;
};

export const useThemeStore = create<ThemeState>((set, get) => ({
  mode: "light",
  toggleTheme: () => {
    set({ mode: get().mode === "light" ? "dark" : "light" });
  },
}));
