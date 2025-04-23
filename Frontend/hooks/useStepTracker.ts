// hooks/useStepTracker.ts
import { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import { Pedometer } from "expo-sensors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import debounce from "lodash.debounce";
import { useAppStore } from "@/store";
import { API_BASE_URL } from "@/services/api";

const KCAL = 0.04;
const POLL_MS = 3_000; // Android polling interval

export function useStepTracker(): boolean {
  /** Zustand actions & data */
  const userId = useAppStore((s) => s.user?._id);
  const setSteps = useAppStore((s) => s.setStepsToday);
  const setCalories = useAppStore((s) => s.setCaloriesToday);

  const [ready, setReady] = useState(false);

  /** refs */
  const pollId = useRef<NodeJS.Timer>();
  const baseline = useRef(0); // steps @ 00:00
  const sent = useRef(0); // last value pushed to API

  /** debounced network push */
  const push = debounce(async (total: number) => {
    if (!userId || total === sent.current) return;
    try {
      await axios.post(`${API_BASE_URL}/stats`, {
        userId,
        date: new Date().toISOString(),
        steps: total,
        caloriesBurned: total * KCAL,
      });
      sent.current = total;
    } catch {}
  }, 5000);

  /** helper */
  const update = (steps: number) => {
    setSteps(steps);
    setCalories(steps * KCAL);
    AsyncStorage.setItem("@stepsToday", steps.toString()).catch(() => {});
    push(steps);
  };

  useEffect(() => {
    let sub: { remove(): void } | undefined;

    (async () => {
      /* web build: skip everything */
      if (Platform.OS === "web") {
        setReady(true);
        return;
      }

      /* hydrate from cache instantly */
      const cached = await AsyncStorage.getItem("@stepsToday");
      if (cached) update(Number(cached));

      try {
        const { status } = await Pedometer.requestPermissionsAsync();
        if (status !== "granted") {
          setReady(true);
          return;
        }

        /** baseline @ midnight */
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        const { steps } = await Pedometer.getStepCountAsync(start, new Date());
        baseline.current = steps;
        update(steps);

        /** 1️⃣ live subscription (works on iOS / some Android) */
        sub = Pedometer.watchStepCount(({ steps: inc }) => {
          update(baseline.current + inc);
        });

        /** 2️⃣ Android fallback polling */
        if (Platform.OS === "android") {
          pollId.current = setInterval(async () => {
            const { steps: live } = await Pedometer.getStepCountAsync(
              start,
              new Date()
            );
            update(live);
          }, POLL_MS);
        }
      } catch (e) {
        console.error("useStepTracker error:", e);
      } finally {
        setReady(true);
      }
    })();

    return () => {
      sub?.remove?.();
      if (pollId.current) clearInterval(pollId.current);
      push.flush();
    };
  }, [userId]);

  return ready;
}
