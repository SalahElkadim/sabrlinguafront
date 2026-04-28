// src/pages/ielts/IELTSMain.jsx
import { Link } from "react-router-dom";
import {
  BookOpen,
  PenTool,
  Volume2,
  FileText,
  ArrowLeft,
  Headphones,
  Sparkles,
  Video,
} from "lucide-react";

/* ─── Page-scoped styles (inherits CSS vars from DashboardLayout) ─── */
const PAGE_STYLES = `
  /* ── IELTS page tokens ── */
  :root {
    --ielts-card-bg:      rgba(255,255,255,0.58);
    --ielts-card-border:  rgba(255,255,255,0.90);
    --ielts-card-shadow:  rgba(79,124,255,0.08);
    --ielts-card-hover:   rgba(255,255,255,0.80);
    --ielts-inner-bg:     rgba(255,255,255,0.45);
    --ielts-inner-border: rgba(255,255,255,0.80);
    --ielts-skill-bg:     rgba(255,255,255,0.50);
    --ielts-skill-border: rgba(255,255,255,0.82);
    --ielts-badge-bg:     rgba(255,255,255,0.22);
    --ielts-footer-text:  #6b7a99;
  }
  .dark {
    --ielts-card-bg:      rgba(255,255,255,0.05);
    --ielts-card-border:  rgba(255,255,255,0.09);
    --ielts-card-shadow:  rgba(0,0,0,0.25);
    --ielts-card-hover:   rgba(255,255,255,0.09);
    --ielts-inner-bg:     rgba(255,255,255,0.04);
    --ielts-inner-border: rgba(255,255,255,0.08);
    --ielts-skill-bg:     rgba(255,255,255,0.05);
    --ielts-skill-border: rgba(255,255,255,0.09);
    --ielts-badge-bg:     rgba(255,255,255,0.14);
    --ielts-footer-text:  #8896b0;
  }

  /* ── Base card ── */
  .ielts-card {
    background:   var(--ielts-card-bg);
    border:       1px solid var(--ielts-card-border);
    border-radius: 18px;
    backdrop-filter: blur(20px) saturate(160%);
    -webkit-backdrop-filter: blur(20px) saturate(160%);
    box-shadow:   0 4px 24px var(--ielts-card-shadow),
                  0 1px 0 rgba(255,255,255,0.55) inset;
    padding: 24px;
    transition:   background 0.4s ease, border-color 0.4s ease,
                  box-shadow 0.3s ease, transform 0.3s ease;
  }

  /* ── Hero banner ── */
  .ielts-hero {
    padding: 32px 28px;
    border-radius: 18px;
    position: relative; overflow: hidden;
    background: linear-gradient(135deg, #3b6fd4 0%, #4f7cff 45%, #7c3aed 100%);
    box-shadow: 0 8px 32px rgba(79,124,255,0.30), 0 1px 0 rgba(255,255,255,0.20) inset;
    border: 1px solid rgba(255,255,255,0.20);
  }
  .dark .ielts-hero {
    background: linear-gradient(135deg, #1e3a7a 0%, #2d4fa8 45%, #4c1d95 100%);
    box-shadow: 0 8px 32px rgba(30,58,122,0.50), 0 1px 0 rgba(255,255,255,0.08) inset;
  }
  .ielts-hero::before {
    content: '';
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse 60% 80% at 85% 30%, rgba(255,255,255,0.10), transparent),
      radial-gradient(ellipse 40% 55% at 15% 80%, rgba(139,92,246,0.25), transparent);
    pointer-events: none;
  }
  .ielts-hero-floating {
    position: absolute; right: 28px; top: 50%; transform: translateY(-50%);
    display: flex; flex-direction: column; gap: 8px; opacity: 0.22;
    pointer-events: none;
  }
  .ielts-hero-dot {
    width: 48px; height: 48px; border-radius: 14px;
    border: 2px solid rgba(255,255,255,0.6);
  }

  /* ── Hero text ── */
  .ielts-hero-eyebrow {
    font-size: 10px; font-weight: 600; letter-spacing: 0.18em;
    text-transform: uppercase; color: rgba(255,255,255,0.65);
    margin-bottom: 8px; font-family: 'JetBrains Mono', monospace;
    display: flex; align-items: center; gap: 6px;
  }
  .ielts-hero-eyebrow-dot {
    width: 5px; height: 5px; border-radius: 50%;
    background: rgba(255,255,255,0.6);
  }
  .ielts-hero-title {
    font-size: 28px; font-weight: 700; color: #fff;
    letter-spacing: -0.02em; margin-bottom: 6px;
  }
  .ielts-hero-sub {
    font-size: 13.5px; color: rgba(255,255,255,0.72); font-weight: 400;
    max-width: 480px;
  }

  /* ── Skills overview section ── */
  .ielts-section-title {
    font-size: 12px; font-weight: 600; letter-spacing: 0.13em;
    text-transform: uppercase; color: var(--text-secondary);
    margin-bottom: 14px; display: flex; align-items: center; gap: 8px;
    font-family: 'JetBrains Mono', monospace;
    transition: color 0.4s ease;
  }
  .ielts-section-title::after {
    content: ''; flex: 1; height: 1px;
    background: linear-gradient(90deg, var(--ielts-card-border), transparent);
  }

  .ielts-skill-grid {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;
  }
  @media (min-width: 768px) {
    .ielts-skill-grid { grid-template-columns: repeat(6, 1fr); }
  }

  .ielts-skill-chip {
    background: var(--ielts-skill-bg);
    border: 1px solid var(--ielts-skill-border);
    border-radius: 14px; padding: 14px 8px;
    display: flex; flex-direction: column; align-items: center; gap: 8px;
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    transition: all 0.25s ease;
    cursor: default;
  }
  .ielts-skill-chip:hover {
    background: var(--ielts-card-hover);
    border-color: var(--ielts-card-border);
    transform: translateY(-3px);
    box-shadow: 0 6px 18px var(--ielts-card-shadow);
  }
  .ielts-skill-icon-wrap {
    width: 40px; height: 40px; border-radius: 11px;
    display: flex; align-items: center; justify-content: center;
    transition: transform 0.25s ease;
  }
  .ielts-skill-chip:hover .ielts-skill-icon-wrap {
    transform: scale(1.10);
  }
  .ielts-skill-label {
    font-size: 10.5px; font-weight: 600;
    color: var(--text-primary);
    transition: color 0.4s ease;
    text-align: center;
  }

  /* ── Nav cards ── */
  .ielts-nav-grid {
    display: grid; grid-template-columns: 1fr; gap: 18px;
  }
  @media (min-width: 1024px) {
    .ielts-nav-grid { grid-template-columns: 1fr 1fr; }
  }

  .ielts-nav-card {
    display: block; text-decoration: none;
    background: var(--ielts-card-bg);
    border: 1px solid var(--ielts-card-border);
    border-radius: 18px;
    backdrop-filter: blur(20px) saturate(160%);
    -webkit-backdrop-filter: blur(20px) saturate(160%);
    box-shadow: 0 4px 24px var(--ielts-card-shadow),
                0 1px 0 rgba(255,255,255,0.55) inset;
    overflow: hidden;
    transition: all 0.30s cubic-bezier(0.34,1.20,0.64,1);
  }
  .ielts-nav-card:hover {
    transform: translateY(-4px) scale(1.012);
    box-shadow: 0 14px 40px var(--ielts-card-shadow),
                0 1px 0 rgba(255,255,255,0.55) inset;
    border-color: var(--ielts-card-hover);
  }

  .ielts-nav-banner {
    padding: 22px 24px;
    display: flex; align-items: center; justify-content: space-between;
    position: relative; overflow: hidden;
  }
  .ielts-nav-banner::before {
    content: '';
    position: absolute; inset: 0;
    background: radial-gradient(ellipse 55% 70% at 90% 20%, rgba(255,255,255,0.14), transparent);
    pointer-events: none;
  }
  .ielts-nav-banner-left { display: flex; align-items: center; gap: 16px; }
  .ielts-nav-banner-icon {
    width: 52px; height: 52px; border-radius: 15px;
    background: rgba(255,255,255,0.20);
    border: 1px solid rgba(255,255,255,0.30);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 2px 10px rgba(0,0,0,0.10);
  }
  .ielts-nav-banner-title {
    font-size: 18px; font-weight: 700; color: #fff;
    letter-spacing: -0.01em; margin-bottom: 4px;
    display: flex; align-items: center; gap: 8px;
  }
  .ielts-nav-banner-desc {
    font-size: 12.5px; color: rgba(255,255,255,0.72); font-weight: 400;
    max-width: 300px; line-height: 1.5;
  }
  .ielts-nav-badge {
    font-size: 10px; font-weight: 600; letter-spacing: 0.04em;
    background: var(--ielts-badge-bg);
    border: 1px solid rgba(255,255,255,0.30);
    color: #fff; padding: 2px 9px; border-radius: 99px;
  }
  .ielts-nav-arrow {
    color: rgba(255,255,255,0.75); flex-shrink: 0;
    transition: transform 0.25s ease;
  }
  .ielts-nav-card:hover .ielts-nav-arrow {
    transform: translateX(-6px);
  }

  .ielts-nav-footer {
    padding: 13px 24px;
    display: flex; align-items: center; justify-content: space-between;
    background: var(--ielts-inner-bg);
    border-top: 1px solid var(--ielts-inner-border);
    transition: background 0.4s ease, border-color 0.4s ease;
  }
  .ielts-nav-footer-hint {
    font-size: 12px; color: var(--ielts-footer-text);
    transition: color 0.4s ease;
  }
  .ielts-nav-footer-cta {
    font-size: 12px; font-weight: 600;
    transition: color 0.3s ease;
  }

  /* icon tint classes */
  .icon-blue   { color: #3b82f6; } .bg-blue   { background: rgba(59,130,246,0.12); }
  .icon-purple { color: #9333ea; } .bg-purple { background: rgba(147,51,234,0.12); }
  .icon-orange { color: #f97316; } .bg-orange { background: rgba(249,115,22,0.12); }
  .icon-cyan   { color: #06b6d4; } .bg-cyan   { background: rgba(6,182,212,0.12); }
  .icon-rose   { color: #f43f5e; } .bg-rose   { background: rgba(244,63,94,0.12); }
  .icon-green  { color: #22c55e; } .bg-green  { background: rgba(34,197,94,0.12); }
`;

