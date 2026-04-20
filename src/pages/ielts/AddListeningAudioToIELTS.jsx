// src/pages/AddListeningAudioToIELTS.jsx
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
import { ieltsQuestionsAPI } from "../../services/ieltsService";

export default function AddListeningAudioToIELTS() {
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
      setError("Please select an audio file only");
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setError("File size must be less than 50 MB");
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

      if (data.public_id) {
        setAudioUrl(data.secure_url);
        setAudioPreview(data.secure_url);
        setForm((prev) => ({
          ...prev,
          audio_file: data.public_id,
          duration: data.duration
            ? Math.round(data.duration).toString()
            : prev.duration,
        }));
      } else {
        throw new Error("Failed to retrieve file URL");
      }
    } catch (err) {
      setError(`An error occurred while uploading the file: ${err.message}`);
    } finally {
      setUploadingAudio(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return setError("Recording title is required");
    if (!form.audio_file.trim())
      return setError("Please upload an audio file first");

    setLoading(true);
    try {
      const payload = {
        ...form,
        ielts_skill: skillId,
        duration: form.duration ? parseInt(form.duration) : 0,
      };
      const res = await ieltsQuestionsAPI.createListeningAudio(payload);
      const audioId = res.audio?.id;
      navigate(
        `/dashboard/ielts/skills/${skillId}/add/listening/audio/${audioId}/questions`
      );
    } catch (err) {
      setError(
        err?.response?.data?.error || "An error occurred, please try again"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          to={`/dashboard/ielts/skills/${skillId}`}
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
        >
          <ArrowRight className="w-5 h-5" />
        </Link>
        <div className="bg-cyan-50 p-3 rounded-xl">
          <Headphones className="w-6 h-6 text-cyan-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Add Audio Recording
          </h1>
          <p className="text-sm text-cyan-600 font-medium">IELTS — Listening</p>
        </div>
      </div>

      {/* Form */}
      <div className="card">
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
              Recording Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Example: Conversation at the airport"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* Audio File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Audio File <span className="text-red-500">*</span>
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
                {uploadingAudio ? "Uploading..." : "Upload Audio File"}
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
                  File uploaded successfully
                </span>
              )}
            </div>

            {audioPreview && (
              <div className="mt-3">
                <audio controls className="w-full" src={audioPreview}>
                  Your browser does not support audio playback
                </audio>
              </div>
            )}
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Recording Duration (in seconds)
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
              Transcript
            </label>
            <textarea
              name="transcript"
              value={form.transcript}
              onChange={handleChange}
              placeholder="Write the audio transcript here..."
              rows={5}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
            />
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Difficulty Level
            </label>
            <select
              name="difficulty"
              value={form.difficulty}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
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
              Save & Proceed to Add Questions
            </button>
            <Link
              to={`/dashboard/ielts/skills/${skillId}`}
              className="flex-1 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-medium transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
