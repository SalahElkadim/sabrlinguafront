// src/pages/AddIELTSListeningContent.jsx
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
  Headphones,
  Loader2,
  Upload,
  HelpCircle,
  Plus,
  Trash2,
} from "lucide-react";
import { ieltsLessonsAPI } from "../services/Ieltsservice";
import api from "../api/axios";
import toast from "react-hot-toast";

const CLOUDINARY_CLOUD = "dyxozpomy";
const CLOUDINARY_PRESET = "react_uploads";

const schema = z.object({
  title: z.string().min(3, "عنوان التسجيل مطلوب"),
  audio_file: z.string().min(1, "ملف الصوت مطلوب"),
  transcript: z.string().optional(),
  duration: z.string().optional(),
  questions: z
    .array(
      z.object({
        question_text: z.string().min(5, "نص السؤال مطلوب"),
        choice_a: z.string().min(1, "الاختيار أ مطلوب"),
        choice_b: z.string().min(1, "الاختيار ب مطلوب"),
        choice_c: z.string().min(1, "الاختيار ج مطلوب"),
        choice_d: z.string().min(1, "الاختيار د مطلوب"),
        correct_answer: z.enum(["A", "B", "C", "D"], {
          errorMap: () => ({ message: "يجب اختيار الإجابة الصحيحة" }),
        }),
        explanation: z.string().optional(),
        points: z.number().optional().default(1),
      })
    )
    .optional()
    .default([]),
});

