// src/pages/IELTSLessonDetails.jsx
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  Trash2,
  BookOpen,
  FileText,
  Video,
  Mic,
  Headphones,
  Plus,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { ieltsLessonsAPI } from "../../services/Ieltsservice";
import api from "../../api/axios";
import toast from "react-hot-toast";

// Map skill_type to content add route
const CONTENT_ROUTES = {
  READING: "reading",
  LISTENING: "listening",
  SPEAKING: "speaking",
  WRITING: "writing",
};

// Fetch actual content for each skill type using lesson_pack id
const fetchContentBySkill = async (skillType, lessonPackId) => {
  try {
    switch (skillType) {
      case "READING": {
        // ReadingPassages linked to this lesson_pack
        // We'll use the practice exam endpoint which has counts
        const res = await api.get(
          `/ielts/lesson-packs/${lessonPackId}/practice-exam/`
        );
        return res.data?.reading_count > 0 ? res.data : null;
      }
      case "LISTENING": {
        const res = await api.get(
          `/ielts/lesson-packs/${lessonPackId}/practice-exam/`
        );
        return res.data?.listening_count > 0 ? res.data : null;
      }
      case "SPEAKING": {
        const res = await api.get(
          `/ielts/lesson-packs/${lessonPackId}/practice-exam/`
        );
        return res.data?.speaking_count > 0 ? res.data : null;
      }
      case "WRITING": {
        const res = await api.get(
          `/ielts/lesson-packs/${lessonPackId}/practice-exam/`
        );
        return res.data?.writing_count > 0 ? res.data : null;
      }
      default:
        return null;
    }
  } catch {
    return null;
  }
};

