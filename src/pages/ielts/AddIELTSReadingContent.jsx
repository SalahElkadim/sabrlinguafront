// src/pages/AddIELTSReadingContent.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeft,
  Save,
  AlertCircle,
  CheckCircle,
  BookOpen,
  Plus,
  Trash2,
  Loader2,
  FileText,
  HelpCircle,
  Languages,
} from "lucide-react";
import { ieltsLessonsAPI } from "../services/Ieltsservice";
import api from "../api/axios";
import toast from "react-hot-toast";

const schema = z.object({
  passage_data: z.object({
    title: z.string().min(3, "عنوان القطعة مطلوب"),
    passage_text: z.string().min(50, "النص يجب أن يكون 50 حرف على الأقل"),
    source: z.string().optional(),
  }),
  questions: z
    .array(
      z.object({
        question_text: z.string().min(5, "نص السؤال مطلوب"),
        choice_a: z.string().min(1, "الاختيار أ مطلوب"),
        choice_b: z.string().min(1, "الاختيار ب مطلوب"),
        choice_c: z.string().min(1, "الاختيار ج مطلوب"),
        choice_d: z.string().min(1, "الاختيار د مطلوب"),
        correct_answer: z.enum(["A", "B", "C", "D"], {
          errorMap: () => ({ message: "اختر الإجابة الصحيحة" }),
        }),
        explanation: z.string().optional(),
        points: z.number().optional().default(1),
      })
    )
    .optional()
    .default([]),
  vocabulary_words: z
    .array(
      z.object({
        english_word: z.string().min(1, "الكلمة مطلوبة"),
        translate: z.string().min(1, "الترجمة مطلوبة"),
      })
    )
    .optional()
    .default([]),
  explanation: z.string().optional(),
});

