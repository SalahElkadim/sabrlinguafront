// src/pages/AddListeningContent.js - WITH SOLVED QUESTIONS
import { useEffect, useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowRight,
  Save,
  AlertCircle,
  CheckCircle,
  Headphones,
  Loader2,
  Music,
  FileText,
  Clock,
  Upload,
  HelpCircle,
  Plus,
  Trash2,
} from "lucide-react";

// ✅ UPDATED SCHEMA - مع الأسئلة المحلولة
const listeningContentSchema = z.object({
  lesson: z.number(),
  title: z.string().min(3, "عنوان التسجيل مطلوب"),
  audio_file: z.string().min(1, "ملف الصوت مطلوب"),
  transcript: z.string().optional(),
  duration: z.string().optional(),
  order: z.string().optional(),
  questions: z
    .array(
      z.object({
        question_text: z.string().min(5, "نص السؤال مطلوب"),
        question_image: z.any().optional(),
        choice_a: z.string().min(1, "الاختيار أ مطلوب"),
        choice_b: z.string().min(1, "الاختيار ب مطلوب"),
        choice_c: z.string().min(1, "الاختيار ج مطلوب"),
        choice_d: z.string().min(1, "الاختيار د مطلوب"),
        correct_answer: z.enum(["A", "B", "C", "D"], {
          errorMap: () => ({ message: "يجب اختيار الإجابة الصحيحة" }),
        }),
        explanation: z.string().optional(),
        points: z.number().optional().default(1),
        order: z.number().optional(),
      })
    )
    .optional()
    .default([]),
  explanation: z.string().optional(),
});

