// src/pages/ResetPassword.jsx
import { useState } from "react";
import { useParams } from "react-router-dom";
import { authAPI } from "../api/auth"; // عدّل المسار حسب مشروعك

export default function ResetPassword() {
  const { uidb64, token } = useParams();

  const [formData, setFormData] = useState({
    new_password: "",
    confirm_password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.new_password !== formData.confirm_password) {
      setError("كلمتا المرور غير متطابقتين");
      return;
    }

    if (formData.new_password.length < 8) {
      setError("كلمة المرور يجب أن تكون 8 أحرف على الأقل");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await authAPI.resetPassword({
        uidb64,
        token,
        new_password: formData.new_password,
        confirm_password: formData.confirm_password,
      });
      setSuccess(true);
    } catch (err) {
      setError(
        err?.response?.data?.error_message ||
          "الرابط غير صالح أو منتهي الصلاحية. يرجى طلب رابط جديد."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            إعادة تعيين كلمة المرور
          </h1>
          <p className="text-gray-500 text-sm mt-2">أدخل كلمة المرور الجديدة</p>
        </div>

        {success ? (
          /* ✅ Success State */
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              تم إعادة تعيين كلمة المرور بنجاح! 🎉
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              يرجى العودة للتطبيق وتسجيل الدخول بكلمة المرور الجديدة
            </p>
          </div>
        ) : (
          /* 📝 Form */
          <form onSubmit={handleSubmit} className="space-y-5" dir="rtl">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                كلمة المرور الجديدة
              </label>
              <input
                type="password"
                name="new_password"
                value={formData.new_password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                تأكيد كلمة المرور
              </label>
              <input
                type="password"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2.5 rounded-lg transition-colors text-sm"
            >
              {loading ? "جاري التحديث..." : "تعيين كلمة المرور"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
