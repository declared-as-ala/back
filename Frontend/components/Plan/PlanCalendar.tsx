import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useAppStore } from "@/store";
import { themes } from "@/constants/theme";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export type Day = string;
interface Props {
  selected: number;
  onSelect: (i: number) => void;
}

const PlanCalendar: React.FC<Props> = ({ selected, onSelect }) => {
  const { theme } = useAppStore();
  const t = themes[theme];
  return (
    <View style={[styles.row, { backgroundColor: t.background }]}>
      {DAYS.map((d, i) => (
        <Pressable
          key={d}
          onPress={() => onSelect(i)}
          style={[
            styles.day,
            { backgroundColor: i === selected ? t.primary : t.card },
            t.shadow,
          ]}
        >
          <Text
            style={{
              color: i === selected ? t.textSecondary : t.primary,
              fontWeight: "600",
            }}
          >
            {d}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};
const styles = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "space-between", padding: 8 },
  day: {
    flex: 1,
    margin: 4,
    padding: 12,
    alignItems: "center",
    borderRadius: 8,
  },
});
export default React.memo(PlanCalendar);
