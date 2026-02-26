// src/pages/AddListeningToPracticeExam.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Plus,
  X,
  Headphones,
  Upload,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function AddListeningToPracticeExam() {
  const navigate = useNavigate();
  const { examId } = useParams();
  const [loading, setLoading] = useState(false);
  const [examInfo, setExamInfo] = useState(null);
  const [currentStep, setCurrentStep] = useState(1); // 1: Audio, 2: Questions

  // Audio Data
  const [audioData, setAudioData] = useState({
    title: "",
    transcript: "",
    duration: 60,
  });

  const [audioUrl, setAudioUrl] = useState("");
  const [uploadingAudio, setUploadingAudio] = useState(false);

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

  const handleAudioUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith("audio/")) {
      toast.error("الرجاء اختيار ملف صوتي فقط");
      return;
    }

    // Check file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      toast.error("حجم الملف يجب أن يكون أقل من 50 ميجابايت");
      return;
    }

    setUploadingAudio(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "react_uploads");
    formData.append("resource_type", "video"); // يدعم الصوت والفيديو

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dyxozpomy/upload",
        { method: "POST", body: formData }
      );

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      if (data.secure_url) {
        setAudioUrl(data.secure_url);
        // لو في duration من Cloudinary، استخدمها
        if (data.duration) {
          setAudioData((prev) => ({
            ...prev,
            duration: Math.round(data.duration),
          }));
        }
        toast.success("تم رفع الملف الصوتي بنجاح");
      } else {
        throw new Error("لم يتم الحصول على رابط الملف");
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error(`حدث خطأ في رفع الملف: ${err.message}`);
    } finally {
      setUploadingAudio(false);
    }
  };

  const handleAudioChange = (e) => {
    const { name, value } = e.target;
    setAudioData((prev) => ({
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

  const validateAudio = () => {
    const newErrors = {};

    if (!audioData.title.trim()) {
      newErrors.title = "عنوان التسجيل مطلوب";
    }

    if (!audioUrl) {
      newErrors.audio = "يجب رفع الملف الصوتي";
    }

    if (audioData.duration < 1) {
      newErrors.duration = "المدة يجب أن تكون أكبر من صفر";
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
    if (validateAudio()) {
      setCurrentStep(2);
    } else {
      toast.error("يرجى تصحيح الأخطاء في بيانات التسجيل");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateQuestions()) {
      return;
    }

    try {
      setLoading(true);

      // Step 1: Create listening audio
      const audioSubmitData = {
        ielts_lesson_pack: examInfo.lesson_pack,
        usage_type: "IELTS",
        title: audioData.title,
        audio_file: audioUrl,
        transcript: audioData.transcript,
        duration: parseInt(audioData.duration),
        is_active: true,
      };

      const audioResponse = await api.post(
        "/ielts/listening/audios/create/",
        audioSubmitData
      );
      const audioId = audioResponse.data.audio.id;

      // Step 2: Create questions for this audio
      for (const question of questions) {
        const cleanOptions = question.options.filter((opt) => opt.trim());

        const questionSubmitData = {
          question_text: question.question_text,
          points: parseFloat(question.points),
          options: cleanOptions,
          correct_answer: question.correct_answer,
          explanation: question.explanation,
          is_active: true,
        };

        await api.post(
          `/ielts/listening/audios/${audioId}/questions/create/`,
          questionSubmitData
        );
      }

      toast.success("تم إضافة التسجيل الصوتي والأسئلة بنجاح");
      navigate(`/dashboard/ielts/practice-exams/${examId}`);
    } catch (error) {
      console.error("Error creating listening audio:", error);
      if (error.response?.data) {
        toast.error(error.response.data.error || "فشل في إضافة التسجيل");
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
            <Headphones className="w-8 h-8 text-orange-600" />
            <h1 className="text-2xl font-bold text-gray-900">
              إضافة تسجيل Listening
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
            <span className="font-bold">التسجيل الصوتي</span>
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

      {/* Step 1: Audio Form */}
      {currentStep === 1 && (
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            بيانات التسجيل الصوتي
          </h2>

          <div className="space-y-6">
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-bold text-gray-900 mb-2"
              >
                عنوان التسجيل <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={audioData.title}
                onChange={handleAudioChange}
                className={`input ${errors.title ? "border-red-500" : ""}`}
                placeholder="مثال: Daily Conversation - At the Restaurant"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            {/* Audio File Upload */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                الملف الصوتي <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-4">
                <label className="btn-secondary cursor-pointer flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  {uploadingAudio ? "جاري الرفع..." : "رفع ملف صوتي"}
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleAudioUpload}
                    className="hidden"
                    disabled={uploadingAudio}
                  />
                </label>
                {audioUrl && (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-green-600">تم رفع الملف</span>
                  </div>
                )}
              </div>
              {errors.audio && (
                <p className="text-red-500 text-sm mt-1">{errors.audio}</p>
              )}
              {audioUrl && (
                <audio controls className="w-full mt-4">
                  <source src={audioUrl} />
                  متصفحك لا يدعم تشغيل الصوت
                </audio>
              )}
            </div>

            {/* Transcript */}
            <div>
              <label
                htmlFor="transcript"
                className="block text-sm font-bold text-gray-900 mb-2"
              >
                النص الكامل (Transcript) - اختياري
              </label>
              <textarea
                id="transcript"
                name="transcript"
                value={audioData.transcript}
                onChange={handleAudioChange}
                rows="6"
                className="input"
                placeholder="اكتب النص المنطوق في التسجيل..."
              />
            </div>

            {/* Duration */}
            <div>
              <label
                htmlFor="duration"
                className="block text-sm font-bold text-gray-900 mb-2"
              >
                المدة (ثانية)
              </label>
              <input
                type="number"
                id="duration"
                name="duration"
                value={audioData.duration}
                onChange={handleAudioChange}
                min="1"
                className={`input max-w-xs ${
                  errors.duration ? "border-red-500" : ""
                }`}
              />
              {errors.duration && (
                <p className="text-red-500 text-sm mt-1">{errors.duration}</p>
              )}
            </div>

            {/* Next Button */}
            <div className="flex items-center gap-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleNext}
                disabled={!audioUrl}
                className="btn-primary flex items-center gap-2 disabled:opacity-50"
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
                رجوع للتسجيل
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
                    <span>حفظ التسجيل والأسئلة</span>
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
