import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  Text,
  ActivityIndicator,
} from "react-native";
import { Asset } from "expo-asset";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useRouter } from "expo-router";

const features = [
  "Track your steps daily 🏃‍♂️",
  "Monitor your heart rate ❤️",
  "Check your sleep quality 🛌",
  "Personalized health tips 🧠",
  "Live chat with doctors 👨‍⚕️",
];

export default function StarterScreen() {
  const [currentText, setCurrentText] = useState("");
  const [featureIndex, setFeatureIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isBgReady, setIsBgReady] = useState(false);

  const backgroundImage = require("@/assets/health-bg.jpg");
  const router = useRouter();

  useEffect(() => {
    const loadBackground = async () => {
      try {
        await Asset.loadAsync(backgroundImage);
        setIsBgReady(true);
      } catch (err) {
        console.error("Error loading background", err);
      }
    };
    loadBackground();
  }, []);

  useEffect(() => {
    if (!isBgReady) return;

    const currentFeature = features[featureIndex];
    if (charIndex < currentFeature.length) {
      const timeout = setTimeout(() => {
        setCurrentText((prev) => prev + currentFeature[charIndex]);
        setCharIndex((prev) => prev + 1);
      }, 50);
      return () => clearTimeout(timeout);
    } else {
      const delay = setTimeout(() => {
        setCurrentText("");
        setCharIndex(0);
        setFeatureIndex((prev) => (prev + 1) % features.length);
      }, 2000);
      return () => clearTimeout(delay);
    }
  }, [charIndex, featureIndex, isBgReady]);

  if (!isBgReady) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#7F3DFF" />
      </View>
    );
  }

  return (
    <ImageBackground source={backgroundImage} style={styles.container}>
      <View style={styles.overlay} />
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to</Text>
        <Text style={styles.titleAccent}>HealthMate</Text>
        <Text style={styles.feature}>{currentText}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.replace("/screens/auth/LoginScreen")}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  content: {
    paddingHorizontal: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 34,
    fontWeight: "300",
    color: "#fff",
    textAlign: "center",
  },
  titleAccent: {
    fontSize: 38,
    fontWeight: "bold",
    color: "#7F3DFF",
    marginBottom: 30,
    textAlign: "center",
  },
  feature: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 50,
  },
  button: {
    backgroundColor: "#7F3DFF",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
});
