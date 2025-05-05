// src/components/ChatBubble.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAppStore } from "@/store";
import { themes } from "@/constants/theme";

interface ChatBubbleProps {
  role: "user" | "assistant";
  content: string;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ role, content }) => {
  const { theme } = useAppStore();
  const t = themes[theme];
  const isUser = role === "user";

  return (
    <View
      style={[
        styles.bubble,
        {
          alignSelf: isUser ? "flex-end" : "flex-start",
          backgroundColor: isUser ? t.primary : t.messageBot,
        },
        t.shadow,
      ]}
    >
      <Text
        style={[
          styles.text,
          { color: isUser ? t.textSecondary : t.textPrimary },
        ]}
      >
        {content}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  bubble: {
    marginVertical: 8,
    padding: 14,
    borderRadius: 20,
    maxWidth: "75%",
  },
  text: { fontSize: 16, lineHeight: 22 },
});

export default React.memo(ChatBubble);
