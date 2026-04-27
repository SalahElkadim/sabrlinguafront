// src/pages/ielts/IELTSAIGeneration.jsx
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
  Check,
  LayoutGrid,
  PlusCircle,
  Search,
} from "lucide-react";
import api from "../../api/axios";
import JobMediaUploader from "./JobMediaUploader";

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
  {
    value: "GENERAL_PATH",
    label: "General Path (مسار شامل)",
    color: "text-violet-600",
    isGeneral: true,
  },
];

const SKILL_TYPE_LABELS = {
  VOCABULARY: "Vocabulary",
  GRAMMAR: "Grammar",
  READING: "Reading",
  LISTENING: "Listening",
  SPEAKING: "Speaking",
  WRITING: "Writing",
  GENERAL_PATH: "مسار شامل",
};

// ─── Section wrapper ────────────────────────────────────────────────────────
function Section({
  icon: Icon,
  title,
  color,
  children,
  defaultOpen = true,
  badge,
}) {
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
          {badge && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
              {badge}
            </span>
          )}
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

// ─── Multi-select dropdown ──────────────────────────────────────────────────
function MultiSelectDropdown({
  items,
  selected,
  onToggle,
  placeholder,
  color = "indigo",
  renderItem,
  renderTag,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const colorMap = {
    indigo: {
      border: "border-indigo-400",
      bg: "bg-indigo-50",
      tag: "bg-indigo-100 text-indigo-700",
      hover: "hover:bg-indigo-50",
      selected: "bg-indigo-50",
    },
    cyan: {
      border: "border-cyan-400",
      bg: "bg-cyan-50",
      tag: "bg-cyan-100 text-cyan-700",
      hover: "hover:bg-cyan-50",
      selected: "bg-cyan-50",
    },
    emerald: {
      border: "border-emerald-400",
      bg: "bg-emerald-50",
      tag: "bg-emerald-100 text-emerald-700",
      hover: "hover:bg-emerald-50",
      selected: "bg-emerald-50",
    },
  };
  const c = colorMap[color] || colorMap.indigo;

  const accentColor =
    color === "indigo" ? "#4f46e5" : color === "cyan" ? "#0891b2" : "#059669";

  return (
    <div ref={ref} className="relative">
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {selected.map((id) => {
            const item = items.find((x) => x.id === id);
            return (
              <span
                key={id}
                className={`flex items-center gap-1 ${c.tag} text-xs px-2.5 py-1 rounded-full font-medium`}
              >
                {renderTag ? renderTag(item) : item?.name}
                <button
                  onClick={() => onToggle(id)}
                  className="hover:opacity-70 transition-opacity"
                >
                  <XCircle className="w-3.5 h-3.5" />
                </button>
              </span>
            );
          })}
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center justify-between border rounded-xl px-4 py-2.5 text-sm transition-colors bg-white ${
          open ? `${c.border} ${c.bg}` : "border-gray-200 hover:border-gray-300"
        }`}
      >
        <span
          className={
            selected.length > 0 ? "text-gray-700 font-medium" : "text-gray-400"
          }
        >
          {selected.length > 0 ? `${selected.length} عنصر محدد` : placeholder}
        </span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </button>
      {open && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          <div className="max-h-52 overflow-y-auto divide-y divide-gray-100">
            {items.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">
                لا توجد عناصر جاهزة
              </p>
            ) : (
              items.map((item) => (
                <label
                  key={item.id}
                  className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
                    selected.includes(item.id) ? c.selected : c.hover
                  }`}
                >
                  <div
                    className="w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors"
                    style={
                      selected.includes(item.id)
                        ? {
                            backgroundColor: accentColor,
                            borderColor: accentColor,
                          }
                        : { borderColor: "#d1d5db" }
                    }
                  >
                    {selected.includes(item.id) && (
                      <Check className="w-2.5 h-2.5 text-white" />
                    )}
                  </div>
                  <input
                    type="checkbox"
                    checked={selected.includes(item.id)}
                    onChange={() => onToggle(item.id)}
                    className="hidden"
                  />
                  {renderItem ? (
                    renderItem(item, selected.includes(item.id))
                  ) : (
                    <span className="text-sm text-gray-700 flex-1 truncate">
                      {item.name}
                    </span>
                  )}
                </label>
              ))
            )}
          </div>
        </div>
      )}
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

  useEffect(() => {
    books.forEach((b) => {
      if (
        (b.status === "PENDING" || b.status === "PROCESSING") &&
        !pollingRef.current[b.id]
      ) {
        pollingRef.current[b.id] = setInterval(async () => {
          try {
            const res = await api.get(`/ielts/ai/extract-book/${b.id}/status/`);
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
      await api.post("/ielts/ai/extract-book/upload/", fd, {
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
            const res = await api.get(
              `/ielts/ai/extract-media/${m.id}/status/`
            );
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
      await api.post("/ielts/ai/extract-media/upload/", fd, {
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
// GENERAL PATH INFO BANNER
// ══════════════════════════════════════════════════════════════════
function GeneralPathBanner() {
  return (
    <div className="bg-violet-50 border border-violet-200 rounded-xl p-3.5 flex items-start gap-3">
      <LayoutGrid className="w-4 h-4 text-violet-600 shrink-0 mt-0.5" />
      <div>
        <p className="text-xs font-bold text-violet-800 mb-1">
          المسار الشامل — General Path
        </p>
        <p className="text-xs text-violet-600 leading-relaxed">
          سيقوم الـ AI بتوليد أسئلة من{" "}
          <span className="font-semibold">جميع الأنواع الستة</span> في مهارة
          واحدة: Vocabulary · Grammar · Reading · Listening · Speaking ·
          Writing. إجمالي الأسئلة المطلوبة سيتوزع بالتساوي عليهم.
        </p>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// JOBS LIST (مشترك بين الـ sections)
// ══════════════════════════════════════════════════════════════════
function JobsList({ jobs, onRefresh, label = "سجل الجلسة" }) {
  const pollingRef = useRef({});

  useEffect(() => {
    jobs.forEach((j) => {
      if (
        (j.status === "PENDING" || j.status === "PROCESSING") &&
        !pollingRef.current[j.id]
      ) {
        pollingRef.current[j.id] = setInterval(async () => {
          try {
            const res = await api.get(`/ielts/ai/jobs/${j.id}/status/`);
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

  if (jobs.length === 0) return null;

  return (
    <div className="mt-2">
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
        {label}
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
                {j.skill_type === "GENERAL_PATH"
                  ? "مسار شامل (6 أنواع)"
                  : SKILL_TYPE_LABELS[j.skill_type] || j.skill_type}{" "}
                ·{" "}
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
                  to={`/dashboard/ielts/skills/${j.skill_id}`}
                  className="text-xs text-indigo-600 hover:underline font-medium"
                >
                  عرض
                </Link>
              )}
              <JobMediaUploader job={j} onUploaded={onRefresh} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// SHARED: Sources picker (كتب + ميديا + عدد الأسئلة + ملاحظات)
// ══════════════════════════════════════════════════════════════════
function SourcesPicker({
  doneBooks,
  doneMedia,
  loadingSources,
  selectedBooks,
  selectedMedia,
  toggleBook,
  toggleMedia,
  form,
  setForm,
  onRefreshSources,
  isGeneralPath = false,
}) {
  const total = form.no_easy + form.no_medium + form.no_hard;
  return (
    <>
      {/* Questions count */}
      <div>
        <label className="text-xs font-semibold text-gray-600 mb-2 block">
          توزيع الأسئلة{" "}
          <span className="text-violet-600 font-bold">
            (المجموع: {total}
            {isGeneralPath && ` — ~${Math.ceil(total / 6)} لكل نوع`})
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
        <div>
          <label className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" /> الكتب المصدر
          </label>
          {loadingSources ? (
            <div className="flex items-center gap-2 text-sm text-gray-400 border border-gray-200 rounded-xl px-4 py-3">
              <Loader2 className="w-4 h-4 animate-spin" /> جاري التحميل...
            </div>
          ) : (
            <MultiSelectDropdown
              items={doneBooks}
              selected={selectedBooks}
              onToggle={toggleBook}
              placeholder="اختر كتاباً أو أكثر..."
              color="indigo"
              renderTag={(item) => (
                <span className="flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  {item?.name}
                </span>
              )}
              renderItem={(item) => (
                <>
                  <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span className="text-sm text-gray-700 flex-1 truncate">
                    {item.name}
                  </span>
                  <span className="text-xs text-gray-400 shrink-0">
                    {item.page_count} ص
                  </span>
                </>
              )}
            />
          )}
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1">
            <Headphones className="w-3.5 h-3.5" /> ملفات الوسائط المصدر
          </label>
          {loadingSources ? (
            <div className="flex items-center gap-2 text-sm text-gray-400 border border-gray-200 rounded-xl px-4 py-3">
              <Loader2 className="w-4 h-4 animate-spin" /> جاري التحميل...
            </div>
          ) : (
            <MultiSelectDropdown
              items={doneMedia}
              selected={selectedMedia}
              onToggle={toggleMedia}
              placeholder="اختر ملف صوت أو فيديو..."
              color="cyan"
              renderTag={(item) => (
                <span className="flex items-center gap-1">
                  {item?.media_type === "VIDEO" ? (
                    <Video className="w-3 h-3" />
                  ) : (
                    <Headphones className="w-3 h-3" />
                  )}
                  {item?.name}
                </span>
              )}
              renderItem={(item) => (
                <>
                  {item.media_type === "VIDEO" ? (
                    <Video className="w-4 h-4 text-cyan-400 shrink-0" />
                  ) : (
                    <Headphones className="w-4 h-4 text-cyan-400 shrink-0" />
                  )}
                  <span className="text-sm text-gray-700 flex-1 truncate">
                    {item.name}
                  </span>
                  <span className="text-xs text-gray-400 shrink-0">
                    {item.media_type === "VIDEO" ? "فيديو" : "صوت"}
                  </span>
                </>
              )}
            />
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={onRefreshSources}
        disabled={loadingSources}
        className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors"
      >
        <RefreshCw
          className={`w-3.5 h-3.5 ${loadingSources ? "animate-spin" : ""}`}
        />
        تحديث قائمة المصادر
      </button>

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
          placeholder={
            isGeneralPath
              ? "مثال: ركز على مواضيع البيئة، اجعل أسئلة الـ Writing أكاديمية..."
              : "مثال: ركز على المفردات الأكاديمية، تجنب الأسئلة المتعلقة بالأسماء..."
          }
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 resize-none"
        />
      </div>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════
// 3. GENERATE NEW SKILL SECTION
// ══════════════════════════════════════════════════════════════════
function GenerateSection({ onRefresh, jobs }) {
  const [doneBooks, setDoneBooks] = useState([]);
  const [doneMedia, setDoneMedia] = useState([]);
  const [loadingSources, setLoadingSources] = useState(true);

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

  const isGeneralPath = form.skill_type === "GENERAL_PATH";

  const fetchSources = async () => {
    setLoadingSources(true);
    try {
      const [bRes, mRes] = await Promise.all([
        api.get("/ielts/ai/extract-book/"),
        api.get("/ielts/ai/extract-media/"),
      ]);
      setDoneBooks(bRes.data.books || []);
      setDoneMedia(mRes.data.media || []);
    } catch {}
    setLoadingSources(false);
  };

  useEffect(() => {
    fetchSources();
  }, []);

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
      await api.post("/ielts/ai/generate-skill/", {
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
  const generateBtnLabel = isGeneralPath
    ? `توليد مسار شامل بـ ${total} سؤال (6 أنواع)`
    : `توليد مهارة بـ ${total} سؤال`;

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
              <optgroup label="مهارة واحدة">
                {SKILL_TYPES.filter((t) => !t.isGeneral).map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </optgroup>
              <optgroup label="مسار شامل">
                {SKILL_TYPES.filter((t) => t.isGeneral).map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </optgroup>
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
              placeholder={
                isGeneralPath
                  ? "مثال: IELTS Comprehensive Practice"
                  : "مثال: Advanced Vocabulary"
              }
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
          </div>
        </div>

        {isGeneralPath && <GeneralPathBanner />}

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

        <SourcesPicker
          doneBooks={doneBooks}
          doneMedia={doneMedia}
          loadingSources={loadingSources}
          selectedBooks={selectedBooks}
          selectedMedia={selectedMedia}
          toggleBook={toggleBook}
          toggleMedia={toggleMedia}
          form={form}
          setForm={setForm}
          onRefreshSources={fetchSources}
          isGeneralPath={isGeneralPath}
        />

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <XCircle className="w-4 h-4 text-red-500 shrink-0" />
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={generating}
          className={`w-full flex items-center justify-center gap-2 text-white py-3 rounded-xl font-semibold text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-60 ${
            isGeneralPath
              ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700"
              : "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
          }`}
        >
          {generating ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : isGeneralPath ? (
            <LayoutGrid className="w-5 h-5" />
          ) : (
            <Sparkles className="w-5 h-5" />
          )}
          {generating ? "جاري الإرسال للـ AI..." : generateBtnLabel}
        </button>

        <JobsList
          jobs={jobs}
          onRefresh={onRefresh}
          label="سجل الجلسة — مهارات جديدة"
        />
      </div>
    </Section>
  );
}

// ══════════════════════════════════════════════════════════════════
// 4. ADD QUESTIONS TO EXISTING SKILL SECTION ← جديد
// ══════════════════════════════════════════════════════════════════
function AddQuestionsSection({ onRefresh, jobs }) {
  const [doneBooks, setDoneBooks] = useState([]);
  const [doneMedia, setDoneMedia] = useState([]);
  const [loadingSources, setLoadingSources] = useState(true);
  const [existingSkills, setExistingSkills] = useState([]);
  const [loadingSkills, setLoadingSkills] = useState(true);
  const [skillSearch, setSkillSearch] = useState("");

  const [selectedSkillId, setSelectedSkillId] = useState("");
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [form, setForm] = useState({
    no_easy: 5,
    no_medium: 5,
    no_hard: 5,
    additional_notes: "",
  });
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const fetchSources = async () => {
    setLoadingSources(true);
    try {
      const [bRes, mRes] = await Promise.all([
        api.get("/ielts/ai/extract-book/"),
        api.get("/ielts/ai/extract-media/"),
      ]);
      setDoneBooks(bRes.data.books || []);
      setDoneMedia(mRes.data.media || []);
    } catch {}
    setLoadingSources(false);
  };

  const fetchSkills = async () => {
    setLoadingSkills(true);
    try {
      const res = await api.get("/ielts/skills/");
      setExistingSkills(res.data.skills || []);
    } catch {}
    setLoadingSkills(false);
  };

  useEffect(() => {
    fetchSources();
    fetchSkills();
  }, []);

  const toggleBook = (id) =>
    setSelectedBooks((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  const toggleMedia = (id) =>
    setSelectedMedia((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const selectedSkill = existingSkills.find(
    (s) => s.id === Number(selectedSkillId)
  );

  const filteredSkills = existingSkills.filter(
    (s) =>
      s.title.toLowerCase().includes(skillSearch.toLowerCase()) ||
      (SKILL_TYPE_LABELS[s.skill_type] || "").includes(skillSearch)
  );

  const handleAddQuestions = async () => {
    if (!selectedSkillId) return setError("اختر مهارة أولاً");
    if (selectedBooks.length === 0 && selectedMedia.length === 0)
      return setError("اختر كتاباً أو ملف وسائط على الأقل");
    if (form.no_easy + form.no_medium + form.no_hard === 0)
      return setError("يجب تحديد عدد أسئلة أكثر من صفر");
    setError("");
    setSuccessMsg("");
    setGenerating(true);
    try {
      await api.post("/ielts/ai/add-questions/", {
        skill_id: Number(selectedSkillId),
        book_ids: selectedBooks,
        media_ids: selectedMedia,
        no_easy: form.no_easy,
        no_medium: form.no_medium,
        no_hard: form.no_hard,
        additional_notes: form.additional_notes,
      });
      setSuccessMsg(
        `✅ بدأ إضافة الأسئلة على "${selectedSkill?.title}" — ستظهر بعد اكتمال المعالجة`
      );
      setSelectedBooks([]);
      setSelectedMedia([]);
      onRefresh();
    } catch (e) {
      setError(e.response?.data?.error || "حدث خطأ أثناء إضافة الأسئلة");
    } finally {
      setGenerating(false);
    }
  };

  const total = form.no_easy + form.no_medium + form.no_hard;
  const isGeneralPath = selectedSkill?.skill_type === "GENERAL_PATH";

  return (
    <Section
      icon={PlusCircle}
      title="إضافة أسئلة لمهارة موجودة"
      color="text-emerald-600"
      badge="جديد"
      defaultOpen={false}
    >
      <div className="space-y-5">
        {/* Info banner */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-start gap-3">
          <PlusCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <p className="text-xs text-emerald-700 leading-relaxed">
            اختر مهارة موجودة بالفعل وسيقوم الـ AI بإضافة أسئلة جديدة عليها{" "}
            <span className="font-semibold">دون حذف أي أسئلة قائمة.</span>
          </p>
        </div>

        {/* Skill selector */}
        <div>
          <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
            اختر المهارة <span className="text-red-500">*</span>
          </label>

          {loadingSkills ? (
            <div className="flex items-center gap-2 text-sm text-gray-400 border border-gray-200 rounded-xl px-4 py-3">
              <Loader2 className="w-4 h-4 animate-spin" /> جاري تحميل
              المهارات...
            </div>
          ) : (
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              {/* Search */}
              <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100 bg-gray-50">
                <Search className="w-4 h-4 text-gray-400 shrink-0" />
                <input
                  value={skillSearch}
                  onChange={(e) => setSkillSearch(e.target.value)}
                  placeholder="ابحث عن مهارة..."
                  className="flex-1 text-sm bg-transparent focus:outline-none text-gray-700 placeholder-gray-400"
                />
                <button
                  onClick={fetchSkills}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Skills list */}
              <div className="max-h-48 overflow-y-auto divide-y divide-gray-100">
                {filteredSkills.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-4">
                    لا توجد مهارات
                  </p>
                ) : (
                  filteredSkills.map((skill) => (
                    <button
                      key={skill.id}
                      onClick={() => setSelectedSkillId(String(skill.id))}
                      className={`w-full flex items-center justify-between px-4 py-3 text-right transition-colors ${
                        selectedSkillId === String(skill.id)
                          ? "bg-emerald-50 border-r-2 border-emerald-500"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-2 h-2 rounded-full shrink-0 ${
                            selectedSkillId === String(skill.id)
                              ? "bg-emerald-500"
                              : "bg-gray-300"
                          }`}
                        />
                        <div className="min-w-0 text-right">
                          <p className="text-sm font-medium text-gray-800 truncate">
                            {skill.title}
                          </p>
                          <p className="text-xs text-gray-400">
                            {SKILL_TYPE_LABELS[skill.skill_type] ||
                              skill.skill_type}{" "}
                            · {skill.total_questions} سؤال حالياً
                          </p>
                        </div>
                      </div>
                      {selectedSkillId === String(skill.id) && (
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Selected skill summary */}
          {selectedSkill && (
            <div className="mt-2 flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <p className="text-xs text-emerald-700">
                <span className="font-semibold">{selectedSkill.title}</span>
                {" — "}
                {SKILL_TYPE_LABELS[selectedSkill.skill_type] ||
                  selectedSkill.skill_type}
                {" · "}عدد الأسئلة الحالية:{" "}
                <span className="font-bold">
                  {selectedSkill.total_questions}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* General path info if applicable */}
        {isGeneralPath && selectedSkill && (
          <div className="bg-violet-50 border border-violet-200 rounded-xl p-3.5 flex items-start gap-3">
            <LayoutGrid className="w-4 h-4 text-violet-600 shrink-0 mt-0.5" />
            <p className="text-xs text-violet-700 leading-relaxed">
              هذه مهارة من نوع <span className="font-bold">المسار الشامل</span>{" "}
              — ستتوزع الأسئلة الجديدة على الأنواع الستة تلقائياً.
            </p>
          </div>
        )}

        <SourcesPicker
          doneBooks={doneBooks}
          doneMedia={doneMedia}
          loadingSources={loadingSources}
          selectedBooks={selectedBooks}
          selectedMedia={selectedMedia}
          toggleBook={toggleBook}
          toggleMedia={toggleMedia}
          form={form}
          setForm={setForm}
          onRefreshSources={fetchSources}
          isGeneralPath={isGeneralPath}
        />

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <XCircle className="w-4 h-4 text-red-500 shrink-0" />
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {successMsg && (
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <p className="text-emerald-700 text-sm">{successMsg}</p>
          </div>
        )}

        <button
          onClick={handleAddQuestions}
          disabled={generating || !selectedSkillId}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 text-white py-3 rounded-xl font-semibold text-sm transition-all shadow-md hover:shadow-lg"
        >
          {generating ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <PlusCircle className="w-5 h-5" />
          )}
          {generating
            ? "جاري الإرسال للـ AI..."
            : `إضافة ${total} سؤال للمهارة`}
        </button>

        <JobsList
          jobs={jobs}
          onRefresh={onRefresh}
          label="سجل الجلسة — أسئلة مضافة"
        />
      </div>
    </Section>
  );
}

// ══════════════════════════════════════════════════════════════════
// MAIN PAGE
// ══════════════════════════════════════════════════════════════════
export default function IELTSAIGeneration() {
  const [books, setBooks] = useState([]);
  const [media, setMedia] = useState([]);
  const [generateJobs, setGenerateJobs] = useState([]);
  const [addJobs, setAddJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAll = async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const [bRes, mRes] = await Promise.all([
        api.get("/ielts/ai/extract-book/"),
        api.get("/ielts/ai/extract-media/"),
      ]);
      setBooks(bRes.data.books || []);
      setMedia(mRes.data.media || []);
    } catch {}
    setLoading(false);
    setRefreshing(false);
  };

  const fetchAllWithStatus = async () => {
    try {
      const [bRes, mRes] = await Promise.all([
        api.get("/ielts/ai/extract-book/"),
        api.get("/ielts/ai/extract-media/"),
      ]);
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
          to="/dashboard/ielts"
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
            ارفع كتباً أو ملفات صوتية/فيديو ثم ولّد أسئلة IELTS تلقائياً
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
              المعالجة → <span className="font-semibold">٣.</span> ولّد مهارة
              جديدة <span className="font-bold">أو</span> أضف أسئلة لمهارة
              موجودة → <span className="font-semibold">٤.</span> يتكفل الـ AI
              بالباقي ✨
            </p>
          </div>
        </div>
      </div>

      {/* Sections */}
      <BooksSection books={books} onRefresh={fetchAllWithStatus} />
      <MediaSection media={media} onRefresh={fetchAllWithStatus} />
      <GenerateSection
        jobs={generateJobs}
        onRefresh={() => {
          setGenerateJobs((prev) => prev);
          handleRefresh();
        }}
      />
      <AddQuestionsSection
        jobs={addJobs}
        onRefresh={() => {
          setAddJobs((prev) => prev);
          handleRefresh();
        }}
      />
    </div>
  );
}
