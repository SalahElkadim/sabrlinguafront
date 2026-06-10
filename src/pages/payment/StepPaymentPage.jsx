// src/pages/payment/StepPaymentPage.jsx
import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

export default function StepPaymentPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [step, setStep] = useState("loading"); // loading | select | paying | error
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [moyasarReady, setMoyasarReady] = useState(false);
  const formRef = useRef(null);
  const initializedRef = useRef(false);

  // تحميل Moyasar
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
      setErrorMsg("تعذر تحميل بوابة الدفع");
      setStep("error");
    };
    document.body.appendChild(script);

    return () => {
      if (document.head.contains(link)) document.head.removeChild(link);
      if (document.body.contains(script)) document.body.removeChild(script);
    };
  }, []);

  // جيب الخطط
  useEffect(() => {
    if (!token) {
      setErrorMsg("انتهت الجلسة، يرجى العودة للتطبيق");
      setStep("error");
      return;
    }

    axios
      .get(`${process.env.REACT_APP_URL}/step/subscription/plans/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setPlans(res.data.plans || []);
        setStep("select");
      })
      .catch(() => {
        setErrorMsg("تعذر جلب خطط الاشتراك");
        setStep("error");
      });
  }, [token]);

  // تهيئة Moyasar لما يختار خطة
  useEffect(() => {
    if (
      step !== "paying" ||
      !moyasarReady ||
      !selectedPlan ||
      !formRef.current ||
      initializedRef.current
    )
      return;

    const timer = setTimeout(() => {
      if (!window.Moyasar) return;
      initializedRef.current = true;

      const callbackUrl =
        `${window.location.origin}/step/payment/callback` +
        `?token=${encodeURIComponent(token)}`;

      window.Moyasar.init({
        element: ".moyasar-form-container",
        amount: selectedPlan.price_halalas,
        currency: "SAR",
        description: `اشتراك STEP - ${selectedPlan.name}`,
        publishable_api_key: process.env.REACT_APP_MOYASAR_PUBLISHABLE_KEY,
        callback_url: callbackUrl,
        methods: ["creditcard", "applepay"],
        apple_pay: {
          country: "SA",
          label: "Sabrlingua",
          validate_merchant_url: "https://api.moyasar.com/v1/applepay/initiate",
        },
        on_initiating: () => true,
        on_failed: (error) => {
          setErrorMsg(error?.message || "فشلت عملية الدفع");
          setStep("error");
        },
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [step, moyasarReady, selectedPlan, token]);

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    initializedRef.current = false; // reset عشان Moyasar يتهيأ من أول
    setStep("paying");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800;900&family=DM+Serif+Display:ital@0;1&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --gold: #C9A84C; --gold-light: #E8C97A; --gold-pale: rgba(201,168,76,0.12);
          --dark: #0B0B0F; --dark-2: #111118; --dark-card: #16161F;
          --dark-border: rgba(201,168,76,0.18); --text-primary: #F0EDE6;
          --text-muted: #8A8799; --text-dim: #4A4860;
          --success: #3DDC97; --danger: #FF6B6B;
        }
        body { font-family: 'Tajawal', sans-serif; direction: rtl; background: var(--dark); color: var(--text-primary); }

        .pay-page {
          min-height: 100vh; display: flex; align-items: center;
          justify-content: center; padding: 32px 16px; position: relative; overflow: hidden;
        }
        .pay-page::before, .pay-page::after {
          content: ''; position: fixed; border-radius: 50%;
          pointer-events: none; filter: blur(90px); opacity: 0.35;
        }
        .pay-page::before {
          width: 600px; height: 600px;
          background: radial-gradient(circle, #C9A84C 0%, transparent 65%);
          top: -200px; right: -150px;
        }
        .pay-page::after {
          width: 500px; height: 500px;
          background: radial-gradient(circle, #6B4FCB 0%, transparent 65%);
          bottom: -180px; left: -150px; opacity: 0.2;
        }
        .pay-card {
          position: relative; width: 100%; max-width: 480px;
          background: var(--dark-card); border-radius: 24px;
          border: 1px solid var(--dark-border); padding: 36px 32px 28px;
          box-shadow: 0 0 0 1px rgba(201,168,76,0.06), 0 24px 80px rgba(0,0,0,0.6);
          animation: cardIn 0.6s cubic-bezier(0.22,1,0.36,1) both; overflow: hidden;
        }
        .pay-card::before {
          content: ''; position: absolute; top: 0; left: 10%; right: 10%;
          height: 1px; background: linear-gradient(90deg, transparent, var(--gold-light), transparent); opacity: 0.6;
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(28px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .pay-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px; }
        .pay-logo { display: flex; align-items: center; gap: 10px; }
        .pay-logo-icon {
          width: 38px; height: 38px; border-radius: 10px;
          background: linear-gradient(135deg, #C9A84C, #8B6914);
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; box-shadow: 0 4px 16px rgba(201,168,76,0.35);
        }
        .pay-logo-text { font-family: 'DM Serif Display', serif; font-size: 17px; color: var(--gold-light); }
        .pay-secure-badge {
          display: flex; align-items: center; gap: 5px;
          background: rgba(61,220,151,0.08); border: 1px solid rgba(61,220,151,0.2);
          border-radius: 20px; padding: 5px 12px; font-size: 11px; font-weight: 700; color: var(--success);
        }
        .pay-secure-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--success); animation: pulse 2s ease-in-out infinite; }
        @keyframes pulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.5; transform:scale(0.8); } }
        .pay-sep { height: 1px; background: linear-gradient(90deg, transparent, var(--dark-border), transparent); margin: 0 -32px 28px; }

        /* Plans */
        .plans-title { font-size: 18px; font-weight: 800; color: var(--text-primary); margin-bottom: 6px; }
        .plans-subtitle { font-size: 13px; color: var(--text-muted); margin-bottom: 24px; line-height: 1.6; }
        .plan-card {
          border: 1px solid rgba(201,168,76,0.15); border-radius: 16px;
          padding: 20px; margin-bottom: 12px; cursor: pointer;
          transition: all 0.2s; position: relative; overflow: hidden;
          background: rgba(255,255,255,0.02);
        }
        .plan-card:hover { border-color: var(--gold); background: var(--gold-pale); transform: translateY(-2px); }
        .plan-card.recommended { border-color: rgba(201,168,76,0.5); }
        .plan-recommended-badge {
          position: absolute; top: 12px; left: 12px;
          background: linear-gradient(135deg, #C9A84C, #8B6914);
          color: #0B0B0F; font-size: 10px; font-weight: 900;
          padding: 3px 10px; border-radius: 20px; letter-spacing: 0.5px;
        }
        .plan-name { font-size: 16px; font-weight: 800; color: var(--text-primary); margin-bottom: 4px; }
        .plan-desc { font-size: 12px; color: var(--text-muted); margin-bottom: 12px; }
        .plan-price-row { display: flex; align-items: baseline; gap: 4px; }
        .plan-price { font-family: 'DM Serif Display', serif; font-size: 28px; color: var(--gold-light); }
        .plan-currency { font-size: 13px; font-weight: 700; color: var(--gold); }
        .plan-period { font-size: 12px; color: var(--text-dim); margin-right: 4px; }

        /* Paying step */
        .paying-back-btn {
          display: flex; align-items: center; gap: 6px;
          background: none; border: none; color: var(--text-muted);
          font-family: 'Tajawal', sans-serif; font-size: 13px; font-weight: 700;
          cursor: pointer; margin-bottom: 20px; padding: 0; transition: color 0.2s;
        }
        .paying-back-btn:hover { color: var(--text-primary); }
        .selected-plan-box {
          background: rgba(201,168,76,0.05); border: 1px solid rgba(201,168,76,0.14);
          border-radius: 16px; padding: 16px 20px; margin-bottom: 24px;
        }
        .selected-plan-label { font-size: 10px; font-weight: 800; color: var(--gold); letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 6px; }
        .selected-plan-row { display: flex; justify-content: space-between; align-items: center; }
        .selected-plan-name { font-size: 15px; font-weight: 700; color: var(--text-primary); }
        .selected-plan-price { font-family: 'DM Serif Display', serif; font-size: 22px; color: var(--gold-light); }
        .selected-plan-currency { font-family: 'Tajawal',sans-serif; font-size: 12px; font-weight: 700; color: var(--gold); margin-right: 3px; }

        /* Loading */
        .pay-loading { text-align: center; padding: 48px 0; }
        .pay-spinner-wrap { position: relative; width: 56px; height: 56px; margin: 0 auto 20px; }
        .pay-spinner-track { width: 56px; height: 56px; border-radius: 50%; border: 2px solid rgba(201,168,76,0.12); position: absolute; }
        .pay-spinner { width: 56px; height: 56px; border-radius: 50%; border: 2px solid transparent; border-top-color: var(--gold); border-right-color: rgba(201,168,76,0.4); position: absolute; animation: spin 1s cubic-bezier(0.4,0,0.2,1) infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .pay-loading-title { font-size: 15px; font-weight: 700; color: var(--text-primary); margin-bottom: 4px; }
        .pay-loading-sub { font-size: 13px; color: var(--text-muted); }

        /* Error */
        .pay-error { text-align: center; padding: 32px 0 8px; }
        .pay-error-icon { font-size: 52px; margin-bottom: 16px; }
        .pay-error-title { font-size: 18px; font-weight: 800; color: var(--danger); margin-bottom: 8px; }
        .pay-error-msg { font-size: 14px; color: var(--text-muted); line-height: 1.7; margin-bottom: 24px; }
        .pay-back-btn {
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px; padding: 12px 28px; font-family: 'Tajawal', sans-serif;
          font-size: 14px; font-weight: 700; color: var(--text-primary); cursor: pointer;
          transition: background 0.2s;
        }
        .pay-back-btn:hover { background: rgba(255,255,255,0.1); }

        /* Footer */
        .pay-footer { margin-top: 24px; text-align: center; font-size: 11px; color: var(--text-dim); display: flex; align-items: center; justify-content: center; gap: 8px; }
        .pay-footer-dot { width: 3px; height: 3px; border-radius: 50%; background: var(--text-dim); }
        .pay-footer a { color: var(--gold); text-decoration: none; font-weight: 700; }

        /* Moyasar overrides */
        .mysr-form { font-family: 'Tajawal', sans-serif !important; direction: rtl; }
        .mysr-form input {
          font-family: 'Tajawal', sans-serif !important;
          background: rgba(255,255,255,0.04) !important; border: 1px solid rgba(255,255,255,0.09) !important;
          border-radius: 12px !important; padding: 13px 16px !important;
          font-size: 15px !important; color: var(--text-primary) !important;
        }
        .mysr-form input:focus {
          border-color: rgba(201,168,76,0.45) !important;
          background: rgba(201,168,76,0.04) !important;
          box-shadow: 0 0 0 3px rgba(201,168,76,0.08) !important; outline: none !important;
        }
        .mysr-form button[type="submit"] {
          background: linear-gradient(135deg, #C9A84C 0%, #8B6914 100%) !important;
          border: none !important; border-radius: 14px !important; padding: 16px !important;
          font-family: 'Tajawal', sans-serif !important; font-size: 16px !important;
          font-weight: 800 !important; color: #0B0B0F !important; cursor: pointer !important;
          width: 100% !important; box-shadow: 0 6px 24px rgba(201,168,76,0.3) !important;
        }
        .mysr-form button[type="submit"]:hover { opacity: 0.92 !important; transform: translateY(-2px) !important; }
        .mysr-apple-pay-button, apple-pay-button { border-radius: 14px !important; margin-bottom: 12px !important; height: 52px !important; }

        @keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        .moyasar-form-container { animation: fadeIn 0.5s ease; }

        @media (max-width: 480px) {
          .pay-card { padding: 28px 20px 22px; border-radius: 20px; }
          .pay-sep { margin: 0 -20px 24px; }
        }
      `}</style>

      <div className="pay-page">
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

          {/* Loading */}
          {step === "loading" && (
            <div className="pay-loading">
              <div className="pay-spinner-wrap">
                <div className="pay-spinner-track" />
                <div className="pay-spinner" />
              </div>
              <p className="pay-loading-title">جاري تحضير خطط الاشتراك</p>
              <p className="pay-loading-sub">لحظة من فضلك...</p>
            </div>
          )}

          {/* اختيار الخطة */}
          {step === "select" && (
            <div style={{ animation: "fadeIn 0.4s ease" }}>
              <p className="plans-title">اختر خطة اشتراك STEP</p>
              <p className="plans-subtitle">
                استمر في حل أسئلة اختبار STEP بدون قيود مع خطة مناسبة لك
              </p>
              {plans.map((plan, idx) => (
                <div
                  key={plan.id}
                  className={`plan-card ${idx === 1 ? "recommended" : ""}`}
                  onClick={() => handleSelectPlan(plan)}
                >
                  {idx === 1 && (
                    <span className="plan-recommended-badge">الأوفر</span>
                  )}
                  <p className="plan-name">{plan.name}</p>
                  <p className="plan-desc">
                    {plan.description || `${plan.duration_days} يوم وصول كامل`}
                  </p>
                  <div className="plan-price-row">
                    <span className="plan-price">
                      {Number(plan.price).toLocaleString("ar-SA")}
                    </span>
                    <span className="plan-currency">ريال</span>
                    <span className="plan-period">
                      / {plan.plan_type === "MONTHLY" ? "شهر" : "3 أشهر"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* فورم الدفع */}
          {step === "paying" && (
            <div style={{ animation: "fadeIn 0.4s ease" }}>
              <button
                className="paying-back-btn"
                onClick={() => {
                  initializedRef.current = false;
                  setStep("select");
                }}
              >
                ← تغيير الخطة
              </button>

              {selectedPlan && (
                <div className="selected-plan-box">
                  <p className="selected-plan-label">الخطة المختارة</p>
                  <div className="selected-plan-row">
                    <span className="selected-plan-name">
                      {selectedPlan.name}
                    </span>
                    <div>
                      <span className="selected-plan-price">
                        {Number(selectedPlan.price).toLocaleString("ar-SA")}
                      </span>
                      <span className="selected-plan-currency">ريال</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={formRef}>
                <div className="moyasar-form-container" />
              </div>
            </div>
          )}

          {/* Error */}
          {step === "error" && (
            <div className="pay-error">
              <div className="pay-error-icon">⚠️</div>
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
