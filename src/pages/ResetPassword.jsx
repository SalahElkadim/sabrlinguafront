// src/pages/ResetPassword.jsx
import { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "https://sabrlinguaa-production.up.railway.app";

export default function ResetPassword() {
  const { uidb64, token } = useParams();

  const [formData, setFormData] = useState({
    new_password: "",
    new_password_confirm: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.new_password !== formData.new_password_confirm) {
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
      await axios.post(
        `${API_BASE_URL}/auth/reset-password/`,
        {
          uidb64,
          token,
          new_password: formData.new_password,
          new_password_confirm: formData.new_password_confirm,
        },
        { headers: { "Content-Type": "application/json" } }
      );
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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&display=swap');

        :root {
          --navy: #2D2A6E;
          --navy-dark: #1e1c52;
          --navy-light: #3d3a8a;
          --yellow: #F5E642;
          --yellow-light: #fdf9c4;
          --yellow-muted: #f0d800;
          --white: #ffffff;
          --gray-soft: #f7f7fb;
          --text-muted: #7b789e;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .rp-root {
          min-height: 100vh;
          background: var(--gray-soft);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Cairo', sans-serif;
          direction: rtl;
          padding: 1.5rem;
          position: relative;
          overflow: hidden;
        }

        /* خلفية زخرفية */
        .rp-root::before {
          content: '';
          position: fixed;
          top: -120px;
          right: -120px;
          width: 420px;
          height: 420px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(45,42,110,0.12) 0%, transparent 70%);
          pointer-events: none;
        }
        .rp-root::after {
          content: '';
          position: fixed;
          bottom: -100px;
          left: -100px;
          width: 360px;
          height: 360px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(245,230,66,0.15) 0%, transparent 70%);
          pointer-events: none;
        }

        .rp-card {
          background: var(--white);
          border-radius: 24px;
          width: 100%;
          max-width: 440px;
          box-shadow:
            0 4px 6px rgba(45,42,110,0.04),
            0 20px 60px rgba(45,42,110,0.12);
          overflow: hidden;
          animation: cardIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes cardIn {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Header شريط علوي */
        .rp-header {
          background: var(--navy);
          padding: 2rem 2rem 1.75rem;
          text-align: center;
          position: relative;
        }

        .rp-header-accent {
          position: absolute;
          bottom: -1px;
          left: 0; right: 0;
          height: 6px;
          background: var(--yellow);
        }

        .rp-icon-wrap {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: rgba(245,230,66,0.15);
          border: 2px solid rgba(245,230,66,0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
        }

        .rp-icon-wrap svg {
          width: 30px;
          height: 30px;
          color: var(--yellow);
        }

        .rp-title {
          font-size: 1.4rem;
          font-weight: 800;
          color: var(--white);
          margin-bottom: 0.35rem;
        }

        .rp-subtitle {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.55);
          font-weight: 400;
        }

        /* Body */
        .rp-body {
          padding: 2rem;
        }

        /* Error */
        .rp-error {
          background: #fff2f2;
          border: 1px solid #fcc;
          border-right: 4px solid #e05252;
          border-radius: 10px;
          padding: 0.75rem 1rem;
          font-size: 0.83rem;
          color: #c0392b;
          margin-bottom: 1.25rem;
          animation: shake 0.3s ease;
        }

        @keyframes shake {
          0%,100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          75% { transform: translateX(6px); }
        }

        /* Field */
        .rp-field {
          margin-bottom: 1.25rem;
        }

        .rp-label {
          display: block;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--navy);
          margin-bottom: 0.5rem;
        }

        .rp-input-wrap {
          position: relative;
        }

        .rp-input {
          width: 100%;
          background: var(--gray-soft);
          border: 1.5px solid #e4e3f0;
          border-radius: 12px;
          padding: 0.8rem 1rem 0.8rem 3rem;
          font-size: 0.9rem;
          font-family: 'Cairo', sans-serif;
          color: var(--navy-dark);
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          text-align: right;
        }

        .rp-input:focus {
          border-color: var(--navy-light);
          background: var(--white);
          box-shadow: 0 0 0 4px rgba(45,42,110,0.07);
        }

        .rp-eye-btn {
          position: absolute;
          left: 0.85rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text-muted);
          padding: 0.2rem;
          display: flex;
          align-items: center;
          transition: color 0.2s;
        }
        .rp-eye-btn:hover { color: var(--navy); }
        .rp-eye-btn svg { width: 18px; height: 18px; }

        /* Submit Button */
        .rp-btn {
          width: 100%;
          background: var(--navy);
          color: var(--yellow);
          font-family: 'Cairo', sans-serif;
          font-size: 0.95rem;
          font-weight: 700;
          padding: 0.9rem;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          margin-top: 0.5rem;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          letter-spacing: 0.01em;
        }

        .rp-btn:hover:not(:disabled) {
          background: var(--navy-light);
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(45,42,110,0.2);
        }

        .rp-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .rp-btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .rp-btn-inner {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        /* Spinner */
        .rp-spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(245,230,66,0.35);
          border-top-color: var(--yellow);
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Success */
        .rp-success {
          text-align: center;
          padding: 1rem 0.5rem 0.5rem;
          animation: cardIn 0.45s ease both;
        }

        .rp-success-icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--navy) 0%, var(--navy-light) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.25rem;
          box-shadow: 0 8px 28px rgba(45,42,110,0.25);
        }

        .rp-success-icon svg {
          width: 36px;
          height: 36px;
          color: var(--yellow);
        }

        .rp-success-badge {
          display: inline-block;
          background: var(--yellow-light);
          color: var(--navy-dark);
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.3rem 0.9rem;
          border-radius: 100px;
          margin-bottom: 0.9rem;
          border: 1px solid rgba(245,230,66,0.6);
        }

        .rp-success-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--navy-dark);
          margin-bottom: 0.6rem;
        }

        .rp-success-msg {
          font-size: 0.875rem;
          color: var(--text-muted);
          line-height: 1.75;
          max-width: 280px;
          margin: 0 auto;
        }

        .rp-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, #e4e3f0, transparent);
          margin: 1.5rem 0;
        }
      `}</style>

      <div className="rp-root">
        <div className="rp-card">
          {/* ── Header ── */}
          <div className="rp-header">
            <div className="rp-icon-wrap">
              <svg
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
                />
              </svg>
            </div>
            <h1 className="rp-title">إعادة تعيين كلمة المرور</h1>
            <p className="rp-subtitle">أدخل كلمة المرور الجديدة لحسابك</p>
            <div className="rp-header-accent" />
          </div>

          {/* ── Body ── */}
          <div className="rp-body">
            {success ? (
              <div className="rp-success">
                <div className="rp-success-icon">
                  <svg
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                </div>
                <span className="rp-success-badge">✓ تمت العملية بنجاح</span>
                <h2 className="rp-success-title">تم تغيير كلمة المرور!</h2>
                <div className="rp-divider" />
                <p className="rp-success-msg">
                  يرجى العودة للتطبيق وتسجيل الدخول بكلمة المرور الجديدة
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {error && <div className="rp-error">{error}</div>}

                {/* كلمة المرور الجديدة */}
                <div className="rp-field">
                  <label className="rp-label">كلمة المرور الجديدة</label>
                  <div className="rp-input-wrap">
                    <input
                      className="rp-input"
                      type={showPass ? "text" : "password"}
                      name="new_password"
                      value={formData.new_password}
                      onChange={handleChange}
                      required
                      placeholder="أدخل كلمة المرور"
                    />
                    <button
                      type="button"
                      className="rp-eye-btn"
                      onClick={() => setShowPass(!showPass)}
                    >
                      {showPass ? (
                        <svg
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                          />
                        </svg>
                      ) : (
                        <svg
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* تأكيد كلمة المرور */}
                <div className="rp-field">
                  <label className="rp-label">تأكيد كلمة المرور</label>
                  <div className="rp-input-wrap">
                    <input
                      className="rp-input"
                      type={showConfirm ? "text" : "password"}
                      name="new_password_confirm"
                      value={formData.new_password_confirm}
                      onChange={handleChange}
                      required
                      placeholder="أعد إدخال كلمة المرور"
                    />
                    <button
                      type="button"
                      className="rp-eye-btn"
                      onClick={() => setShowConfirm(!showConfirm)}
                    >
                      {showConfirm ? (
                        <svg
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                          />
                        </svg>
                      ) : (
                        <svg
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <button type="submit" className="rp-btn" disabled={loading}>
                  <div className="rp-btn-inner">
                    {loading && <div className="rp-spinner" />}
                    {loading ? "جاري التحديث..." : "تعيين كلمة المرور"}
                  </div>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
