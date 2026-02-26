// src/pages/CreateIELTSLesson.jsx
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { ArrowLeft, Save, BookOpen } from "lucide-react";
import { ieltsLessonsAPI, ieltsLessonPacksAPI } from "../services/Ieltsservice";
import toast from "react-hot-toast";

export default function CreateIELTSLesson() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preSelectedLessonPackId = searchParams.get("lesson_pack_id");

  const [loading, setLoading] = useState(false);
  const [lessonPacks, setLessonPacks] = useState([]);
  const [loadingLessonPacks, setLoadingLessonPacks] = useState(true);

  const [formData, setFormData] = useState({
    lesson_pack: preSelectedLessonPackId || "",
    title: "",
    description: "",
    order: 0,
    is_active: true,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchLessonPacks();
  }, []);

  const fetchLessonPacks = async () => {
    try {
      setLoadingLessonPacks(true);
      const data = await ieltsLessonPacksAPI.getAll();
      setLessonPacks(data.lesson_packs || []);
    } catch (error) {
      console.error("Error fetching lesson packs:", error);
      toast.error("فشل في تحميل Lesson Packs");
    } finally {
      setLoadingLessonPacks(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.lesson_pack) {
      newErrors.lesson_pack = "Lesson Pack مطلوب";
    }

    if (!formData.title.trim()) {
      newErrors.title = "العنوان مطلوب";
    }

    if (formData.order < 0) {
      newErrors.order = "الترتيب يجب أن يكون رقم موجب";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("يرجى تصحيح الأخطاء في النموذج");
      return;
    }

    try {
      setLoading(true);

      const submitData = {
        lesson_pack: parseInt(formData.lesson_pack),
        title: formData.title,
        description: formData.description,
        order: parseInt(formData.order),
        is_active: formData.is_active,
      };

      const response = await ieltsLessonsAPI.create(submitData);
      toast.success(response.message || "تم إنشاء الدرس بنجاح");

      // Redirect to lesson details or lesson pack details
      if (response.lesson?.id) {
        navigate(`/dashboard/ielts/lessons/${response.lesson.id}`);
      } else if (formData.lesson_pack) {
        navigate(`/dashboard/ielts/lesson-packs/${formData.lesson_pack}`);
      } else {
        navigate("/dashboard/ielts/skills");
      }
    } catch (error) {
      console.error("Error creating lesson:", error);

      if (error.response?.status === 403) {
        toast.error("عذراً، أنت لست مسؤولاً. هذه العملية متاحة للمسؤولين فقط");
        return;
      }

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

  const getSkillIcon = (skillType) => {
    const icons = {
      READING: "📖",
      WRITING: "✍️",
      SPEAKING: "🗣️",
      LISTENING: "👂",
    };
    return icons[skillType] || "📚";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-8 h-8 text-primary-600" />
            <h1 className="text-2xl font-bold text-gray-900">إضافة درس جديد</h1>
          </div>
          <p className="text-gray-600">أضف درساً جديداً تحت Lesson Pack</p>
        </div>
        <Link
          to={
            preSelectedLessonPackId
              ? `/dashboard/ielts/lesson-packs/${preSelectedLessonPackId}`
              : "/dashboard/ielts/skills"
          }
          className="btn-secondary flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>رجوع</span>
        </Link>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="card">
        <div className="space-y-6">
          {/* Lesson Pack Selection */}
          <div>
            <label
              htmlFor="lesson_pack"
              className="block text-sm font-bold text-gray-900 mb-2"
            >
              Lesson Pack <span className="text-red-500">*</span>
            </label>
            {loadingLessonPacks ? (
              <div className="input flex items-center gap-2 text-gray-500">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
                جاري التحميل...
              </div>
            ) : (
              <select
                id="lesson_pack"
                name="lesson_pack"
                value={formData.lesson_pack}
                onChange={handleChange}
                className={`input ${
                  errors.lesson_pack ? "border-red-500" : ""
                }`}
              >
                <option value="">-- اختر Lesson Pack --</option>
                {lessonPacks.map((pack) => (
                  <option key={pack.id} value={pack.id}>
                    {getSkillIcon(pack.skill_type)} {pack.title}
                  </option>
                ))}
              </select>
            )}
            {errors.lesson_pack && (
              <p className="text-red-500 text-sm mt-1">{errors.lesson_pack}</p>
            )}
          </div>

          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-bold text-gray-900 mb-2"
            >
              عنوان الدرس <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`input ${errors.title ? "border-red-500" : ""}`}
              placeholder="مثال: Introduction to Reading Comprehension"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-bold text-gray-900 mb-2"
            >
              وصف الدرس
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="input"
              placeholder="وصف تفصيلي للدرس وأهدافه..."
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-2xl">💡</div>
              <div>
                <h4 className="font-bold text-blue-900 mb-1">ملاحظة هامة</h4>
                <p className="text-sm text-blue-800">
                  بعد إنشاء الدرس، ستحتاج إلى إضافة المحتوى الخاص به (نصوص،
                  فيديوهات، تمارين) حسب نوع المهارة (Reading, Writing, Speaking,
                  Listening).
                </p>
              </div>
            </div>
          </div>

          {/* Order and Active */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="order"
                className="block text-sm font-bold text-gray-900 mb-2"
              >
                الترتيب
              </label>
              <input
                type="number"
                id="order"
                name="order"
                value={formData.order}
                onChange={handleChange}
                min="0"
                className={`input ${errors.order ? "border-red-500" : ""}`}
              />
              <p className="text-xs text-gray-500 mt-1">
                ترتيب الدرس داخل Lesson Pack (0 = الأول)
              </p>
              {errors.order && (
                <p className="text-red-500 text-sm mt-1">{errors.order}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                الحالة
              </label>
              <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="w-5 h-5 text-primary-600 rounded"
                />
                <div>
                  <span className="text-sm font-bold text-gray-900 block">
                    الدرس نشط
                  </span>
                  <span className="text-xs text-gray-500">
                    يظهر للطلاب في التطبيق
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center gap-3 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>جاري الحفظ...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>حفظ الدرس</span>
                </>
              )}
            </button>
            <Link
              to={
                preSelectedLessonPackId
                  ? `/dashboard/ielts/lesson-packs/${preSelectedLessonPackId}`
                  : "/dashboard/ielts/skills"
              }
              className="btn-secondary"
            >
              إلغاء
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
