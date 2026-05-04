// src/pages/general/AddReadingToGeneral.jsx
import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowRight, Save, BookOpen } from "lucide-react";
import { generalQuestionsAPI } from "../../services/generalService";

export default function AddReadingPassageToGeneral() {
  const { skillId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    title: "",
    passage_text: "",
    source: "",
    difficulty: "MEDIUM",
    is_active: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      const res = await generalQuestionsAPI.createReadingPassage({
        ...form,
        general_skill: skillId, // ← general_skill مش ielts_skill
      });
      navigate(
        `/dashboard/general/skills/${skillId}/add/reading/passage/${res.passage.id}/questions`
      );
    } catch (err) {
      setErrors(err.response?.data || { general: "حدث خطأ، حاول مرة أخرى" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          to={`/dashboard/general/skills/${skillId}`}
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
        >
          <ArrowRight className="w-5 h-5" />
        </Link>
        <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-orange-700" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إضافة قطعة قراءة</h1>
          <p className="text-gray-500 text-sm">
            أضف قطعة ثم ستنتقل لإضافة أسئلتها
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5"
      >
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
            عنوان القطعة <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            placeholder="مثال: Climate Change and Its Effects"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500 text-right"
          />
          {errors.title && (
            <p className="text-red-500 text-xs mt-1 text-right">
              {errors.title}
            </p>
          )}
        </div>

        {/* Passage Text */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
            نص القطعة <span className="text-red-500">*</span>
          </label>
          <textarea
            name="passage_text"
            value={form.passage_text}
            onChange={handleChange}
            required
            rows={8}
            placeholder="أدخل نص القطعة الكاملة هنا..."
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500 text-right resize-none leading-relaxed"
          />
          {errors.passage_text && (
            <p className="text-red-500 text-xs mt-1 text-right">
              {errors.passage_text}
            </p>
          )}
        </div>

        {/* Source */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
            المصدر (اختياري)
          </label>
          <input
            type="text"
            name="source"
            value={form.source}
            onChange={handleChange}
            placeholder="مثال: National Geographic, 2023"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500 text-right"
          />
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
            مستوى الصعوبة
          </label>
          <select
            name="difficulty"
            value={form.difficulty}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500 text-right bg-white"
          >
            <option value="EASY">سهل</option>
            <option value="MEDIUM">متوسط</option>
            <option value="HARD">صعب</option>
          </select>
        </div>

        {/* Active */}
        <div className="flex items-center justify-end gap-3">
          <label
            htmlFor="is_active"
            className="text-sm font-medium text-gray-700"
          >
            نشط
          </label>
          <input
            type="checkbox"
            name="is_active"
            id="is_active"
            checked={form.is_active}
            onChange={handleChange}
            className="w-4 h-4 text-orange-600"
          />
        </div>

        {errors.general && (
          <p className="text-red-500 text-sm bg-red-50 p-3 rounded-xl text-right">
            {errors.general}
          </p>
        )}

        <div className="bg-orange-50 rounded-xl p-3 text-sm text-orange-700 text-right">
          💡 بعد حفظ القطعة ستنتقل تلقائياً لإضافة أسئلة عليها
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Link
            to={`/dashboard/general/skills/${skillId}`}
            className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 font-medium text-center"
          >
            إلغاء
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-2.5 bg-orange-600 text-white rounded-xl hover:bg-orange-700 font-medium flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            {loading ? "جاري الحفظ..." : "حفظ القطعة والمتابعة"}
          </button>
        </div>
      </form>
    </div>
  );
}
