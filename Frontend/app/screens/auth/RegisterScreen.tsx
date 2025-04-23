import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { Text, Snackbar } from "react-native-paper";
import MyTextInput from "@/components/MyTextInput";
import MyButton from "@/components/MyButton";
import { useRouter } from "expo-router";
import { registerUser } from "@/services/auth";

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const showToast = (msg: string) => {
    setSnackbarMsg(msg);
    setSnackbarVisible(true);
  };

  const handleRegister = async () => {
    if (!email || !password || !fullName)
      return showToast("All fields required");
    try {
      setLoading(true);
      await registerUser({ email, password, fullName });
      showToast("Registered! You can now login.");
      router.replace("/screens/auth/LoginScreen");
    } catch (error: any) {
      showToast(error.response?.data?.error || "Register failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Logo */}
      <Image
        source={require("@/assets/Logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Create Account</Text>

      <View style={styles.inputWrapper}>
        <MyTextInput
          label="Full Name"
          value={fullName}
          onChangeText={setFullName}
        />
        <MyTextInput label="Email" value={email} onChangeText={setEmail} />
        <MyTextInput
          label="Password"
          value={password}
          secureTextEntry
          onChangeText={setPassword}
        />
      </View>

      <MyButton onPress={handleRegister} loading={loading}>
        SIGN UP
      </MyButton>

      <View style={styles.footer}>
        <Text>Already have an account?</Text>
        <TouchableOpacity
          onPress={() => router.replace("/screens/auth/LoginScreen")}
        >
          <Text style={styles.link}> Sign in</Text>
        </TouchableOpacity>
      </View>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
      >
        {snackbarMsg}
      </Snackbar>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 1,
  },
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
  inputWrapper: {
    width: "100%",
    gap: 16, // Space between inputs
    marginBottom: 24,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  link: {
    color: "#7F3DFF",
    fontWeight: "bold",
  },
});
