// src/pages/SupportPage.jsx
import { useEffect, useState } from "react";
import {
  HeadphonesIcon,
  Mail,
  MessageCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  BookOpen,
  CreditCard,
  Mic,
  Settings,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

const SUPPORT_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap');

  .support-root {
    min-height: 100vh;
    position: relative;
    overflow-x: hidden;
    background:
      radial-gradient(ellipse 70% 55% at 15% 0%,  rgba(147,197,253,0.45) 0%, transparent 60%),
      radial-gradient(ellipse 55% 50% at 85% 90%, rgba(196,181,253,0.40) 0%, transparent 60%),
      radial-gradient(ellipse 45% 40% at 70% 20%, rgba(167,243,208,0.25) 0%, transparent 55%),
      radial-gradient(ellipse 60% 50% at 30% 75%, rgba(253,186,116,0.18) 0%, transparent 55%),
      linear-gradient(145deg, #e8eeff 0%, #f0f4ff 40%, #ede9ff 100%);
    font-family: 'Sora', sans-serif;
    color: #1a2035;
    direction: rtl;
  }

  .dark .support-root,
  .support-root.dark-mode {
    background:
      radial-gradient(ellipse 70% 55% at 15% 0%,  rgba(30,60,120,0.4) 0%, transparent 60%),
      radial-gradient(ellipse 55% 50% at 85% 90%, rgba(80,40,140,0.35) 0%, transparent 60%),
      radial-gradient(ellipse 45% 40% at 70% 20%, rgba(20,80,60,0.20) 0%, transparent 55%),
      radial-gradient(ellipse 60% 50% at 30% 75%, rgba(100,60,20,0.15) 0%, transparent 55%),
      linear-gradient(145deg, #0a0e1a 0%, #0d1120 40%, #100d1f 100%);
    color: #e8eeff;
  }

  .support-orb {
    position: fixed; border-radius: 50%;
    filter: blur(70px); pointer-events: none; z-index: 0;
    animation: supportDrift 22s ease-in-out infinite alternate;
  }
  .support-orb-1 { width:420px; height:420px; top:-100px; left:-80px;
    background: radial-gradient(circle, rgba(147,197,253,0.5), transparent 70%); }
  .support-orb-2 { width:350px; height:350px; bottom:0; right:8%;
    background: radial-gradient(circle, rgba(196,181,253,0.45), transparent 70%);
    animation-delay: -8s; animation-duration: 17s; }
  .support-orb-3 { width:250px; height:250px; top:55%; left:35%;
    background: radial-gradient(circle, rgba(167,243,208,0.35), transparent 70%);
    animation-delay: -14s; animation-duration: 28s; }

  .dark .support-orb-1, .support-root.dark-mode .support-orb-1 {
    background: radial-gradient(circle, rgba(30,60,120,0.55), transparent 70%); }
  .dark .support-orb-2, .support-root.dark-mode .support-orb-2 {
    background: radial-gradient(circle, rgba(80,40,140,0.45), transparent 70%); }
  .dark .support-orb-3, .support-root.dark-mode .support-orb-3 {
    background: radial-gradient(circle, rgba(20,80,60,0.30), transparent 70%); }

  @keyframes supportDrift {
    from { transform: translate(0,0) scale(1); }
    to   { transform: translate(30px,25px) scale(1.07); }
  }

  .support-shell {
    position: relative; z-index: 1;
    max-width: 880px; margin: 0 auto;
    padding: 40px 20px 80px;
  }

  /* ── Hero ── */
  .support-hero {
    background: rgba(255,255,255,0.52);
    backdrop-filter: blur(28px) saturate(180%);
    -webkit-backdrop-filter: blur(28px) saturate(180%);
    border: 1px solid rgba(255,255,255,0.88);
    border-radius: 20px;
    padding: 32px 28px;
    box-shadow: 0 6px 40px rgba(79,124,255,0.08), 0 1px 0 rgba(255,255,255,0.4) inset;
    margin-bottom: 28px;
  }
  .dark .support-hero, .support-root.dark-mode .support-hero {
    background: rgba(20,25,45,0.70);
    border-color: rgba(255,255,255,0.08);
  }

  .support-hero-icon {
    width: 52px; height: 52px; border-radius: 16px;
    background: linear-gradient(135deg, #4f7cff 0%, #8b5cf6 100%);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 18px rgba(79,124,255,0.22), 0 1px 0 rgba(255,255,255,0.4) inset;
    margin-bottom: 16px;
  }

  .support-eyebrow {
    font-size: 11px; font-weight: 600; letter-spacing: 0.14em;
    color: #4f7cff; text-transform: uppercase;
    font-family: 'JetBrains Mono', monospace;
    display: flex; align-items: center; gap: 6px; margin-bottom: 8px;
  }
  .dark .support-eyebrow, .support-root.dark-mode .support-eyebrow { color: #6e9fff; }

  .support-title {
    font-size: 28px; font-weight: 700; line-height: 1.3;
    margin-bottom: 8px;
  }
  .support-subtitle {
    font-size: 14px; color: #6b7a99; line-height: 1.8; max-width: 620px;
  }
  .dark .support-subtitle, .support-root.dark-mode .support-subtitle { color: #8896b0; }

  .support-hours-badge {
    margin-top: 18px; display: inline-flex; align-items: center; gap: 8px;
    padding: 6px 14px; border-radius: 99px;
    background: rgba(255,255,255,0.65);
    border: 1px solid rgba(255,255,255,0.88);
    font-size: 11.5px; font-weight: 600; color: #6b7a99;
    font-family: 'JetBrains Mono', monospace;
  }
  .dark .support-hours-badge, .support-root.dark-mode .support-hours-badge {
    background: rgba(255,255,255,0.07); border-color: rgba(255,255,255,0.08); color: #8896b0;
  }

  /* ── Contact cards ── */
  .support-contact-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 28px;
  }

  @media (max-width: 600px) {
    .support-contact-grid { grid-template-columns: 1fr; }
  }

  .support-contact-card {
    background: rgba(255,255,255,0.52);
    backdrop-filter: blur(28px) saturate(180%);
    -webkit-backdrop-filter: blur(28px) saturate(180%);
    border: 1px solid rgba(255,255,255,0.88);
    border-radius: 18px;
    padding: 24px 22px;
    box-shadow: 0 4px 24px rgba(79,124,255,0.05), 0 1px 0 rgba(255,255,255,0.3) inset;
    transition: box-shadow 0.2s ease, transform 0.2s ease;
    text-decoration: none;
    display: block;
  }
  .support-contact-card:hover {
    box-shadow: 0 8px 32px rgba(79,124,255,0.13), 0 1px 0 rgba(255,255,255,0.3) inset;
    transform: translateY(-2px);
  }
  .dark .support-contact-card, .support-root.dark-mode .support-contact-card {
    background: rgba(20,25,45,0.70);
    border-color: rgba(255,255,255,0.08);
  }

  .support-card-icon-wrap {
    width: 46px; height: 46px; border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 14px;
  }
  .support-card-icon-wrap.email {
    background: linear-gradient(135deg, rgba(79,124,255,0.15), rgba(139,92,246,0.15));
    border: 1px solid rgba(79,124,255,0.2);
    color: #4f7cff;
  }
  .support-card-icon-wrap.whatsapp {
    background: linear-gradient(135deg, rgba(37,211,102,0.15), rgba(18,140,126,0.15));
    border: 1px solid rgba(37,211,102,0.25);
    color: #25d366;
  }

  .support-card-label {
    font-size: 11px; font-weight: 700; letter-spacing: 0.1em;
    text-transform: uppercase; font-family: 'JetBrains Mono', monospace;
    color: #8896b0; margin-bottom: 4px;
  }
  .support-card-title {
    font-size: 16px; font-weight: 700; margin-bottom: 6px;
  }
  .support-card-value {
    font-size: 13px; color: #6b7a99; font-family: 'JetBrains Mono', monospace;
    margin-bottom: 16px; direction: ltr; text-align: right;
  }
  .dark .support-card-value, .support-root.dark-mode .support-card-value { color: #8896b0; }

  .support-card-btn {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 9px 18px; border-radius: 99px;
    font-size: 13px; font-weight: 600;
    transition: opacity 0.15s ease;
    cursor: pointer;
  }
  .support-card-btn:hover { opacity: 0.85; }
  .support-card-btn.email {
    background: linear-gradient(135deg, #4f7cff, #8b5cf6);
    color: #fff;
    box-shadow: 0 4px 14px rgba(79,124,255,0.28);
  }
  .support-card-btn.whatsapp {
    background: linear-gradient(135deg, #25d366, #128c7e);
    color: #fff;
    box-shadow: 0 4px 14px rgba(37,211,102,0.28);
  }

  /* ── FAQ Section ── */
  .support-section-title-row {
    display: flex; align-items: center; gap: 10px;
    margin-bottom: 14px;
  }
  .support-section-heading {
    font-size: 17px; font-weight: 700;
  }
  .support-section-tag {
    font-size: 11px; font-weight: 700; font-family: 'JetBrains Mono', monospace;
    color: #8b5cf6; letter-spacing: 0.06em;
    background: rgba(139,92,246,0.08); border: 1px solid rgba(139,92,246,0.15);
    padding: 2px 8px; border-radius: 99px;
  }

  .faq-item {
    background: rgba(255,255,255,0.52);
    backdrop-filter: blur(28px) saturate(180%);
    -webkit-backdrop-filter: blur(28px) saturate(180%);
    border: 1px solid rgba(255,255,255,0.88);
    border-radius: 14px;
    margin-bottom: 10px;
    overflow: hidden;
    transition: box-shadow 0.2s ease;
  }
  .faq-item:hover { box-shadow: 0 4px 20px rgba(79,124,255,0.08); }
  .dark .faq-item, .support-root.dark-mode .faq-item {
    background: rgba(20,25,45,0.70);
    border-color: rgba(255,255,255,0.08);
  }

  .faq-question {
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 20px; cursor: pointer; gap: 12px;
    user-select: none;
  }
  .faq-question-left {
    display: flex; align-items: center; gap: 12px;
  }
  .faq-icon {
    width: 32px; height: 32px; border-radius: 9px; flex-shrink: 0;
    background: linear-gradient(135deg, rgba(79,124,255,0.12), rgba(139,92,246,0.12));
    border: 1px solid rgba(79,124,255,0.15);
    display: flex; align-items: center; justify-content: center;
    color: #4f7cff;
  }
  .dark .faq-icon, .support-root.dark-mode .faq-icon { color: #6e9fff; }

  .faq-question-text {
    font-size: 14px; font-weight: 600; line-height: 1.4;
  }

  .faq-chevron {
    color: #8896b0; flex-shrink: 0; transition: transform 0.2s ease;
  }
  .faq-chevron.open { transform: rotate(180deg); }

  .faq-answer {
    padding: 0 20px 16px 20px;
    font-size: 13.5px; line-height: 1.9; color: #4b5876;
    padding-right: 64px;
  }
  .dark .faq-answer, .support-root.dark-mode .faq-answer { color: #b6c0da; }

  /* ── Response time banner ── */
  .support-response-banner {
    background: linear-gradient(135deg, rgba(79,124,255,0.08), rgba(139,92,246,0.08));
    border: 1px solid rgba(79,124,255,0.15);
    border-radius: 14px;
    padding: 16px 20px;
    margin-bottom: 28px;
    display: flex; align-items: center; gap: 12px;
  }
  .support-response-icon {
    width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
    background: linear-gradient(135deg, #4f7cff, #8b5cf6);
    display: flex; align-items: center; justify-content: center;
    color: #fff;
  }
  .support-response-text {
    font-size: 13px; color: #4b5876; line-height: 1.7;
  }
  .dark .support-response-text, .support-root.dark-mode .support-response-text { color: #b6c0da; }
  .support-response-text strong { color: #1a2035; }
  .dark .support-response-text strong, .support-root.dark-mode .support-response-text strong { color: #e8eeff; }

  /* ── Tips section ── */
  .support-tips {
    background: rgba(255,255,255,0.52);
    backdrop-filter: blur(28px) saturate(180%);
    -webkit-backdrop-filter: blur(28px) saturate(180%);
    border: 1px solid rgba(255,255,255,0.88);
    border-radius: 18px;
    padding: 24px 26px;
    margin-bottom: 16px;
    box-shadow: 0 4px 24px rgba(79,124,255,0.05);
  }
  .dark .support-tips, .support-root.dark-mode .support-tips {
    background: rgba(20,25,45,0.70);
    border-color: rgba(255,255,255,0.08);
  }
  .support-tips-title {
    font-size: 15px; font-weight: 700; margin-bottom: 14px;
    display: flex; align-items: center; gap: 8px;
  }
  .support-tips-list {
    list-style: none; padding: 0; margin: 0;
    display: grid; gap: 10px;
  }
  .support-tips-list li {
    display: flex; align-items: flex-start; gap: 10px;
    font-size: 13.5px; line-height: 1.7; color: #4b5876;
  }
  .dark .support-tips-list li, .support-root.dark-mode .support-tips-list li { color: #b6c0da; }
  .support-tip-check {
    color: #4f7cff; flex-shrink: 0; margin-top: 2px;
  }

  .support-footer-note {
    text-align: center; font-size: 12px; color: #8896b0;
    margin-top: 28px; line-height: 1.8;
  }

  @media (max-width: 640px) {
    .support-title { font-size: 22px; }
    .support-hero, .support-contact-card { padding: 20px 18px; }
    .faq-answer { padding-right: 20px; }
  }
`;

const faqs = [
  {
    icon: BookOpen,
    question: "إزاي أبدأ كورس جديد؟",
    answer:
      "بعد تسجيل الدخول، روح على صفحة الكورسات من القائمة الرئيسية واختار الكورس اللي يناسبك. كل كورس فيه مستويات من المبتدئ للمتقدم، وتقدر تبدأ من أي مستوى.",
  },
  {
    icon: CreditCard,
    question: "إيه طرق الدفع المتاحة؟",
    answer:
      "نقبل البطاقات الائتمانية، مدى، وبعض خدمات الدفع الإلكتروني. لو واجهت أي مشكلة في الدفع، تواصل معنا وهنساعدك في أقرب وقت.",
  },
  {
    icon: Mic,
    question: "مش شغالة ميزة التحدث عندي، أعمل إيه؟",
    answer:
      "أول حاجة تأكد إن التطبيق عنده صلاحية الوصول للميكروفون من إعدادات جهازك. لو المشكلة مستمرة، جرب تغلق التطبيق وتفتحه تاني. لو ما حلتش، تواصل معنا وأرسل نوع جهازك وإصدار التطبيق.",
  },
  {
    icon: Settings,
    question: "كيف أعدّل معلومات حسابي؟",
    answer:
      "من الصفحة الرئيسية، اضغط على أيقونة الملف الشخصي في الأعلى، واختار إعدادات الحساب. من هناك تقدر تغير اسمك، بريدك الإلكتروني، وكلمة المرور.",
  },
  {
    icon: Sparkles,
    question: "إيه الفرق بين اختبار IELTS وSTEP التجريبي؟",
    answer:
      "اختبار IELTS التجريبي مصمم للمتعلمين اللي بيجهزوا للاختبار الدولي، وبيغطي الأجزاء الأربعة (استماع، قراءة، كتابة، تحدث). أما STEP فهو الاختبار السعودي لقياس الكفاءة في اللغة الإنجليزية، ومعتمد في كثير من الجامعات والجهات الحكومية.",
  },
  {
    icon: BookOpen,
    question: "ممكن أوصل للتطبيق من أكتر من جهاز؟",
    answer:
      "أيوه، حسابك مرتبط ببريدك الإلكتروني وتقدر تسجل دخول من أي جهاز. تقدمك بيتزامن تلقائيًا بين الأجهزة.",
  },
];

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const id = "support-page-styles";
    if (!document.getElementById(id)) {
      const tag = document.createElement("style");
      tag.id = id;
      tag.textContent = SUPPORT_STYLES;
      document.head.appendChild(tag);
    }
  }, []);

  return (
    <div className="support-root">
      <div className="support-orb support-orb-1" />
      <div className="support-orb support-orb-2" />
      <div className="support-orb support-orb-3" />

      <div className="support-shell">
        {/* Hero */}
        <div className="support-hero">
          <div className="support-hero-icon">
            <HeadphonesIcon size={26} color="#fff" strokeWidth={2.5} />
          </div>
          <div className="support-eyebrow">
            <Sparkles size={11} />
            SABRLINGUA · SUPPORT
          </div>
          <h1 className="support-title">مركز الدعم الفني</h1>
          <p className="support-subtitle">
            هل واجهت مشكلة أو عندك سؤال؟ فريق SabrLingua موجود للمساعدة. تواصل
            معنا عبر البريد الإلكتروني أو واتساب وسنرد عليك في أقرب وقت ممكن.
          </p>
          <div className="support-hours-badge">
            <Clock size={12} />
            متاحون السبت – الخميس · ٩ص – ١٠م بتوقيت السعودية
          </div>
        </div>

        {/* Response time banner */}
        <div className="support-response-banner">
          <div className="support-response-icon">
            <Clock size={18} />
          </div>
          <div className="support-response-text">
            <strong>متوسط وقت الرد:</strong> عادةً خلال ٢٤ ساعة في أيام العمل.
            الواتساب أسرع للاستفسارات العاجلة.
          </div>
        </div>

        {/* Contact Cards */}
        <div className="support-contact-grid">
          {/* Email */}
          <a
            className="support-contact-card"
            href="mailto:sabrlingua@gmail.com"
          >
            <div className="support-card-icon-wrap email">
              <Mail size={22} />
            </div>
            <div className="support-card-label">البريد الإلكتروني</div>
            <div className="support-card-title">راسلنا بالإيميل</div>
            <div className="support-card-value">sabrlingua@gmail.com</div>
            <div className="support-card-btn email">
              <Mail size={14} />
              ابعت إيميل
            </div>
          </a>

          {/* WhatsApp */}
          <a
            className="support-contact-card"
            href="https://wa.me/201063028501"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="support-card-icon-wrap whatsapp">
              <MessageCircle size={22} />
            </div>
            <div className="support-card-label">واتساب</div>
            <div className="support-card-title">تواصل على واتساب</div>
            <div className="support-card-value" dir="ltr">
              +20 106 302 8501
            </div>
            <div className="support-card-btn whatsapp">
              <MessageCircle size={14} />
              ابدأ محادثة
            </div>
          </a>
        </div>

        {/* Tips before contacting */}
        <div className="support-tips">
          <div className="support-tips-title">
            <CheckCircle2 size={18} color="#4f7cff" />
            قبل ما تتواصل معنا، جرّب الخطوات دي
          </div>
          <ul className="support-tips-list">
            <li>
              <CheckCircle2 size={15} className="support-tip-check" />
              أغلق التطبيق وافتحه من جديد – بتحل كتير من المشاكل البسيطة
            </li>
            <li>
              <CheckCircle2 size={15} className="support-tip-check" />
              تأكد إن عندك إنترنت شغال على جهازك
            </li>
            <li>
              <CheckCircle2 size={15} className="support-tip-check" />
              تحقق إن التطبيق محدّث لأحدث إصدار
            </li>
            <li>
              <CheckCircle2 size={15} className="support-tip-check" />
              لو المشكلة في الصوت، اتأكد إن التطبيق عنده إذن الميكروفون
            </li>
          </ul>
        </div>

        {/* FAQ */}
        <div style={{ marginTop: 28 }}>
          <div className="support-section-title-row">
            <div className="support-section-heading">الأسئلة الشائعة</div>
            <div className="support-section-tag">FAQ</div>
          </div>

          {faqs.map((faq, i) => {
            const Icon = faq.icon;
            const isOpen = openFaq === i;
            return (
              <div className="faq-item" key={i}>
                <div
                  className="faq-question"
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                >
                  <div className="faq-question-left">
                    <div className="faq-icon">
                      <Icon size={15} />
                    </div>
                    <div className="faq-question-text">{faq.question}</div>
                  </div>
                  <div className={`faq-chevron ${isOpen ? "open" : ""}`}>
                    <ChevronDown size={18} />
                  </div>
                </div>
                {isOpen && <div className="faq-answer">{faq.answer}</div>}
              </div>
            );
          })}
        </div>

        <p className="support-footer-note">
          لو ما لقيتش إجابة لسؤالك هنا، تواصل معنا مباشرة وسنكون سعداء بمساعدتك.
          <br />
          SabrLingua — نتعلم مع بعض 🎓
        </p>
      </div>
    </div>
  );
}
