// src/pages/AddWritingContent.js
import { useEffect, useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowRight,
  Save,
  AlertCircle,
  CheckCircle,
  PenTool,
  Loader2,
  FileText,
  Info,
} from "lucide-react";

const writingContentSchema = z.object({
  lesson: z.number(),
  title: z.string().min(3, "العنوان يجب أن يكون 3 أحرف على الأقل"),
  writing_passage: z
    .string()
    .min(50, "القطعة النموذجية يجب أن تكون 50 حرف على الأقل"),
  instructions: z.string().min(20, "التعليمات يجب أن تكون 20 حرف على الأقل"),
  sample_answer: z.string().optional(),
});

export default function AddWritingContent() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [lesson, setLesson] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(writingContentSchema),
    defaultValues: {
      lesson: parseInt(lessonId),
    },
  });

  const watchedTitle = watch("title");
  const watchedPassage = watch("writing_passage");
  const watchedInstructions = watch("instructions");
  const watchedSampleAnswer = watch("sample_answer");

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
      if (data.lesson_type !== "WRITING") {
        setError("هذا الدرس ليس من نوع الكتابة");
        return;
      }
      setLesson(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "https://sabrlinguaa-production.up.railway.app/levels/lesson-content/writing/create/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "فشل إضافة المحتوى");
      }

      setSuccess(true);
      setTimeout(() => {
        navigate(`/dashboard/lessons/${lessonId}`);
      }, 1500);
    } catch (err) {
      setError(err.message);
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
            تم إضافة محتوى الكتابة بنجاح!
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
          <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
            <PenTool className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              إضافة محتوى درس الكتابة
            </h1>
            <p className="text-gray-600 mt-1">{lesson.title}</p>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-2">عن محتوى درس الكتابة:</p>
            <ul className="space-y-1 text-xs">
              <li>
                • <strong>القطعة النموذجية:</strong> قطعة مكتوبة يتعلم منها
                الطالب
              </li>
              <li>
                • <strong>التعليمات:</strong> إرشادات للطالب حول ما يجب كتابته
              </li>
              <li>
                • <strong>نموذج الإجابة:</strong> مثال للإجابة المثالية
                (اختياري)
              </li>
            </ul>
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

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              عنوان المحتوى <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              {...register("title")}
              className={`input ${errors.title ? "border-red-500" : ""}`}
              placeholder="مثال: Writing about your family"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">
                {errors.title.message}
              </p>
            )}
            {watchedTitle && (
              <p className="mt-1 text-xs text-gray-500">
                {watchedTitle.length} حرف
              </p>
            )}
          </div>

          {/* Writing Passage */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              القطعة الكتابية النموذجية <span className="text-red-600">*</span>
            </label>
            <textarea
              {...register("writing_passage")}
              rows="8"
              className={`input ${
                errors.writing_passage ? "border-red-500" : ""
              }`}
              placeholder="اكتب قطعة نموذجية يتعلم منها الطالب... مثال:

My family is small but close. I have two brothers and one sister. My father works as a teacher and my mother is a doctor. We live in a nice house near the city center. On weekends, we like to spend time together at the park or watch movies at home. I love my family very much because they always support me."
            />
            {errors.writing_passage && (
              <p className="mt-1 text-sm text-red-600">
                {errors.writing_passage.message}
              </p>
            )}
            {watchedPassage && (
              <p className="mt-1 text-xs text-gray-500">
                {watchedPassage.length} حرف - الحد الأدنى: 50 حرف
              </p>
            )}
          </div>

          {/* Instructions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              تعليمات الكتابة <span className="text-red-600">*</span>
            </label>
            <textarea
              {...register("instructions")}
              rows="6"
              className={`input ${errors.instructions ? "border-red-500" : ""}`}
              placeholder="اكتب التعليمات والإرشادات للطالب... مثال:

Write a paragraph about your family (80-120 words). Include the following:
- How many family members you have
- What they do (jobs/school)
- Where you live
- What you like to do together
- Why you love your family

Remember to:
- Use complete sentences
- Check your spelling and grammar
- Organize your ideas clearly"
            />
            {errors.instructions && (
              <p className="mt-1 text-sm text-red-600">
                {errors.instructions.message}
              </p>
            )}
            {watchedInstructions && (
              <p className="mt-1 text-xs text-gray-500">
                {watchedInstructions.length} حرف - الحد الأدنى: 20 حرف
              </p>
            )}
          </div>

          {/* Sample Answer */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              نموذج الإجابة (اختياري)
            </label>
            <textarea
              {...register("sample_answer")}
              rows="8"
              className="input"
              placeholder="اكتب نموذج إجابة مثالي للطالب (اختياري)... مثال:

I come from a family of five people. My father is an engineer and my mother teaches at the primary school. I have an older brother who is studying medicine at university, and a younger sister who is still in high school.

We live in a comfortable apartment in the suburbs, which is quiet and peaceful. Every Friday evening, we have dinner together and share stories about our week. During summer holidays, we often travel to the beach.

I love my family because they are always there for me. They encourage me to do my best in everything and support all my decisions. Family is the most important thing in my life."
            />
            {watchedSampleAnswer && (
              <p className="mt-1 text-xs text-gray-500">
                {watchedSampleAnswer.length} حرف
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              نموذج الإجابة يساعد الطالب على فهم المستوى المطلوب
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading}
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
