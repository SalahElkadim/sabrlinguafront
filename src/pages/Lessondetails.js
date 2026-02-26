// src/pages/LessonDetails.js
import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Edit,
  Trash2,
  AlertCircle,
  Loader2,
  BookOpen,
  Headphones,
  Mic,
  PenTool,
  FileText,
  Plus,
  CheckCircle,
  Image as ImageIcon,
  Video,
  Music,
  Eye,
  Clock,
} from "lucide-react";
import { useLevelsStore } from "../store/levelsStore";

export default function LessonDetails() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { loading, error, clearError } = useLevelsStore();
  const [lesson, setLesson] = useState(null);
  const [content, setContent] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchLessonDetails();
  }, [lessonId]);

  const fetchLessonDetails = async () => {
    try {
      clearError();
      // Fetch lesson basic info
      const lessonResponse = await fetch(
        `/levels/lessons/${lessonId}/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      if (!lessonResponse.ok) throw new Error("فشل تحميل بيانات الدرس");

      const lessonData = await lessonResponse.json();
      setLesson(lessonData);

      // Fetch lesson content based on type
      if (lessonData.has_content) {
        const contentType = lessonData.lesson_type.toLowerCase();
        const contentResponse = await fetch(
          `https://sabrlinguaa-production.up.railway.app/levels/lesson-content/${contentType}/${lessonId}/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );

        if (contentResponse.ok) {
          const contentData = await contentResponse.json();
          setContent(contentData);
        }
      }
    } catch (err) {
      console.error("Error fetching lesson:", err);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `https://sabrlinguaa-production.up.railway.app/levels/lessons/${lessonId}/delete/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      if (!response.ok) throw new Error("فشل حذف الدرس");

      navigate("/dashboard/lessons");
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const lessonTypeConfig = {
    READING: {
      label: "قراءة",
      icon: BookOpen,
      color: "blue",
      bgClass: "bg-blue-100",
      textClass: "text-blue-700",
      borderClass: "border-blue-300",
    },
    LISTENING: {
      label: "استماع",
      icon: Headphones,
      color: "purple",
      bgClass: "bg-purple-100",
      textClass: "text-purple-700",
      borderClass: "border-purple-300",
    },
    SPEAKING: {
      label: "تحدث",
      icon: Mic,
      color: "green",
      bgClass: "bg-green-100",
      textClass: "text-green-700",
      borderClass: "border-green-300",
    },
    WRITING: {
      label: "كتابة",
      icon: PenTool,
      color: "orange",
      bgClass: "bg-orange-100",
      textClass: "text-orange-700",
      borderClass: "border-orange-300",
    },
  };

  if (loading || !lesson) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  const typeConfig = lessonTypeConfig[lesson.lesson_type];
  const TypeIcon = typeConfig?.icon || FileText;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/dashboard/lessons"
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowRight className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">تفاصيل الدرس</h1>
            <p className="text-gray-600 mt-1">{lesson.title}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Link
            to={`/dashboard/lessons/${lessonId}/edit`}
            className="btn btn-secondary"
          >
            <Edit className="w-5 h-5 ml-2" />
            تعديل
          </Link>
          <button
            onClick={() => setDeleteConfirm(true)}
            className="btn bg-red-600 hover:bg-red-700 text-white"
          >
            <Trash2 className="w-5 h-5 ml-2" />
            حذف
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Main Info Card */}
      <div className="card">
        <div className="flex items-start gap-4">
          <div
            className={`w-16 h-16 rounded-xl flex items-center justify-center ${typeConfig.bgClass}`}
          >
            <TypeIcon className={`w-8 h-8 ${typeConfig.textClass}`} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-xl font-bold text-gray-900">
                {lesson.title}
              </h2>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${typeConfig.bgClass} ${typeConfig.textClass}`}
              >
                {typeConfig.label}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                الترتيب: {lesson.order}
              </span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  lesson.is_active
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {lesson.is_active ? "نشط" : "غير نشط"}
              </span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  lesson.has_content
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {lesson.has_content ? "المحتوى متوفر" : "بحاجة لمحتوى"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Unit Info */}
      {lesson.unit_details && (
        <div className="card">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            معلومات الوحدة
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">عنوان الوحدة</p>
              <p className="font-medium text-gray-900">
                {lesson.unit_details.title}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">ترتيب الوحدة</p>
              <p className="font-medium text-gray-900">
                {lesson.unit_details.order}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Content Section */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          {!lesson.has_content && (
            <Link
              to={`/dashboard/lessons/${lessonId}/content/add`}
              className="btn btn-primary btn-sm"
            >
              <Plus className="w-4 h-4 ml-2" />
              إضافة محتوى
            </Link>
          )}
        </div>

        {!lesson.has_content ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              لم يتم إضافة المحتوى بعد
            </h4>
            <p className="text-gray-600 mb-6">
              قم بإضافة محتوى الدرس المناسب لنوع الدرس
            </p>
            <Link
              to={`/dashboard/lessons/${lessonId}/content/add`}
              className="btn btn-primary"
            >
              <Plus className="w-5 h-5 ml-2" />
              إضافة محتوى الآن
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Reading Content */}
            {lesson.lesson_type === "READING" && content && (
              <>
                {content.passage_details && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <BookOpen className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-bold text-blue-900 mb-2">
                          {content.passage_details.title}
                        </h4>
                        {content.passage_details.passage_image && (
                          <div className="mb-3">
                            <img
                              src={content.passage_details.passage_image}
                              alt={content.passage_details.title}
                              className="w-full max-w-md rounded-lg"
                            />
                          </div>
                        )}
                        <p className="text-sm text-blue-800 whitespace-pre-wrap">
                          {content.passage_details.passage_text}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-blue-700">
                      <CheckCircle className="w-4 h-4" />
                      <span>
                        {content.passage_details.questions_count} سؤال متاح
                      </span>
                    </div>
                  </div>
                )}

                {content.vocabulary_words &&
                  content.vocabulary_words.length > 0 && (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <h4 className="font-bold text-purple-900 mb-3">
                        المفردات ({content.vocabulary_words.length})
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        {content.vocabulary_words.map((word, index) => (
                          <div
                            key={index}
                            className="bg-white p-2 rounded border border-purple-200"
                          >
                            <p className="font-medium text-gray-900">
                              {word.english_word}
                            </p>
                            <p className="text-sm text-gray-600">
                              {word.translate}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {content.explanation && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="font-bold text-gray-900 mb-2">شرح الدرس</h4>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {content.explanation}
                    </p>
                  </div>
                )}
              </>
            )}

            {/* Listening Content */}
            {lesson.lesson_type === "LISTENING" && content && (
              <>
                {content.audio_details && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <Music className="w-5 h-5 text-purple-600 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-bold text-purple-900 mb-2">
                          {content.audio_details.title}
                        </h4>
                        {content.audio_details.audio_file && (
                          <audio
                            controls
                            className="w-full mb-3"
                            src={content.audio_details.audio_file}
                          >
                            المتصفح لا يدعم تشغيل الملفات الصوتية
                          </audio>
                        )}
                        {content.audio_details.transcript && (
                          <div className="bg-white p-3 rounded border border-purple-200">
                            <p className="text-xs text-purple-600 mb-1">النص</p>
                            <p className="text-sm text-gray-700">
                              {content.audio_details.transcript}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-purple-700">
                      {content.audio_details.duration && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {content.audio_details.duration} ثانية
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        {content.audio_details.questions_count} سؤال
                      </span>
                    </div>
                  </div>
                )}

                {content.explanation && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="font-bold text-gray-900 mb-2">شرح الدرس</h4>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {content.explanation}
                    </p>
                  </div>
                )}
              </>
            )}

            {/* Speaking Content */}
            {lesson.lesson_type === "SPEAKING" && content && (
              <>
                {content.video_details && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <Video className="w-5 h-5 text-green-600 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-bold text-green-900 mb-2">
                          {content.video_details.title}
                        </h4>
                        {content.video_details.description && (
                          <p className="text-sm text-green-700 mb-3">
                            {content.video_details.description}
                          </p>
                        )}
                        {content.video_details.video_file && (
                          <video
                            controls
                            className="w-full rounded-lg mb-3"
                            poster={content.video_details.thumbnail}
                            src={content.video_details.video_file}
                          >
                            المتصفح لا يدعم تشغيل الفيديو
                          </video>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-green-700">
                      {content.video_details.duration && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {content.video_details.duration} ثانية
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        {content.video_details.questions_count} سؤال
                      </span>
                    </div>
                  </div>
                )}

                {content.explanation && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="font-bold text-gray-900 mb-2">شرح الدرس</h4>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {content.explanation}
                    </p>
                  </div>
                )}
              </>
            )}

            {/* Writing Content */}
            {lesson.lesson_type === "WRITING" && content && (
              <div className="space-y-4">
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h4 className="font-bold text-orange-900 mb-2">
                    {content.title}
                  </h4>
                  {content.writing_passage && (
                    <div className="bg-white p-3 rounded border border-orange-200 mb-3">
                      <p className="text-xs text-orange-600 mb-1">
                        القطعة النموذجية
                      </p>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {content.writing_passage}
                      </p>
                    </div>
                  )}
                  {content.instructions && (
                    <div className="bg-white p-3 rounded border border-orange-200 mb-3">
                      <p className="text-xs text-orange-600 mb-1">التعليمات</p>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {content.instructions}
                      </p>
                    </div>
                  )}
                  {content.sample_answer && (
                    <div className="bg-white p-3 rounded border border-orange-200">
                      <p className="text-xs text-orange-600 mb-1">
                        نموذج الإجابة
                      </p>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {content.sample_answer}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">تأكيد الحذف</h3>
                <p className="text-sm text-gray-600">هل أنت متأكد؟</p>
              </div>
            </div>
            <p className="text-gray-600 mb-6">
              سيتم حذف الدرس "{lesson.title}" وجميع المحتوى المرتبط به نهائياً.
              هذا الإجراء لا يمكن التراجع عنه.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 btn bg-red-600 hover:bg-red-700 text-white"
              >
                {loading ? "جاري الحذف..." : "تأكيد الحذف"}
              </button>
              <button
                onClick={() => setDeleteConfirm(false)}
                disabled={loading}
                className="flex-1 btn btn-secondary"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
