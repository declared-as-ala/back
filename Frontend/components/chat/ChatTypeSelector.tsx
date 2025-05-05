import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppStore } from "@/store";
import { themes } from "@/constants/theme";

interface ChatTypeSelectorProps {
  chatType: "symptom" | "food" | "explore";
  setChatType: (type: ChatTypeSelectorProps["chatType"]) => void;
}

const icons = {
  symptom: "medkit",
  food: "nutrition",
  explore: "search",
} as const;

const ChatTypeSelector: React.FC<ChatTypeSelectorProps> = ({
  chatType,
  setChatType,
}) => {
  const { theme } = useAppStore();
  const t = themes[theme];

  return (
    <View style={[styles.container, { backgroundColor: t.card }]}>
      {(Object.keys(icons) as Array<keyof typeof icons>).map((key) => {
        const active = chatType === key;
        return (
          <TouchableOpacity
            key={key}
            style={[
              styles.button,
              { backgroundColor: active ? t.primary : t.inputBg },
              t.shadow,
            ]}
            onPress={() => setChatType(key)}
          >
            <Ionicons
              name={icons[key]}
              size={16}
              color={active ? t.textSecondary : t.textPrimary}
              style={styles.icon}
            />
            <Text style={{ color: active ? t.textSecondary : t.textPrimary }}>
              {key === "symptom"
                ? "Symptoms"
                : key === "food"
                ? "Food"
                : "Explore"}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 12,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 24,
  },
  icon: { marginRight: 6 },
});

export default React.memo(ChatTypeSelector);
