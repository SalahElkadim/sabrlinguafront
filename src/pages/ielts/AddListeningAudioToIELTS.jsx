// src/pages/ielts/JobMediaUploader.jsx
import { useState, useRef } from "react";
import {
  Upload,
  Loader2,
  CheckCircle2,
  XCircle,
  Headphones,
  Video,
} from "lucide-react";
import api from "../../api/axios";

export default function JobMediaUploader({ job, onUploaded }) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef();

  if (!["LISTENING", "SPEAKING"].includes(job.skill_type)) return null;
  if (job.status !== "DONE") return null;

  const isAudio = job.skill_type === "LISTENING";
  const accept = isAudio ? "audio/*" : "video/*";

  const reset = () => {
    setFile(null);
    setProgress(0);
    setDone(false);
    setError("");
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError("");
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "react_uploads");
      formData.append("resource_type", "video");

      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dyxozpomy/upload",
        { method: "POST", body: formData }
      );

      const data = await response.json();
      if (data.error) throw new Error(data.error.message);
      if (!data.secure_url) throw new Error("لم يتم الحصول على رابط الملف");

      setProgress(100);

      if (isAudio) {
        await api.patch(`/general/listening/audio/${job.audio_id}/update/`, {
          audio_file: data.secure_url,
        });
      } else {
        await api.patch(`/general/speaking/videos/${job.video_id}/update/`, {
          video_file: data.secure_url,
        });
      }

      setDone(true);
      onUploaded?.();
      setTimeout(() => setOpen(false), 1500);
    } catch (e) {
      setError(e.message || "حدث خطأ أثناء الرفع");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => {
          reset();
          setOpen(true);
        }}
        className="flex items-center gap-1.5 text-xs bg-violet-50 hover:bg-violet-100 text-violet-700 border border-violet-200 px-3 py-1.5 rounded-lg transition-colors font-medium"
      >
        {isAudio ? (
          <Headphones className="w-3.5 h-3.5" />
        ) : (
          <Video className="w-3.5 h-3.5" />
        )}
        {isAudio ? "رفع ملف الصوت" : "رفع ملف الفيديو"}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 text-base">
                {isAudio ? "رفع ملف الصوت" : "رفع ملف الفيديو"}
              </h3>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-xl leading-none"
              >
                ×
              </button>
            </div>

            <p className="text-xs text-gray-500 mb-4 bg-gray-50 rounded-lg p-3">
              <span className="font-semibold text-gray-700">
                {job.skill_title}
              </span>
              <br />
              الملف هيتم ربطه بالـ{" "}
              {isAudio ? "ListeningAudio" : "SpeakingVideo"} الناتج عن هذا الـ
              job
            </p>

            {!done && (
              <div
                onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-violet-200 hover:border-violet-400 rounded-xl p-6 text-center cursor-pointer transition-colors mb-4"
              >
                <Upload className="w-8 h-8 text-violet-400 mx-auto mb-2" />
                {file ? (
                  <p className="text-sm font-medium text-violet-700">
                    {file.name}
                  </p>
                ) : (
                  <>
                    <p className="text-sm text-gray-500">
                      اسحب الملف هنا أو اضغط للاختيار
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {isAudio
                        ? "mp3 · wav · m4a · ogg · flac"
                        : "mp4 · mov · avi · mkv · webm"}
                    </p>
                  </>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept={accept}
                  className="hidden"
                  onChange={(e) => setFile(e.target.files[0] || null)}
                />
              </div>
            )}

            {uploading && (
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>جاري الرفع...</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-violet-500 transition-all duration-200"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {done && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-4">
                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                <p className="text-green-700 text-sm font-medium">
                  تم الرفع وتحديث الـ URL بنجاح
                </p>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
                <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {!done && (
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 text-sm border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleUpload}
                  disabled={!file || uploading}
                  className="flex items-center gap-2 px-4 py-2 text-sm bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white rounded-xl font-medium transition-colors"
                >
                  {uploading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  رفع الملف
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