export default function AddListeningContent() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [lesson, setLesson] = useState(null);
  const [audioUrl, setAudioUrl] = useState("");
  const [uploadingAudio, setUploadingAudio] = useState(false);
  const [audioPreview, setAudioPreview] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(listeningContentSchema),
    defaultValues: {
      lesson: parseInt(lessonId),
      title: "",
      audio_file: "",
      transcript: "",
      duration: "",
      order: "1",
      questions: [],
      explanation: "",
    },
  });

  // 🆕 Field Array للأسئلة
  const {
    fields: questionFields,
    append: appendQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    control,
    name: "questions",
  });

  const watchedTranscript = watch("transcript");

  useEffect(() => {
    fetchLessonData();
  }, [lessonId]);

  const fetchLessonData = async () => {
    try {
      const response = await fetch(
        `https://sabrlinguaa-production.up.railway.app/levels/lessons/${lessonId}/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      if (!response.ok) throw new Error("فشل تحميل بيانات الدرس");

      const data = await response.json();
      if (data.lesson_type !== "LISTENING") {
        setError("هذا الدرس ليس من نوع الاستماع");
        return;
      }
      setLesson(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAudioUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("audio/")) {
      setError("الرجاء اختيار ملف صوتي فقط");
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setError("حجم الملف يجب أن يكون أقل من 50 ميجابايت");
      return;
    }

    setUploadingAudio(true);
    setError(null);

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
      console.log("Audio file uploaded:", data);

      if (data.error) {
        throw new Error(data.error.message);
      }

      if (data.secure_url) {
        setAudioUrl(data.secure_url);
        setAudioPreview(data.secure_url);
        setValue("audio_file", data.secure_url);

        if (data.duration) {
          setValue("duration", Math.round(data.duration).toString());
        }
      } else {
        throw new Error("لم يتم الحصول على رابط الملف");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError(`حدث خطأ في رفع الملف: ${err.message}`);
    } finally {
      setUploadingAudio(false);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);

    try {
      // ✅ إعداد الأسئلة
      const questions = data.questions
        ?.filter((q) => q.question_text && q.choice_a && q.choice_b)
        .map((q, index) => ({
          question_text: q.question_text,
          question_image: null,
          choice_a: q.choice_a,
          choice_b: q.choice_b,
          choice_c: q.choice_c,
          choice_d: q.choice_d,
          correct_answer: q.correct_answer,
          explanation: q.explanation || "",
          points: q.points || 1,
          order: index + 1,
        }));

      const payload = {
        lesson: data.lesson,
        title: data.title,
        audio_file: data.audio_file,
        transcript: data.transcript || "",
        duration: data.duration || "0",
        order: data.order || "1",
        questions: questions || [], // 🆕
        explanation: data.explanation || "",
      };

      console.log("📤 Sending payload:", payload);

      const response = await fetch(
        "https://sabrlinguaa-production.up.railway.app/levels/lesson-content/listening/create-with-audio/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "فشل إضافة المحتوى");
      }

      const result = await response.json();
      console.log("✅ Success:", result);

      setSuccess(true);
      setTimeout(() => {
        navigate(`/dashboard/lessons/${lessonId}`);
      }, 1500);
    } catch (err) {
      setError(err.message);
      console.error("❌ Error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!lesson) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            تم إضافة محتوى الاستماع بنجاح!
          </h2>
          <p className="text-gray-600 mb-6">جاري التحويل...</p>
          <div className="animate-spin inline-block w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to={`/dashboard/lessons/${lessonId}`}
          className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowRight className="w-5 h-5 text-gray-600" />
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
            <Headphones className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              إضافة محتوى درس الاستماع
            </h1>
            <p className="text-gray-600 mt-1">{lesson.title}</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="card">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* ========== AUDIO SECTION ========== */}
          <div className="space-y-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-center gap-2">
              <Music className="w-5 h-5 text-purple-600" />
              <h3 className="font-bold text-purple-900">
                بيانات التسجيل الصوتي
              </h3>
            </div>

            {/* Audio Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                عنوان التسجيل <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                {...register("title")}
                className={`input ${errors.title ? "border-red-500" : ""}`}
                placeholder="مثال: Conversation at Restaurant"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Audio File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ملف الصوت <span className="text-red-600">*</span>
              </label>
              <div className="flex items-center gap-4">
                <label className="btn btn-secondary cursor-pointer flex items-center gap-2">
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
                  <span className="text-sm text-green-600 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    تم رفع الملف بنجاح
                  </span>
                )}
              </div>
              {errors.audio_file && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.audio_file.message}
                </p>
              )}

              {/* Audio Preview */}
              {audioPreview && (
                <div className="mt-3">
                  <audio controls className="w-full" src={audioPreview}>
                    المتصفح لا يدعم تشغيل الملفات الصوتية
                  </audio>
                </div>
              )}
            </div>

            {/* Transcript */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                النص الكتابي (Transcript) - اختياري
              </label>
              <textarea
                {...register("transcript")}
                rows="6"
                className="input"
                placeholder="اكتب النص الكتابي للتسجيل الصوتي...

مثال:
Waiter: Good morning! Welcome to our restaurant.
Customer: Good morning! Can I see the menu, please?"
              />
              {watchedTranscript && (
                <p className="mt-1 text-xs text-gray-500">
                  {watchedTranscript.length} حرف
                </p>
              )}
            </div>

            {/* Duration & Order */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  مدة التسجيل (بالثواني) - اختياري
                </label>
                <input
                  type="number"
                  {...register("duration")}
                  className="input"
                  placeholder="120"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الترتيب
                </label>
                <input
                  type="number"
                  {...register("order")}
                  className="input"
                  defaultValue="1"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* ========== 🆕 QUESTIONS SECTION ========== */}
          <div className="space-y-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-orange-600" />
                <h3 className="font-bold text-orange-900">
                  الأسئلة المحلولة (اختياري)
                </h3>
              </div>
              <button
                type="button"
                onClick={() =>
                  appendQuestion({
                    question_text: "",
                    choice_a: "",
                    choice_b: "",
                    choice_c: "",
                    choice_d: "",
                    correct_answer: "A",
                    explanation: "",
                    points: 1,
                  })
                }
                className="btn btn-secondary btn-sm"
              >
                <Plus className="w-4 h-4 ml-2" />
                إضافة سؤال
              </button>
            </div>

            {questionFields.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <HelpCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">لم يتم إضافة أسئلة بعد</p>
                <p className="text-xs mt-1">
                  اضغط على "إضافة سؤال" لبدء إضافة الأسئلة المحلولة
                </p>
              </div>
            )}

            <div className="space-y-4">
              {questionFields.map((field, index) => (
                <div
                  key={field.id}
                  className="p-4 bg-white border border-orange-300 rounded-lg space-y-3"
                >
                  {/* Question Header */}
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-gray-800">
                      السؤال {index + 1}
                    </h4>
                    <button
                      type="button"
                      onClick={() => removeQuestion(index)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Question Text */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      نص السؤال <span className="text-red-600">*</span>
                    </label>
                    <textarea
                      {...register(`questions.${index}.question_text`)}
                      rows="2"
                      className={`input ${
                        errors.questions?.[index]?.question_text
                          ? "border-red-500"
                          : ""
                      }`}
                      placeholder="مثال: What did the customer order?"
                    />
                    {errors.questions?.[index]?.question_text && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.questions[index].question_text.message}
                      </p>
                    )}
                  </div>

                  {/* Choices Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        أ) <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        {...register(`questions.${index}.choice_a`)}
                        className={`input ${
                          errors.questions?.[index]?.choice_a
                            ? "border-red-500"
                            : ""
                        }`}
                        placeholder="الاختيار الأول"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ب) <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        {...register(`questions.${index}.choice_b`)}
                        className={`input ${
                          errors.questions?.[index]?.choice_b
                            ? "border-red-500"
                            : ""
                        }`}
                        placeholder="الاختيار الثاني"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ج) <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        {...register(`questions.${index}.choice_c`)}
                        className={`input ${
                          errors.questions?.[index]?.choice_c
                            ? "border-red-500"
                            : ""
                        }`}
                        placeholder="الاختيار الثالث"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        د) <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        {...register(`questions.${index}.choice_d`)}
                        className={`input ${
                          errors.questions?.[index]?.choice_d
                            ? "border-red-500"
                            : ""
                        }`}
                        placeholder="الاختيار الرابع"
                      />
                    </div>
                  </div>

                  {/* Correct Answer */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الإجابة الصحيحة <span className="text-red-600">*</span>
                    </label>
                    <div className="flex gap-3">
                      {["A", "B", "C", "D"].map((choice) => (
                        <label
                          key={choice}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="radio"
                            {...register(`questions.${index}.correct_answer`)}
                            value={choice}
                            className="w-4 h-4 text-orange-600 focus:ring-orange-500"
                          />
                          <span className="text-sm font-medium">
                            {choice === "A" && "أ"}
                            {choice === "B" && "ب"}
                            {choice === "C" && "ج"}
                            {choice === "D" && "د"}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Explanation */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      شرح الإجابة (اختياري)
                    </label>
                    <textarea
                      {...register(`questions.${index}.explanation`)}
                      rows="2"
                      className="input"
                      placeholder="مثال: The customer ordered coffee..."
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ========== EXPLANATION ========== */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              شرح الدرس (اختياري)
            </label>
            <textarea
              {...register("explanation")}
              rows="6"
              className="input"
              placeholder="اكتب شرحاً عاماً عن الدرس..."
            />
            <p className="mt-1 text-xs text-gray-500">
              يمكنك إضافة ملاحظات أو نصائح للطالب حول التسجيل الصوتي
            </p>
          </div>

          {/* ========== ACTIONS ========== */}
          <div className="flex gap-3 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading || !audioUrl || uploadingAudio}
              className="flex-1 btn btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  جاري الحفظ...
                </span>
              ) : (
                <>
                  <Save className="w-5 h-5 ml-2" />
                  حفظ المحتوى
                </>
              )}
            </button>
            <Link
              to={`/dashboard/lessons/${lessonId}`}
              className="btn btn-secondary px-8 py-3"
            >
              إلغاء
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
