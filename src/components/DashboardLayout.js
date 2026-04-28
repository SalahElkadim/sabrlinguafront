// src/components/DashboardLayout.jsx
import { useState, useEffect } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Database,
  LogOut,
  Menu,
  X,
  User,
  ChevronDown,
  Globe,
  BookMarked,
  Users,
  BookOpen,
  LayoutGrid,
  CreditCard,
  Sparkles,
} from "lucide-react";
import { useAuthStore } from "../store/authstore";

/* ─── Glassmorphism styles injected once ─────────────────────────────────── */
const GLASS_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

  :root {
    --glass-bg:        rgba(255,255,255,0.06);
    --glass-border:    rgba(255,255,255,0.12);
    --glass-hover:     rgba(255,255,255,0.11);
    --glass-active:    rgba(255,255,255,0.18);
    --accent:          #6ee7f7;
    --accent-2:        #a78bfa;
    --accent-glow:     rgba(110,231,247,0.25);
    --text-primary:    rgba(255,255,255,0.95);
    --text-secondary:  rgba(255,255,255,0.55);
    --danger:          #f87171;
    --danger-bg:       rgba(248,113,113,0.12);
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Sora', sans-serif;
    background: #0a0e1a;
  }

  /* ── Animated mesh background ── */
  .dash-root {
    min-height: 100vh;
    position: relative;
    background:
      radial-gradient(ellipse 80% 60% at 20% 10%,  rgba(110,231,247,0.12) 0%, transparent 60%),
      radial-gradient(ellipse 60% 50% at 80% 80%,  rgba(167,139,250,0.14) 0%, transparent 60%),
      radial-gradient(ellipse 50% 40% at 60% 30%,  rgba(52,211,153,0.07)  0%, transparent 55%),
      linear-gradient(135deg, #080c18 0%, #0d1326 50%, #0a0e1a 100%);
    overflow: hidden;
  }

  /* floating orbs */
  .orb {
    position: fixed;
    border-radius: 50%;
    filter: blur(80px);
    pointer-events: none;
    z-index: 0;
    animation: drift 18s ease-in-out infinite alternate;
  }
  .orb-1 { width:380px; height:380px; top:-80px; left:-80px;
            background: radial-gradient(circle, rgba(110,231,247,0.18), transparent 70%);
            animation-duration: 20s; }
  .orb-2 { width:300px; height:300px; bottom:5%; right:5%;
            background: radial-gradient(circle, rgba(167,139,250,0.2), transparent 70%);
            animation-duration: 15s; animation-delay: -7s; }
  .orb-3 { width:220px; height:220px; top:40%; left:25%;
            background: radial-gradient(circle, rgba(52,211,153,0.12), transparent 70%);
            animation-duration: 25s; animation-delay: -12s; }

  @keyframes drift {
    from { transform: translate(0, 0) scale(1); }
    to   { transform: translate(40px, 30px) scale(1.08); }
  }

  /* ── Sidebar ── */
  .sidebar {
    position: fixed;
    top: 0; right: 0;
    height: 100%;
    width: 260px;
    z-index: 50;
    display: flex;
    flex-direction: column;
    background: rgba(12,17,35,0.55);
    backdrop-filter: blur(24px) saturate(160%);
    -webkit-backdrop-filter: blur(24px) saturate(160%);
    border-left: 1px solid var(--glass-border);
    box-shadow: -4px 0 40px rgba(0,0,0,0.4), inset 1px 0 0 rgba(255,255,255,0.05);
    transform: translateX(100%);
    transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .sidebar.open  { transform: translateX(0); }
  @media (min-width: 1024px) { .sidebar { transform: translateX(0); } }

  /* Logo area */
  .sidebar-logo {
    height: 68px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    border-bottom: 1px solid var(--glass-border);
  }
  .logo-mark {
    display: flex; align-items: center; gap: 10px;
  }
  .logo-icon {
    width: 38px; height: 38px;
    border-radius: 12px;
    background: linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 0 18px var(--accent-glow);
    flex-shrink: 0;
  }
  .logo-text {
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.12em;
    color: var(--text-primary);
    font-family: 'JetBrains Mono', monospace;
  }
  .logo-badge {
    font-size: 9px;
    font-weight: 500;
    color: var(--accent);
    letter-spacing: 0.06em;
    display: flex; align-items: center; gap: 3px;
    margin-top: 1px;
    font-family: 'JetBrains Mono', monospace;
  }

  /* Nav section label */
  .nav-section-label {
    font-size: 9.5px;
    font-weight: 600;
    letter-spacing: 0.14em;
    color: var(--text-secondary);
    padding: 18px 20px 6px;
    text-transform: uppercase;
  }

  /* Nav item */
  .nav-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 14px;
    margin: 2px 10px;
    border-radius: 10px;
    color: var(--text-secondary);
    text-decoration: none;
    font-size: 13.5px;
    font-weight: 400;
    transition: all 0.2s ease;
    position: relative;
    border: 1px solid transparent;
  }
  .nav-item:hover {
    background: var(--glass-hover);
    color: var(--text-primary);
    border-color: var(--glass-border);
  }
  .nav-item.active {
    background: var(--glass-active);
    color: var(--accent);
    font-weight: 600;
    border-color: rgba(110,231,247,0.2);
    box-shadow: 0 0 16px rgba(110,231,247,0.08), inset 0 0 12px rgba(110,231,247,0.04);
  }
  .nav-item.active::before {
    content: '';
    position: absolute;
    left: -10px; top: 50%;
    transform: translateY(-50%);
    width: 3px; height: 20px;
    border-radius: 0 3px 3px 0;
    background: linear-gradient(180deg, var(--accent), var(--accent-2));
    box-shadow: 0 0 8px var(--accent);
  }
  .nav-icon { width: 18px; height: 18px; flex-shrink: 0; }

  /* User section */
  .user-section {
    padding: 14px;
    border-top: 1px solid var(--glass-border);
    position: relative;
  }
  .user-btn {
    width: 100%;
    display: flex; align-items: center; gap: 10px;
    padding: 10px 12px;
    border-radius: 10px;
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: right;
  }
  .user-btn:hover { background: var(--glass-hover); }
  .user-avatar {
    width: 36px; height: 36px;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(110,231,247,0.25), rgba(167,139,250,0.25));
    border: 1px solid rgba(110,231,247,0.3);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .user-name  { font-size: 13px; font-weight: 600; color: var(--text-primary); }
  .user-email { font-size: 10.5px; color: var(--text-secondary); margin-top: 1px; }
  .user-info  { flex: 1; }

  /* Dropdown */
  .user-dropdown {
    position: absolute;
    bottom: calc(100% - 10px);
    left: 14px; right: 14px;
    background: rgba(12,17,35,0.9);
    backdrop-filter: blur(20px);
    border: 1px solid var(--glass-border);
    border-radius: 10px;
    box-shadow: 0 -8px 32px rgba(0,0,0,0.4);
    overflow: hidden;
    animation: slideUp 0.2s ease;
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .logout-btn {
    width: 100%;
    display: flex; align-items: center; gap: 10px;
    padding: 12px 16px;
    background: none;
    border: none;
    color: var(--danger);
    font-size: 13.5px;
    font-family: 'Sora', sans-serif;
    cursor: pointer;
    transition: background 0.2s;
  }
  .logout-btn:hover { background: var(--danger-bg); }

  /* ── Main content ── */
  .main-content { margin-right: 0; position: relative; z-index: 1; }
  @media (min-width: 1024px) { .main-content { margin-right: 260px; } }

  /* Topbar */
  .topbar {
    height: 68px;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 24px;
    position: sticky; top: 0; z-index: 30;
    background: rgba(10,14,26,0.7);
    backdrop-filter: blur(20px) saturate(160%);
    -webkit-backdrop-filter: blur(20px) saturate(160%);
    border-bottom: 1px solid var(--glass-border);
    box-shadow: 0 1px 0 rgba(255,255,255,0.03);
  }
  .topbar-title {
    font-size: 18px;
    font-weight: 700;
    color: var(--text-primary);
    display: flex; align-items: center; gap: 8px;
  }
  .topbar-title-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--accent);
    box-shadow: 0 0 8px var(--accent);
  }

  /* Hamburger */
  .menu-btn {
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    border-radius: 8px;
    padding: 7px;
    color: var(--text-primary);
    cursor: pointer;
    display: flex;
    transition: all 0.2s;
  }
  .menu-btn:hover { background: var(--glass-hover); }

  /* Mobile user chip */
  .mobile-user-chip {
    display: flex; align-items: center; gap: 8px;
    padding: 6px 12px 6px 6px;
    border-radius: 99px;
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
  }
  .mobile-chip-avatar {
    width: 28px; height: 28px;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(110,231,247,0.3), rgba(167,139,250,0.3));
    display: flex; align-items: center; justify-content: center;
  }
  .mobile-chip-name {
    font-size: 12px; font-weight: 600; color: var(--text-primary);
  }

  /* Page content */
  .page-content { padding: 28px 24px; }

  /* Overlay */
  .sidebar-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.6);
    backdrop-filter: blur(2px);
    z-index: 40;
  }

  /* Scrollbar */
  .sidebar-nav::-webkit-scrollbar { width: 3px; }
  .sidebar-nav::-webkit-scrollbar-track { background: transparent; }
  .sidebar-nav::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,0.12);
    border-radius: 99px;
  }

  /* Chevron */
  .chevron { transition: transform 0.25s ease; }
  .chevron.up { transform: rotate(180deg); }