export default function IELTSLessonDetails() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasContent, setHasContent] = useState(false);
  const [contentLoading, setContentLoading] = useState(false);

  useEffect(() => {
    fetchLessonDetails();
  }, [lessonId]);

  const fetchLessonDetails = async () => {
    try {
      setLoading(true);
      const data = await ieltsLessonsAPI.getById(lessonId);
      setLesson(data);
      // content بييجي مع الـ lesson مباشرةً — مش محتاج call تاني
      setHasContent(!!data.content);
    } catch (error) {
      console.error("Error fetching lesson:", error);
      toast.error("فشل في تحميل تفاصيل الدرس");
      navigate("/dashboard/ielts/skills");
    } finally {
      setLoading(false);
      setContentLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`هل أنت متأكد من حذف "${lesson.title}"؟`)) return;
    try {
      await ieltsLessonsAPI.delete(lessonId);
      toast.success("تم حذف الدرس بنجاح");
      navigate(`/dashboard/ielts/lesson-packs/${lesson.lesson_pack}`);
    } catch (error) {
      toast.error("فشل في حذف الدرس");
    }
  };

  const getSkillIcon = (s) =>
    ({ READING: "📖", WRITING: "✍️", SPEAKING: "🗣️", LISTENING: "👂" }[s] ||
    "📚");
  const getSkillColor = (s) =>
    ({
      READING: "blue",
      WRITING: "purple",
      SPEAKING: "green",
      LISTENING: "orange",
    }[s] || "gray");
  const getContentIcon = (s) =>
    ({
      READING: FileText,
      WRITING: Edit,
      SPEAKING: Video,
      LISTENING: Headphones,
    }[s] || FileText);

  const getAddContentRoute = (skillType) => {
    const route = CONTENT_ROUTES[skillType];
    return route
      ? `/dashboard/ielts/lessons/${lessonId}/content/add/${route}`
      : null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="card text-center py-12">
        <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          الدرس غير موجود
        </h3>
        <Link to="/dashboard/ielts/skills" className="btn-primary">
          العودة للمهارات
        </Link>
      </div>
    );
  }

  const color = getSkillColor(lesson.skill_type);
  const ContentIcon = getContentIcon(lesson.skill_type);
  const addContentRoute = getAddContentRoute(lesson.skill_type);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          to={`/dashboard/ielts/lesson-packs/${lesson.lesson_pack}`}
          className="btn-secondary flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>رجوع إلى Lesson Pack</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link
            to={`/dashboard/ielts/lessons/${lessonId}/edit`}
            className="btn-secondary flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            <span>تعديل</span>
          </Link>
          <button
            onClick={handleDelete}
            className="btn-secondary text-red-600 hover:bg-red-50 flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>حذف</span>
          </button>
        </div>
      </div>

      {/* Lesson Info Card */}
      <div className="card overflow-hidden">
        <div
          className={`bg-gradient-to-r from-${color}-500 to-${color}-600 p-6 -m-6 mb-6`}
        >
          <div className="flex items-center gap-4">
            <div className="text-5xl">{getSkillIcon(lesson.skill_type)}</div>
            <div className="flex-1">
              <div className="text-sm text-white/80 mb-1">
                {lesson.skill_type}
              </div>
              <h1 className="text-2xl font-bold text-white mb-1 break-words">
                {lesson.title}
              </h1>
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-1 text-xs font-bold rounded ${
                    lesson.is_active
                      ? "bg-white/20 text-white"
                      : "bg-white/10 text-white/70"
                  }`}
                >
                  {lesson.is_active ? "نشط" : "غير نشط"}
                </span>
                <span className="text-white/80 text-sm">
                  الترتيب: {lesson.order}
                </span>
              </div>
            </div>
          </div>
        </div>

        {lesson.description && (
          <div className="mb-6">
            <h3 className="text-sm font-bold text-gray-900 mb-2">وصف الدرس</h3>
            <p className="text-gray-600 break-words whitespace-pre-wrap">
              {lesson.description}
            </p>
          </div>
        )}

        {/* Content Status */}
        <div className="border-t border-gray-200 pt-6">
          {contentLoading ? (
            <div className="flex items-center gap-3 text-gray-500">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">جاري التحقق من المحتوى...</span>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ContentIcon
                  className={`w-6 h-6 ${
                    hasContent ? "text-green-600" : "text-gray-400"
                  }`}
                />
                <div>
                  <h3 className="text-sm font-bold text-gray-900">
                    محتوى الدرس
                  </h3>
                  <p className="text-xs text-gray-600">
                    {hasContent
                      ? "تم إضافة المحتوى ✓"
                      : "لم يتم إضافة المحتوى بعد"}
                  </p>
                </div>
              </div>

              {hasContent ? (
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <Link
                    to={`/dashboard/ielts/lessons/${lessonId}/content/edit`}
                    className="btn-secondary text-sm"
                  >
                    تعديل المحتوى
                  </Link>
                </div>
              ) : (
                addContentRoute && (
                  <Link
                    to={addContentRoute}
                    className="btn-primary flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>إضافة المحتوى</span>
                  </Link>
                )
              )}
            </div>
          )}
        </div>
      </div>

      {/* No Content Message */}
      {!contentLoading && !hasContent && (
        <div className="card text-center py-12">
          <ContentIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            لم يتم إضافة المحتوى بعد
          </h3>
          <p className="text-gray-600 mb-4">
            أضف المحتوى المناسب لهذا الدرس حسب نوع المهارة
          </p>
          {addContentRoute && (
            <Link
              to={addContentRoute}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة المحتوى الآن</span>
            </Link>
          )}
        </div>
      )}

      {/* Has Content Message */}
      {!contentLoading && hasContent && (
        <div className="card">
          <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-green-900">المحتوى موجود</h3>
              <p className="text-sm text-green-700 mt-0.5">
                تم إضافة محتوى{" "}
                {
                  {
                    READING: "القراءة",
                    WRITING: "الكتابة",
                    SPEAKING: "التحدث",
                    LISTENING: "الاستماع",
                  }[lesson.skill_type]
                }{" "}
                لهذا الدرس بنجاح.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
