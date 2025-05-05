// src/components/ChatInputBar.tsx
import React from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppStore } from "@/store";
import { themes } from "@/constants/theme";

interface ChatInputBarProps {
  input: string;
  setInput: (v: string) => void;
  onSend: () => void;
  placeholder: string;
}

const ChatInputBar: React.FC<ChatInputBarProps> = ({
  input,
  setInput,
  onSend,
  placeholder,
}) => {
  const { theme } = useAppStore();
  const t = themes[theme];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <View style={[styles.container, { backgroundColor: t.card }]}>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: t.inputBg, color: t.textPrimary },
          ]}
          placeholder={placeholder}
          placeholderTextColor={theme === "dark" ? "#aaa" : "#555"}
          value={input}
          onChangeText={setInput}
          onSubmitEditing={onSend}
          returnKeyType="send"
        />
        <TouchableOpacity
          onPress={onSend}
          style={[styles.button, { backgroundColor: t.primary }]}
        >
          <Ionicons
            name="send"
            size={22}
            color="#fff"
            style={styles.sendIcon}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
  },
  button: {
    borderRadius: 24,
    padding: 12,
    marginLeft: 10,
  },
  sendIcon: { transform: [{ rotate: "-45deg" }] },
});

export default React.memo(ChatInputBar);
