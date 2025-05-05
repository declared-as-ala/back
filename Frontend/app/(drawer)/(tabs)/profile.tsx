import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  RefreshControl,
  Platform,
} from "react-native";
import { Text, Button, TextInput, Snackbar, Avatar } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { BlurView } from "expo-blur";

import { useAppStore } from "@/store";
import {
  getProfile,
  updateProfile,
  uploadProfileImage,
  UpdateProfilePayload,
} from "@/services/auth";
import { API_BASE_URL } from "@/services/api";
import { useRefresher } from "@/hooks/useRefresher";

const UPLOADS_BASE_URL = API_BASE_URL.replace(/\/api$/, "") + "/uploads/";

interface Profile {
  fullName: string;
  gender: string;
  age: number | null;
  height: number | null;
  weight: number | null;
  birthday: string;
  profileImage: string;
}

export default function ProfileScreen() {
  const token = useAppStore((s) => s.token)!;
  const updateUser = useAppStore((s) => s.setUser);
  const currentUser = useAppStore((s) => s.user);

  const [profile, setProfile] = useState<Profile>({
    fullName: "",
    gender: "",
    age: null,
    height: null,
    weight: null,
    birthday: "",
    profileImage: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [imageError, setImageError] = useState(false);

  const showToast = (msg: string) => {
    setSnackbarMsg(msg);
    setSnackbarVisible(true);
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { user } = await getProfile(token);
      const filename = user.profileImage?.split("/").pop() || "";
      setProfile({
        fullName: user.fullName || "",
        gender: user.gender || "",
        age: user.age ?? null,
        height: user.height ?? null,
        weight: user.weight ?? null,
        birthday: user.birthday || "",
        profileImage: filename,
      });
    } catch (err) {
      console.error(err);
      showToast("Couldn't load profile");
    } finally {
      setLoading(false);
    }
  };

  const { refreshing, onRefresh } = useRefresher(fetchProfile);

  useEffect(() => {
    fetchProfile();
  }, []);

  const toPayload = (p: Profile): UpdateProfilePayload => ({
    ...p,
    age: p.age ?? undefined,
    height: p.height ?? undefined,
    weight: p.weight ?? undefined,
  });

  const toggleEdit = () => {
    isEditing ? handleSave() : setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const updated = await updateProfile(token, toPayload(profile));
      const filename =
        updated.user.profileImage?.split("/").pop() || profile.profileImage;
      updateUser({ ...updated.user, profileImage: filename });
      setProfile((p) => ({ ...p, profileImage: filename }));
      showToast("Profile saved");
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      showToast("Save failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePickPhoto = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return showToast("Permission denied");

    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (res.canceled || !res.assets || !res.assets[0]?.uri) return;

    try {
      setLoading(true);
      const { profileImage } = await uploadProfileImage(
        token,
        res.assets[0].uri
      );
      await updateProfile(token, {
        ...toPayload(profile),
        profileImage,
      });
      const filename = profileImage?.split("/").pop()!;
      setProfile((p) => ({ ...p, profileImage: filename }));
      updateUser({ ...currentUser, profileImage: filename });
      setImageError(false);
      showToast("Image updated");
    } catch (err) {
      console.error(err);
      showToast("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (_: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      setProfile((p) => ({
        ...p,
        birthday: date.toISOString().split("T")[0],
      }));
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.blurCard}>
        <BlurView intensity={50} tint="light" style={styles.blurContent}>
          <View style={styles.header}>
            <Button
              mode="text"
              onPress={toggleEdit}
              textColor="#7F3DFF"
              loading={loading}
            >
              {isEditing ? "Save" : "Edit"}
            </Button>
          </View>

          <TouchableOpacity onPress={handlePickPhoto} style={styles.avatarWrap}>
            {!imageError && profile.profileImage ? (
              <Image
                source={{ uri: UPLOADS_BASE_URL + profile.profileImage }}
                style={styles.avatarImage}
                resizeMode="cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <Avatar.Icon
                size={100}
                icon="account"
                style={styles.avatarFallback}
              />
            )}
          </TouchableOpacity>

          {[
            { label: "Full Name", key: "fullName" },
            { label: "Gender", key: "gender" },
            { label: "Age", key: "age", keyboardType: "numeric" },
            { label: "Height (cm)", key: "height", keyboardType: "numeric" },
            { label: "Weight (kg)", key: "weight", keyboardType: "numeric" },
          ].map((field) => (
            <TextInput
              key={field.key}
              label={field.label}
              value={profile[field.key as keyof Profile]?.toString?.() ?? ""}
              onChangeText={(val) =>
                setProfile((p) => ({
                  ...p,
                  [field.key]: field.keyboardType
                    ? parseFloat(val) || null
                    : val,
                }))
              }
              keyboardType={field.keyboardType as any}
              disabled={!isEditing}
              mode="outlined"
              style={styles.input}
              activeOutlineColor="#7F3DFF"
            />
          ))}

          <TextInput
            label="Birthday"
            value={profile.birthday}
            onFocus={() => isEditing && setShowDatePicker(true)}
            disabled={!isEditing}
            mode="outlined"
            style={styles.input}
            activeOutlineColor="#7F3DFF"
          />

          {showDatePicker && (
            <DateTimePicker
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "calendar"}
              value={profile.birthday ? new Date(profile.birthday) : new Date()}
              onChange={handleDateChange}
            />
          )}
        </BlurView>
      </View>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
      >
        {snackbarMsg}
      </Snackbar>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24 },
  blurCard: { borderRadius: 20, overflow: "hidden" },
  blurContent: { padding: 20, borderRadius: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 16,
  },
  avatarWrap: { alignSelf: "center", marginBottom: 20 },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#7F3DFF",
    backgroundColor: "#fff",
  },
  avatarFallback: { backgroundColor: "#e0e0e0" },
  input: { marginBottom: 12 },
});