export default function AddIELTSReadingContent() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      passage_data: { title: "", passage_text: "", source: "" },
      questions: [],
      vocabulary_words: [],
      explanation: "",
    },
  });

  const {
    fields: qFields,
    append: appendQ,
    remove: removeQ,
  } = useFieldArray({ control, name: "questions" });
  const {
    fields: vFields,
    append: appendV,
    remove: removeV,
  } = useFieldArray({ control, name: "vocabulary_words" });
  const passageText = watch("passage_data.passage_text");

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
      await api.post(`/ielts/lessons/${lessonId}/content/reading/create/`, {
        passage_title: data.passage_data.title,
        passage_text: data.passage_data.passage_text,
        source: data.passage_data.source || "Teacher Created",
        explanation: data.explanation || "",
        vocabulary_words: data.vocabulary_words || [],
        questions: data.questions.map((q) => ({
          question_text: q.question_text,
          choice_a: q.choice_a,
          choice_b: q.choice_b,
          choice_c: q.choice_c,
          choice_d: q.choice_d,
          correct_answer: q.correct_answer,
          explanation: q.explanation || "",
          points: q.points || 1,
        })),
      });

      toast.success("تم إضافة محتوى القراءة بنجاح!");
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
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              إضافة محتوى القراءة
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">{lesson?.title}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Passage Section */}
        <div className="card space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <h2 className="font-bold text-gray-900">بيانات قطعة القراءة</h2>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              عنوان القطعة <span className="text-red-500">*</span>
            </label>
            <input
              {...register("passage_data.title")}
              className={`input ${
                errors.passage_data?.title ? "border-red-500" : ""
              }`}
              placeholder="مثال: The History of Science"
            />
            {errors.passage_data?.title && (
              <p className="mt-1 text-xs text-red-600">
                {errors.passage_data.title.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              نص القطعة <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register("passage_data.passage_text")}
              rows={10}
              className={`input ${
                errors.passage_data?.passage_text ? "border-red-500" : ""
              }`}
              placeholder="اكتب نص القطعة هنا..."
            />
            {errors.passage_data?.passage_text && (
              <p className="mt-1 text-xs text-red-600">
                {errors.passage_data.passage_text.message}
              </p>
            )}
            {passageText && (
              <p className="mt-1 text-xs text-gray-500">
                {passageText.length} حرف
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              المصدر (اختياري)
            </label>
            <input
              {...register("passage_data.source")}
              className="input"
              placeholder="مثال: Oxford Reading, Teacher Created"
            />
          </div>
        </div>

        {/* Questions Section */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-green-600" />
              <h2 className="font-bold text-gray-900">
                أسئلة القطعة (اختياري)
              </h2>
            </div>
            <button
              type="button"
              onClick={() =>
                appendQ({
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
              className="btn-secondary text-sm flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> إضافة سؤال
            </button>
          </div>

          {qFields.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <HelpCircle className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm">لا توجد أسئلة بعد</p>
            </div>
          )}

          <div className="space-y-4">
            {qFields.map((field, idx) => (
              <div
                key={field.id}
                className="p-4 border border-gray-200 rounded-lg space-y-3 bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-800 text-sm">
                    السؤال {idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeQ(idx)}
                    className="text-red-500 hover:bg-red-50 rounded-lg p-1.5"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    نص السؤال <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    {...register(`questions.${idx}.question_text`)}
                    rows={2}
                    className={`input ${
                      errors.questions?.[idx]?.question_text
                        ? "border-red-500"
                        : ""
                    }`}
                    placeholder="اكتب السؤال هنا..."
                  />
                  {errors.questions?.[idx]?.question_text && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.questions[idx].question_text.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {["choice_a", "choice_b", "choice_c", "choice_d"].map(
                    (choice, ci) => (
                      <div key={choice}>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          {["أ", "ب", "ج", "د"][ci]}){" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          {...register(`questions.${idx}.${choice}`)}
                          className={`input ${
                            errors.questions?.[idx]?.[choice]
                              ? "border-red-500"
                              : ""
                          }`}
                          placeholder={`الاختيار ${
                            ["الأول", "الثاني", "الثالث", "الرابع"][ci]
                          }`}
                        />
                      </div>
                    )
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الإجابة الصحيحة <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-4">
                    {["A", "B", "C", "D"].map((ch, ci) => (
                      <label
                        key={ch}
                        className="flex items-center gap-1.5 cursor-pointer"
                      >
                        <input
                          type="radio"
                          {...register(`questions.${idx}.correct_answer`)}
                          value={ch}
                          className="w-4 h-4 text-green-600"
                        />
                        <span className="text-sm">
                          {["أ", "ب", "ج", "د"][ci]}
                        </span>
                      </label>
                    ))}
                  </div>
                  {errors.questions?.[idx]?.correct_answer && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.questions[idx].correct_answer.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    شرح الإجابة (اختياري)
                  </label>
                  <textarea
                    {...register(`questions.${idx}.explanation`)}
                    rows={2}
                    className="input"
                    placeholder="اشرح الإجابة الصحيحة..."
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vocabulary Section */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Languages className="w-5 h-5 text-purple-600" />
              <h2 className="font-bold text-gray-900">
                مفردات الدرس (اختياري)
              </h2>
            </div>
            <button
              type="button"
              onClick={() => appendV({ english_word: "", translate: "" })}
              className="btn-secondary text-sm flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> إضافة كلمة
            </button>
          </div>

          <div className="space-y-3">
            {vFields.map((field, idx) => (
              <div
                key={field.id}
                className="flex gap-3 items-center p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1 grid grid-cols-2 gap-3">
                  <input
                    {...register(`vocabulary_words.${idx}.english_word`)}
                    className="input"
                    placeholder="English word"
                  />
                  <input
                    {...register(`vocabulary_words.${idx}.translate`)}
                    className="input"
                    placeholder="الترجمة"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeV(idx)}
                  className="text-red-500 hover:bg-red-50 rounded-lg p-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {vFields.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">
                لا توجد مفردات بعد
              </p>
            )}
          </div>
        </div>

        {/* Explanation */}
        <div className="card">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            شرح عام للدرس (اختياري)
          </label>
          <textarea
            {...register("explanation")}
            rows={4}
            className="input"
            placeholder="أضف شرحاً أو ملاحظات للطلاب..."
          />
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
