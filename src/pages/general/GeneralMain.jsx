// src/pages/general/GeneralMain.jsx
import { Link } from "react-router-dom";
import { BookOpen, FolderOpen, Sparkles, ArrowLeft } from "lucide-react";

/* ─── Page-scoped styles (inherits CSS vars from DashboardLayout) ─── */
const PAGE_STYLES = `
  /* ── General page tokens ── */
  :root {
    --gen-card-bg:      rgba(255,255,255,0.58);
    --gen-card-border:  rgba(255,255,255,0.90);
    --gen-card-shadow:  rgba(5,150,105,0.08);
    --gen-card-hover:   rgba(255,255,255,0.80);
    --gen-inner-bg:     rgba(255,255,255,0.45);
    --gen-inner-border: rgba(255,255,255,0.80);
    --gen-badge-bg:     rgba(255,255,255,0.22);
    --gen-footer-text:  #6b7a99;
  }
  .dark {
    --gen-card-bg:      rgba(255,255,255,0.05);
    --gen-card-border:  rgba(255,255,255,0.09);
    --gen-card-shadow:  rgba(0,0,0,0.25);
    --gen-card-hover:   rgba(255,255,255,0.09);
    --gen-inner-bg:     rgba(255,255,255,0.04);
    --gen-inner-border: rgba(255,255,255,0.08);
    --gen-badge-bg:     rgba(255,255,255,0.14);
    --gen-footer-text:  #8896b0;
  }

  /* ── Hero banner ── */
  .gen-hero {
    padding: 32px 28px;
    border-radius: 18px;
    position: relative; overflow: hidden;
    background: linear-gradient(135deg, #047857 0%, #059669 45%, #0d9488 100%);
    box-shadow: 0 8px 32px rgba(5,150,105,0.30), 0 1px 0 rgba(255,255,255,0.20) inset;
    border: 1px solid rgba(255,255,255,0.20);
  }
  .dark .gen-hero {
    background: linear-gradient(135deg, #064e3b 0%, #065f46 45%, #134e4a 100%);
    box-shadow: 0 8px 32px rgba(6,78,59,0.50), 0 1px 0 rgba(255,255,255,0.08) inset;
  }
  .gen-hero::before {
    content: '';
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse 60% 80% at 85% 30%, rgba(255,255,255,0.10), transparent),
      radial-gradient(ellipse 40% 55% at 15% 80%, rgba(13,148,136,0.30), transparent);
    pointer-events: none;
  }
  .gen-hero-floating {
    position: absolute; right: 28px; top: 50%; transform: translateY(-50%);
    display: flex; flex-direction: column; gap: 8px; opacity: 0.22;
    pointer-events: none;
  }
  .gen-hero-dot {
    width: 48px; height: 48px; border-radius: 14px;
    border: 2px solid rgba(255,255,255,0.6);
  }
  .gen-hero-eyebrow {
    font-size: 10px; font-weight: 600; letter-spacing: 0.18em;
    text-transform: uppercase; color: rgba(255,255,255,0.65);
    margin-bottom: 8px; font-family: 'JetBrains Mono', monospace;
    display: flex; align-items: center; gap: 6px;
  }
  .gen-hero-eyebrow-dot {
    width: 5px; height: 5px; border-radius: 50%;
    background: rgba(255,255,255,0.6);
  }
  .gen-hero-title {
    font-size: 28px; font-weight: 700; color: #fff;
    letter-spacing: -0.02em; margin-bottom: 6px;
  }
  .gen-hero-sub {
    font-size: 13.5px; color: rgba(255,255,255,0.72); font-weight: 400;
    max-width: 480px;
  }

  /* ── Nav cards grid ── */
  .gen-nav-grid {
    display: grid; grid-template-columns: 1fr; gap: 18px;
  }
  @media (min-width: 1024px) {
    .gen-nav-grid { grid-template-columns: 1fr 1fr; }
  }

  .gen-nav-card {
    display: block; text-decoration: none;
    background: var(--gen-card-bg);
    border: 1px solid var(--gen-card-border);
    border-radius: 18px;
    backdrop-filter: blur(20px) saturate(160%);
    -webkit-backdrop-filter: blur(20px) saturate(160%);
    box-shadow: 0 4px 24px var(--gen-card-shadow),
                0 1px 0 rgba(255,255,255,0.55) inset;
    overflow: hidden;
    transition: all 0.30s cubic-bezier(0.34,1.20,0.64,1);
  }
  .gen-nav-card:hover {
    transform: translateY(-4px) scale(1.012);
    box-shadow: 0 14px 40px var(--gen-card-shadow),
                0 1px 0 rgba(255,255,255,0.55) inset;
    border-color: var(--gen-card-hover);
  }

  .gen-nav-banner {
    padding: 22px 24px;
    display: flex; align-items: center; justify-content: space-between;
    position: relative; overflow: hidden;
  }
  .gen-nav-banner::before {
    content: '';
    position: absolute; inset: 0;
    background: radial-gradient(ellipse 55% 70% at 90% 20%, rgba(255,255,255,0.14), transparent);
    pointer-events: none;
  }
  .gen-nav-banner-left { display: flex; align-items: center; gap: 16px; }
  .gen-nav-banner-icon {
    width: 52px; height: 52px; border-radius: 15px;
    background: rgba(255,255,255,0.20);
    border: 1px solid rgba(255,255,255,0.30);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 2px 10px rgba(0,0,0,0.10);
  }
  .gen-nav-banner-title {
    font-size: 18px; font-weight: 700; color: #fff;
    letter-spacing: -0.01em; margin-bottom: 4px;
    display: flex; align-items: center; gap: 8px;
  }
  .gen-nav-banner-desc {
    font-size: 12.5px; color: rgba(255,255,255,0.72); font-weight: 400;
    max-width: 300px; line-height: 1.5;
  }
  .gen-nav-badge {
    font-size: 10px; font-weight: 600; letter-spacing: 0.04em;
    background: var(--gen-badge-bg);
    border: 1px solid rgba(255,255,255,0.30);
    color: #fff; padding: 2px 9px; border-radius: 99px;
  }
  .gen-nav-arrow {
    color: rgba(255,255,255,0.75); flex-shrink: 0;
    transition: transform 0.25s ease;
  }
  .gen-nav-card:hover .gen-nav-arrow {
    transform: translateX(-6px);
  }
  .gen-nav-footer {
    padding: 13px 24px;
    display: flex; align-items: center; justify-content: space-between;
    background: var(--gen-inner-bg);
    border-top: 1px solid var(--gen-inner-border);
    transition: background 0.4s ease, border-color 0.4s ease;
  }
  .gen-nav-footer-hint {
    font-size: 12px; color: var(--gen-footer-text);
    transition: color 0.4s ease;
  }
  .gen-nav-footer-cta {
    font-size: 12px; font-weight: 600;
    transition: color 0.3s ease;
  }

  /* Section title divider */
  .gen-section-title {
    font-size: 12px; font-weight: 600; letter-spacing: 0.13em;
    text-transform: uppercase; color: var(--text-secondary);
    margin-bottom: 14px; display: flex; align-items: center; gap: 8px;
    font-family: 'JetBrains Mono', monospace;
    transition: color 0.4s ease;
  }
  .gen-section-title::after {
    content: ''; flex: 1; height: 1px;
    background: linear-gradient(90deg, var(--gen-card-border), transparent);
  }
`;

