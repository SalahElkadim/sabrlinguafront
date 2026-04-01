// src/pages/AddListeningAudioToSTEP.jsx
import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowRight,
  Headphones,
  Loader2,
  AlertCircle,
  Upload,
  CheckCircle,
} from "lucide-react";
import { stepQuestionsAPI } from "../../services/stepService";

export default function AddListeningAudioToSTEP() {
  const { skillId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    audio_file: "",
    transcript: "",
    duration: "",
    difficulty: "MEDIUM",
    order: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [uploadingAudio, setUploadingAudio] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const [audioPreview, setAudioPreview] = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
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
    setError("");

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

      if (data.error) throw new Error(data.error.message);

      if (data.secure_url) {
        setAudioUrl(data.secure_url);
        setAudioPreview(data.secure_url);
        setForm((prev) => ({
          ...prev,
          audio_file: data.secure_url,
          duration: data.duration
            ? Math.round(data.duration).toString()
            : prev.duration,
        }));
      } else {
        throw new Error("لم يتم الحصول على رابط الملف");
      }
    } catch (err) {
      setError(`حدث خطأ في رفع الملف: ${err.message}`);
    } finally {
      setUploadingAudio(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return setError("عنوان التسجيل مطلوب");
    if (!form.audio_file.trim()) return setError("يرجى رفع ملف صوتي أولاً");

    setLoading(true);
    try {
      const payload = {
        ...form,
        step_skill: skillId,
        duration: form.duration ? parseInt(form.duration) : 0,
      };
      const res = await stepQuestionsAPI.createListeningAudio(payload);
      const audioId = res.audio?.id;
      navigate(
        `/dashboard/step/skills/${skillId}/add/listening/audio/${audioId}/questions`
      );
    } catch (err) {
      setError(err?.response?.data?.error || "حدث خطأ، يرجى المحاولة مرة أخرى");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          to={`/dashboard/step/skills/${skillId}`}
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
        >
          <ArrowRight className="w-5 h-5" />
        </Link>
        <div className="bg-cyan-50 p-3 rounded-xl">
          <Headphones className="w-6 h-6 text-cyan-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إضافة تسجيل صوتي</h1>
          <p className="text-sm text-cyan-600 font-medium">STEP — Listening</p>
        </div>
      </div>

      {/* Form */}
      <div className="card" dir="rtl">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              عنوان التسجيل <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="مثال: Conversation at the airport"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* Audio File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ملف الصوت <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-3">
              <label
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border cursor-pointer transition-colors text-sm font-medium
                ${
                  uploadingAudio
                    ? "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed"
                    : "bg-white border-cyan-400 text-cyan-600 hover:bg-cyan-50"
                }`}
              >
                {uploadingAudio ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
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

            {audioPreview && (
              <div className="mt-3">
                <audio controls className="w-full" src={audioPreview}>
                  المتصفح لا يدعم تشغيل الملفات الصوتية
                </audio>
              </div>
            )}
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              مدة التسجيل (بالثواني)
            </label>
            <input
              type="number"
              name="duration"
              value={form.duration}
              onChange={handleChange}
              placeholder="120"
              min="0"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* Transcript */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              نص التسجيل (Transcript)
            </label>
            <textarea
              name="transcript"
              value={form.transcript}
              onChange={handleChange}
              placeholder="اكتب نص التسجيل الصوتي هنا..."
              rows={5}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
            />
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              مستوى الصعوبة
            </label>
            <select
              name="difficulty"
              value={form.difficulty}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="EASY">سهل</option>
              <option value="MEDIUM">متوسط</option>
              <option value="HARD">صعب</option>
            </select>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading || uploadingAudio || !audioUrl}
              className="flex-1 flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-60 text-white py-3 rounded-lg font-medium transition-colors"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              حفظ والانتقال لإضافة الأسئلة
            </button>
            <Link
              to={`/dashboard/step/skills/${skillId}`}
              className="flex-1 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-medium transition-colors"
            >
              إلغاء
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
