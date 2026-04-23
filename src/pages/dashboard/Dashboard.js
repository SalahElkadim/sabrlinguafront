// src/pages/Dashboard.jsx
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Globe,
  BookMarked,
  BookOpen,
  Users,
  LayoutGrid,
  CreditCard,
} from "lucide-react";

export default function Dashboard() {
  const modules = [
    {
      id: "general-system",
      name: "GENERAL System",
      description: "General Questions in English",
      icon: BookOpen,
      color: "from-green-500 to-green-600",
      iconColor: "text-green-600",
      link: "/dashboard/general",
    },
    {
      id: "all-tests-system",
      name: "ALL TESTS System",
      description: "Special Tests in English",
      icon: BookMarked,
      color: "from-yellow-500 to-amber-600",
      iconColor: "text-yellow-600",
      link: "/dashboard/esp",
    },
    {
      id: "ielts-system",
      name: "IELTS System",
      description: "Manage IELTS System",
      icon: Globe,
      color: "from-orange-500 to-orange-600",
      iconColor: "text-orange-600",
      link: "/dashboard/ielts",
    },
    {
      id: "step-system",
      name: "STEP System",
      description: "Manage STEP System",
      icon: BookMarked,
      color: "from-blue-500 to-indigo-600",
      iconColor: "text-blue-600",
      link: "/dashboard/step",
    },
    {
      id: "teachers",
      name: "Teachers",
      description: "Manage teachers, reviews & ratings",
      icon: Users,
      color: "from-violet-500 to-purple-600",
      iconColor: "text-violet-600",
      link: "/dashboard/teachers",
    },
    {
      id: "programs",
      name: "Programs",
      description: "Create & manage teaching programs",
      icon: LayoutGrid,
      color: "from-indigo-500 to-blue-600",
      iconColor: "text-indigo-600",
      link: "/dashboard/programs",
    },
    {
      id: "subscriptions",
      name: "Subscriptions",
      description: "View & manage student subscriptions",
      icon: CreditCard,
      color: "from-emerald-500 to-teal-600",
      iconColor: "text-emerald-600",
      link: "/dashboard/subscriptions",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="card bg-gradient-to-r from-primary-600 to-blue-600 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome To Dashboard</h1>
        <p className="text-blue-100">Choose The Section You Want.</p>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {modules.map((module) => {
          const Icon = module.icon;
          return (
            <Link
              key={module.id}
              to={module.link}
              className="group card hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
            >
              <div
                className={`bg-gradient-to-r ${module.color} p-6 rounded-t-xl -m-6 mb-6`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white mb-1">
                        {module.name}
                      </h2>
                      <p className="text-white/80 text-sm leading-snug">
                        {module.description}
                      </p>
                    </div>
                  </div>
                  <ArrowLeft className="w-5 h-5 text-white group-hover:translate-x-[-6px] transition-transform flex-shrink-0" />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span
                  className={`${module.iconColor} font-medium inline-flex items-center gap-1 group-hover:translate-x-[-4px] transition-transform`}
                >
                  Go <ArrowLeft className="w-4 h-4" />
                </span>
                <span className="text-gray-400">Press here</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
