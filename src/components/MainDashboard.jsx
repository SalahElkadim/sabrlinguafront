
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
  ChevronDown,
  ChevronUp,
  Layers,
  BookMarked,
  FolderTree,
  GraduationCap,
  Dumbbell,
} from "lucide-react";

// Import Placement Test components
import PlacementTestsDashboard from "./PlacementTestsDashboard";
import MCQQuestionsDashboard from "./MCQQuestionsDashboard";
import ReadingPassagesDashboard from "./ReadingPassagesDashboard";
import ListeningQuestionsDashboard from "./ListeningQuestionsDashboard";
import SpeakingQuestionsDashboard from "./SpeakingQuestionsDashboard";
import WritingQuestionsDashboard from "./WritingQuestionsDashboard";

// Import Course Management components
import LevelsDashboard from "./courses/LevelsDashboard";
import UnitsDashboard from "./courses/UnitsDashboard";
import SectionsDashboard from "./courses/SectionsDashboard";
import LessonsDashboard from "./courses/LessonsDashboard";
import ExercisesDashboard from "./courses/ExercisesDashboard";

export default function MainDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("tests");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isPlacementTestOpen, setIsPlacementTestOpen] = useState(false);
  const [isCourseManagementOpen, setIsCourseManagementOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("token");
    localStorage.removeItem("user_data");
    navigate("/login", { replace: true });
  };

  const placementTestItems = [
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

  const courseManagementItems = [
    {
      id: "levels",
      name: "إدارة المستويات",
      icon: Layers,
      description: "A1, A2, B1, B2",
    },
    {
      id: "units",
      name: "إدارة الوحدات",
      icon: BookMarked,
      description: "Units 1-13",
    },
    {
      id: "sections",
      name: "إدارة الأقسام",
      icon: FolderTree,
      description: "Grammar, Reading, etc.",
    },
    {
      id: "lessons",
      name: "إدارة الدروس",
      icon: GraduationCap,
      description: "المحتوى التعليمي",
    },
    {
      id: "exercises",
      name: "إدارة التمارين",
      icon: Dumbbell,
      description: "التمارين والأسئلة",
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      // Placement Test Routes
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

      // Course Management Routes
      case "levels":
        return <LevelsDashboard />;
      case "units":
        return <UnitsDashboard />;
      case "sections":
        return <SectionsDashboard />;
      case "lessons":
        return <LessonsDashboard />;
      case "exercises":
        return <ExercisesDashboard />;

      default:
        return <PlacementTestsDashboard />;
    }
  };

  const getActiveItemName = () => {
    const placementItem = placementTestItems.find(
      (item) => item.id === activeTab
    );
    const courseItem = courseManagementItems.find(
      (item) => item.id === activeTab
    );
    return placementItem?.name || courseItem?.name || "نظام إدارة الامتحانات";
  };

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
                <p className="text-sm text-gray-light">{getActiveItemName()}</p>
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
            {/* Placement Test Section */}
            <button
              onClick={() => setIsPlacementTestOpen(!isPlacementTestOpen)}
              className={`w-full flex items-center gap-4 p-4 rounded transition-all ${
                isPlacementTestOpen
                  ? "bg-yellow-primary text-black shadow-lg font-bold"
                  : "bg-white bg-opacity-5 text-white hover:bg-yellow-primary hover:bg-opacity-20 hover:text-yellow-primary"
              }`}
            >
              <div
                className={`p-2 rounded ${
                  isPlacementTestOpen
                    ? "bg-black bg-opacity-20"
                    : "bg-white bg-opacity-10"
                }`}
              >
                <List size={22} />
              </div>
              <span className="font-semibold text-right flex-1 text-base">
                Placement Test
              </span>
              {isPlacementTestOpen ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </button>

            {/* Placement Test Items */}
            {isPlacementTestOpen && (
              <div className="space-y-2 pr-4">
                {placementTestItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        if (window.innerWidth < 1024) {
                          setIsSidebarOpen(false);
                        }
                      }}
                      className={`w-full flex items-center gap-3 p-3 rounded transition-all ${
                        isActive
                          ? "bg-yellow-primary text-black shadow-md font-bold"
                          : "bg-white bg-opacity-5 text-white hover:bg-yellow-primary hover:bg-opacity-20 hover:text-yellow-primary"
                      }`}
                    >
                      <div
                        className={`p-1.5 rounded ${
                          isActive
                            ? "bg-black bg-opacity-20"
                            : "bg-white bg-opacity-10"
                        }`}
                      >
                        <Icon size={18} />
                      </div>
                      <span className="font-medium text-right flex-1 text-sm">
                        {item.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Divider */}
            <div className="border-t border-white border-opacity-10 my-4"></div>

            {/* Course Management Section */}
            <button
              onClick={() => setIsCourseManagementOpen(!isCourseManagementOpen)}
              className={`w-full flex items-center gap-4 p-4 rounded transition-all ${
                isCourseManagementOpen
                  ? "bg-yellow-primary text-black shadow-lg font-bold"
                  : "bg-white bg-opacity-5 text-white hover:bg-yellow-primary hover:bg-opacity-20 hover:text-yellow-primary"
              }`}
            >
              <div
                className={`p-2 rounded ${
                  isCourseManagementOpen
                    ? "bg-black bg-opacity-20"
                    : "bg-white bg-opacity-10"
                }`}
              >
                <GraduationCap size={22} />
              </div>
              <span className="font-semibold text-right flex-1 text-base">
                إدارة المستويات والوحدات
              </span>
              {isCourseManagementOpen ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </button>

            {/* Course Management Items */}
            {isCourseManagementOpen && (
              <div className="space-y-2 pr-4">
                {courseManagementItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        if (window.innerWidth < 1024) {
                          setIsSidebarOpen(false);
                        }
                      }}
                      className={`w-full flex flex-col gap-1 p-3 rounded transition-all ${
                        isActive
                          ? "bg-yellow-primary text-black shadow-md font-bold"
                          : "bg-white bg-opacity-5 text-white hover:bg-yellow-primary hover:bg-opacity-20 hover:text-yellow-primary"
                      }`}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div
                          className={`p-1.5 rounded ${
                            isActive
                              ? "bg-black bg-opacity-20"
                              : "bg-white bg-opacity-10"
                          }`}
                        >
                          <Icon size={18} />
                        </div>
                        <span className="font-medium text-right flex-1 text-sm">
                          {item.name}
                        </span>
                      </div>
                      {item.description && (
                        <span
                          className={`text-xs text-right pr-10 ${
                            isActive
                              ? "text-black text-opacity-70"
                              : "text-white text-opacity-60"
                          }`}
                        >
                          {item.description}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
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
