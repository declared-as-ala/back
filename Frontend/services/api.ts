// services/api.ts
import axios from "axios";

// Adjust this to your actual backend endpoint
export const API_BASE_URL = "https://sour-trains-swim.loca.lt/api";
// e.g., 'http://192.168.1.12:3000/api' if on local network

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
});

// Optionally handle token injection with interceptors (we’ll add soon)
