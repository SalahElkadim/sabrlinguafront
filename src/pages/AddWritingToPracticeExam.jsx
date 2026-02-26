// src/pages/AddWritingToPracticeExam.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Save, Edit, Upload, CheckCircle } from "lucide-react";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function AddWritingToPracticeExam() {
  const navigate = useNavigate();
  const { examId } = useParams();
  const [loading, setLoading] = useState(false);
  const [examInfo, setExamInfo] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    question_text: "",
    question_image: "",
    min_words: 100,
    max_words: 200,
    sample_answer: "",
    rubric: "",
    points: 10,
    pass_threshold: 60,
  });

  const [imageUrl, setImageUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
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

  const handleImageUpload = async (e) => {
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

    setUploadingImage(true);
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
        setImageUrl(data.secure_url);
        setFormData((prev) => ({
          ...prev,
          question_image: data.secure_url,
        }));
        toast.success("تم رفع الصورة بنجاح");
      } else {
        throw new Error("لم يتم الحصول على رابط الصورة");
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error(`حدث خطأ في رفع الصورة: ${err.message}`);
    } finally {
      setUploadingImage(false);
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

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "عنوان السؤال مطلوب";
    }

    if (!formData.question_text.trim()) {
      newErrors.question_text = "نص السؤال مطلوب";
    }

    if (formData.min_words < 50) {
      newErrors.min_words = "الحد الأدنى للكلمات يجب أن يكون 50 على الأقل";
    }

    if (formData.max_words < 100) {
      newErrors.max_words = "الحد الأقصى للكلمات يجب أن يكون 100 على الأقل";
    }

    if (formData.max_words <= formData.min_words) {
      newErrors.max_words =
        "الحد الأقصى للكلمات يجب أن يكون أكبر من الحد الأدنى";
    }

    if (!formData.sample_answer.trim()) {
      newErrors.sample_answer = "نموذج الإجابة مطلوب";
    }

    if (!formData.rubric.trim()) {
      newErrors.rubric = "معايير التصحيح مطلوبة";
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

      const submitData = {
        ...formData,
        ielts_lesson_pack: examInfo.lesson_pack,
        usage_type: "IELTS",
        min_words: parseInt(formData.min_words),
        max_words: parseInt(formData.max_words),
        points: parseInt(formData.points),
        pass_threshold: parseInt(formData.pass_threshold),
        is_active: true,
      };

      await api.post("/ielts/writing/questions/create/", submitData);

      toast.success("تم إضافة سؤال الكتابة بنجاح");
      navigate(`/dashboard/ielts/practice-exams/${examId}`);
    } catch (error) {
      console.error("Error creating writing question:", error);
      if (error.response?.data) {
        toast.error(error.response.data.error || "فشل في إضافة السؤال");
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
            <Edit className="w-8 h-8 text-red-600" />
            <h1 className="text-2xl font-bold text-gray-900">
              إضافة سؤال Writing
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
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            المعلومات الأساسية
          </h2>
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-bold text-gray-900 mb-2"
              >
                عنوان السؤال <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`input ${errors.title ? "border-red-500" : ""}`}
                placeholder="مثال: Write About Your Daily Routine"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

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
                rows="4"
                className={`input ${
                  errors.question_text ? "border-red-500" : ""
                }`}
                placeholder="مثال: Write a paragraph describing your daily routine from morning to evening..."
              />
              {errors.question_text && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.question_text}
                </p>
              )}
            </div>

            {/* Question Image */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                صورة السؤال (اختياري)
              </label>
              <div className="flex items-center gap-4">
                <label className="btn-secondary cursor-pointer flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  {uploadingImage ? "جاري الرفع..." : "رفع صورة"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploadingImage}
                  />
                </label>
                {imageUrl && (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-green-600">
                      تم رفع الصورة
                    </span>
                  </div>
                )}
              </div>
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Question"
                  className="mt-4 max-w-xs rounded-lg border border-gray-200"
                />
              )}
            </div>
          </div>
        </div>

        {/* Word Count Requirements */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            متطلبات عدد الكلمات
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="min_words"
                className="block text-sm font-bold text-gray-900 mb-2"
              >
                الحد الأدنى للكلمات <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="min_words"
                name="min_words"
                value={formData.min_words}
                onChange={handleChange}
                min="50"
                className={`input ${errors.min_words ? "border-red-500" : ""}`}
              />
              {errors.min_words && (
                <p className="text-red-500 text-sm mt-1">{errors.min_words}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="max_words"
                className="block text-sm font-bold text-gray-900 mb-2"
              >
                الحد الأقصى للكلمات <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="max_words"
                name="max_words"
                value={formData.max_words}
                onChange={handleChange}
                min="100"
                className={`input ${errors.max_words ? "border-red-500" : ""}`}
              />
              {errors.max_words && (
                <p className="text-red-500 text-sm mt-1">{errors.max_words}</p>
              )}
            </div>
          </div>
        </div>

        {/* Sample Answer */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            نموذج الإجابة
          </h2>
          <div>
            <label
              htmlFor="sample_answer"
              className="block text-sm font-bold text-gray-900 mb-2"
            >
              نموذج إجابة مثالي <span className="text-red-500">*</span>
            </label>
            <textarea
              id="sample_answer"
              name="sample_answer"
              value={formData.sample_answer}
              onChange={handleChange}
              rows="6"
              className={`input ${
                errors.sample_answer ? "border-red-500" : ""
              }`}
              placeholder="اكتب نموذج إجابة مثالي يمكن للطلاب الاسترشاد به..."
            />
            {errors.sample_answer && (
              <p className="text-red-500 text-sm mt-1">
                {errors.sample_answer}
              </p>
            )}
          </div>
        </div>

        {/* Rubric */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            معايير التصحيح (Rubric)
          </h2>
          <div>
            <label
              htmlFor="rubric"
              className="block text-sm font-bold text-gray-900 mb-2"
            >
              معايير التصحيح <span className="text-red-500">*</span>
            </label>
            <textarea
              id="rubric"
              name="rubric"
              value={formData.rubric}
              onChange={handleChange}
              rows="6"
              className={`input ${errors.rubric ? "border-red-500" : ""}`}
              placeholder={`مثال:\n- Grammar and vocabulary usage (40%)\n- Organization and coherence (30%)\n- Task achievement (20%)\n- Mechanics (spelling, punctuation) (10%)`}
            />
            {errors.rubric && (
              <p className="text-red-500 text-sm mt-1">{errors.rubric}</p>
            )}
          </div>
        </div>

        {/* Additional Settings */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            إعدادات إضافية
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                min="1"
                className="input"
              />
            </div>

            <div>
              <label
                htmlFor="pass_threshold"
                className="block text-sm font-bold text-gray-900 mb-2"
              >
                نسبة النجاح (%)
              </label>
              <input
                type="number"
                id="pass_threshold"
                name="pass_threshold"
                value={formData.pass_threshold}
                onChange={handleChange}
                min="0"
                max="100"
                className="input"
              />
            </div>
          </div>
        </div>

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
