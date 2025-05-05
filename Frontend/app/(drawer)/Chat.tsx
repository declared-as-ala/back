// src/screens/ChatScreen.tsx
import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  LayoutAnimation,
  Platform,
} from "react-native";
import ChatTypeSelector from "@/components/chat/ChatTypeSelector";
import ChatBubble from "@/components/chat/ChatBubble";
import ChatInputBar from "@/components/chat/ChatInputBar";
import { useAppStore } from "@/store";
import { themes } from "@/constants/theme";
import { API_AI_URL } from "@/services/api";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const API_URL = `${API_AI_URL}/api/chat`;

const ChatScreen: React.FC = () => {
  const { theme } = useAppStore();
  const t = themes[theme];

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [chatType, setChatType] = useState<"symptom" | "food" | "explore">(
    "symptom"
  );
  const [loading, setLoading] = useState(false);

  const flatRef = useRef<FlatList<Message>>(null);

  // Show welcome message on chatType change with typing effect
  useEffect(() => {
    const welcomeText =
      chatType === "symptom"
        ? "👋 Describe your symptoms, and I'll help you understand what might be going on."
        : chatType === "food"
        ? "🍎 Ask me about any food, and I'll provide nutritional info."
        : "🔍 Explore any medical condition with me!";

    let idx = 0;
    // Clear previous messages, start fresh with one blank assistant message
    setMessages([{ role: "assistant", content: "" }]);
    const interval = setInterval(() => {
      idx++;
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setMessages((prev) => [
        { role: "assistant", content: welcomeText.slice(0, idx) },
      ]);
      if (idx >= welcomeText.length) clearInterval(interval);
    }, 30);

    return () => clearInterval(interval);
  }, [chatType]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { role: "user", content: text }]);
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
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "حدث خطأ في الاتصال بالخادم." },
      ]);
    } finally {
      setLoading(false);
      setInput("");
      flatRef.current?.scrollToEnd({ animated: true });
    }
  }, [input, chatType]);

  const renderItem = useCallback(
    ({ item }: { item: Message }) => (
      <ChatBubble role={item.role} content={item.content} />
    ),
    []
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: t.background }]}>
      <FlatList
        ref={flatRef}
        data={messages}
        keyExtractor={(_, i) => i.toString()}
        ListHeaderComponent={
          <ChatTypeSelector chatType={chatType} setChatType={setChatType} />
        }
        renderItem={renderItem}
        contentContainerStyle={styles.chatContainer}
        ListFooterComponent={
          loading ? (
            <ActivityIndicator
              size="large"
              color={t.primary}
              style={styles.loader}
            />
          ) : null
        }
      />

      <ChatInputBar
        input={input}
        setInput={setInput}
        onSend={sendMessage}
        placeholder={
          chatType === "symptom"
            ? "Describe your symptoms..."
            : chatType === "food"
            ? "Enter food name..."
            : "Enter disease name..."
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  chatContainer: { padding: 10 },
  loader: { marginVertical: 12 },
});

export default ChatScreen;
