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
      color: "from-blue-600 to-indigo-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      id: "mcq",
      name: "أسئلة الاختيار من متعدد",
      icon: FileText,
      color: "from-green-600 to-teal-600",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      id: "reading",
      name: "قطع القراءة",
      icon: BookOpen,
      color: "from-orange-600 to-red-600",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
    },
    {
      id: "listening",
      name: "أسئلة الاستماع",
      icon: Headphones,
      color: "from-purple-600 to-pink-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
    {
      id: "speaking",
      name: "فيديوهات التحدث",
      icon: Video,
      color: "from-red-600 to-orange-600",
      bgColor: "bg-red-50",
      textColor: "text-red-600",
    },
    {
      id: "writing",
      name: "أسئلة الكتابة",
      icon: PenTool,
      color: "from-teal-600 to-cyan-600",
      bgColor: "bg-teal-50",
      textColor: "text-teal-600",
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
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-30">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
              >
                {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  نظام إدارة الامتحانات
                </h1>
                <p className="text-sm text-gray-600">{activeMenuItem?.name}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all shadow-md hover:shadow-lg"
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
          } fixed lg:sticky top-[73px] right-0 h-[calc(100vh-73px)] w-80 bg-white shadow-lg transition-transform duration-300 ease-in-out z-20 lg:translate-x-0 overflow-y-auto`}
        >
          <div className="p-6 space-y-2">
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
                  className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${
                    isActive
                      ? `bg-gradient-to-r ${item.color} text-white shadow-lg transform scale-105`
                      : `${item.bgColor} ${item.textColor} hover:shadow-md hover:scale-102`
                  }`}
                >
                  <div
                    className={`p-3 rounded-lg ${
                      isActive ? "bg-white bg-opacity-20" : "bg-white"
                    }`}
                  >
                    <Icon size={24} />
                  </div>
                  <span className="font-semibold text-right flex-1">
                    {item.name}
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden">
          {/* Overlay for mobile when sidebar is open */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          <div className="relative z-0">{renderContent()}</div>
        </main>
      </div>
    </div>
  );
}
