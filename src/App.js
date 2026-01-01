import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ResetPassword from "./components/ResetPassword";
import ResetPasswordConfirm from "./components/ResetPasswordConfirm";
import AuthComponent from "./components/AuthComponent";
import MainDashboard from "./components/MainDashboard";

// Protected Route Component - للصفحات المحمية
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("access_token");
  return token ? children : <Navigate to="/login" replace />;
};

// Public Route Component - لمنع المستخدم المسجل من الوصول لصفحة تسجيل الدخول
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("access_token");
  return token ? <Navigate to="/dashboard" replace /> : children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* صفحة تسجيل الدخول - الصفحة الرئيسية */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <AuthComponent />
            </PublicRoute>
          }
        />

        {/* صفحة تسجيل الدخول - مسار بديل */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <AuthComponent />
            </PublicRoute>
          }
        />

        {/* الداشبورد الرئيسي - يحتوي على كل الصفحات */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainDashboard />
            </ProtectedRoute>
          }
        />

        {/* صفحة طلب إعادة تعيين كلمة المرور */}
        <Route
          path="/reset-password"
          element={
            <PublicRoute>
              <ResetPassword />
            </PublicRoute>
          }
        />

        {/* صفحة تأكيد إعادة تعيين كلمة المرور */}
        <Route
          path="/reset-password/:uidb64/:token"
          element={<ResetPasswordConfirm />}
        />

        {/* أي مسار غير موجود - توجيه للصفحة الرئيسية */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
