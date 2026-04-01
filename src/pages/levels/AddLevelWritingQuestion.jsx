// src/pages/AddLevelWritingQuestion.jsx
import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowRight, PenTool, Loader2, AlertCircle } from "lucide-react";
import { levelQuestionBanksAPI } from "../services/levelsService";

export default function AddLevelWritingQuestion() {
  const { bankId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    question_text: "",
    question_image: null,
    min_words: 50,
    max_words: 150,
    sample_answer: "",
    rubric: "",
    pass_threshold: 60,
    points: 10,
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
      // Prepare data
      const submitData = {
        ...formData,
        min_words: parseInt(formData.min_words),
        max_words: parseInt(formData.max_words),
        pass_threshold: parseInt(formData.pass_threshold),
        points: parseInt(formData.points),
        order: parseInt(formData.order),
      };

      await levelQuestionBanksAPI.addWriting(bankId, submitData);
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
          <h1 className="text-2xl font-bold text-gray-900">إضافة سؤال كتابة</h1>
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
        {/* Basic Info */}
        <div className="card">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <PenTool className="w-5 h-5" />
            المعلومات الأساسية
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                عنوان السؤال <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="input"
                required
                placeholder="مثال: Write about your family"
              />
              <p className="text-xs text-gray-500 mt-1">
                عنوان مختصر يوضح موضوع السؤال
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نص السؤال <span className="text-red-500">*</span>
              </label>
              <textarea
                name="question_text"
                value={formData.question_text}
                onChange={handleChange}
                rows={4}
                className="input"
                required
                placeholder="مثال: Write a short paragraph about your family. Include information about family members, their ages, and what they like to do."
              />
              <p className="text-xs text-gray-500 mt-1">
                التعليمات والإرشادات الكاملة للطالب
              </p>
            </div>
          </div>
        </div>

        {/* Word Count Requirements */}
        <div className="card">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            متطلبات عدد الكلمات
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الحد الأدنى للكلمات <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="min_words"
                value={formData.min_words}
                onChange={handleChange}
                className="input"
                min="10"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                أقل عدد كلمات مطلوب من الطالب
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الحد الأقصى للكلمات <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="max_words"
                value={formData.max_words}
                onChange={handleChange}
                className="input"
                min={formData.min_words}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                أقصى عدد كلمات مسموح به
              </p>
            </div>
          </div>

          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 سيُطلب من الطالب كتابة من {formData.min_words} إلى{" "}
              {formData.max_words} كلمة
            </p>
          </div>
        </div>

        {/* Sample Answer */}
        <div className="card">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            نموذج الإجابة
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              إجابة نموذجية
            </label>
            <textarea
              name="sample_answer"
              value={formData.sample_answer}
              onChange={handleChange}
              rows={6}
              className="input"
              placeholder="مثال نموذجي للإجابة المتوقعة من الطالب..."
            />
            <p className="text-xs text-gray-500 mt-1">
              إجابة نموذجية يمكن استخدامها كمرجع للتصحيح (اختياري)
            </p>
          </div>
        </div>

        {/* Grading Rubric */}
        <div className="card">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            معايير التصحيح
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                معايير التقييم
              </label>
              <textarea
                name="rubric"
                value={formData.rubric}
                onChange={handleChange}
                rows={6}
                className="input"
                placeholder="مثال:&#10;- Grammar & Spelling (30%)&#10;- Vocabulary & Word Choice (30%)&#10;- Organization & Structure (20%)&#10;- Content & Ideas (20%)"
              />
              <p className="text-xs text-gray-500 mt-1">
                معايير تقييم الإجابة التي سيتم استخدامها في التصحيح (اختياري)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نسبة النجاح (%) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="pass_threshold"
                value={formData.pass_threshold}
                onChange={handleChange}
                className="input"
                min="0"
                max="100"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                النسبة المئوية المطلوبة للنجاح في هذا السؤال
              </p>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="card">
          <h2 className="text-lg font-bold text-gray-900 mb-4">الإعدادات</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                النقاط <span className="text-red-500">*</span>
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
              <p className="text-xs text-gray-500 mt-1">
                النقاط المخصصة لهذا السؤال
              </p>
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
              <p className="text-xs text-gray-500 mt-1">
                ترتيب ظهور السؤال في الامتحان
              </p>
            </div>
          </div>

          {/* Active Status */}
          <div className="flex items-center gap-2 mt-4">
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

        {/* Preview Card */}
        <div className="card bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200">
          <h3 className="font-bold text-indigo-900 mb-3">معاينة السؤال</h3>
          <div className="bg-white rounded-lg p-4 space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-700">العنوان:</p>
              <p className="text-gray-900">
                {formData.title || "لم يتم إدخال عنوان"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">السؤال:</p>
              <p className="text-gray-900">
                {formData.question_text || "لم يتم إدخال نص السؤال"}
              </p>
            </div>
            <div className="flex gap-4 text-sm">
              <div>
                <span className="text-gray-600">عدد الكلمات:</span>
                <span className="font-bold text-gray-900 mr-1">
                  {formData.min_words} - {formData.max_words}
                </span>
              </div>
              <div>
                <span className="text-gray-600">النقاط:</span>
                <span className="font-bold text-gray-900 mr-1">
                  {formData.points}
                </span>
              </div>
              <div>
                <span className="text-gray-600">نسبة النجاح:</span>
                <span className="font-bold text-gray-900 mr-1">
                  {formData.pass_threshold}%
                </span>
              </div>
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
              <>
                <PenTool className="w-4 h-4 ml-2" />
                حفظ السؤال
              </>
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
