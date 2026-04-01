// src/pages/Dashboard.jsx - WITH IELTS + STEP MODULE
import { Link } from "react-router-dom";
import {
  GraduationCap,
  Layers,
  ArrowLeft,
  Database,
  FileText,
  BookOpen,
  Users,
  Globe,
  Award,
  BookMarked,
  BarChart2,
} from "lucide-react";

export default function Dashboard() {
  const modules = [
    {
      id: "placement-bank",
      name: "Placement Bank",
      description: "إدارة بنوك الأسئلة واختبارات تحديد المستوى",
      icon: GraduationCap,
      color: "from-green-500 to-green-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      link: "/dashboard/question-banks",
      stats: [
        { name: "البنوك", value: "1", icon: Database },
        { name: "الأسئلة", value: "52", icon: FileText },
      ],
    },
    {
      id: "levels-system",
      name: "Levels System",
      description: "إدارة المستويات والوحدات والدروس التعليمية",
      icon: Layers,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      link: "/dashboard/levels",
      stats: [
        { name: "المستويات", value: "4", icon: Layers },
        { name: "الوحدات", value: "12", icon: BookOpen },
      ],
    },
    {
      id: "ielts-system",
      name: "IELTS System",
      description: "إدارة مهارات IELTS والدروس والامتحانات التدريبية",
      icon: Globe,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
      link: "/dashboard/ielts",
      stats: [
        { name: "المهارات", value: "4", icon: Award },
        { name: "Lesson Packs", value: "0", icon: BookOpen },
      ],
    },
    {
      id: "step-system",
      name: "STEP System",
      description:
        "إدارة مهارات STEP وأسئلة Vocabulary وGrammar وReading وWriting",
      icon: BookMarked,
      color: "from-blue-500 to-indigo-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      link: "/dashboard/step",
      stats: [
        { name: "المهارات", value: "4", icon: Award },
        { name: "التقدم", value: "0%", icon: BarChart2 },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="card bg-gradient-to-r from-primary-600 to-blue-600 text-white">
        <div>
          <h1 className="text-3xl font-bold mb-2">مرحباً بك في لوحة التحكم</h1>
          <p className="text-blue-100">
            اختر القسم الذي تريد العمل عليه من الأقسام أدناه
          </p>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6">
        {modules.map((module) => {
          const Icon = module.icon;
          return (
            <Link
              key={module.id}
              to={module.link}
              className="group card hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
            >
              {/* Header with gradient */}
              <div
                className={`bg-gradient-to-r ${module.color} p-6 rounded-t-xl -m-6 mb-6`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-1">
                        {module.name}
                      </h2>
                      <p className="text-white/80 text-sm">
                        {module.description}
                      </p>
                    </div>
                  </div>
                  <ArrowLeft className="w-6 h-6 text-white group-hover:translate-x-[-8px] transition-transform" />
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                {module.stats.map((stat, idx) => {
                  const StatIcon = stat.icon;
                  return (
                    <div
                      key={idx}
                      className={`${module.bgColor} p-4 rounded-lg`}
                    >
                      <div className="flex items-center gap-3">
                        <StatIcon className={`w-5 h-5 ${module.iconColor}`} />
                        <div>
                          <p className="text-sm text-gray-600">{stat.name}</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {stat.value}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">اضغط للدخول إلى القسم</span>
                  <span
                    className={`${module.iconColor} font-medium group-hover:translate-x-[-4px] transition-transform inline-flex items-center gap-1`}
                  >
                    الذهاب
                    <ArrowLeft className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Info Card */}
      <div className="card bg-gray-50">
        <div className="text-center py-8">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            المزيد من الأقسام قريباً
          </h3>
          <p className="text-gray-600 text-sm">
            نعمل على إضافة المزيد من الأقسام والميزات لتسهيل عملك
          </p>
        </div>
      </div>
    </div>
  );
}
