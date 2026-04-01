// src/pages/IELTSSkillDetails.jsx
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  BookOpen,
  Edit,
  Trash2,
  Package,
  Clock,
  Target,
  FileText,
} from "lucide-react";
import { ieltsSkillsAPI } from "../services/Ieltsservice";
import toast from "react-hot-toast";

export default function IELTSSkillDetails() {
  const { skillId } = useParams();
  const navigate = useNavigate();
  const [skill, setSkill] = useState(null);
  const [lessonPacks, setLessonPacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSkillDetails();
    fetchLessonPacks();
  }, [skillId]);

  const fetchSkillDetails = async () => {
    try {
      const data = await ieltsSkillsAPI.getById(skillId);
      setSkill(data);
    } catch (error) {
      console.error("Error fetching skill:", error);
      toast.error("فشل في تحميل تفاصيل المهارة");
    }
  };

  const fetchLessonPacks = async () => {
    try {
      setLoading(true);
      const data = await ieltsSkillsAPI.getLessonPacks(skillId);
      setLessonPacks(data.lesson_packs || []);
    } catch (error) {
      console.error("Error fetching lesson packs:", error);
      toast.error("فشل في تحميل Lesson Packs");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLessonPack = async (packId, packTitle) => {
    if (!confirm(`هل أنت متأكد من حذف "${packTitle}"؟`)) return;

    try {
      const { ieltsLessonPacksAPI } = await import("../services/Ieltsservice");
      await ieltsLessonPacksAPI.delete(packId);
      toast.success("تم حذف Lesson Pack بنجاح");
      fetchLessonPacks();
    } catch (error) {
      console.error("Error deleting lesson pack:", error);
      toast.error("فشل في حذف Lesson Pack");
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
      READING: "blue",
      WRITING: "purple",
      SPEAKING: "green",
      LISTENING: "orange",
    };
    return colors[skillType] || "gray";
  };

  if (!skill) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const color = getSkillColor(skill.skill_type);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/dashboard/ielts/skills"
          className="btn-secondary flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>رجوع للمهارات</span>
        </Link>
        <Link
          to={`/dashboard/ielts/skills/${skillId}/edit`}
          className="btn-secondary flex items-center gap-2"
        >
          <Edit className="w-4 h-4" />
          <span>تعديل المهارة</span>
        </Link>
      </div>

      {/* Skill Info Card */}
      <div className="card overflow-hidden">
        <div
          className={`bg-gradient-to-r from-${color}-500 to-${color}-600 p-8 -m-6 mb-6`}
        >
          <div className="flex items-center gap-6">
            <div className="text-6xl">{getSkillIcon(skill.skill_type)}</div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">
                {skill.title}
              </h1>
              <p className="text-white/90 text-lg">{skill.skill_type}</p>
            </div>
          </div>
        </div>

        {skill.description && (
          <div className="mb-6">
            <h3 className="text-sm font-bold text-gray-900 mb-2">الوصف</h3>
            <p className="text-gray-600">{skill.description}</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-5 h-5 text-primary-600" />
              <span className="text-xs font-bold text-gray-600">
                Lesson Packs
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {skill.lesson_packs_count || 0}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-5 h-5 text-primary-600" />
              <span className="text-xs font-bold text-gray-600">الترتيب</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{skill.order}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-primary-600" />
              <span className="text-xs font-bold text-gray-600">الحالة</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {skill.is_active ? (
                <span className="text-green-600">نشط</span>
              ) : (
                <span className="text-red-600">غير نشط</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Lesson Packs Section */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              Lesson Packs
            </h2>
            <p className="text-sm text-gray-600">
              مجموعات الدروس التابعة لهذه المهارة
            </p>
          </div>
          <Link
            to={`/dashboard/ielts/lesson-packs/create?skill_id=${skillId}`}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة Lesson Pack</span>
          </Link>
        </div>

        {/* Lesson Packs List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : lessonPacks.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              لا توجد Lesson Packs
            </h3>
            <p className="text-gray-600 mb-4">ابدأ بإضافة مجموعة دروس جديدة</p>
            <Link
              to={`/dashboard/ielts/lesson-packs/create?skill_id=${skillId}`}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة Lesson Pack</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {lessonPacks.map((pack) => (
              <div
                key={pack.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 hover:shadow-md transition-all overflow-hidden"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900 break-words">
                        {pack.title}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs font-bold rounded ${
                          pack.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {pack.is_active ? "نشط" : "غير نشط"}
                      </span>
                    </div>

                    {pack.description && (
                      <p className="text-sm text-gray-600 mb-3 break-words whitespace-pre-wrap">
                        {pack.description}
                      </p>
                    )}

                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        <span>
                          {pack.lessons_count || 0}{" "}
                          {pack.lessons_count === 1 ? "درس" : "دروس"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{pack.exam_time_limit} دقيقة</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        <span>نسبة النجاح: {pack.exam_passing_score}%</span>
                      </div>

                      {pack.has_practice_exam && (
                        <div className="flex items-center gap-2 text-green-600">
                          <FileText className="w-4 h-4" />
                          <span>يوجد امتحان</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Link
                      to={`/dashboard/ielts/lesson-packs/${pack.id}`}
                      className="btn-secondary text-sm"
                    >
                      التفاصيل
                    </Link>
                    <Link
                      to={`/dashboard/ielts/lesson-packs/${pack.id}/edit`}
                      className="btn-secondary"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() =>
                        handleDeleteLessonPack(pack.id, pack.title)
                      }
                      className="btn-secondary text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
