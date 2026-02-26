import { create } from "zustand";
import { authAPI } from "../api/auth";

export const useAuthStore = create((set) => ({
  user: authAPI.getCurrentUser(),
  isAuthenticated: authAPI.isAuthenticated(),
  loading: false,
  error: null,

  // Login
  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const data = await authAPI.login(credentials);
      set({ user: data.user, isAuthenticated: true, loading: false });
      return data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.error_message || "حدث خطأ في تسجيل الدخول";
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  // Register
  register: async (userData) => {
    set({ loading: true, error: null });
    try {
      const data = await authAPI.register(userData);
      set({ loading: false });
      return data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.error_message || "حدث خطأ في التسجيل";
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  // Verify Email
  verifyEmail: async (verificationData) => {
    set({ loading: true, error: null });
    try {
      const data = await authAPI.verifyEmail(verificationData);
      set({ user: data.user, isAuthenticated: true, loading: false });
      return data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.error_message || "حدث خطأ في التحقق";
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  // Logout
  logout: async () => {
    set({ loading: true });
    try {
      await authAPI.logout();
      set({ user: null, isAuthenticated: false, loading: false });
    } catch (error) {
      set({ user: null, isAuthenticated: false, loading: false });
    }
  },

  // Forgot Password
  forgotPassword: async (email) => {
    set({ loading: true, error: null });
    try {
      const data = await authAPI.forgotPassword(email);
      set({ loading: false });
      return data;
    } catch (error) {
      const errorMessage = error.response?.data?.error_message || "حدث خطأ";
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  // Reset Password
  resetPassword: async (resetData) => {
    set({ loading: true, error: null });
    try {
      const data = await authAPI.resetPassword(resetData);
      set({ loading: false });
      return data;
    } catch (error) {
      const errorMessage = error.response?.data?.error_message || "حدث خطأ";
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  // Clear error
  clearError: () => set({ error: null }),
}));
