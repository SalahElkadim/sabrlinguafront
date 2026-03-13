// src/pages/AddListeningAudioToSTEP.jsx
import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowRight, Headphones, Loader2, AlertCircle } from "lucide-react";
import { stepQuestionsAPI } from "../services/stepService";

export default function AddListeningAudioToSTEP() {
  const { skillId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    audio_file: "",
    transcript: "",
    duration: "",
    order: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return setError("عنوان التسجيل مطلوب");
    if (!form.audio_file.trim()) return setError("رابط الملف الصوتي مطلوب");

    setLoading(true);
    try {
      const payload = {
        ...form,
        step_skill: skillId,
        duration: form.duration ? parseInt(form.duration) : 0,
      };
      const res = await stepQuestionsAPI.createListeningAudio(payload);
      const audioId = res.audio?.id;
      // بعد إنشاء التسجيل نروح لصفحة إضافة الأسئلة
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

          {/* Audio File URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              رابط الملف الصوتي (Cloudinary URL){" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="audio_file"
              value={form.audio_file}
              onChange={handleChange}
              placeholder="https://res.cloudinary.com/.../audio.mp3"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
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

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
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
