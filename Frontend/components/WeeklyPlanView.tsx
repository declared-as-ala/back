import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Card, Text, FAB } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

interface ExerciseDetail {
  exercise: string;
  sets: number;
  reps: number;
  weight: number;
}

interface PlanResponse {
  weekly_plan: Record<string, ExerciseDetail[]>;
  equipment: string[];
  recommendation: string;
  diet?: string;
}

interface WeeklyPlanViewProps {
  plan: PlanResponse;
  onRegenerate: () => void;
}

const WeeklyPlanView: React.FC<WeeklyPlanViewProps> = ({
  plan,
  onRegenerate,
}) => {
  return (
    <View style={{ flex: 1 }}>
      <LinearGradient colors={["#a78bfa", "#c084fc"]} style={styles.header}>
        <Text style={styles.title}>Your Weekly Plan</Text>
      </LinearGradient>

      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {Object.entries(plan?.weekly_plan || {}).map(([day, exercises]) => (
          <Card key={day} style={styles.card}>
            <Card.Title
              title={day}
              titleStyle={styles.dayTitle}
              left={() => (
                <Ionicons name="calendar" size={24} color="#7c3aed" />
              )}
            />
            <Card.Content>
              {exercises.map((ex, i) => (
                <Text key={i} style={styles.exercise}>
                  • {ex.exercise} | {ex.sets} x {ex.reps} @ {ex.weight}kg
                </Text>
              ))}
            </Card.Content>
          </Card>
        ))}

        {plan?.equipment?.length > 0 && (
          <Card style={styles.card}>
            <Card.Title
              title="Equipment"
              titleStyle={styles.sectionTitle}
              left={() => <Ionicons name="barbell" size={22} color="#7c3aed" />}
            />
            <Card.Content>
              <Text>{plan.equipment.join(", ")}</Text>
            </Card.Content>
          </Card>
        )}

        {plan?.recommendation && (
          <Card style={styles.card}>
            <Card.Title
              title="Recommendation"
              titleStyle={styles.sectionTitle}
              left={() => <Ionicons name="bulb" size={22} color="#7c3aed" />}
            />
            <Card.Content>
              <Text>{plan.recommendation}</Text>
            </Card.Content>
          </Card>
        )}

        {plan?.diet && (
          <Card style={styles.card}>
            <Card.Title
              title="Diet Plan"
              titleStyle={styles.sectionTitle}
              left={() => (
                <Ionicons name="nutrition" size={22} color="#7c3aed" />
              )}
            />
            <Card.Content>
              <Text>{plan.diet}</Text>
            </Card.Content>
          </Card>
        )}
      </ScrollView>

      <FAB
        icon="refresh"
        style={styles.fab}
        label="Regenerate"
        onPress={onRegenerate}
        color="white"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f5f3ff",
    paddingHorizontal: 16,
  },
  header: {
    padding: 20,
    alignItems: "center",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "white",
  },
  card: {
    backgroundColor: "white",
    marginTop: 16,
    borderRadius: 16,
    elevation: 4,
  },
  dayTitle: {
    color: "#7c3aed",
    fontWeight: "bold",
    fontSize: 18,
  },
  sectionTitle: {
    color: "#7c3aed",
    fontWeight: "600",
  },
  exercise: {
    fontSize: 15,
    paddingVertical: 4,
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#9333ea",
    borderRadius: 50,
  },
});

export default WeeklyPlanView;
