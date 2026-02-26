// src/pages/AddGrammarToPracticeExam.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Save, Plus, X, BookOpen } from "lucide-react";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function AddGrammarToPracticeExam() {
  const navigate = useNavigate();
  const { examId } = useParams();
  const [loading, setLoading] = useState(false);
  const [examInfo, setExamInfo] = useState(null);

  const [formData, setFormData] = useState({
    question_text: "",
    grammar_topic: "",
    points: 1,
    options: ["", "", "", ""],
    correct_answer: "",
    explanation: "",
  });

  const [errors, setErrors] = useState({});

  const grammarTopics = [
    "Tenses",
    "Articles",
    "Prepositions",
    "Modal Verbs",
    "Conditionals",
    "Passive Voice",
    "Reported Speech",
    "Relative Clauses",
    "Gerunds and Infinitives",
    "Subject-Verb Agreement",
    "Adjectives and Adverbs",
    "Other",
  ];

  useEffect(() => {
    fetchExamInfo();
  }, [examId]);

  const fetchExamInfo = async () => {
    try {
      const response = await api.get(`/ielts/practice-exams/${examId}/`);
      setExamInfo(response.data);
    } catch (error) {
      console.error("Error fetching exam:", error);
      toast.error("فشل في تحميل معلومات الامتحان");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData((prev) => ({ ...prev, options: newOptions }));
  };

  const addOption = () => {
    setFormData((prev) => ({
      ...prev,
      options: [...prev.options, ""],
    }));
  };

  const removeOption = (index) => {
    if (formData.options.length <= 2) {
      toast.error("يجب أن يكون هناك خيارين على الأقل");
      return;
    }
    const newOptions = formData.options.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, options: newOptions }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.question_text.trim()) {
      newErrors.question_text = "نص السؤال مطلوب";
    }

    const validOptions = formData.options.filter((opt) => opt.trim());
    if (validOptions.length < 2) {
      newErrors.options = "يجب إضافة خيارين على الأقل";
    }

    if (!formData.correct_answer.trim()) {
      newErrors.correct_answer = "الإجابة الصحيحة مطلوبة";
    }

    if (formData.points < 0) {
      newErrors.points = "النقاط يجب أن تكون رقم موجب";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("يرجى تصحيح الأخطاء في النموذج");
      return;
    }

    try {
      setLoading(true);

      const cleanOptions = formData.options.filter((opt) => opt.trim());

      const submitData = {
        ielts_lesson_pack: examInfo.lesson_pack,
        usage_type: "IELTS",
        question_text: formData.question_text,
        question_type: "MCQ",
        grammar_topic: formData.grammar_topic,
        points: parseFloat(formData.points),
        options: cleanOptions,
        correct_answer: formData.correct_answer,
        explanation: formData.explanation,
        is_active: true,
      };

      await api.post("/ielts/practice/grammar/create/", submitData);
      toast.success("تم إضافة السؤال بنجاح");
      navigate(`/dashboard/ielts/practice-exams/${examId}`);
    } catch (error) {
      console.error("Error creating question:", error);
      if (error.response?.data) {
        const serverErrors = error.response.data;
        if (typeof serverErrors === "object" && !serverErrors.error) {
          setErrors(serverErrors);
          toast.error("يرجى تصحيح الأخطاء في النموذج");
        } else {
          toast.error(serverErrors.error || "فشل في إضافة السؤال");
        }
      } else {
        toast.error("حدث خطأ في الاتصال بالخادم");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-8 h-8 text-purple-600" />
            <h1 className="text-2xl font-bold text-gray-900">
              إضافة سؤال Grammar
            </h1>
          </div>
          <p className="text-gray-600">{examInfo?.title || "Practice Exam"}</p>
        </div>
        <Link
          to={`/dashboard/ielts/practice-exams/${examId}`}
          className="btn-secondary flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>رجوع</span>
        </Link>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="card">
        <div className="space-y-6">
          {/* Question Text */}
          <div>
            <label
              htmlFor="question_text"
              className="block text-sm font-bold text-gray-900 mb-2"
            >
              نص السؤال <span className="text-red-500">*</span>
            </label>
            <textarea
              id="question_text"
              name="question_text"
              value={formData.question_text}
              onChange={handleChange}
              rows="3"
              className={`input ${
                errors.question_text ? "border-red-500" : ""
              }`}
              placeholder="مثال: She _____ to school every day."
            />
            {errors.question_text && (
              <p className="text-red-500 text-sm mt-1">
                {errors.question_text}
              </p>
            )}
          </div>

          {/* Grammar Topic */}
          <div>
            <label
              htmlFor="grammar_topic"
              className="block text-sm font-bold text-gray-900 mb-2"
            >
              موضوع القواعد
            </label>
            <select
              id="grammar_topic"
              name="grammar_topic"
              value={formData.grammar_topic}
              onChange={handleChange}
              className="input"
            >
              <option value="">-- اختر الموضوع --</option>
              {grammarTopics.map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </select>
          </div>

          {/* Options */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-bold text-gray-900">
                الخيارات <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={addOption}
                className="btn-secondary text-sm flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                إضافة خيار
              </button>
            </div>

            <div className="space-y-3">
              {formData.options.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-600 w-8">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="input flex-1"
                    placeholder={`الخيار ${String.fromCharCode(65 + index)}`}
                  />
                  {formData.options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      className="btn-secondary text-red-600 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {errors.options && (
              <p className="text-red-500 text-sm mt-1">{errors.options}</p>
            )}
          </div>

          {/* Correct Answer */}
          <div>
            <label
              htmlFor="correct_answer"
              className="block text-sm font-bold text-gray-900 mb-2"
            >
              الإجابة الصحيحة <span className="text-red-500">*</span>
            </label>
            <select
              id="correct_answer"
              name="correct_answer"
              value={formData.correct_answer}
              onChange={handleChange}
              className={`input ${
                errors.correct_answer ? "border-red-500" : ""
              }`}
            >
              <option value="">-- اختر الإجابة الصحيحة --</option>
              {formData.options.map((option, index) => (
                <option key={index} value={option}>
                  {String.fromCharCode(65 + index)}. {option}
                </option>
              ))}
            </select>
            {errors.correct_answer && (
              <p className="text-red-500 text-sm mt-1">
                {errors.correct_answer}
              </p>
            )}
          </div>

          {/* Explanation */}
          <div>
            <label
              htmlFor="explanation"
              className="block text-sm font-bold text-gray-900 mb-2"
            >
              الشرح (اختياري)
            </label>
            <textarea
              id="explanation"
              name="explanation"
              value={formData.explanation}
              onChange={handleChange}
              rows="3"
              className="input"
              placeholder="شرح القاعدة والإجابة الصحيحة..."
            />
          </div>

          {/* Points */}
          <div>
            <label
              htmlFor="points"
              className="block text-sm font-bold text-gray-900 mb-2"
            >
              النقاط
            </label>
            <input
              type="number"
              id="points"
              name="points"
              value={formData.points}
              onChange={handleChange}
              min="0"
              step="0.5"
              className={`input ${errors.points ? "border-red-500" : ""}`}
            />
            {errors.points && (
              <p className="text-red-500 text-sm mt-1">{errors.points}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex items-center gap-3 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>جاري الحفظ...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>حفظ السؤال</span>
                </>
              )}
            </button>
            <Link
              to={`/dashboard/ielts/practice-exams/${examId}`}
              className="btn-secondary"
            >
              إلغاء
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
