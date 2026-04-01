// src/pages/AddSpeakingToPracticeExam.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Plus,
  X,
  Video,
  Upload,
  CheckCircle,
} from "lucide-react";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function AddSpeakingToPracticeExam() {
  const navigate = useNavigate();
  const { examId } = useParams();
  const [loading, setLoading] = useState(false);
  const [examInfo, setExamInfo] = useState(null);
  const [currentStep, setCurrentStep] = useState(1); // 1: Video, 2: Questions

  // Video Data
  const [videoData, setVideoData] = useState({
    title: "",
    description: "",
    duration: 120,
  });

  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);

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

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith("video/")) {
      toast.error("الرجاء اختيار ملف فيديو فقط");
      return;
    }

    // Check file size (max 100MB)
    if (file.size > 100 * 1024 * 1024) {
      toast.error("حجم الفيديو يجب أن يكون أقل من 100 ميجابايت");
      return;
    }

    setUploadingVideo(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "react_uploads");
    formData.append("resource_type", "video");

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
        setVideoUrl(data.secure_url);

        // لو Cloudinary رجع thumbnail تلقائي
        if (data.thumbnail_url) {
          setThumbnailUrl(data.thumbnail_url);
        }

        // لو في duration من Cloudinary
        if (data.duration) {
          setVideoData((prev) => ({
            ...prev,
            duration: Math.round(data.duration),
          }));
        }

        toast.success("تم رفع الفيديو بنجاح");
      } else {
        throw new Error("لم يتم الحصول على رابط الفيديو");
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error(`حدث خطأ في رفع الفيديو: ${err.message}`);
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleThumbnailUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast.error("الرجاء اختيار صورة فقط");
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("حجم الصورة يجب أن يكون أقل من 5 ميجابايت");
      return;
    }

    setUploadingThumbnail(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "react_uploads");

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dyxozpomy/image/upload",
        { method: "POST", body: formData }
      );

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      if (data.secure_url) {
        setThumbnailUrl(data.secure_url);
        toast.success("تم رفع الصورة المصغرة بنجاح");
      } else {
        throw new Error("لم يتم الحصول على رابط الصورة");
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error(`حدث خطأ في رفع الصورة: ${err.message}`);
    } finally {
      setUploadingThumbnail(false);
    }
  };

  const handleVideoChange = (e) => {
    const { name, value } = e.target;
    setVideoData((prev) => ({
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

  const validateVideo = () => {
    const newErrors = {};

    if (!videoData.title.trim()) {
      newErrors.title = "عنوان الفيديو مطلوب";
    }

    if (!videoUrl) {
      newErrors.video = "يجب رفع ملف الفيديو";
    }

    if (videoData.duration < 1) {
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
    if (validateVideo()) {
      setCurrentStep(2);
    } else {
      toast.error("يرجى تصحيح الأخطاء في بيانات الفيديو");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateQuestions()) {
      return;
    }

    try {
      setLoading(true);

      // Step 1: Create speaking video
      const videoSubmitData = {
        ielts_lesson_pack: examInfo.lesson_pack,
        usage_type: "IELTS",
        title: videoData.title,
        video_file: videoUrl,
        description: videoData.description,
        duration: parseInt(videoData.duration),
        thumbnail: thumbnailUrl || null,
        is_active: true,
      };

      const videoResponse = await api.post(
        "/ielts/speaking/videos/create/",
        videoSubmitData
      );
      const videoId = videoResponse.data.video.id;

      // Step 2: Create questions for this video
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
          `/ielts/speaking/videos/${videoId}/questions/create/`,
          questionSubmitData
        );
      }

      toast.success("تم إضافة الفيديو والأسئلة بنجاح");
      navigate(`/dashboard/ielts/practice-exams/${examId}`);
    } catch (error) {
      console.error("Error creating speaking video:", error);
      if (error.response?.data) {
        toast.error(error.response.data.error || "فشل في إضافة الفيديو");
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
            <Video className="w-8 h-8 text-purple-600" />
            <h1 className="text-2xl font-bold text-gray-900">
              إضافة فيديو Speaking
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
            <span className="font-bold">الفيديو</span>
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

      {/* Step 1: Video Form */}
      {currentStep === 1 && (
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            بيانات الفيديو
          </h2>

          <div className="space-y-6">
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-bold text-gray-900 mb-2"
              >
                عنوان الفيديو <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={videoData.title}
                onChange={handleVideoChange}
                className={`input ${errors.title ? "border-red-500" : ""}`}
                placeholder="مثال: How to Introduce Yourself"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            {/* Video File Upload */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                ملف الفيديو <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-4">
                <label className="btn-secondary cursor-pointer flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  {uploadingVideo ? "جاري الرفع..." : "رفع فيديو"}
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="hidden"
                    disabled={uploadingVideo}
                  />
                </label>
                {videoUrl && (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-green-600">
                      تم رفع الفيديو
                    </span>
                  </div>
                )}
              </div>
              {errors.video && (
                <p className="text-red-500 text-sm mt-1">{errors.video}</p>
              )}
              {videoUrl && (
                <video controls className="w-full max-w-2xl mt-4 rounded-lg">
                  <source src={videoUrl} />
                  متصفحك لا يدعم تشغيل الفيديو
                </video>
              )}
            </div>

            {/* Thumbnail Upload */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                صورة مصغرة (Thumbnail) - اختياري
              </label>
              <div className="flex items-center gap-4">
                <label className="btn-secondary cursor-pointer flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  {uploadingThumbnail ? "جاري الرفع..." : "رفع صورة"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailUpload}
                    className="hidden"
                    disabled={uploadingThumbnail}
                  />
                </label>
                {thumbnailUrl && (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-green-600">
                      تم رفع الصورة
                    </span>
                  </div>
                )}
              </div>
              {thumbnailUrl && (
                <img
                  src={thumbnailUrl}
                  alt="Thumbnail"
                  className="mt-4 max-w-xs rounded-lg border"
                />
              )}
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-bold text-gray-900 mb-2"
              >
                الوصف - اختياري
              </label>
              <textarea
                id="description"
                name="description"
                value={videoData.description}
                onChange={handleVideoChange}
                rows="3"
                className="input"
                placeholder="وصف مختصر عن الفيديو..."
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
                value={videoData.duration}
                onChange={handleVideoChange}
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
                disabled={!videoUrl}
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
                رجوع للفيديو
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
                    <span>حفظ الفيديو والأسئلة</span>
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
