import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ResetPassword from "./components/ResetPassword";
import ResetPasswordConfirm from "./components/ResetPasswordConfirm";
import PlacementTestsDashboard from "./components/PlacementTestsDashboard";
import AuthComponent from "./components/AuthComponent";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("access_token");
  return token ? children : <Navigate to="/login" />;
};
function App() {
  return (
    <Router>
      <Routes>
        {/* صفحة طلب إعادة تعيين كلمة المرور */}
        <Route path="/reset-password" element={<ResetPassword />} />
        <Routes>
          {/* صفحة تسجيل الدخول */}
          <Route path="/login" element={<AuthComponent />} />

          {/* صفحة الداشبورد (محمية) */}
          <Route
            path="/admin/tests"
            element={
              <ProtectedRoute>
                <PlacementTestsDashboard />
              </ProtectedRoute>
            }
          />

          {/* الصفحة الرئيسية */}
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
        {/* صفحة تأكيد إعادة تعيين كلمة المرور (مع uidb64 و token) */}
        <Route
          path="/reset-password/:uidb64/:token"
          element={<ResetPasswordConfirm />}
        />

        {/* صفحة افتراضية */}
        <Route
          path="/"
          element={
            <div style={{ textAlign: "center", padding: "50px" }}>
              <h1>Welcome to Sabr Learning Platform</h1>
              <a href="/reset-password">Reset Password</a>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
