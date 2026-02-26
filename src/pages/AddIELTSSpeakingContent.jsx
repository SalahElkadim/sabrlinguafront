// src/pages/AddIELTSSpeakingContent.jsx
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
  Mic,
  Loader2,
  Video,
  Upload,
  Image as ImageIcon,
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
  title: z.string().min(3, "عنوان الفيديو مطلوب"),
  video_file: z.string().min(1, "ملف الفيديو مطلوب"),
  description: z.string().optional(),
  duration: z.string().optional(),
  thumbnail: z.string().optional(),
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
  explanation: z.string().optional(),
});

export default function AddIELTSSpeakingContent() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [videoUrl, setVideoUrl] = useState("");
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [videoPreview, setVideoPreview] = useState(null);

  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      video_file: "",
      description: "",
      duration: "",
      thumbnail: "",
      questions: [],
      explanation: "",
    },
  });

  const {
    fields: questionFields,
    append: appendQuestion,
    remove: removeQuestion,
  } = useFieldArray({ control, name: "questions" });
  const watchedDescription = watch("description");

  useEffect(() => {
    ieltsLessonsAPI
      .getById(lessonId)
      .then(setLesson)
      .catch(() => toast.error("فشل تحميل الدرس"))
      .finally(() => setPageLoading(false));
  }, [lessonId]);

  // ===== Cloudinary Video Upload =====
  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      setError("الرجاء اختيار ملف فيديو فقط");
      return;
    }
    if (file.size > 100 * 1024 * 1024) {
      setError("حجم الفيديو يجب أن يكون أقل من 100 ميجابايت");
      return;
    }

    setUploadingVideo(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_PRESET);
    formData.append("resource_type", "video");

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/upload`,
        { method: "POST", body: formData }
      );
      const data = await response.json();
      if (data.error) throw new Error(data.error.message);
      if (data.secure_url) {
        setVideoUrl(data.secure_url);
        setVideoPreview(data.secure_url);
        setValue("video_file", data.secure_url);
        if (data.duration)
          setValue("duration", Math.round(data.duration).toString());
      } else {
        throw new Error("لم يتم الحصول على رابط الفيديو");
      }
    } catch (err) {
      setError(`حدث خطأ في رفع الفيديو: ${err.message}`);
    } finally {
      setUploadingVideo(false);
    }
  };

  // ===== Cloudinary Thumbnail Upload =====
  const handleThumbnailUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("الرجاء اختيار صورة فقط");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("حجم الصورة يجب أن يكون أقل من 5 ميجابايت");
      return;
    }

    setUploadingThumbnail(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_PRESET);
    formData.append("resource_type", "image");

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/upload`,
        { method: "POST", body: formData }
      );
      const data = await response.json();
      if (data.error) throw new Error(data.error.message);
      if (data.secure_url) {
        setThumbnailUrl(data.secure_url);
        setThumbnailPreview(data.secure_url);
        setValue("thumbnail", data.secure_url);
      } else {
        throw new Error("لم يتم الحصول على رابط الصورة");
      }
    } catch (err) {
      setError(`حدث خطأ في رفع الصورة: ${err.message}`);
    } finally {
      setUploadingThumbnail(false);
    }
  };

  // ===== Submit =====
  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);

    try {
      // 1. Create speaking video
      const videoRes = await api.post("/ielts/speaking/videos/create/", {
        title: data.title,
        video_file: data.video_file,
        description: data.description || "",
        duration: data.duration || null,
        thumbnail: data.thumbnail || "",
        ielts_lesson_pack: lesson.lesson_pack,
        usage_type: "IELTS",
        is_active: true,
      });
      const videoId = videoRes.data.video.id;

      // 2. Create questions
      const questions =
        data.questions?.filter(
          (q) => q.question_text && q.choice_a && q.choice_b
        ) || [];
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        const options = [q.choice_a, q.choice_b, q.choice_c, q.choice_d];
        const correctIndex = ["A", "B", "C", "D"].indexOf(q.correct_answer);
        await api.post(`/ielts/speaking/videos/${videoId}/questions/create/`, {
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
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            تم إضافة محتوى التحدث بنجاح!
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
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <Mic className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              إضافة محتوى درس التحدث
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

          {/* ========== VIDEO SECTION ========== */}
          <div className="space-y-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2">
              <Video className="w-5 h-5 text-green-600" />
              <h3 className="font-bold text-green-900">بيانات فيديو التحدث</h3>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                عنوان الفيديو <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                {...register("title")}
                className={`input ${errors.title ? "border-red-500" : ""}`}
                placeholder="مثال: How to introduce yourself"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Video Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ملف الفيديو <span className="text-red-600">*</span>
              </label>
              <div className="flex items-center gap-4">
                <label
                  className={`btn btn-secondary cursor-pointer flex items-center gap-2 ${
                    uploadingVideo ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  {uploadingVideo ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> جاري الرفع...
                    </span>
                  ) : (
                    "رفع ملف فيديو"
                  )}
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="hidden"
                    disabled={uploadingVideo}
                  />
                </label>
                {videoUrl && (
                  <span className="text-sm text-green-600 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" /> تم رفع الفيديو بنجاح
                  </span>
                )}
              </div>
              {errors.video_file && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.video_file.message}
                </p>
              )}

              {videoPreview && (
                <div className="mt-3">
                  <video
                    controls
                    className="w-full rounded-lg max-h-96"
                    src={videoPreview}
                  >
                    المتصفح لا يدعم تشغيل الفيديو
                  </video>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                وصف الفيديو (اختياري)
              </label>
              <textarea
                {...register("description")}
                rows={4}
                className="input"
                placeholder="اكتب وصفاً مختصراً عن الفيديو..."
              />
              {watchedDescription && (
                <p className="mt-1 text-xs text-gray-500">
                  {watchedDescription.length} حرف
                </p>
              )}
            </div>

            {/* Thumbnail Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                صورة مصغرة (Thumbnail) - اختياري
              </label>
              <div className="flex items-center gap-4">
                <label
                  className={`btn btn-secondary cursor-pointer flex items-center gap-2 ${
                    uploadingThumbnail ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                >
                  <ImageIcon className="w-4 h-4" />
                  {uploadingThumbnail ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> جاري الرفع...
                    </span>
                  ) : (
                    "رفع صورة مصغرة"
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailUpload}
                    className="hidden"
                    disabled={uploadingThumbnail}
                  />
                </label>
                {thumbnailUrl && (
                  <span className="text-sm text-green-600 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" /> تم رفع الصورة بنجاح
                  </span>
                )}
              </div>
              {thumbnailPreview && (
                <div className="mt-3">
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail preview"
                    className="w-full max-w-md rounded-lg"
                  />
                </div>
              )}
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                مدة الفيديو (بالثواني) - اختياري
              </label>
              <input
                type="number"
                {...register("duration")}
                className="input"
                placeholder="180"
                min="0"
              />
            </div>
          </div>

          {/* ========== QUESTIONS SECTION ========== */}
          <div className="space-y-4 p-4 bg-teal-50 border border-teal-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-teal-900">
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
                  className="p-4 bg-white border border-teal-300 rounded-lg space-y-3"
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
                      placeholder="مثال: What should you say first?"
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
                            className="w-4 h-4 text-teal-600 focus:ring-teal-500"
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
                      placeholder="مثال: You should introduce yourself first..."
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
              rows={6}
              className="input"
              placeholder="اكتب شرحاً عاماً عن الدرس..."
            />
            <p className="mt-1 text-xs text-gray-500">
              يمكنك إضافة ملاحظات أو نصائح للطالب حول الفيديو
            </p>
          </div>

          {/* ========== ACTIONS ========== */}
          <div className="flex gap-3 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={
                loading || !videoUrl || uploadingVideo || uploadingThumbnail
              }
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
