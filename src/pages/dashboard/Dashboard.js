// src/pages/Dashboard.jsx
import { Link } from "react-router-dom";
import { useEffect } from "react";
import {
  ArrowLeft,
  Globe,
  BookMarked,
  BookOpen,
  Users,
  LayoutGrid,
  CreditCard,
  Sparkles,
} from "lucide-react";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const DASH_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');

  .dash-page { font-family: 'Sora', sans-serif; }

  /* ── Welcome banner ── */
  .welcome-banner {
    position: relative;
    border-radius: 20px;
    padding: 36px 40px;
    overflow: hidden;
    background: rgba(255,255,255,0.55);
    backdrop-filter: blur(24px) saturate(180%);
    -webkit-backdrop-filter: blur(24px) saturate(180%);
    border: 1px solid rgba(255,255,255,0.9);
    box-shadow:
      0 4px 32px rgba(79,124,255,0.10),
      0 1px 0 rgba(255,255,255,0.8) inset;
    margin-bottom: 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
  }
  .welcome-banner::before {
    content: '';
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse 60% 80% at 0% 50%, rgba(79,124,255,0.10) 0%, transparent 70%),
      radial-gradient(ellipse 40% 60% at 100% 20%, rgba(139,92,246,0.08) 0%, transparent 70%);
    pointer-events: none;
  }
  .welcome-text { position: relative; z-index: 1; }
  .welcome-title {
    font-size: 26px; font-weight: 700;
    color: #1a2035; margin-bottom: 6px; line-height: 1.2;
  }
  .welcome-title span {
    background: linear-gradient(135deg, #4f7cff, #8b5cf6);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .welcome-subtitle { font-size: 14px; color: #6b7a99; font-weight: 400; }
  .welcome-badge {
    position: relative; z-index: 1;
    display: flex; align-items: center; gap: 8px;
    padding: 10px 18px; border-radius: 99px;
    background: linear-gradient(135deg, rgba(79,124,255,0.12), rgba(139,92,246,0.12));
    border: 1px solid rgba(79,124,255,0.2);
    font-size: 12px; font-weight: 600; color: #4f7cff;
    white-space: nowrap;
  }
  .welcome-orb {
    position: absolute;
    border-radius: 50%; filter: blur(40px); pointer-events: none;
  }
  .welcome-orb-1 {
    width: 200px; height: 200px; top: -60px; right: 80px;
    background: radial-gradient(circle, rgba(139,92,246,0.18), transparent 70%);
  }
  .welcome-orb-2 {
    width: 150px; height: 150px; bottom: -40px; right: 20px;
    background: radial-gradient(circle, rgba(79,124,255,0.15), transparent 70%);
  }

  /* ── Section header ── */
  .section-header {
    display: flex; align-items: center; gap: 10px;
    margin-bottom: 20px;
  }
  .section-header-line {
    width: 3px; height: 20px; border-radius: 99px;
    background: linear-gradient(180deg, #4f7cff, #8b5cf6);
    box-shadow: 0 0 8px rgba(79,124,255,0.4);
  }
  .section-header-title {
    font-size: 13px; font-weight: 600; letter-spacing: 0.1em;
    color: #6b7a99; text-transform: uppercase;
  }

  /* ── Grid ── */
  .modules-grid {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 18px;
  }
  @media (min-width: 640px)  { .modules-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (min-width: 1024px) { .modules-grid { grid-template-columns: repeat(3, 1fr); } }

  /* ── Module card ── */
  .module-card {
    position: relative;
    display: flex; flex-direction: column;
    border-radius: 18px; overflow: hidden;
    text-decoration: none;
    background: rgba(255,255,255,0.55);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border: 1px solid rgba(255,255,255,0.88);
    box-shadow: 0 2px 20px rgba(79,124,255,0.07), 0 1px 0 rgba(255,255,255,0.7) inset;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
  }
  .module-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(79,124,255,0.15), 0 1px 0 rgba(255,255,255,0.9) inset;
    border-color: rgba(255,255,255,0.98);
    background: rgba(255,255,255,0.72);
  }

  /* color accent strip at top */
  .card-strip {
    height: 4px; width: 100%;
    border-radius: 18px 18px 0 0;
  }

  /* card body */
  .card-body { padding: 22px 22px 18px; flex: 1; display: flex; flex-direction: column; }

  .card-icon-wrap {
    width: 48px; height: 48px; border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 16px; flex-shrink: 0;
    transition: transform 0.3s ease;
  }
  .module-card:hover .card-icon-wrap { transform: scale(1.08); }

  .card-name {
    font-size: 15px; font-weight: 700; color: #1a2035;
    margin-bottom: 5px; line-height: 1.3;
  }
  .card-desc {
    font-size: 12.5px; color: #6b7a99; line-height: 1.55; flex: 1;
  }

  .card-footer {
    margin-top: 18px; padding-top: 14px;
    border-top: 1px solid rgba(0,0,0,0.05);
    display: flex; align-items: center; justify-content: space-between;
  }
  .card-cta {
    display: flex; align-items: center; gap: 5px;
    font-size: 12.5px; font-weight: 600;
    transition: gap 0.2s ease;
  }
  .module-card:hover .card-cta { gap: 8px; }

  .card-hint {
    font-size: 11px; color: #9ca3b0;
    padding: 4px 10px; border-radius: 99px;
    background: rgba(0,0,0,0.04);
    border: 1px solid rgba(0,0,0,0.06);
  }

  /* arrow icon */
  .card-arrow {
    transition: transform 0.25s ease;
  }
  .module-card:hover .card-arrow { transform: translateX(-4px); }
`;

/* ─── Module config ──────────────────────────────────────────────────────── */
const modules = [
  {
    id: "general-system",
    name: "GENERAL System",
    description: "General Questions in English",
    icon: BookOpen,
    strip: "linear-gradient(90deg, #10b981, #059669)",
    iconBg: "rgba(16,185,129,0.12)",
    iconColor: "#10b981",
    ctaColor: "#10b981",
    link: "/dashboard/general",
  },
  {
    id: "all-tests-system",
    name: "ALL TESTS System",
    description: "Special Tests in English",
    icon: BookMarked,
    strip: "linear-gradient(90deg, #f59e0b, #d97706)",
    iconBg: "rgba(245,158,11,0.12)",
    iconColor: "#f59e0b",
    ctaColor: "#d97706",
    link: "/dashboard/esp",
  },
  {
    id: "ielts-system",
    name: "IELTS System",
    description: "Manage IELTS System",
    icon: Globe,
    strip: "linear-gradient(90deg, #f97316, #ea580c)",
    iconBg: "rgba(249,115,22,0.12)",
    iconColor: "#f97316",
    ctaColor: "#ea580c",
    link: "/dashboard/ielts",
  },
  {
    id: "step-system",
    name: "STEP System",
    description: "Manage STEP System",
    icon: BookMarked,
    strip: "linear-gradient(90deg, #4f7cff, #6366f1)",
    iconBg: "rgba(79,124,255,0.12)",
    iconColor: "#4f7cff",
    ctaColor: "#4f7cff",
    link: "/dashboard/step",
  },
  {
    id: "teachers",
    name: "Teachers",
    description: "Manage teachers, reviews & ratings",
    icon: Users,
    strip: "linear-gradient(90deg, #8b5cf6, #7c3aed)",
    iconBg: "rgba(139,92,246,0.12)",
    iconColor: "#8b5cf6",
    ctaColor: "#7c3aed",
    link: "/dashboard/teachers",
  },
  {
    id: "programs",
    name: "Programs",
    description: "Create & manage teaching programs",
    icon: LayoutGrid,
    strip: "linear-gradient(90deg, #6366f1, #4f7cff)",
    iconBg: "rgba(99,102,241,0.12)",
    iconColor: "#6366f1",
    ctaColor: "#6366f1",
    link: "/dashboard/programs",
  },
  {
    id: "subscriptions",
    name: "Subscriptions",
    description: "View & manage student subscriptions",
    icon: CreditCard,
    strip: "linear-gradient(90deg, #14b8a6, #0d9488)",
    iconBg: "rgba(20,184,166,0.12)",
    iconColor: "#14b8a6",
    ctaColor: "#0d9488",
    link: "/dashboard/subscriptions",
  },
];

/* ─── Component ──────────────────────────────────────────────────────────── */
export default function Dashboard() {
  useEffect(() => {
    const id = "glass-dash-page-styles";
    if (!document.getElementById(id)) {
      const tag = document.createElement("style");
      tag.id = id;
      tag.textContent = DASH_STYLES;
      document.head.appendChild(tag);
    }
  }, []);

  return (
    <div className="dash-page">
      {/* ── Welcome Banner ── */}
      <div className="welcome-banner">
        <div className="welcome-orb welcome-orb-1" />
        <div className="welcome-orb welcome-orb-2" />

        <div className="welcome-text">
          <h1 className="welcome-title">
            Welcome to <span>SABRLINGUA</span>
          </h1>
          <p className="welcome-subtitle">
            Choose the section you want to manage.
          </p>
        </div>

        <div className="welcome-badge">
          <Sparkles size={13} />
          Pro Dashboard
        </div>
      </div>

      {/* ── Section header ── */}
      <div className="section-header">
        <div className="section-header-line" />
        <span className="section-header-title">All Modules</span>
      </div>

      {/* ── Grid ── */}
      <div className="modules-grid">
        {modules.map((mod) => {
          const Icon = mod.icon;
          return (
            <Link key={mod.id} to={mod.link} className="module-card">
              {/* color strip */}
              <div className="card-strip" style={{ background: mod.strip }} />

              {/* body */}
              <div className="card-body">
                {/* icon */}
                <div
                  className="card-icon-wrap"
                  style={{ background: mod.iconBg }}
                >
                  <Icon size={22} color={mod.iconColor} strokeWidth={2} />
                </div>

                <div className="card-name">{mod.name}</div>
                <div className="card-desc">{mod.description}</div>

                <div className="card-footer">
                  <span className="card-cta" style={{ color: mod.ctaColor }}>
                    Open
                    <ArrowLeft size={14} className="card-arrow" />
                  </span>
                  <span className="card-hint">Press here</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
