// services/pedometer.ts

import { Pedometer } from "expo-sensors";

// Check if pedometer is available
export async function isPedometerAvailable(): Promise<boolean> {
  return await Pedometer.isAvailableAsync();
}

// Get today's step count from midnight -> now
export async function getTodaySteps(): Promise<number> {
  const start = new Date();
  start.setHours(0, 0, 0, 0); // midnight
  const end = new Date();

  const result = await Pedometer.getStepCountAsync(start, end);
  return result.steps;
}

// Watch steps in real-time
export function watchSteps(callback: (steps: number) => void) {
  // steps => steps counted since we started watching
  return Pedometer.watchStepCount(({ steps }) => {
    callback(steps);
  });
}
