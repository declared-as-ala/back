// app/(auth)/_layout.tsx
import React, { useEffect, useState } from "react";
import { Slot } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  ImageBackground,
  View,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Asset } from "expo-asset";
import RouteGuard from "@/components/RouteGuard";

export default function AuthLayout() {
  const backgroundImage = require("@/assets/light.jpg");
  const [isBgReady, setIsBgReady] = useState(false);

  useEffect(() => {
    const loadBg = async () => {
      try {
        await Asset.loadAsync(backgroundImage); // ✅ هذا هو الحل الصحيح
        setIsBgReady(true);
      } catch (err) {
        console.error("Failed to load background image", err);
      }
    };
    loadBg();
  }, []);

  if (!isBgReady) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#7F3DFF" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ImageBackground source={backgroundImage} style={styles.bg}>
        <RouteGuard>
          <Slot />
        </RouteGuard>
      </ImageBackground>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
});
