// screens/DashboardScreen.tsx
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  StyleSheet,
  Dimensions,
  Modal,
  ActivityIndicator,
} from "react-native";
import {
  Title,
  Subheading,
  Text,
  Button,
  Card,
  useTheme,
  Paragraph,
  Avatar,
  Surface,
  IconButton,
} from "react-native-paper";
import { LineChart } from "react-native-chart-kit";
import axios from "axios";
import { useRouter } from "expo-router";
import { useAppStore } from "@/store";
import { useStepTracker } from "@/hooks/useStepTracker";
import CircularStat from "@/components/CircularStat";
import MetricCard from "@/components/MetricCard";
import { API_BASE_URL as API_URL } from "@/services/api";

const screenWidth = Dimensions.get("window").width - 32;
const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface Exercise {
  exercise: string;
  sets: number;
  reps: number;
  weight: number;
}
interface DailyStat {
  date: string;
  steps: number;
  caloriesBurned: number;
}

export default function DashboardScreen() {
  const theme = useTheme();
  const router = useRouter();
  const ready = useStepTracker();

  const user = useAppStore((s) => s.user);
  const userId = user?._id;
  const stepsToday = useAppStore((s) => s.stepsToday);
  const caloriesToday = useAppStore((s) => s.caloriesToday);
  const weeklyStats = useAppStore((s) => s.weeklyStats);
  const setWeeklyStats = useAppStore((s) => s.setWeeklyStats);

  const [loading, setLoading] = useState(true);
  const [planModal, setPlanModal] = useState(false);
  const [todayPlan, setTodayPlan] = useState<Exercise[]>([]);

  useEffect(() => {
    if (!userId) return;
    Promise.all([
      axios.get<DailyStat[]>(`${API_URL}/stats/user/${userId}?days=7`),
      axios.get<{ weekly_plan: Record<string, Exercise[]> }>(
        `${API_URL}/plan/user/${userId}`
      ),
    ])
      .then(([{ data: stats }, { data: planRes }]) => {
        setWeeklyStats(stats);
        const todayKey = new Date().toLocaleDateString("en-US", {
          weekday: "long",
        });
        setTodayPlan(planRes.weekly_plan[todayKey] || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [userId]);

  if (!ready || loading || !weeklyStats) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  // ratios & chart data
  const stepRatio = Math.min(stepsToday / 10000, 1);
  const calRatio = Math.min(caloriesToday / 500, 1);
  const stepsMap = new Map<string, number>();
  weeklyStats.forEach((d) => {
    const day = new Date(d.date).toLocaleDateString("en-US", {
      weekday: "short",
    });
    stepsMap.set(day, d.steps);
  });
  const weekSteps = DAY_LABELS.map((d) => stepsMap.get(d) ?? 0);
  const firstName = user.fullName?.split(" ")[0] || "there";

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Title style={styles.header}>👋 Hello, {firstName}</Title>

        {/* Today’s Stats */}
        <View style={styles.statsRow}>
          <CircularStat
            label="Steps"
            value={stepsToday}
            unit="steps"
            ratio={stepRatio}
            size={110}
            strokeWidth={10}
            color={theme.colors.primary}
          />
          <CircularStat
            label="Calories"
            value={+caloriesToday.toFixed(1)}
            unit="kcal"
            ratio={calRatio}
            size={110}
            strokeWidth={10}
            color={(theme.colors as any).secondary || "#FF6B6B"}
          />
        </View>

        {/* Vital Signs */}

        <View style={styles.vitalsGrid}>
          <MetricCard icon="heart-pulse" label="Heart Rate" value="72 bpm" />

          <MetricCard icon="thermometer" label="Temp" value="36.6 °C" />
        </View>

        {/* Steps This Week Chart */}
        <Subheading style={styles.subheader}>📈 Steps This Week</Subheading>
        <Surface style={styles.chartSurface}>
          <LineChart
            data={{ labels: DAY_LABELS, datasets: [{ data: weekSteps }] }}
            width={screenWidth}
            height={180}
            fromZero
            chartConfig={{
              backgroundGradientFrom: theme.colors.surface,
              backgroundGradientTo: theme.colors.surface,
              decimalPlaces: 0,
              color: () => theme.colors.primary,
              labelColor: () => "#666",
              propsForDots: {
                r: "4",
                strokeWidth: "2",
                stroke: theme.colors.primary,
              },
            }}
            style={styles.chart}
            bezier
          />
        </Surface>

        {/* Today’s Workout */}
        <Subheading style={styles.subheader}>🏋️‍♂️ Today’s Workout</Subheading>
        <Card style={styles.planCard}>
          <Card.Content>
            {todayPlan.length ? (
              todayPlan.map((ex, i) => (
                <Text key={i} style={styles.planLine}>
                  • {ex.exercise} {ex.sets}×{ex.reps}
                </Text>
              ))
            ) : (
              <Text style={styles.planLine}>No workout scheduled today.</Text>
            )}
          </Card.Content>
          <Card.Actions style={styles.planActions}>
            <Button
              mode="contained"
              onPress={() => setPlanModal(true)}
              icon="eye"
            >
              View Details
            </Button>
          </Card.Actions>
        </Card>
      </ScrollView>

      {/* Plans FAB */}
      <Button
        mode="contained-tonal"
        icon="calendar-multiselect"
        onPress={() => router.push("/Plan")}
        style={styles.fab}
      >
        Plans
      </Button>

      {/* Today’s Workout Modal */}
      <Modal visible={planModal} animationType="slide" transparent>
        <View style={styles.modalBg}>
          <Card style={styles.modalCard}>
            <Card.Title
              title="Today’s Workout"
              left={(p) => <Avatar.Icon {...p} icon="dumbbell" />}
              right={(p) => (
                <IconButton
                  {...p}
                  icon="close"
                  onPress={() => setPlanModal(false)}
                />
              )}
            />
            <Card.Content>
              {todayPlan.length ? (
                todayPlan.map((ex, i) => (
                  <Paragraph key={i} style={styles.modalLine}>
                    • {ex.exercise} — {ex.sets} sets × {ex.reps} reps @{" "}
                    {ex.weight} kg
                  </Paragraph>
                ))
              ) : (
                <Paragraph>No exercises for today.</Paragraph>
              )}
            </Card.Content>
          </Card>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F3E8FF",
  },
  container: {
    padding: 16,
    paddingBottom: 120,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 24,
    color: "#4C1D95",
    textAlign: "center",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 32,
  },
  subheader: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#4C1D95",
    textAlign: "left",
  },
  vitalsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 32,
  },
  chartSurface: {
    borderRadius: 16,
    elevation: 4,
    paddingVertical: 8,
    marginBottom: 32,
    backgroundColor: "#F3E8FF",
  },
  chart: {
    borderRadius: 8,
    marginVertical: 4,
  },
  planCard: {
    borderRadius: 16,
    elevation: 2,
    backgroundColor: "#fff",
  },
  planLine: {
    fontSize: 16,
    marginVertical: 6,
    color: "#333",
  },
  planActions: {
    justifyContent: "flex-end",
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    borderRadius: 28,
    paddingHorizontal: 20,
  },
  modalBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    width: "90%",
    borderRadius: 16,
    elevation: 6,
  },
  modalLine: {
    fontSize: 16,
    marginVertical: 4,
  },
});
