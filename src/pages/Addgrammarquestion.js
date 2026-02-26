import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowRight,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Image,
  Upload,
} from "lucide-react";
import { useQuestionBanksStore } from "../store/questionbanksstore";

const grammarSchema = z.object({
  question_set_title: z
    .string()
    .min(3, "عنوان المجموعة يجب أن يكون 3 أحرف على الأقل"),
  question_set_description: z.string().optional(),
  question_text: z.string().min(5, "نص السؤال يجب أن يكون 5 أحرف على الأقل"),
  question_image: z.string().optional(),
  choice_a: z.string().min(1, "الخيار أ مطلوب"),
  choice_b: z.string().min(1, "الخيار ب مطلوب"),
  choice_c: z.string().min(1, "الخيار ج مطلوب"),
  choice_d: z.string().min(1, "الخيار د مطلوب"),
  correct_answer: z.enum(["A", "B", "C", "D"], {
    errorMap: () => ({ message: "يجب اختيار الإجابة الصحيحة" }),
  }),
  explanation: z.string().min(5, "الشرح يجب أن يكون 5 أحرف على الأقل"),
  points: z.number().min(1, "النقاط يجب أن تكون 1 على الأقل").default(1),
  order: z.number().min(0).default(0),
});

export default function AddGrammarQuestion() {
  const { bankId } = useParams();
  const navigate = useNavigate();
  const { addGrammarQuestion, loading, error, clearError } =
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
    resolver: zodResolver(grammarSchema),
    defaultValues: {
      points: 1,
      order: 0,
      correct_answer: "A",
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
      console.log("Grammar question image uploaded:", data);

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
    try {
      await addGrammarQuestion(bankId, {
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
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              إضافة سؤال قواعد
            </h1>
            <p className="text-gray-600">أضف سؤال قواعد جديد لبنك الأسئلة</p>
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
        {/* Question Set Info */}
        <div className="card">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            معلومات المجموعة
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                عنوان المجموعة <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                {...register("question_set_title")}
                className={`input ${
                  errors.question_set_title ? "border-red-500" : ""
                }`}
                placeholder="مثال: Present Simple Tense"
              />
              {errors.question_set_title && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.question_set_title.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                وصف المجموعة (اختياري)
              </label>
              <textarea
                {...register("question_set_description")}
                rows={2}
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
                نص السؤال <span className="text-red-600">*</span>
              </label>
              <textarea
                {...register("question_text")}
                rows={3}
                className={`input ${
                  errors.question_text ? "border-red-500" : ""
                }`}
                placeholder="مثال: She _____ to school every day."
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

        {/* Choices */}
        <div className="card">
          <h2 className="text-lg font-bold text-gray-900 mb-4">الخيارات</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["a", "b", "c", "d"].map((choice) => (
              <div key={choice}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الخيار {choice.toUpperCase()}{" "}
                  <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  {...register(`choice_${choice}`)}
                  className={`input ${
                    errors[`choice_${choice}`] ? "border-red-500" : ""
                  }`}
                  placeholder={`أدخل الخيار ${choice.toUpperCase()}`}
                />
                {errors[`choice_${choice}`] && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors[`choice_${choice}`].message}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Correct Answer & Explanation */}
        <div className="card">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            الإجابة الصحيحة والشرح
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الإجابة الصحيحة <span className="text-red-600">*</span>
              </label>
              <div className="grid grid-cols-4 gap-3">
                {["A", "B", "C", "D"].map((choice) => (
                  <label
                    key={choice}
                    className={`flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      errors.correct_answer
                        ? "border-red-500"
                        : "border-gray-300 hover:border-primary-500"
                    }`}
                  >
                    <input
                      type="radio"
                      value={choice}
                      {...register("correct_answer")}
                      className="mr-2"
                    />
                    <span className="font-medium">{choice}</span>
                  </label>
                ))}
              </div>
              {errors.correct_answer && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.correct_answer.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الشرح <span className="text-red-600">*</span>
              </label>
              <textarea
                {...register("explanation")}
                rows={3}
                className={`input ${
                  errors.explanation ? "border-red-500" : ""
                }`}
                placeholder="اشرح القاعدة النحوية المستخدمة في هذا السؤال..."
              />
              {errors.explanation && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.explanation.message}
                </p>
              )}
            </div>
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
