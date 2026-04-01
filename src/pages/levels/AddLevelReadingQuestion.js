// src/pages/AddLevelReadingQuestion.jsx
import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Loader2,
  AlertCircle,
  Plus,
  Trash2,
} from "lucide-react";
import { levelQuestionBanksAPI } from "../services/levelsService";

export default function AddLevelReadingQuestion() {
  const { bankId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1); // 1 = Passage, 2 = Questions
  const [passageId, setPassageId] = useState(null);

  // Passage Form
  const [passageData, setPassageData] = useState({
    title: "",
    passage_text: "",
    source: "",
    order: 0,
    is_active: true,
  });

  // Questions List
  const [questions, setQuestions] = useState([
    {
      question_text: "",
      choice_a: "",
      choice_b: "",
      choice_c: "",
      choice_d: "",
      correct_answer: "A",
      explanation: "",
      points: 1,
      order: 1,
      is_active: true,
    },
  ]);

  const handlePassageChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPassageData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleQuestionChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    const updated = [...questions];
    updated[index][name] = type === "checkbox" ? checked : value;
    setQuestions(updated);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question_text: "",
        choice_a: "",
        choice_b: "",
        choice_c: "",
        choice_d: "",
        correct_answer: "A",
        explanation: "",
        points: 1,
        order: questions.length + 1,
        is_active: true,
      },
    ]);
  };

  const removeQuestion = (index) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const handleSubmitPassage = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await levelQuestionBanksAPI.createReadingPassage(
        bankId,
        passageData
      );
      setPassageId(response.passage.id);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || "فشل إضافة القطعة");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitQuestions = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      for (const question of questions) {
        await levelQuestionBanksAPI.addReadingQuestion(
          bankId,
          passageId,
          question
        );
      }
      navigate(`/dashboard/level-question-banks/${bankId}`);
    } catch (err) {
      setError(err.response?.data?.error || "فشل إضافة الأسئلة");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to={`/dashboard/level-question-banks/${bankId}`}
          className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100"
        >
          <ArrowRight className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إضافة قطعة قراءة</h1>
          <p className="text-gray-600">
            {step === 1 ? "الخطوة 1: إضافة القطعة" : "الخطوة 2: إضافة الأسئلة"}
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="card bg-red-50 border border-red-200">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Step 1: Passage */}
      {step === 1 && (
        <form onSubmit={handleSubmitPassage} className="space-y-6">
          <div className="card">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              بيانات القطعة
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  عنوان القطعة <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={passageData.title}
                  onChange={handlePassageChange}
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نص القطعة <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="passage_text"
                  value={passageData.passage_text}
                  onChange={handlePassageChange}
                  rows={10}
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  المصدر
                </label>
                <input
                  type="text"
                  name="source"
                  value={passageData.source}
                  onChange={handlePassageChange}
                  className="input"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الترتيب
                  </label>
                  <input
                    type="number"
                    name="order"
                    value={passageData.order}
                    onChange={handlePassageChange}
                    className="input"
                    min="0"
                  />
                </div>

                <div className="flex items-end">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={passageData.is_active}
                      onChange={handlePassageChange}
                      className="w-4 h-4 text-primary-600 rounded"
                    />
                    <span className="text-sm text-gray-700">قطعة نشطة</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                جاري الحفظ...
              </>
            ) : (
              "التالي: إضافة الأسئلة"
            )}
          </button>
        </form>
      )}

      {/* Step 2: Questions */}
      {step === 2 && (
        <form onSubmit={handleSubmitQuestions} className="space-y-6">
          {questions.map((question, index) => (
            <div key={index} className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  السؤال {index + 1}
                </h3>
                {questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeQuestion(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نص السؤال <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="question_text"
                    value={question.question_text}
                    onChange={(e) => handleQuestionChange(index, e)}
                    rows={3}
                    className="input"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الاختيار أ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="choice_a"
                      value={question.choice_a}
                      onChange={(e) => handleQuestionChange(index, e)}
                      className="input"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الاختيار ب <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="choice_b"
                      value={question.choice_b}
                      onChange={(e) => handleQuestionChange(index, e)}
                      className="input"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الاختيار ج <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="choice_c"
                      value={question.choice_c}
                      onChange={(e) => handleQuestionChange(index, e)}
                      className="input"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الاختيار د <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="choice_d"
                      value={question.choice_d}
                      onChange={(e) => handleQuestionChange(index, e)}
                      className="input"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الإجابة الصحيحة <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="correct_answer"
                      value={question.correct_answer}
                      onChange={(e) => handleQuestionChange(index, e)}
                      className="input"
                      required
                    >
                      <option value="A">أ</option>
                      <option value="B">ب</option>
                      <option value="C">ج</option>
                      <option value="D">د</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      النقاط
                    </label>
                    <input
                      type="number"
                      name="points"
                      value={question.points}
                      onChange={(e) => handleQuestionChange(index, e)}
                      className="input"
                      min="1"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    شرح الإجابة
                  </label>
                  <textarea
                    name="explanation"
                    value={question.explanation}
                    onChange={(e) => handleQuestionChange(index, e)}
                    rows={2}
                    className="input"
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addQuestion}
            className="btn btn-secondary w-full"
          >
            <Plus className="w-4 h-4 ml-2" />
            إضافة سؤال آخر
          </button>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                  جاري الحفظ...
                </>
              ) : (
                "حفظ الأسئلة"
              )}
            </button>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="btn btn-secondary"
            >
              السابق
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
