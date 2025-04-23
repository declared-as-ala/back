// services/auth.ts

import { api } from "./api";

export interface RegisterPayload {
  email: string;
  password: string;
  fullName?: string;
  gender?: string;
  age?: number;
  height?: number;
  weight?: number;
  birthday?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface UpdateProfilePayload {
  fullName?: string;
  gender?: string;
  age?: number;
  height?: number;
  weight?: number;
  birthday?: string;
  profileImage?: string;
}

export async function registerUser(payload: RegisterPayload) {
  const response = await api.post("/signup", payload);
  return response.data;
}

export async function loginUser(payload: LoginPayload) {
  const response = await api.post("/login", payload);
  return response.data;
}

export async function getProfile(token: string) {
  const res = await api.get("/profile", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function updateProfile(
  token: string,
  payload: UpdateProfilePayload
) {
  const res = await api.put("/profile", payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function uploadProfileImage(token: string, localUri: string) {
  const filename = localUri.split("/").pop() || "photo.jpg";
  const ext = filename.split(".").pop()?.toLowerCase();
  const mimeType = ext === "png" ? "image/png" : "image/jpeg";

  const formData = new FormData();
  formData.append("profileImage", {
    uri: localUri,
    name: filename,
    type: mimeType,
  } as any);

  const res = await api.post("/profile/upload", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  // Ensure only the filename is returned, not full URL
  const uploadedPath: string = res.data?.user?.profileImage || "";
  const fileNameOnly = uploadedPath.split("/").pop();

  return { profileImage: fileNameOnly };
}
