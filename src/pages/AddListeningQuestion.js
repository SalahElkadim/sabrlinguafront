import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowRight,
  Headphones,
  AlertCircle,
  CheckCircle,
  Upload,
  Plus,
} from "lucide-react";
import { useQuestionBanksStore } from "../store/questionbanksstore";

const audioSchema = z.object({
  title: z.string().min(5),
  audio_file: z.string().min(1, "رابط الملف الصوتي مطلوب"),
  transcript: z.string().optional(),
  duration: z.number().min(1).default(60),
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

export default function AddListeningQuestion() {
  const { bankId } = useParams();
  const {
    createListeningAudio,
    addListeningQuestion,
    loading,
    error,
    clearError,
  } = useQuestionBanksStore();

  const [step, setStep] = useState(1);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [audioUrl, setAudioUrl] = useState("");
  const [uploadingAudio, setUploadingAudio] = useState(false);
  const [success, setSuccess] = useState(false);
  const [addedQuestions, setAddedQuestions] = useState([]);

  const audioForm = useForm({
    resolver: zodResolver(audioSchema),
    defaultValues: { duration: 60, order: 0 },
  });
  const questionForm = useForm({
    resolver: zodResolver(questionSchema),
    defaultValues: { points: 1, order: 0, correct_answer: "A" },
  });

  const handleAudioUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith("audio/")) {
      alert("الرجاء اختيار ملف صوتي فقط");
      return;
    }

    // Check file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      alert("حجم الملف يجب أن يكون أقل من 50 ميجابايت");
      return;
    }

    setUploadingAudio(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "react_uploads"); // ✅ الجديد
    formData.append("resource_type", "video"); // يدعم الصوت والفيديو

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
        audioForm.setValue("audio_file", data.secure_url);

        // لو في duration من Cloudinary، استخدمها
        if (data.duration) {
          audioForm.setValue("duration", Math.round(data.duration));
        }
      } else {
        throw new Error("لم يتم الحصول على رابط الملف");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert(`حدث خطأ في رفع الملف: ${err.message}`);
    } finally {
      setUploadingAudio(false);
    }
  };
  const onAudioSubmit = async (data) => {
    clearError();
    try {
      const result = await createListeningAudio(bankId, {
        ...data,
        is_active: true,
      });
      setCurrentAudio(result.audio);
      setStep(2);
    } catch (err) {
      console.error(err);
    }
  };

  const onQuestionSubmit = async (data) => {
    clearError();
    try {
      await addListeningQuestion(bankId, currentAudio.id, {
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
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Headphones className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">إضافة تسجيل استماع</h1>
              <p className="text-gray-600">الخطوة 1: رفع الملف الصوتي</p>
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
          onSubmit={audioForm.handleSubmit(onAudioSubmit)}
          className="space-y-6"
        >
          <div className="card">
            <h2 className="text-lg font-bold mb-4">معلومات التسجيل</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  عنوان التسجيل <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  {...audioForm.register("title")}
                  className="input"
                  placeholder="Daily Conversation - At the Restaurant"
                />
                {audioForm.formState.errors.title && (
                  <p className="mt-1 text-sm text-red-600">
                    {audioForm.formState.errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  الملف الصوتي <span className="text-red-600">*</span>
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
                    <span className="text-sm text-green-600">
                      ✓ تم رفع الملف
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  النص الكامل (Transcript) - اختياري
                </label>
                <textarea
                  {...audioForm.register("transcript")}
                  rows={6}
                  className="input"
                  placeholder="اكتب النص المنطوق في التسجيل..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    المدة (ثانية)
                  </label>
                  <input
                    type="number"
                    {...audioForm.register("duration", { valueAsNumber: true })}
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
                    {...audioForm.register("order", { valueAsNumber: true })}
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
              disabled={loading || !audioUrl}
              className="flex-1 btn btn-primary py-3 disabled:opacity-50"
            >
              {loading ? "جاري الإنشاء..." : "التالي: إضافة الأسئلة"}
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
          <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
            <Headphones className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">إضافة أسئلة الاستماع</h1>
            <p className="text-gray-600">الخطوة 2: "{currentAudio?.title}"</p>
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
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 mt-0.5" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <form
        onSubmit={questionForm.handleSubmit(onQuestionSubmit)}
        className="space-y-6"
      >
        <div className="card">
          <h2 className="text-lg font-bold mb-4">سؤال جديد</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                نص السؤال <span className="text-red-600">*</span>
              </label>
              <textarea
                {...questionForm.register("question_text")}
                rows={3}
                className="input"
                placeholder="What did the customer order?"
              />
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-bold mb-4">الخيارات</h2>
          <div className="grid grid-cols-2 gap-4">
            {["a", "b", "c", "d"].map((choice) => (
              <div key={choice}>
                <label className="block text-sm font-medium mb-2">
                  الخيار {choice.toUpperCase()}
                </label>
                <input
                  type="text"
                  {...questionForm.register(`choice_${choice}`)}
                  className="input"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                الإجابة الصحيحة
              </label>
              <div className="grid grid-cols-4 gap-3">
                {["A", "B", "C", "D"].map((choice) => (
                  <label
                    key={choice}
                    className="flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer hover:border-primary-500"
                  >
                    <input
                      type="radio"
                      value={choice}
                      {...questionForm.register("correct_answer")}
                      className="mr-2"
                    />
                    <span className="font-medium">{choice}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">الشرح</label>
              <textarea
                {...questionForm.register("explanation")}
                rows={3}
                className="input"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 btn btn-primary py-3"
          >
            <Plus className="w-4 h-4 inline ml-2" />
            إضافة سؤال آخر
          </button>
          <Link
            to={`/dashboard/question-banks/${bankId}`}
            className="btn bg-green-600 text-white hover:bg-green-700 px-6 py-3"
          >
            إنهاء ({addedQuestions.length})
          </Link>
        </div>
      </form>
    </div>
  );
}
