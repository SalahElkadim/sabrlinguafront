// src/pages/esp/EspMain.jsx
import { Link } from "react-router-dom";
import { BookOpen, FolderOpen, Sparkles, ArrowLeft } from "lucide-react";

/* ─── Page-scoped styles (inherits CSS vars from DashboardLayout) ─── */
const PAGE_STYLES = `
  /* ── ESP page tokens ── */
  :root {
    --esp-card-bg:      rgba(255,255,255,0.58);
    --esp-card-border:  rgba(255,255,255,0.90);
    --esp-card-shadow:  rgba(234,88,12,0.08);
    --esp-card-hover:   rgba(255,255,255,0.80);
    --esp-inner-bg:     rgba(255,255,255,0.45);
    --esp-inner-border: rgba(255,255,255,0.80);
    --esp-badge-bg:     rgba(255,255,255,0.22);
    --esp-footer-text:  #6b7a99;
  }
  .dark {
    --esp-card-bg:      rgba(255,255,255,0.05);
    --esp-card-border:  rgba(255,255,255,0.09);
    --esp-card-shadow:  rgba(0,0,0,0.25);
    --esp-card-hover:   rgba(255,255,255,0.09);
    --esp-inner-bg:     rgba(255,255,255,0.04);
    --esp-inner-border: rgba(255,255,255,0.08);
    --esp-badge-bg:     rgba(255,255,255,0.14);
    --esp-footer-text:  #8896b0;
  }

  /* ── Hero banner ── */
  .esp-hero {
    padding: 32px 28px;
    border-radius: 18px;
    position: relative; overflow: hidden;
    background: linear-gradient(135deg, #c2410c 0%, #ea580c 45%, #d97706 100%);
    box-shadow: 0 8px 32px rgba(234,88,12,0.30), 0 1px 0 rgba(255,255,255,0.20) inset;
    border: 1px solid rgba(255,255,255,0.20);
  }
  .dark .esp-hero {
    background: linear-gradient(135deg, #7c2d12 0%, #9a3412 45%, #92400e 100%);
    box-shadow: 0 8px 32px rgba(124,45,18,0.50), 0 1px 0 rgba(255,255,255,0.08) inset;
  }
  .esp-hero::before {
    content: '';
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse 60% 80% at 85% 30%, rgba(255,255,255,0.10), transparent),
      radial-gradient(ellipse 40% 55% at 15% 80%, rgba(217,119,6,0.30), transparent);
    pointer-events: none;
  }
  .esp-hero-floating {
    position: absolute; right: 28px; top: 50%; transform: translateY(-50%);
    display: flex; flex-direction: column; gap: 8px; opacity: 0.22;
    pointer-events: none;
  }
  .esp-hero-dot {
    width: 48px; height: 48px; border-radius: 14px;
    border: 2px solid rgba(255,255,255,0.6);
  }
  .esp-hero-eyebrow {
    font-size: 10px; font-weight: 600; letter-spacing: 0.18em;
    text-transform: uppercase; color: rgba(255,255,255,0.65);
    margin-bottom: 8px; font-family: 'JetBrains Mono', monospace;
    display: flex; align-items: center; gap: 6px;
  }
  .esp-hero-eyebrow-dot {
    width: 5px; height: 5px; border-radius: 50%;
    background: rgba(255,255,255,0.6);
  }
  .esp-hero-title {
    font-size: 28px; font-weight: 700; color: #fff;
    letter-spacing: -0.02em; margin-bottom: 6px;
  }
  .esp-hero-sub {
    font-size: 13.5px; color: rgba(255,255,255,0.72); font-weight: 400;
    max-width: 480px;
  }

  /* ── Nav cards grid ── */
  .esp-nav-grid {
    display: grid; grid-template-columns: 1fr; gap: 18px;
  }
  @media (min-width: 1024px) {
    .esp-nav-grid { grid-template-columns: 1fr 1fr; }
  }

  .esp-nav-card {
    display: block; text-decoration: none;
    background: var(--esp-card-bg);
    border: 1px solid var(--esp-card-border);
    border-radius: 18px;
    backdrop-filter: blur(20px) saturate(160%);
    -webkit-backdrop-filter: blur(20px) saturate(160%);
    box-shadow: 0 4px 24px var(--esp-card-shadow),
                0 1px 0 rgba(255,255,255,0.55) inset;
    overflow: hidden;
    transition: all 0.30s cubic-bezier(0.34,1.20,0.64,1);
  }
  .esp-nav-card:hover {
    transform: translateY(-4px) scale(1.012);
    box-shadow: 0 14px 40px var(--esp-card-shadow),
                0 1px 0 rgba(255,255,255,0.55) inset;
    border-color: var(--esp-card-hover);
  }

  .esp-nav-banner {
    padding: 22px 24px;
    display: flex; align-items: center; justify-content: space-between;
    position: relative; overflow: hidden;
  }
  .esp-nav-banner::before {
    content: '';
    position: absolute; inset: 0;
    background: radial-gradient(ellipse 55% 70% at 90% 20%, rgba(255,255,255,0.14), transparent);
    pointer-events: none;
  }
  .esp-nav-banner-left { display: flex; align-items: center; gap: 16px; }
  .esp-nav-banner-icon {
    width: 52px; height: 52px; border-radius: 15px;
    background: rgba(255,255,255,0.20);
    border: 1px solid rgba(255,255,255,0.30);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 2px 10px rgba(0,0,0,0.10);
  }
  .esp-nav-banner-title {
    font-size: 18px; font-weight: 700; color: #fff;
    letter-spacing: -0.01em; margin-bottom: 4px;
    display: flex; align-items: center; gap: 8px;
  }
  .esp-nav-banner-desc {
    font-size: 12.5px; color: rgba(255,255,255,0.72); font-weight: 400;
    max-width: 300px; line-height: 1.5;
  }
  .esp-nav-badge {
    font-size: 10px; font-weight: 600; letter-spacing: 0.04em;
    background: var(--esp-badge-bg);
    border: 1px solid rgba(255,255,255,0.30);
    color: #fff; padding: 2px 9px; border-radius: 99px;
  }
  .esp-nav-arrow {
    color: rgba(255,255,255,0.75); flex-shrink: 0;
    transition: transform 0.25s ease;
  }
  .esp-nav-card:hover .esp-nav-arrow {
    transform: translateX(-6px);
  }
  .esp-nav-footer {
    padding: 13px 24px;
    display: flex; align-items: center; justify-content: space-between;
    background: var(--esp-inner-bg);
    border-top: 1px solid var(--esp-inner-border);
    transition: background 0.4s ease, border-color 0.4s ease;
  }
  .esp-nav-footer-hint {
    font-size: 12px; color: var(--esp-footer-text);
    transition: color 0.4s ease;
  }
  .esp-nav-footer-cta {
    font-size: 12px; font-weight: 600;
    transition: color 0.3s ease;
  }

  /* Section title divider */
  .esp-section-title {
    font-size: 12px; font-weight: 600; letter-spacing: 0.13em;
    text-transform: uppercase; color: var(--text-secondary);
    margin-bottom: 14px; display: flex; align-items: center; gap: 8px;
    font-family: 'JetBrains Mono', monospace;
    transition: color 0.4s ease;
  }
  .esp-section-title::after {
    content: ''; flex: 1; height: 1px;
    background: linear-gradient(90deg, var(--esp-card-border), transparent);
  }
`;

