// src/components/PlanList.tsx
import React from "react";
import { FlatList, View, Text, StyleSheet } from "react-native";
import { Card, Divider, ActivityIndicator } from "react-native-paper";
import { ExerciseDetail } from "@/app/types";
import { themes } from "@/constants/theme";
import { useAppStore } from "@/store";

interface Props {
  data: ExerciseDetail[];
  loading: boolean;
  onItemPress: (item: ExerciseDetail) => void;
}
const PlanList: React.FC<Props> = ({ data, loading, onItemPress }) => {
  const { theme } = useAppStore();
  const t = themes[theme];
  if (loading)
    return <ActivityIndicator style={{ marginTop: 16 }} color={t.primary} />;
  return (
    <FlatList
      data={data}
      keyExtractor={(i, idx) => i.exercise + idx}
      ItemSeparatorComponent={() => <Divider />}
      renderItem={({ item }) => (
        <Card style={[styles.card, t.shadow]}>
          <Card.Title
            title={item.exercise}
            titleStyle={{ color: t.textPrimary }}
            onPress={() => onItemPress(item)}
          />
          <Card.Content>
            <Text style={{ color: t.textSecondary }}>
              {item.sets}×{item.reps} @ {item.weight}kg
            </Text>
          </Card.Content>
        </Card>
      )}
    />
  );
};
const styles = StyleSheet.create({
  card: { marginVertical: 6, borderRadius: 12 },
});
export default React.memo(PlanList);
