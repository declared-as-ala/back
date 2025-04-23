/* screens/StepsScreen.tsx  — bar–chart edition */
import React, { useCallback, useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Title, Subheading, Surface, Text, useTheme } from "react-native-paper";
import { ProgressChart, BarChart } from "react-native-chart-kit";
import axios from "axios";
import { useAppStore } from "@/store";
import { useStepTracker } from "@/hooks/useStepTracker";
import { API_BASE_URL as API } from "@/services/api";

const W = Dimensions.get("window").width - 32;
const LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface DailyStat {
  date: string;
  steps: number;
  caloriesBurned: number;
}

export default function StepsScreen() {
  const theme = useTheme();
  const ready = useStepTracker();

  /* global store ------------- */
  const user = useAppStore((s) => s.user);
  const stepsToday = useAppStore((s) => s.stepsToday);
  const caloriesToday = useAppStore((s) => s.caloriesToday);
  const weeklyStats = useAppStore((s) => s.weeklyStats);
  const setWeekly = useAppStore((s) => s.setWeeklyStats);

  /* local ui ------------------ */
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  /* fetch helper */
  const fetchWeekly = useCallback(async () => {
    if (!user?._id) return;
    try {
      const { data } = await axios.get<DailyStat[]>(
        `${API}/stats/user/${user._id}?days=7`
      );
      setWeekly(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?._id]);

  useEffect(() => {
    fetchWeekly();
  }, [fetchWeekly]);
  const onRefresh = () => {
    setRefreshing(true);
    fetchWeekly();
  };

  if (!ready || loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );

  /* build arrays ---------------------------------------------------- */
  const mapSteps = new Map<string, number>();
  const mapCals = new Map<string, number>();
  weeklyStats.forEach((d) => {
    const day = new Date(d.date).toLocaleDateString("en-US", {
      weekday: "short",
    });
    mapSteps.set(day, d.steps);
    mapCals.set(day, d.caloriesBurned);
  });
  const weekSteps = LABELS.map((d) => mapSteps.get(d) ?? 0);
  const weekCals = LABELS.map((d) => mapCals.get(d) ?? 0);
  const stepRatio = Math.min(stepsToday / 10_000, 1);
  const calRatio = Math.min(caloriesToday / 500, 1);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            colors={[theme.colors.primary]}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        <Title style={styles.header}>🚶 Today</Title>

        {/* circle widgets ------------------------------------------- */}
        <View style={styles.row}>
          <CircleStat
            label="Steps"
            value={stepsToday.toLocaleString()}
            ratio={stepRatio}
            color={theme.colors.primary}
          />
          <CircleStat
            label="Calories"
            value={caloriesToday.toFixed(0) + " kcal"}
            ratio={calRatio}
            color={theme.colors.secondary}
          />
        </View>

        {/* bar – steps --------------------------------------------- */}
        <Subheading style={styles.sub}>Weekly Steps</Subheading>
        <BarChart
          data={{
            labels: LABELS,
            datasets: [{ data: weekSteps }],
          }}
          width={W}
          height={200}
          fromZero
          yAxisLabel=""
          withInnerLines={false}
          showValuesOnTopOfBars
          chartConfig={barCfg("#6C3BFF", "#EEF4FF")}
          style={styles.bar}
        />

        {/* bar – calories ------------------------------------------ */}
        <Subheading style={styles.sub}>Weekly Calories</Subheading>
        <BarChart
          data={{
            labels: LABELS,
            datasets: [{ data: weekCals }],
          }}
          width={W}
          height={200}
          fromZero
          yAxisLabel=""
          withInnerLines={false}
          showValuesOnTopOfBars
          chartConfig={barCfg("#FF784A", "#FFF3EC")}
          style={styles.bar}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------- circle component --------------- */
const CircleStat = ({
  label,
  value,
  ratio,
  color,
}: {
  label: string;
  value: string;
  ratio: number;
  color: string;
}) => (
  <Surface style={[styles.circleCard, { shadowColor: color + "55" }]}>
    <ProgressChart
      data={{ data: [ratio] }}
      width={135}
      height={135}
      strokeWidth={14}
      radius={50}
      hideLegend
      chartConfig={{
        backgroundGradientFrom: "#FFFFFF",
        backgroundGradientTo: "#FFFFFF",
        color: () => color,
      }}
      style={{ position: "absolute" }}
    />
    <View pointerEvents="none" style={styles.circleCenter}>
      <Text style={styles.circleVal}>{value}</Text>
    </View>
    <Text style={styles.circleLbl}>{label}</Text>
  </Surface>
);

/* --------- chart config helpers ---------- */
const barCfg = (barColor: string, bg: string) => ({
  backgroundGradientFrom: bg,
  backgroundGradientTo: bg,
  decimalPlaces: 0,
  color: () => barColor,
  labelColor: () => "#666",
  fillShadowGradient: barColor,
  fillShadowGradientOpacity: 0.8,
  barPercentage: 0.55,
});

/* ------------------ styles ---------------- */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F6F4FF" },
  container: { padding: 16, paddingBottom: 32 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  header: {
    fontSize: 26,
    fontWeight: "700",
    color: "#3E1D95",
    textAlign: "center",
    marginBottom: 6,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
  },

  circleCard: {
    width: "48%",
    aspectRatio: 1,
    borderRadius: 20,
    backgroundColor: "#fff",
    elevation: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  circleCenter: { alignItems: "center", justifyContent: "center" },
  circleVal: {
    fontSize: 20,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
    color: "#222",
  },
  circleLbl: { marginTop: 6, fontWeight: "500", color: "#555" },

  sub: { fontSize: 18, fontWeight: "600", marginBottom: 4, color: "#3E1D95" },
  bar: { borderRadius: 16, elevation: 2, marginBottom: 30 },
});
