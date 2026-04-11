// src/pages/general/GeneralMain.jsx
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  FolderOpen,
  Sparkles,
  BarChart2,
  ArrowLeft,
} from "lucide-react";

export default function GeneralMain() {
  const navigate = useNavigate();

  const cards = [
    {
      title: "الكاتيجوريز",
      description: "إدارة كاتيجوريز General English وإضافة محتوى جديد",
      icon: FolderOpen,
      href: "/dashboard/general/categories",
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
      iconBg: "bg-emerald-100",
    },
    {
      title: "التوليد بالذكاء الاصطناعي",
      description: "رفع كتب وميديا وتوليد أسئلة تلقائياً باستخدام AI",
      icon: Sparkles,
      href: "/dashboard/general/ai",
      color: "bg-violet-50 text-violet-700 border-violet-200",
      iconBg: "bg-violet-100",
    },
    {
      title: "تقارير التقدم",
      description: "متابعة تقدم الطلاب في كل كاتيجوري ومهارة",
      icon: BarChart2,
      href: "/dashboard/general/progress",
      color: "bg-blue-50 text-blue-700 border-blue-200",
      iconBg: "bg-blue-100",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
          <BookOpen className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">General English</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            إدارة محتوى General English الديناميكي
          </p>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.href}
              onClick={() => navigate(card.href)}
              className={`text-right p-6 rounded-2xl border-2 ${card.color} hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 group`}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-12 h-12 ${card.iconBg} rounded-xl flex items-center justify-center`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <ArrowLeft className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity -rotate-180" />
              </div>
              <h3 className="font-bold text-lg mb-1">{card.title}</h3>
              <p className="text-sm opacity-75">{card.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
