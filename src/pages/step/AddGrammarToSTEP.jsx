// src/pages/AddGrammarToSTEP.jsx
import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowRight, Plus, Trash2, Save } from "lucide-react";
import { stepQuestionsAPI } from "../services/stepService";

export default function AddGrammarToSTEP() {
  const { skillId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    question_text: "",
    explanation: "",
    points: 1,
    is_active: true,
  });
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleOptionChange = (idx, val) => {
    setOptions((prev) => prev.map((o, i) => (i === idx ? val : o)));
  };

  const addOption = () => {
    if (options.length < 4) setOptions((prev) => [...prev, ""]);
  };

  const removeOption = (idx) => {
    if (options.length <= 2) return;
    setOptions((prev) => prev.filter((_, i) => i !== idx));
    if (correctIndex === idx) setCorrectIndex(null);
    else if (correctIndex > idx) setCorrectIndex((c) => c - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (correctIndex === null) {
      setErrors({ correct_answer: "يجب تحديد الإجابة الصحيحة" });
      return;
    }
    const filledOptions = options.filter((o) => o.trim());
    if (filledOptions.length < 2) {
      setErrors({ options: "يجب إضافة خيارين على الأقل" });
      return;
    }
    setLoading(true);
    setErrors({});
    try {
      await stepQuestionsAPI.createGrammar({
        ...form,
        options,
        correct_answer: options[correctIndex],
        step_skill: skillId,
      });
      navigate(`/dashboard/step/skills/${skillId}`);
    } catch (err) {
      setErrors(err.response?.data || { general: "حدث خطأ، حاول مرة أخرى" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          to={`/dashboard/step/skills/${skillId}`}
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
        >
          <ArrowRight className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            إضافة سؤال Grammar
          </h1>
          <p className="text-gray-500 text-sm">سؤال اختيار من متعدد</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-5">
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
            rows={3}
            placeholder="أدخل نص السؤال هنا..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
          />
        </div>

        {/* Options */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            الخيارات <span className="text-red-500">*</span>{" "}
            <span className="text-xs text-gray-400">
              (اختر الإجابة الصحيحة)
            </span>
          </label>
          <div className="space-y-2">
            {options.map((opt, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCorrectIndex(idx)}
                  className={`w-6 h-6 rounded-full border-2 shrink-0 transition-colors ${
                    correctIndex === idx
                      ? "bg-green-500 border-green-500"
                      : "border-gray-300 hover:border-green-400"
                  }`}
                />
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => handleOptionChange(idx, e.target.value)}
                  placeholder={`الخيار ${String.fromCharCode(65 + idx)}`}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  type="button"
                  onClick={() => removeOption(idx)}
                  className="text-red-400 hover:text-red-600 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          {options.length < 4 && (
            <button
              type="button"
              onClick={addOption}
              className="mt-2 text-sm text-purple-600 hover:text-purple-800 flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> إضافة خيار
            </button>
          )}
          {errors.options && (
            <p className="text-red-500 text-xs mt-1">{errors.options}</p>
          )}
          {errors.correct_answer && (
            <p className="text-red-500 text-xs mt-1">{errors.correct_answer}</p>
          )}
        </div>

        {/* Explanation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            الشرح (اختياري)
          </label>
          <textarea
            name="explanation"
            value={form.explanation}
            onChange={handleChange}
            rows={2}
            placeholder="شرح الإجابة الصحيحة..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none text-sm"
          />
        </div>

        {/* Points */}
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
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {errors.general && (
          <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
            {errors.general}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white py-3 rounded-lg font-medium transition-colors"
        >
          <Save className="w-5 h-5" />
          {loading ? "جاري الحفظ..." : "حفظ السؤال"}
        </button>
      </form>
    </div>
  );
}
