// src/pages/esp/AddWritingToEsp.jsx
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PenLine, Save, ArrowRight, Loader2 } from "lucide-react";
import { espQuestionsAPI } from "../../services/espService";

export default function AddWritingToEsp() {
  const navigate = useNavigate();
  const { skillId } = useParams();

  const [form, setForm] = useState({
    title: "",
    question_text: "",
    min_words: 150,
    max_words: 400,
    sample_answer: "",
    rubric: "",
    difficulty: "MEDIUM",
    points: 10,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.question_text.trim()) {
      setError("العنوان ونص السؤال مطلوبان");
      return;
    }
    if (parseInt(form.max_words) <= parseInt(form.min_words)) {
      setError("الحد الأقصى يجب أن يكون أكبر من الحد الأدنى");
      return;
    }
    try {
      setLoading(true);
      setError("");
      await espQuestionsAPI.createWriting({
        ...form,
        min_words: parseInt(form.min_words),
        max_words: parseInt(form.max_words),
        points: parseInt(form.points),
        esp_skill: parseInt(skillId),
      });
      setSuccess("تم إضافة السؤال بنجاح!");
      setForm({
        title: "",
        question_text: "",
        min_words: 150,
        max_words: 400,
        sample_answer: "",
        rubric: "",
        difficulty: "MEDIUM",
        points: 10,
      });
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.error || "حدث خطأ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(`/dashboard/esp/skills/${skillId}`)}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowRight className="w-5 h-5 text-gray-600" />
        </button>
        <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center">
          <PenLine className="w-5 h-5 text-pink-700" />
        </div>
        <h1 className="text-xl font-bold text-gray-900">إضافة سؤال Writing</h1>
      </div>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5"
      >
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-3 text-sm">
            {success}
          </div>
        )}

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700 text-right">
            العنوان <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 text-right"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700 text-right">
            نص السؤال <span className="text-red-500">*</span>
          </label>
          <textarea
            value={form.question_text}
            onChange={(e) =>
              setForm({ ...form, question_text: e.target.value })
            }
            rows={4}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 text-right resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 text-right">
              الحد الأدنى للكلمات
            </label>
            <input
              type="number"
              value={form.min_words}
              onChange={(e) => setForm({ ...form, min_words: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 text-right"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 text-right">
              الحد الأقصى للكلمات
            </label>
            <input
              type="number"
              value={form.max_words}
              onChange={(e) => setForm({ ...form, max_words: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 text-right"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700 text-right">
            نموذج الإجابة (اختياري)
          </label>
          <textarea
            value={form.sample_answer}
            onChange={(e) =>
              setForm({ ...form, sample_answer: e.target.value })
            }
            rows={4}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 text-right resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700 text-right">
            معايير التصحيح (Rubric)
          </label>
          <textarea
            value={form.rubric}
            onChange={(e) => setForm({ ...form, rubric: e.target.value })}
            rows={3}
            placeholder="1. Content (4 pts)&#10;2. Organization (3 pts)&#10;3. Language (3 pts)"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 text-right resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 text-right">
              الصعوبة
            </label>
            <select
              value={form.difficulty}
              onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 text-right bg-white"
            >
              <option value="EASY">سهل</option>
              <option value="MEDIUM">متوسط</option>
              <option value="HARD">صعب</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 text-right">
              النقاط
            </label>
            <input
              type="number"
              value={form.points}
              onChange={(e) => setForm({ ...form, points: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 text-right"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate(`/dashboard/esp/skills/${skillId}`)}
            className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 font-medium"
          >
            رجوع
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-2.5 bg-pink-600 text-white rounded-xl hover:bg-pink-700 font-medium flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            حفظ السؤال
          </button>
        </div>
      </form>
    </div>
  );
}
