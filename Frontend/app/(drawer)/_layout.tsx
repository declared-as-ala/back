/* app/(drawer)/_layout.tsx */
import { Drawer } from "expo-router/drawer";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Switch } from "react-native";
import { Avatar } from "react-native-paper";
import { useRouter } from "expo-router";
import { useAppStore } from "@/store";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { API_BASE_URL } from "@/services/api";

const UPLOADS = API_BASE_URL.replace(/\/api$/, "") + "/uploads/";

export default function DrawerLayout() {
  const router = useRouter();
  const logout = useAppStore((s) => s.logout);
  const user = useAppStore((s) => s.user);
  const theme = useAppStore((s) => s.theme);
  const toggleTheme = useAppStore((s) => s.toggleTheme);
  const isDark = theme === "dark";

  const [imgErr, setImgErr] = useState(false);
  const [uri, setUri] = useState("");

  /* ------------------------------------------------------------ */
  /* load avatar on mount / when user changes                     */
  /* ------------------------------------------------------------ */
  useEffect(() => {
    if (user?.profileImage) {
      setUri(UPLOADS + user.profileImage + "?t=" + Date.now());
      setImgErr(false);
    }
  }, [user?.profileImage]);

  const bg = isDark ? "#1c1c1e" : "#F8ECFF";
  const txt = isDark ? "#FFF" : "#3E206D";

  return (
    <Drawer
      screenOptions={{
        drawerStyle: { backgroundColor: bg },
        headerStyle: { backgroundColor: bg },
        headerTintColor: txt,
        drawerLabelStyle: { color: txt },
      }}
      drawerContent={(props) => (
        <DrawerContentScrollView
          {...props}
          contentContainerStyle={{ backgroundColor: bg, flex: 1 }}
        >
          {/* ---------- avatar & name -------------------- */}
          <View style={styles.profile}>
            {!imgErr && uri ? (
              <Avatar.Image
                size={80}
                source={{ uri }}
                onError={() => setImgErr(true)}
              />
            ) : (
              <Avatar.Icon size={80} icon="account" />
            )}
            <Text style={[styles.name, { color: txt }]}>{user.fullName}</Text>
          </View>

          {/* ---------- drawer items --------------------- */}
          <DrawerItemList {...props} />

          {/* ---------- theme switch --------------------- */}
          <View style={styles.switchRow}>
            <MaterialCommunityIcons
              name={isDark ? "weather-night" : "white-balance-sunny"}
              size={20}
              color={txt}
            />
            <Text style={[styles.switchLbl, { color: txt }]}>
              {isDark ? "Dark Mode" : "Light Mode"}
            </Text>
            <Switch value={isDark} onValueChange={toggleTheme} />
          </View>

          {/* ---------- logout --------------------------- */}
          <TouchableOpacity
            style={styles.logout}
            onPress={() => {
              logout();
              router.replace("/screens/auth/LoginScreen");
            }}
          >
            <MaterialCommunityIcons name="logout" size={20} color="#fff" />
            <Text style={styles.logoutTxt}>Logout</Text>
          </TouchableOpacity>
        </DrawerContentScrollView>
      )}
    >
      {/* HOME (tabs) */}
      <Drawer.Screen
        name="(tabs)"
        options={{
          drawerLabel: "Home",
          title: "Home",
          drawerIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="home-outline"
              size={22}
              color={color}
            />
          ),
        }}
      />

      {/* STEPS */}
      <Drawer.Screen
        name="Steps"
        options={{
          drawerLabel: "Steps",
          drawerIcon: ({ color }) => (
            <MaterialCommunityIcons name="walk" size={22} color={color} />
          ),
        }}
      />

      {/* PLAN / WORKOUTS */}
      <Drawer.Screen
        name="Plan"
        options={{
          drawerLabel: "Plan",
          drawerIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="calendar-multiselect"
              size={22}
              color={color}
            />
          ),
        }}
      />

      {/* CHAT */}
      <Drawer.Screen
        name="Chat"
        options={{
          drawerLabel: "Chat",
          drawerIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="chat-outline"
              size={22}
              color={color}
            />
          ),
        }}
      />
    </Drawer>
  );
}

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  profile: { alignItems: "center", marginVertical: 24 },
  name: { fontWeight: "700", fontSize: 16, marginTop: 8 },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 20,
    gap: 8,
  },
  switchLbl: { flex: 1, fontSize: 15, fontWeight: "500" },
  logout: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
    marginHorizontal: 16,
    backgroundColor: "#7F3DFF",
    padding: 10,
    borderRadius: 8,
  },
  logoutTxt: { color: "#fff", marginLeft: 10, fontWeight: "600" },
});
