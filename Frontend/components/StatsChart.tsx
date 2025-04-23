// components/StatsChart.tsx
import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Text } from "react-native-paper";
import { LineChart } from "react-native-chart-kit";

export interface DailyStat {
  date: string;
  steps: number;
  caloriesBurned: number;
}

interface Props {
  data?: DailyStat[];
}

const screenWidth = Dimensions.get("window").width - 32;

export default function StatsChart({ data = [] }: Props) {
  const valid = data.filter((d) => Number.isFinite(d.steps));
  const labels = valid.map((d) =>
    new Date(d.date).toLocaleDateString("en-US", { weekday: "short" })
  );
  const values = valid.map((d) => d.steps);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weekly Steps</Text>
      <LineChart
        data={{ labels, datasets: [{ data: values }] }}
        width={screenWidth}
        height={220}
        chartConfig={{
          backgroundGradientFrom: "#F9F5FF",
          backgroundGradientTo: "#F9F5FF",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(127,61,255,${opacity})`,
          labelColor: () => "#555",
          propsForDots: { r: "4", strokeWidth: "2", stroke: "#7F3DFF" },
        }}
        style={styles.chart}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", marginVertical: 16 },
  title: { fontSize: 18, fontWeight: "600", color: "#7F3DFF", marginBottom: 8 },
  chart: { borderRadius: 10 },
});
