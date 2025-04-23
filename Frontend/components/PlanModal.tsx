import React from "react";
import { View, StyleSheet, Modal } from "react-native";
import { Card, Text, Button } from "react-native-paper";
import { ExerciseDetail } from "@/app/types";

interface Props {
  visible: boolean;
  day: string;
  exercises: ExerciseDetail[];
  onClose: () => void;
}

export const PlanModal = ({ visible, day, exercises, onClose }: Props) => (
  <Modal visible={visible} animationType="slide" transparent>
    <View style={styles.modalContainer}>
      <Card style={styles.modalCard}>
        <Card.Title title={day} titleStyle={{ color: "#7c3aed" }} />
        <Card.Content>
          {exercises.map((ex, idx) => (
            <Text key={idx}>
              • {ex.exercise} | {ex.sets} x {ex.reps} @ {ex.weight}kg
            </Text>
          ))}
          <Button onPress={onClose} style={{ marginTop: 10 }}>
            Close
          </Button>
        </Card.Content>
      </Card>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalCard: {
    width: "90%",
    padding: 16,
  },
});