function injectStyles() {
  const id = "gen-page-styles";
  if (!document.getElementById(id)) {
    const tag = document.createElement("style");
    tag.id = id;
    tag.textContent = PAGE_STYLES;
    document.head.appendChild(tag);
  }
}

export default function GeneralMain() {
  injectStyles();

  const cards = [
    {
      id: "categories",
      title: "Categories",
      description: "Manage General English categories and add new content",
      icon: FolderOpen,
      gradient:
        "linear-gradient(135deg, #047857 0%, #059669 55%, #0d9488 100%)",
      accentColor: "#6ee7b7",
      link: "/dashboard/general/categories",
    },
    {
      id: "ai",
      title: "AI Generation",
      description:
        "Upload books and media, and generate questions automatically using AI",
      icon: Sparkles,
      gradient:
        "linear-gradient(135deg, #7c3aed 0%, #8b5cf6 55%, #4f46e5 100%)",
      accentColor: "#c4b5fd",
      link: "/dashboard/general/ai",
      badge: "New ✨",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* ── Hero Banner ── */}
      <div className="gen-hero">
        <div className="gen-hero-floating">
          <div className="gen-hero-dot" />
          <div
            className="gen-hero-dot"
            style={{ width: 36, height: 36, borderRadius: 10 }}
          />
          <div
            className="gen-hero-dot"
            style={{ width: 28, height: 28, borderRadius: 8 }}
          />
        </div>
        <div className="gen-hero-eyebrow">
          <div className="gen-hero-eyebrow-dot" />
          Pro Dashboard · Language Systems
        </div>
        <h1 className="gen-hero-title">General English</h1>
        <p className="gen-hero-sub">
          Manage dynamic General English content — categories and AI-powered
          question generation.
        </p>
      </div>

      {/* ── Section label ── */}
      <div style={{ paddingBottom: 2 }}>
        <div className="gen-section-title">Quick Access</div>
      </div>

      {/* ── Navigation Cards ── */}
      <div className="gen-nav-grid">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.id} to={card.link} className="gen-nav-card">
              {/* Banner */}
              <div
                className="gen-nav-banner"
                style={{ background: card.gradient }}
              >
                <div className="gen-nav-banner-left">
                  <div className="gen-nav-banner-icon">
                    <Icon size={24} color="#fff" />
                  </div>
                  <div>
                    <div className="gen-nav-banner-title">
                      {card.title}
                      {card.badge && (
                        <span className="gen-nav-badge">{card.badge}</span>
                      )}
                    </div>
                    <p className="gen-nav-banner-desc">{card.description}</p>
                  </div>
                </div>
                <ArrowLeft size={20} className="gen-nav-arrow" />
              </div>

              {/* Footer */}
              <div className="gen-nav-footer">
                <span className="gen-nav-footer-hint">Tap to open</span>
                <span
                  className="gen-nav-footer-cta"
                  style={{ color: card.accentColor }}
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