export default function AddIELTSListeningContent() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [audioUrl, setAudioUrl] = useState("");
  const [uploadingAudio, setUploadingAudio] = useState(false);
  const [audioPreview, setAudioPreview] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      audio_file: "",
      transcript: "",
      duration: "",
      questions: [],
    },
  });

  const {
    fields: questionFields,
    append: appendQuestion,
    remove: removeQuestion,
  } = useFieldArray({ control, name: "questions" });

  useEffect(() => {
    ieltsLessonsAPI
      .getById(lessonId)
      .then(setLesson)
      .catch(() => toast.error("فشل تحميل الدرس"))
      .finally(() => setPageLoading(false));
  }, [lessonId]);

  // ===== Cloudinary Audio Upload =====
  const handleAudioUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = [
      "audio/mpeg",
      "audio/mp3",
      "audio/wav",
      "audio/ogg",
      "audio/mp4",
      "video/mp4",
    ];
    if (!allowedTypes.includes(file.type) && !file.type.startsWith("audio/")) {
      setError("الرجاء اختيار ملف صوتي فقط (MP3, WAV, OGG)");
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setError("حجم الملف الصوتي يجب أن يكون أقل من 50 ميجابايت");
      return;
    }

    setUploadingAudio(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_PRESET);
    formData.append("resource_type", "video"); // Cloudinary uses "video" for audio too

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/upload`,
        { method: "POST", body: formData }
      );
      const data = await response.json();
      if (data.error) throw new Error(data.error.message);
      if (data.secure_url) {
        setAudioUrl(data.secure_url);
        setAudioPreview(data.secure_url);
        setValue("audio_file", data.secure_url);
        if (data.duration)
          setValue("duration", Math.round(data.duration).toString());
      } else {
        throw new Error("لم يتم الحصول على رابط الملف الصوتي");
      }
    } catch (err) {
      setError(`حدث خطأ في رفع الملف الصوتي: ${err.message}`);
    } finally {
      setUploadingAudio(false);
    }
  };

  // ===== Submit =====
  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);

    try {
      // 1. Create listening audio
      const audioRes = await api.post("/ielts/listening/audios/create/", {
        title: data.title,
        audio_file: data.audio_file,
        transcript: data.transcript || "",
        duration: data.duration || null,
        ielts_lesson_pack: lesson.lesson_pack,
        usage_type: "IELTS",
        is_active: true,
      });
      const audioId = audioRes.data.audio.id;

      // 2. Create questions
      const questions =
        data.questions?.filter(
          (q) => q.question_text && q.choice_a && q.choice_b
        ) || [];
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        const options = [q.choice_a, q.choice_b, q.choice_c, q.choice_d];
        const correctIndex = ["A", "B", "C", "D"].indexOf(q.correct_answer);
        await api.post(`/ielts/listening/audios/${audioId}/questions/create/`, {
          question_text: q.question_text,
          options,
          correct_answer: options[correctIndex],
          explanation: q.explanation || "",
          points: q.points || 1,
        });
      }

      setSuccess(true);
      setTimeout(() => navigate(`/dashboard/ielts/lessons/${lessonId}`), 1500);
    } catch (err) {
      setError(err.response?.data?.error || err.message || "فشل في الحفظ");
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

  if (success)
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-full mb-6">
            <CheckCircle className="w-10 h-10 text-orange-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            تم إضافة محتوى الاستماع بنجاح!
          </h2>
          <p className="text-gray-600 mb-6">جاري التحويل...</p>
          <div className="animate-spin inline-block w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full"></div>
        </div>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to={`/dashboard/ielts/lessons/${lessonId}`}
          className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
            <Headphones className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              إضافة محتوى درس الاستماع
            </h1>
            <p className="text-gray-600 mt-1">{lesson?.title}</p>
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
          <div className="space-y-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center gap-2">
              <Headphones className="w-5 h-5 text-orange-600" />
              <h3 className="font-bold text-orange-900">
                بيانات التسجيل الصوتي
              </h3>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                عنوان التسجيل <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                {...register("title")}
                className={`input ${errors.title ? "border-red-500" : ""}`}
                placeholder="مثال: IELTS Listening - Part 1"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Audio Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ملف الصوت <span className="text-red-600">*</span>
              </label>
              <div className="flex items-center gap-4">
                <label
                  className={`btn btn-secondary cursor-pointer flex items-center gap-2 ${
                    uploadingAudio ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  {uploadingAudio ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> جاري الرفع...
                    </span>
                  ) : (
                    "رفع ملف صوتي"
                  )}
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
                    <CheckCircle className="w-4 h-4" /> تم رفع الملف الصوتي
                    بنجاح
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-gray-500">
                يدعم: MP3, WAV, OGG — الحد الأقصى 50 ميجابايت
              </p>
              {errors.audio_file && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.audio_file.message}
                </p>
              )}

              {/* Audio Preview */}
              {audioPreview && (
                <div className="mt-3 p-3 bg-white border border-orange-200 rounded-lg">
                  <p className="text-xs text-gray-500 mb-2">معاينة التسجيل:</p>
                  <audio controls className="w-full" src={audioPreview}>
                    المتصفح لا يدعم تشغيل الصوت
                  </audio>
                </div>
              )}
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                المدة (بالثواني) - اختياري
              </label>
              <input
                type="number"
                {...register("duration")}
                className="input"
                placeholder="180"
                min="0"
              />
              <p className="mt-1 text-xs text-gray-500">
                تُحسب تلقائياً عند رفع الملف
              </p>
            </div>

            {/* Transcript */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                النص المكتوب (Transcript) - اختياري
              </label>
              <textarea
                {...register("transcript")}
                rows={6}
                className="input"
                placeholder="اكتب النص الكامل للتسجيل الصوتي هنا..."
              />
              <p className="mt-1 text-xs text-gray-500">
                يساعد الطلاب على متابعة التسجيل
              </p>
            </div>
          </div>

          {/* ========== QUESTIONS SECTION ========== */}
          <div className="space-y-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-amber-900">
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
                <Plus className="w-4 h-4 ml-2" /> إضافة سؤال
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
                  className="p-4 bg-white border border-amber-300 rounded-lg space-y-3"
                >
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      نص السؤال <span className="text-red-600">*</span>
                    </label>
                    <textarea
                      {...register(`questions.${index}.question_text`)}
                      rows={2}
                      className={`input ${
                        errors.questions?.[index]?.question_text
                          ? "border-red-500"
                          : ""
                      }`}
                      placeholder="مثال: Where is the man going?"
                    />
                    {errors.questions?.[index]?.question_text && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.questions[index].question_text.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {["choice_a", "choice_b", "choice_c", "choice_d"].map(
                      (choice, ci) => (
                        <div key={choice}>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {["أ", "ب", "ج", "د"][ci]}){" "}
                            <span className="text-red-600">*</span>
                          </label>
                          <input
                            type="text"
                            {...register(`questions.${index}.${choice}`)}
                            className={`input ${
                              errors.questions?.[index]?.[choice]
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
                      الإجابة الصحيحة <span className="text-red-600">*</span>
                    </label>
                    <div className="flex gap-3">
                      {["A", "B", "C", "D"].map((choice, ci) => (
                        <label
                          key={choice}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="radio"
                            {...register(`questions.${index}.correct_answer`)}
                            value={choice}
                            className="w-4 h-4 text-amber-600 focus:ring-amber-500"
                          />
                          <span className="text-sm font-medium">
                            {["أ", "ب", "ج", "د"][ci]}
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      شرح الإجابة (اختياري)
                    </label>
                    <textarea
                      {...register(`questions.${index}.explanation`)}
                      rows={2}
                      className="input"
                      placeholder="اشرح الإجابة الصحيحة..."
                    />
                  </div>
                </div>
              ))}
            </div>
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
                  <Loader2 className="w-5 h-5 animate-spin" /> جاري الحفظ...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Save className="w-5 h-5" /> حفظ المحتوى
                </span>
              )}
            </button>
            <Link
              to={`/dashboard/ielts/lessons/${lessonId}`}
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
