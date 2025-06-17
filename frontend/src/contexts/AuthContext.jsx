import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { api, API_ENDPOINTS } from "../config";

export const AuthContext = createContext(null);



export function AuthProvider({ children }) {
  const [user, setUser] = useState(
    () => JSON.parse(localStorage.getItem("spc_user")) || null,
  );
  const [token, setToken] = useState(
    () => localStorage.getItem("spc_token") || "",
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Attach token to axios
  useEffect(() => {
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common.Authorization;
    }
  }, [token]);

  const saveAuth = useCallback((tokenValue, userData) => {
    setToken(tokenValue);
    setUser(userData);
    localStorage.setItem("spc_token", tokenValue);
    localStorage.setItem("spc_user", JSON.stringify(userData));
  }, []);

  const clearAuth = useCallback(() => {
    setToken("");
    setUser(null);
    localStorage.removeItem("spc_token");
    localStorage.removeItem("spc_user");
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError("");
      const res = await api.post(API_ENDPOINTS.AUTH_LOGIN, { email, password });
      saveAuth(res.data.token, res.data.user);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    try {
      setLoading(true);
      setError("");
      await api.post(API_ENDPOINTS.AUTH_REGISTER, { name, email, password });
      // after successful registration, auto login
      return login(email, password);
    } catch (err) {
      const msg = err.response?.data?.message || "Register failed";
      setError(msg);
      setLoading(false);
      return { success: false, message: msg };
    }
  };

  const value = {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout: clearAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
