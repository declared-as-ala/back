import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { getProfile } from "@/services/auth";
import { useAppStore } from "@/store";

export default function ProfileScreen({ navigation }: any) {
  const token = useAppStore((state) => state.token);
  const logout = useAppStore((state) => state.logout);

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const data = await getProfile(token);
      setProfile(data.user);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={{ color: "red" }}>Error: {error}</Text>
        <Button title="Retry" onPress={fetchProfile} />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.container}>
        <Text>No profile data yet.</Text>
        <Button title="Fetch Profile" onPress={fetchProfile} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {profile.fullName || "User"}!</Text>
      <Text>Email: {profile.email}</Text>
      <Text>Age: {profile.age}</Text>
      <Text>Gender: {profile.gender}</Text>
      <Text>Height: {profile.height}</Text>
      <Text>Weight: {profile.weight}</Text>
      <Text>Birthday: {profile.birthday}</Text>

      <Button
        title="Logout"
        onPress={() => {
          logout();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 18,
    marginBottom: 12,
    fontWeight: "bold",
  },
});
