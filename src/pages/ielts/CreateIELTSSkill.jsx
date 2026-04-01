// src/pages/CreateIELTSSkill.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save, BookOpen, Upload, X } from "lucide-react";
import { ieltsSkillsAPI } from "../services/Ieltsservice";
import toast from "react-hot-toast";

export default function CreateIELTSSkill() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [iconPreview, setIconPreview] = useState(null);

  const [formData, setFormData] = useState({
    skill_type: "",
    title: "",
    description: "",
    order: 0,
    is_active: true,
    icon: null,
  });

  const [errors, setErrors] = useState({});

  const skillTypes = [
    { value: "READING", label: "Reading", icon: "📖", color: "blue" },
    { value: "WRITING", label: "Writing", icon: "✍️", color: "purple" },
    { value: "SPEAKING", label: "Speaking", icon: "🗣️", color: "green" },
    { value: "LISTENING", label: "Listening", icon: "👂", color: "orange" },
  ];

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

  const handleIconChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("يرجى اختيار صورة صالحة");
        return;
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error("حجم الصورة يجب أن يكون أقل من 2 ميجابايت");
        return;
      }

      setFormData((prev) => ({ ...prev, icon: file }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setIconPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeIcon = () => {
    setFormData((prev) => ({ ...prev, icon: null }));
    setIconPreview(null);
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.skill_type) {
      newErrors.skill_type = "نوع المهارة مطلوب";
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

      // Prepare form data
      const submitData = new FormData();
      submitData.append("skill_type", formData.skill_type);
      submitData.append("title", formData.title);
      submitData.append("description", formData.description);
      submitData.append("order", formData.order);
      submitData.append("is_active", formData.is_active);

      if (formData.icon) {
        submitData.append("icon", formData.icon);
      }

      const response = await ieltsSkillsAPI.create(submitData);
      toast.success(response.message || "تم إنشاء المهارة بنجاح");
      navigate("/dashboard/ielts/skills");
    } catch (error) {
      console.error("Error creating skill:", error);
      if (error.response?.data) {
        const serverErrors = error.response.data;
        setErrors(serverErrors);
        toast.error("فشل في إنشاء المهارة");
      } else {
        toast.error("حدث خطأ في الاتصال بالخادم");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-8 h-8 text-primary-600" />
            <h1 className="text-2xl font-bold text-gray-900">
              إضافة مهارة جديدة
            </h1>
          </div>
          <p className="text-gray-600">
            أضف مهارة من المهارات الأربعة الأساسية
          </p>
        </div>
        <Link
          to="/dashboard/ielts/skills"
          className="btn-secondary flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>رجوع</span>
        </Link>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="card">
        <div className="space-y-6">
          {/* Skill Type Selection */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-3">
              نوع المهارة <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {skillTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() =>
                    handleChange({
                      target: { name: "skill_type", value: type.value },
                    })
                  }
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.skill_type === type.value
                      ? `border-${type.color}-500 bg-${type.color}-50`
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="text-4xl mb-2">{type.icon}</div>
                  <div className="text-sm font-bold text-gray-900">
                    {type.label}
                  </div>
                </button>
              ))}
            </div>
            {errors.skill_type && (
              <p className="text-red-500 text-sm mt-2">{errors.skill_type}</p>
            )}
          </div>

          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-bold text-gray-900 mb-2"
            >
              العنوان <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`input ${errors.title ? "border-red-500" : ""}`}
              placeholder="مثال: Reading Skills"
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
              الوصف
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="input"
              placeholder="وصف المهارة وأهدافها..."
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Icon Upload */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              أيقونة المهارة
            </label>
            {!iconPreview ? (
              <div className="flex items-center gap-4">
                <label
                  htmlFor="icon"
                  className="btn-secondary flex items-center gap-2 cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>رفع صورة</span>
                </label>
                <input
                  type="file"
                  id="icon"
                  accept="image/*"
                  onChange={handleIconChange}
                  className="hidden"
                />
                <p className="text-sm text-gray-600">
                  PNG, JPG, GIF (حد أقصى 2MB)
                </p>
              </div>
            ) : (
              <div className="relative inline-block">
                <img
                  src={iconPreview}
                  alt="Icon preview"
                  className="w-32 h-32 rounded-lg object-cover border-2 border-gray-200"
                />
                <button
                  type="button"
                  onClick={removeIcon}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            {errors.icon && (
              <p className="text-red-500 text-sm mt-1">{errors.icon}</p>
            )}
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
                  المهارة نشطة
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
                  <span>حفظ المهارة</span>
                </>
              )}
            </button>
            <Link to="/dashboard/ielts/skills" className="btn-secondary">
              إلغاء
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
