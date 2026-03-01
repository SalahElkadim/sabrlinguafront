// src/pages/CreateIELTSLesson.jsx
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  BookOpen,
  Headphones,
  Video,
  PenLine,
  ChevronRight,
  Layers,
} from "lucide-react";
import { ieltsLessonsAPI, ieltsLessonPacksAPI } from "../services/Ieltsservice";
import toast from "react-hot-toast";

const SKILL_CONFIG = {
  READING: {
    emoji: "📖",
    label: "قراءة",
    color: "blue",
    icon: BookOpen,
    contentPath: (lessonId) =>
      `/dashboard/ielts/lessons/${lessonId}/content/add/reading`,
  },
  WRITING: {
    emoji: "✍️",
    label: "كتابة",
    color: "purple",
    icon: PenLine,
    contentPath: (lessonId) =>
      `/dashboard/ielts/lessons/${lessonId}/content/add/writing`,
  },
  SPEAKING: {
    emoji: "🗣️",
    label: "تحدث",
    color: "green",
    icon: Video,
    contentPath: (lessonId) =>
      `/dashboard/ielts/lessons/${lessonId}/content/add/speaking`,
  },
  LISTENING: {
    emoji: "👂",
    label: "استماع",
    color: "orange",
    icon: Headphones,
    contentPath: (lessonId) =>
      `/dashboard/ielts/lessons/${lessonId}/content/add/listening`,
  },
};

const SKILL_ICON_COLORS = {
  READING: "bg-blue-100",
  WRITING: "bg-purple-100",
  SPEAKING: "bg-green-100",
  LISTENING: "bg-orange-100",
};

const SKILL_TEXT_COLORS = {
  READING: "text-blue-600",
  WRITING: "text-purple-600",
  SPEAKING: "text-green-600",
  LISTENING: "text-orange-600",
};

