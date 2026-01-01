import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  FileText,
  Headphones,
  Video,
  PenTool,
  List,
  LogOut,
  Menu,
  X,
} from "lucide-react";

// Import all dashboard components
import PlacementTestsDashboard from "./PlacementTestsDashboard";
import MCQQuestionsDashboard from "./MCQQuestionsDashboard";
import ReadingPassagesDashboard from "./ReadingPassagesDashboard";
import ListeningQuestionsDashboard from "./ListeningQuestionsDashboard";
import SpeakingQuestionsDashboard from "./SpeakingQuestionsDashboard";
import WritingQuestionsDashboard from "./WritingQuestionsDashboard";

export default function MainDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("tests");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("token");
    localStorage.removeItem("user_data");
    navigate("/login", { replace: true });
  };

  const menuItems = [
    {
      id: "tests",
      name: "إدارة الامتحانات",
      icon: List,
    },
    {
      id: "mcq",
      name: "أسئلة الاختيار من متعدد",
      icon: FileText,
    },
    {
      id: "reading",
      name: "قطع القراءة",
      icon: BookOpen,
    },
    {
      id: "listening",
      name: "أسئلة الاستماع",
      icon: Headphones,
    },
    {
      id: "speaking",
      name: "فيديوهات التحدث",
      icon: Video,
    },
    {
      id: "writing",
      name: "أسئلة الكتابة",
      icon: PenTool,
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "tests":
        return <PlacementTestsDashboard />;
      case "mcq":
        return <MCQQuestionsDashboard />;
      case "reading":
        return <ReadingPassagesDashboard />;
      case "listening":
        return <ListeningQuestionsDashboard />;
      case "speaking":
        return <SpeakingQuestionsDashboard />;
      case "writing":
        return <WritingQuestionsDashboard />;
      default:
        return <PlacementTestsDashboard />;
    }
  };

  const activeMenuItem = menuItems.find((item) => item.id === activeTab);

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      {/* Top Navigation Bar */}
      <nav className="bg-black border-b-2 border-yellow-primary sticky top-0 z-30">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded hover:bg-gray-dark hover:bg-opacity-20 transition-colors lg:hidden text-white"
              >
                {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

              <div>
                <h1 className="text-2xl font-bold text-yellow-primary">
                  نظام إدارة الامتحانات
                </h1>
                <p className="text-sm text-gray-light">
                  {activeMenuItem?.name}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-yellow-primary text-black px-5 py-2 rounded font-bold hover:bg-yellow-hover transition-all shadow-md hover:shadow-lg"
            >
              <LogOut size={20} />
              <span className="hidden sm:inline">تسجيل الخروج</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            isSidebarOpen ? "translate-x-0" : "translate-x-full"
          } fixed lg:sticky top-[73px] right-0 h-[calc(100vh-73px)] w-80 bg-black border-l-2 border-yellow-primary shadow-lg transition-transform duration-300 ease-in-out z-20 lg:translate-x-0 overflow-y-auto`}
        >
          <div className="p-6 space-y-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    // Close sidebar on mobile after selection
                    if (window.innerWidth < 1024) {
                      setIsSidebarOpen(false);
                    }
                  }}
                  className={`w-full flex items-center gap-4 p-4 rounded transition-all ${
                    isActive
                      ? "bg-yellow-primary text-black shadow-lg font-bold"
                      : "bg-white bg-opacity-5 text-white hover:bg-yellow-primary hover:bg-opacity-20 hover:text-yellow-primary"
                  }`}
                >
                  <div
                    className={`p-2 rounded ${
                      isActive
                        ? "bg-black bg-opacity-20"
                        : "bg-white bg-opacity-10"
                    }`}
                  >
                    <Icon size={22} />
                  </div>
                  <span className="font-semibold text-right flex-1 text-base">
                    {item.name}
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden bg-gray-lighter">
          {/* Overlay for mobile when sidebar is open */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-60 z-10 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          <div className="relative z-0">{renderContent()}</div>
        </main>
      </div>
    </div>
  );
}
