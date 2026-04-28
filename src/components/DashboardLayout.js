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
  Sun,
  Moon,
} from "lucide-react";
import { useAuthStore } from "../store/authstore";

/* ─── Light + Dark Glassmorphism styles ─────────────────────────────────── */
const GLASS_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap');

  /* ── LIGHT MODE variables ── */
  :root {
    --glass-bg:       rgba(255,255,255,0.52);
    --glass-border:   rgba(255,255,255,0.88);
    --glass-hover:    rgba(255,255,255,0.72);
    --glass-active:   rgba(255,255,255,0.92);
    --accent:         #4f7cff;
    --accent-2:       #8b5cf6;
    --accent-glow:    rgba(79,124,255,0.22);
    --text-primary:   #1a2035;
    --text-secondary: #6b7a99;
    --danger:         #ef4444;
    --danger-bg:      rgba(239,68,68,0.08);
    --bg-base:        #eef2ff;
    --topbar-bg:      rgba(255,255,255,0.50);
    --topbar-border:  rgba(255,255,255,0.85);
    --topbar-shadow:  rgba(79,124,255,0.06);
    --sidebar-bg:     rgba(255,255,255,0.52);
    --sidebar-border: rgba(255,255,255,0.9);
    --overlay-bg:     rgba(100,120,200,0.15);
    --user-btn-bg:    rgba(255,255,255,0.65);
    --user-btn-hover: rgba(255,255,255,0.85);
    --dropdown-bg:    rgba(255,255,255,0.90);
    --menu-btn-bg:    rgba(255,255,255,0.65);
    --menu-btn-hover: rgba(255,255,255,0.9);
    --chip-bg:        rgba(255,255,255,0.65);
    --logo-bar-bg:    rgba(255,255,255,0.25);
    --logo-bar-border:rgba(255,255,255,0.8);
    --user-area-bg:   rgba(255,255,255,0.25);
    --user-area-border:rgba(255,255,255,0.8);
    --nav-active-bg:  rgba(255,255,255,0.88);
    --nav-active-border:rgba(79,124,255,0.15);
    --nav-hover-bg:   rgba(255,255,255,0.70);
    --nav-hover-border:rgba(255,255,255,0.9);
    --scroll-thumb:   rgba(79,124,255,0.2);

    /* orb colors light */
    --orb1: rgba(147,197,253,0.5);
    --orb2: rgba(196,181,253,0.45);
    --orb3: rgba(167,243,208,0.35);
    --orb4: rgba(253,186,116,0.28);
  }

  /* ── DARK MODE variables ── */
  .dark {
    --glass-bg:       rgba(20,25,45,0.70);
    --glass-border:   rgba(255,255,255,0.08);
    --glass-hover:    rgba(255,255,255,0.07);
    --glass-active:   rgba(255,255,255,0.10);
    --accent:         #6e9fff;
    --accent-2:       #a78bfa;
    --accent-glow:    rgba(110,159,255,0.28);
    --text-primary:   #e8eeff;
    --text-secondary: #8896b0;
    --danger:         #f87171;
    --danger-bg:      rgba(248,113,113,0.10);
    --bg-base:        #0d1120;
    --topbar-bg:      rgba(13,17,32,0.75);
    --topbar-border:  rgba(255,255,255,0.07);
    --topbar-shadow:  rgba(0,0,0,0.25);
    --sidebar-bg:     rgba(15,20,38,0.80);
    --sidebar-border: rgba(255,255,255,0.07);
    --overlay-bg:     rgba(0,0,0,0.45);
    --user-btn-bg:    rgba(255,255,255,0.06);
    --user-btn-hover: rgba(255,255,255,0.10);
    --dropdown-bg:    rgba(18,24,44,0.95);
    --menu-btn-bg:    rgba(255,255,255,0.07);
    --menu-btn-hover: rgba(255,255,255,0.12);
    --chip-bg:        rgba(255,255,255,0.07);
    --logo-bar-bg:    rgba(255,255,255,0.04);
    --logo-bar-border:rgba(255,255,255,0.07);
    --user-area-bg:   rgba(255,255,255,0.04);
    --user-area-border:rgba(255,255,255,0.07);
    --nav-active-bg:  rgba(110,159,255,0.14);
    --nav-active-border:rgba(110,159,255,0.25);
    --nav-hover-bg:   rgba(255,255,255,0.06);
    --nav-hover-border:rgba(255,255,255,0.10);
    --scroll-thumb:   rgba(110,159,255,0.25);

    /* orb colors dark */
    --orb1: rgba(30,60,120,0.55);
    --orb2: rgba(80,40,140,0.45);
    --orb3: rgba(20,80,60,0.30);
    --orb4: rgba(100,60,20,0.25);
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Sora', sans-serif; }

  .dash-root {
    min-height: 100vh;
    position: relative;
    overflow: hidden;
    background: var(--bg-base);
    transition: background 0.4s ease;
  }

  /* Light mode gradient background */
  .dash-root:not(.dark-mode) {
    background:
      radial-gradient(ellipse 70% 55% at 15% 0%,  rgba(147,197,253,0.45) 0%, transparent 60%),
      radial-gradient(ellipse 55% 50% at 85% 90%, rgba(196,181,253,0.40) 0%, transparent 60%),
      radial-gradient(ellipse 45% 40% at 70% 20%, rgba(167,243,208,0.25) 0%, transparent 55%),
      radial-gradient(ellipse 60% 50% at 30% 75%, rgba(253,186,116,0.18) 0%, transparent 55%),
      linear-gradient(145deg, #e8eeff 0%, #f0f4ff 40%, #ede9ff 100%);
  }

  /* Dark mode gradient background */
  .dash-root.dark-mode {
    background:
      radial-gradient(ellipse 70% 55% at 15% 0%,  rgba(30,60,120,0.4) 0%, transparent 60%),
      radial-gradient(ellipse 55% 50% at 85% 90%, rgba(80,40,140,0.35) 0%, transparent 60%),
      radial-gradient(ellipse 45% 40% at 70% 20%, rgba(20,80,60,0.20) 0%, transparent 55%),
      radial-gradient(ellipse 60% 50% at 30% 75%, rgba(100,60,20,0.15) 0%, transparent 55%),
      linear-gradient(145deg, #0a0e1a 0%, #0d1120 40%, #100d1f 100%);
  }

  .orb {
    position: fixed; border-radius: 50%;
    filter: blur(70px); pointer-events: none; z-index: 0;
    animation: drift 20s ease-in-out infinite alternate;
    transition: background 0.5s ease;
  }
  .orb-1 { width:420px; height:420px; top:-100px; left:-80px;
            background: radial-gradient(circle, var(--orb1), transparent 70%);
            animation-duration: 22s; }
  .orb-2 { width:350px; height:350px; bottom:0; right:10%;
            background: radial-gradient(circle, var(--orb2), transparent 70%);
            animation-duration: 17s; animation-delay: -8s; }
  .orb-3 { width:250px; height:250px; top:45%; left:30%;
            background: radial-gradient(circle, var(--orb3), transparent 70%);
            animation-duration: 28s; animation-delay: -14s; }
  .orb-4 { width:200px; height:200px; top:20%; right:30%;
            background: radial-gradient(circle, var(--orb4), transparent 70%);
            animation-duration: 19s; animation-delay: -5s; }

  @keyframes drift {
    from { transform: translate(0,0) scale(1); }
    to   { transform: translate(30px,25px) scale(1.07); }
  }

  /* ── Sidebar ── */
  .sidebar {
    position: fixed; top:0; right:0;
    height: 100%; width: 262px;
    z-index: 50;
    display: flex; flex-direction: column;
    background: var(--sidebar-bg);
    backdrop-filter: blur(28px) saturate(180%);
    -webkit-backdrop-filter: blur(28px) saturate(180%);
    border-left: 1px solid var(--sidebar-border);
    box-shadow:
      -2px 0 0 rgba(255,255,255,0.06) inset,
      -6px 0 40px rgba(79,124,255,0.08),
      0 0 80px rgba(147,197,253,0.08);
    transform: translateX(100%);
    transition: transform 0.35s cubic-bezier(0.4,0,0.2,1),
                background 0.4s ease, border-color 0.4s ease;
  }
  .sidebar.open { transform: translateX(0); }
  @media (min-width: 1024px) { .sidebar { transform: translateX(0); } }

  .sidebar-logo {
    height: 70px;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 20px;
    border-bottom: 1px solid var(--logo-bar-border);
    background: var(--logo-bar-bg);
    transition: background 0.4s ease, border-color 0.4s ease;
  }
  .logo-mark { display: flex; align-items: center; gap: 11px; }
  .logo-icon {
    width: 40px; height: 40px; border-radius: 13px;
    background: linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 18px var(--accent-glow), 0 1px 0 rgba(255,255,255,0.4) inset;
    transition: background 0.4s ease, box-shadow 0.4s ease;
  }
  .logo-text {
    font-size: 13px; font-weight: 700; letter-spacing: 0.11em;
    color: var(--text-primary); font-family: 'JetBrains Mono', monospace;
    transition: color 0.4s ease;
  }
  .logo-badge {
    font-size: 9.5px; font-weight: 500; color: var(--accent);
    letter-spacing: 0.06em; display: flex; align-items: center; gap: 3px;
    margin-top: 2px; font-family: 'JetBrains Mono', monospace; opacity: 0.85;
    transition: color 0.4s ease;
  }

  .nav-section-label {
    font-size: 9.5px; font-weight: 600; letter-spacing: 0.14em;
    color: var(--text-secondary); padding: 18px 22px 6px;
    text-transform: uppercase; opacity: 0.7;
    transition: color 0.4s ease;
  }

  .nav-item {
    display: flex; align-items: center; gap: 11px;
    padding: 10px 14px; margin: 2px 10px;
    border-radius: 11px; color: var(--text-secondary);
    text-decoration: none; font-size: 13.5px; font-weight: 400;
    transition: all 0.2s ease; position: relative;
    border: 1px solid transparent;
  }
  .nav-item:hover {
    background: var(--nav-hover-bg); color: var(--text-primary);
    border-color: var(--nav-hover-border);
    box-shadow: 0 2px 12px rgba(79,124,255,0.07);
  }
  .nav-item.active {
    background: var(--nav-active-bg); color: var(--accent);
    font-weight: 600; border-color: var(--nav-active-border);
    box-shadow: 0 2px 16px rgba(79,124,255,0.12), 0 1px 0 rgba(255,255,255,0.06) inset;
  }
  .nav-item.active::before {
    content: '';
    position: absolute; right: -10px; top: 50%;
    transform: translateY(-50%);
    width: 3px; height: 22px; border-radius: 3px 0 0 3px;
    background: linear-gradient(180deg, var(--accent), var(--accent-2));
    box-shadow: 0 0 8px var(--accent-glow);
  }
  .nav-icon { width:17px; height:17px; flex-shrink:0; }
  .nav-item.active .nav-icon { color: var(--accent); }

  .user-section {
    padding: 12px; position: relative;
    border-top: 1px solid var(--user-area-border);
    background: var(--user-area-bg);
    transition: background 0.4s ease, border-color 0.4s ease;
  }
  .user-btn {
    width: 100%; display: flex; align-items: center; gap: 10px;
    padding: 10px 13px; border-radius: 12px;
    background: var(--user-btn-bg);
    border: 1px solid var(--glass-border);
    box-shadow: 0 2px 10px rgba(79,124,255,0.06);
    cursor: pointer; transition: all 0.2s ease; text-align: right;
  }
  .user-btn:hover { background: var(--user-btn-hover); box-shadow: 0 4px 16px rgba(79,124,255,0.10); }
  .user-avatar {
    width: 36px; height: 36px; border-radius: 50%;
    background: linear-gradient(135deg, rgba(79,124,255,0.15), rgba(139,92,246,0.15));
    border: 1.5px solid rgba(79,124,255,0.2);
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .user-name  { font-size: 13px; font-weight: 600; color: var(--text-primary); transition: color 0.4s ease; }
  .user-email { font-size: 10.5px; color: var(--text-secondary); margin-top: 1px; transition: color 0.4s ease; }
  .user-info  { flex: 1; }

  .user-dropdown {
    position: absolute; bottom: calc(100% - 8px); left: 12px; right: 12px;
    background: var(--dropdown-bg);
    backdrop-filter: blur(20px);
    border: 1px solid var(--glass-border);
    border-radius: 12px;
    box-shadow: 0 -8px 32px rgba(79,124,255,0.12), 0 2px 0 rgba(255,255,255,0.04) inset;
    overflow: hidden;
    animation: slideUp 0.2s ease;
    transition: background 0.4s ease;
  }
  @keyframes slideUp {
    from { opacity:0; transform:translateY(8px); }
    to   { opacity:1; transform:translateY(0); }
  }
  .logout-btn {
    width:100%; display:flex; align-items:center; gap:10px;
    padding:12px 16px; background:none; border:none;
    color:var(--danger); font-size:13.5px;
    font-family:'Sora',sans-serif; cursor:pointer; transition:background 0.2s;
  }
  .logout-btn:hover { background:var(--danger-bg); }

  .main-content { margin-right:0; position:relative; z-index:1; }
  @media (min-width:1024px) { .main-content { margin-right:262px; } }

  .topbar {
    height:70px; display:flex; align-items:center; justify-content:space-between;
    padding:0 26px; position:sticky; top:0; z-index:30;
    background: var(--topbar-bg);
    backdrop-filter: blur(24px) saturate(180%);
    -webkit-backdrop-filter: blur(24px) saturate(180%);
    border-bottom: 1px solid var(--topbar-border);
    box-shadow: 0 2px 20px var(--topbar-shadow), 0 1px 0 rgba(255,255,255,0.04) inset;
    transition: background 0.4s ease, border-color 0.4s ease;
  }
  .topbar-title {
    font-size:16px; font-weight:700; color:var(--text-primary);
    display:flex; align-items:center; gap:9px;
    transition: color 0.4s ease;
  }
  .topbar-dot {
    width:7px; height:7px; border-radius:50%; flex-shrink:0;
    background: linear-gradient(135deg, var(--accent), var(--accent-2));
    box-shadow: 0 0 8px var(--accent-glow);
  }

  .menu-btn {
    background: var(--menu-btn-bg);
    border: 1px solid var(--glass-border);
    border-radius:10px; padding:8px;
    color:var(--text-primary); cursor:pointer; display:flex;
    box-shadow: 0 2px 8px rgba(79,124,255,0.07); transition:all 0.2s;
  }
  .menu-btn:hover { background:var(--menu-btn-hover); box-shadow:0 4px 14px rgba(79,124,255,0.12); }

  /* ── Hide hamburger on desktop ── */
  .hamburger-btn {
    display: flex;
  }
  @media (min-width: 1024px) {
    .hamburger-btn {
      display: none !important;
    }
  }

  /* ── Dark mode toggle button ── */
  .theme-toggle-btn {
    background: var(--menu-btn-bg);
    border: 1px solid var(--glass-border);
    border-radius: 10px; padding: 8px;
    color: var(--text-primary); cursor: pointer; display: flex;
    box-shadow: 0 2px 8px rgba(79,124,255,0.07);
    transition: all 0.2s ease;
    position: relative; overflow: hidden;
  }
  .theme-toggle-btn:hover {
    background: var(--menu-btn-hover);
    box-shadow: 0 4px 14px rgba(79,124,255,0.12);
    transform: scale(1.05);
  }
  .theme-toggle-btn svg {
    transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease;
  }
  .theme-toggle-btn:active svg {
    transform: rotate(20deg) scale(0.9);
  }

  .mobile-user-chip {
    display:flex; align-items:center; gap:8px;
    padding:6px 13px 6px 6px; border-radius:99px;
    background: var(--chip-bg);
    border:1px solid var(--glass-border);
    box-shadow:0 2px 8px rgba(79,124,255,0.07);
    transition: background 0.4s ease;
  }
  .mobile-chip-avatar {
    width:28px; height:28px; border-radius:50%;
    background:linear-gradient(135deg,rgba(79,124,255,0.15),rgba(139,92,246,0.15));
    border:1.5px solid rgba(79,124,255,0.2);
    display:flex; align-items:center; justify-content:center;
  }
  .mobile-chip-name { font-size:12px; font-weight:600; color:var(--text-primary); transition: color 0.4s ease; }

  .page-content { padding:28px 24px; }

  .sidebar-overlay {
    position:fixed; inset:0;
    background: var(--overlay-bg);
    backdrop-filter:blur(4px); z-index:40;
    transition: background 0.4s ease;
  }

  .sidebar-nav::-webkit-scrollbar { width:3px; }
  .sidebar-nav::-webkit-scrollbar-track { background:transparent; }
  .sidebar-nav::-webkit-scrollbar-thumb { background: var(--scroll-thumb); border-radius:99px; }

  .chevron { transition:transform 0.25s ease; }
  .chevron.up { transform:rotate(180deg); }

  /* ── Topbar right section ── */
  .topbar-right {
    display: flex; align-items: center; gap: 10px;
  }
`;

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

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // ── Dark mode state – persisted in localStorage ──
  const [darkMode, setDarkMode] = useState(() => {
    try {
      return localStorage.getItem("sabrlingua-theme") === "dark";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const id = "glass-light-styles";
    if (!document.getElementById(id)) {
      const tag = document.createElement("style");
      tag.id = id;
      tag.textContent = GLASS_STYLES;
      document.head.appendChild(tag);
    }
  }, []);

  // Apply / remove dark class on <html> for external pages too
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    try {
      localStorage.setItem("sabrlingua-theme", darkMode ? "dark" : "light");
    } catch {
      // ignore
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };
  const isActive = (path) => location.pathname === path;
  const currentPage =
    navigation.find((item) => isActive(item.href))?.name || "Dashboard";
  const sections = [...new Set(navigation.map((n) => n.section))];

  return (
    <div className={`dash-root${darkMode ? " dark dark-mode" : ""}`}>
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      <div className="orb orb-4" />

      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-logo">
          <div className="logo-mark">
            <div className="logo-icon">
              <Database size={18} color="#fff" strokeWidth={2.5} />
            </div>
            <div>
              <div className="logo-text">SABRLINGUA</div>
              <div className="logo-badge">
                <Sparkles size={8} />
                Pro Dashboard
              </div>
            </div>
          </div>
          <button className="menu-btn" onClick={() => setSidebarOpen(false)}>
            <X size={16} />
          </button>
        </div>

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
              <User size={15} color="#4f7cff" />
            </div>
            <div className="user-info">
              <div className="user-name">{user?.full_name ?? "المستخدم"}</div>
              <div className="user-email">
                {user?.email ?? "admin@sabrlingua.com"}
              </div>
            </div>
            <ChevronDown
              size={14}
              color="#6b7a99"
              className={`chevron ${userMenuOpen ? "up" : ""}`}
            />
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="main-content">
        <header className="topbar">
          {/* Hamburger – hidden on desktop via CSS */}
          <button
            className="menu-btn hamburger-btn"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={18} />
          </button>

          <div className="topbar-title">
            <div className="topbar-dot" />
            {currentPage}
          </div>

          {/* Right side: theme toggle + user chip */}
          <div className="topbar-right">
            {/* ── Dark / Light toggle ── */}
            <button
              className="theme-toggle-btn"
              onClick={toggleDarkMode}
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun size={17} style={{ color: "#fbbf24" }} />
              ) : (
                <Moon size={17} style={{ color: "#6b7a99" }} />
              )}
            </button>

            <div className="mobile-user-chip">
              <div className="mobile-chip-avatar">
                <User size={13} color="#4f7cff" />
              </div>
              <span className="mobile-chip-name">
                {user?.full_name ?? "مستخدم"}
              </span>
            </div>
          </div>
        </header>

        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
