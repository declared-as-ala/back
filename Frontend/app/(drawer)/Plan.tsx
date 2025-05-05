// src/screens/GeneratePlanScreen.tsx
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from "react-native";
import axios from "axios";
import { shareAsync } from "expo-sharing";
import * as Print from "expo-print";
import { useAppStore } from "@/store";
import { themes } from "@/constants/theme";
import PlanForm from "@/components/Plan/PlanForm";
import PlanCalendar from "@/components/Plan/PlanCalendar";
import PlanList from "@/components/Plan/PlanList";
import PlanModal from "@/components/Plan/PlanModal";
import { ExerciseDetail } from "@/app/types";
import { api as API_BACK } from "@/services/api";
import { Button } from "react-native-paper";

export default function GeneratePlanScreen() {
  const { user, theme } = useAppStore();
  const t = themes[theme];
  const [plan, setPlan] = useState<Record<string, ExerciseDetail[]>>({});
  const [equipment, setEquip] = useState<string[]>([]);
  const [reco, setReco] = useState("");
  const [diet, setDiet] = useState<string | undefined>(undefined);

  const [selectedDay, setSelectedDay] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [modalItem, setModalItem] = useState<ExerciseDetail | null>(null);

  const WEEK_DAYS = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const loadPlan = useCallback(async () => {
    if (!user?._id) return;
    setLoading(true);
    try {
      const resp = await axios.get(`${API_BACK}/plan/user/${user._id}`);
      const data = resp.data as any;
      setPlan(data.weekly_plan);
      setEquip(data.equipment);
      setReco(data.recommendation);
      setDiet(data.diet);
    } catch (e) {
      setShowForm(true);
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

  useEffect(() => {
    loadPlan();
  }, [loadPlan]);

  const generate = async () => {
    /*...*/
  };

  const exportPDF = async () => {
    const html =
      "<h1>Plan</h1>" +
      WEEK_DAYS.map(
        (d) =>
          `<h2>${d}</h2><ul>${(plan[d] || [])
            .map((e) => `<li>${e.exercise}</li>`)
            .join("")}</ul>`
      ).join("");
    const { uri } = await Print.printToFileAsync({ html });
    shareAsync(uri);
  };

  if (loading)
    return (
      <View style={[styles.center, { backgroundColor: t.background }]}>
        <ActivityIndicator size="large" color={t.primary} />
      </View>
    );
  if (showForm)
    return (
      <PlanForm
        values={{
          sex: "",
          age: "",
          height: "",
          weight: "",
          bmi: "",
          level: "",
          goal: "",
          days: "",
          hypertension: "",
          diabetes: "",
        }}
        onChange={() => {}}
        onSubmit={() => setShowForm(false)}
      />
    );

  const todayList = plan[WEEK_DAYS[selectedDay]] || [];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: t.background }}
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl
          tintColor={t.primary}
          refreshing={loading}
          onRefresh={loadPlan}
        />
      }
    >
      <PlanCalendar selected={selectedDay} onSelect={setSelectedDay} />
      <PlanList
        data={todayList}
        loading={loading}
        onItemPress={(i) => setModalItem(i)}
      />
      <View style={styles.bottomActions}>
        <Button mode="outlined" onPress={exportPDF}>
          Export PDF
        </Button>
        <Button mode="outlined" onPress={() => setShowForm(true)}>
          Regenerate
        </Button>
      </View>
      <PlanModal
        visible={!!modalItem}
        item={modalItem}
        onDismiss={() => setModalItem(null)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  bottomActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
  },
});
