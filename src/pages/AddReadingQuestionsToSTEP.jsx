// src/pages/AddReadingQuestionsToSTEP.jsx
import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowRight, Plus, Trash2, Save, CheckCircle } from "lucide-react";
import { stepQuestionsAPI } from "../services/stepService";

function QuestionForm({ index, onSave, onCancel, passageId, saved }) {
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

  const handleOptionChange = (idx, val) => {
    setOptions((prev) => prev.map((o, i) => (i === idx ? val : o)));
  };

  const removeOption = (idx) => {
    if (options.length <= 2) return;
    setOptions((prev) => prev.filter((_, i) => i !== idx));
    if (correctIndex === idx) setCorrectIndex(null);
    else if (correctIndex > idx) setCorrectIndex((c) => c - 1);
  };

  const handleSave = async () => {
    if (correctIndex === null) {
      setErrors({ correct_answer: "يجب تحديد الإجابة الصحيحة" });
      return;
    }
    if (!form.question_text.trim()) {
      setErrors({ question_text: "نص السؤال مطلوب" });
      return;
    }
    setLoading(true);
    setErrors({});
    try {
      await stepQuestionsAPI.createReadingQuestion(passageId, {
        ...form,
        options,
        correct_answer: options[correctIndex],
      });
      onSave();
    } catch (err) {
      setErrors(err.response?.data || { general: "حدث خطأ" });
    } finally {
      setLoading(false);
    }
  };

  if (saved) {
    return (
      <div className="border border-green-200 bg-green-50 rounded-xl p-4 flex items-center gap-3">
        <CheckCircle className="w-5 h-5 text-green-600" />
        <p className="text-green-700 font-medium text-sm">
          السؤال {index + 1} تم حفظه بنجاح
        </p>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-xl p-4 space-y-4">
      <p className="font-semibold text-gray-700 text-sm">السؤال {index + 1}</p>

      <div>
        <textarea
          value={form.question_text}
          onChange={(e) =>
            setForm((f) => ({ ...f, question_text: e.target.value }))
          }
          rows={2}
          placeholder="نص السؤال..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
        />
        {errors.question_text && (
          <p className="text-red-500 text-xs mt-1">{errors.question_text}</p>
        )}
      </div>

      <div className="space-y-2">
        {options.map((opt, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCorrectIndex(idx)}
              className={`w-5 h-5 rounded-full border-2 shrink-0 transition-colors ${
                correctIndex === idx
                  ? "bg-green-500 border-green-500"
                  : "border-gray-300"
              }`}
            />
            <input
              type="text"
              value={opt}
              onChange={(e) => handleOptionChange(idx, e.target.value)}
              placeholder={`الخيار ${String.fromCharCode(65 + idx)}`}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400"
            />
            <button
              type="button"
              onClick={() => removeOption(idx)}
              className="text-red-400 hover:text-red-600"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
        {errors.correct_answer && (
          <p className="text-red-500 text-xs">{errors.correct_answer}</p>
        )}
      </div>

      <input
        type="text"
        value={form.explanation}
        onChange={(e) =>
          setForm((f) => ({ ...f, explanation: e.target.value }))
        }
        placeholder="الشرح (اختياري)"
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400"
      />

      {errors.general && (
        <p className="text-red-500 text-xs">{errors.general}</p>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-1 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white px-4 py-2 rounded-lg text-sm"
        >
          <Save className="w-3.5 h-3.5" />
          {loading ? "جاري الحفظ..." : "حفظ"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm"
        >
          إلغاء
        </button>
      </div>
    </div>
  );
}

export default function AddReadingQuestionsToSTEP() {
  const { skillId, passageId } = useParams();
  const navigate = useNavigate();
  const [questionForms, setQuestionForms] = useState([{ id: 0, saved: false }]);
  const [nextId, setNextId] = useState(1);

  const addForm = () => {
    setQuestionForms((prev) => [...prev, { id: nextId, saved: false }]);
    setNextId((n) => n + 1);
  };

  const markSaved = (id) => {
    setQuestionForms((prev) =>
      prev.map((f) => (f.id === id ? { ...f, saved: true } : f))
    );
  };

  const removeForm = (id) => {
    setQuestionForms((prev) => prev.filter((f) => f.id !== id));
  };

  const savedCount = questionForms.filter((f) => f.saved).length;

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
            إضافة أسئلة القطعة
          </h1>
          <p className="text-gray-500 text-sm">أضف أسئلة للقطعة التي أنشأتها</p>
        </div>
      </div>

      {savedCount > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-green-700 text-sm">
          ✅ تم حفظ {savedCount} سؤال حتى الآن
        </div>
      )}

      <div className="space-y-4">
        {questionForms.map((form, index) => (
          <QuestionForm
            key={form.id}
            index={index}
            passageId={passageId}
            saved={form.saved}
            onSave={() => markSaved(form.id)}
            onCancel={() => removeForm(form.id)}
          />
        ))}
      </div>

      <div className="flex gap-3">
        <button
          onClick={addForm}
          className="flex items-center gap-2 bg-orange-50 hover:bg-orange-100 text-orange-600 px-4 py-2 rounded-lg text-sm border border-orange-200 transition-colors"
        >
          <Plus className="w-4 h-4" />
          إضافة سؤال آخر
        </button>
        <button
          onClick={() => navigate(`/dashboard/step/skills/${skillId}`)}
          className="flex-1 bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg text-sm transition-colors"
        >
          انتهيت - العودة للمهارة
        </button>
      </div>
    </div>
  );
}
