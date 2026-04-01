// src/pages/LessonPackDetails.jsx
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  BookOpen,
  Edit,
  Trash2,
  Clock,
  Target,
  FileText,
  Package,
} from "lucide-react";
import { ieltsLessonPacksAPI } from "../services/Ieltsservice";
import toast from "react-hot-toast";

export default function LessonPackDetails() {
  const { packId } = useParams();
  const navigate = useNavigate();
  const [lessonPack, setLessonPack] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [practiceExam, setPracticeExam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLessonPackDetails();
    fetchLessons();
    fetchPracticeExam();
  }, [packId]);

  const fetchLessonPackDetails = async () => {
    try {
      const data = await ieltsLessonPacksAPI.getById(packId);
      setLessonPack(data);
    } catch (error) {
      console.error("Error fetching lesson pack:", error);
      toast.error("فشل في تحميل تفاصيل Lesson Pack");
    }
  };

  const fetchLessons = async () => {
    try {
      setLoading(true);
      const data = await ieltsLessonPacksAPI.getLessons(packId);
      setLessons(data.lessons || []);
    } catch (error) {
      console.error("Error fetching lessons:", error);
      toast.error("فشل في تحميل الدروس");
    } finally {
      setLoading(false);
    }
  };

  const fetchPracticeExam = async () => {
    try {
      const data = await ieltsLessonPacksAPI.getPracticeExam(packId);
      setPracticeExam(data);
    } catch (error) {
      // Practice exam might not exist, that's ok
      console.log("No practice exam found");
    }
  };

  const handleDeleteLesson = async (lessonId, lessonTitle) => {
    if (!confirm(`هل أنت متأكد من حذف "${lessonTitle}"؟`)) return;

    try {
      const { ieltsLessonsAPI } = await import("../services/Ieltsservice");
      await ieltsLessonsAPI.delete(lessonId);
      toast.success("تم حذف الدرس بنجاح");
      fetchLessons();
    } catch (error) {
      console.error("Error deleting lesson:", error);
      toast.error("فشل في حذف الدرس");
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

  if (!lessonPack) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const color = getSkillColor(lessonPack.skill_type);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          to={`/dashboard/ielts/skills/${lessonPack.skill}`}
          className="btn-secondary flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>رجوع للمهارة</span>
        </Link>
        <Link
          to={`/dashboard/ielts/lesson-packs/${packId}/edit`}
          className="btn-secondary flex items-center gap-2"
        >
          <Edit className="w-4 h-4" />
          <span>تعديل Lesson Pack</span>
        </Link>
      </div>

      {/* Lesson Pack Info Card */}
      <div className="card overflow-hidden">
        <div
          className={`bg-gradient-to-r from-${color}-500 to-${color}-600 p-6 -m-6 mb-6`}
        >
          <div className="flex items-center gap-4">
            <div className="text-5xl">
              {getSkillIcon(lessonPack.skill_type)}
            </div>
            <div className="flex-1">
              <div className="text-sm text-white/80 mb-1">
                {lessonPack.skill_title}
              </div>
              <h1 className="text-2xl font-bold text-white mb-1">
                {lessonPack.title}
              </h1>
              <p className="text-white/90">{lessonPack.skill_type}</p>
            </div>
          </div>
        </div>

        {lessonPack.description && (
          <div className="mb-6">
            <h3 className="text-sm font-bold text-gray-900 mb-2">الوصف</h3>
            <p className="text-gray-600">{lessonPack.description}</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-5 h-5 text-primary-600" />
              <span className="text-xs font-bold text-gray-600">الدروس</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {lessonPack.lessons_count || 0}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-primary-600" />
              <span className="text-xs font-bold text-gray-600">
                وقت الامتحان
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {lessonPack.exam_time_limit} د
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-primary-600" />
              <span className="text-xs font-bold text-gray-600">
                نسبة النجاح
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {lessonPack.exam_passing_score}%
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-5 h-5 text-primary-600" />
              <span className="text-xs font-bold text-gray-600">الامتحان</span>
            </div>
            <p className="text-lg font-bold text-gray-900">
              {practiceExam ? (
                <span className="text-green-600">متاح</span>
              ) : (
                <span className="text-gray-400">غير متاح</span>
              )}
            </p>
          </div>
        </div>

        {/* Practice Exam Info */}
        {practiceExam && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-gray-900 mb-1">
                  {practiceExam.title}
                </h4>
                <p className="text-sm text-gray-600">
                  عدد الأسئلة: {practiceExam.questions_count || 0}
                </p>
              </div>
              <Link
                to={`/dashboard/ielts/practice-exams/${practiceExam.id}`}
                className="btn-secondary text-sm"
              >
                عرض الامتحان
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Lessons Section */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">الدروس</h2>
            <p className="text-sm text-gray-600">
              الدروس التابعة لهذه المجموعة
            </p>
          </div>
          <Link
            to={`/dashboard/ielts/lessons/create?lesson_pack_id=${packId}`}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة درس</span>
          </Link>
        </div>

        {/* Lessons List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : lessons.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              لا توجد دروس
            </h3>
            <p className="text-gray-600 mb-4">ابدأ بإضافة درس جديد</p>
            <Link
              to={`/dashboard/ielts/lessons/create?lesson_pack_id=${packId}`}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة درس</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {lessons.map((lesson, index) => (
              <div
                key={lesson.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 hover:shadow-md transition-all overflow-hidden"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-lg font-bold text-primary-600">
                        {index + 1}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-bold text-gray-900 break-words">
                          {lesson.title}
                        </h3>
                        <span
                          className={`px-2 py-1 text-xs font-bold rounded flex-shrink-0 ${
                            lesson.is_active
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {lesson.is_active ? "نشط" : "غير نشط"}
                        </span>
                      </div>

                      {lesson.description && (
                        <p className="text-sm text-gray-600 break-words">
                          {lesson.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Link
                      to={`/dashboard/ielts/lessons/${lesson.id}`}
                      className="btn-secondary text-sm"
                    >
                      التفاصيل
                    </Link>
                    <Link
                      to={`/dashboard/ielts/lessons/${lesson.id}/edit`}
                      className="btn-secondary"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() =>
                        handleDeleteLesson(lesson.id, lesson.title)
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