`;

/* ─── Navigation config ──────────────────────────────────────────────────── */
const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    section: "Overview",
  },
  {
    name: "IELTS System",
    href: "/dashboard/ielts",
    icon: Globe,
    section: "Systems",
  },
  {
    name: "STEP System",
    href: "/dashboard/step",
    icon: BookMarked,
    section: "Systems",
  },
  {
    name: "General English",
    href: "/dashboard/general",
    icon: BookOpen,
    section: "Systems",
  },
  {
    name: "All Tests",
    href: "/dashboard/esp",
    icon: BookOpen,
    section: "Systems",
  },
  {
    name: "Teachers",
    href: "/dashboard/teachers",
    icon: Users,
    section: "Management",
  },
  {
    name: "Programs",
    href: "/dashboard/programs",
    icon: LayoutGrid,
    section: "Management",
  },
  {
    name: "Subscriptions",
    href: "/dashboard/subscriptions",
    icon: CreditCard,
    section: "Management",
  },
];

/* ─── Component ──────────────────────────────────────────────────────────── */
export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // inject styles once
  useEffect(() => {
    const id = "glass-dash-styles";
    if (!document.getElementById(id)) {
      const tag = document.createElement("style");
      tag.id = id;
      tag.textContent = GLASS_STYLES;
      document.head.appendChild(tag);
    }
    return () => {}; // keep styles alive
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const currentPage =
    navigation.find((item) => isActive(item.href))?.name || "Dashboard";

  // Group nav by section
  const sections = [...new Set(navigation.map((n) => n.section))];

  return (
    <div className="dash-root">
      {/* Ambient orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ──────────────────────────────────────────────────── */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="logo-mark">
            <div className="logo-icon">
              <Database size={18} color="#0a0e1a" strokeWidth={2.5} />
            </div>
            <div>
              <div className="logo-text">SABRLINGUA</div>
              <div className="logo-badge">
                <Sparkles size={8} />
                Pro Dashboard
              </div>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="menu-btn"
            style={{ display: "flex" }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Navigation */}
        <nav
          className="sidebar-nav"
          style={{ flex: 1, padding: "8px 0", overflowY: "auto" }}
        >
          {sections.map((section) => (
            <div key={section}>
              <div className="nav-section-label">{section}</div>
              {navigation
                .filter((item) => item.section === section)
                .map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`nav-item ${active ? "active" : ""}`}
                    >
                      <Icon className="nav-icon" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
            </div>
          ))}
        </nav>

        {/* User section */}
        <div className="user-section">
          {userMenuOpen && (
            <div className="user-dropdown">
              <button className="logout-btn" onClick={handleLogout}>
                <LogOut size={15} />
                <span>تسجيل الخروج</span>
              </button>
            </div>
          )}
          <button
            className="user-btn"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
          >
            <div className="user-avatar">
              <User size={15} color="rgba(110,231,247,0.9)" />
            </div>
            <div className="user-info">
              <div className="user-name">{user?.full_name ?? "المستخدم"}</div>
              <div className="user-email">
                {user?.email ?? "admin@sabrlingua.com"}
              </div>
            </div>
            <ChevronDown
              size={14}
              color="rgba(255,255,255,0.45)"
              className={`chevron ${userMenuOpen ? "up" : ""}`}
            />
          </button>
        </div>
      </aside>

      {/* ── Main content ─────────────────────────────────────────────── */}
      <div className="main-content">
        {/* Topbar */}
        <header className="topbar">
          {/* Left: hamburger (mobile) */}
          <button
            className="menu-btn"
            onClick={() => setSidebarOpen(true)}
            style={{ display: "flex" }}
          >
            <Menu size={18} />
          </button>

          {/* Center: page title (desktop) */}
          <div
            className="topbar-title"
            style={{
              display: "none",
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
            }}
            id="topbar-title-desktop"
          >
            <div className="topbar-title-dot" />
            {currentPage}
          </div>

          {/* Desktop title — inline left */}
          <div className="topbar-title" style={{ fontSize: "16px" }}>
            <div className="topbar-title-dot" />
            {currentPage}
          </div>

          {/* Right: mobile user chip */}
          <div className="mobile-user-chip">
            <div className="mobile-chip-avatar">
              <User size={13} color="rgba(110,231,247,0.9)" />
            </div>
            <span className="mobile-chip-name">
              {user?.full_name ?? "مستخدم"}
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
