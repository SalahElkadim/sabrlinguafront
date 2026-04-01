// src/pages/CreateLessonPack.jsx
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { ArrowLeft, Save, Package } from "lucide-react";
import { ieltsLessonPacksAPI, ieltsSkillsAPI } from "../../services/Ieltsservice";
import toast from "react-hot-toast";

export default function CreateLessonPack() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preSelectedSkillId = searchParams.get("skill_id");

  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState([]);
  const [loadingSkills, setLoadingSkills] = useState(true);

  const [formData, setFormData] = useState({
    skill: preSelectedSkillId || "",
    title: "",
    description: "",
    exam_time_limit: 30,
    exam_passing_score: 70,
    order: 0,
    is_active: true,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setLoadingSkills(true);
      const data = await ieltsSkillsAPI.getAll();
      setSkills(data.skills || []);
    } catch (error) {
      console.error("Error fetching skills:", error);
      toast.error("فشل في تحميل المهارات");
    } finally {
      setLoadingSkills(false);
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

    if (!formData.skill) {
      newErrors.skill = "المهارة مطلوبة";
    }

    if (!formData.title.trim()) {
      newErrors.title = "العنوان مطلوب";
    }

    if (formData.exam_time_limit < 1) {
      newErrors.exam_time_limit = "وقت الامتحان يجب أن يكون أكبر من صفر";
    }

    if (formData.exam_passing_score < 0 || formData.exam_passing_score > 100) {
      newErrors.exam_passing_score = "نسبة النجاح يجب أن تكون بين 0 و 100";
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
        skill: parseInt(formData.skill),
        title: formData.title,
        description: formData.description,
        exam_time_limit: parseInt(formData.exam_time_limit),
        exam_passing_score: parseInt(formData.exam_passing_score),
        order: parseInt(formData.order),
        is_active: formData.is_active,
      };

      const response = await ieltsLessonPacksAPI.create(submitData);
      toast.success(response.message || "تم إنشاء Lesson Pack بنجاح");

      // Redirect to lesson pack details or skill details
      if (response.lesson_pack?.id) {
        navigate(`/dashboard/ielts/lesson-packs/${response.lesson_pack.id}`);
      } else if (formData.skill) {
        navigate(`/dashboard/ielts/skills/${formData.skill}`);
      } else {
        navigate("/dashboard/ielts/skills");
      }
    } catch (error) {
      console.error("Error creating lesson pack:", error);

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
          toast.error(serverErrors.error || "فشل في إنشاء Lesson Pack");
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
            <Package className="w-8 h-8 text-primary-600" />
            <h1 className="text-2xl font-bold text-gray-900">
              إضافة Lesson Pack جديد
            </h1>
          </div>
          <p className="text-gray-600">أضف مجموعة دروس جديدة تحت المهارة</p>
        </div>
        <Link
          to={
            preSelectedSkillId
              ? `/dashboard/ielts/skills/${preSelectedSkillId}`
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
          {/* Skill Selection */}
          <div>
            <label
              htmlFor="skill"
              className="block text-sm font-bold text-gray-900 mb-2"
            >
              المهارة <span className="text-red-500">*</span>
            </label>
            {loadingSkills ? (
              <div className="input flex items-center gap-2 text-gray-500">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
                جاري التحميل...
              </div>
            ) : (
              <select
                id="skill"
                name="skill"
                value={formData.skill}
                onChange={handleChange}
                className={`input ${errors.skill ? "border-red-500" : ""}`}
              >
                <option value="">-- اختر المهارة --</option>
                {skills.map((skill) => (
                  <option key={skill.id} value={skill.id}>
                    {getSkillIcon(skill.skill_type)} {skill.title}
                  </option>
                ))}
              </select>
            )}
            {errors.skill && (
              <p className="text-red-500 text-sm mt-1">{errors.skill}</p>
            )}
          </div>

          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-bold text-gray-900 mb-2"
            >
              عنوان المجموعة <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`input ${errors.title ? "border-red-500" : ""}`}
              placeholder="مثال: Basic Reading Skills"
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
              وصف المجموعة
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="input"
              placeholder="وصف مجموعة الدروس وأهدافها..."
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Exam Settings */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              إعدادات الامتحان
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Time Limit */}
              <div>
                <label
                  htmlFor="exam_time_limit"
                  className="block text-sm font-bold text-gray-900 mb-2"
                >
                  وقت الامتحان (دقيقة) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="exam_time_limit"
                  name="exam_time_limit"
                  value={formData.exam_time_limit}
                  onChange={handleChange}
                  min="1"
                  className={`input ${
                    errors.exam_time_limit ? "border-red-500" : ""
                  }`}
                />
                {errors.exam_time_limit && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.exam_time_limit}
                  </p>
                )}
              </div>

              {/* Passing Score */}
              <div>
                <label
                  htmlFor="exam_passing_score"
                  className="block text-sm font-bold text-gray-900 mb-2"
                >
                  نسبة النجاح (%) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="exam_passing_score"
                  name="exam_passing_score"
                  value={formData.exam_passing_score}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  className={`input ${
                    errors.exam_passing_score ? "border-red-500" : ""
                  }`}
                />
                {errors.exam_passing_score && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.exam_passing_score}
                  </p>
                )}
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
                <span className="text-sm font-bold text-gray-900">
                  Lesson Pack نشط
                </span>
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
                  <span>حفظ Lesson Pack</span>
                </>
              )}
            </button>
            <Link
              to={
                preSelectedSkillId
                  ? `/dashboard/ielts/skills/${preSelectedSkillId}`
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