function injectStyles() {
  const id = "ielts-page-styles";
  if (!document.getElementById(id)) {
    const tag = document.createElement("style");
    tag.id = id;
    tag.textContent = PAGE_STYLES;
    document.head.appendChild(tag);
  }
}

export default function IELTSMain() {
  injectStyles();

  const sections = [
    {
      id: "skills",
      name: "IELTS Skills",
      description:
        "Manage IELTS skills — Vocabulary, Grammar, Reading, Listening, Speaking & Writing",
      icon: BookOpen,
      gradient:
        "linear-gradient(135deg, #2563eb 0%, #4f7cff 60%, #6d28d9 100%)",
      accentColor: "#60a5fa",
      link: "/dashboard/ielts/skills",
    },
    {
      id: "ai",
      name: "AI Generation",
      description:
        "Upload books or audio / video files and auto-generate IELTS questions with AI",
      icon: Sparkles,
      gradient:
        "linear-gradient(135deg, #7c3aed 0%, #8b5cf6 55%, #4f46e5 100%)",
      accentColor: "#c4b5fd",
      link: "/dashboard/ielts/ai",
      badge: "New ✨",
    },
  ];

  const skillCards = [
    {
      label: "Vocabulary",
      icon: Volume2,
      iconClass: "icon-blue",
      bgClass: "bg-blue",
    },
    {
      label: "Grammar",
      icon: PenTool,
      iconClass: "icon-purple",
      bgClass: "bg-purple",
    },
    {
      label: "Reading",
      icon: BookOpen,
      iconClass: "icon-orange",
      bgClass: "bg-orange",
    },
    {
      label: "Listening",
      icon: Headphones,
      iconClass: "icon-cyan",
      bgClass: "bg-cyan",
    },
    {
      label: "Speaking",
      icon: Video,
      iconClass: "icon-rose",
      bgClass: "bg-rose",
    },
    {
      label: "Writing",
      icon: FileText,
      iconClass: "icon-green",
      bgClass: "bg-green",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* ── Hero Banner ── */}
      <div className="ielts-hero">
        <div className="ielts-hero-floating">
          <div className="ielts-hero-dot" />
          <div
            className="ielts-hero-dot"
            style={{ width: 36, height: 36, borderRadius: 10 }}
          />
          <div
            className="ielts-hero-dot"
            style={{ width: 28, height: 28, borderRadius: 8 }}
          />
        </div>
        <div className="ielts-hero-eyebrow">
          <div className="ielts-hero-eyebrow-dot" />
          Pro Dashboard · Language Systems
        </div>
        <h1 className="ielts-hero-title">IELTS System</h1>
        <p className="ielts-hero-sub">
          Manage the full IELTS exam system — skills, questions, and AI-powered
          content generation.
        </p>
      </div>

      {/* ── Available Skills ── */}
      <div className="ielts-card">
        <div className="ielts-section-title">Available Skills</div>
        <div className="ielts-skill-grid">
          {skillCards.map((skill) => {
            const Icon = skill.icon;
            return (
              <div key={skill.label} className="ielts-skill-chip">
                <div className={`ielts-skill-icon-wrap ${skill.bgClass}`}>
                  <Icon size={18} className={skill.iconClass} />
                </div>
                <span className="ielts-skill-label">{skill.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Navigation Cards ── */}
      <div className="ielts-nav-grid">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Link key={section.id} to={section.link} className="ielts-nav-card">
              {/* Banner */}
              <div
                className="ielts-nav-banner"
                style={{ background: section.gradient }}
              >
                <div className="ielts-nav-banner-left">
                  <div className="ielts-nav-banner-icon">
                    <Icon size={24} color="#fff" />
                  </div>
                  <div>
                    <div className="ielts-nav-banner-title">
                      {section.name}
                      {section.badge && (
                        <span className="ielts-nav-badge">{section.badge}</span>
                      )}
                    </div>
                    <p className="ielts-nav-banner-desc">
                      {section.description}
                    </p>
                  </div>
                </div>
                <ArrowLeft size={20} className="ielts-nav-arrow" />
              </div>

              {/* Footer */}
              <div className="ielts-nav-footer">
                <span className="ielts-nav-footer-hint">Tap to open</span>
                <span
                  className="ielts-nav-footer-cta"
                  style={{ color: section.accentColor }}
                >
                  Go →
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
