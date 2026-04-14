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
  Check,
} from "lucide-react";
import api from "../../api/axios";

// ─── helpers ───────────────────────────────────────────────────────────────
const fmt = (s) =>
  s === "PENDING"
    ? {
        label: "Pending",
        color: "text-yellow-600 bg-yellow-50 border-yellow-200",
      }
    : s === "PROCESSING"
    ? {
        label: "Processing",
        color: "text-blue-600 bg-blue-50 border-blue-200",
      }
    : s === "DONE"
    ? {
        label: "Completed",
        color: "text-green-600 bg-green-50 border-green-200",
      }
    : { label: "Failed", color: "text-red-600 bg-red-50 border-red-200" };

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
      check: "accent-indigo-600",
      hover: "hover:bg-indigo-50",
      selected: "bg-indigo-50",
    },
    cyan: {
      border: "border-cyan-400",
      bg: "bg-cyan-50",
      tag: "bg-cyan-100 text-cyan-700",
      check: "accent-cyan-600",
      hover: "hover:bg-cyan-50",
      selected: "bg-cyan-50",
    },
  };
  const c = colorMap[color];

  return (
    <div ref={ref} className="relative">
      {/* Selected tags */}
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

      {/* Trigger button */}
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
          {selected.length > 0
            ? `${selected.length} item(s) selected`
            : placeholder}
        </span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </button>

      {/* Dropdown list */}
      {open && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          <div className="max-h-52 overflow-y-auto divide-y divide-gray-100">
            {items.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">
                No items available
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
                    className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                      selected.includes(item.id)
                        ? `bg-${color}-600 border-${color}-600`
                        : "border-gray-300"
                    }`}
                    style={
                      selected.includes(item.id)
                        ? {
                            backgroundColor:
                              color === "indigo" ? "#4f46e5" : "#0891b2",
                            borderColor:
                              color === "indigo" ? "#4f46e5" : "#0891b2",
                          }
                        : {}
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
    if (!name.trim() || !file) return setError("Name and file are required");
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
      setError(e.response?.data?.error || "An error occurred");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Section icon={BookOpen} title="Upload Books (PDF)" color="text-indigo-600">
      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-5 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Book name"
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
          />
          <div
            className="border-2 border-dashed border-indigo-300 rounded-lg px-3 py-2 flex items-center gap-2 cursor-pointer bg-white hover:border-indigo-500 transition-colors"
            onClick={() => fileRef.current.click()}
          >
            <Upload className="w-4 h-4 text-indigo-500 shrink-0" />
            <span className="text-sm text-gray-500 truncate">
              {file ? file.name : "Choose a PDF file"}
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
          {uploading
            ? "Uploading and processing..."
            : "Upload Book & Extract Text"}
        </button>
      </div>

      {books.length === 0 ? (
        <p className="text-center text-gray-400 text-sm py-4">
          No books uploaded yet
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
                    <p className="text-xs text-gray-400">
                      {b.page_count} pages
                    </p>
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
    if (!name.trim() || !file) return setError("Name and file are required");
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
      setError(e.response?.data?.error || "An error occurred");
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
      title="Upload Video / Audio (Transcription)"
      color="text-cyan-600"
    >
      <div className="bg-cyan-50 border border-cyan-100 rounded-xl p-4 mb-5 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="File name"
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
            ? "Uploading and converting to text..."
            : "Upload File & Extract Text (Whisper)"}
        </button>
        <p className="text-xs text-cyan-600 text-center">
          Supports: mp4 · mov · avi · mp3 · wav · m4a · ogg · flac
        </p>
      </div>

      {media.length === 0 ? (
        <p className="text-center text-gray-400 text-sm py-4">
          No media files uploaded yet
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
                    {m.media_type === "VIDEO" ? "Video" : "Audio"}
                    {m.duration_seconds > 0 &&
                      ` · ${m.duration_seconds} seconds`}
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
function GenerateSection({ onRefresh, jobs }) {
  const pollingRef = useRef({});

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

  // Fetch ready books and media independently
  const fetchSources = async () => {
    setLoadingSources(true);
    try {
      const [bRes, mRes] = await Promise.all([
        api.get("/step/ai/extract-book/"),
        api.get("/step/ai/extract-media/"),
      ]);
      setDoneBooks(bRes.data.books || []);
      setDoneMedia(mRes.data.media || []);
    } catch {}
    setLoadingSources(false);
  };

  useEffect(() => {
    fetchSources();
  }, []);

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
    if (!form.skill_type) return setError("Please select a skill type");
    if (!form.skill_title.trim()) return setError("Title is required");
    if (selectedBooks.length === 0 && selectedMedia.length === 0)
      return setError("Please select at least one book or media file");
    if (form.no_easy + form.no_medium + form.no_hard === 0)
      return setError("Total number of questions must be greater than zero");
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
      setError(
        e.response?.data?.error || "An error occurred during generation"
      );
    } finally {
      setGenerating(false);
    }
  };

  const total = form.no_easy + form.no_medium + form.no_hard;

  return (
    <Section
      icon={Brain}
      title="Generate a New Skill with AI"
      color="text-violet-600"
    >
      <div className="space-y-5">
        {/* Skill type + title */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
              Skill Type <span className="text-red-500">*</span>
            </label>
            <select
              value={form.skill_type}
              onChange={(e) => setForm({ ...form, skill_type: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
            >
              <option value="">-- Select --</option>
              {SKILL_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
              Skill Title <span className="text-red-500">*</span>
            </label>
            <input
              value={form.skill_title}
              onChange={(e) =>
                setForm({ ...form, skill_title: e.target.value })
              }
              placeholder="e.g. Advanced Vocabulary"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
            Description (optional)
          </label>
          <input
            value={form.skill_description}
            onChange={(e) =>
              setForm({ ...form, skill_description: e.target.value })
            }
            placeholder="Brief description of the skill..."
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
          />
        </div>

        {/* Questions count */}
        <div>
          <label className="text-xs font-semibold text-gray-600 mb-2 block">
            Question Distribution{" "}
            <span className="text-violet-600 font-bold">(Total: {total})</span>
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              {
                key: "no_easy",
                label: "Easy",
                color: "border-green-300 focus:ring-green-400",
              },
              {
                key: "no_medium",
                label: "Medium",
                color: "border-yellow-300 focus:ring-yellow-400",
              },
              {
                key: "no_hard",
                label: "Hard",
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
              <BookOpen className="w-3.5 h-3.5" /> Source Books
            </label>
            {loadingSources ? (
              <div className="flex items-center gap-2 text-sm text-gray-400 border border-gray-200 rounded-xl px-4 py-3">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading...
              </div>
            ) : (
              <MultiSelectDropdown
                items={doneBooks}
                selected={selectedBooks}
                onToggle={toggleBook}
                placeholder="Select one or more books..."
                color="indigo"
                renderTag={(item) => (
                  <span className="flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    {item?.name}
                  </span>
                )}
                renderItem={(item, isSelected) => (
                  <>
                    <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span className="text-sm text-gray-700 flex-1 truncate">
                      {item.name}
                    </span>
                    <span className="text-xs text-gray-400 shrink-0">
                      {item.page_count} pg
                    </span>
                  </>
                )}
              />
            )}
          </div>

          {/* Media */}
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-2 block flex items-center gap-1">
              <Headphones className="w-3.5 h-3.5" /> Source Media Files
            </label>
            {loadingSources ? (
              <div className="flex items-center gap-2 text-sm text-gray-400 border border-gray-200 rounded-xl px-4 py-3">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading...
              </div>
            ) : (
              <MultiSelectDropdown
                items={doneMedia}
                selected={selectedMedia}
                onToggle={toggleMedia}
                placeholder="Select an audio or video file..."
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
                renderItem={(item, isSelected) => (
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
                      {item.media_type === "VIDEO" ? "Video" : "Audio"}
                    </span>
                  </>
                )}
              />
            )}
          </div>
        </div>

        {/* Refresh sources button */}
        <button
          type="button"
          onClick={fetchSources}
          disabled={loadingSources}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${loadingSources ? "animate-spin" : ""}`}
          />
          Refresh sources list
        </button>

        {/* Additional notes */}
        <div>
          <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
            Additional Notes for AI (optional)
          </label>
          <textarea
            value={form.additional_notes}
            onChange={(e) =>
              setForm({ ...form, additional_notes: e.target.value })
            }
            rows={2}
            placeholder="e.g. Focus on academic vocabulary, avoid questions about proper nouns..."
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
            ? "Sending to AI..."
            : `Generate Skill with ${total} Questions`}
        </button>

        {/* Jobs history */}
        {jobs.length > 0 && (
          <div className="mt-2">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
              Session History
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
                        ? `${j.questions_created} questions created`
                        : j.status === "FAILED"
                        ? j.error_message?.slice(0, 60)
                        : "Processing..."}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <StatusBadge status={j.status} />
                    {j.status === "DONE" && j.skill_id && (
                      <Link
                        to={`/dashboard/step/skills/${j.skill_id}`}
                        className="text-xs text-indigo-600 hover:underline font-medium"
                      >
                        View
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

  const fetchAllWithStatus = async () => {
    try {
      const [bRes, mRes] = await Promise.all([
        api.get("/step/ai/extract-book/"),
        api.get("/step/ai/extract-media/"),
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
          to="/dashboard/step"
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
        >
          <ArrowRight className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-violet-600" />
            AI Content Generation
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Upload books or audio/video files, then automatically generate STEP
            questions
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
          title="Refresh"
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
            <p className="text-sm font-bold text-violet-800 mb-1">
              How does it work?
            </p>
            <p className="text-xs text-violet-600 leading-relaxed">
              <span className="font-semibold">1.</span> Upload PDF or
              audio/video files → <span className="font-semibold">2.</span> Wait
              for processing to complete (text extraction) →{" "}
              <span className="font-semibold">3.</span> Select sources and set
              number of questions → <span className="font-semibold">4.</span>{" "}
              Click Generate and let the AI handle the rest ✨
            </p>
          </div>
        </div>
      </div>

      {/* Sections */}
      <BooksSection books={books} onRefresh={fetchAllWithStatus} />
      <MediaSection media={media} onRefresh={fetchAllWithStatus} />
      <GenerateSection
        jobs={jobs}
        onRefresh={() => {
          setJobs((prev) => prev);
          handleRefresh();
        }}
      />
    </div>
  );
}
