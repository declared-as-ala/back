// ChatScreen.tsx
// Expo + React Native chat interface for MedChat Assistant
import React, { useState, useRef } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const API_URL = "http://127.0.0.1:8000/api/chat";

const ChatScreen: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [chatType, setChatType] = useState<"symptom" | "food" | "explore">(
    "symptom"
  );
  const flatListRef = useRef<FlatList<Message>>(null);

  const sendMessage = async (): Promise<void> => {
    const text = input.trim();
    if (!text) return;

    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: "mobile-1",
          chat_type: chatType,
          prompt: text,
        }),
      });
      const data = await response.json();
      const assistantMsg: Message = {
        role: "assistant",
        content: data.response,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error) {
      const errorMsg: Message = {
        role: "assistant",
        content: "حدث خطأ في الاتصال بالخادم.",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
      setInput("");
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  };

  const renderItem = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageContainer,
        item.role === "user" ? styles.userMsg : styles.botMsg,
      ]}
    >
      <Text
        style={[
          styles.messageText,
          item.role === "assistant" && styles.botText,
        ]}
      >
        {item.content}
      </Text>
    </View>
  );

  const renderChatTypeSelector = () => (
    <View style={styles.selectorContainer}>
      {["symptom", "food", "explore"].map((type) => (
        <TouchableOpacity
          key={type}
          style={[
            styles.selectorButton,
            chatType === type && styles.selectorButtonActive,
          ]}
          onPress={() => setChatType(type as typeof chatType)}
        >
          <Text
            style={[
              styles.selectorText,
              chatType === type && styles.selectorTextActive,
            ]}
          >
            {type === "symptom"
              ? "Symptoms"
              : type === "food"
              ? "Food"
              : "Explore"}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderChatTypeSelector()}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.chatContainer}
      />

      {loading && (
        <ActivityIndicator size="large" color="#6200ee" style={styles.loader} />
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder={
              chatType === "symptom"
                ? "Describe your symptoms..."
                : chatType === "food"
                ? "Enter food name..."
                : "Enter disease name..."
            }
            value={input}
            onChangeText={setInput}
            onSubmitEditing={sendMessage}
            returnKeyType="send"
          />
          <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
            <Ionicons name="send" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f7f7" },
  selectorContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    backgroundColor: "#fff",
  },
  selectorButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#e0e0e0",
  },
  selectorButtonActive: { backgroundColor: "#6200ee" },
  selectorText: { fontSize: 14, color: "#000" },
  selectorTextActive: { color: "#fff" },
  chatContainer: { padding: 10 },
  messageContainer: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 20,
    maxWidth: "80%",
  },
  userMsg: { alignSelf: "flex-end", backgroundColor: "#6200ee" },
  botMsg: { alignSelf: "flex-start", backgroundColor: "#e0e0e0" },
  messageText: { fontSize: 16, color: "#fff" },
  botText: { color: "#000" },
  loader: { marginVertical: 10 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: "#6200ee",
    borderRadius: 20,
    padding: 10,
    marginLeft: 8,
  },
});

export default ChatScreen;
