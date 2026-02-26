// src/pages/STEPSkillsList.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  BookOpen,
  Eye,
  Edit2,
  Trash2,
  Volume2,
  PenTool,
  FileText,
} from "lucide-react";
import { stepSkillsAPI } from "../services/stepService";

const skillTypeConfig = {
  VOCABULARY: {
    label: "Vocabulary",
    icon: Volume2,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  GRAMMAR: {
    label: "Grammar",
    icon: PenTool,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  READING: {
    label: "Reading",
    icon: BookOpen,
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
  WRITING: {
    label: "Writing",
    icon: FileText,
    color: "text-green-600",
    bg: "bg-green-50",
  },
};

export default function STEPSkillsList() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const data = await stepSkillsAPI.getAll();
      setSkills(data.skills || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذه المهارة؟")) return;
    try {
      await stepSkillsAPI.delete(id);
      setSkills((prev) => prev.filter((s) => s.id !== id));
    } catch (e) {
      alert("حدث خطأ أثناء الحذف");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">STEP Skills</h1>
          <p className="text-gray-500 text-sm mt-1">
            إدارة مهارات STEP الأربعة
          </p>
        </div>
        <Link
          to="/dashboard/step/skills/create"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>إضافة مهارة</span>
        </Link>
      </div>

      {/* Skills Grid */}
      {skills.length === 0 ? (
        <div className="card text-center py-16">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            لا توجد مهارات
          </h3>
          <p className="text-gray-500 text-sm mb-6">
            ابدأ بإضافة مهارات STEP الأربعة
          </p>
          <Link
            to="/dashboard/step/skills/create"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            إضافة مهارة
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((skill) => {
            const config = skillTypeConfig[skill.skill_type] || {};
            const Icon = config.icon || BookOpen;
            return (
              <div
                key={skill.id}
                className="card hover:shadow-lg transition-shadow"
              >
                <div
                  className={`${config.bg} rounded-xl p-4 mb-4 flex items-center gap-3`}
                >
                  <Icon className={`w-8 h-8 ${config.color}`} />
                  <div>
                    <p className="font-bold text-gray-900">{skill.title}</p>
                    <p className={`text-xs font-medium ${config.color}`}>
                      {config.label}
                    </p>
                  </div>
                </div>

                {skill.description && (
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {skill.description}
                  </p>
                )}

                <div className="flex items-center justify-between text-sm mb-4">
                  <span className="text-gray-500">إجمالي الأسئلة</span>
                  <span className={`font-bold ${config.color}`}>
                    {skill.total_questions}
                  </span>
                </div>

                <div className="flex gap-2">
                  <Link
                    to={`/dashboard/step/skills/${skill.id}`}
                    className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    عرض
                  </Link>
                  <Link
                    to={`/dashboard/step/skills/${skill.id}/edit`}
                    className="flex items-center justify-center p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(skill.id)}
                    className="flex items-center justify-center p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
