// src/pages/general/AddMCQToGeneral.jsx
// يُستخدم لـ Vocabulary و Grammar معاً
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Hash,
  AlignLeft,
  Save,
  ArrowRight,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";
import { generalQuestionsAPI } from "../../services/generalService";

export default function AddMCQToGeneral({ questionType = "VOCABULARY" }) {
  const navigate = useNavigate();
  const { skillId } = useParams();

  const isVocabulary = questionType === "VOCABULARY";

  const emptyForm = {
    question_text: "",
    options: ["", "", "", ""],
    correct_answer: "",
    explanation: "",
    difficulty: "MEDIUM",
    points: 1,
  };

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const updateOption = (index, value) => {
    const updated = [...form.options];
    updated[index] = value;
    setForm({ ...form, options: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const filledOptions = form.options.filter((o) => o.trim());
    if (!form.question_text.trim()) {
      setError("نص السؤال مطلوب");
      return;
    }
    if (filledOptions.length < 2) {
      setError("يجب إضافة خيارين على الأقل");
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
      const payload = {
        question_text: form.question_text,
        options: form.options.filter((o) => o.trim()),
        correct_answer: form.correct_answer,
        explanation: form.explanation,
        difficulty: form.difficulty,
        points: form.points,
        general_skill: parseInt(skillId),
      };

      if (isVocabulary) {
        await generalQuestionsAPI.createVocabulary(payload);
      } else {
        await generalQuestionsAPI.createGrammar(payload);
      }

      setSuccess("تم إضافة السؤال بنجاح!");
      setForm(emptyForm);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.error || "حدث خطأ، حاول مرة أخرى");
    } finally {
      setLoading(false);
    }
  };

  const Icon = isVocabulary ? Hash : AlignLeft;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(`/dashboard/general/skills/${skillId}`)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowRight className="w-5 h-5 text-gray-600" />
        </button>
        <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
          <Icon className="w-5 h-5 text-emerald-700" />
        </div>
        <h1 className="text-xl font-bold text-gray-900">
          إضافة سؤال {isVocabulary ? "Vocabulary" : "Grammar"}
        </h1>
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

        {/* Question Text */}
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
            placeholder="اكتب نص السؤال هنا..."
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-right resize-none"
          />
        </div>

        {/* Options */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700 text-right">
            الخيارات <span className="text-red-500">*</span>
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
                className="accent-emerald-600"
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
                      setForm((prev) => ({
                        ...prev,
                        correct_answer: e.target.value,
                      }));
                  }}
                  placeholder={`الخيار ${String.fromCharCode(65 + i)}`}
                  className={`w-full pr-8 pl-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-right ${
                    form.correct_answer === opt && opt.trim()
                      ? "border-emerald-400 bg-emerald-50"
                      : "border-gray-200"
                  }`}
                />
              </div>
            </div>
          ))}
          <p className="text-xs text-gray-400 text-right">
            اختر الـ Radio button بجانب الإجابة الصحيحة
          </p>
        </div>

        {/* Explanation */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700 text-right">
            الشرح (اختياري)
          </label>
          <textarea
            value={form.explanation}
            onChange={(e) => setForm({ ...form, explanation: e.target.value })}
            rows={2}
            placeholder="شرح الإجابة الصحيحة..."
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-right resize-none"
          />
        </div>

        {/* Difficulty & Points */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 text-right">
              الصعوبة
            </label>
            <select
              value={form.difficulty}
              onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-right bg-white"
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
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-right"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate(`/dashboard/general/skills/${skillId}`)}
            className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 font-medium"
          >
            رجوع
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-medium flex items-center justify-center gap-2 disabled:opacity-60"
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
