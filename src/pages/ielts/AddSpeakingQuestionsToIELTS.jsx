// src/pages/ielts/AddSpeakingQuestionsToIELTS.jsx
import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowRight,
  Plus,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle,
  Video,
} from "lucide-react";
import { ieltsQuestionsAPI } from "../../services/ieltsService";

const EMPTY_QUESTION = () => ({
  question_text: "",
  options: ["", "", "", ""],
  correct_answer: "",
  explanation: "",
  points: 1,
});

export default function AddSpeakingQuestionsToIELTS() {
  const { skillId, videoId } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([EMPTY_QUESTION()]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [successCount, setSuccessCount] = useState(0);

  const updateQuestion = (idx, field, value) => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [field]: value };
      return updated;
    });
  };

  const updateOption = (qIdx, optIdx, value) => {
    setQuestions((prev) => {
      const updated = [...prev];
      const options = [...updated[qIdx].options];
      options[optIdx] = value;
      updated[qIdx] = { ...updated[qIdx], options };
      return updated;
    });
  };

  const addQuestion = () => setQuestions((prev) => [...prev, EMPTY_QUESTION()]);

  const removeQuestion = (idx) =>
    setQuestions((prev) => prev.filter((_, i) => i !== idx));

  const validate = () => {
    const newErrors = [];
    questions.forEach((q) => {
      const qErrors = {};
      if (!q.question_text.trim()) qErrors.question_text = "السؤال مطلوب";
      if (q.options.filter((o) => o.trim()).length < 2)
        qErrors.options = "يجب إضافة خيارين على الأقل";
      if (!q.correct_answer.trim())
        qErrors.correct_answer = "الإجابة الصحيحة مطلوبة";
      else if (!q.options.includes(q.correct_answer))
        qErrors.correct_answer = "الإجابة الصحيحة غير موجودة في الخيارات";
      newErrors.push(qErrors);
    });
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (validationErrors.some((e) => Object.keys(e).length > 0)) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    let count = 0;
    const newErrors = Array(questions.length).fill({});

    for (let i = 0; i < questions.length; i++) {
      try {
        await ieltsQuestionsAPI.createSpeakingQuestion(videoId, {
          question_text: questions[i].question_text,
          options: questions[i].options.filter((o) => o.trim()),
          correct_answer: questions[i].correct_answer,
          explanation: questions[i].explanation,
          points: questions[i].points,
        });
        count++;
      } catch {
        newErrors[i] = { general: "فشل في إرسال هذا السؤال" };
      }
    }

    setSuccessCount(count);
    setErrors(newErrors);
    setLoading(false);

    if (count === questions.length) {
      setTimeout(() => navigate(`/dashboard/ielts/skills/${skillId}`), 1500);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          to={`/dashboard/ielts/skills/${skillId}`}
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
        >
          <ArrowRight className="w-5 h-5" />
        </Link>
        <div className="bg-rose-50 p-3 rounded-xl">
          <Video className="w-6 h-6 text-rose-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            إضافة أسئلة للفيديو
          </h1>
          <p className="text-sm text-rose-600 font-medium">IELTS — Speaking</p>
        </div>
      </div>

      {/* Success Banner */}
      {successCount > 0 && (
        <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          تم إضافة {successCount} سؤال بنجاح! جاري الانتقال...
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5" dir="rtl">
        {questions.map((q, idx) => (
          <div key={idx} className="card border border-rose-100 space-y-4">
            {/* Question Header */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-full">
                سؤال {idx + 1}
              </span>
              {questions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeQuestion(idx)}
                  className="text-red-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {errors[idx]?.general && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                {errors[idx].general}
              </div>
            )}

            {/* Question Text */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                نص السؤال <span className="text-red-500">*</span>
              </label>
              <textarea
                value={q.question_text}
                onChange={(e) =>
                  updateQuestion(idx, "question_text", e.target.value)
                }
                placeholder="اكتب السؤال هنا..."
                rows={2}
                className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none ${
                  errors[idx]?.question_text
                    ? "border-red-400"
                    : "border-gray-300"
                }`}
              />
              {errors[idx]?.question_text && (
                <p className="text-xs text-red-500 mt-1">
                  {errors[idx].question_text}
                </p>
              )}
            </div>

            {/* Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الخيارات <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                {q.options.map((opt, oi) => (
                  <div key={oi} className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-500 w-5">
                      {String.fromCharCode(65 + oi)}.
                    </span>
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => updateOption(idx, oi, e.target.value)}
                      placeholder={`الخيار ${String.fromCharCode(65 + oi)}`}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                ))}
              </div>
              {errors[idx]?.options && (
                <p className="text-xs text-red-500 mt-1">
                  {errors[idx].options}
                </p>
              )}
            </div>

            {/* Correct Answer */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الإجابة الصحيحة <span className="text-red-500">*</span>
              </label>
              <select
                value={q.correct_answer}
                onChange={(e) =>
                  updateQuestion(idx, "correct_answer", e.target.value)
                }
                className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white ${
                  errors[idx]?.correct_answer
                    ? "border-red-400"
                    : "border-gray-300"
                }`}
              >
                <option value="">اختر الإجابة الصحيحة</option>
                {q.options
                  .filter((o) => o.trim())
                  .map((opt, oi) => (
                    <option key={oi} value={opt}>
                      {String.fromCharCode(65 + q.options.indexOf(opt))}. {opt}
                    </option>
                  ))}
              </select>
              {errors[idx]?.correct_answer && (
                <p className="text-xs text-red-500 mt-1">
                  {errors[idx].correct_answer}
                </p>
              )}
            </div>

            {/* Explanation + Points */}
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  الشرح (اختياري)
                </label>
                <input
                  type="text"
                  value={q.explanation}
                  onChange={(e) =>
                    updateQuestion(idx, "explanation", e.target.value)
                  }
                  placeholder="شرح الإجابة..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  النقاط
                </label>
                <input
                  type="number"
                  value={q.points}
                  onChange={(e) =>
                    updateQuestion(idx, "points", parseInt(e.target.value))
                  }
                  min="1"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>
          </div>
        ))}

        {/* Add Question */}
        <button
          type="button"
          onClick={addQuestion}
          className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-rose-300 text-rose-600 rounded-xl hover:border-rose-400 hover:bg-rose-50 transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          إضافة سؤال آخر
        </button>

        {/* Submit */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white py-3 rounded-xl font-medium transition-colors"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            حفظ {questions.length} سؤال
          </button>
          <Link
            to={`/dashboard/ielts/skills/${skillId}`}
            className="flex-1 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-medium transition-colors"
          >
            تخطي
          </Link>
        </div>
      </form>
    </div>
  );
}
