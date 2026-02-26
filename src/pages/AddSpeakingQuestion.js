import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowRight,
  Video,
  AlertCircle,
  CheckCircle,
  Upload,
  Plus,
} from "lucide-react";
import { useQuestionBanksStore } from "../store/questionbanksstore";

const videoSchema = z.object({
  title: z.string().min(5),
  video_file: z.string().min(1, "رابط الفيديو مطلوب"),
  description: z.string().optional(),
  duration: z.number().min(1).default(120),
  thumbnail: z.string().optional(),
  order: z.number().min(0).default(0),
});

const questionSchema = z.object({
  question_text: z.string().min(5),
  question_image: z.string().optional(),
  choice_a: z.string().min(1),
  choice_b: z.string().min(1),
  choice_c: z.string().min(1),
  choice_d: z.string().min(1),
  correct_answer: z.enum(["A", "B", "C", "D"]),
  explanation: z.string().min(5),
  points: z.number().min(1).default(1),
  order: z.number().min(0).default(0),
});

export default function AddSpeakingQuestion() {
  const { bankId } = useParams();
  const {
    createSpeakingVideo,
    addSpeakingQuestion,
    loading,
    error,
    clearError,
  } = useQuestionBanksStore();

  const [step, setStep] = useState(1);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [success, setSuccess] = useState(false);
  const [addedQuestions, setAddedQuestions] = useState([]);

  const videoForm = useForm({
    resolver: zodResolver(videoSchema),
    defaultValues: { duration: 120, order: 0 },
  });
  const questionForm = useForm({
    resolver: zodResolver(questionSchema),
    defaultValues: { points: 1, order: 0, correct_answer: "A" },
  });

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith("video/")) {
      alert("الرجاء اختيار ملف فيديو فقط");
      return;
    }

    // Check file size (max 100MB)
    if (file.size > 100 * 1024 * 1024) {
      alert("حجم الفيديو يجب أن يكون أقل من 100 ميجابايت");
      return;
    }

    setUploadingVideo(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "react_uploads"); // ✅ الجديد
    formData.append("resource_type", "video");

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dyxozpomy/upload",
        { method: "POST", body: formData }
      );

      const data = await response.json();
      console.log("Video uploaded:", data);

      if (data.error) {
        throw new Error(data.error.message);
      }

      if (data.secure_url) {
        setVideoUrl(data.secure_url);
        videoForm.setValue("video_file", data.secure_url);

        // لو Cloudinary رجع thumbnail تلقائي
        if (data.thumbnail_url) {
          setThumbnailUrl(data.thumbnail_url);
          videoForm.setValue("thumbnail", data.thumbnail_url);
        }

        // لو في duration من Cloudinary
        if (data.duration) {
          videoForm.setValue("duration", Math.round(data.duration));
        }
      } else {
        throw new Error("لم يتم الحصول على رابط الفيديو");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert(`حدث خطأ في رفع الفيديو: ${err.message}`);
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleThumbnailUpload = async (e) => {
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

    setUploadingThumbnail(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "react_uploads"); // ✅ الجديد

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dyxozpomy/image/upload",
        { method: "POST", body: formData }
      );

      const data = await response.json();
      console.log("Thumbnail uploaded:", data);

      if (data.error) {
        throw new Error(data.error.message);
      }

      if (data.secure_url) {
        setThumbnailUrl(data.secure_url);
        videoForm.setValue("thumbnail", data.secure_url);
      } else {
        throw new Error("لم يتم الحصول على رابط الصورة");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert(`حدث خطأ في رفع الصورة: ${err.message}`);
    } finally {
      setUploadingThumbnail(false);
    }
  };

  const onVideoSubmit = async (data) => {
    clearError();
    try {
      const result = await createSpeakingVideo(bankId, {
        ...data,
        is_active: true,
      });
      setCurrentVideo(result.video);
      setStep(2);
    } catch (err) {
      console.error(err);
    }
  };

  const onQuestionSubmit = async (data) => {
    clearError();
    try {
      await addSpeakingQuestion(bankId, currentVideo.id, {
        ...data,
        is_active: true,
      });
      setAddedQuestions([...addedQuestions, data.question_text]);
      setSuccess(true);
      questionForm.reset();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  if (step === 1) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link
            to={`/dashboard/question-banks/${bankId}`}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100"
          >
            <ArrowRight className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <Video className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">إضافة فيديو تحدث</h1>
              <p className="text-gray-600">الخطوة 1: رفع الفيديو</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form
          onSubmit={videoForm.handleSubmit(onVideoSubmit)}
          className="space-y-6"
        >
          <div className="card">
            <h2 className="text-lg font-bold mb-4">معلومات الفيديو</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  عنوان الفيديو <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  {...videoForm.register("title")}
                  className="input"
                  placeholder="How to Introduce Yourself"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  ملف الفيديو <span className="text-red-600">*</span>
                </label>
                <div className="flex items-center gap-4">
                  <label className="btn btn-secondary cursor-pointer flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    {uploadingVideo ? "جاري الرفع..." : "رفع فيديو"}
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoUpload}
                      className="hidden"
                      disabled={uploadingVideo}
                    />
                  </label>
                  {videoUrl && (
                    <span className="text-sm text-green-600">
                      ✓ تم رفع الفيديو
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  صورة مصغرة (Thumbnail) - اختياري
                </label>
                <div className="flex items-center gap-4">
                  <label className="btn btn-secondary cursor-pointer flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    {uploadingThumbnail ? "جاري الرفع..." : "رفع صورة"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailUpload}
                      className="hidden"
                      disabled={uploadingThumbnail}
                    />
                  </label>
                  {thumbnailUrl && (
                    <span className="text-sm text-green-600">
                      ✓ تم رفع الصورة
                    </span>
                  )}
                </div>
                {thumbnailUrl && (
                  <img
                    src={thumbnailUrl}
                    alt="Thumbnail"
                    className="mt-4 max-w-xs rounded-lg border"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  الوصف - اختياري
                </label>
                <textarea
                  {...videoForm.register("description")}
                  rows={3}
                  className="input"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    المدة (ثانية)
                  </label>
                  <input
                    type="number"
                    {...videoForm.register("duration", { valueAsNumber: true })}
                    className="input"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    الترتيب
                  </label>
                  <input
                    type="number"
                    {...videoForm.register("order", { valueAsNumber: true })}
                    className="input"
                    min="0"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading || !videoUrl}
              className="flex-1 btn btn-primary py-3 disabled:opacity-50"
            >
              التالي: إضافة الأسئلة
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setStep(1)}
          className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
            <Video className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">إضافة أسئلة التحدث</h1>
            <p className="text-gray-600">الخطوة 2: "{currentVideo?.title}"</p>
          </div>
        </div>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start gap-3">
          <CheckCircle className="w-5 h-5 mt-0.5" />
          <p className="text-sm">
            تم إضافة السؤال! ({addedQuestions.length} أسئلة)
          </p>
        </div>
      )}

      <form
        onSubmit={questionForm.handleSubmit(onQuestionSubmit)}
        className="space-y-6"
      >
        <div className="card">
          <div>
            <label className="block text-sm font-medium mb-2">نص السؤال</label>
            <textarea
              {...questionForm.register("question_text")}
              rows={3}
              className="input"
            />
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-bold mb-4">الخيارات</h2>
          <div className="grid grid-cols-2 gap-4">
            {["a", "b", "c", "d"].map((choice) => (
              <div key={choice}>
                <input
                  type="text"
                  {...questionForm.register(`choice_${choice}`)}
                  className="input"
                  placeholder={`الخيار ${choice.toUpperCase()}`}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-3">
              {["A", "B", "C", "D"].map((choice) => (
                <label
                  key={choice}
                  className="flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer"
                >
                  <input
                    type="radio"
                    value={choice}
                    {...questionForm.register("correct_answer")}
                    className="mr-2"
                  />
                  <span>{choice}</span>
                </label>
              ))}
            </div>
            <textarea
              {...questionForm.register("explanation")}
              rows={3}
              className="input"
              placeholder="الشرح"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 btn btn-primary py-3"
          >
            <Plus className="w-4 h-4 inline ml-2" />
            إضافة سؤال
          </button>
          <Link
            to={`/dashboard/question-banks/${bankId}`}
            className="btn bg-green-600 text-white px-6 py-3"
          >
            إنهاء ({addedQuestions.length})
          </Link>
        </div>
      </form>
    </div>
  );
}
