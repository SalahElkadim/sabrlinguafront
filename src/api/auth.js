import api from "./axios";

export const authAPI = {
  // Register
  register: async (data) => {
    const response = await api.post("/auth/register/", data);
    return response.data;
  },

  // Verify Email
  verifyEmail: async (data) => {
    const response = await api.post("/auth/verify-email/", data);
    return response.data;
  },

  // Resend Verification
  resendVerification: async (data) => {
    const response = await api.post("/auth/resend-verification/", data);
    return response.data;
  },

  // Login
  login: async (data) => {
    const response = await api.post("/auth/login/", data);
    if (response.data.tokens) {
      localStorage.setItem("access_token", response.data.tokens.access);
      localStorage.setItem("refresh_token", response.data.tokens.refresh);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Logout
  logout: async () => {
    const refreshToken = localStorage.getItem("refresh_token");
    try {
      await api.post("/auth/logout/", { refresh: refreshToken });
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
    }
  },

  // Forgot Password
  forgotPassword: async (data) => {
    const response = await api.post("/auth/forgot-password/", data);
    return response.data;
  },

  // Reset Password
  resetPassword: async (data) => {
    const response = await api.post("/auth/reset-password/", data);
    return response.data;
  },

  // Change Password
  changePassword: async (data) => {
    const response = await api.post("/auth/change-password/", data);
    return response.data;
  },

  // Get current user
  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem("access_token");
  },
};
