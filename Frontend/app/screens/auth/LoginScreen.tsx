// screens/LoginScreen.tsx
import React, { useState } from "react";
import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Text, Snackbar } from "react-native-paper";
import MyTextInput from "@/components/MyTextInput";
import MyButton from "@/components/MyButton";
import { useRouter } from "expo-router";
import { loginUser } from "@/services/auth";
import { useAppStore } from "@/store";

export default function LoginScreen() {
  const router = useRouter();
  const setToken = useAppStore((state) => state.setToken);
  const setUser = useAppStore((state) => state.setUser);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const showToast = (msg: string) => {
    setSnackbarMsg(msg);
    setSnackbarVisible(true);
  };

  const handleLogin = async () => {
    if (!email || !password) return showToast("All fields are required");
    try {
      setLoading(true);
      const data = await loginUser({ email, password });
      setToken(data.token);
      setUser(data.user);
      router.replace("/(drawer)/(tabs)");
    } catch (error: any) {
      showToast(error.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("@/assets/Logo.png")} style={styles.logo} />
      <Text style={styles.title}>Welcome back.</Text>
      <MyTextInput label="Email" value={email} onChangeText={setEmail} />
      <MyTextInput
        label="Password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.forgot}>
        <Text style={styles.forgotText}>Forgot your password?</Text>
      </TouchableOpacity>
      <MyButton onPress={handleLogin} loading={loading}>
        LOGIN
      </MyButton>
      <View style={styles.footer}>
        <Text>Don’t have an account?</Text>
        <TouchableOpacity
          onPress={() => router.replace("/screens/auth/RegisterScreen")}
        >
          <Text style={styles.link}> Sign up</Text>
        </TouchableOpacity>
      </View>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
      >
        {snackbarMsg}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center" },
  logo: {
    width: 150,
    height: 150,
    alignSelf: "center",

    marginBottom: 24,
  },
  title: {
    textAlign: "center",
    fontSize: 24,
    color: "#7F3DFF",
    marginBottom: 24,
    fontWeight: "bold",
  },
  forgot: { alignItems: "flex-end", marginBottom: 24 },
  forgotText: { color: "#999" },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 16 },
  link: { color: "#7F3DFF" },
});
