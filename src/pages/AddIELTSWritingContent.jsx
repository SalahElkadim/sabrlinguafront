// src/pages/AddIELTSWritingContent.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Save, Edit, Loader2, AlertCircle } from "lucide-react";
import { ieltsLessonsAPI } from "../services/Ieltsservice";
import api from "../api/axios";
import toast from "react-hot-toast";

const schema = z
  .object({
    title: z.string().min(3, "العنوان مطلوب"),
    question_text: z.string().min(10, "نص السؤال مطلوب"),
    min_words: z
      .number({ invalid_type_error: "أدخل رقماً" })
      .min(1, "الحد الأدنى مطلوب"),
    max_words: z
      .number({ invalid_type_error: "أدخل رقماً" })
      .min(1, "الحد الأقصى مطلوب"),
    sample_answer: z.string().min(20, "الإجابة النموذجية مطلوبة"),
    rubric: z.string().min(10, "معايير التقييم مطلوبة"),
    points: z.number().optional().default(10),
    pass_threshold: z.number().optional(),
  })
  .refine((data) => data.max_words > data.min_words, {
    message: "الحد الأقصى يجب أن يكون أكبر من الحد الأدنى",
    path: ["max_words"],
  });

export default function AddIELTSWritingContent() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      question_text: "",
      min_words: 150,
      max_words: 250,
      sample_answer: "",
      rubric: "",
      points: 10,
      pass_threshold: undefined,
    },
  });

  useEffect(() => {
    ieltsLessonsAPI
      .getById(lessonId)
      .then(setLesson)
      .catch(() => toast.error("فشل تحميل الدرس"))
      .finally(() => setPageLoading(false));
  }, [lessonId]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.post("/ielts/writing/questions/create/", {
        title: data.title,
        question_text: data.question_text,
        min_words: data.min_words,
        max_words: data.max_words,
        sample_answer: data.sample_answer,
        rubric: data.rubric,
        points: data.points || 10,
        pass_threshold: data.pass_threshold || null,
        ielts_lesson_pack: lesson.lesson_pack,
        usage_type: "IELTS",
        is_active: true,
      });

      toast.success("تم إضافة سؤال الكتابة بنجاح!");
      navigate(`/dashboard/ielts/lessons/${lessonId}`);
    } catch (err) {
      toast.error(err.response?.data?.error || "فشل في الحفظ");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading)
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to={`/dashboard/ielts/lessons/${lessonId}`}
          className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
            <Edit className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              إضافة محتوى الكتابة
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">{lesson?.title}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Main Info */}
        <div className="card space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Edit className="w-5 h-5 text-purple-600" />
            <h2 className="font-bold text-gray-900">بيانات سؤال الكتابة</h2>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              عنوان السؤال <span className="text-red-500">*</span>
            </label>
            <input
              {...register("title")}
              className={`input ${errors.title ? "border-red-500" : ""}`}
              placeholder="مثال: IELTS Writing Task 1 - Line Graph"
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-600">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              نص السؤال / التعليمات <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register("question_text")}
              rows={5}
              className={`input ${
                errors.question_text ? "border-red-500" : ""
              }`}
              placeholder="اكتب تعليمات سؤال الكتابة هنا... مثال: The graph below shows the population growth..."
            />
            {errors.question_text && (
              <p className="mt-1 text-xs text-red-600">
                {errors.question_text.message}
              </p>
            )}
          </div>

          {/* Word Count */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الحد الأدنى للكلمات <span className="text-red-500">*</span>
              </label>
              <input
                {...register("min_words", { valueAsNumber: true })}
                type="number"
                className={`input ${errors.min_words ? "border-red-500" : ""}`}
                placeholder="150"
              />
              {errors.min_words && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.min_words.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الحد الأقصى للكلمات <span className="text-red-500">*</span>
              </label>
              <input
                {...register("max_words", { valueAsNumber: true })}
                type="number"
                className={`input ${errors.max_words ? "border-red-500" : ""}`}
                placeholder="250"
              />
              {errors.max_words && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.max_words.message}
                </p>
              )}
            </div>
          </div>

          {/* Points & Threshold */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الدرجة الكاملة
              </label>
              <input
                {...register("points", { valueAsNumber: true })}
                type="number"
                className="input"
                placeholder="10"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                درجة النجاح (اختياري)
              </label>
              <input
                {...register("pass_threshold", { valueAsNumber: true })}
                type="number"
                className="input"
                placeholder="مثال: 7"
              />
            </div>
          </div>
        </div>

        {/* Sample Answer */}
        <div className="card">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="font-bold text-gray-900">
              الإجابة النموذجية <span className="text-red-500">*</span>
            </h2>
          </div>
          <textarea
            {...register("sample_answer")}
            rows={10}
            className={`input ${errors.sample_answer ? "border-red-500" : ""}`}
            placeholder="اكتب الإجابة النموذجية المثالية هنا..."
          />
          {errors.sample_answer && (
            <p className="mt-1 text-xs text-red-600">
              {errors.sample_answer.message}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            ستُستخدم كمرجع لتقييم إجابات الطلاب
          </p>
        </div>

        {/* Rubric */}
        <div className="card">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="font-bold text-gray-900">
              معايير التقييم (Rubric) <span className="text-red-500">*</span>
            </h2>
          </div>
          <textarea
            {...register("rubric")}
            rows={8}
            className={`input ${errors.rubric ? "border-red-500" : ""}`}
            placeholder="اكتب معايير التقييم... مثال:&#10;- Task Achievement: هل أجاب الطالب على السؤال؟&#10;- Coherence: هل الإجابة منظمة ومترابطة؟&#10;- Vocabulary: هل استخدم مفردات متنوعة؟&#10;- Grammar: هل القواعد صحيحة؟"
          />
          {errors.rubric && (
            <p className="mt-1 text-xs text-red-600">{errors.rubric.message}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            سيُستخدم لتوجيه التقييم الآلي والمدرس
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> جاري الحفظ...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" /> حفظ المحتوى
              </>
            )}
          </button>
          <Link
            to={`/dashboard/ielts/lessons/${lessonId}`}
            className="btn-secondary px-8 py-3"
          >
            إلغاء
          </Link>
        </div>
      </form>
    </div>
  );
}
