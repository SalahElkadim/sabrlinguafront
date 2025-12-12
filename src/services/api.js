import axios from "axios";

const API_URL =
  process.env.REACT_APP_API_URL ||
  "https://sabrlinguaa-production.up.railway.app/auth";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// طلب إعادة تعيين كلمة المرور (إرسال الإيميل)
export const requestPasswordReset = async (email) => {
  try {
    const response = await api.post("/auth/password-reset/", { email });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// تأكيد إعادة تعيين كلمة المرور (مع الـ token)
export const confirmPasswordReset = async (token, newPassword) => {
  try {
    const response = await api.post("/auth/password-reset-confirm/", {
      token,
      new_password: newPassword,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default api;
