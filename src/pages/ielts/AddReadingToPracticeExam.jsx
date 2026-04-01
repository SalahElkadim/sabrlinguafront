// src/pages/AddReadingToPracticeExam.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Save, Plus, X, FileText } from "lucide-react";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function AddReadingToPracticeExam() {
  const navigate = useNavigate();
  const { examId } = useParams();
  const [loading, setLoading] = useState(false);
  const [examInfo, setExamInfo] = useState(null);
  const [currentStep, setCurrentStep] = useState(1); // 1: Passage, 2: Questions

  // Passage Data
  const [passageData, setPassageData] = useState({
    title: "",
    passage_text: "",
  });

  // Questions Data
  const [questions, setQuestions] = useState([
    {
      question_text: "",
      points: 1,
      options: ["", "", "", ""],
      correct_answer: "",
      explanation: "",
    },
  ]);

  const [errors, setErrors] = useState({});

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

  const handlePassageChange = (e) => {
    const { name, value } = e.target;
    setPassageData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question_text: "",
        points: 1,
        options: ["", "", "", ""],
        correct_answer: "",
        explanation: "",
      },
    ]);
  };

  const removeQuestion = (index) => {
    if (questions.length <= 1) {
      toast.error("يجب أن يكون هناك سؤال واحد على الأقل");
      return;
    }
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const addOption = (questionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.push("");
    setQuestions(newQuestions);
  };

  const removeOption = (questionIndex, optionIndex) => {
    const newQuestions = [...questions];
    if (newQuestions[questionIndex].options.length <= 2) {
      toast.error("يجب أن يكون هناك خيارين على الأقل");
      return;
    }
    newQuestions[questionIndex].options = newQuestions[
      questionIndex
    ].options.filter((_, i) => i !== optionIndex);
    setQuestions(newQuestions);
  };

  const validatePassage = () => {
    const newErrors = {};

    if (!passageData.title.trim()) {
      newErrors.title = "عنوان الفقرة مطلوب";
    }

    if (!passageData.passage_text.trim()) {
      newErrors.passage_text = "نص الفقرة مطلوب";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateQuestions = () => {
    let isValid = true;

    questions.forEach((q, index) => {
      if (!q.question_text.trim()) {
        toast.error(`السؤال ${index + 1}: نص السؤال مطلوب`);
        isValid = false;
      }

      const validOptions = q.options.filter((opt) => opt.trim());
      if (validOptions.length < 2) {
        toast.error(`السؤال ${index + 1}: يجب إضافة خيارين على الأقل`);
        isValid = false;
      }

      if (!q.correct_answer.trim()) {
        toast.error(`السؤال ${index + 1}: الإجابة الصحيحة مطلوبة`);
        isValid = false;
      }
    });

    return isValid;
  };

  const handleNext = () => {
    if (validatePassage()) {
      setCurrentStep(2);
    } else {
      toast.error("يرجى تصحيح الأخطاء في بيانات الفقرة");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateQuestions()) {
      return;
    }

    try {
      setLoading(true);

      // Step 1: Create passage
      const passageSubmitData = {
        ielts_lesson_pack: examInfo.lesson_pack,
        usage_type: "IELTS",
        title: passageData.title,
        passage_text: passageData.passage_text,
        is_active: true,
      };

      const passageResponse = await api.post(
        "/ielts/reading/passages/create/",
        passageSubmitData
      );
      const passageId = passageResponse.data.passage.id;

      // Step 2: Create questions for this passage
      for (const question of questions) {
        const cleanOptions = question.options.filter((opt) => opt.trim());

        const questionSubmitData = {
          question_text: question.question_text,
          question_type: "MCQ", // Always MCQ
          points: parseFloat(question.points),
          options: cleanOptions,
          correct_answer: question.correct_answer,
          explanation: question.explanation,
          is_active: true,
        };

        await api.post(
          `/ielts/reading/passages/${passageId}/questions/create/`,
          questionSubmitData
        );
      }

      toast.success("تم إضافة فقرة القراءة والأسئلة بنجاح");
      navigate(`/dashboard/ielts/practice-exams/${examId}`);
    } catch (error) {
      console.error("Error creating reading passage:", error);
      if (error.response?.data) {
        toast.error(error.response.data.error || "فشل في إضافة الفقرة");
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
            <FileText className="w-8 h-8 text-green-600" />
            <h1 className="text-2xl font-bold text-gray-900">
              إضافة فقرة Reading
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

      {/* Steps Indicator */}
      <div className="card">
        <div className="flex items-center justify-center gap-4">
          <div
            className={`flex items-center gap-2 ${
              currentStep === 1 ? "text-primary-600" : "text-gray-400"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                currentStep === 1
                  ? "bg-primary-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              1
            </div>
            <span className="font-bold">الفقرة</span>
          </div>
          <div className="w-16 h-1 bg-gray-200"></div>
          <div
            className={`flex items-center gap-2 ${
              currentStep === 2 ? "text-primary-600" : "text-gray-400"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                currentStep === 2
                  ? "bg-primary-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              2
            </div>
            <span className="font-bold">الأسئلة</span>
          </div>
        </div>
      </div>

      {/* Step 1: Passage Form */}
      {currentStep === 1 && (
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            بيانات الفقرة
          </h2>

          <div className="space-y-6">
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-bold text-gray-900 mb-2"
              >
                عنوان الفقرة <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={passageData.title}
                onChange={handlePassageChange}
                className={`input ${errors.title ? "border-red-500" : ""}`}
                placeholder="مثال: The History of the Internet"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            {/* Passage Text */}
            <div>
              <label
                htmlFor="passage_text"
                className="block text-sm font-bold text-gray-900 mb-2"
              >
                نص الفقرة <span className="text-red-500">*</span>
              </label>
              <textarea
                id="passage_text"
                name="passage_text"
                value={passageData.passage_text}
                onChange={handlePassageChange}
                rows="10"
                className={`input ${
                  errors.passage_text ? "border-red-500" : ""
                }`}
                placeholder="اكتب نص الفقرة القرائية هنا..."
              />
              <p className="text-xs text-gray-500 mt-1">
                عدد الكلمات:{" "}
                {
                  passageData.passage_text.split(/\s+/).filter((word) => word)
                    .length
                }
              </p>
              {errors.passage_text && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.passage_text}
                </p>
              )}
            </div>

            {/* Next Button */}
            <div className="flex items-center gap-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleNext}
                className="btn-primary flex items-center gap-2"
              >
                <span>التالي: إضافة الأسئلة</span>
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Questions Form */}
      {currentStep === 2 && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              الأسئلة ({questions.length})
            </h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="btn-secondary"
              >
                رجوع للفقرة
              </button>
              <button
                type="button"
                onClick={addQuestion}
                className="btn-secondary flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                إضافة سؤال
              </button>
            </div>
          </div>

          {questions.map((question, qIndex) => (
            <div key={qIndex} className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  السؤال {qIndex + 1}
                </h3>
                {questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeQuestion(qIndex)}
                    className="btn-secondary text-red-600 hover:bg-red-50 text-sm"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {/* Question Text */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    نص السؤال <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={question.question_text}
                    onChange={(e) =>
                      handleQuestionChange(
                        qIndex,
                        "question_text",
                        e.target.value
                      )
                    }
                    rows="2"
                    className="input"
                    placeholder="اكتب السؤال..."
                  />
                </div>

                {/* Points */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    النقاط
                  </label>
                  <input
                    type="number"
                    value={question.points}
                    onChange={(e) =>
                      handleQuestionChange(qIndex, "points", e.target.value)
                    }
                    min="0"
                    step="0.5"
                    className="input max-w-xs"
                  />
                </div>

                {/* Options */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-bold text-gray-900">
                      الخيارات <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => addOption(qIndex)}
                      className="text-sm text-primary-600 hover:underline"
                    >
                      + إضافة خيار
                    </button>
                  </div>
                  <div className="space-y-2">
                    {question.options.map((option, oIndex) => (
                      <div key={oIndex} className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-600 w-6">
                          {String.fromCharCode(65 + oIndex)}.
                        </span>
                        <input
                          type="text"
                          value={option}
                          onChange={(e) =>
                            handleOptionChange(qIndex, oIndex, e.target.value)
                          }
                          className="input flex-1"
                          placeholder={`الخيار ${String.fromCharCode(
                            65 + oIndex
                          )}`}
                        />
                        {question.options.length > 2 && (
                          <button
                            type="button"
                            onClick={() => removeOption(qIndex, oIndex)}
                            className="text-red-600 hover:bg-red-50 p-1 rounded"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Correct Answer */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    الإجابة الصحيحة <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={question.correct_answer}
                    onChange={(e) =>
                      handleQuestionChange(
                        qIndex,
                        "correct_answer",
                        e.target.value
                      )
                    }
                    className="input"
                  >
                    <option value="">-- اختر الإجابة --</option>
                    {question.options.map((option, oIndex) => (
                      <option key={oIndex} value={option}>
                        {String.fromCharCode(65 + oIndex)}. {option}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Explanation */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    الشرح (اختياري)
                  </label>
                  <textarea
                    value={question.explanation}
                    onChange={(e) =>
                      handleQuestionChange(
                        qIndex,
                        "explanation",
                        e.target.value
                      )
                    }
                    rows="2"
                    className="input"
                    placeholder="اكتب شرح للإجابة الصحيحة..."
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Submit Button */}
          <div className="card">
            <div className="flex items-center gap-3">
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
                    <span>حفظ الفقرة والأسئلة</span>
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
      )}
    </div>
  );
}