export default function CreateIELTSLesson() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedPackId = searchParams.get("lesson_pack_id");

  const [loading, setLoading] = useState(false);
  const [lessonPacks, setLessonPacks] = useState([]);
  const [packsLoading, setPacksLoading] = useState(true);
  const [selectedPack, setSelectedPack] = useState(null);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    lesson_pack: preselectedPackId || "",
    title: "",
    description: "",
    order: 1,
    is_active: true,
  });

  useEffect(() => {
    const fetchPacks = async () => {
      try {
        setPacksLoading(true);
        const data = await ieltsLessonPacksAPI.getAll();
        const packs =
          data.lesson_packs ||
          data.results ||
          (Array.isArray(data) ? data : []);
        setLessonPacks(packs);
      } catch {
        toast.error("فشل في تحميل Lesson Packs");
      } finally {
        setPacksLoading(false);
      }
    };
    fetchPacks();
  }, []);

  useEffect(() => {
    if (preselectedPackId && lessonPacks.length > 0) {
      const pack = lessonPacks.find(
        (p) => String(p.id) === String(preselectedPackId)
      );
      if (pack) setSelectedPack(pack);
    }
  }, [preselectedPackId, lessonPacks]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));

    if (name === "lesson_pack") {
      const pack = lessonPacks.find((p) => String(p.id) === String(value));
      setSelectedPack(pack || null);
    }

    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.lesson_pack) newErrors.lesson_pack = "Lesson Pack مطلوب";
    if (!formData.title.trim()) newErrors.title = "عنوان الدرس مطلوب";
    if (formData.order < 1) newErrors.order = "الترتيب يجب أن يكون 1 أو أكثر";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await ieltsLessonsAPI.create({
        lesson_pack: parseInt(formData.lesson_pack),
        title: formData.title,
        description: formData.description,
        order: parseInt(formData.order),
        is_active: formData.is_active,
      });

      const lessonId = response.lesson?.id || response.id;
      const skillType = selectedPack?.skill_type;
      const config = SKILL_CONFIG[skillType];

      toast.success("تم إنشاء الدرس! أضف المحتوى الآن 📝");

      if (lessonId && config) {
        navigate(config.contentPath(lessonId));
      } else if (lessonId) {
        navigate(`/dashboard/ielts/lessons/${lessonId}`);
      } else {
        navigate(`/dashboard/ielts/lesson-packs/${formData.lesson_pack}`);
      }
    } catch (error) {
      if (error.response?.data) {
        const serverErrors = error.response.data;
        if (typeof serverErrors === "object" && !serverErrors.error) {
          setErrors(serverErrors);
          toast.error("يرجى تصحيح الأخطاء في النموذج");
        } else {
          toast.error(serverErrors.error || "فشل في إنشاء الدرس");
        }
      } else {
        toast.error("حدث خطأ في الاتصال بالخادم");
      }
    } finally {
      setLoading(false);
    }
  };

  const skillConfig = selectedPack
    ? SKILL_CONFIG[selectedPack.skill_type]
    : null;
  const skillType = selectedPack?.skill_type;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* ===== Header ===== */}
      <div className="flex items-center gap-4">
        <Link
          to={
            preselectedPackId
              ? `/dashboard/ielts/lesson-packs/${preselectedPackId}`
              : "/dashboard/ielts/skills"
          }
          className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              skillType ? SKILL_ICON_COLORS[skillType] : "bg-gray-100"
            }`}
          >
            {skillConfig ? (
              <span className="text-2xl">{skillConfig.emoji}</span>
            ) : (
              <Layers className="w-6 h-6 text-gray-500" />
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">إضافة درس جديد</h1>
            <p className="text-gray-500 text-sm mt-0.5">
              {skillConfig
                ? `مهارة ${skillConfig.label}`
                : "اختر Lesson Pack أولاً"}
            </p>
          </div>
        </div>
      </div>

      {/* ===== Steps Indicator ===== */}
      {selectedPack && (
        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex items-center gap-2 text-sm font-medium text-primary-600">
            <span className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
              1
            </span>
            <span>معلومات الدرس</span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span className="w-6 h-6 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center text-xs font-bold">
              2
            </span>
            <span>إضافة محتوى {skillConfig?.label}</span>
          </div>
        </div>
      )}

      {/* ===== Form ===== */}
      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Lesson Pack */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lesson Pack <span className="text-red-500">*</span>
            </label>
            {packsLoading ? (
              <div className="input flex items-center gap-2 text-gray-400">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-primary-600 rounded-full animate-spin" />
                جاري التحميل...
              </div>
            ) : (
              <select
                name="lesson_pack"
                value={formData.lesson_pack}
                onChange={handleChange}
                className={`input ${
                  errors.lesson_pack ? "border-red-500" : ""
                }`}
              >
                <option value="">— اختر Lesson Pack —</option>
                {lessonPacks.map((pack) => (
                  <option key={pack.id} value={pack.id}>
                    {SKILL_CONFIG[pack.skill_type]?.emoji} {pack.title} (
                    {pack.skill_type})
                  </option>
                ))}
              </select>
            )}
            {errors.lesson_pack && (
              <p className="text-red-500 text-xs mt-1">{errors.lesson_pack}</p>
            )}

            {selectedPack && skillConfig && (
              <div className="mt-2 flex items-center gap-2 p-2 bg-gray-50 border border-gray-200 rounded-lg">
                <span className="text-lg">{skillConfig.emoji}</span>
                <div>
                  <p className="text-xs font-bold text-gray-700">
                    {selectedPack.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    مهارة {skillConfig.label} — بعد الإنشاء ستنتقل لإضافة
                    المحتوى
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              عنوان الدرس <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`input ${errors.title ? "border-red-500" : ""}`}
              placeholder="مثال: Reading Comprehension - Academic Texts"
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              وصف الدرس{" "}
              <span className="text-gray-400 font-normal">(اختياري)</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="input resize-none"
              placeholder="وصف مختصر للدرس وأهدافه..."
            />
          </div>

          {/* Order + Active */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الترتيب
              </label>
              <input
                type="number"
                name="order"
                value={formData.order}
                onChange={handleChange}
                min="1"
                className={`input ${errors.order ? "border-red-500" : ""}`}
              />
              {errors.order && (
                <p className="text-red-500 text-xs mt-1">{errors.order}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الحالة
              </label>
              <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer border border-gray-200 hover:border-primary-300 transition-colors">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary-600 rounded"
                />
                <div>
                  <span className="text-sm font-medium text-gray-900 block">
                    {formData.is_active ? "نشط" : "غير نشط"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formData.is_active ? "يظهر للطلاب" : "مخفي عن الطلاب"}
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Next Step Notice */}
          {selectedPack && skillConfig && (
            <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <span className="text-lg flex-shrink-0">💡</span>
              <p className="text-sm text-amber-800">
                بعد حفظ الدرس، ستنتقل تلقائياً لإضافة{" "}
                <strong>محتوى {skillConfig.label}</strong> (
                {skillType === "READING" && "النص + الأسئلة"}
                {skillType === "LISTENING" && "الصوت + الأسئلة"}
                {skillType === "SPEAKING" && "الفيديو + الأسئلة"}
                {skillType === "WRITING" && "تعليمات الكتابة"}).
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2 border-t border-gray-100">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>جاري الحفظ...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>حفظ والمتابعة</span>
                </>
              )}
            </button>
            <Link
              to={
                preselectedPackId
                  ? `/dashboard/ielts/lesson-packs/${preselectedPackId}`
                  : "/dashboard/ielts/skills"
              }
              className="btn btn-secondary px-8 py-3"
            >
              إلغاء
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
