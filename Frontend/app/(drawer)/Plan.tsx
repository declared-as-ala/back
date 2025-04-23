/* eslint-disable react-native/no-inline-styles */
import React, { useCallback, useEffect, useState } from "react";
import {
  ScrollView,
  RefreshControl,
  StyleSheet,
  View,
  Alert,
  Pressable,
} from "react-native";
import {
  Text,
  Button,
  ActivityIndicator,
  Chip,
  useTheme,
} from "react-native-paper";
import axios from "axios";
import * as Calendar from "expo-calendar";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";

import { useAppStore } from "@/store";
import PlanForm, { FormState } from "@/components/PlanForm";
import DayModal from "@/components/DayModal";
import AccordionCard from "@/components/AccordionCard";
import { ExerciseDetail } from "@/app/types";

/* -------------------- CONFIG -------------------- */
const API_BACK = "https://sour-trains-swim.loca.lt/api";
const PY_BACK = "http://localhost:8000/api";

/* -------------------- TYPES --------------------- */
interface PlanResponse {
  weekly_plan: Record<string, ExerciseDetail[]>;
  equipment: string[];
  recommendation: string;
  diet?: string;
  createdAt?: string;
}

/* -----------------  UTIL  ----------------- */
const WEEK_ORDER = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const todayLong = new Date().toLocaleDateString("en-US", { weekday: "long" });

