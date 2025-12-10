import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ResetPassword from "./components/ResetPassword";
import ResetPasswordConfirm from "./components/ResetPasswordConfirm";

function App() {
  return (
    <Router>
      <Routes>
        {/* صفحة طلب إعادة تعيين كلمة المرور */}
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* صفحة تأكيد إعادة تعيين كلمة المرور (مع الـ token) */}
        <Route
          path="/reset-password/:token"
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
