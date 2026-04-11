// src/pages/general/AddReadingToGeneral.jsx
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BookText, Save, ArrowRight, Loader2 } from "lucide-react";
import { generalQuestionsAPI } from "../../services/generalService";

export default function AddReadingPassageToGeneral() {
  const navigate = useNavigate();
  const { skillId } = useParams();

  const [form, setForm] = useState({
    title: "",
    passage_text: "",
    source: "",
    difficulty: "MEDIUM",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.passage_text.trim()) {
      setError("العنوان ونص القطعة مطلوبان");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const res = await generalQuestionsAPI.createReadingPassage({
        ...form,
        general_skill: parseInt(skillId),
      });
      navigate(
        `/dashboard/general/skills/${skillId}/add/reading/passage/${res.passage.id}/questions`
      );
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
          onClick={() => navigate(`/dashboard/general/skills/${skillId}`)}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowRight className="w-5 h-5 text-gray-600" />
        </button>
        <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
          <BookText className="w-5 h-5 text-amber-700" />
        </div>
        <h1 className="text-xl font-bold text-gray-900">إضافة قطعة Reading</h1>
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

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700 text-right">
            العنوان <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="عنوان القطعة"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-right"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700 text-right">
            نص القطعة <span className="text-red-500">*</span>
          </label>
          <textarea
            value={form.passage_text}
            onChange={(e) => setForm({ ...form, passage_text: e.target.value })}
            rows={8}
            placeholder="اكتب نص القطعة هنا..."
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-right resize-none"
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
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-right bg-white"
            >
              <option value="EASY">سهل</option>
              <option value="MEDIUM">متوسط</option>
              <option value="HARD">صعب</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 text-right">
              المصدر (اختياري)
            </label>
            <input
              type="text"
              value={form.source}
              onChange={(e) => setForm({ ...form, source: e.target.value })}
              placeholder="مثال: BBC News"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-right"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate(`/dashboard/general/skills/${skillId}`)}
            className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 font-medium"
          >
            إلغاء
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-2.5 bg-amber-600 text-white rounded-xl hover:bg-amber-700 font-medium flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            حفظ والانتقال للأسئلة
          </button>
        </div>
      </form>
    </div>
  );
}
