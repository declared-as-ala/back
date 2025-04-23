import React from "react";
import { Slot } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ScrollView, StyleSheet } from "react-native";
import { PaperProvider } from "react-native-paper";
import RouteGuard from "@/components/RouteGuard";
import { useAppStore } from "@/store";
import { customDarkTheme, customLightTheme } from "@/theme"; // make sure you created this

export default function RootLayout() {
  const themeMode = useAppStore((s) => s.theme); // "dark" | "light"
  const theme = themeMode === "dark" ? customDarkTheme : customLightTheme;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={theme}>
        <RouteGuard>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <Slot />
          </ScrollView>
        </RouteGuard>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});
