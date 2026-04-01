// src/pages/EditSTEPSkill.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowRight, Save } from "lucide-react";
import { stepSkillsAPI } from "../services/stepService";

const SKILL_TYPES = [
  { value: "VOCABULARY", label: "Vocabulary" },
  { value: "GRAMMAR", label: "Grammar" },
  { value: "READING", label: "Reading" },
  { value: "WRITING", label: "Writing" },
];

export default function EditSTEPSkill() {
  const { skillId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [iconFile, setIconFile] = useState(null);
  const [form, setForm] = useState({
    skill_type: "",
    title: "",
    description: "",
    order: 0,
    is_active: true,
  });

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await stepSkillsAPI.getById(skillId);
        setForm({
          skill_type: data.skill_type || "",
          title: data.title || "",
          description: data.description || "",
          order: data.order || 0,
          is_active: data.is_active ?? true,
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [skillId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      if (iconFile) formData.append("icon", iconFile);
      await stepSkillsAPI.update(skillId, formData);
      navigate("/dashboard/step/skills");
    } catch (err) {
      setErrors(err.response?.data || { general: "حدث خطأ، حاول مرة أخرى" });
    } finally {
      setSaving(false);
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
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          to="/dashboard/step/skills"
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
        >
          <ArrowRight className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">تعديل مهارة STEP</h1>
          <p className="text-gray-500 text-sm">تحديث بيانات المهارة</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-5">
        {/* Skill Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            نوع المهارة
          </label>
          <select
            name="skill_type"
            value={form.skill_type}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {SKILL_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            العنوان <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.title && (
            <p className="text-red-500 text-xs mt-1">{errors.title}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            الوصف
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {/* Icon */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            تغيير الأيقونة (اختياري)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setIconFile(e.target.files[0])}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>

        {/* Order */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            الترتيب
          </label>
          <input
            type="number"
            name="order"
            value={form.order}
            onChange={handleChange}
            min={0}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Active */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="is_active"
            id="is_active"
            checked={form.is_active}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600"
          />
          <label
            htmlFor="is_active"
            className="text-sm font-medium text-gray-700"
          >
            نشط
          </label>
        </div>

        {errors.general && (
          <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
            {errors.general}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-lg font-medium transition-colors"
        >
          <Save className="w-5 h-5" />
          {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
        </button>
      </form>
    </div>
  );
}
