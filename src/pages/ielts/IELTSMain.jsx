// src/pages/IELTSMain.jsx
import { Link } from "react-router-dom";
import { BookOpen, Users, FileText, Award, ArrowLeft } from "lucide-react";

export default function IELTSMain() {
  const sections = [
    {
      id: "skills",
      name: "المهارات (Skills)",
      description:
        "إدارة المهارات الأربعة: Reading, Writing, Speaking, Listening",
      icon: Award,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      link: "/dashboard/ielts/skills",
      stats: { name: "المهارات", value: "4" },
    },
    
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card bg-gradient-to-r from-orange-600 to-orange-700 text-white">
        <div>
          <h1 className="text-3xl font-bold mb-2">IELTS System</h1>
          <p className="text-orange-100">
            إدارة شاملة لنظام IELTS: المهارات، الدروس، والامتحانات التدريبية
          </p>
        </div>
      </div>

      {/* Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Link
              key={section.id}
              to={section.link}
              className="group card hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
            >
              {/* Header */}
              <div
                className={`bg-gradient-to-r ${section.color} p-6 rounded-t-xl -m-6 mb-6`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
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

              {/* Stats */}
              <div className={`${section.bgColor} p-4 rounded-lg`}>
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${section.iconColor}`} />
                  <div>
                    <p className="text-sm text-gray-600">
                      {section.stats.name}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {section.stats.value}
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">اضغط للدخول</span>
                  <span
                    className={`${section.iconColor} font-medium group-hover:translate-x-[-4px] transition-transform inline-flex items-center gap-1`}
                  >
                    عرض
                    <ArrowLeft className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-blue-50">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Award className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">4 مهارات رئيسية</h3>
            <p className="text-sm text-gray-600">
              Reading, Writing, Speaking, Listening
            </p>
          </div>
        </div>

        <div className="card bg-purple-50">
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <BookOpen className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">Lesson Packs</h3>
            <p className="text-sm text-gray-600">
              مجموعات دروس منظمة تحت كل مهارة
            </p>
          </div>
        </div>

        <div className="card bg-green-50">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">امتحانات تدريبية</h3>
            <p className="text-sm text-gray-600">
              امتحان تلقائي لكل Lesson Pack
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
