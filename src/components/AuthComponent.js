import React, { useState, useEffect } from "react";
import { LogIn, LogOut, Mail, Lock, User, AlertCircle } from "lucide-react";

const API_URL = "https://sabrlinguaa-production.up.railway.app/users";

export default function AuthComponent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [showDashboard, setShowDashboard] = useState(false);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("access_token");
    const user = localStorage.getItem("user_data");

    if (token && user) {
      setIsLoggedIn(true);
      setUserData(JSON.parse(user));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = async () => {
    if (!loginData.email || !loginData.password) {
      setError("يرجى إدخال البريد الإلكتروني وكلمة المرور");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const result = await response.json();

      if (response.ok) {
        // Save tokens and user data
        localStorage.setItem("access_token", result.tokens.access);
        localStorage.setItem("refresh_token", result.tokens.refresh);
        localStorage.setItem("token", result.tokens.access); // للداشبورد
        localStorage.setItem("user_data", JSON.stringify(result.user));

        setIsLoggedIn(true);
        setUserData(result.user);

        // Show success and redirect
        setTimeout(() => {
          setShowDashboard(true);
        }, 1000);
      } else {
        setError(result.error_message || "خطأ في تسجيل الدخول");
      }
    } catch (error) {
      console.error("خطأ:", error);
      setError("حدث خطأ في الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);

    try {
      const refreshToken = localStorage.getItem("refresh_token");
      const accessToken = localStorage.getItem("access_token");

      if (refreshToken) {
        await fetch(`${API_URL}/logout/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ refresh: refreshToken }),
        });
      }

      // Clear all stored data
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("token");
      localStorage.removeItem("user_data");

      setIsLoggedIn(false);
      setUserData(null);
      setShowDashboard(false);
      setLoginData({ email: "", password: "" });
    } catch (error) {
      console.error("خطأ في تسجيل الخروج:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) {
      handleLogin();
    }
  };

  // Show Dashboard (this would be imported from your dashboard component)
  if (showDashboard) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6"
        dir="rtl"
      >
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  لوحة التحكم - إدارة الامتحانات
                </h1>
                <p className="text-gray-600">مرحباً {userData?.full_name}</p>
              </div>
              <button
                onClick={handleLogout}
                disabled={loading}
                className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-all"
              >
                <LogOut size={20} />
                تسجيل الخروج
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              تم تسجيل الدخول بنجاح!
            </h2>
            <p className="text-gray-600 mb-6">
              يمكنك الآن الوصول إلى لوحة التحكم لإدارة الامتحانات
            </p>
            <div className="inline-block bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-700">
                📝 في مشروعك الفعلي، سيتم التوجيه إلى صفحة الداشبورد
              </p>
              <p className="text-sm text-green-600 mt-2">
                استخدم: window.location.href = '/admin/tests'
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoggedIn && userData) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4"
        dir="rtl"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mb-4">
              <User className="text-white" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              مرحباً {userData.full_name}
            </h2>
            <p className="text-gray-600">{userData.email}</p>
            <span className="inline-block mt-3 px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
              {userData.user_type === "student"
                ? "طالب"
                : userData.user_type === "admin"
                ? "مدير"
                : userData.user_type === "instructor"
                ? "معلم"
                : userData.user_type}
            </span>
          </div>

          {userData.student_profile && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-700 mb-3">
                معلومات الطالب:
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">المستوى:</span>
                  <span className="font-semibold text-gray-800">
                    {userData.student_profile.overall_level || "غير محدد"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">اختبار تحديد المستوى:</span>
                  <span
                    className={`font-semibold ${
                      userData.student_profile.placement_test_taken
                        ? "text-green-600"
                        : "text-orange-600"
                    }`}
                  >
                    {userData.student_profile.placement_test_taken
                      ? "مكتمل"
                      : "غير مكتمل"}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={() => setShowDashboard(true)}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold shadow-md"
            >
              الذهاب إلى لوحة التحكم
            </button>

            <button
              onClick={handleLogout}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-all font-semibold disabled:opacity-50"
            >
              <LogOut size={20} />
              {loading ? "جاري تسجيل الخروج..." : "تسجيل الخروج"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4"
      dir="rtl"
    >
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-md w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-center">
          <div className="mx-auto w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-4">
            <LogIn className="text-white" size={40} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            منصة صبر التعليمية
          </h1>
          <p className="text-blue-100">مرحباً بك! قم بتسجيل الدخول للمتابعة</p>
        </div>

        {/* Login Form */}
        <div className="p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle
                className="text-red-600 flex-shrink-0 mt-0.5"
                size={20}
              />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <Mail
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="email"
                  value={loginData.email}
                  onChange={(e) =>
                    setLoginData({ ...loginData, email: e.target.value })
                  }
                  onKeyPress={handleKeyPress}
                  className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="example@email.com"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                كلمة المرور
              </label>
              <div className="relative">
                <Lock
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="password"
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData({ ...loginData, password: e.target.value })
                  }
                  onKeyPress={handleKeyPress}
                  className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  جاري تسجيل الدخول...
                </div>
              ) : (
                "تسجيل الدخول"
              )}
            </button>
          </div>

          <div className="mt-6 text-center">
            <a
              href="/reset-password"
              className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
            >
              هل نسيت كلمة المرور؟
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-4 text-center border-t">
          <p className="text-sm text-gray-600">
            ليس لديك حساب؟{" "}
            <a
              href="/register"
              className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
            >
              سجل الآن
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
