// components/DayModal.tsx
import React from "react";
import { View, StyleSheet, Modal } from "react-native";
import { Card, Text, Button } from "react-native-paper";
import { ExerciseDetail } from "@/app/types";

type Props = {
  visible: boolean;
  day: string;
  exercises: ExerciseDetail[];
  onClose: () => void;
};

const DayModal: React.FC<Props> = ({ visible, day, exercises, onClose }) => {
  if (!visible) return null;
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <Card style={styles.card}>
          <Card.Title title={day} titleStyle={styles.title} />
          <Card.Content>
            {exercises.map((ex, i) => (
              <Text key={i} style={styles.exercise}>
                • {ex.exercise} | {ex.sets} x {ex.reps} @ {ex.weight}kg
              </Text>
            ))}
            <Button onPress={onClose} style={styles.btn}>
              Close
            </Button>
          </Card.Content>
        </Card>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  card: {
    width: "90%",
    padding: 16,
  },
  title: {
    color: "#7c3aed",
  },
  exercise: {
    fontSize: 16,
    marginBottom: 4,
  },
  btn: {
    marginTop: 12,
  },
});

export default DayModal;
