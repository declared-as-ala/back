// src/components/DaySelector.tsx
import React from "react";
import { ScrollView, Pressable, View, Text, StyleSheet } from "react-native";
import { useAppStore } from "@/store";
import { themes } from "@/constants/theme";
const WEEK_ORDER = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

interface DaySelectorProps {
  plan: Record<string, any[]>;
  selectedDay: string | null;
  onSelect: (day: string) => void;
}

const DaySelector: React.FC<DaySelectorProps> = ({
  plan,
  selectedDay,
  onSelect,
}) => {
  const { theme } = useAppStore();
  const t = themes[theme];
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {WEEK_ORDER.map((day) => {
        const items = plan[day] || [];
        const isActive = day === today;
        return (
          <Pressable
            key={day}
            onPress={() => items.length > 0 && onSelect(day)}
            style={[
              styles.circle,
              {
                backgroundColor: isActive ? t.primary : t.card,
                borderColor: t.primary,
                ...t.shadow,
              },
            ]}
          >
            <Text
              style={[
                styles.circleText,
                { color: isActive ? t.textSecondary : t.primary },
              ]}
            >
              {day.slice(0, 3)}
            </Text>
            {items.length > 0 && (
              <View style={[styles.badge, { backgroundColor: t.primary }]}>
                <Text style={styles.badgeTxt}>{items.length}</Text>
              </View>
            )}
          </Pressable>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { paddingVertical: 8 },
  circle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 6,
  },
  circleText: { fontWeight: "600" },
  badge: {
    position: "absolute",
    bottom: 4,
    right: 8,
    borderRadius: 8,
    paddingHorizontal: 4,
  },
  badgeTxt: { color: "#fff", fontSize: 10, fontWeight: "700" },
});

export default React.memo(DaySelector);
