// src/pages/esp/AddReadingQuestionsToEsp.jsx
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BookText, Save, ArrowRight, Loader2 } from "lucide-react";
import { espQuestionsAPI } from "../../services/espService";

export default function AddReadingQuestionsToEsp() {
  const navigate = useNavigate();
  const { skillId, passageId } = useParams();

  const emptyQ = {
    question_text: "",
    options: ["", "", "", ""],
    correct_answer: "",
    explanation: "",
    difficulty: "MEDIUM",
    points: 1,
  };

  const [form, setForm] = useState(emptyQ);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const updateOption = (i, val) => {
    const opts = [...form.options];
    opts[i] = val;
    setForm({ ...form, options: opts });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.question_text.trim()) {
      setError("نص السؤال مطلوب");
      return;
    }
    if (!form.correct_answer.trim()) {
      setError("الإجابة الصحيحة مطلوبة");
      return;
    }
    if (!form.options.includes(form.correct_answer)) {
      setError("الإجابة الصحيحة يجب أن تكون أحد الخيارات");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await espQuestionsAPI.createReadingQuestion(passageId, {
        question_text: form.question_text,
        options: form.options.filter((o) => o.trim()),
        correct_answer: form.correct_answer,
        explanation: form.explanation,
        difficulty: form.difficulty,
        points: form.points,
      });
      setSuccess("تم إضافة السؤال!");
      setForm(emptyQ);
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
        <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
          <BookText className="w-5 h-5 text-amber-700" />
        </div>
        <h1 className="text-xl font-bold text-gray-900">إضافة سؤال للقطعة</h1>
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
            نص السؤال <span className="text-red-500">*</span>
          </label>
          <textarea
            value={form.question_text}
            onChange={(e) =>
              setForm({ ...form, question_text: e.target.value })
            }
            rows={3}
            placeholder="نص السؤال..."
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-right resize-none"
          />
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700 text-right">
            الخيارات
          </label>
          {form.options.map((opt, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="radio"
                name="correct"
                checked={form.correct_answer === opt && opt.trim() !== ""}
                onChange={() =>
                  opt.trim() && setForm({ ...form, correct_answer: opt })
                }
                className="accent-amber-600"
              />
              <div className="flex-1 relative">
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">
                  {String.fromCharCode(65 + i)}
                </span>
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => {
                    updateOption(i, e.target.value);
                    if (form.correct_answer === opt)
                      setForm((p) => ({
                        ...p,
                        correct_answer: e.target.value,
                      }));
                  }}
                  placeholder={`الخيار ${String.fromCharCode(65 + i)}`}
                  className={`w-full pr-8 pl-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-right ${
                    form.correct_answer === opt && opt.trim()
                      ? "border-amber-400 bg-amber-50"
                      : "border-gray-200"
                  }`}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700 text-right">
            الشرح (اختياري)
          </label>
          <textarea
            value={form.explanation}
            onChange={(e) => setForm({ ...form, explanation: e.target.value })}
            rows={2}
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
              النقاط
            </label>
            <input
              type="number"
              value={form.points}
              onChange={(e) =>
                setForm({ ...form, points: parseInt(e.target.value) || 1 })
              }
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-right"
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
            className="flex-1 py-2.5 bg-amber-600 text-white rounded-xl hover:bg-amber-700 font-medium flex items-center justify-center gap-2 disabled:opacity-60"
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
