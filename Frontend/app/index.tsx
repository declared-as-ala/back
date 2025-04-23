import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useAppStore } from "@/store";
import StarterScreen from "./screens/StarterScreen ";
import { View, ActivityIndicator } from "react-native";

export default function Index() {
  const router = useRouter();
  const token = useAppStore((state) => state.token);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // 👇 ننتظر أول تركيب ثم نقرر
    setTimeout(() => setIsReady(true), 0);
  }, []);

  useEffect(() => {
    if (isReady && token) {
      router.replace("/(drawer)/(tabs)");
    }
  }, [isReady, token]);

  // ✅ لو المستخدم مسجل → يتم التوجيه. لو لا → يعرض Starter
  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#7F3DFF" />
      </View>
    );
  }

  return <StarterScreen />;
}
