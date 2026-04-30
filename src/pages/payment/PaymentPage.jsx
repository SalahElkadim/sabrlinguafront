import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

export default function PaymentPage() {
  const [searchParams] = useSearchParams();

  const [step, setStep] = useState("loading");
  const [program, setProgram] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [moyasarReady, setMoyasarReady] = useState(false);
  const formRef = useRef(null);
  const initializedRef = useRef(false);

  const programId = searchParams.get("program_id");
  const token = searchParams.get("token");

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdn.moyasar.com/mpf/1.14.0/moyasar.css";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = "https://cdn.moyasar.com/mpf/1.14.0/moyasar.js";
    script.async = true;
    script.onload = () => setMoyasarReady(true);
    script.onerror = () => {
      setErrorMsg("تعذر تحميل بوابة الدفع، تحقق من الاتصال بالإنترنت");
      setStep("error");
    };
    document.body.appendChild(script);

    return () => {
      if (document.head.contains(link)) document.head.removeChild(link);
      if (document.body.contains(script)) document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (!programId || !token) {
      setErrorMsg("بيانات ناقصة، يرجى العودة والمحاولة مجدداً");
      setStep("error");
      return;
    }

    axios
      .get(`${process.env.REACT_APP_URL}/booking/programs/${programId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setProgram(res.data);
        setStep("form");
      })
      .catch(() => {
        setErrorMsg("تعذر جلب بيانات البرنامج");
        setStep("error");
      });
  }, [programId, token]);

  useEffect(() => {
    if (
      step !== "form" ||
      !moyasarReady ||
      !program ||
      !formRef.current ||
      initializedRef.current
    )
      return;

    const timer = setTimeout(() => {
      if (!window.Moyasar) return;

      initializedRef.current = true;

      const callbackUrl =
        `${window.location.origin}/payment/callback` +
        `?token=${encodeURIComponent(token)}` +
        `&program_id=${encodeURIComponent(programId)}`;

      window.Moyasar.init({
        element: ".moyasar-form-container",
        amount: Math.round(program.price * 100),
        currency: "SAR",
        description: `اشتراك في برنامج: ${program.title}`,
        publishable_api_key: process.env.REACT_APP_MOYASAR_PUBLISHABLE_KEY,
        callback_url: callbackUrl,
        methods: ["creditcard"],
        on_initiating: () => true,
        on_failed: (error) => {
          setErrorMsg(
            error?.message || "فشلت عملية الدفع، يرجى المحاولة مجدداً"
          );
          setStep("error");
        },
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [step, moyasarReady, program, token, programId]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800;900&family=DM+Serif+Display:ital@0;1&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --gold: #C9A84C;
          --gold-light: #E8C97A;
          --gold-pale: rgba(201,168,76,0.12);
          --dark: #0B0B0F;
          --dark-2: #111118;
          --dark-card: #16161F;
          --dark-border: rgba(201,168,76,0.18);
          --text-primary: #F0EDE6;
          --text-muted: #8A8799;
          --text-dim: #4A4860;
          --success: #3DDC97;
          --danger: #FF6B6B;
        }

        body {
          font-family: 'Tajawal', sans-serif;
          direction: rtl;
          background: var(--dark);
          color: var(--text-primary);
          -webkit-font-smoothing: antialiased;
        }

        /* ── Page layout ── */
        .pay-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 32px 16px;
          position: relative;
          overflow: hidden;
        }

        /* Ambient orbs */
        .pay-page::before,
        .pay-page::after {
          content: '';
          position: fixed;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(90px);
          opacity: 0.35;
        }
        .pay-page::before {
          width: 600px; height: 600px;
          background: radial-gradient(circle, #C9A84C 0%, transparent 65%);
          top: -200px; right: -150px;
        }
        .pay-page::after {
          width: 500px; height: 500px;
          background: radial-gradient(circle, #6B4FCB 0%, transparent 65%);
          bottom: -180px; left: -150px;
          opacity: 0.2;
        }

        /* Noise texture overlay */
        .pay-page-noise {
          position: fixed;
          inset: 0;
          pointer-events: none;
          opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 200px;
        }

        /* ── Card ── */
        .pay-card {
          position: relative;
          width: 100%;
          max-width: 460px;
          background: var(--dark-card);
          border-radius: 24px;
          border: 1px solid var(--dark-border);
          padding: 36px 32px 28px;
          box-shadow:
            0 0 0 1px rgba(201,168,76,0.06),
            0 24px 80px rgba(0,0,0,0.6),
            0 4px 16px rgba(0,0,0,0.4);
          animation: cardIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
          overflow: hidden;
        }

        /* Top shimmer line */
        .pay-card::before {
          content: '';
          position: absolute;
          top: 0; left: 10%; right: 10%;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--gold-light), transparent);
          opacity: 0.6;
        }

        /* Corner glow */
        .pay-card::after {
          content: '';
          position: absolute;
          top: -60px; right: -60px;
          width: 200px; height: 200px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%);
          pointer-events: none;
        }

        @keyframes cardIn {
          from { opacity: 0; transform: translateY(28px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* ── Header ── */
        .pay-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 28px;
        }

        .pay-logo {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .pay-logo-icon {
          width: 38px; height: 38px;
          border-radius: 10px;
          background: linear-gradient(135deg, #C9A84C, #8B6914);
          display: flex; align-items: center; justify-content: center;
          font-size: 18px;
          box-shadow: 0 4px 16px rgba(201,168,76,0.35);
        }

        .pay-logo-text {
          font-family: 'DM Serif Display', serif;
          font-size: 17px;
          color: var(--gold-light);
          letter-spacing: 0.3px;
        }

        .pay-secure-badge {
          display: flex;
          align-items: center;
          gap: 5px;
          background: rgba(61,220,151,0.08);
          border: 1px solid rgba(61,220,151,0.2);
          border-radius: 20px;
          padding: 5px 12px;
          font-size: 11px;
          font-weight: 700;
          color: var(--success);
          letter-spacing: 0.3px;
        }

        .pay-secure-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--success);
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }

        /* ── Separator ── */
        .pay-sep {
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--dark-border), transparent);
          margin: 0 -32px 28px;
        }

        /* ── Program box ── */
        .pay-program-box {
          background: rgba(201,168,76,0.05);
          border: 1px solid rgba(201,168,76,0.14);
          border-radius: 16px;
          padding: 18px 20px;
          margin-bottom: 28px;
          position: relative;
          overflow: hidden;
        }

        .pay-program-box::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--gold), transparent);
          opacity: 0.5;
        }

        .pay-program-label {
          font-size: 10px;
          font-weight: 800;
          color: var(--gold);
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin-bottom: 6px;
        }

        .pay-program-title {
          font-size: 16px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 16px;
          line-height: 1.4;
        }

        .pay-program-divider {
          height: 1px;
          background: rgba(201,168,76,0.12);
          margin-bottom: 14px;
        }

        .pay-amount-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .pay-amount-label {
          font-size: 12px;
          color: var(--text-muted);
          font-weight: 500;
        }

        .pay-amount-value {
          font-family: 'DM Serif Display', serif;
          font-size: 26px;
          color: var(--gold-light);
          line-height: 1;
        }

        .pay-amount-currency {
          font-family: 'Tajawal', sans-serif;
          font-size: 13px;
          font-weight: 600;
          color: var(--gold);
          margin-right: 4px;
          vertical-align: middle;
        }

        /* ── Loading ── */
        .pay-loading {
          text-align: center;
          padding: 48px 0;
          animation: fadeIn 0.4s ease;
        }

        .pay-spinner-wrap {
          position: relative;
          width: 56px; height: 56px;
          margin: 0 auto 20px;
        }

        .pay-spinner-track {
          width: 56px; height: 56px;
          border-radius: 50%;
          border: 2px solid rgba(201,168,76,0.12);
          position: absolute;
        }

        .pay-spinner {
          width: 56px; height: 56px;
          border-radius: 50%;
          border: 2px solid transparent;
          border-top-color: var(--gold);
          border-right-color: rgba(201,168,76,0.4);
          position: absolute;
          animation: spin 1s cubic-bezier(0.4,0,0.2,1) infinite;
        }

        .pay-loading-title {
          font-size: 15px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .pay-loading-sub {
          font-size: 13px;
          color: var(--text-muted);
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── Error ── */
        .pay-error {
          text-align: center;
          padding: 32px 0 8px;
          animation: fadeIn 0.4s ease;
        }

        .pay-error-icon-wrap {
          width: 72px; height: 72px;
          border-radius: 50%;
          background: rgba(255,107,107,0.08);
          border: 1px solid rgba(255,107,107,0.2);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 16px;
          font-size: 32px;
        }

        .pay-error-title {
          font-size: 18px;
          font-weight: 800;
          color: var(--danger);
          margin-bottom: 8px;
        }

        .pay-error-msg {
          font-size: 14px;
          color: var(--text-muted);
          line-height: 1.7;
          margin-bottom: 24px;
          max-width: 280px;
          margin-left: auto;
          margin-right: auto;
        }

        .pay-back-btn {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 12px 28px;
          font-family: 'Tajawal', sans-serif;
          font-size: 14px;
          font-weight: 700;
          color: var(--text-primary);
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
        }

        .pay-back-btn:hover {
          background: rgba(255,255,255,0.1);
          border-color: rgba(255,255,255,0.2);
        }

        /* ── Footer ── */
        .pay-footer {
          margin-top: 24px;
          text-align: center;
          font-size: 11px;
          color: var(--text-dim);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .pay-footer-dot {
          width: 3px; height: 3px;
          border-radius: 50%;
          background: var(--text-dim);
        }

        .pay-footer a {
          color: var(--gold);
          text-decoration: none;
          font-weight: 700;
        }

        .pay-footer a:hover { color: var(--gold-light); }

        /* ── Moyasar overrides ── */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .moyasar-form-container { animation: fadeIn 0.5s ease; }

        /* Section title */
        .pay-form-title {
          font-size: 11px;
          font-weight: 800;
          color: var(--text-dim);
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin-bottom: 16px;
        }

        .mysr-form { font-family: 'Tajawal', sans-serif !important; direction: rtl; }

        .mysr-form label {
          font-family: 'Tajawal', sans-serif !important;
          font-size: 12px !important;
          color: var(--text-muted) !important;
          font-weight: 700 !important;
          letter-spacing: 0.3px !important;
          text-transform: uppercase !important;
          margin-bottom: 6px !important;
        }

        .mysr-form input {
          font-family: 'Tajawal', sans-serif !important;
          background: rgba(255,255,255,0.04) !important;
          border: 1px solid rgba(255,255,255,0.09) !important;
          border-radius: 12px !important;
          padding: 13px 16px !important;
          font-size: 15px !important;
          color: var(--text-primary) !important;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s !important;
        }

        .mysr-form input::placeholder {
          color: var(--text-dim) !important;
        }

        .mysr-form input:focus {
          border-color: rgba(201,168,76,0.45) !important;
          background: rgba(201,168,76,0.04) !important;
          box-shadow: 0 0 0 3px rgba(201,168,76,0.08) !important;
          outline: none !important;
        }

        .mysr-form button[type="submit"] {
          background: linear-gradient(135deg, #C9A84C 0%, #8B6914 100%) !important;
          border: none !important;
          border-radius: 14px !important;
          padding: 16px !important;
          font-family: 'Tajawal', sans-serif !important;
          font-size: 16px !important;
          font-weight: 800 !important;
          color: #0B0B0F !important;
          cursor: pointer !important;
          margin-top: 10px !important;
          letter-spacing: 0.3px !important;
          box-shadow: 0 6px 24px rgba(201,168,76,0.3) !important;
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s !important;
          width: 100% !important;
        }

        .mysr-form button[type="submit"]:hover {
          opacity: 0.92 !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 10px 32px rgba(201,168,76,0.4) !important;
        }

        .mysr-form button[type="submit"]:active {
          transform: translateY(0) !important;
          box-shadow: 0 4px 16px rgba(201,168,76,0.25) !important;
        }

        /* Mobile */
        @media (max-width: 480px) {
          .pay-card { padding: 28px 20px 22px; border-radius: 20px; }
          .pay-sep { margin: 0 -20px 24px; }
        }
      `}</style>

      <div className="pay-page">
        <div className="pay-page-noise" />

        <div className="pay-card">
          {/* Header */}
          <div className="pay-header">
            <div className="pay-logo">
              <div className="pay-logo-icon">🎓</div>
              <span className="pay-logo-text">Sabrlingua</span>
            </div>
            <div className="pay-secure-badge">
              <div className="pay-secure-dot" />
              دفع آمن
            </div>
          </div>

          <div className="pay-sep" />

          {/* Program info */}
          {program && step !== "error" && (
            <div className="pay-program-box">
              <p className="pay-program-label">البرنامج المختار</p>
              <p className="pay-program-title">{program.title}</p>
              <div className="pay-program-divider" />
              <div className="pay-amount-row">
                <span className="pay-amount-label">إجمالي المبلغ</span>
                <div>
                  <span className="pay-amount-value">
                    {program.price?.toLocaleString("ar-SA")}
                  </span>
                  <span className="pay-amount-currency">ريال</span>
                </div>
              </div>
            </div>
          )}

          {/* Loading */}
          {step === "loading" && (
            <div className="pay-loading">
              <div className="pay-spinner-wrap">
                <div className="pay-spinner-track" />
                <div className="pay-spinner" />
              </div>
              <p className="pay-loading-title">جاري تحضير بوابة الدفع</p>
              <p className="pay-loading-sub">لحظة من فضلك...</p>
            </div>
          )}

          {/* Error */}
          {step === "error" && (
            <div className="pay-error">
              <div className="pay-error-icon-wrap">⚠️</div>
              <p className="pay-error-title">حدث خطأ</p>
              <p className="pay-error-msg">{errorMsg}</p>
              <button
                className="pay-back-btn"
                onClick={() => window.history.back()}
              >
                ← العودة للخلف
              </button>
            </div>
          )}

          {/* Moyasar form */}
          <div
            ref={formRef}
            style={{ display: step === "form" ? "block" : "none" }}
          >
            <p className="pay-form-title">بيانات البطاقة</p>
            <div className="moyasar-form-container" />
          </div>

          {/* Footer */}
          <div className="pay-footer">
            <span>مدعوم بواسطة</span>
            <a href="https://moyasar.com" target="_blank" rel="noreferrer">
              Moyasar
            </a>
            <div className="pay-footer-dot" />
            <span>مشفّر بـ SSL 256-bit</span>
          </div>
        </div>
      </div>
    </>
  );
}
