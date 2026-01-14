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
  Music,
  Film,
  Edit3,
  Type,
} from "lucide-react";

// --- Import Placement Test components ---
import PlacementTestsDashboard from "./PlacementTestsDashboard";
import MCQQuestionsDashboard from "./MCQQuestionsDashboard";
import ReadingPassagesDashboard from "./ReadingPassagesDashboard";
import ListeningQuestionsDashboard from "./ListeningQuestionsDashboard";
import SpeakingQuestionsDashboard from "./SpeakingQuestionsDashboard";
import WritingQuestionsDashboard from "./WritingQuestionsDashboard";

// --- Import Course Management components ---
import LevelsDashboard from "./courses/LevelsDashboard";
import UnitsDashboard from "./courses/UnitsDashboard";
import { SectionsDashboard } from "./courses/SectionsDashboard";
import { LessonsDashboard } from "./courses/LessonsDashboard";
import { ExercisesDashboard } from "./courses/ExercisesDashboard";

// --- Import New Exercise-Linked Components ---
import { ExerciseReadingDashboard } from "./courses/ExerciseReadingDashboard";
import { ExerciseListeningDashboard } from "./courses/ExerciseListeningDashboard";
import { ExerciseSpeakingDashboard } from "./courses/ExerciseSpeakingDashboard";
import { ExerciseWritingDashboard } from "./courses/ExerciseWritingDashboard";
import { ExerciseMCQDashboard } from "./courses/ExerciseMCQDashboard"; // التأكد من الاستيراد

export default function MainDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("tests");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isPlacementTestOpen, setIsPlacementTestOpen] = useState(false);
  const [isCourseManagementOpen, setIsCourseManagementOpen] = useState(true);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  const placementTestItems = [
    { id: "tests", name: "إدارة الامتحانات", icon: List },
    { id: "mcq", name: "أسئلة الاختيار من متعدد", icon: FileText },
    { id: "reading", name: "قطع القراءة", icon: BookOpen },
    { id: "listening", name: "أسئلة الاستماع", icon: Headphones },
    { id: "speaking", name: "فيديوهات التحدث", icon: Video },
    { id: "writing", name: "أسئلة الكتابة", icon: PenTool },
  ];

  const courseManagementItems = [
    {
      id: "levels",
      name: "المستويات",
      icon: Layers,
      description: "A1, A2, B1, B2",
    },
    {
      id: "units",
      name: "الوحدات",
      icon: BookMarked,
      description: "Units Management",
    },
    {
      id: "sections",
      name: "الأقسام",
      icon: FolderTree,
      description: "Grammar, Vocab",
    },
    {
      id: "lessons",
      name: "الدروس",
      icon: GraduationCap,
      description: "Content Management",
    },
    {
      id: "exercises",
      name: "التمارين",
      icon: Dumbbell,
      description: "Containers for Qs",
    },

    // --- الأسئلة المرتبطة بالتمارين (المضافة والمعدلة) ---
    {
      id: "ex-mcq",
      name: "أسئلة الاختيار (تمارين)",
      icon: FileText,
      description: "Grammar & Vocab Qs",
    },
    {
      id: "ex-reading",
      name: "أسئلة القراءة (تمارين)",
      icon: Type,
      description: "Reading Passages",
    },
    {
      id: "ex-listening",
      name: "أسئلة الاستماع (تمارين)",
      icon: Music,
      description: "Audio Exercises",
    },
    {
      id: "ex-speaking",
      name: "أسئلة التحدث (تمارين)",
      icon: Film,
      description: "Video Exercises",
    },
    {
      id: "ex-writing",
      name: "أسئلة الكتابة (تمارين)",
      icon: Edit3,
      description: "Writing Tasks",
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      // Placement Test
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

      // Course Management
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

      // New Linked Exercise Content (تمت إضافة ex-mcq هنا)
      case "ex-mcq":
        return <ExerciseMCQDashboard />;
      case "ex-reading":
        return <ExerciseReadingDashboard />;
      case "ex-listening":
        return <ExerciseListeningDashboard />;
      case "ex-speaking":
        return <ExerciseSpeakingDashboard />;
      case "ex-writing":
        return <ExerciseWritingDashboard />;

      default:
        return <PlacementTestsDashboard />;
    }
  };

  const getActiveItemName = () => {
    const allItems = [...placementTestItems, ...courseManagementItems];
    return (
      allItems.find((item) => item.id === activeTab)?.name || "لوحة التحكم"
    );
  };

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      {/* Top Navigation Bar */}
      <nav className="bg-black border-b-2 border-yellow-500 sticky top-0 z-30">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4 text-white">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2"
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div>
              <h1 className="text-2xl font-bold text-yellow-500">
                SABR LINGUA
              </h1>
              <p className="text-sm text-gray-400">{getActiveItemName()}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="bg-yellow-500 text-black px-5 py-2 rounded font-bold hover:bg-yellow-600 flex items-center gap-2"
          >
            <LogOut size={20} /> <span className="hidden sm:inline">خروج</span>
          </button>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            isSidebarOpen ? "translate-x-0" : "translate-x-full"
          } fixed lg:sticky top-[73px] right-0 h-[calc(100vh-73px)] w-80 bg-black border-l-2 border-yellow-500 shadow-lg transition-transform lg:translate-x-0 overflow-y-auto z-20`}
        >
          <div className="p-4 space-y-2">
            <SidebarSection
              title="Placement Test"
              isOpen={isPlacementTestOpen}
              setIsOpen={setIsPlacementTestOpen}
              items={placementTestItems}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              setIsSidebarOpen={setIsSidebarOpen}
            />

            <div className="border-t border-gray-800 my-4"></div>

            <SidebarSection
              title="إدارة المستويات والتمارين"
              isOpen={isCourseManagementOpen}
              setIsOpen={setIsCourseManagementOpen}
              items={courseManagementItems}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              setIsSidebarOpen={setIsSidebarOpen}
            />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-gray-50 p-4 relative">
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 lg:hidden z-10"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
          <div className="relative z-0">{renderContent()}</div>
        </main>
      </div>
    </div>
  );
}

function SidebarSection({
  title,
  isOpen,
  setIsOpen,
  items,
  activeTab,
  setActiveTab,
  setIsSidebarOpen,
}) {
  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-4 rounded-xl mb-2 transition-all ${
          isOpen
            ? "bg-yellow-500 text-black font-bold"
            : "text-gray-400 hover:bg-gray-900"
        }`}
      >
        <span className="text-base">{title}</span>
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {isOpen && (
        <div className="space-y-1 pr-2">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (window.innerWidth < 1024) setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                activeTab === item.id
                  ? "bg-white/10 text-yellow-500 border-r-4 border-yellow-500"
                  : "text-gray-400 hover:text-white hover:bg-gray-900"
              }`}
            >
              <item.icon size={18} />
              <div className="text-right">
                <div className="text-sm font-medium">{item.name}</div>
                {item.description && (
                  <div className="text-[10px] opacity-60">
                    {item.description}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
