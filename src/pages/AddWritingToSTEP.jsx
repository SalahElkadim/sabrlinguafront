// src/pages/AddWritingToSTEP.jsx
import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowRight, Save } from "lucide-react";
import { stepQuestionsAPI } from "../services/stepService";

export default function AddWritingToSTEP() {
  const { skillId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    title: "",
    question_text: "",
    min_words: 150,
    max_words: 300,
    sample_answer: "",
    rubric: "",
    points: 10,
    pass_threshold: 60,
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
      await stepQuestionsAPI.createWriting({ ...form, step_skill: skillId });
      navigate(`/dashboard/step/skills/${skillId}`);
    } catch (err) {
      setErrors(err.response?.data || { general: "حدث خطأ، حاول مرة أخرى" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          to={`/dashboard/step/skills/${skillId}`}
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
        >
          <ArrowRight className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            إضافة سؤال Writing
          </h1>
          <p className="text-gray-500 text-sm">سؤال كتابة مقالة أو فقرة</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-5">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            عنوان السؤال <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            placeholder="مثال: Essay on Technology"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          {errors.title && (
            <p className="text-red-500 text-xs mt-1">{errors.title}</p>
          )}
        </div>

        {/* Question Text */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            نص السؤال <span className="text-red-500">*</span>
          </label>
          <textarea
            name="question_text"
            value={form.question_text}
            onChange={handleChange}
            required
            rows={4}
            placeholder="أدخل تعليمات السؤال هنا..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
          />
          {errors.question_text && (
            <p className="text-red-500 text-xs mt-1">{errors.question_text}</p>
          )}
        </div>

        {/* Words Range */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              الحد الأدنى للكلمات <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="min_words"
              value={form.min_words}
              onChange={handleChange}
              required
              min={1}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              الحد الأقصى للكلمات <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="max_words"
              value={form.max_words}
              onChange={handleChange}
              required
              min={1}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Sample Answer */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            الإجابة النموذجية <span className="text-red-500">*</span>
          </label>
          <textarea
            name="sample_answer"
            value={form.sample_answer}
            onChange={handleChange}
            required
            rows={6}
            placeholder="أدخل إجابة نموذجية..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
          />
        </div>

        {/* Rubric */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            معايير التقييم (Rubric) <span className="text-red-500">*</span>
          </label>
          <textarea
            name="rubric"
            value={form.rubric}
            onChange={handleChange}
            required
            rows={4}
            placeholder="أدخل معايير التقييم..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
          />
        </div>

        {/* Points & Pass Threshold */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              النقاط
            </label>
            <input
              type="number"
              name="points"
              value={form.points}
              onChange={handleChange}
              min={1}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              نسبة النجاح (%)
            </label>
            <input
              type="number"
              name="pass_threshold"
              value={form.pass_threshold}
              onChange={handleChange}
              min={0}
              max={100}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Active */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="is_active"
            id="is_active"
            checked={form.is_active}
            onChange={handleChange}
            className="w-4 h-4 text-green-600"
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
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-3 rounded-lg font-medium transition-colors"
        >
          <Save className="w-5 h-5" />
          {loading ? "جاري الحفظ..." : "حفظ السؤال"}
        </button>
      </form>
    </div>
  );
}
