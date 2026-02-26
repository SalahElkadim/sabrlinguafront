// src/pages/AddLevelVocabularyQuestion.jsx
import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowRight, BookOpen, Loader2, AlertCircle } from "lucide-react";
import { levelQuestionBanksAPI } from "../services/levelsService";

export default function AddLevelVocabularyQuestion() {
  const { bankId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    question_set_title: "",
    question_set_description: "",
    question_text: "",
    choice_a: "",
    choice_b: "",
    choice_c: "",
    choice_d: "",
    correct_answer: "A",
    explanation: "",
    points: 1,
    order: 0,
    is_active: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await levelQuestionBanksAPI.addVocabulary(bankId, formData);
      navigate(`/dashboard/level-question-banks/${bankId}`);
    } catch (err) {
      setError(err.response?.data?.error || "فشل إضافة السؤال");
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
          className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowRight className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            إضافة سؤال مفردات
          </h1>
          <p className="text-gray-600">إضافة سؤال جديد لبنك الأسئلة</p>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="card bg-red-50 border border-red-200">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Question Set Info */}
        <div className="card">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            معلومات المجموعة
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                عنوان المجموعة <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="question_set_title"
                value={formData.question_set_title}
                onChange={handleChange}
                className="input"
                required
                placeholder="مثال: Vocabulary Set 1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                وصف المجموعة
              </label>
              <textarea
                name="question_set_description"
                value={formData.question_set_description}
                onChange={handleChange}
                rows={3}
                className="input"
                placeholder="وصف مختصر للمجموعة..."
              />
            </div>
          </div>
        </div>

        {/* Question Details */}
        <div className="card">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            تفاصيل السؤال
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نص السؤال <span className="text-red-500">*</span>
              </label>
              <textarea
                name="question_text"
                value={formData.question_text}
                onChange={handleChange}
                rows={3}
                className="input"
                required
                placeholder="مثال: What is the meaning of 'dog'?"
              />
            </div>

            {/* Choices */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الاختيار أ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="choice_a"
                  value={formData.choice_a}
                  onChange={handleChange}
                  className="input"
                  required
                  placeholder="الاختيار الأول"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الاختيار ب <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="choice_b"
                  value={formData.choice_b}
                  onChange={handleChange}
                  className="input"
                  required
                  placeholder="الاختيار الثاني"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الاختيار ج <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="choice_c"
                  value={formData.choice_c}
                  onChange={handleChange}
                  className="input"
                  required
                  placeholder="الاختيار الثالث"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الاختيار د <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="choice_d"
                  value={formData.choice_d}
                  onChange={handleChange}
                  className="input"
                  required
                  placeholder="الاختيار الرابع"
                />
              </div>
            </div>

            {/* Correct Answer */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الإجابة الصحيحة <span className="text-red-500">*</span>
              </label>
              <select
                name="correct_answer"
                value={formData.correct_answer}
                onChange={handleChange}
                className="input"
                required
              >
                <option value="A">أ</option>
                <option value="B">ب</option>
                <option value="C">ج</option>
                <option value="D">د</option>
              </select>
            </div>

            {/* Explanation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                شرح الإجابة
              </label>
              <textarea
                name="explanation"
                value={formData.explanation}
                onChange={handleChange}
                rows={3}
                className="input"
                placeholder="شرح مفصل للإجابة الصحيحة..."
              />
            </div>

            {/* Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  النقاط
                </label>
                <input
                  type="number"
                  name="points"
                  value={formData.points}
                  onChange={handleChange}
                  className="input"
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الترتيب
                </label>
                <input
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleChange}
                  className="input"
                  min="0"
                />
              </div>
            </div>

            {/* Active Status */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_active"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="w-4 h-4 text-primary-600 rounded"
              />
              <label htmlFor="is_active" className="text-sm text-gray-700">
                سؤال نشط
              </label>
            </div>
          </div>
        </div>

        {/* Actions */}
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
              "حفظ السؤال"
            )}
          </button>
          <Link
            to={`/dashboard/level-question-banks/${bankId}`}
            className="btn btn-secondary"
          >
            إلغاء
          </Link>
        </div>
      </form>
    </div>
  );
}
