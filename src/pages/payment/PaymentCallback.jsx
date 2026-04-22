import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

export default function PaymentCallback() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading"); // loading | success | failed | error

  useEffect(() => {
    const paymentId = searchParams.get("id");
    const moyasarStatus = searchParams.get("status");

    if (!paymentId) {
      setStatus("error");
      return;
    }

    // لو Moyasar بعت status=failed مباشرة
    if (moyasarStatus === "failed") {
      setStatus("failed");
      return;
    }

    // كلم الـ Backend يعمل verify وينشئ الـ Subscription
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/booking/subscriptions/callback/`,
        { id: paymentId },
        {
          headers: {
            // مفيش token هنا لأن الـ callback مش محتاج auth
          },
        }
      )
      .then((res) => {
        if (res.data.status === "paid") {
          setStatus("success");
        } else {
          setStatus("failed");
        }
      })
      .catch(() => {
        setStatus("error");
      });
  }, []);

  return (
    <div style={styles.container}>
      {status === "loading" && <LoadingView />}
      {status === "success" && <SuccessView />}
      {status === "failed" && <FailedView />}
      {status === "error" && <ErrorView />}
    </div>
  );
}

function LoadingView() {
  return (
    <div style={styles.card}>
      <div style={styles.spinner} />
      <h2 style={styles.title}>جاري التحقق من الدفع...</h2>
      <p style={styles.subtitle}>برجاء الانتظار</p>
    </div>
  );
}

function SuccessView() {
  return (
    <div style={styles.card}>
      <div style={{ fontSize: 64 }}>✅</div>
      <h2 style={{ ...styles.title, color: "#16a34a" }}>تم الاشتراك بنجاح!</h2>
      <p style={styles.subtitle}>
        سيتم التواصل معك قريباً لتحديد تفاصيل البداية
      </p>
      <p
        style={{
          ...styles.subtitle,
          marginTop: 8,
          fontSize: 13,
          color: "#6b7280",
        }}
      >
        يمكنك إغلاق هذه الصفحة والعودة للتطبيق
      </p>
    </div>
  );
}

function FailedView() {
  return (
    <div style={styles.card}>
      <div style={{ fontSize: 64 }}>❌</div>
      <h2 style={{ ...styles.title, color: "#dc2626" }}>فشل الدفع</h2>
      <p style={styles.subtitle}>لم تتم عملية الدفع، يرجى المحاولة مرة أخرى</p>
      <p
        style={{
          ...styles.subtitle,
          marginTop: 8,
          fontSize: 13,
          color: "#6b7280",
        }}
      >
        يمكنك إغلاق هذه الصفحة والمحاولة مجدداً من التطبيق
      </p>
    </div>
  );
}

function ErrorView() {
  return (
    <div style={styles.card}>
      <div style={{ fontSize: 64 }}>⚠️</div>
      <h2 style={{ ...styles.title, color: "#d97706" }}>حدث خطأ</h2>
      <p style={styles.subtitle}>
        تعذر التحقق من حالة الدفع، يرجى التواصل مع الدعم
      </p>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9fafb",
    fontFamily: "Arial, sans-serif",
    direction: "rtl",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: "48px 40px",
    textAlign: "center",
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
    maxWidth: 400,
    width: "90%",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    margin: "16px 0 8px",
    color: "#111827",
  },
  subtitle: {
    fontSize: 15,
    color: "#6b7280",
    margin: 0,
    lineHeight: 1.6,
  },
  spinner: {
    width: 48,
    height: 48,
    border: "4px solid #e5e7eb",
    borderTop: "4px solid #6366f1",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    margin: "0 auto 16px",
  },
};
