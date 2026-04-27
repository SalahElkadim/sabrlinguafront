// src/pages/general/GeneralAIGeneration.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  Upload,
  FileText,
  Headphones,
  ArrowRight,
  Loader2,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Clock,
  FolderOpen,
  PlusCircle,
  Layers,
} from "lucide-react";
import {
  generalAIAPI,
  generalCategoriesAPI,
  generalSkillsAPI,
} from "../../services/generalService";

const SKILL_TYPES = [
  {
    value: "VOCABULARY",
    label: "Vocabulary",
    color: "bg-blue-100 text-blue-700",
    border: "border-blue-400",
  },
  {
    value: "GRAMMAR",
    label: "Grammar",
    color: "bg-purple-100 text-purple-700",
    border: "border-purple-400",
  },
  {
    value: "READING",
    label: "Reading",
    color: "bg-amber-100 text-amber-700",
    border: "border-amber-400",
  },
  {
    value: "LISTENING",
    label: "Listening",
    color: "bg-cyan-100 text-cyan-700",
    border: "border-cyan-400",
  },
  {
    value: "SPEAKING",
    label: "Speaking",
    color: "bg-orange-100 text-orange-700",
    border: "border-orange-400",
  },
  {
    value: "WRITING",
    label: "Writing",
    color: "bg-pink-100 text-pink-700",
    border: "border-pink-400",
  },
  {
    value: "GENERAL_PATH",
    label: "General Path",
    color: "bg-violet-100 text-violet-700",
    border: "border-violet-400",
  },
];

const STATUS_COLORS = {
  PENDING: "bg-yellow-100 text-yellow-700",
  PROCESSING: "bg-blue-100 text-blue-700",
  DONE: "bg-emerald-100 text-emerald-700",
  FAILED: "bg-red-100 text-red-700",
};

