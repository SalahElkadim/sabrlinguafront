// src/pages/PrivacyPolicy.jsx
import { useEffect } from "react";
import {
  ShieldCheck,
  Database,
  Share2,
  Lock,
  Clock,
  Baby,
  Sparkles,
  UserCheck,
  Trash2,
  Plug,
  RefreshCw,
  Mail,
} from "lucide-react";

/* ─── Glass styles, reusing the dashboard design language ───────────────── */
const PRIVACY_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap');

  .privacy-root {
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

  .dark .privacy-root,
  .privacy-root.dark-mode {
    background:
      radial-gradient(ellipse 70% 55% at 15% 0%,  rgba(30,60,120,0.4) 0%, transparent 60%),
      radial-gradient(ellipse 55% 50% at 85% 90%, rgba(80,40,140,0.35) 0%, transparent 60%),
      radial-gradient(ellipse 45% 40% at 70% 20%, rgba(20,80,60,0.20) 0%, transparent 55%),
      radial-gradient(ellipse 60% 50% at 30% 75%, rgba(100,60,20,0.15) 0%, transparent 55%),
      linear-gradient(145deg, #0a0e1a 0%, #0d1120 40%, #100d1f 100%);
    color: #e8eeff;
  }

  .privacy-orb {
    position: fixed; border-radius: 50%;
    filter: blur(70px); pointer-events: none; z-index: 0;
    animation: privacyDrift 22s ease-in-out infinite alternate;
  }
  .privacy-orb-1 { width:420px; height:420px; top:-100px; left:-80px;
    background: radial-gradient(circle, rgba(147,197,253,0.5), transparent 70%); }
  .privacy-orb-2 { width:350px; height:350px; bottom:0; right:8%;
    background: radial-gradient(circle, rgba(196,181,253,0.45), transparent 70%);
    animation-delay: -8s; animation-duration: 17s; }
  .privacy-orb-3 { width:250px; height:250px; top:55%; left:35%;
    background: radial-gradient(circle, rgba(167,243,208,0.35), transparent 70%);
    animation-delay: -14s; animation-duration: 28s; }

  .dark .privacy-orb-1, .privacy-root.dark-mode .privacy-orb-1 {
    background: radial-gradient(circle, rgba(30,60,120,0.55), transparent 70%); }
  .dark .privacy-orb-2, .privacy-root.dark-mode .privacy-orb-2 {
    background: radial-gradient(circle, rgba(80,40,140,0.45), transparent 70%); }
  .dark .privacy-orb-3, .privacy-root.dark-mode .privacy-orb-3 {
    background: radial-gradient(circle, rgba(20,80,60,0.30), transparent 70%); }

  @keyframes privacyDrift {
    from { transform: translate(0,0) scale(1); }
    to   { transform: translate(30px,25px) scale(1.07); }
  }

  .privacy-shell {
    position: relative; z-index: 1;
    max-width: 880px; margin: 0 auto;
    padding: 40px 20px 80px;
  }

  /* ── Hero ── */
  .privacy-hero {
    background: rgba(255,255,255,0.52);
    backdrop-filter: blur(28px) saturate(180%);
    -webkit-backdrop-filter: blur(28px) saturate(180%);
    border: 1px solid rgba(255,255,255,0.88);
    border-radius: 20px;
    padding: 32px 28px;
    box-shadow: 0 6px 40px rgba(79,124,255,0.08), 0 1px 0 rgba(255,255,255,0.4) inset;
    margin-bottom: 28px;
  }
  .dark .privacy-hero, .privacy-root.dark-mode .privacy-hero {
    background: rgba(20,25,45,0.70);
    border-color: rgba(255,255,255,0.08);
  }

  .privacy-hero-icon {
    width: 52px; height: 52px; border-radius: 16px;
    background: linear-gradient(135deg, #4f7cff 0%, #8b5cf6 100%);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 18px rgba(79,124,255,0.22), 0 1px 0 rgba(255,255,255,0.4) inset;
    margin-bottom: 16px;
  }

  .privacy-eyebrow {
    font-size: 11px; font-weight: 600; letter-spacing: 0.14em;
    color: #4f7cff; text-transform: uppercase;
    font-family: 'JetBrains Mono', monospace;
    display: flex; align-items: center; gap: 6px; margin-bottom: 8px;
  }
  .dark .privacy-eyebrow, .privacy-root.dark-mode .privacy-eyebrow { color: #6e9fff; }

  .privacy-title {
    font-size: 28px; font-weight: 700; line-height: 1.3;
    margin-bottom: 8px;
  }
  .privacy-subtitle {
    font-size: 14px; color: #6b7a99; line-height: 1.8; max-width: 620px;
  }
  .dark .privacy-subtitle, .privacy-root.dark-mode .privacy-subtitle { color: #8896b0; }

  .privacy-meta {
    margin-top: 18px; display: inline-flex; align-items: center; gap: 8px;
    padding: 6px 14px; border-radius: 99px;
    background: rgba(255,255,255,0.65);
    border: 1px solid rgba(255,255,255,0.88);
    font-size: 11.5px; font-weight: 600; color: #6b7a99;
    font-family: 'JetBrains Mono', monospace;
  }
  .dark .privacy-meta, .privacy-root.dark-mode .privacy-meta {
    background: rgba(255,255,255,0.07); border-color: rgba(255,255,255,0.08); color: #8896b0;
  }

  /* ── Section cards ── */
  .privacy-section {
    background: rgba(255,255,255,0.52);
    backdrop-filter: blur(28px) saturate(180%);
    -webkit-backdrop-filter: blur(28px) saturate(180%);
    border: 1px solid rgba(255,255,255,0.88);
    border-radius: 18px;
    padding: 24px 26px;
    margin-bottom: 16px;
    box-shadow: 0 4px 24px rgba(79,124,255,0.05), 0 1px 0 rgba(255,255,255,0.3) inset;
    transition: box-shadow 0.2s ease, border-color 0.2s ease;
  }
  .privacy-section:hover {
    box-shadow: 0 6px 30px rgba(79,124,255,0.10), 0 1px 0 rgba(255,255,255,0.3) inset;
  }
  .dark .privacy-section, .privacy-root.dark-mode .privacy-section {
    background: rgba(20,25,45,0.70);
    border-color: rgba(255,255,255,0.08);
  }

  .privacy-section-head {
    display: flex; align-items: center; gap: 12px; margin-bottom: 14px;
  }
  .privacy-section-icon {
    width: 38px; height: 38px; border-radius: 11px; flex-shrink: 0;
    background: linear-gradient(135deg, rgba(79,124,255,0.14), rgba(139,92,246,0.14));
    border: 1px solid rgba(79,124,255,0.18);
    display: flex; align-items: center; justify-content: center;
    color: #4f7cff;
  }
  .dark .privacy-section-icon, .privacy-root.dark-mode .privacy-section-icon { color: #6e9fff; }

  .privacy-section-number {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px; font-weight: 700; color: #8b5cf6;
    letter-spacing: 0.08em;
  }
  .dark .privacy-section-number, .privacy-root.dark-mode .privacy-section-number { color: #a78bfa; }

  .privacy-section-title {
    font-size: 16.5px; font-weight: 700; margin-top: 2px;
  }

  .privacy-section-body {
    font-size: 13.5px; line-height: 2; color: #4b5876;
  }
  .dark .privacy-section-body, .privacy-root.dark-mode .privacy-section-body { color: #b6c0da; }

  .privacy-list {
    list-style: none; margin: 8px 0 0; padding: 0;
    display: grid; gap: 6px;
  }
  .privacy-list li {
    display: flex; align-items: flex-start; gap: 8px;
    font-size: 13.5px; line-height: 1.8; color: #4b5876;
  }
  .dark .privacy-list li, .privacy-root.dark-mode .privacy-list li { color: #b6c0da; }
  .privacy-list li::before {
    content: '';
    width: 6px; height: 6px; border-radius: 2px; margin-top: 7px; flex-shrink: 0;
    background: linear-gradient(135deg, #4f7cff, #8b5cf6);
  }

  .privacy-subhead {
    font-size: 12px; font-weight: 700; color: #6b7a99;
    letter-spacing: 0.04em; margin: 14px 0 4px;
    text-transform: uppercase;
  }
  .dark .privacy-subhead, .privacy-root.dark-mode .privacy-subhead { color: #8896b0; }
  .privacy-subhead:first-child { margin-top: 0; }

  /* ── Contact card ── */
  .privacy-contact {
    background: linear-gradient(135deg, rgba(79,124,255,0.10), rgba(139,92,246,0.10));
    border: 1px solid rgba(79,124,255,0.18);
    border-radius: 18px;
    padding: 24px 26px;
    margin-top: 8px;
    text-align: center;
  }
  .privacy-contact-title { font-size: 16px; font-weight: 700; margin-bottom: 6px; }
  .privacy-contact-text { font-size: 13px; color: #6b7a99; margin-bottom: 14px; }
  .dark .privacy-contact-text, .privacy-root.dark-mode .privacy-contact-text { color: #8896b0; }
  .privacy-contact-link {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 10px 20px; border-radius: 99px;
    background: linear-gradient(135deg, #4f7cff, #8b5cf6);
    color: #fff; font-size: 13px; font-weight: 600;
    text-decoration: none; margin: 4px 6px;
    box-shadow: 0 4px 16px rgba(79,124,255,0.25);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  .privacy-contact-link:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 22px rgba(79,124,255,0.32);
  }
  .privacy-contact-link.secondary {
    background: rgba(255,255,255,0.65);
    color: #4f7cff; border: 1px solid rgba(79,124,255,0.2);
    box-shadow: none;
  }
  .dark .privacy-contact-link.secondary, .privacy-root.dark-mode .privacy-contact-link.secondary {
    background: rgba(255,255,255,0.07); color: #6e9fff; border-color: rgba(110,159,255,0.25);
  }

  .privacy-footer-note {
    text-align: center; font-size: 12px; color: #8896b0;
    margin-top: 28px; line-height: 1.8;
  }

  @media (max-width: 640px) {
    .privacy-title { font-size: 22px; }
    .privacy-section, .privacy-hero { padding: 20px 18px; }
  }
`;

const sections = [
  {
    number: "01",
    icon: Database,
    title: "المعلومات التي نقوم بجمعها",
    body: (
      <>
        <div className="privacy-subhead">المعلومات الشخصية</div>
        <ul className="privacy-list">
          <li>الاسم الكامل</li>
          <li>البريد الإلكتروني</li>
          <li>رقم الهاتف (اختياري)</li>
          <li>الصورة الشخصية (اختياري)</li>
          <li>الدولة واللغة المفضلة</li>
        </ul>

        <div className="privacy-subhead">بيانات التعلم والتقدم الدراسي</div>
        <ul className="privacy-list">
          <li>سجلات تقدم الكورسات وإنجازها</li>
          <li>نتائج الاختبارات والكويزات</li>
          <li>نتائج اختبارات IELTS وSTEP التجريبية</li>
          <li>تفضيلات وأهداف التعلم</li>
          <li>سجل النشاط والدراسة</li>
        </ul>

        <div className="privacy-subhead">المعلومات التقنية</div>
        <ul className="privacy-list">
          <li>نوع الجهاز ونظام التشغيل</li>
          <li>عنوان IP</li>
          <li>إصدار التطبيق</li>
          <li>إحصاءات الاستخدام والتحليلات</li>
          <li>تقارير الأعطال والمعلومات التشخيصية</li>
        </ul>

        <div className="privacy-subhead">البيانات الصوتية والنصية</div>
        <p>
          عند استخدام ميزات التحدث أو الكتابة، قد نجمع التسجيلات الصوتية،
          الإجابات والمقالات المكتوبة، والملاحظات والتقييمات المُولّدة بالذكاء
          الاصطناعي. تُجمع هذه البيانات فقط لتقديم الخدمات التعليمية وتحسين
          نتائج التعلم.
        </p>
      </>
    ),
  },
  {
    number: "02",
    icon: Sparkles,
    title: "كيف نستخدم معلوماتك",
    body: (
      <ul className="privacy-list">
        <li>إنشاء وإدارة حسابك</li>
        <li>تقديم محتوى تعليمي لتعلم اللغة الإنجليزية</li>
        <li>تتبع تقدمك التعليمي</li>
        <li>تقديم توصيات تعلم مخصصة</li>
        <li>إنشاء تقارير أداء لاختباري IELTS وSTEP</li>
        <li>تحسين وظائف التطبيق وتجربة الاستخدام</li>
        <li>تقديم دعم العملاء</li>
        <li>إرسال إشعارات مهمة بخصوص حسابك أو الخدمات</li>
        <li>الحفاظ على أمان المنصة ومنع إساءة الاستخدام</li>
      </ul>
    ),
    note: "لا نقوم ببيع معلوماتك الشخصية لأي طرف ثالث.",
  },
  {
    number: "03",
    icon: Share2,
    title: "مشاركة المعلومات",
    body: (
      <>
        <p style={{ marginBottom: 8 }}>
          قد نشارك المعلومات فقط في الحالات التالية:
        </p>
        <ul className="privacy-list">
          <li>مع مزودي الخدمات الموثوقين الذين يساعدوننا في تشغيل التطبيق</li>
          <li>مع مزودي الاستضافة السحابية والتحليلات</li>
          <li>عند الطلب من السلطات القانونية المختصة</li>
          <li>لحماية حقوق وأمان SabrLingua ومستخدميها</li>
          <li>بموافقتك الصريحة</li>
        </ul>
      </>
    ),
    note: "لا نقوم بتأجير أو بيع معلوماتك الشخصية للمعلنين أو أي طرف ثالث.",
  },
  {
    number: "04",
    icon: Lock,
    title: "أمان البيانات",
    body: (
      <>
        <p style={{ marginBottom: 8 }}>
          نطبّق إجراءات أمان بمعايير الصناعة لحماية معلوماتك، تشمل:
        </p>
        <ul className="privacy-list">
          <li>اتصالات HTTPS مشفّرة</li>
          <li>تشفير البيانات عند الحاجة</li>
          <li>صلاحيات وصول محدودة للمعلومات الشخصية</li>
          <li>مراقبة وتحديثات أمنية دورية</li>
        </ul>
        <p style={{ marginTop: 10 }}>
          مع أننا نسعى لحماية معلوماتك، لا يمكن لأي خدمة عبر الإنترنت ضمان
          الأمان المطلق.
        </p>
      </>
    ),
  },
  {
    number: "05",
    icon: Clock,
    title: "مدة الاحتفاظ بالبيانات",
    body: (
      <>
        <p style={{ marginBottom: 8 }}>نحتفظ بمعلوماتك فقط للمدة اللازمة لـ:</p>
        <ul className="privacy-list">
          <li>تقديم الخدمات التعليمية</li>
          <li>الحفاظ على سجل تعلمك</li>
          <li>الامتثال للالتزامات القانونية</li>
          <li>حل النزاعات وتطبيق سياساتنا</li>
        </ul>
        <p style={{ marginTop: 10 }}>
          عندما لا تكون معلوماتك مطلوبة بعد ذلك، سيتم حذفها أو إخفاء هويتها بشكل
          آمن.
        </p>
      </>
    ),
  },
  {
    number: "06",
    icon: Baby,
    title: "خصوصية الأطفال",
    body: (
      <>
        <p>تطبيق SabrLingua مخصص للمتعلمين من عمر 13 عامًا فأكثر.</p>
        <p style={{ marginTop: 8 }}>
          إذا كان عمرك أقل من العمر المطلوب وفق القوانين المعمول بها في بلدك،
          فقد يلزم الحصول على موافقة الوالدين أو ولي الأمر قبل استخدام بعض
          الميزات.
        </p>
        <p style={{ marginTop: 8 }}>
          نحن لا نجمع عمدًا معلومات شخصية من الأطفال بما يخالف القوانين المعمول
          بها.
        </p>
      </>
    ),
  },
  {
    number: "07",
    icon: Sparkles,
    title: "ميزات الذكاء الاصطناعي والتحليل التعليمي",
    body: (
      <>
        <p style={{ marginBottom: 8 }}>
          بعض ميزات SabrLingua تستخدم الذكاء الاصطناعي من أجل:
        </p>
        <ul className="privacy-list">
          <li>تقييم مهام الكتابة</li>
          <li>تحليل أداء التحدث</li>
          <li>توليد ملاحظات شخصية</li>
          <li>التوصية بخطط ومواد دراسية</li>
        </ul>
        <p style={{ marginTop: 10 }}>
          تُعالج أي تسجيلات صوتية أو نصية مُقدّمة لهذه الخدمات لأغراض تعليمية
          فقط.
        </p>
      </>
    ),
  },
  {
    number: "08",
    icon: UserCheck,
    title: "حقوقك المتعلقة بالخصوصية",
    body: (
      <>
        <p style={{ marginBottom: 8 }}>
          وفقًا للقوانين المعمول بها، قد يكون لديك الحق في:
        </p>
        <ul className="privacy-list">
          <li>الوصول إلى معلوماتك الشخصية</li>
          <li>تصحيح المعلومات غير الدقيقة</li>
          <li>طلب حذف بياناتك</li>
          <li>سحب الموافقة عند الإمكان</li>
          <li>طلب نسخة من بياناتك المخزّنة</li>
        </ul>
        <p style={{ marginTop: 10 }}>
          لممارسة هذه الحقوق، يرجى التواصل معنا عبر البيانات الموجودة أدناه.
        </p>
      </>
    ),
  },
  {
    number: "09",
    icon: Trash2,
    title: "حذف الحساب",
    body: (
      <>
        <p>يمكنك طلب حذف حسابك في أي وقت.</p>
        <p style={{ marginTop: 8 }}>
          بعد التحقق من هويتك بنجاح، سنقوم بحذف معلوماتك الشخصية أو إخفاء
          هويتها، إلا إذا تطلب القانون الاحتفاظ بها.
        </p>
        <p style={{ marginTop: 8 }}>
          قد يتم الاحتفاظ ببعض السجلات التعليمية لفترة محدودة عند الضرورة
          القانونية.
        </p>
      </>
    ),
  },
  {
    number: "10",
    icon: Plug,
    title: "خدمات الطرف الثالث",
    body: (
      <>
        <p style={{ marginBottom: 8 }}>
          قد يستخدم SabrLingua خدمات طرف ثالث موثوقة من أجل:
        </p>
        <ul className="privacy-list">
          <li>الاستضافة السحابية</li>
          <li>التحليلات</li>
          <li>المصادقة</li>
          <li>معالجة الدفعات</li>
          <li>ميزات تعليمية مدعومة بالذكاء الاصطناعي</li>
        </ul>
        <p style={{ marginTop: 10 }}>
          يُطلب من هؤلاء المزودين حماية معلوماتك واستخدامها فقط للأغراض المصرّح
          بها.
        </p>
      </>
    ),
  },
  {
    number: "11",
    icon: RefreshCw,
    title: "التغييرات على سياسة الخصوصية",
    body: (
      <p>
        قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر. سيتم نشر أي تغييرات داخل
        التطبيق وتصبح سارية فور نشرها. استمرارك في استخدام SabrLingua بعد
        التحديثات يعني موافقتك على السياسة المُحدّثة.
      </p>
    ),
  },
];

export default function PrivacyPolicy() {
  useEffect(() => {
    const id = "privacy-policy-styles";
    if (!document.getElementById(id)) {
      const tag = document.createElement("style");
      tag.id = id;
      tag.textContent = PRIVACY_STYLES;
      document.head.appendChild(tag);
    }
  }, []);

  return (
    <div className="privacy-root">
      <div className="privacy-orb privacy-orb-1" />
      <div className="privacy-orb privacy-orb-2" />
      <div className="privacy-orb privacy-orb-3" />

      <div className="privacy-shell">
        {/* Hero */}
        <div className="privacy-hero">
          <div className="privacy-hero-icon">
            <ShieldCheck size={26} color="#fff" strokeWidth={2.5} />
          </div>
          <div className="privacy-eyebrow">
            <Sparkles size={11} />
            SABRLINGUA · PRIVACY
          </div>
          <h1 className="privacy-title">سياسة الخصوصية</h1>
          <p className="privacy-subtitle">
            مرحبًا بك في SabrLingua، التطبيق التعليمي السعودي المخصص لمساعدة
            المتعلمين على تطوير مهاراتهم في اللغة الإنجليزية من خلال دورات اللغة
            الإنجليزية العامة ومواد التحضير لاختبارات IELTS وSTEP. نحترم خصوصيتك
            ونلتزم بحماية معلوماتك الشخصية، وتوضّح هذه السياسة كيفية جمع
            معلوماتك واستخدامها وتخزينها وحمايتها.
          </p>
          <div className="privacy-meta">
            <Clock size={12} />
            تاريخ السريان: 13 يونيو 2026
          </div>
        </div>

        {/* Sections */}
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <div className="privacy-section" key={section.number}>
              <div className="privacy-section-head">
                <div className="privacy-section-icon">
                  <Icon size={18} />
                </div>
                <div>
                  <div className="privacy-section-number">{section.number}</div>
                  <div className="privacy-section-title">{section.title}</div>
                </div>
              </div>
              <div className="privacy-section-body">
                {section.body}
                {section.note && (
                  <p style={{ marginTop: 12, fontWeight: 600 }}>
                    {section.note}
                  </p>
                )}
              </div>
            </div>
          );
        })}

        {/* Contact */}
        <div className="privacy-contact">
          <div className="privacy-contact-title">تواصل معنا</div>
          <p className="privacy-contact-text">
            لو عندك أي سؤال بخصوص سياسة الخصوصية أو معلوماتك الشخصية، فريق دعم
            SabrLingua جاهز للمساعدة.
          </p>
          <a className="privacy-contact-link" href="info@sabrconsult.com">
            <Mail size={15} />
            info@sabrconsult.com
          </a>
        </div>

        <p className="privacy-footer-note">
          باستخدامك لتطبيق SabrLingua، فإنك تؤكد أنك قرأت وفهمت سياسة الخصوصية
          هذه وتوافق على أحكامها.
        </p>
      </div>
    </div>
  );
}
