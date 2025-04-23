import { StateCreator } from "zustand";

export interface AuthSlice {
  token: string | null;
  user: any | null;
  setToken: (token: string | null) => void;
  setUser: (user: any | null) => void;
  logout: () => void;
}

// createAuthSlice wires up your auth state
export const createAuthSlice: StateCreator<AuthSlice> = (set, get) => ({
  token: null,
  user: null,
  setToken: (token) => set({ token }),
  setUser: (user) => set({ user }),
  logout: () => set({ token: null, user: null }),
});