// ─── Reusable: source picker (books + media checkboxes) ─────────────────────
function SourcePicker({
  books,
  media,
  selectedBooks,
  selectedMedia,
  onToggleBook,
  onToggleMedia,
  onGoBooks,
  onGoMedia,
}) {
  return (
    <div className="space-y-4">
      {/* Books */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <h3 className="font-bold text-gray-900 text-right mb-3 flex items-center justify-end gap-2">
          <span>Books ({books.length})</span>
          <FileText className="w-4 h-4 text-gray-400" />
        </h3>
        {books.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">
            No books available.{" "}
            <button
              type="button"
              onClick={onGoBooks}
              className="text-violet-600 underline"
            >
              Upload a book
            </button>
          </p>
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {books.map((b) => (
              <label
                key={b.id}
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedBooks.includes(b.id)
                    ? "border-violet-400 bg-violet-50"
                    : "border-gray-100 hover:border-gray-200"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedBooks.includes(b.id)}
                  onChange={() => onToggleBook(b.id)}
                  className="accent-violet-600"
                />
                <div className="text-right flex-1 mr-3">
                  <p className="text-sm font-medium text-gray-800">{b.name}</p>
                  <p className="text-xs text-gray-400">{b.page_count} pages</p>
                </div>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Media */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <h3 className="font-bold text-gray-900 text-right mb-3 flex items-center justify-end gap-2">
          <span>Media ({media.length})</span>
          <Headphones className="w-4 h-4 text-gray-400" />
        </h3>
        {media.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">
            No media available.{" "}
            <button
              type="button"
              onClick={onGoMedia}
              className="text-violet-600 underline"
            >
              Upload media
            </button>
          </p>
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {media.map((m) => (
              <label
                key={m.id}
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedMedia.includes(m.id)
                    ? "border-violet-400 bg-violet-50"
                    : "border-gray-100 hover:border-gray-200"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedMedia.includes(m.id)}
                  onChange={() => onToggleMedia(m.id)}
                  className="accent-violet-600"
                />
                <div className="text-right flex-1 mr-3">
                  <p className="text-sm font-medium text-gray-800">{m.name}</p>
                  <p className="text-xs text-gray-400">
                    {m.media_type} • {m.duration_seconds}s
                  </p>
                </div>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Reusable: question count inputs ────────────────────────────────────────
function QuestionCounts({ values, onChange }) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 text-right">
        Number of Questions
      </label>
      <div className="grid grid-cols-3 gap-3">
        {[
          { key: "no_easy", label: "Easy", color: "text-emerald-600" },
          { key: "no_medium", label: "Medium", color: "text-amber-600" },
          { key: "no_hard", label: "Hard", color: "text-red-600" },
        ].map(({ key, label, color }) => (
          <div key={key} className="text-center">
            <label className={`text-xs font-semibold ${color}`}>{label}</label>
            <input
              type="number"
              min={0}
              value={values[key]}
              onChange={(e) => onChange(key, parseInt(e.target.value) || 0)}
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-center"
            />
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-400 text-right">
        Total: {values.no_easy + values.no_medium + values.no_hard} Questions
      </p>
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────
export default function GeneralAIGeneration() {
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);
  const [media, setMedia] = useState([]);
  const [categories, setCategories] = useState([]);
  const [jobs, setJobs] = useState([]);

  const [uploadingBook, setUploadingBook] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [bookName, setBookName] = useState("");
  const [mediaName, setMediaName] = useState("");
  const bookFileRef = useRef(null);
  const mediaFileRef = useRef(null);

  // ── Generate new skill form ──
  const [genForm, setGenForm] = useState({
    category_id: "",
    skill_type: "VOCABULARY",
    skill_title: "",
    skill_description: "",
    book_ids: [],
    media_ids: [],
    no_easy: 5,
    no_medium: 5,
    no_hard: 5,
    additional_notes: "",
  });
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState("");
  const [genSuccess, setGenSuccess] = useState("");

  // ── Add questions to existing skill form ──
  const [addForm, setAddForm] = useState({
    skill_id: "",
    book_ids: [],
    media_ids: [],
    no_easy: 5,
    no_medium: 5,
    no_hard: 5,
    additional_notes: "",
  });
  const [addSkillSearch, setAddSkillSearch] = useState("");
  const [addSkillOptions, setAddSkillOptions] = useState([]);
  const [addSkillLoading, setAddSkillLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState("");
  const [addSuccess, setAddSuccess] = useState("");
  const [selectedSkillInfo, setSelectedSkillInfo] = useState(null);

  const pollingRef = useRef(null);
  const [activeTab, setActiveTab] = useState("generate");

  useEffect(() => {
    fetchAll();
    return () => clearInterval(pollingRef.current);
  }, []);

  const fetchAll = async () => {
    try {
      const [booksData, mediaData, catsData, jobsData] = await Promise.all([
        generalAIAPI.listExtractedBooks(),
        generalAIAPI.listExtractedMedia(),
        generalCategoriesAPI.getAll(),
        generalAIAPI.listJobs(),
      ]);
      setBooks(booksData.books || []);
      setMedia(mediaData.media || []);
      setCategories(catsData.categories || []);
      setJobs(jobsData.jobs || []);
    } catch (err) {
      console.error(err);
    }
  };

  const startPolling = () => {
    clearInterval(pollingRef.current);
    pollingRef.current = setInterval(async () => {
      const jobsData = await generalAIAPI.listJobs();
      const newJobs = jobsData.jobs || [];
      setJobs(newJobs);
      const hasActive = newJobs.some(
        (j) => j.status === "PENDING" || j.status === "PROCESSING"
      );
      if (!hasActive) clearInterval(pollingRef.current);
    }, 4000);
  };

  const handleUploadBook = async () => {
    const file = bookFileRef.current?.files[0];
    if (!bookName.trim() || !file) return;
    const fd = new FormData();
    fd.append("name", bookName);
    fd.append("pdf_file", file);
    try {
      setUploadingBook(true);
      await generalAIAPI.extractBook(fd);
      setBookName("");
      bookFileRef.current.value = "";
      await fetchAll();
    } catch (err) {
      console.error(err);
    } finally {
      setUploadingBook(false);
    }
  };

  const handleUploadMedia = async () => {
    const file = mediaFileRef.current?.files[0];
    if (!mediaName.trim() || !file) return;
    const fd = new FormData();
    fd.append("name", mediaName);
    fd.append("media_file", file);
    try {
      setUploadingMedia(true);
      await generalAIAPI.extractMedia(fd);
      setMediaName("");
      mediaFileRef.current.value = "";
      await fetchAll();
    } catch (err) {
      console.error(err);
    } finally {
      setUploadingMedia(false);
    }
  };

  // ── Generate new skill ──────────────────────────────────────────────────
  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!genForm.category_id) {
      setGenError("Please select a category");
      return;
    }
    if (!genForm.skill_title.trim()) {
      setGenError("Skill title is required");
      return;
    }
    if (genForm.book_ids.length === 0 && genForm.media_ids.length === 0) {
      setGenError("Please select at least one book or media file");
      return;
    }
    if (genForm.no_easy + genForm.no_medium + genForm.no_hard === 0) {
      setGenError("Please specify the number of questions");
      return;
    }
    try {
      setGenerating(true);
      setGenError("");
      setGenSuccess("");
      await generalAIAPI.generateSkill({
        ...genForm,
        category_id: parseInt(genForm.category_id),
        no_easy: parseInt(genForm.no_easy),
        no_medium: parseInt(genForm.no_medium),
        no_hard: parseInt(genForm.no_hard),
      });
      setGenSuccess(
        "Skill and questions generation has started! Check the Jobs tab for progress."
      );
      setGenForm((prev) => ({
        ...prev,
        skill_title: "",
        skill_description: "",
        book_ids: [],
        media_ids: [],
        additional_notes: "",
        no_easy: 5,
        no_medium: 5,
        no_hard: 5,
      }));
      await fetchAll();
      startPolling();
      setActiveTab("jobs");
    } catch (err) {
      setGenError(err.response?.data?.error || "An error occurred");
    } finally {
      setGenerating(false);
    }
  };

  // ── Search skills for "Add Questions" tab ──────────────────────────────
  const handleSkillSearch = async (categoryId) => {
    if (!categoryId) {
      setAddSkillOptions([]);
      setAddForm((f) => ({ ...f, skill_id: "" }));
      setSelectedSkillInfo(null);
      return;
    }
    try {
      setAddSkillLoading(true);
      const data = await generalSkillsAPI.getByCategory(categoryId);
      setAddSkillOptions(data.skills || []);
    } catch (err) {
      console.error(err);
    } finally {
      setAddSkillLoading(false);
    }
  };

  const handleSelectSkill = (skill) => {
    setAddForm((f) => ({ ...f, skill_id: skill.id }));
    setSelectedSkillInfo(skill);
  };

  // ── Add questions to existing skill ────────────────────────────────────
  const handleAddQuestions = async (e) => {
    e.preventDefault();
    if (!addForm.skill_id) {
      setAddError("Please select a skill");
      return;
    }
    if (addForm.book_ids.length === 0 && addForm.media_ids.length === 0) {
      setAddError("Please select at least one book or media file");
      return;
    }
    if (addForm.no_easy + addForm.no_medium + addForm.no_hard === 0) {
      setAddError("Please specify the number of questions");
      return;
    }
    try {
      setAdding(true);
      setAddError("");
      setAddSuccess("");
      await generalAIAPI.addQuestionsToSkill({
        skill_id: parseInt(addForm.skill_id),
        book_ids: addForm.book_ids,
        media_ids: addForm.media_ids,
        no_easy: parseInt(addForm.no_easy),
        no_medium: parseInt(addForm.no_medium),
        no_hard: parseInt(addForm.no_hard),
        additional_notes: addForm.additional_notes,
      });
      setAddSuccess(
        `Questions are being generated for "${selectedSkillInfo?.title}". Check the Jobs tab for progress.`
      );
      setAddForm((f) => ({
        ...f,
        book_ids: [],
        media_ids: [],
        additional_notes: "",
        no_easy: 5,
        no_medium: 5,
        no_hard: 5,
      }));
      await fetchAll();
      startPolling();
      setActiveTab("jobs");
    } catch (err) {
      setAddError(err.response?.data?.error || "An error occurred");
    } finally {
      setAdding(false);
    }
  };

  const readyBooks = books.filter((b) => b.status === "DONE");
  const readyMedia = media.filter((m) => m.status === "DONE");

  // ── Skill type badge helper ─────────────────────────────────────────────
  const getSkillTypeMeta = (val) =>
    SKILL_TYPES.find((t) => t.value === val) || {
      color: "bg-gray-100 text-gray-600",
      label: val,
    };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/dashboard/general")}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowRight className="w-5 h-5 text-gray-600" />
        </button>
        <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-violet-700" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">AI Generation</h1>
          <p className="text-sm text-gray-500">
            Upload content and generate questions automatically
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 overflow-x-auto">
        {[
          { id: "generate", label: "New Skill", icon: Sparkles },
          { id: "add", label: "Add to Skill", icon: PlusCircle },
          { id: "books", label: `Books (${books.length})`, icon: FileText },
          { id: "media", label: `Media (${media.length})`, icon: Headphones },
          { id: "jobs", label: `Jobs (${jobs.length})`, icon: RefreshCw },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-violet-600 text-violet-700"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ═══════════════════════════════════════
          TAB: GENERATE NEW SKILL
      ═══════════════════════════════════════ */}
      {activeTab === "generate" && (
        <form onSubmit={handleGenerate} className="space-y-6">
          {genError && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm flex items-center gap-2">
              <XCircle className="w-4 h-4 flex-shrink-0" /> {genError}
            </div>
          )}
          {genSuccess && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-3 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> {genSuccess}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Skill Info */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
              <h3 className="font-bold text-gray-900 text-right">
                Skill Details
              </h3>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700 text-right">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={genForm.category_id}
                  onChange={(e) =>
                    setGenForm({ ...genForm, category_id: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-right bg-white"
                >
                  <option value="">Select a category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Skill Type — now includes GENERAL_PATH */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700 text-right">
                  Skill Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {SKILL_TYPES.map((t) => (
                    <button
                      type="button"
                      key={t.value}
                      onClick={() =>
                        setGenForm({ ...genForm, skill_type: t.value })
                      }
                      className={`py-2 rounded-xl text-xs font-semibold border-2 transition-all ${
                        genForm.skill_type === t.value
                          ? `border-violet-500 ${t.color}`
                          : "border-transparent bg-gray-50 text-gray-600"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
                {/* GENERAL_PATH hint */}
                {genForm.skill_type === "GENERAL_PATH" && (
                  <div className="flex items-start gap-2 bg-violet-50 border border-violet-200 rounded-xl px-3 py-2 mt-1">
                    <Layers className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-violet-700">
                      General Path generates all question types together
                      (Vocabulary, Grammar, Reading, Listening, Speaking &
                      Writing) distributed across the requested question count.
                    </p>
                  </div>
                )}
              </div>

              {/* Title */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700 text-right">
                  Skill Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={genForm.skill_title}
                  onChange={(e) =>
                    setGenForm({ ...genForm, skill_title: e.target.value })
                  }
                  placeholder="e.g. Advanced Business Vocabulary"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-right"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700 text-right">
                  Description (optional)
                </label>
                <textarea
                  value={genForm.skill_description}
                  onChange={(e) =>
                    setGenForm({
                      ...genForm,
                      skill_description: e.target.value,
                    })
                  }
                  rows={2}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-right resize-none"
                />
              </div>

              {/* Question counts */}
              <QuestionCounts
                values={genForm}
                onChange={(key, val) =>
                  setGenForm((f) => ({ ...f, [key]: val }))
                }
              />

              {/* Additional notes */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700 text-right">
                  Additional Notes for AI
                </label>
                <textarea
                  value={genForm.additional_notes}
                  onChange={(e) =>
                    setGenForm({ ...genForm, additional_notes: e.target.value })
                  }
                  rows={2}
                  placeholder="e.g. Focus on vocabulary related to business..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-right resize-none"
                />
              </div>
            </div>

            {/* Right: Sources */}
            <SourcePicker
              books={readyBooks}
              media={readyMedia}
              selectedBooks={genForm.book_ids}
              selectedMedia={genForm.media_ids}
              onToggleBook={(id) =>
                setGenForm((f) => ({
                  ...f,
                  book_ids: f.book_ids.includes(id)
                    ? f.book_ids.filter((b) => b !== id)
                    : [...f.book_ids, id],
                }))
              }
              onToggleMedia={(id) =>
                setGenForm((f) => ({
                  ...f,
                  media_ids: f.media_ids.includes(id)
                    ? f.media_ids.filter((m) => m !== id)
                    : [...f.media_ids, id],
                }))
              }
              onGoBooks={() => setActiveTab("books")}
              onGoMedia={() => setActiveTab("media")}
            />
          </div>

          <button
            type="submit"
            disabled={generating}
            className="w-full py-3.5 bg-violet-600 text-white rounded-2xl hover:bg-violet-700 font-bold text-base flex items-center justify-center gap-3 disabled:opacity-60 transition-colors"
          >
            {generating ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Sparkles className="w-5 h-5" />
            )}
            {generating
              ? "Generating..."
              : "Generate Skill & Questions with AI"}
          </button>
        </form>
      )}

      {/* ═══════════════════════════════════════
          TAB: ADD QUESTIONS TO EXISTING SKILL
      ═══════════════════════════════════════ */}
      {activeTab === "add" && (
        <form onSubmit={handleAddQuestions} className="space-y-6">
          {addError && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm flex items-center gap-2">
              <XCircle className="w-4 h-4 flex-shrink-0" /> {addError}
            </div>
          )}
          {addSuccess && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-3 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> {addSuccess}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Skill Selection */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
              <h3 className="font-bold text-gray-900 text-right">
                Select Existing Skill
              </h3>

              {/* Step 1: pick category to load its skills */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700 text-right">
                  1. Select Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={addSkillSearch}
                  onChange={(e) => {
                    setAddSkillSearch(e.target.value);
                    handleSkillSearch(e.target.value);
                    setAddForm((f) => ({ ...f, skill_id: "" }));
                    setSelectedSkillInfo(null);
                  }}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-right bg-white"
                >
                  <option value="">Select a category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Step 2: pick skill from that category */}
              {addSkillSearch && (
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700 text-right">
                    2. Select Skill <span className="text-red-500">*</span>
                  </label>
                  {addSkillLoading ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="w-5 h-5 animate-spin text-violet-500" />
                    </div>
                  ) : addSkillOptions.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-3">
                      No skills found in this category.
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-52 overflow-y-auto">
                      {addSkillOptions.map((skill) => {
                        const meta = getSkillTypeMeta(skill.skill_type);
                        return (
                          <button
                            type="button"
                            key={skill.id}
                            onClick={() => handleSelectSkill(skill)}
                            className={`w-full flex items-center justify-between p-3 rounded-xl border-2 text-right transition-all ${
                              addForm.skill_id === skill.id
                                ? `${meta.border} bg-violet-50`
                                : "border-gray-100 hover:border-gray-300"
                            }`}
                          >
                            <span
                              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${meta.color}`}
                            >
                              {meta.label}
                            </span>
                            <div className="flex-1 text-right mx-3">
                              <p className="text-sm font-medium text-gray-800">
                                {skill.title}
                              </p>
                              <p className="text-xs text-gray-400">
                                {skill.total_questions} questions
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Selected skill info banner */}
              {selectedSkillInfo && (
                <div className="bg-violet-50 border border-violet-200 rounded-xl px-4 py-3 flex items-center justify-between">
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      getSkillTypeMeta(selectedSkillInfo.skill_type).color
                    }`}
                  >
                    {getSkillTypeMeta(selectedSkillInfo.skill_type).label}
                  </span>
                  <div className="text-right">
                    <p className="text-sm font-bold text-violet-800">
                      {selectedSkillInfo.title}
                    </p>
                    <p className="text-xs text-violet-500">
                      Currently has {selectedSkillInfo.total_questions}{" "}
                      questions
                    </p>
                  </div>
                </div>
              )}

              {/* Question counts */}
              <QuestionCounts
                values={addForm}
                onChange={(key, val) =>
                  setAddForm((f) => ({ ...f, [key]: val }))
                }
              />

              {/* Additional notes */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700 text-right">
                  Additional Notes for AI
                </label>
                <textarea
                  value={addForm.additional_notes}
                  onChange={(e) =>
                    setAddForm({ ...addForm, additional_notes: e.target.value })
                  }
                  rows={2}
                  placeholder="e.g. Focus on harder vocabulary..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-right resize-none"
                />
              </div>
            </div>

            {/* Right: Sources */}
            <SourcePicker
              books={readyBooks}
              media={readyMedia}
              selectedBooks={addForm.book_ids}
              selectedMedia={addForm.media_ids}
              onToggleBook={(id) =>
                setAddForm((f) => ({
                  ...f,
                  book_ids: f.book_ids.includes(id)
                    ? f.book_ids.filter((b) => b !== id)
                    : [...f.book_ids, id],
                }))
              }
              onToggleMedia={(id) =>
                setAddForm((f) => ({
                  ...f,
                  media_ids: f.media_ids.includes(id)
                    ? f.media_ids.filter((m) => m !== id)
                    : [...f.media_ids, id],
                }))
              }
              onGoBooks={() => setActiveTab("books")}
              onGoMedia={() => setActiveTab("media")}
            />
          </div>

          <button
            type="submit"
            disabled={adding || !addForm.skill_id}
            className="w-full py-3.5 bg-emerald-600 text-white rounded-2xl hover:bg-emerald-700 font-bold text-base flex items-center justify-center gap-3 disabled:opacity-60 transition-colors"
          >
            {adding ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <PlusCircle className="w-5 h-5" />
            )}
            {adding
              ? "Generating questions..."
              : "Add Questions to Existing Skill"}
          </button>
        </form>
      )}

      {/* ═══════════════════════════════════════
          TAB: BOOKS
      ═══════════════════════════════════════ */}
      {activeTab === "books" && (
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <h3 className="font-bold text-gray-900 text-right">
              Upload New PDF Book
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="text"
                value={bookName}
                onChange={(e) => setBookName(e.target.value)}
                placeholder="Book name"
                className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-right"
              />
              <input
                type="file"
                accept=".pdf"
                ref={bookFileRef}
                className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none text-sm text-gray-600"
              />
              <button
                onClick={handleUploadBook}
                disabled={uploadingBook || !bookName.trim()}
                className="py-2.5 bg-violet-600 text-white rounded-xl hover:bg-violet-700 font-medium flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {uploadingBook ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                Upload Book
              </button>
            </div>
          </div>
          <div className="space-y-3">
            {books.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No books uploaded yet</p>
              </div>
            ) : (
              books.map((b) => (
                <div
                  key={b.id}
                  className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between"
                >
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      STATUS_COLORS[b.status] || "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {b.status}
                  </span>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{b.name}</p>
                    <p className="text-xs text-gray-400">
                      {b.page_count} pages
                    </p>
                  </div>
                  <FileText className="w-8 h-8 text-gray-300" />
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════
          TAB: MEDIA
      ═══════════════════════════════════════ */}
      {activeTab === "media" && (
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <h3 className="font-bold text-gray-900 text-right">
              Upload New Media
            </h3>
            <p className="text-xs text-gray-400 text-right">
              Supported: mp4, mov, avi (video) • mp3, wav, m4a (audio)
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="text"
                value={mediaName}
                onChange={(e) => setMediaName(e.target.value)}
                placeholder="Media name"
                className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-right"
              />
              <input
                type="file"
                accept=".mp4,.mov,.avi,.mkv,.webm,.mp3,.wav,.m4a,.ogg,.flac"
                ref={mediaFileRef}
                className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none text-sm text-gray-600"
              />
              <button
                onClick={handleUploadMedia}
                disabled={uploadingMedia || !mediaName.trim()}
                className="py-2.5 bg-violet-600 text-white rounded-xl hover:bg-violet-700 font-medium flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {uploadingMedia ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                Upload Media
              </button>
            </div>
          </div>
          <div className="space-y-3">
            {media.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Headphones className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No media uploaded yet</p>
              </div>
            ) : (
              media.map((m) => (
                <div
                  key={m.id}
                  className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between"
                >
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      STATUS_COLORS[m.status] || "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {m.status}
                  </span>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{m.name}</p>
                    <p className="text-xs text-gray-400">
                      {m.media_type} • {m.duration_seconds}s
                    </p>
                  </div>
                  <Headphones className="w-8 h-8 text-gray-300" />
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════
          TAB: JOBS
      ═══════════════════════════════════════ */}
      {activeTab === "jobs" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <button
              onClick={fetchAll}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
            >
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
            <h3 className="font-bold text-gray-900 text-right">Jobs Log</h3>
          </div>
          {jobs.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Clock className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No jobs yet</p>
            </div>
          ) : (
            jobs.map((job) => {
              const meta = getSkillTypeMeta(job.skill_type);
              return (
                <div
                  key={job.job_id}
                  className="bg-white rounded-xl border border-gray-200 p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          STATUS_COLORS[job.status] ||
                          "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {job.status}
                        {job.status === "PROCESSING" && (
                          <Loader2 className="w-3 h-3 inline ml-1 animate-spin" />
                        )}
                      </span>
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${meta.color}`}
                      >
                        {meta.label}
                      </span>
                      {job.skill_id && (
                        <button
                          onClick={() =>
                            navigate(
                              `/dashboard/general/skills/${job.skill_id}`
                            )
                          }
                          className="text-xs text-emerald-600 hover:underline"
                        >
                          View Skill
                        </button>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        {job.skill_title}
                      </p>
                      <p className="text-xs text-gray-400">
                        {job.category_name} • {job.questions_created}/
                        {job.total_questions_requested} Questions
                      </p>
                      {job.error_message && (
                        <p className="text-xs text-red-500 mt-0.5">
                          {job.error_message}
                        </p>
                      )}
                    </div>
                    <FolderOpen className="w-8 h-8 text-gray-200 ml-3 flex-shrink-0" />
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
