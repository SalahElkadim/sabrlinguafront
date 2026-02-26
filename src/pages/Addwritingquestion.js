import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowRight,
  PenTool,
  AlertCircle,
  CheckCircle,
  Image,
  Upload,
} from "lucide-react";
import { useQuestionBanksStore } from "../store/questionbanksstore";

const writingSchema = z.object({
  title: z.string().min(5, "العنوان يجب أن يكون 5 أحرف على الأقل"),
  question_text: z.string().min(10, "نص السؤال يجب أن يكون 10 أحرف على الأقل"),
  question_image: z.string().optional(),
  min_words: z
    .number()
    .min(50, "الحد الأدنى للكلمات يجب أن يكون 50 على الأقل")
    .default(100),
  max_words: z
    .number()
    .min(100, "الحد الأقصى للكلمات يجب أن يكون 100 على الأقل")
    .default(200),
  sample_answer: z
    .string()
    .min(50, "نموذج الإجابة يجب أن يكون 50 حرف على الأقل"),
  rubric: z.string().min(20, "معايير التصحيح يجب أن تكون 20 حرف على الأقل"),
  points: z.number().min(1, "النقاط يجب أن تكون 1 على الأقل").default(10),
  order: z.number().min(0).default(0),
});

export default function AddWritingQuestion() {
  const { bankId } = useParams();
  const navigate = useNavigate();
  const { addWritingQuestion, loading, error, clearError } =
    useQuestionBanksStore();
  const [success, setSuccess] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    resolver: zodResolver(writingSchema),
    defaultValues: {
      min_words: 100,
      max_words: 200,
      points: 10,
      order: 0,
    },
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith("image/")) {
      alert("الرجاء اختيار صورة فقط");
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("حجم الصورة يجب أن يكون أقل من 5 ميجابايت");
      return;
    }

    setUploadingImage(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "react_uploads"); // ✅ الجديد

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dyxozpomy/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      console.log("Writing question image uploaded:", data);

      if (data.error) {
        throw new Error(data.error.message);
      }

      if (data.secure_url) {
        setImageUrl(data.secure_url);
        setValue("question_image", data.secure_url);
      } else {
        throw new Error("لم يتم الحصول على رابط الصورة");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert(`حدث خطأ في رفع الصورة: ${err.message}`);
    } finally {
      setUploadingImage(false);
    }
  };

  const onSubmit = async (data) => {
    clearError();

    // Validate max_words > min_words
    if (data.max_words <= data.min_words) {
      alert("الحد الأقصى للكلمات يجب أن يكون أكبر من الحد الأدنى");
      return;
    }

    try {
      await addWritingQuestion(bankId, {
        ...data,
        is_active: true,
      });
      setSuccess(true);
      reset();
      setImageUrl("");
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      console.error("Add question error:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to={`/dashboard/question-banks/${bankId}`}
          className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowRight className="w-5 h-5 text-gray-600" />
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
            <PenTool className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              إضافة سؤال كتابة
            </h1>
            <p className="text-gray-600">أضف سؤال كتابة جديد لبنك الأسئلة</p>
          </div>
        </div>
      </div>

      {/* Success Alert */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start gap-3">
          <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm">تم إضافة السؤال بنجاح!</p>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info */}
        <div className="card">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            المعلومات الأساسية
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                عنوان السؤال <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                {...register("title")}
                className={`input ${errors.title ? "border-red-500" : ""}`}
                placeholder="مثال: Write About Your Daily Routine"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نص السؤال <span className="text-red-600">*</span>
              </label>
              <textarea
                {...register("question_text")}
                rows={4}
                className={`input ${
                  errors.question_text ? "border-red-500" : ""
                }`}
                placeholder="مثال: Write a paragraph describing your daily routine from morning to evening. Use present simple tense."
              />
              {errors.question_text && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.question_text.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                صورة السؤال (اختياري)
              </label>
              <div className="flex items-center gap-4">
                <label className="btn btn-secondary cursor-pointer flex items-center gap-2">
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
                    <Image className="w-4 h-4 text-green-600" />
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
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            متطلبات عدد الكلمات
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الحد الأدنى للكلمات <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                {...register("min_words", { valueAsNumber: true })}
                className={`input ${errors.min_words ? "border-red-500" : ""}`}
                min="50"
              />
              {errors.min_words && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.min_words.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الحد الأقصى للكلمات <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                {...register("max_words", { valueAsNumber: true })}
                className={`input ${errors.max_words ? "border-red-500" : ""}`}
                min="100"
              />
              {errors.max_words && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.max_words.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Sample Answer */}
        <div className="card">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            نموذج الإجابة
          </h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              نموذج إجابة مثالي <span className="text-red-600">*</span>
            </label>
            <textarea
              {...register("sample_answer")}
              rows={6}
              className={`input ${
                errors.sample_answer ? "border-red-500" : ""
              }`}
              placeholder="اكتب نموذج إجابة مثالي يمكن للطلاب الاسترشاد به..."
            />
            {errors.sample_answer && (
              <p className="mt-1 text-sm text-red-600">
                {errors.sample_answer.message}
              </p>
            )}
          </div>
        </div>

        {/* Rubric */}
        <div className="card">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            معايير التصحيح (Rubric)
          </h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              معايير التصحيح <span className="text-red-600">*</span>
            </label>
            <textarea
              {...register("rubric")}
              rows={6}
              className={`input ${errors.rubric ? "border-red-500" : ""}`}
              placeholder={`مثال:\n- Grammar and vocabulary usage (40%)\n- Organization and coherence (30%)\n- Task achievement (20%)\n- Mechanics (spelling, punctuation) (10%)`}
            />
            {errors.rubric && (
              <p className="mt-1 text-sm text-red-600">
                {errors.rubric.message}
              </p>
            )}
          </div>
        </div>

        {/* Additional Settings */}
        <div className="card">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            إعدادات إضافية
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                النقاط
              </label>
              <input
                type="number"
                {...register("points", { valueAsNumber: true })}
                className="input"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الترتيب
              </label>
              <input
                type="number"
                {...register("order", { valueAsNumber: true })}
                className="input"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 btn btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "جاري الإضافة..." : "إضافة السؤال"}
          </button>
          <Link
            to={`/dashboard/question-banks/${bankId}`}
            className="btn btn-secondary px-6 py-3"
          >
            إلغاء
          </Link>
        </div>
      </form>
    </div>
  );
}
