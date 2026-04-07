// src/pages/step/STEPAIGeneration.jsx
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Upload,
  FileText,
  Headphones,
  Video,
  Sparkles,
  CheckCircle2,
  XCircle,
  Loader2,
  Clock,
  BookOpen,
  Trash2,
  ChevronDown,
  ChevronUp,
  Plus,
  RefreshCw,
  Zap,
  Brain,
} from "lucide-react";
import api from "../../api/axios";

// ─── helpers ───────────────────────────────────────────────────────────────
const fmt = (s) =>
  s === "PENDING"
    ? {
        label: "انتظار",
        color: "text-yellow-600 bg-yellow-50 border-yellow-200",
      }
    : s === "PROCESSING"
    ? {
        label: "جاري المعالجة",
        color: "text-blue-600 bg-blue-50 border-blue-200",
      }
    : s === "DONE"
    ? { label: "مكتمل", color: "text-green-600 bg-green-50 border-green-200" }
    : { label: "فشل", color: "text-red-600 bg-red-50 border-red-200" };

const StatusBadge = ({ status }) => {
  const { label, color } = fmt(status);
  return (
    <span
      className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${color}`}
    >
      {status === "PROCESSING" && (
        <Loader2 className="inline w-3 h-3 mr-1 animate-spin" />
      )}
      {label}
    </span>
  );
};

const SKILL_TYPES = [
  { value: "VOCABULARY", label: "Vocabulary", color: "text-blue-600" },
  { value: "GRAMMAR", label: "Grammar", color: "text-purple-600" },
  { value: "READING", label: "Reading", color: "text-orange-600" },
  { value: "LISTENING", label: "Listening", color: "text-cyan-600" },
  { value: "SPEAKING", label: "Speaking", color: "text-rose-600" },
  { value: "WRITING", label: "Writing", color: "text-green-600" },
];

// ─── Section wrapper ────────────────────────────────────────────────────────
function Section({ icon: Icon, title, color, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl bg-gray-100 ${color}`}>
            <Icon className="w-5 h-5" />
          </div>
          <h2 className="font-bold text-gray-900 text-base">{title}</h2>
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </button>
      {open && <div className="px-6 pb-6 pt-1">{children}</div>}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// 1. BOOKS SECTION
// ══════════════════════════════════════════════════════════════════
function BooksSection({ books, onRefresh }) {
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef();
  const pollingRef = useRef({});

  // poll pending/processing books
  useEffect(() => {
    books.forEach((b) => {
      if (
        (b.status === "PENDING" || b.status === "PROCESSING") &&
        !pollingRef.current[b.id]
      ) {
        pollingRef.current[b.id] = setInterval(async () => {
          try {
            const res = await api.get(`/step/ai/extract-book/${b.id}/status/`);
            if (res.data.status === "DONE" || res.data.status === "FAILED") {
              clearInterval(pollingRef.current[b.id]);
              delete pollingRef.current[b.id];
              onRefresh();
            }
          } catch {}
        }, 3000);
      }
    });
    return () => Object.values(pollingRef.current).forEach(clearInterval);
  }, [books]);

  const handleUpload = async () => {
    if (!name.trim() || !file) return setError("الاسم والملف مطلوبان");
    setError("");
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("name", name);
      fd.append("pdf_file", file);
      await api.post("/step/ai/extract-book/upload/", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setName("");
      setFile(null);
      fileRef.current.value = "";
      onRefresh();
    } catch (e) {
      setError(e.response?.data?.error || "حدث خطأ");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Section icon={BookOpen} title="رفع الكتب (PDF)" color="text-indigo-600">
      {/* Upload form */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-5 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="اسم الكتاب"
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
          />
          <div
            className="border-2 border-dashed border-indigo-300 rounded-lg px-3 py-2 flex items-center gap-2 cursor-pointer bg-white hover:border-indigo-500 transition-colors"
            onClick={() => fileRef.current.click()}
          >
            <Upload className="w-4 h-4 text-indigo-500 shrink-0" />
            <span className="text-sm text-gray-500 truncate">
              {file ? file.name : "اختر ملف PDF"}
            </span>
            <input
              ref={fileRef}
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>
        </div>
        {error && <p className="text-red-500 text-xs">{error}</p>}
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white py-2.5 rounded-xl text-sm font-medium transition-colors"
        >
          {uploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
          {uploading ? "جاري الرفع والمعالجة..." : "رفع الكتاب واستخراج النص"}
        </button>
      </div>

      {/* Book list */}
      {books.length === 0 ? (
        <p className="text-center text-gray-400 text-sm py-4">
          لا توجد كتب مرفوعة بعد
        </p>
      ) : (
        <div className="space-y-2">
          {books.map((b) => (
            <div
              key={b.id}
              className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-4 py-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <FileText className="w-4 h-4 text-indigo-500 shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {b.name}
                  </p>
                  {b.page_count > 0 && (
                    <p className="text-xs text-gray-400">{b.page_count} صفحة</p>
                  )}
                </div>
              </div>
              <StatusBadge status={b.status} />
            </div>
          ))}
        </div>
      )}
    </Section>
  );
}

// ══════════════════════════════════════════════════════════════════
// 2. MEDIA SECTION
// ══════════════════════════════════════════════════════════════════
function MediaSection({ media, onRefresh }) {
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef();
  const pollingRef = useRef({});

  useEffect(() => {
    media.forEach((m) => {
      if (
        (m.status === "PENDING" || m.status === "PROCESSING") &&
        !pollingRef.current[m.id]
      ) {
        pollingRef.current[m.id] = setInterval(async () => {
          try {
            const res = await api.get(`/step/ai/extract-media/${m.id}/status/`);
            if (res.data.status === "DONE" || res.data.status === "FAILED") {
              clearInterval(pollingRef.current[m.id]);
              delete pollingRef.current[m.id];
              onRefresh();
            }
          } catch {}
        }, 4000);
      }
    });
    return () => Object.values(pollingRef.current).forEach(clearInterval);
  }, [media]);

  const handleUpload = async () => {
    if (!name.trim() || !file) return setError("الاسم والملف مطلوبان");
    setError("");
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("name", name);
      fd.append("media_file", file);
      await api.post("/step/ai/extract-media/upload/", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setName("");
      setFile(null);
      fileRef.current.value = "";
      onRefresh();
    } catch (e) {
      setError(e.response?.data?.error || "حدث خطأ");
    } finally {
      setUploading(false);
    }
  };

  const VIDEO_EXT = [".mp4", ".mov", ".avi", ".mkv", ".webm"];
  const AUDIO_EXT = [".mp3", ".wav", ".m4a", ".ogg", ".flac"];
  const accept = [...VIDEO_EXT, ...AUDIO_EXT].join(",");

  return (
    <Section
      icon={Headphones}
      title="رفع الفيديو / الصوت (Transcription)"
      color="text-cyan-600"
    >
      {/* Upload form */}
      <div className="bg-cyan-50 border border-cyan-100 rounded-xl p-4 mb-5 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="اسم الملف"
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-white"
          />
          <div
            className="border-2 border-dashed border-cyan-300 rounded-lg px-3 py-2 flex items-center gap-2 cursor-pointer bg-white hover:border-cyan-500 transition-colors"
            onClick={() => fileRef.current.click()}
          >
            <Video className="w-4 h-4 text-cyan-500 shrink-0" />
            <span className="text-sm text-gray-500 truncate">
              {file ? file.name : "mp4 / mp3 / wav / ..."}
            </span>
            <input
              ref={fileRef}
              type="file"
              accept={accept}
              className="hidden"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>
        </div>
        {error && <p className="text-red-500 text-xs">{error}</p>}
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="w-full flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-300 text-white py-2.5 rounded-xl text-sm font-medium transition-colors"
        >
          {uploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
          {uploading
            ? "جاري الرفع والتحويل لنص..."
            : "رفع الملف واستخراج النص (Whisper)"}
        </button>
        <p className="text-xs text-cyan-600 text-center">
          يدعم: mp4 · mov · avi · mp3 · wav · m4a · ogg · flac
        </p>
      </div>

      {/* Media list */}
      {media.length === 0 ? (
        <p className="text-center text-gray-400 text-sm py-4">
          لا توجد ملفات وسائط بعد
        </p>
      ) : (
        <div className="space-y-2">
          {media.map((m) => (
            <div
              key={m.id}
              className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-4 py-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                {m.media_type === "VIDEO" ? (
                  <Video className="w-4 h-4 text-cyan-500 shrink-0" />
                ) : (
                  <Headphones className="w-4 h-4 text-cyan-500 shrink-0" />
                )}
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {m.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {m.media_type === "VIDEO" ? "فيديو" : "صوت"}
                    {m.duration_seconds > 0 && ` · ${m.duration_seconds} ثانية`}
                  </p>
                </div>
              </div>
              <StatusBadge status={m.status} />
            </div>
          ))}
        </div>
      )}
    </Section>
  );
}

// ══════════════════════════════════════════════════════════════════
// 3. GENERATE SKILL SECTION
// ══════════════════════════════════════════════════════════════════
function GenerateSection({ doneBooks, doneMedia, onRefresh, jobs }) {
  const pollingRef = useRef({});

  const [form, setForm] = useState({
    skill_type: "",
    skill_title: "",
    skill_description: "",
    no_easy: 5,
    no_medium: 5,
    no_hard: 5,
    additional_notes: "",
  });
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  // poll active jobs
  useEffect(() => {
    jobs.forEach((j) => {
      if (
        (j.status === "PENDING" || j.status === "PROCESSING") &&
        !pollingRef.current[j.id]
      ) {
        pollingRef.current[j.id] = setInterval(async () => {
          try {
            const res = await api.get(`/step/ai/jobs/${j.id}/status/`);
            if (res.data.status === "DONE" || res.data.status === "FAILED") {
              clearInterval(pollingRef.current[j.id]);
              delete pollingRef.current[j.id];
              onRefresh();
            }
          } catch {}
        }, 4000);
      }
    });
    return () => Object.values(pollingRef.current).forEach(clearInterval);
  }, [jobs]);

  const toggleBook = (id) =>
    setSelectedBooks((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  const toggleMedia = (id) =>
    setSelectedMedia((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const handleGenerate = async () => {
    if (!form.skill_type) return setError("اختر نوع المهارة");
    if (!form.skill_title.trim()) return setError("العنوان مطلوب");
    if (selectedBooks.length === 0 && selectedMedia.length === 0)
      return setError("اختر كتاباً أو ملف وسائط واحداً على الأقل");
    if (form.no_easy + form.no_medium + form.no_hard === 0)
      return setError("يجب تحديد عدد أسئلة أكثر من صفر");
    setError("");
    setGenerating(true);
    try {
      await api.post("/step/ai/generate-skill/", {
        ...form,
        book_ids: selectedBooks,
        media_ids: selectedMedia,
      });
      onRefresh();
    } catch (e) {
      setError(e.response?.data?.error || "حدث خطأ أثناء التوليد");
    } finally {
      setGenerating(false);
    }
  };

  const total = form.no_easy + form.no_medium + form.no_hard;

  return (
    <Section
      icon={Brain}
      title="توليد مهارة جديدة بالذكاء الاصطناعي"
      color="text-violet-600"
    >
      <div className="space-y-5">
        {/* Skill type + title */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
              نوع المهارة <span className="text-red-500">*</span>
            </label>
            <select
              value={form.skill_type}
              onChange={(e) => setForm({ ...form, skill_type: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
            >
              <option value="">-- اختر --</option>
              {SKILL_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
              عنوان المهارة <span className="text-red-500">*</span>
            </label>
            <input
              value={form.skill_title}
              onChange={(e) =>
                setForm({ ...form, skill_title: e.target.value })
              }
              placeholder="مثال: Advanced Vocabulary"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
            الوصف (اختياري)
          </label>
          <input
            value={form.skill_description}
            onChange={(e) =>
              setForm({ ...form, skill_description: e.target.value })
            }
            placeholder="وصف مختصر للمهارة..."
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
          />
        </div>

        {/* Questions count */}
        <div>
          <label className="text-xs font-semibold text-gray-600 mb-2 block">
            توزيع الأسئلة{" "}
            <span className="text-violet-600 font-bold">
              (المجموع: {total})
            </span>
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              {
                key: "no_easy",
                label: "سهل",
                color: "border-green-300 focus:ring-green-400",
              },
              {
                key: "no_medium",
                label: "متوسط",
                color: "border-yellow-300 focus:ring-yellow-400",
              },
              {
                key: "no_hard",
                label: "صعب",
                color: "border-red-300 focus:ring-red-400",
              },
            ].map(({ key, label, color }) => (
              <div key={key}>
                <label className="text-xs text-gray-500 mb-1 block">
                  {label}
                </label>
                <input
                  type="number"
                  min={0}
                  value={form[key]}
                  onChange={(e) =>
                    setForm({ ...form, [key]: parseInt(e.target.value) || 0 })
                  }
                  className={`w-full border rounded-xl px-3 py-2 text-sm font-bold text-center focus:outline-none focus:ring-2 ${color}`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Source selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Books */}
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-2 block flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" /> الكتب المصدر
            </label>
            {doneBooks.length === 0 ? (
              <div className="border border-dashed border-gray-200 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-400">لا توجد كتب جاهزة</p>
              </div>
            ) : (
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {doneBooks.map((b) => (
                  <label
                    key={b.id}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border cursor-pointer transition-all text-sm ${
                      selectedBooks.includes(b.id)
                        ? "bg-indigo-50 border-indigo-400 text-indigo-700"
                        : "bg-gray-50 border-gray-200 text-gray-700 hover:border-indigo-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedBooks.includes(b.id)}
                      onChange={() => toggleBook(b.id)}
                      className="w-4 h-4 accent-indigo-600"
                    />
                    <span className="truncate">{b.name}</span>
                    <span className="text-xs text-gray-400 shrink-0">
                      {b.page_count} ص
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Media */}
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-2 block flex items-center gap-1">
              <Headphones className="w-3.5 h-3.5" /> ملفات الوسائط المصدر
            </label>
            {doneMedia.length === 0 ? (
              <div className="border border-dashed border-gray-200 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-400">لا توجد وسائط جاهزة</p>
              </div>
            ) : (
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {doneMedia.map((m) => (
                  <label
                    key={m.id}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border cursor-pointer transition-all text-sm ${
                      selectedMedia.includes(m.id)
                        ? "bg-cyan-50 border-cyan-400 text-cyan-700"
                        : "bg-gray-50 border-gray-200 text-gray-700 hover:border-cyan-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedMedia.includes(m.id)}
                      onChange={() => toggleMedia(m.id)}
                      className="w-4 h-4 accent-cyan-600"
                    />
                    {m.media_type === "VIDEO" ? (
                      <Video className="w-3.5 h-3.5 shrink-0" />
                    ) : (
                      <Headphones className="w-3.5 h-3.5 shrink-0" />
                    )}
                    <span className="truncate">{m.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Additional notes */}
        <div>
          <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
            ملاحظات إضافية للـ AI (اختياري)
          </label>
          <textarea
            value={form.additional_notes}
            onChange={(e) =>
              setForm({ ...form, additional_notes: e.target.value })
            }
            rows={2}
            placeholder="مثال: ركز على المفردات الأكاديمية، تجنب الأسئلة المتعلقة بالأسماء..."
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 resize-none"
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <XCircle className="w-4 h-4 text-red-500 shrink-0" />
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={generating}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 disabled:opacity-60 text-white py-3 rounded-xl font-semibold text-sm transition-all shadow-md hover:shadow-lg"
        >
          {generating ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Sparkles className="w-5 h-5" />
          )}
          {generating
            ? "جاري الإرسال للـ AI..."
            : `توليد مهارة بـ ${total} سؤال`}
        </button>

        {/* Jobs history */}
        {jobs.length > 0 && (
          <div className="mt-2">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
              سجل الجلسة
            </h3>
            <div className="space-y-2">
              {jobs.map((j) => (
                <div
                  key={j.id}
                  className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {j.skill_title}
                    </p>
                    <p className="text-xs text-gray-400">
                      {j.skill_type} ·{" "}
                      {j.status === "DONE"
                        ? `${j.questions_created} سؤال تم إنشاؤه`
                        : j.status === "FAILED"
                        ? j.error_message?.slice(0, 60)
                        : "جاري المعالجة..."}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <StatusBadge status={j.status} />
                    {j.status === "DONE" && j.skill_id && (
                      <Link
                        to={`/dashboard/step/skills/${j.skill_id}`}
                        className="text-xs text-indigo-600 hover:underline font-medium"
                      >
                        عرض
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Section>
  );
}

// ══════════════════════════════════════════════════════════════════
// MAIN PAGE
// ══════════════════════════════════════════════════════════════════
export default function STEPAIGeneration() {
  const [books, setBooks] = useState([]);
  const [media, setMedia] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAll = async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const [bRes, mRes] = await Promise.all([
        api.get("/step/ai/extract-book/"),
        api.get("/step/ai/extract-media/"),
      ]);
      setBooks(bRes.data.books || []);
      setMedia(mRes.data.media || []);
    } catch {}
    setLoading(false);
    setRefreshing(false);
  };

  // fetch all books/media including non-done for status display
  const fetchAllWithStatus = async () => {
    try {
      const [bRes, mRes] = await Promise.all([
        api.get("/step/ai/extract-book/"),
        api.get("/step/ai/extract-media/"),
      ]);
      // merge with existing to show processing too
      setBooks((prev) => {
        const done = bRes.data.books || [];
        const doneIds = done.map((b) => b.id);
        const pending = prev.filter((b) => !doneIds.includes(b.id));
        return [...pending, ...done];
      });
      setMedia((prev) => {
        const done = mRes.data.media || [];
        const doneIds = done.map((m) => m.id);
        const pending = prev.filter((m) => !doneIds.includes(m.id));
        return [...pending, ...done];
      });
    } catch {}
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleRefresh = () => fetchAll(true);

  const doneBooks = books.filter((b) => b.status === "DONE");
  const doneMedia = media.filter((m) => m.status === "DONE");

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          to="/dashboard/step"
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
        >
          <ArrowRight className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-violet-600" />
            توليد المحتوى بالذكاء الاصطناعي
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            ارفع كتباً أو ملفات صوتية/فيديو ثم ولّد أسئلة STEP تلقائياً
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
          title="تحديث"
        >
          <RefreshCw
            className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
          />
        </button>
      </div>

      {/* How it works banner */}
      <div className="bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-200 rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <Zap className="w-5 h-5 text-violet-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-violet-800 mb-1">كيف يعمل؟</p>
            <p className="text-xs text-violet-600 leading-relaxed">
              <span className="font-semibold">١.</span> ارفع ملفات PDF أو
              صوت/فيديو → <span className="font-semibold">٢.</span> انتظر اكتمال
              المعالجة (استخراج النص) →{" "}
              <span className="font-semibold">٣.</span> اختر المصادر وحدد عدد
              الأسئلة → <span className="font-semibold">٤.</span> اضغط توليد
              ويتكفل الـ AI بالباقي ✨
            </p>
          </div>
        </div>
      </div>

      {/* Sections */}
      <BooksSection
        books={books}
        onRefresh={() => {
          fetchAllWithStatus();
        }}
      />
      <MediaSection
        media={media}
        onRefresh={() => {
          fetchAllWithStatus();
        }}
      />
      <GenerateSection
        doneBooks={doneBooks}
        doneMedia={doneMedia}
        jobs={jobs}
        onRefresh={() => {
          setJobs((prev) => prev); // trigger re-poll
          handleRefresh();
        }}
      />
    </div>
  );
}
