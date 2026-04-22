import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function PaymentPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [step, setStep] = useState("loading"); // loading | form | processing | error
  const [program, setProgram] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [moyasarReady, setMoyasarReady] = useState(false);
  const formRef = useRef(null);
  const moyasarInstanceRef = useRef(null);

  const programId = searchParams.get("program_id");
  const token = searchParams.get("token"); // JWT من الموبايل

  // ─── تحميل Moyasar.js من CDN ───────────────────────────────────────────────
  useEffect(() => {
    // CSS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdn.moyasar.com/mpf/1.14.0/moyasar.css";
    document.head.appendChild(link);

    // JS
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
      document.head.removeChild(link);
      document.body.removeChild(script);
    };
  }, []);

  // ─── جلب بيانات البرنامج ────────────────────────────────────────────────────
  useEffect(() => {
    if (!programId || !token) {
      setErrorMsg("بيانات ناقصة، يرجى العودة والمحاولة مجدداً");
      setStep("error");
      return;
    }

    axios
      .get(`${process.env.REACT_APP_API_URL}/booking/programs/${programId}/`, {
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

  // ─── تهيئة Moyasar Payment Form ─────────────────────────────────────────────
  useEffect(() => {
    if (step !== "form" || !moyasarReady || !program || !formRef.current)
      return;

    // تأخير بسيط عشان الـ DOM يكون جاهز
    const timer = setTimeout(() => {
      if (!window.Moyasar) return;

      moyasarInstanceRef.current = window.Moyasar.init({
        element: ".moyasar-form-container",
        amount: Math.round(program.price * 100), // تحويل لهللة
        currency: "SAR",
        description: `اشتراك في برنامج: ${program.title}`,
        publishable_api_key: process.env.REACT_APP_MOYASAR_PUBLISHABLE_KEY,
        callback_url: `${window.location.origin}/payment/callback`,

        methods: ["creditcard"],

        on_initiating: () => {
          setStep("processing");
        },

        on_completed: async (payment) => {
          // الـ payment object فيه token أو id
          try {
            const source = payment.source || {};
            const cardToken = source.token || payment.id;

            const res = await axios.post(
              `${process.env.REACT_APP_API_URL}/booking/subscriptions/pay/`,
              {
                program_id: parseInt(programId),
                token: cardToken,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );

            const data = res.data;

            // لو في transaction_url → redirect لصفحة 3DS
            if (data.transaction_url) {
              window.location.href = data.transaction_url;
            } else if (data.status === "paid") {
              navigate("/payment/callback?status=paid&id=" + data.payment_id);
            } else {
              navigate("/payment/callback?status=failed");
            }
          } catch (err) {
            const msg =
              err.response?.data?.error || "حدث خطأ أثناء معالجة الدفع";
            setErrorMsg(msg);
            setStep("error");
          }
        },

        on_failed: (error) => {
          setErrorMsg(error?.message || "فشلت عملية الدفع");
          setStep("error");
        },
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [step, moyasarReady, program]);

  // ──────────────────────────────────────────────────────────────────────────────

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.logoWrap}>
            <span style={styles.logoIcon}>🎓</span>
            <span style={styles.logoText}>Sabrlinguaa</span>
          </div>
          <div style={styles.secureTag}>
            <span style={styles.lockIcon}>🔒</span>
            دفع آمن
          </div>
        </div>

        {/* Program Info */}
        {program && step !== "error" && (
          <div style={styles.programBox}>
            <p style={styles.programLabel}>البرنامج</p>
            <p style={styles.programTitle}>{program.title}</p>
            <div style={styles.divider} />
            <div style={styles.amountRow}>
              <span style={styles.amountLabel}>المبلغ الإجمالي</span>
              <span style={styles.amountValue}>
                {program.price?.toLocaleString("ar-SA")}
                <span style={styles.currency}> ريال</span>
              </span>
            </div>
          </div>
        )}

        {/* States */}
        {step === "loading" && (
          <div style={styles.centerBox}>
            <div style={styles.spinner} />
            <p style={styles.loadingText}>جاري التحميل...</p>
          </div>
        )}

        {step === "processing" && (
          <div style={styles.centerBox}>
            <div style={{ ...styles.spinner, borderTopColor: "#10b981" }} />
            <p style={styles.loadingText}>جاري معالجة الدفع...</p>
            <p style={styles.subText}>لا تغلق هذه الصفحة</p>
          </div>
        )}

        {step === "error" && (
          <div style={styles.errorBox}>
            <div style={styles.errorIcon}>⚠️</div>
            <p style={styles.errorTitle}>حدث خطأ</p>
            <p style={styles.errorMsg}>{errorMsg}</p>
            <button
              style={styles.retryBtn}
              onClick={() => window.history.back()}
            >
              العودة للخلف
            </button>
          </div>
        )}

        {/* Moyasar Form — دايماً موجود في الـ DOM لكن مخفي لو مش form */}
        <div
          ref={formRef}
          style={{
            display: step === "form" ? "block" : "none",
            marginTop: 8,
          }}
        >
          <div className="moyasar-form-container" />
        </div>

        {/* Footer */}
        <p style={styles.footer}>
          مدعوم بواسطة{" "}
          <a
            href="https://moyasar.com"
            target="_blank"
            rel="noreferrer"
            style={styles.moyasarLink}
          >
            Moyasar
          </a>{" "}
          · بياناتك محمية بتشفير SSL
        </p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap');
        
        * { box-sizing: border-box; }

        body { margin: 0; font-family: 'Cairo', sans-serif; direction: rtl; }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Moyasar overrides ── */
        .moyasar-form-container { animation: fadeIn 0.4s ease; }

        .mysr-form { font-family: 'Cairo', sans-serif !important; direction: rtl; }

        .mysr-form label {
          font-family: 'Cairo', sans-serif !important;
          font-size: 13px !important;
          color: #6b7280 !important;
          font-weight: 600 !important;
        }

        .mysr-form input {
          font-family: 'Cairo', sans-serif !important;
          border: 1.5px solid #e5e7eb !important;
          border-radius: 10px !important;
          padding: 10px 14px !important;
          font-size: 15px !important;
          transition: border-color 0.2s !important;
          background: #fafafa !important;
        }

        .mysr-form input:focus {
          border-color: #6366f1 !important;
          outline: none !important;
          background: #fff !important;
        }

        .mysr-form button[type="submit"] {
          background: linear-gradient(135deg, #6366f1, #8b5cf6) !important;
          border: none !important;
          border-radius: 12px !important;
          padding: 14px !important;
          font-family: 'Cairo', sans-serif !important;
          font-size: 16px !important;
          font-weight: 700 !important;
          color: white !important;
          cursor: pointer !important;
          transition: opacity 0.2s, transform 0.1s !important;
          margin-top: 8px !important;
        }

        .mysr-form button[type="submit"]:hover {
          opacity: 0.92 !important;
          transform: translateY(-1px) !important;
        }

        .mysr-form button[type="submit"]:active {
          transform: translateY(0) !important;
        }
      `}</style>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #f0f0ff 0%, #faf5ff 50%, #f0fdf4 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px 16px",
    fontFamily: "'Cairo', sans-serif",
    direction: "rtl",
  },
  card: {
    background: "white",
    borderRadius: 20,
    padding: "32px 28px 24px",
    width: "100%",
    maxWidth: 440,
    boxShadow: "0 8px 40px rgba(99,102,241,0.12), 0 2px 8px rgba(0,0,0,0.06)",
    animation: "fadeIn 0.5s ease",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  logoWrap: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  logoIcon: { fontSize: 22 },
  logoText: {
    fontSize: 18,
    fontWeight: 900,
    color: "#1e1b4b",
    letterSpacing: "-0.3px",
  },
  secureTag: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    fontSize: 12,
    color: "#059669",
    fontWeight: 600,
    background: "#ecfdf5",
    padding: "4px 10px",
    borderRadius: 20,
  },
  lockIcon: { fontSize: 11 },
  programBox: {
    background: "linear-gradient(135deg, #eef2ff, #f5f3ff)",
    borderRadius: 14,
    padding: "16px 18px",
    marginBottom: 24,
    border: "1px solid #e0e7ff",
  },
  programLabel: {
    margin: "0 0 4px",
    fontSize: 11,
    color: "#6366f1",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  programTitle: {
    margin: "0 0 12px",
    fontSize: 17,
    fontWeight: 700,
    color: "#1e1b4b",
  },
  divider: {
    height: 1,
    background: "#e0e7ff",
    marginBottom: 12,
  },
  amountRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  amountLabel: {
    fontSize: 13,
    color: "#6b7280",
    fontWeight: 600,
  },
  amountValue: {
    fontSize: 22,
    fontWeight: 900,
    color: "#1e1b4b",
  },
  currency: {
    fontSize: 14,
    fontWeight: 600,
    color: "#6366f1",
  },
  centerBox: {
    textAlign: "center",
    padding: "32px 0",
  },
  spinner: {
    width: 44,
    height: 44,
    border: "4px solid #e5e7eb",
    borderTop: "4px solid #6366f1",
    borderRadius: "50%",
    animation: "spin 0.9s linear infinite",
    margin: "0 auto 16px",
  },
  loadingText: {
    fontSize: 16,
    fontWeight: 600,
    color: "#374151",
    margin: "0 0 6px",
  },
  subText: {
    fontSize: 13,
    color: "#9ca3af",
    margin: 0,
  },
  errorBox: {
    textAlign: "center",
    padding: "24px 0 8px",
  },
  errorIcon: { fontSize: 48, marginBottom: 12 },
  errorTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: "#dc2626",
    margin: "0 0 8px",
  },
  errorMsg: {
    fontSize: 14,
    color: "#6b7280",
    margin: "0 0 20px",
    lineHeight: 1.6,
  },
  retryBtn: {
    background: "#f3f4f6",
    border: "none",
    borderRadius: 10,
    padding: "10px 24px",
    fontSize: 14,
    fontWeight: 600,
    color: "#374151",
    cursor: "pointer",
  },
  footer: {
    textAlign: "center",
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 20,
    marginBottom: 0,
  },
  moyasarLink: {
    color: "#6366f1",
    textDecoration: "none",
    fontWeight: 600,
  },
};
