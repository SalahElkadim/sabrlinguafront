// src/pages/IELTSSkillsList.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, BookOpen, Edit, Trash2, ArrowLeft } from "lucide-react";
import { ieltsSkillsAPI } from "../services/Ieltsservice";
import toast from "react-hot-toast";

export default function IELTSSkillsList() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const data = await ieltsSkillsAPI.getAll();
      setSkills(data.skills || []);
    } catch (error) {
      console.error("Error fetching skills:", error);
      toast.error("فشل في تحميل المهارات");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (skillId) => {
    if (!confirm("هل أنت متأكد من حذف هذه المهارة؟")) return;

    try {
      await ieltsSkillsAPI.delete(skillId);
      toast.success("تم حذف المهارة بنجاح");
      fetchSkills();
    } catch (error) {
      console.error("Error deleting skill:", error);
      toast.error("فشل في حذف المهارة");
    }
  };

  const getSkillIcon = (skillType) => {
    const icons = {
      READING: "📖",
      WRITING: "✍️",
      SPEAKING: "🗣️",
      LISTENING: "👂",
    };
    return icons[skillType] || "📚";
  };

  const getSkillColor = (skillType) => {
    const colors = {
      READING: "from-blue-500 to-blue-600",
      WRITING: "from-purple-500 to-purple-600",
      SPEAKING: "from-green-500 to-green-600",
      LISTENING: "from-orange-500 to-orange-600",
    };
    return colors[skillType] || "from-gray-500 to-gray-600";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">IELTS Skills</h1>
          <p className="text-gray-600 mt-1">إدارة المهارات الأربعة الرئيسية</p>
        </div>
        <Link
          to="/dashboard/ielts/skills/create"
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span>إضافة مهارة</span>
        </Link>
      </div>

      {/* Skills Grid */}
      {skills.length === 0 ? (
        <div className="card text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            لا توجد مهارات
          </h3>
          <p className="text-gray-600 mb-4">ابدأ بإضافة المهارات الأربعة</p>
          <Link
            to="/dashboard/ielts/skills/create"
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span>إضافة مهارة</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className="card group hover:shadow-xl transition-all"
            >
              {/* Header with gradient */}
              <div
                className={`bg-gradient-to-r ${getSkillColor(
                  skill.skill_type
                )} p-6 rounded-t-xl -m-6 mb-6`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">
                      {getSkillIcon(skill.skill_type)}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-1">
                        {skill.title}
                      </h2>
                      <p className="text-white/80 text-sm">
                        {skill.skill_type}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              {skill.description && (
                <p className="text-gray-600 text-sm mb-4">
                  {skill.description}
                </p>
              )}

              {/* Stats */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1 bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Lesson Packs</p>
                  <p className="text-lg font-bold text-gray-900">
                    {skill.lesson_packs_count || 0}
                  </p>
                </div>
                <div className="flex-1 bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">الترتيب</p>
                  <p className="text-lg font-bold text-gray-900">
                    {skill.order}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                <Link
                  to={`/dashboard/ielts/skills/${skill.id}`}
                  className="flex-1 btn-secondary text-center"
                >
                  <ArrowLeft className="w-4 h-4 inline mr-2" />
                  التفاصيل
                </Link>
                <Link
                  to={`/dashboard/ielts/skills/${skill.id}/edit`}
                  className="btn-secondary"
                >
                  <Edit className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => handleDelete(skill.id)}
                  className="btn-secondary text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
