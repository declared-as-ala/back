import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import {
  Card,
  Text,
  Button,
  TextInput,
  Snackbar,
  Avatar,
  ActivityIndicator,
  Appbar,
} from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useAppStore } from "@/store";
import { getProfile, updateProfile, uploadProfileImage } from "@/services/auth";

// Reusable field for DRYness
interface ProfileFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: "default" | "numeric";
  disabled: boolean;
}
const ProfileField: React.FC<ProfileFieldProps> = ({
  label,
  value,
  onChangeText,
  keyboardType = "default",
  disabled,
}) => (
  <TextInput
    label={label}
    mode="outlined"
    activeOutlineColor="#7F3DFF"
    value={value}
    onChangeText={onChangeText}
    keyboardType={keyboardType}
    style={styles.input}
    disabled={disabled}
  />
);

export default function ProfileScreen() {
  const token = useAppStore((state) => state.token)!;

  const [profile, setProfile] = useState<any | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const showToast = (msg: string) => {
    setSnackbarMsg(msg);
    setSnackbarVisible(true);
  };

  // fetch profile
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await getProfile(token);
      setProfile(data?.user ?? {});
    } catch (err: any) {
      showToast(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // toggle read-only vs editing
  const toggleEdit = () => {
    if (isEditing) {
      // user pressed SAVE
      handleSave();
    } else {
      setIsEditing(true);
    }
  };

  // save changes
  const handleSave = async () => {
    if (!profile) return;
    try {
      setLoading(true);
      await updateProfile(token, profile);
      showToast("Profile updated!");
      setIsEditing(false);
    } catch (err) {
      showToast("Update failed");
    } finally {
      setLoading(false);
    }
  };

  // pick new photo
  const handlePickPhoto = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        return showToast("Need gallery permission.");
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });
      if (!result.canceled && result.assets[0]?.uri) {
        setLoading(true);
        await uploadProfileImage(token, result.assets[0].uri);
        await fetchProfile();
        showToast("Photo updated!");
      }
    } catch (err) {
      showToast("Photo upload failed");
    } finally {
      setLoading(false);
    }
  };

  // date picker
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate && profile) {
      setProfile({
        ...profile,
        birthday: selectedDate.toISOString().split("T")[0],
      });
    }
  };

  if (loading && !profile) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const editButtonLabel = isEditing ? "SAVE" : "EDIT";

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        {/* Title & Edit button on the right */}
        <Card.Title
          title=""
          titleStyle={styles.title}
          right={() => (
            <Button
              mode="text"
              onPress={toggleEdit}
              textColor="#7F3DFF"
              loading={loading}
            >
              {editButtonLabel}
            </Button>
          )}
        />
        <Card.Content>
          {!profile ? (
            <Text>No profile data</Text>
          ) : (
            <>
              {/* Photo with bigger size */}
              <TouchableOpacity
                style={styles.avatarWrap}
                onPress={handlePickPhoto}
              >
                {profile.profileImage ? (
                  <Avatar.Image
                    source={{ uri: profile.profileImage }}
                    size={120} // bigger pic
                    style={styles.avatar}
                  />
                ) : (
                  <Avatar.Icon
                    icon="account"
                    size={120}
                    style={styles.avatar}
                  />
                )}
              </TouchableOpacity>

              {/* All fields */}
              <ProfileField
                label="Full Name"
                value={profile.fullName ?? ""}
                onChangeText={(val) =>
                  setProfile({ ...profile, fullName: val })
                }
                disabled={!isEditing}
              />
              <ProfileField
                label="Gender"
                value={profile.gender ?? ""}
                onChangeText={(val) => setProfile({ ...profile, gender: val })}
                disabled={!isEditing}
              />
              <ProfileField
                label="Age"
                value={profile.age?.toString() ?? ""}
                keyboardType="numeric"
                onChangeText={(val) =>
                  setProfile({ ...profile, age: parseInt(val) || null })
                }
                disabled={!isEditing}
              />
              <ProfileField
                label="Height (cm)"
                value={profile.height?.toString() ?? ""}
                keyboardType="numeric"
                onChangeText={(val) =>
                  setProfile({ ...profile, height: parseFloat(val) || null })
                }
                disabled={!isEditing}
              />
              <ProfileField
                label="Weight (kg)"
                value={profile.weight?.toString() ?? ""}
                keyboardType="numeric"
                onChangeText={(val) =>
                  setProfile({ ...profile, weight: parseFloat(val) || null })
                }
                disabled={!isEditing}
              />

              {/* Birthday with date picker */}
              <TextInput
                label="Birthday"
                mode="outlined"
                activeOutlineColor="#7F3DFF"
                value={profile.birthday ?? ""}
                style={styles.input}
                disabled={!isEditing}
                onFocus={() => {
                  if (isEditing) {
                    setShowDatePicker(true);
                  }
                }}
              />
              {showDatePicker && (
                <DateTimePicker
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "calendar"}
                  value={
                    profile.birthday ? new Date(profile.birthday) : new Date()
                  }
                  onChange={handleDateChange}
                />
              )}
            </>
          )}
        </Card.Content>
      </Card>

      <Snackbar
        visible={snackbarVisible && !!snackbarMsg}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
      >
        {snackbarMsg}
      </Snackbar>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  card: {
    padding: 16,
    backgroundColor: "#F8ECFF", // soft mauve background
    borderRadius: 16,
  },
  title: {
    color: "#7F3DFF",
    fontWeight: "bold",
  },
  avatarWrap: {
    alignSelf: "center",
    marginBottom: 16,
  },
  avatar: {},
  input: {
    marginBottom: 12,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
