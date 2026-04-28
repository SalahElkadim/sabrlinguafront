// src/pages/step/STEPMain.jsx
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
  /* ── STEP page tokens ── */
  :root {
    --step-card-bg:      rgba(255,255,255,0.58);
    --step-card-border:  rgba(255,255,255,0.90);
    --step-card-shadow:  rgba(37,99,235,0.08);
    --step-card-hover:   rgba(255,255,255,0.80);
    --step-inner-bg:     rgba(255,255,255,0.45);
    --step-inner-border: rgba(255,255,255,0.80);
    --step-skill-bg:     rgba(255,255,255,0.50);
    --step-skill-border: rgba(255,255,255,0.82);
    --step-badge-bg:     rgba(255,255,255,0.22);
    --step-footer-text:  #6b7a99;
  }
  .dark {
    --step-card-bg:      rgba(255,255,255,0.05);
    --step-card-border:  rgba(255,255,255,0.09);
    --step-card-shadow:  rgba(0,0,0,0.25);
    --step-card-hover:   rgba(255,255,255,0.09);
    --step-inner-bg:     rgba(255,255,255,0.04);
    --step-inner-border: rgba(255,255,255,0.08);
    --step-skill-bg:     rgba(255,255,255,0.05);
    --step-skill-border: rgba(255,255,255,0.09);
    --step-badge-bg:     rgba(255,255,255,0.14);
    --step-footer-text:  #8896b0;
  }

  /* ── Base card ── */
  .step-card {
    background:   var(--step-card-bg);
    border:       1px solid var(--step-card-border);
    border-radius: 18px;
    backdrop-filter: blur(20px) saturate(160%);
    -webkit-backdrop-filter: blur(20px) saturate(160%);
    box-shadow:   0 4px 24px var(--step-card-shadow),
                  0 1px 0 rgba(255,255,255,0.55) inset;
    padding: 24px;
    transition:   background 0.4s ease, border-color 0.4s ease,
                  box-shadow 0.3s ease, transform 0.3s ease;
  }

  /* ── Hero banner ── */
  .step-hero {
    padding: 32px 28px;
    border-radius: 18px;
    position: relative; overflow: hidden;
    background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 45%, #4f46e5 100%);
    box-shadow: 0 8px 32px rgba(37,99,235,0.30), 0 1px 0 rgba(255,255,255,0.20) inset;
    border: 1px solid rgba(255,255,255,0.20);
  }
  .dark .step-hero {
    background: linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 45%, #312e81 100%);
    box-shadow: 0 8px 32px rgba(30,58,138,0.50), 0 1px 0 rgba(255,255,255,0.08) inset;
  }
  .step-hero::before {
    content: '';
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse 60% 80% at 85% 30%, rgba(255,255,255,0.10), transparent),
      radial-gradient(ellipse 40% 55% at 15% 80%, rgba(79,70,229,0.25), transparent);
    pointer-events: none;
  }
  .step-hero-floating {
    position: absolute; right: 28px; top: 50%; transform: translateY(-50%);
    display: flex; flex-direction: column; gap: 8px; opacity: 0.22;
    pointer-events: none;
  }
  .step-hero-dot {
    width: 48px; height: 48px; border-radius: 14px;
    border: 2px solid rgba(255,255,255,0.6);
  }

  /* ── Hero text ── */
  .step-hero-eyebrow {
    font-size: 10px; font-weight: 600; letter-spacing: 0.18em;
    text-transform: uppercase; color: rgba(255,255,255,0.65);
    margin-bottom: 8px; font-family: 'JetBrains Mono', monospace;
    display: flex; align-items: center; gap: 6px;
  }
  .step-hero-eyebrow-dot {
    width: 5px; height: 5px; border-radius: 50%;
    background: rgba(255,255,255,0.6);
  }
  .step-hero-title {
    font-size: 28px; font-weight: 700; color: #fff;
    letter-spacing: -0.02em; margin-bottom: 6px;
  }
  .step-hero-sub {
    font-size: 13.5px; color: rgba(255,255,255,0.72); font-weight: 400;
    max-width: 480px;
  }

  /* ── Skills overview section ── */
  .step-section-title {
    font-size: 12px; font-weight: 600; letter-spacing: 0.13em;
    text-transform: uppercase; color: var(--text-secondary);
    margin-bottom: 14px; display: flex; align-items: center; gap: 8px;
    font-family: 'JetBrains Mono', monospace;
    transition: color 0.4s ease;
  }
  .step-section-title::after {
    content: ''; flex: 1; height: 1px;
    background: linear-gradient(90deg, var(--step-card-border), transparent);
  }

  .step-skill-grid {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;
  }
  @media (min-width: 768px) {
    .step-skill-grid { grid-template-columns: repeat(6, 1fr); }
  }

  .step-skill-chip {
    background: var(--step-skill-bg);
    border: 1px solid var(--step-skill-border);
    border-radius: 14px; padding: 14px 8px;
    display: flex; flex-direction: column; align-items: center; gap: 8px;
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    transition: all 0.25s ease;
    cursor: default;
  }
  .step-skill-chip:hover {
    background: var(--step-card-hover);
    border-color: var(--step-card-border);
    transform: translateY(-3px);
    box-shadow: 0 6px 18px var(--step-card-shadow);
  }
  .step-skill-icon-wrap {
    width: 40px; height: 40px; border-radius: 11px;
    display: flex; align-items: center; justify-content: center;
    transition: transform 0.25s ease;
  }
  .step-skill-chip:hover .step-skill-icon-wrap {
    transform: scale(1.10);
  }
  .step-skill-label {
    font-size: 10.5px; font-weight: 600;
    color: var(--text-primary);
    transition: color 0.4s ease;
    text-align: center;
  }

  /* ── Nav cards ── */
  .step-nav-grid {
    display: grid; grid-template-columns: 1fr; gap: 18px;
  }
  @media (min-width: 1024px) {
    .step-nav-grid { grid-template-columns: 1fr 1fr; }
  }

  .step-nav-card {
    display: block; text-decoration: none;
    background: var(--step-card-bg);
    border: 1px solid var(--step-card-border);
    border-radius: 18px;
    backdrop-filter: blur(20px) saturate(160%);
    -webkit-backdrop-filter: blur(20px) saturate(160%);
    box-shadow: 0 4px 24px var(--step-card-shadow),
                0 1px 0 rgba(255,255,255,0.55) inset;
    overflow: hidden;
    transition: all 0.30s cubic-bezier(0.34,1.20,0.64,1);
  }
  .step-nav-card:hover {
    transform: translateY(-4px) scale(1.012);
    box-shadow: 0 14px 40px var(--step-card-shadow),
                0 1px 0 rgba(255,255,255,0.55) inset;
    border-color: var(--step-card-hover);
  }

  .step-nav-banner {
    padding: 22px 24px;
    display: flex; align-items: center; justify-content: space-between;
    position: relative; overflow: hidden;
  }
  .step-nav-banner::before {
    content: '';
    position: absolute; inset: 0;
    background: radial-gradient(ellipse 55% 70% at 90% 20%, rgba(255,255,255,0.14), transparent);
    pointer-events: none;
  }
  .step-nav-banner-left { display: flex; align-items: center; gap: 16px; }
  .step-nav-banner-icon {
    width: 52px; height: 52px; border-radius: 15px;
    background: rgba(255,255,255,0.20);
    border: 1px solid rgba(255,255,255,0.30);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 2px 10px rgba(0,0,0,0.10);
  }
  .step-nav-banner-title {
    font-size: 18px; font-weight: 700; color: #fff;
    letter-spacing: -0.01em; margin-bottom: 4px;
    display: flex; align-items: center; gap: 8px;
  }
  .step-nav-banner-desc {
    font-size: 12.5px; color: rgba(255,255,255,0.72); font-weight: 400;
    max-width: 300px; line-height: 1.5;
  }
  .step-nav-badge {
    font-size: 10px; font-weight: 600; letter-spacing: 0.04em;
    background: var(--step-badge-bg);
    border: 1px solid rgba(255,255,255,0.30);
    color: #fff; padding: 2px 9px; border-radius: 99px;
  }
  .step-nav-arrow {
    color: rgba(255,255,255,0.75); flex-shrink: 0;
    transition: transform 0.25s ease;
  }
  .step-nav-card:hover .step-nav-arrow {
    transform: translateX(-6px);
  }

  .step-nav-footer {
    padding: 13px 24px;
    display: flex; align-items: center; justify-content: space-between;
    background: var(--step-inner-bg);
    border-top: 1px solid var(--step-inner-border);
    transition: background 0.4s ease, border-color 0.4s ease;
  }
  .step-nav-footer-hint {
    font-size: 12px; color: var(--step-footer-text);
    transition: color 0.4s ease;
  }
  .step-nav-footer-cta {
    font-size: 12px; font-weight: 600;
    transition: color 0.3s ease;
  }

  /* icon tint classes (scoped for step) */
  .step-icon-blue   { color: #3b82f6; } .step-bg-blue   { background: rgba(59,130,246,0.12); }
  .step-icon-purple { color: #9333ea; } .step-bg-purple { background: rgba(147,51,234,0.12); }
  .step-icon-orange { color: #f97316; } .step-bg-orange { background: rgba(249,115,22,0.12); }
  .step-icon-cyan   { color: #06b6d4; } .step-bg-cyan   { background: rgba(6,182,212,0.12); }
  .step-icon-rose   { color: #f43f5e; } .step-bg-rose   { background: rgba(244,63,94,0.12); }
  .step-icon-green  { color: #22c55e; } .step-bg-green  { background: rgba(34,197,94,0.12); }
`;

function injectStyles() {
  const id = "step-page-styles";
  if (!document.getElementById(id)) {
    const tag = document.createElement("style");
    tag.id = id;
    tag.textContent = PAGE_STYLES;
    document.head.appendChild(tag);
  }
}

export default function STEPMain() {
  injectStyles();

  const sections = [
    {
      id: "skills",
      name: "STEP Skills",
      description:
        "Manage STEP skills — Vocabulary, Grammar, Reading, Listening, Speaking & Writing",
      icon: BookOpen,
      gradient:
        "linear-gradient(135deg, #1d4ed8 0%, #2563eb 60%, #4f46e5 100%)",
      accentColor: "#93c5fd",
      link: "/dashboard/step/skills",
    },
    {
      id: "ai",
      name: "AI Generation",
      description:
        "Upload books or audio / video files and auto-generate STEP questions with AI",
      icon: Sparkles,
      gradient:
        "linear-gradient(135deg, #4f46e5 0%, #6d28d9 55%, #7c3aed 100%)",
      accentColor: "#c4b5fd",
      link: "/dashboard/step/ai",
      badge: "New ✨",
    },
  ];

  const skillCards = [
    {
      label: "Vocabulary",
      icon: Volume2,
      iconClass: "step-icon-blue",
      bgClass: "step-bg-blue",
    },
    {
      label: "Grammar",
      icon: PenTool,
      iconClass: "step-icon-purple",
      bgClass: "step-bg-purple",
    },
    {
      label: "Reading",
      icon: BookOpen,
      iconClass: "step-icon-orange",
      bgClass: "step-bg-orange",
    },
    {
      label: "Listening",
      icon: Headphones,
      iconClass: "step-icon-cyan",
      bgClass: "step-bg-cyan",
    },
    {
      label: "Speaking",
      icon: Video,
      iconClass: "step-icon-rose",
      bgClass: "step-bg-rose",
    },
    {
      label: "Writing",
      icon: FileText,
      iconClass: "step-icon-green",
      bgClass: "step-bg-green",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* ── Hero Banner ── */}
      <div className="step-hero">
        <div className="step-hero-floating">
          <div className="step-hero-dot" />
          <div
            className="step-hero-dot"
            style={{ width: 36, height: 36, borderRadius: 10 }}
          />
          <div
            className="step-hero-dot"
            style={{ width: 28, height: 28, borderRadius: 8 }}
          />
        </div>
        <div className="step-hero-eyebrow">
          <div className="step-hero-eyebrow-dot" />
          Pro Dashboard · Language Systems
        </div>
        <h1 className="step-hero-title">STEP System</h1>
        <p className="step-hero-sub">
          Manage the full STEP test system — skills, questions, and AI-powered
          content generation.
        </p>
      </div>

      {/* ── Available Skills ── */}
      <div className="step-card">
        <div className="step-section-title">Available Skills</div>
        <div className="step-skill-grid">
          {skillCards.map((skill) => {
            const Icon = skill.icon;
            return (
              <div key={skill.label} className="step-skill-chip">
                <div className={`step-skill-icon-wrap ${skill.bgClass}`}>
                  <Icon size={18} className={skill.iconClass} />
                </div>
                <span className="step-skill-label">{skill.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Navigation Cards ── */}
      <div className="step-nav-grid">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Link key={section.id} to={section.link} className="step-nav-card">
              {/* Banner */}
              <div
                className="step-nav-banner"
                style={{ background: section.gradient }}
              >
                <div className="step-nav-banner-left">
                  <div className="step-nav-banner-icon">
                    <Icon size={24} color="#fff" />
                  </div>
                  <div>
                    <div className="step-nav-banner-title">
                      {section.name}
                      {section.badge && (
                        <span className="step-nav-badge">{section.badge}</span>
                      )}
                    </div>
                    <p className="step-nav-banner-desc">
                      {section.description}
                    </p>
                  </div>
                </div>
                <ArrowLeft size={20} className="step-nav-arrow" />
              </div>

              {/* Footer */}
              <div className="step-nav-footer">
                <span className="step-nav-footer-hint">Tap to open</span>
                <span
                  className="step-nav-footer-cta"
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