function injectStyles() {
  const id = "esp-page-styles";
  if (!document.getElementById(id)) {
    const tag = document.createElement("style");
    tag.id = id;
    tag.textContent = PAGE_STYLES;
    document.head.appendChild(tag);
  }
}

export default function EspMain() {
  injectStyles();

  const cards = [
    {
      id: "categories",
      title: "Categories",
      description: "Manage ESP English categories and add new content",
      icon: FolderOpen,
      gradient:
        "linear-gradient(135deg, #c2410c 0%, #ea580c 55%, #d97706 100%)",
      accentColor: "#fcd34d",
      link: "/dashboard/esp/categories",
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
      link: "/dashboard/esp/ai",
      badge: "New ✨",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* ── Hero Banner ── */}
      <div className="esp-hero">
        <div className="esp-hero-floating">
          <div className="esp-hero-dot" />
          <div
            className="esp-hero-dot"
            style={{ width: 36, height: 36, borderRadius: 10 }}
          />
          <div
            className="esp-hero-dot"
            style={{ width: 28, height: 28, borderRadius: 8 }}
          />
        </div>
        <div className="esp-hero-eyebrow">
          <div className="esp-hero-eyebrow-dot" />
          Pro Dashboard · Language Systems
        </div>
        <h1 className="esp-hero-title">ESP English</h1>
        <p className="esp-hero-sub">
          Manage dynamic ESP English content — categories and AI-powered
          question generation.
        </p>
      </div>

      {/* ── Section label ── */}
      <div style={{ paddingBottom: 2 }}>
        <div className="esp-section-title">Quick Access</div>
      </div>

      {/* ── Navigation Cards ── */}
      <div className="esp-nav-grid">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.id} to={card.link} className="esp-nav-card">
              {/* Banner */}
              <div
                className="esp-nav-banner"
                style={{ background: card.gradient }}
              >
                <div className="esp-nav-banner-left">
                  <div className="esp-nav-banner-icon">
                    <Icon size={24} color="#fff" />
                  </div>
                  <div>
                    <div className="esp-nav-banner-title">
                      {card.title}
                      {card.badge && (
                        <span className="esp-nav-badge">{card.badge}</span>
                      )}
                    </div>
                    <p className="esp-nav-banner-desc">{card.description}</p>
                  </div>
                </div>
                <ArrowLeft size={20} className="esp-nav-arrow" />
              </div>

              {/* Footer */}
              <div className="esp-nav-footer">
                <span className="esp-nav-footer-hint">Tap to open</span>
                <span
                  className="esp-nav-footer-cta"
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
