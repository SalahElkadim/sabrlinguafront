// src/pages/general/AddSpeakingToGeneral.jsx  (Video)
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Mic, Save, ArrowRight, Loader2 } from "lucide-react";
import { generalQuestionsAPI } from "../../services/generalService";

export default function AddSpeakingVideoToGeneral() {
  const navigate = useNavigate();
  const { skillId } = useParams();

  const [form, setForm] = useState({
    title: "",
    video_file: "",
    description: "",
    duration: 0,
    difficulty: "MEDIUM",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.video_file.trim()) {
      setError("العنوان ورابط الفيديو مطلوبان");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const res = await generalQuestionsAPI.createSpeakingVideo({
        ...form,
        duration: parseInt(form.duration) || 0,
        general_skill: parseInt(skillId),
      });
      navigate(
        `/dashboard/general/skills/${skillId}/add/speaking/video/${res.video.id}/questions`
      );
    } catch (err) {
      setError(err.response?.data?.error || "حدث خطأ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
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
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
            {error}
          </div>
        )}
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
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700 text-right">
            رابط الفيديو <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.video_file}
            onChange={(e) => setForm({ ...form, video_file: e.target.value })}
            placeholder="https://..."
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-right"
          />
        </div>
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
