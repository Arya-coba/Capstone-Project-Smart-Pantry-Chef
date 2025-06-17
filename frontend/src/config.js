// Konfigurasi API
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api"; // '/api' will be proxied to backend in dev

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const API_ENDPOINTS = {
  RECIPES: "/recipes/by-ingredients",
  AUTH_REGISTER: "/auth/register",
  AUTH_LOGIN: "/auth/login",
  // Tambahkan endpoint lain di sini
};

export { api };

export default {
  API_BASE_URL,
  ...API_ENDPOINTS,
};
