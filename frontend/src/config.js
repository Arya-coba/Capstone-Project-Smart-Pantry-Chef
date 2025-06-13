// Konfigurasi API
const isDevelopment = process.env.NODE_ENV === "development";
const API_BASE_URL = isDevelopment ? "" : "http://localhost:5000";

export const API_ENDPOINTS = {
  RECIPES: `/api/recipes/by-ingredients`, // Gunakan path relatif untuk proxy
  // Tambahkan endpoint lain di sini
};

export default {
  API_BASE_URL,
  ...API_ENDPOINTS,
};
