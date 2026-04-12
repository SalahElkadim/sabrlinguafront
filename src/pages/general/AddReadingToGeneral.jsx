// src/pages/general/AddSpeakingToGeneral.jsx  (Video)
import { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Mic, Save, ArrowRight, Loader2, Upload, X, Video } from "lucide-react";
import { generalQuestionsAPI } from "../../services/generalService";

export default function AddSpeakingVideoToGeneral() {
  const navigate = useNavigate();
  const { skillId } = useParams();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    duration: 0,
    difficulty: "MEDIUM",
  });
  const [videoFile, setVideoFile] = useState(null); // File object
  const [videoPreview, setVideoPreview] = useState(""); // object URL for <video>
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (videoPreview) URL.revokeObjectURL(videoPreview);

    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));

    // auto-fill title if empty
    if (!form.title.trim()) {
      setForm((f) => ({ ...f, title: file.name.replace(/\.[^/.]+$/, "") }));
    }
  };

  const handleRemoveFile = () => {
    if (videoPreview) URL.revokeObjectURL(videoPreview);
    setVideoFile(null);
    setVideoPreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("العنوان مطلوب");
      return;
    }
    if (!videoFile) {
      setError("يرجى رفع ملف فيديو");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("duration", parseInt(form.duration) || 0);
      formData.append("difficulty", form.difficulty);
      formData.append("general_skill", parseInt(skillId));
      formData.append("video_file", videoFile);

      const res = await generalQuestionsAPI.createSpeakingVideo(formData);
      navigate(
        `/dashboard/general/skills/${skillId}/add/speaking/video/${res.video.id}/questions`
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
        <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
          <Mic className="w-5 h-5 text-orange-700" />
        </div>
        <h1 className="text-xl font-bold text-gray-900">
          إضافة فيديو Speaking
        </h1>
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

        {/* Video File Upload */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700 text-right">
            ملف الفيديو <span className="text-red-500">*</span>
          </label>

          {!videoFile ? (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center gap-3 hover:border-orange-400 hover:bg-orange-50 transition-colors group"
            >
              <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                <Upload className="w-6 h-6 text-orange-600" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-700">
                  اضغط لرفع ملف فيديو
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  MP4 · MOV · AVI · WebM — حتى 200 MB
                </p>
              </div>
            </button>
          ) : (
            <div className="border border-orange-200 bg-orange-50 rounded-xl p-4 space-y-3">
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
                    {videoFile.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {(videoFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <div className="w-9 h-9 bg-orange-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Video className="w-4 h-4 text-orange-700" />
                </div>
              </div>

              {/* Video preview */}
              <video
                controls
                src={videoPreview}
                className="w-full rounded-lg max-h-52 bg-black"
              />
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
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
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-right"
          />
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700 text-right">
            الوصف
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-right resize-none"
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
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-right"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 text-right">
              الصعوبة
            </label>
            <select
              value={form.difficulty}
              onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-right bg-white"
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
            className="flex-1 py-2.5 bg-orange-600 text-white rounded-xl hover:bg-orange-700 font-medium flex items-center justify-center gap-2 disabled:opacity-60"
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
