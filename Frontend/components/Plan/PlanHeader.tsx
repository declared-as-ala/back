// src/components/PlanHeader.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button } from "react-native-paper";
import { useAppStore } from "@/store";
import { themes } from "@/constants/theme";

interface PlanHeaderProps {
  onRefresh: () => void;
  onExportPDF: () => void;
  onEdit: () => void;
  showForm: boolean;
}

const PlanHeader: React.FC<PlanHeaderProps> = ({
  onExportPDF,
  onEdit,
  showForm,
}) => {
  const { theme } = useAppStore();
  const t = themes[theme];

  return (
    <View style={[styles.headerContainer, { backgroundColor: t.card }]}>
      <Text style={[styles.title, { color: t.primary }]}>Weekly Plan</Text>
      {!showForm && (
        <View style={styles.actions}>
          <Button
            icon="printer"
            mode="contained"
            onPress={onExportPDF}
            contentStyle={styles.buttonContent}
            style={[styles.button, t.shadow]}
          >
            PDF
          </Button>
          <Button
            mode="outlined"
            onPress={onEdit}
            contentStyle={styles.buttonContent}
            style={[styles.button, t.shadow]}
          >
            Edit
          </Button>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
  actions: {
    flexDirection: "row",
  },
  button: {
    marginLeft: 8,
    borderRadius: 24,
  },
  buttonContent: {
    height: 40,
  },
});

export default React.memo(PlanHeader);
