// src/components/PlanModal.tsx
import React from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { Modal, Portal, Text, Button } from "react-native-paper";
import { ExerciseDetail } from "@/app/types";
import { useAppStore } from "@/store";
import { themes } from "@/constants/theme";

interface Props {
  visible: boolean;
  item: ExerciseDetail | null;
  onDismiss: () => void;
}
const PlanModal: React.FC<Props> = ({ visible, item, onDismiss }) => {
  const { theme } = useAppStore();
  const t = themes[theme];
  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={[styles.modal, { backgroundColor: t.card }]}
      >
        {item ? (
          <>
            <Text style={[styles.title, { color: t.primary }]}>
              {item.exercise}
            </Text>
            <Text style={{ color: t.textPrimary }}>Sets: {item.sets}</Text>
            <Text style={{ color: t.textPrimary }}>Reps: {item.reps}</Text>
            <Text style={{ color: t.textPrimary }}>
              Weight: {item.weight}kg
            </Text>
          </>
        ) : (
          <ActivityIndicator color={t.primary} />
        )}
        <Button onPress={onDismiss} style={styles.btn}>
          Close
        </Button>
      </Modal>
    </Portal>
  );
};
const styles = StyleSheet.create({
  modal: { margin: 20, padding: 20, borderRadius: 12 },
  title: { fontSize: 20, fontWeight: "600", marginBottom: 12 },
  btn: { marginTop: 16 },
});
export default React.memo(PlanModal);
