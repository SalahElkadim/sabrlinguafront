// src/pages/general/AddListeningToGeneral.jsx
import { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Headphones,
  Save,
  ArrowRight,
  Loader2,
  Upload,
  X,
  Music,
} from "lucide-react";
import { generalQuestionsAPI } from "../../services/generalService";

export default function AddListeningAudioToGeneral() {
  const navigate = useNavigate();
  const { skillId } = useParams();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    title: "",
    transcript: "",
    duration: 0,
    difficulty: "MEDIUM",
  });
  const [audioFile, setAudioFile] = useState(null); // File object
  const [audioPreview, setAudioPreview] = useState(""); // object URL for <audio>
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // revoke previous blob url
    if (audioPreview) URL.revokeObjectURL(audioPreview);

    setAudioFile(file);
    setAudioPreview(URL.createObjectURL(file));

    // auto-fill title if empty
    if (!form.title.trim()) {
      setForm((f) => ({ ...f, title: file.name.replace(/\.[^/.]+$/, "") }));
    }
  };

  const handleRemoveFile = () => {
    if (audioPreview) URL.revokeObjectURL(audioPreview);
    setAudioFile(null);
    setAudioPreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("العنوان مطلوب");
      return;
    }
    if (!audioFile) {
      setError("يرجى رفع ملف صوتي");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Build FormData so the file is actually uploaded
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("transcript", form.transcript);
      formData.append("duration", parseInt(form.duration) || 0);
      formData.append("difficulty", form.difficulty);
      formData.append("general_skill", parseInt(skillId));
      formData.append("audio_file", audioFile);

      const res = await generalQuestionsAPI.createListeningAudio(formData);
      navigate(
        `/dashboard/general/skills/${skillId}/add/listening/audio/${res.audio.id}/questions`
      );
    } catch (err) {
      setError(err.response?.data?.error || "حدث خطأ أثناء الرفع");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(`/dashboard/general/skills/${skillId}`)}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowRight className="w-5 h-5 text-gray-600" />
        </button>
        <div className="w-10 h-10 bg-cyan-100 rounded-xl flex items-center justify-center">
          <Headphones className="w-5 h-5 text-cyan-700" />
        </div>
        <h1 className="text-xl font-bold text-gray-900">إضافة تسجيل صوتي</h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5"
      >
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm text-right">
            {error}
          </div>
        )}

        {/* Audio File Upload */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700 text-right">
            الملف الصوتي <span className="text-red-500">*</span>
          </label>

          {!audioFile ? (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center gap-3 hover:border-cyan-400 hover:bg-cyan-50 transition-colors group"
            >
              <div className="w-14 h-14 bg-cyan-100 rounded-full flex items-center justify-center group-hover:bg-cyan-200 transition-colors">
                <Upload className="w-6 h-6 text-cyan-600" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-700">
                  اضغط لرفع ملف صوتي
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  MP3 · WAV · M4A · OGG — حتى 50 MB
                </p>
              </div>
            </button>
          ) : (
            <div className="border border-cyan-200 bg-cyan-50 rounded-xl p-4 space-y-3">
              {/* File info row */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="flex-1 min-w-0 text-right">
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {audioFile.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {(audioFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <div className="w-9 h-9 bg-cyan-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Music className="w-4 h-4 text-cyan-700" />
                </div>
              </div>

              {/* Audio player preview */}
              <audio controls src={audioPreview} className="w-full h-10" />
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Title */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700 text-right">
            العنوان <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="عنوان التسجيل"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-right"
          />
        </div>

        {/* Transcript */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700 text-right">
            النص المكتوب (Transcript)
          </label>
          <textarea
            value={form.transcript}
            onChange={(e) => setForm({ ...form, transcript: e.target.value })}
            rows={4}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-right resize-none"
          />
        </div>

        {/* Duration + Difficulty */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 text-right">
              المدة (بالثواني)
            </label>
            <input
              type="number"
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-right"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 text-right">
              الصعوبة
            </label>
            <select
              value={form.difficulty}
              onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-right bg-white"
            >
              <option value="EASY">سهل</option>
              <option value="MEDIUM">متوسط</option>
              <option value="HARD">صعب</option>
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate(`/dashboard/general/skills/${skillId}`)}
            className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 font-medium"
          >
            إلغاء
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-2.5 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 font-medium flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            حفظ والانتقال للأسئلة
          </button>
        </div>
      </form>
    </div>
  );
}
