// store/statsSlice.ts
import { StateCreator } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface StatsSlice {
  /**  live  */
  stepsToday: number;
  caloriesToday: number;
  /**  last 7 days from API  */
  weeklyStats: DailyStat[];
  /**  actions  */
  setStepsToday(v: number): void;
  setCaloriesToday(v: number): void;
  setWeeklyStats(list: DailyStat[]): void;
}

export const createStatsSlice: StateCreator<StatsSlice> = (set) => ({
  stepsToday: 0,
  caloriesToday: 0,
  weeklyStats: [],

  setStepsToday: (v) => {
    set({ stepsToday: v, caloriesToday: v * 0.04 });
    AsyncStorage.setItem("@stepsToday", String(v)).catch(() => {});
  },
  setCaloriesToday: (kcal) => set({ caloriesToday: kcal }),
  setWeeklyStats: (list) => set({ weeklyStats: list }),
});
