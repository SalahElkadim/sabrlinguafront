import axios from "axios";

const API_URL =
  process.env.REACT_APP_API_URL ||
  "https://sabrlinguaa-production.up.railway.app";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// طلب إعادة تعيين كلمة المرور (إرسال الإيميل)
export const requestPasswordReset = async (email) => {
  try {
    const response = await api.post("/auth/forgot-password/", { email });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// تأكيد إعادة تعيين كلمة المرور (مع uidb64 و token)
export const confirmPasswordReset = async (uidb64, token, newPassword, confirmPassword) => {
  try {
    const response = await api.post("/auth/reset-password/", {
      uidb64,
      token,
      new_password: newPassword,
      new_password_confirm: confirmPassword,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default api;