/* ==================== SCREEN ==================== */
export default function GeneratePlanScreen() {
  const theme = useTheme();
  const { user } = useAppStore();

  /* ---------- local state ---------- */
  const [plan, setPlan] = useState<PlanResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefresh] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [modalDay, setModalDay] = useState<string | null>(null);

  /* ----------- form state ---------- */
  const [form, setForm] = useState<FormState>({
    sex: user.gender || "Male",
    age: String(user.age ?? ""),
    height: String(user.height ?? ""),
    weight: String(user.weight ?? ""),
    bmi: "",
    level: "beginner",
    goal: "endurance",
    days: "7",
    hypertension: "No",
    diabetes: "No",
  });
  const change = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  /* ============ LOAD PLAN ============ */
  const loadPlan = useCallback(async () => {
    if (!user?._id) return;
    setError("");
    setLoading(!refreshing);

    try {
      const { data } = await axios.get<PlanResponse>(
        `${API_BACK}/plan/user/${user._id}`
      );
      setPlan(data);
      setShowForm(false);

      /* gentle reminder every 4 weeks */
      if (Date.now() - new Date(data.createdAt!).getTime() > 28 * 864e5) {
        Alert.alert("🕒 It's been 4 weeks!", "Consider generating a new plan.");
      }
    } catch (err: any) {
      if (err?.response?.status === 404) setShowForm(true);
      else {
        setError("Failed to load plan.");
        console.error(err);
      }
    } finally {
      setLoading(false);
      setRefresh(false);
    }
  }, [user?._id, refreshing]);

  useEffect(() => {
    loadPlan();
  }, [loadPlan]);

  /* ============ GENERATE ============ */
  const generatePlan = async () => {
    if (!user?._id) return;
    setLoading(true);
    setError("");

    try {
      const profile = {
        ...form,
        age: Number(form.age),
        height: Number(form.height),
        weight: Number(form.weight),
        bmi: Number(form.bmi),
        days_per_week: Number(form.days),
        target_weight: Number(form.weight) - 10,
        userId: user._id,
      };

      const { data } = await axios.post<PlanResponse>(
        `${PY_BACK}/plan/generate`,
        profile
      );

      setPlan(data);
      setShowForm(false);
      await axios.post(`${API_BACK}/plan/save`, { userId: user._id, ...data });
      await syncToCalendar(data.weekly_plan);

      Alert.alert("✅ Success", "Plan saved & synced to calendar!");
    } catch (err) {
      setError("Unable to generate plan.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* -------- calendar helper -------- */
  const syncToCalendar = async (wp: Record<string, ExerciseDetail[]>) => {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status !== "granted") return;
    const cal = (await Calendar.getCalendarsAsync()).find(
      (c) => c.allowsModifications
    );
    if (!cal) return;

    const base = new Date();
    WEEK_ORDER.forEach((day, idx) => {
      const exs = wp[day];
      if (!exs?.length) return;
      Calendar.createEventAsync(cal.id, {
        title: `Workout • ${day}`,
        notes: exs.map((e) => `${e.exercise} – ${e.sets}×${e.reps}`).join("\n"),
        startDate: new Date(
          base.getFullYear(),
          base.getMonth(),
          base.getDate() + idx,
          9
        ),
        endDate: new Date(
          base.getFullYear(),
          base.getMonth(),
          base.getDate() + idx,
          10
        ),
      });
    });
  };

  /* ------------- PDF --------------- */
  const exportPDF = async () => {
    if (!plan) return;
    const html =
      "<h1>Workout Plan</h1>" +
      WEEK_ORDER.map((d) => {
        const ex = plan.weekly_plan[d] ?? [];
        return `<h2>${d}</h2><ul>${ex
          .map(
            (e) =>
              `<li>${e.exercise} – ${e.sets}×${e.reps} @ ${e.weight}kg</li>`
          )
          .join("")}</ul>`;
      }).join("");
    const { uri } = await Print.printToFileAsync({ html });
    await shareAsync(uri);
  };

  /* ----------- RENDER -------------- */
  if (loading)
    return <ActivityIndicator style={{ marginTop: 50 }} size="large" />;

  if (error) return <Text style={styles.error}>{error}</Text>;

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl
          colors={[theme.colors.primary]}
          refreshing={refreshing}
          onRefresh={() => {
            setRefresh(true);
            loadPlan();
          }}
        />
      }
    >
      <Text style={styles.title}>Weekly Plan</Text>

      {/* top actions */}
      {!showForm && plan && (
        <View style={styles.topActions}>
          <Button
            icon="printer"
            mode="contained"
            onPress={exportPDF}
            style={{ marginRight: 8 }}
          >
            PDF
          </Button>
          <Button mode="outlined" onPress={() => setShowForm(true)}>
            Edit / Regenerate
          </Button>
        </View>
      )}

      {/* ------------ when plan exists ------------- */}
      {plan && !showForm ? (
        <>
          {/* MINI CALENDAR ------------------------------------------------ */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 8 }}
          >
            {WEEK_ORDER.map((d) => {
              const ex = plan.weekly_plan[d] ?? [];
              const isToday = d === todayLong;
              return (
                <Pressable
                  key={d}
                  onPress={() => ex.length && setModalDay(d)}
                  style={[
                    styles.dayCircle,
                    {
                      backgroundColor: isToday ? theme.colors.primary : "#fff",
                      borderColor: theme.colors.primary,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: isToday ? "#fff" : theme.colors.primary,
                      fontWeight: "600",
                    }}
                  >
                    {d.slice(0, 3)}
                  </Text>
                  {ex.length > 0 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeTxt}>{ex.length}</Text>
                    </View>
                  )}
                </Pressable>
              );
            })}
          </ScrollView>

          {/* ACCORDIONS --------------------------------------------------- */}
          <AccordionCard title="Equipment" icon="dumbbell" bg="#F4EBFF">
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
              {plan.equipment.map((eq, i) => (
                <Chip key={i} style={{ marginVertical: 2 }}>
                  {eq}
                </Chip>
              ))}
            </View>
          </AccordionCard>

          <AccordionCard
            title="Recommendation"
            icon="lightbulb-on-outline"
            bg="#FFF9E6"
          >
            <Text style={{ lineHeight: 22 }}>{plan.recommendation}</Text>
          </AccordionCard>

          {plan.diet && (
            <AccordionCard title="Diet" icon="food-apple-outline" bg="#E8F6EF">
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
                {plan.diet
                  .split(/[,;()]/)
                  .map((d) => d.trim())
                  .filter(Boolean)
                  .map((d, i) => (
                    <Chip key={i} icon="leaf">
                      {d}
                    </Chip>
                  ))}
              </View>
            </AccordionCard>
          )}

          {/* modal */}
          <DayModal
            visible={!!modalDay}
            day={modalDay ?? ""}
            exercises={modalDay ? plan.weekly_plan[modalDay] : []}
            onClose={() => setModalDay(null)}
          />
        </>
      ) : (
        <PlanForm values={form} onChange={change} onSubmit={generatePlan} />
      )}
    </ScrollView>
  );
}

/* ------------------ STYLES ------------------ */
const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#F9F5FF" },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
    color: "#4C1D95",
  },
  error: { textAlign: "center", marginTop: 50, color: "red" },
  topActions: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  /* mini‑calendar */
  dayCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 6,
  },
  badge: {
    position: "absolute",
    bottom: 4,
    right: 10,
    backgroundColor: "#FF6767",
    borderRadius: 8,
    paddingHorizontal: 4,
  },
  badgeTxt: { color: "#fff", fontSize: 10, fontWeight: "700" },
});
