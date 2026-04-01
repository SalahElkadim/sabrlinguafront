// src/pages/AddReadingContent.js - WITH SOLVED QUESTIONS
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
  BookOpen,
  Plus,
  Trash2,
  Loader2,
  FileText,
  Image as ImageIcon,
  Languages,
  HelpCircle,
  CheckSquare,
} from "lucide-react";

// ✅ UPDATED SCHEMA - مع الأسئلة المحلولة
const readingContentSchema = z.object({
  lesson: z.number(),
  passage_data: z.object({
    title: z.string().min(3, "عنوان القطعة مطلوب"),
    passage_text: z.string().min(50, "نص القطعة يجب أن يكون 50 حرف على الأقل"),
    passage_image: z.any().optional(),
    source: z.string().optional(),
    order: z.number().optional(),
  }),
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
  vocabulary_words: z
    .array(
      z.object({
        english_word: z.string().min(1, "الكلمة الإنجليزية مطلوبة"),
        translate: z.string().min(1, "الترجمة مطلوبة"),
      })
    )
    .optional(),
  explanation: z.string().optional(),
});

export default function AddReadingContent() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [lesson, setLesson] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
  } = useForm({
    resolver: zodResolver(readingContentSchema),
    defaultValues: {
      lesson: parseInt(lessonId),
      passage_data: {
        title: "",
        passage_text: "",
        source: "",
        order: 1,
      },
      questions: [], // 🆕 الأسئلة المحلولة
      vocabulary_words: [{ english_word: "", translate: "" }],
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

  // Field Array للمفردات
  const {
    fields: vocabFields,
    append: appendVocab,
    remove: removeVocab,
  } = useFieldArray({
    control,
    name: "vocabulary_words",
  });

  const watchedPassageText = watch("passage_data.passage_text");

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
      if (data.lesson_type !== "READING") {
        setError("هذا الدرس ليس من نوع القراءة");
        return;
      }
      setLesson(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);

    try {
      // ✅ إعداد الأسئلة مع auto-increment للـ order
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
          order: index + 1, // Auto increment
        }));

      const payload = {
        lesson: data.lesson,
        passage_data: {
          title: data.passage_data.title,
          passage_text: data.passage_data.passage_text,
          passage_image: null,
          source: data.passage_data.source || "Teacher Created",
          order: data.passage_data.order || 1,
        },
        questions: questions || [], // 🆕 الأسئلة
        vocabulary_words:
          data.vocabulary_words?.filter((w) => w.english_word && w.translate) ||
          [],
        explanation: data.explanation || "",
      };

      console.log("📤 Sending payload:", payload); // للتأكد

      const response = await fetch(
        "https://sabrlinguaa-production.up.railway.app/levels/lesson-content/reading/create-with-passage/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
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
            تم إضافة محتوى القراءة بنجاح!
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
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              إضافة محتوى درس القراءة
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

          {/* ========== PASSAGE SECTION ========== */}
          <div className="space-y-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-blue-900">بيانات قطعة القراءة</h3>
            </div>

            {/* Passage Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                عنوان القطعة <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                {...register("passage_data.title")}
                className={`input ${
                  errors.passage_data?.title ? "border-red-500" : ""
                }`}
                placeholder="مثال: My Family"
              />
              {errors.passage_data?.title && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.passage_data.title.message}
                </p>
              )}
            </div>

            {/* Passage Text */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نص القطعة <span className="text-red-600">*</span>
              </label>
              <textarea
                {...register("passage_data.passage_text")}
                rows="10"
                className={`input ${
                  errors.passage_data?.passage_text ? "border-red-500" : ""
                }`}
                placeholder="اكتب نص قطعة القراءة هنا..."
              />
              {errors.passage_data?.passage_text && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.passage_data.passage_text.message}
                </p>
              )}
              {watchedPassageText && (
                <p className="mt-1 text-xs text-gray-500">
                  {watchedPassageText.length} حرف - الحد الأدنى: 50 حرف
                </p>
              )}
            </div>

            {/* Passage Source */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                مصدر القطعة (اختياري)
              </label>
              <input
                type="text"
                {...register("passage_data.source")}
                className="input"
                placeholder="مثال: English Book 1, Teacher Created"
              />
            </div>
          </div>

          {/* ========== 🆕 QUESTIONS SECTION ========== */}
          <div className="space-y-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-green-600" />
                <h3 className="font-bold text-green-900">
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
                  className="p-4 bg-white border border-green-300 rounded-lg space-y-3"
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
                      placeholder="مثال: How many people are in the family?"
                    />
                    {errors.questions?.[index]?.question_text && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.questions[index].question_text.message}
                      </p>
                    )}
                  </div>

                  {/* Choices Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Choice A */}
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
                      {errors.questions?.[index]?.choice_a && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.questions[index].choice_a.message}
                        </p>
                      )}
                    </div>

                    {/* Choice B */}
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
                      {errors.questions?.[index]?.choice_b && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.questions[index].choice_b.message}
                        </p>
                      )}
                    </div>

                    {/* Choice C */}
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
                      {errors.questions?.[index]?.choice_c && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.questions[index].choice_c.message}
                        </p>
                      )}
                    </div>

                    {/* Choice D */}
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
                      {errors.questions?.[index]?.choice_d && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.questions[index].choice_d.message}
                        </p>
                      )}
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
                            className="w-4 h-4 text-green-600 focus:ring-green-500"
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
                    {errors.questions?.[index]?.correct_answer && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.questions[index].correct_answer.message}
                      </p>
                    )}
                  </div>

                  {/* Explanation (Optional) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      شرح الإجابة (اختياري)
                    </label>
                    <textarea
                      {...register(`questions.${index}.explanation`)}
                      rows="2"
                      className="input"
                      placeholder="مثال: The family has 5 members..."
                    />
                  </div>
                </div>
              ))}
            </div>

            {questionFields.length > 0 && (
              <div className="text-xs text-gray-600 bg-white p-3 rounded-lg border border-green-200">
                <CheckSquare className="w-4 h-4 inline ml-1" />
                تم إضافة {questionFields.length} سؤال(أسئلة) - سيتم حفظها مع
                القطعة
              </div>
            )}
          </div>

          {/* ========== VOCABULARY SECTION ========== */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                <Languages className="w-4 h-4 inline ml-1" />
                المفردات الجديدة (اختياري)
              </label>
              <button
                type="button"
                onClick={() => appendVocab({ english_word: "", translate: "" })}
                className="btn btn-secondary btn-sm"
              >
                <Plus className="w-4 h-4 ml-2" />
                إضافة كلمة
              </button>
            </div>

            <div className="space-y-3">
              {vocabFields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex gap-3 items-start p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1 grid grid-cols-2 gap-3">
                    <div>
                      <input
                        type="text"
                        {...register(`vocabulary_words.${index}.english_word`)}
                        placeholder="English word"
                        className="input"
                      />
                      {errors.vocabulary_words?.[index]?.english_word && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.vocabulary_words[index].english_word.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <input
                        type="text"
                        {...register(`vocabulary_words.${index}.translate`)}
                        placeholder="الترجمة"
                        className="input"
                      />
                      {errors.vocabulary_words?.[index]?.translate && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.vocabulary_words[index].translate.message}
                        </p>
                      )}
                    </div>
                  </div>
                  {vocabFields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeVocab(index)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <p className="mt-2 text-xs text-gray-500">
              أضف الكلمات الجديدة الموجودة في القطعة مع ترجمتها
            </p>
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
              يمكنك إضافة ملاحظات أو نصائح للطالب حول القطعة
            </p>
          </div>

          {/* ========== ACTIONS ========== */}
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
