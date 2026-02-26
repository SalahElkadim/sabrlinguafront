// src/pages/STEPMain.jsx
import { Link } from "react-router-dom";
import {
  BookOpen,
  PenTool,
  Volume2,
  FileText,
  ArrowLeft,
  BarChart2,
} from "lucide-react";

export default function STEPMain() {
  const sections = [
    {
      id: "skills",
      name: "STEP Skills",
      description:
        "إدارة مهارات STEP الأربعة (Vocabulary, Grammar, Reading, Writing)",
      icon: BookOpen,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      link: "/dashboard/step/skills",
    },
    {
      id: "progress",
      name: "تقدم الطلاب",
      description: "عرض تقدم الطلاب في مهارات STEP",
      icon: BarChart2,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      link: "/dashboard/step/progress",
    },
  ];

  const skillCards = [
    {
      label: "Vocabulary",
      icon: Volume2,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Grammar",
      icon: PenTool,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Reading",
      icon: BookOpen,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      label: "Writing",
      icon: FileText,
      color: "text-green-600",
      bg: "bg-green-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div>
          <h1 className="text-3xl font-bold mb-2">STEP System</h1>
          <p className="text-blue-100">
            إدارة منظومة اختبار STEP - المهارات والأسئلة ومتابعة تقدم الطلاب
          </p>
        </div>
      </div>

      {/* Skill Types Overview */}
      <div className="card">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          المهارات المتاحة
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {skillCards.map((skill) => {
            const Icon = skill.icon;
            return (
              <div
                key={skill.label}
                className={`${skill.bg} rounded-xl p-4 text-center`}
              >
                <Icon className={`w-8 h-8 ${skill.color} mx-auto mb-2`} />
                <p className="font-semibold text-gray-800">{skill.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Link
              key={section.id}
              to={section.link}
              className="group card hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
            >
              <div
                className={`bg-gradient-to-r ${section.color} p-6 rounded-t-xl -m-6 mb-6`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white mb-1">
                        {section.name}
                      </h2>
                      <p className="text-white/80 text-sm">
                        {section.description}
                      </p>
                    </div>
                  </div>
                  <ArrowLeft className="w-6 h-6 text-white group-hover:translate-x-[-8px] transition-transform" />
                </div>
              </div>
              <div className="flex items-center justify-between text-sm pt-2">
                <span className="text-gray-600">اضغط للدخول</span>
                <span className={`${section.iconColor} font-medium`}>
                  الذهاب →
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
