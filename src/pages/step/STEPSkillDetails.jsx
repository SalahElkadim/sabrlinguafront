// src/pages/step/STEPSkillDetails.jsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowRight,
  Plus,
  BookOpen,
  Volume2,
  PenTool,
  FileText,
  ChevronRight,
  ChevronDown,
  Eye,
  EyeOff,
  Headphones,
  Pencil,
  Trash2,
  Check,
  Loader2,
  GitBranch,
  Video,
} from "lucide-react";
import { stepSkillsAPI, stepQuestionsAPI } from "../../services/stepService";

// ============================================
// Config
// ============================================
const skillTypeConfig = {
  VOCABULARY: {
    label: "Vocabulary",
    icon: Volume2,
    color: "text-blue-600",
    bg: "bg-blue-50",
    addLabel: "Add Question",
  },
  GRAMMAR: {
    label: "Grammar",
    icon: PenTool,
    color: "text-purple-600",
    bg: "bg-purple-50",
    addLabel: "Add Question",
  },
  READING: {
    label: "Reading",
    icon: BookOpen,
    color: "text-orange-600",
    bg: "bg-orange-50",
    addLabel: "Add Reading Passage",
  },
  LISTENING: {
    label: "Listening",
    icon: Headphones,
    color: "text-cyan-600",
    bg: "bg-cyan-50",
    addLabel: "Add Audio Recording",
  },
  SPEAKING: {
    label: "Speaking",
    icon: Video,
    color: "text-rose-600",
    bg: "bg-rose-50",
    addLabel: "Add Video",
  },
  WRITING: {
    label: "Writing",
    icon: FileText,
    color: "text-green-600",
    bg: "bg-green-50",
    addLabel: "Add Question",
  },
  GENERAL_PATH: {
    label: "General Path",
    icon: GitBranch,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    addLabel: "",
  },
};

// Sections inside the General Path
const GENERAL_PATH_SECTIONS = [
  {
    type: "VOCABULARY",
    label: "Vocabulary",
    icon: Volume2,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    headerBg: "bg-blue-50",
    btnColor: "bg-blue-500 hover:bg-blue-600",
    addLabel: "Add Vocabulary Question",
    addRoute: (skillId) => `/dashboard/step/skills/${skillId}/add/vocabulary`,
  },
  {
    type: "GRAMMAR",
    label: "Grammar",
    icon: PenTool,
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-200",
    headerBg: "bg-purple-50",
    btnColor: "bg-purple-500 hover:bg-purple-600",
    addLabel: "Add Grammar Question",
    addRoute: (skillId) => `/dashboard/step/skills/${skillId}/add/grammar`,
  },
  {
    type: "READING",
    label: "Reading",
    icon: BookOpen,
    color: "text-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-200",
    headerBg: "bg-orange-50",
    btnColor: "bg-orange-500 hover:bg-orange-600",
    addLabel: "Add Reading Passage",
    addRoute: (skillId) =>
      `/dashboard/step/skills/${skillId}/add/reading/passage`,
  },
  {
    type: "LISTENING",
    label: "Listening",
    icon: Headphones,
    color: "text-cyan-600",
    bg: "bg-cyan-50",
    border: "border-cyan-200",
    headerBg: "bg-cyan-50",
    btnColor: "bg-cyan-500 hover:bg-cyan-600",
    addLabel: "Add Listening Recording",
    addRoute: (skillId) =>
      `/dashboard/step/skills/${skillId}/add/listening/audio`,
  },
  {
    type: "SPEAKING",
    label: "Speaking",
    icon: Video,
    color: "text-rose-600",
    bg: "bg-rose-50",
    border: "border-rose-200",
    headerBg: "bg-rose-50",
    btnColor: "bg-rose-500 hover:bg-rose-600",
    addLabel: "Add Speaking Video",
    addRoute: (skillId) =>
      `/dashboard/step/skills/${skillId}/add/speaking/video`,
  },
];

const addRouteMap = (skillId, skillType) =>
  ({
    VOCABULARY: `/dashboard/step/skills/${skillId}/add/vocabulary`,
    GRAMMAR: `/dashboard/step/skills/${skillId}/add/grammar`,
    READING: `/dashboard/step/skills/${skillId}/add/reading/passage`,
    LISTENING: `/dashboard/step/skills/${skillId}/add/listening/audio`,
    SPEAKING: `/dashboard/step/skills/${skillId}/add/speaking/video`,
    WRITING: `/dashboard/step/skills/${skillId}/add/writing`,
  }[skillType]);

const difficultyBadge = {
  EASY: { label: "Easy", color: "bg-green-100 text-green-700" },
  MEDIUM: { label: "Medium", color: "bg-yellow-100 text-yellow-700" },
  HARD: { label: "Hard", color: "bg-red-100 text-red-700" },
};

// ============================================
// Confirm Delete Modal
// ============================================
function ConfirmDeleteModal({ message, onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-red-100 p-2 rounded-xl">
            <Trash2 className="w-5 h-5 text-red-600" />
          </div>
          <h3 className="font-bold text-gray-900">Confirm Delete</h3>
        </div>
        <p className="text-gray-600 text-sm mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// MCQ Edit Form
// ============================================
function MCQEditForm({ q, onSave, onCancel, updateFn }) {
  const [form, setForm] = useState({
    question_text: q.question_text,
    choice_a: q.choice_a,
    choice_b: q.choice_b,
    choice_c: q.choice_c || "",
    choice_d: q.choice_d || "",
    correct_answer: q.correct_answer,
    explanation: q.explanation || "",
    points: q.points,
    difficulty: q.difficulty || "MEDIUM",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!form.question_text.trim())
      return setError("Question text is required");
    setSaving(true);
    try {
      const options = [
        form.choice_a,
        form.choice_b,
        form.choice_c,
        form.choice_d,
      ].filter(Boolean);
      const correctText = {
        A: form.choice_a,
        B: form.choice_b,
        C: form.choice_c,
        D: form.choice_d,
      }[form.correct_answer];
      await updateFn(q.id, {
        question_text: form.question_text,
        options,
        correct_answer: correctText,
        explanation: form.explanation,
        points: form.points,
        difficulty: form.difficulty,
      });
      onSave();
    } catch {
      setError("An error occurred while saving");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="border-2 border-blue-200 rounded-xl p-4 bg-blue-50/30 space-y-3">
      <div>
        <label className="text-xs font-medium text-gray-600 mb-1 block">
          Question Text
        </label>
        <textarea
          value={form.question_text}
          onChange={(e) => setForm({ ...form, question_text: e.target.value })}
          rows={2}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        {["A", "B", "C", "D"].map((letter) => (
          <div key={letter}>
            <label className="text-xs text-gray-500 mb-1 block">
              Option {letter}
            </label>
            <div className="flex gap-1">
              <input
                value={form[`choice_${letter.toLowerCase()}`]}
                onChange={(e) =>
                  setForm({
                    ...form,
                    [`choice_${letter.toLowerCase()}`]: e.target.value,
                  })
                }
                className="flex-1 border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <button
                type="button"
                onClick={() => setForm({ ...form, correct_answer: letter })}
                className={`px-2 py-1 rounded-lg text-xs font-bold ${
                  form.correct_answer === letter
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                ✓
              </button>
            </div>
          </div>
        ))}
      </div>
      <input
        value={form.explanation}
        onChange={(e) => setForm({ ...form, explanation: e.target.value })}
        placeholder="Explanation (optional)"
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
      />
      <select
        value={form.difficulty}
        onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        <option value="EASY">Easy</option>
        <option value="MEDIUM">Medium</option>
        <option value="HARD">Hard</option>
      </select>
      {error && <p className="text-red-500 text-xs">{error}</p>}
      <div className="flex gap-2 justify-end">
        <button
          onClick={onCancel}
          className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 text-xs"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs flex items-center gap-1"
        >
          {saving ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Check className="w-3 h-3" />
          )}
          Save
        </button>
      </div>
    </div>
  );
}

// ============================================
// MCQ Card
// ============================================
function MCQCard({ q, index, color, onDelete, onUpdate, updateFn }) {
  const [showAnswer, setShowAnswer] = useState(false);
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const choices = [
    { key: "A", val: q.choice_a },
    { key: "B", val: q.choice_b },
    { key: "C", val: q.choice_c },
    { key: "D", val: q.choice_d },
  ].filter((c) => c.val);
  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onDelete(q.id);
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  };
  if (editing)
    return (
      <MCQEditForm
        q={q}
        updateFn={updateFn}
        onCancel={() => setEditing(false)}
        onSave={() => {
          setEditing(false);
          onUpdate();
        }}
      />
    );
  return (
    <>
      {confirmDelete && (
        <ConfirmDeleteModal
          message="Are you sure you want to delete this question?"
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(false)}
          loading={deleting}
        />
      )}
      <div className="border border-gray-200 rounded-xl p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3">
            <span
              className={`text-xs font-bold px-2 py-1 rounded-full ${color} bg-opacity-10`}
            >
              {index + 1}
            </span>
            <p className="text-gray-800 text-sm font-medium">
              {q.question_text}
            </p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {q.difficulty && (
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  difficultyBadge[q.difficulty]?.color
                }`}
              >
                {difficultyBadge[q.difficulty]?.label}
              </span>
            )}
            <button
              onClick={() => setShowAnswer((v) => !v)}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              {showAnswer ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={() => setEditing(true)}
              className="text-gray-400 hover:text-blue-600 p-1"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => setConfirmDelete(true)}
              className="text-gray-400 hover:text-red-600 p-1"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {choices.map((c) => (
            <div
              key={c.key}
              className={`text-xs px-3 py-2 rounded-lg border ${
                showAnswer && q.correct_answer === c.key
                  ? "bg-green-50 border-green-400 text-green-700 font-semibold"
                  : "bg-gray-50 border-gray-200 text-gray-600"
              }`}
            >
              {c.key}. {c.val}
            </div>
          ))}
        </div>
        {showAnswer && q.explanation && (
          <p className="mt-3 text-xs text-blue-700 bg-blue-50 rounded-lg px-3 py-2">
            💡 {q.explanation}
          </p>
        )}
      </div>
    </>
  );
}

// ============================================
// Reading Passage Edit Form
// ============================================
function PassageEditForm({ passage, onSave, onCancel }) {
  const [form, setForm] = useState({
    title: passage.title,
    passage_text: passage.passage_text,
    source: passage.source || "",
    difficulty: passage.difficulty || "MEDIUM",
  });
  const [saving, setSaving] = useState(false);
  const handleSubmit = async () => {
    setSaving(true);
    try {
      await stepQuestionsAPI.updateReadingPassage(passage.id, form);
      onSave();
    } finally {
      setSaving(false);
    }
  };
  return (
    <div className="border-2 border-orange-200 rounded-xl p-4 bg-orange-50/30 space-y-3">
      <div>
        <label className="text-xs font-medium text-gray-600 mb-1 block">
          Title
        </label>
        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
        />
      </div>
      <div>
        <label className="text-xs font-medium text-gray-600 mb-1 block">
          Passage Text
        </label>
        <textarea
          value={form.passage_text}
          onChange={(e) => setForm({ ...form, passage_text: e.target.value })}
          rows={4}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
        />
      </div>
      <div>
        <label className="text-xs font-medium text-gray-600 mb-1 block">
          Source (optional)
        </label>
        <input
          value={form.source}
          onChange={(e) => setForm({ ...form, source: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
        />
      </div>
      <select
        value={form.difficulty}
        onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
      >
        <option value="EASY">Easy</option>
        <option value="MEDIUM">Medium</option>
        <option value="HARD">Hard</option>
      </select>
      <div className="flex gap-2 justify-end">
        <button
          onClick={onCancel}
          className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 text-xs"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="px-3 py-1.5 rounded-lg bg-orange-500 text-white text-xs flex items-center gap-1"
        >
          {saving ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Check className="w-3 h-3" />
          )}
          Save
        </button>
      </div>
    </div>
  );
}

// ============================================
// Reading Question Edit Form
// ============================================
function ReadingQuestionEditForm({ q, onSave, onCancel }) {
  const [form, setForm] = useState({
    question_text: q.question_text,
    choice_a: q.choice_a,
    choice_b: q.choice_b,
    choice_c: q.choice_c || "",
    choice_d: q.choice_d || "",
    correct_answer: q.correct_answer,
    explanation: q.explanation || "",
    difficulty: q.difficulty || "MEDIUM",
  });
  const [saving, setSaving] = useState(false);
  const handleSubmit = async () => {
    setSaving(true);
    try {
      const options = [
        form.choice_a,
        form.choice_b,
        form.choice_c,
        form.choice_d,
      ].filter(Boolean);
      const correctText = {
        A: form.choice_a,
        B: form.choice_b,
        C: form.choice_c,
        D: form.choice_d,
      }[form.correct_answer];
      await stepQuestionsAPI.updateReadingQuestion(q.id, {
        question_text: form.question_text,
        options,
        correct_answer: correctText,
        explanation: form.explanation,
        difficulty: form.difficulty,
      });
      onSave();
    } finally {
      setSaving(false);
    }
  };
  return (
    <div className="border border-orange-200 rounded-xl p-3 bg-orange-50/20 space-y-2 mt-2">
      <textarea
        value={form.question_text}
        onChange={(e) => setForm({ ...form, question_text: e.target.value })}
        rows={2}
        placeholder="Question text"
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-orange-300"
      />
      <div className="grid grid-cols-2 gap-2">
        {["A", "B", "C", "D"].map((letter) => (
          <div key={letter} className="flex gap-1">
            <input
              value={form[`choice_${letter.toLowerCase()}`]}
              onChange={(e) =>
                setForm({
                  ...form,
                  [`choice_${letter.toLowerCase()}`]: e.target.value,
                })
              }
              placeholder={`Option ${letter}`}
              className="flex-1 border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setForm({ ...form, correct_answer: letter })}
              className={`px-2 rounded-lg text-xs font-bold ${
                form.correct_answer === letter
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              ✓
            </button>
          </div>
        ))}
      </div>
      <input
        value={form.explanation}
        onChange={(e) => setForm({ ...form, explanation: e.target.value })}
        placeholder="Explanation (optional)"
        className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none"
      />
      <select
        value={form.difficulty}
        onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-orange-300"
      >
        <option value="EASY">Easy</option>
        <option value="MEDIUM">Medium</option>
        <option value="HARD">Hard</option>
      </select>
      <div className="flex gap-2 justify-end">
        <button
          onClick={onCancel}
          className="px-3 py-1 rounded-lg border text-xs text-gray-600"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="px-3 py-1 rounded-lg bg-orange-500 text-white text-xs flex items-center gap-1"
        >
          {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : "Save"}
        </button>
      </div>
    </div>
  );
}

// ============================================
// Reading Passage Card
// ============================================
function ReadingPassageCard({ passage, index, onUpdate }) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [confirmDeleteQuestion, setConfirmDeleteQuestion] = useState(null);
  const [deletingQuestion, setDeletingQuestion] = useState(false);
  const handleDeletePassage = async () => {
    setDeleting(true);
    try {
      await stepQuestionsAPI.deleteReadingPassage(passage.id);
      onUpdate();
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  };
  const handleDeleteQuestion = async () => {
    setDeletingQuestion(true);
    try {
      await stepQuestionsAPI.deleteReadingQuestion(confirmDeleteQuestion);
      onUpdate();
    } finally {
      setDeletingQuestion(false);
      setConfirmDeleteQuestion(null);
    }
  };
  if (editing)
    return (
      <PassageEditForm
        passage={passage}
        onCancel={() => setEditing(false)}
        onSave={() => {
          setEditing(false);
          onUpdate();
        }}
      />
    );
  return (
    <>
      {confirmDelete && (
        <ConfirmDeleteModal
          message="Are you sure you want to delete this passage and all its questions?"
          onConfirm={handleDeletePassage}
          onCancel={() => setConfirmDelete(false)}
          loading={deleting}
        />
      )}
      {confirmDeleteQuestion && (
        <ConfirmDeleteModal
          message="Are you sure you want to delete this question?"
          onConfirm={handleDeleteQuestion}
          onCancel={() => setConfirmDeleteQuestion(null)}
          loading={deletingQuestion}
        />
      )}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <div className="w-full flex items-center justify-between px-4 py-3 bg-orange-50">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="flex items-center gap-3 flex-1 text-left"
          >
            <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
              {index + 1}
            </span>
            <p className="font-medium text-gray-800 text-sm">{passage.title}</p>
          </button>
          <div className="flex items-center gap-1">
            {passage.difficulty && (
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium mr-1 ${
                  difficultyBadge[passage.difficulty]?.color
                }`}
              >
                {difficultyBadge[passage.difficulty]?.label}
              </span>
            )}
            <span className="text-xs text-orange-600 mr-2">
              {passage.questions?.length} questions
            </span>
            <button
              onClick={() => setEditing(true)}
              className="p-1 text-gray-400 hover:text-blue-600"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => setConfirmDelete(true)}
              className="p-1 text-gray-400 hover:text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setExpanded((v) => !v)}
              className="p-1 text-orange-500"
            >
              {expanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
        {expanded && (
          <div className="p-4 space-y-4">
            <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 leading-relaxed max-h-40 overflow-y-auto">
              {passage.passage_text}
            </div>
            {passage.questions?.map((q, qi) => (
              <div key={q.id}>
                {editingQuestion === q.id ? (
                  <ReadingQuestionEditForm
                    q={q}
                    onCancel={() => setEditingQuestion(null)}
                    onSave={() => {
                      setEditingQuestion(null);
                      onUpdate();
                    }}
                  />
                ) : (
                  <div className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-start gap-3">
                        <span className="text-xs font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded-full">
                          {qi + 1}
                        </span>
                        <p className="text-gray-800 text-sm font-medium">
                          {q.question_text}
                        </p>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button
                          onClick={() => setEditingQuestion(q.id)}
                          className="p-1 text-gray-400 hover:text-blue-600"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setConfirmDeleteQuestion(q.id)}
                          className="p-1 text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { key: "A", val: q.choice_a },
                        { key: "B", val: q.choice_b },
                        { key: "C", val: q.choice_c },
                        { key: "D", val: q.choice_d },
                      ]
                        .filter((c) => c.val)
                        .map((c) => (
                          <div
                            key={c.key}
                            className={`text-xs px-3 py-2 rounded-lg border ${
                              q.correct_answer === c.key
                                ? "bg-green-50 border-green-400 text-green-700 font-semibold"
                                : "bg-gray-50 border-gray-200 text-gray-600"
                            }`}
                          >
                            {c.key}. {c.val}
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

// ============================================
// Listening Audio Edit Form
// ============================================
function AudioEditForm({ audio, onSave, onCancel }) {
  const [form, setForm] = useState({
    title: audio.title,
    transcript: audio.transcript || "",
    duration: audio.duration || 0,
    difficulty: audio.difficulty || "MEDIUM",
  });
  const [audioFile, setAudioFile] = useState(null);
  const [audioPreview, setAudioPreview] = useState(audio.audio_file || "");
  const [saving, setSaving] = useState(false);

  const handleAudioChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAudioFile(file);
    setAudioPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("transcript", form.transcript);
      formData.append("duration", form.duration);
      formData.append("difficulty", form.difficulty);
      if (audioFile) formData.append("audio_file", audioFile);
      await stepQuestionsAPI.updateListeningAudio(audio.id, formData);
      onSave();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="border-2 border-cyan-200 rounded-xl p-4 bg-cyan-50/30 space-y-3">
      <div>
        <label className="text-xs font-medium text-gray-600 mb-1 block">
          Title
        </label>
        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300"
        />
      </div>
      <div>
        <label className="text-xs font-medium text-gray-600 mb-1 block">
          Audio File
        </label>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer w-full border-2 border-dashed border-cyan-300 rounded-lg px-3 py-3 bg-cyan-50 hover:bg-cyan-100 transition-colors">
            <Headphones className="w-4 h-4 text-cyan-500 shrink-0" />
            <span className="text-xs text-cyan-600 font-medium">
              {audioFile ? audioFile.name : "Click to upload audio file"}
            </span>
            <input
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={handleAudioChange}
            />
          </label>
          {audioPreview && (
            <audio controls className="w-full" src={audioPreview}>
              Your browser does not support audio playback
            </audio>
          )}
        </div>
      </div>
      <div>
        <label className="text-xs font-medium text-gray-600 mb-1 block">
          Transcript (optional)
        </label>
        <textarea
          value={form.transcript}
          onChange={(e) => setForm({ ...form, transcript: e.target.value })}
          rows={3}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300"
        />
      </div>
      <div>
        <label className="text-xs font-medium text-gray-600 mb-1 block">
          Duration (seconds)
        </label>
        <input
          type="number"
          value={form.duration}
          onChange={(e) => setForm({ ...form, duration: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300"
        />
      </div>
      <select
        value={form.difficulty}
        onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300"
      >
        <option value="EASY">Easy</option>
        <option value="MEDIUM">Medium</option>
        <option value="HARD">Hard</option>
      </select>
      <div className="flex gap-2 justify-end">
        <button
          onClick={onCancel}
          className="px-3 py-1.5 rounded-lg border text-xs text-gray-600"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="px-3 py-1.5 rounded-lg bg-cyan-500 text-white text-xs flex items-center gap-1"
        >
          {saving ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Check className="w-3 h-3" />
          )}
          Save
        </button>
      </div>
    </div>
  );
}

// ============================================
// Listening Question Edit Form
// ============================================
function ListeningQuestionEditForm({ q, onSave, onCancel }) {
  const [form, setForm] = useState({
    question_text: q.question_text,
    choice_a: q.choice_a,
    choice_b: q.choice_b,
    choice_c: q.choice_c || "",
    choice_d: q.choice_d || "",
    correct_answer: q.correct_answer,
    explanation: q.explanation || "",
    difficulty: q.difficulty || "MEDIUM",
  });
  const [saving, setSaving] = useState(false);
  const handleSubmit = async () => {
    setSaving(true);
    try {
      const options = [
        form.choice_a,
        form.choice_b,
        form.choice_c,
        form.choice_d,
      ].filter(Boolean);
      const correctText = {
        A: form.choice_a,
        B: form.choice_b,
        C: form.choice_c,
        D: form.choice_d,
      }[form.correct_answer];
      await stepQuestionsAPI.updateListeningQuestion(q.id, {
        question_text: form.question_text,
        options,
        correct_answer: correctText,
        explanation: form.explanation,
        difficulty: form.difficulty,
      });
      onSave();
    } finally {
      setSaving(false);
    }
  };
  return (
    <div className="border border-cyan-200 rounded-xl p-3 bg-cyan-50/20 space-y-2 mt-2">
      <textarea
        value={form.question_text}
        onChange={(e) => setForm({ ...form, question_text: e.target.value })}
        rows={2}
        placeholder="Question text"
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none"
      />
      <div className="grid grid-cols-2 gap-2">
        {["A", "B", "C", "D"].map((letter) => (
          <div key={letter} className="flex gap-1">
            <input
              value={form[`choice_${letter.toLowerCase()}`]}
              onChange={(e) =>
                setForm({
                  ...form,
                  [`choice_${letter.toLowerCase()}`]: e.target.value,
                })
              }
              placeholder={`Option ${letter}`}
              className="flex-1 border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setForm({ ...form, correct_answer: letter })}
              className={`px-2 rounded-lg text-xs font-bold ${
                form.correct_answer === letter
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              ✓
            </button>
          </div>
        ))}
      </div>
      <input
        value={form.explanation}
        onChange={(e) => setForm({ ...form, explanation: e.target.value })}
        placeholder="Explanation (optional)"
        className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none"
      />
      <select
        value={form.difficulty}
        onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-300"
      >
        <option value="EASY">Easy</option>
        <option value="MEDIUM">Medium</option>
        <option value="HARD">Hard</option>
      </select>
      <div className="flex gap-2 justify-end">
        <button
          onClick={onCancel}
          className="px-3 py-1 rounded-lg border text-xs text-gray-600"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="px-3 py-1 rounded-lg bg-cyan-500 text-white text-xs flex items-center gap-1"
        >
          {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : "Save"}
        </button>
      </div>
    </div>
  );
}

// ============================================
// Listening Audio Card
// ============================================
function ListeningAudioCard({ audio, index, skillId, onUpdate }) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [confirmDeleteQuestion, setConfirmDeleteQuestion] = useState(null);
  const [deletingQuestion, setDeletingQuestion] = useState(false);
  const handleDeleteAudio = async () => {
    setDeleting(true);
    try {
      await stepQuestionsAPI.deleteListeningAudio(audio.id);
      onUpdate();
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  };
  const handleDeleteQuestion = async () => {
    setDeletingQuestion(true);
    try {
      await stepQuestionsAPI.deleteListeningQuestion(confirmDeleteQuestion);
      onUpdate();
    } finally {
      setDeletingQuestion(false);
      setConfirmDeleteQuestion(null);
    }
  };
  if (editing)
    return (
      <AudioEditForm
        audio={audio}
        onCancel={() => setEditing(false)}
        onSave={() => {
          setEditing(false);
          onUpdate();
        }}
      />
    );
  return (
    <>
      {confirmDelete && (
        <ConfirmDeleteModal
          message="Are you sure you want to delete this audio recording and all its questions?"
          onConfirm={handleDeleteAudio}
          onCancel={() => setConfirmDelete(false)}
          loading={deleting}
        />
      )}
      {confirmDeleteQuestion && (
        <ConfirmDeleteModal
          message="Are you sure you want to delete this question?"
          onConfirm={handleDeleteQuestion}
          onCancel={() => setConfirmDeleteQuestion(null)}
          loading={deletingQuestion}
        />
      )}
      <div className="border border-cyan-200 rounded-xl overflow-hidden">
        <div className="w-full flex items-center justify-between px-4 py-3 bg-cyan-50">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="flex items-center gap-3 flex-1 text-left"
          >
            <span className="text-xs font-bold text-cyan-600 bg-cyan-100 px-2 py-1 rounded-full">
              {index + 1}
            </span>
            <Headphones className="w-4 h-4 text-cyan-500" />
            <p className="font-medium text-gray-800 text-sm">{audio.title}</p>
          </button>
          <div className="flex items-center gap-1">
            {audio.difficulty && (
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium mr-1 ${
                  difficultyBadge[audio.difficulty]?.color
                }`}
              >
                {difficultyBadge[audio.difficulty]?.label}
              </span>
            )}
            {audio.duration > 0 && (
              <span className="text-xs text-cyan-600 mr-1">
                {audio.duration}s
              </span>
            )}
            <span className="text-xs text-cyan-600 mr-2">
              {audio.questions?.length} questions
            </span>
            <button
              onClick={() => setEditing(true)}
              className="p-1 text-gray-400 hover:text-blue-600"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => setConfirmDelete(true)}
              className="p-1 text-gray-400 hover:text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setExpanded((v) => !v)}
              className="p-1 text-cyan-500"
            >
              {expanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
        {expanded && (
          <div className="p-4 space-y-4">
            {audio.audio_file && (
              <div className="bg-cyan-50 rounded-lg p-3">
                <p className="text-xs text-cyan-600 font-medium mb-2">
                  Audio Recording:
                </p>
                <audio controls className="w-full" src={audio.audio_file}>
                  Your browser does not support audio playback
                </audio>
              </div>
            )}
            {audio.transcript && (
              <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 leading-relaxed max-h-32 overflow-y-auto">
                <p className="text-xs font-medium text-gray-500 mb-1">
                  Transcript:
                </p>
                {audio.transcript}
              </div>
            )}
            <Link
              to={`/dashboard/step/skills/${skillId}/add/listening/audio/${audio.id}/questions`}
              className="flex items-center gap-2 text-cyan-600 hover:text-cyan-700 text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Add question to this recording
            </Link>
            {audio.questions?.map((q, qi) => (
              <div key={q.id}>
                {editingQuestion === q.id ? (
                  <ListeningQuestionEditForm
                    q={q}
                    onCancel={() => setEditingQuestion(null)}
                    onSave={() => {
                      setEditingQuestion(null);
                      onUpdate();
                    }}
                  />
                ) : (
                  <div className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-start gap-3">
                        <span className="text-xs font-bold text-cyan-600 bg-cyan-50 px-2 py-1 rounded-full">
                          {qi + 1}
                        </span>
                        <p className="text-gray-800 text-sm font-medium">
                          {q.question_text}
                        </p>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button
                          onClick={() => setEditingQuestion(q.id)}
                          className="p-1 text-gray-400 hover:text-blue-600"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setConfirmDeleteQuestion(q.id)}
                          className="p-1 text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { key: "A", val: q.choice_a },
                        { key: "B", val: q.choice_b },
                        { key: "C", val: q.choice_c },
                        { key: "D", val: q.choice_d },
                      ]
                        .filter((c) => c.val)
                        .map((c) => (
                          <div
                            key={c.key}
                            className={`text-xs px-3 py-2 rounded-lg border ${
                              q.correct_answer === c.key
                                ? "bg-green-50 border-green-400 text-green-700 font-semibold"
                                : "bg-gray-50 border-gray-200 text-gray-600"
                            }`}
                          >
                            {c.key}. {c.val}
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

// ============================================
// Speaking Video Edit Form
// ============================================
function VideoEditForm({ video, onSave, onCancel }) {
  const [form, setForm] = useState({
    title: video.title,
    description: video.description || "",
    duration: video.duration || 0,
    difficulty: video.difficulty || "MEDIUM",
  });
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(video.video_file || "");
  const [saving, setSaving] = useState(false);

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("duration", form.duration);
      formData.append("difficulty", form.difficulty);
      if (videoFile) formData.append("video_file", videoFile);
      await stepQuestionsAPI.updateSpeakingVideo(video.id, formData);
      onSave();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="border-2 border-rose-200 rounded-xl p-4 bg-rose-50/30 space-y-3">
      <div>
        <label className="text-xs font-medium text-gray-600 mb-1 block">
          Title
        </label>
        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
        />
      </div>
      <div>
        <label className="text-xs font-medium text-gray-600 mb-1 block">
          Video File
        </label>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer w-full border-2 border-dashed border-rose-300 rounded-lg px-3 py-3 bg-rose-50 hover:bg-rose-100 transition-colors">
            <Video className="w-4 h-4 text-rose-500 shrink-0" />
            <span className="text-xs text-rose-600 font-medium">
              {videoFile ? videoFile.name : "Click to upload video"}
            </span>
            <input
              type="file"
              accept="video/*"
              className="hidden"
              onChange={handleVideoChange}
            />
          </label>
          {videoPreview && (
            <video controls className="w-full rounded-lg" src={videoPreview}>
              Your browser does not support video playback
            </video>
          )}
        </div>
      </div>
      <div>
        <label className="text-xs font-medium text-gray-600 mb-1 block">
          Description (optional)
        </label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={3}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
        />
      </div>
      <div>
        <label className="text-xs font-medium text-gray-600 mb-1 block">
          Duration (seconds)
        </label>
        <input
          type="number"
          value={form.duration}
          onChange={(e) => setForm({ ...form, duration: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
        />
      </div>
      <select
        value={form.difficulty}
        onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
      >
        <option value="EASY">Easy</option>
        <option value="MEDIUM">Medium</option>
        <option value="HARD">Hard</option>
      </select>
      <div className="flex gap-2 justify-end">
        <button
          onClick={onCancel}
          className="px-3 py-1.5 rounded-lg border text-xs text-gray-600"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="px-3 py-1.5 rounded-lg bg-rose-500 text-white text-xs flex items-center gap-1"
        >
          {saving ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Check className="w-3 h-3" />
          )}
          Save
        </button>
      </div>
    </div>
  );
}

// ============================================
// Speaking Question Edit Form
// ============================================
function SpeakingQuestionEditForm({ q, onSave, onCancel }) {
  const [form, setForm] = useState({
    question_text: q.question_text,
    choice_a: q.choice_a,
    choice_b: q.choice_b,
    choice_c: q.choice_c || "",
    choice_d: q.choice_d || "",
    correct_answer: q.correct_answer,
    explanation: q.explanation || "",
  });
  const [saving, setSaving] = useState(false);
  const handleSubmit = async () => {
    setSaving(true);
    try {
      const options = [
        form.choice_a,
        form.choice_b,
        form.choice_c,
        form.choice_d,
      ].filter(Boolean);
      const correctText = {
        A: form.choice_a,
        B: form.choice_b,
        C: form.choice_c,
        D: form.choice_d,
      }[form.correct_answer];
      await stepQuestionsAPI.updateSpeakingQuestion(q.id, {
        question_text: form.question_text,
        options,
        correct_answer: correctText,
        explanation: form.explanation,
      });
      onSave();
    } finally {
      setSaving(false);
    }
  };
  return (
    <div className="border border-rose-200 rounded-xl p-3 bg-rose-50/20 space-y-2 mt-2">
      <textarea
        value={form.question_text}
        onChange={(e) => setForm({ ...form, question_text: e.target.value })}
        rows={2}
        placeholder="Question text"
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none"
      />
      <div className="grid grid-cols-2 gap-2">
        {["A", "B", "C", "D"].map((letter) => (
          <div key={letter} className="flex gap-1">
            <input
              value={form[`choice_${letter.toLowerCase()}`]}
              onChange={(e) =>
                setForm({
                  ...form,
                  [`choice_${letter.toLowerCase()}`]: e.target.value,
                })
              }
              placeholder={`Option ${letter}`}
              className="flex-1 border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setForm({ ...form, correct_answer: letter })}
              className={`px-2 rounded-lg text-xs font-bold ${
                form.correct_answer === letter
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              ✓
            </button>
          </div>
        ))}
      </div>
      <input
        value={form.explanation}
        onChange={(e) => setForm({ ...form, explanation: e.target.value })}
        placeholder="Explanation (optional)"
        className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none"
      />
      <div className="flex gap-2 justify-end">
        <button
          onClick={onCancel}
          className="px-3 py-1 rounded-lg border text-xs text-gray-600"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="px-3 py-1 rounded-lg bg-rose-500 text-white text-xs flex items-center gap-1"
        >
          {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : "Save"}
        </button>
      </div>
    </div>
  );
}

// ============================================
// Speaking Video Card
// ============================================
function SpeakingVideoCard({ video, index, skillId, onUpdate }) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [confirmDeleteQuestion, setConfirmDeleteQuestion] = useState(null);
  const [deletingQuestion, setDeletingQuestion] = useState(false);

  const handleDeleteVideo = async () => {
    setDeleting(true);
    try {
      await stepQuestionsAPI.deleteSpeakingVideo(video.id);
      onUpdate();
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  };
  const handleDeleteQuestion = async () => {
    setDeletingQuestion(true);
    try {
      await stepQuestionsAPI.deleteSpeakingQuestion(confirmDeleteQuestion);
      onUpdate();
    } finally {
      setDeletingQuestion(false);
      setConfirmDeleteQuestion(null);
    }
  };

  if (editing)
    return (
      <VideoEditForm
        video={video}
        onCancel={() => setEditing(false)}
        onSave={() => {
          setEditing(false);
          onUpdate();
        }}
      />
    );

  return (
    <>
      {confirmDelete && (
        <ConfirmDeleteModal
          message="Are you sure you want to delete this video and all its questions?"
          onConfirm={handleDeleteVideo}
          onCancel={() => setConfirmDelete(false)}
          loading={deleting}
        />
      )}
      {confirmDeleteQuestion && (
        <ConfirmDeleteModal
          message="Are you sure you want to delete this question?"
          onConfirm={handleDeleteQuestion}
          onCancel={() => setConfirmDeleteQuestion(null)}
          loading={deletingQuestion}
        />
      )}
      <div className="border border-rose-200 rounded-xl overflow-hidden">
        <div className="w-full flex items-center justify-between px-4 py-3 bg-rose-50">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="flex items-center gap-3 flex-1 text-left"
          >
            <span className="text-xs font-bold text-rose-600 bg-rose-100 px-2 py-1 rounded-full">
              {index + 1}
            </span>
            <Video className="w-4 h-4 text-rose-500" />
            <p className="font-medium text-gray-800 text-sm">{video.title}</p>
          </button>
          <div className="flex items-center gap-1">
            {video.difficulty && (
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium mr-1 ${
                  difficultyBadge[video.difficulty]?.color
                }`}
              >
                {difficultyBadge[video.difficulty]?.label}
              </span>
            )}
            {video.duration > 0 && (
              <span className="text-xs text-rose-600 mr-1">
                {video.duration}s
              </span>
            )}
            <span className="text-xs text-rose-600 mr-2">
              {video.questions?.length} questions
            </span>
            <button
              onClick={() => setEditing(true)}
              className="p-1 text-gray-400 hover:text-blue-600"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => setConfirmDelete(true)}
              className="p-1 text-gray-400 hover:text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setExpanded((v) => !v)}
              className="p-1 text-rose-500"
            >
              {expanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
        {expanded && (
          <div className="p-4 space-y-4">
            {video.video_file && (
              <div className="bg-rose-50 rounded-lg p-3">
                <p className="text-xs text-rose-600 font-medium mb-2">Video:</p>
                <video
                  controls
                  className="w-full rounded-lg"
                  src={video.video_file}
                >
                  Your browser does not support video playback
                </video>
              </div>
            )}
            {video.description && (
              <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 leading-relaxed">
                <p className="text-xs font-medium text-gray-500 mb-1">
                  Description:
                </p>
                {video.description}
              </div>
            )}
            <Link
              to={`/dashboard/step/skills/${skillId}/add/speaking/video/${video.id}/questions`}
              className="flex items-center gap-2 text-rose-600 hover:text-rose-700 text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Add question to this video
            </Link>
            {video.questions?.map((q, qi) => (
              <div key={q.id}>
                {editingQuestion === q.id ? (
                  <SpeakingQuestionEditForm
                    q={q}
                    onCancel={() => setEditingQuestion(null)}
                    onSave={() => {
                      setEditingQuestion(null);
                      onUpdate();
                    }}
                  />
                ) : (
                  <div className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-start gap-3">
                        <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-full">
                          {qi + 1}
                        </span>
                        <p className="text-gray-800 text-sm font-medium">
                          {q.question_text}
                        </p>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button
                          onClick={() => setEditingQuestion(q.id)}
                          className="p-1 text-gray-400 hover:text-blue-600"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setConfirmDeleteQuestion(q.id)}
                          className="p-1 text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { key: "A", val: q.choice_a },
                        { key: "B", val: q.choice_b },
                        { key: "C", val: q.choice_c },
                        { key: "D", val: q.choice_d },
                      ]
                        .filter((c) => c.val)
                        .map((c) => (
                          <div
                            key={c.key}
                            className={`text-xs px-3 py-2 rounded-lg border ${
                              q.correct_answer === c.key
                                ? "bg-green-50 border-green-400 text-green-700 font-semibold"
                                : "bg-gray-50 border-gray-200 text-gray-600"
                            }`}
                          >
                            {c.key}. {c.val}
                          </div>
                        ))}
                    </div>
                    {q.explanation && (
                      <p className="mt-2 text-xs text-rose-700 bg-rose-50 rounded-lg px-3 py-2">
                        💡 {q.explanation}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

// ============================================
// Writing Edit Form
// ============================================
function WritingEditForm({ q, onSave, onCancel }) {
  const [form, setForm] = useState({
    title: q.title,
    question_text: q.question_text,
    min_words: q.min_words,
    max_words: q.max_words,
    sample_answer: q.sample_answer || "",
    rubric: q.rubric || "",
    difficulty: q.difficulty || "MEDIUM",
  });
  const [saving, setSaving] = useState(false);
  const handleSubmit = async () => {
    setSaving(true);
    try {
      await stepQuestionsAPI.updateWriting(q.id, form);
      onSave();
    } finally {
      setSaving(false);
    }
  };
  return (
    <div className="border-2 border-green-200 rounded-xl p-4 bg-green-50/30 space-y-3">
      <div>
        <label className="text-xs font-medium text-gray-600 mb-1 block">
          Title
        </label>
        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
        />
      </div>
      <div>
        <label className="text-xs font-medium text-gray-600 mb-1 block">
          Question Text
        </label>
        <textarea
          value={form.question_text}
          onChange={(e) => setForm({ ...form, question_text: e.target.value })}
          rows={3}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">
            Minimum Words
          </label>
          <input
            type="number"
            value={form.min_words}
            onChange={(e) => setForm({ ...form, min_words: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">
            Maximum Words
          </label>
          <input
            type="number"
            value={form.max_words}
            onChange={(e) => setForm({ ...form, max_words: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
          />
        </div>
      </div>
      <div>
        <label className="text-xs font-medium text-gray-600 mb-1 block">
          Sample Answer
        </label>
        <textarea
          value={form.sample_answer}
          onChange={(e) => setForm({ ...form, sample_answer: e.target.value })}
          rows={3}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
        />
      </div>
      <div>
        <label className="text-xs font-medium text-gray-600 mb-1 block">
          Grading Rubric
        </label>
        <textarea
          value={form.rubric}
          onChange={(e) => setForm({ ...form, rubric: e.target.value })}
          rows={2}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
        />
      </div>
      <select
        value={form.difficulty}
        onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
      >
        <option value="EASY">Easy</option>
        <option value="MEDIUM">Medium</option>
        <option value="HARD">Hard</option>
      </select>
      <div className="flex gap-2 justify-end">
        <button
          onClick={onCancel}
          className="px-3 py-1.5 rounded-lg border text-xs text-gray-600"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="px-3 py-1.5 rounded-lg bg-green-600 text-white text-xs flex items-center gap-1"
        >
          {saving ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Check className="w-3 h-3" />
          )}
          Save
        </button>
      </div>
    </div>
  );
}

// ============================================
// Writing Card
// ============================================
function WritingCard({ q, index, onDelete, onUpdate }) {
  const [showSample, setShowSample] = useState(false);
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const handleDelete = async () => {
    setDeleting(true);
    try {
      await stepQuestionsAPI.deleteWriting(q.id);
      onDelete();
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  };
  if (editing)
    return (
      <WritingEditForm
        q={q}
        onCancel={() => setEditing(false)}
        onSave={() => {
          setEditing(false);
          onUpdate();
        }}
      />
    );
  return (
    <>
      {confirmDelete && (
        <ConfirmDeleteModal
          message="Are you sure you want to delete this question?"
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(false)}
          loading={deleting}
        />
      )}
      <div className="border border-gray-200 rounded-xl p-4">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-start gap-3">
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
              {index + 1}
            </span>
            <div>
              <p className="font-semibold text-gray-800 text-sm">{q.title}</p>
              <p className="text-gray-600 text-xs mt-1">{q.question_text}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {q.difficulty && (
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  difficultyBadge[q.difficulty]?.color
                }`}
              >
                {difficultyBadge[q.difficulty]?.label}
              </span>
            )}
            <button
              onClick={() => setShowSample((v) => !v)}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              {showSample ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={() => setEditing(true)}
              className="p-1 text-gray-400 hover:text-blue-600"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => setConfirmDelete(true)}
              className="p-1 text-gray-400 hover:text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="flex gap-3 text-xs text-gray-500 mt-2">
          <span>Min words: {q.min_words}</span>
          <span>Max words: {q.max_words}</span>
          <span>Points: {q.points}</span>
        </div>
        {showSample && q.sample_answer && (
          <div className="mt-3 bg-green-50 rounded-lg p-3 text-xs text-green-700">
            <strong>Sample Answer:</strong>
            <p className="mt-1 leading-relaxed">{q.sample_answer}</p>
          </div>
        )}
      </div>
    </>
  );
}

// ============================================
// General Path Section Component
// ============================================
function GeneralPathSection({ section, questions, skillId, onUpdate }) {
  const [expanded, setExpanded] = useState(true);
  const Icon = section.icon;
  const sectionQuestions = questions.filter((q) => q.type === section.type);

  return (
    <div className={`border ${section.border} rounded-xl overflow-hidden`}>
      <div
        className={`flex items-center justify-between px-4 py-3 ${section.headerBg}`}
      >
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-3 flex-1 text-left"
        >
          <div className={`p-1.5 rounded-lg ${section.bg}`}>
            <Icon className={`w-4 h-4 ${section.color}`} />
          </div>
          <span className={`font-semibold text-sm ${section.color}`}>
            {section.label}
          </span>
          <span className="text-xs text-gray-400 bg-white px-2 py-0.5 rounded-full border">
            {sectionQuestions.length} items
          </span>
        </button>
        <div className="flex items-center gap-2">
          <Link
            to={section.addRoute(skillId)}
            className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg text-white transition-colors ${section.btnColor}`}
          >
            <Plus className="w-3.5 h-3.5" />
            {section.addLabel}
          </Link>
          <button
            onClick={() => setExpanded((v) => !v)}
            className={`p-1 ${section.color}`}
          >
            {expanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="p-4 space-y-3 bg-white">
          {sectionQuestions.length === 0 ? (
            <div className="text-center py-8">
              <Icon
                className={`w-8 h-8 ${section.color} mx-auto mb-2 opacity-25`}
              />
              <p className="text-gray-400 text-sm">
                No {section.label} questions yet
              </p>
              <Link
                to={section.addRoute(skillId)}
                className={`inline-flex items-center gap-1.5 mt-3 text-xs font-medium ${section.color} hover:underline`}
              >
                <Plus className="w-3.5 h-3.5" />
                Start adding {section.label}
              </Link>
            </div>
          ) : (
            <>
              {section.type === "VOCABULARY" &&
                sectionQuestions.map((q, i) => (
                  <MCQCard
                    key={q.id}
                    q={q}
                    index={i}
                    color={section.color}
                    updateFn={stepQuestionsAPI.updateVocabulary}
                    onDelete={async (id) => {
                      await stepQuestionsAPI.deleteVocabulary(id);
                      onUpdate();
                    }}
                    onUpdate={onUpdate}
                  />
                ))}
              {section.type === "GRAMMAR" &&
                sectionQuestions.map((q, i) => (
                  <MCQCard
                    key={q.id}
                    q={q}
                    index={i}
                    color={section.color}
                    updateFn={stepQuestionsAPI.updateGrammar}
                    onDelete={async (id) => {
                      await stepQuestionsAPI.deleteGrammar(id);
                      onUpdate();
                    }}
                    onUpdate={onUpdate}
                  />
                ))}
              {section.type === "READING" &&
                sectionQuestions.map((p, i) => (
                  <ReadingPassageCard
                    key={p.id}
                    passage={p}
                    index={i}
                    onUpdate={onUpdate}
                  />
                ))}
              {section.type === "LISTENING" &&
                sectionQuestions.map((a, i) => (
                  <ListeningAudioCard
                    key={a.id}
                    audio={a}
                    index={i}
                    skillId={skillId}
                    onUpdate={onUpdate}
                  />
                ))}
              {section.type === "SPEAKING" &&
                sectionQuestions.map((v, i) => (
                  <SpeakingVideoCard
                    key={v.id}
                    video={v}
                    index={i}
                    skillId={skillId}
                    onUpdate={onUpdate}
                  />
                ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================
// Main Page
// ============================================
export default function STEPSkillDetails() {
  const { skillId } = useParams();
  const [skill, setSkill] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    fetchData();
  }, [skillId, page]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const isGeneral = skill?.skill_type === "GENERAL_PATH";
      const [skillData, questionsData] = await Promise.all([
        stepSkillsAPI.getById(skillId),
        stepQuestionsAPI.getSkillQuestions(skillId, page, isGeneral ? 500 : 20),
      ]);
      setSkill(skillData);
      setQuestions(questionsData.questions || []);
      setPagination(questionsData.pagination || {});
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (skill?.skill_type === "GENERAL_PATH") fetchData();
  }, [skill?.skill_type]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!skill) return null;

  const config = skillTypeConfig[skill.skill_type] || {};
  const Icon = config.icon || BookOpen;
  const addRoute = addRouteMap(skillId, skill.skill_type);
  const isGeneralPath = skill.skill_type === "GENERAL_PATH";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          to="/dashboard/step/skills"
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
        >
          <ArrowRight className="w-5 h-5" />
        </Link>
        <div className={`${config.bg} p-3 rounded-xl`}>
          <Icon className={`w-6 h-6 ${config.color}`} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{skill.title}</h1>
          <p className={`text-sm font-medium ${config.color}`}>
            {config.label}
          </p>
        </div>
      </div>

      {/* Stats + Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="card !py-3 !px-5 text-center">
          <p className={`text-2xl font-bold ${config.color}`}>
            {skill.total_questions}
          </p>
          <p className="text-xs text-gray-500">Total Questions</p>
        </div>
        <div className="flex gap-3">
          <Link
            to={`/dashboard/step/skills/${skillId}/edit`}
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm transition-colors"
          >
            Edit Skill
          </Link>
          {!isGeneralPath && addRoute && (
            <Link
              to={addRoute}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              {config.addLabel}
            </Link>
          )}
        </div>
      </div>

      {/* GENERAL PATH — Sections */}
      {isGeneralPath ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <GitBranch className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-gray-900">
              General Path Content
            </h2>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              Add questions directly in each section
            </span>
          </div>
          {GENERAL_PATH_SECTIONS.map((section) => (
            <GeneralPathSection
              key={section.type}
              section={section}
              questions={questions}
              skillId={skillId}
              onUpdate={fetchData}
            />
          ))}
        </div>
      ) : (
        /* Normal Skills */
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-gray-900">Questions</h2>
          {questions.length === 0 ? (
            <div className="card text-center py-12">
              <Icon
                className={`w-10 h-10 ${config.color} mx-auto mb-3 opacity-30`}
              />
              <p className="text-gray-500 text-sm">
                No questions yet. Start by adding questions.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {skill.skill_type === "VOCABULARY" &&
                questions.map((q, i) => (
                  <MCQCard
                    key={q.id}
                    q={q}
                    index={i}
                    color={config.color}
                    updateFn={stepQuestionsAPI.updateVocabulary}
                    onDelete={async (id) => {
                      await stepQuestionsAPI.deleteVocabulary(id);
                      fetchData();
                    }}
                    onUpdate={() => fetchData()}
                  />
                ))}
              {skill.skill_type === "GRAMMAR" &&
                questions.map((q, i) => (
                  <MCQCard
                    key={q.id}
                    q={q}
                    index={i}
                    color={config.color}
                    updateFn={stepQuestionsAPI.updateGrammar}
                    onDelete={async (id) => {
                      await stepQuestionsAPI.deleteGrammar(id);
                      fetchData();
                    }}
                    onUpdate={() => fetchData()}
                  />
                ))}
              {skill.skill_type === "READING" &&
                questions.map((p, i) => (
                  <ReadingPassageCard
                    key={p.id}
                    passage={p}
                    index={i}
                    onUpdate={fetchData}
                  />
                ))}
              {skill.skill_type === "LISTENING" &&
                questions.map((a, i) => (
                  <ListeningAudioCard
                    key={a.id}
                    audio={a}
                    index={i}
                    skillId={skillId}
                    onUpdate={fetchData}
                  />
                ))}
              {skill.skill_type === "SPEAKING" &&
                questions.map((v, i) => (
                  <SpeakingVideoCard
                    key={v.id}
                    video={v}
                    index={i}
                    skillId={skillId}
                    onUpdate={fetchData}
                  />
                ))}
              {skill.skill_type === "WRITING" &&
                questions.map((q, i) => (
                  <WritingCard
                    key={q.id}
                    q={q}
                    index={i}
                    onDelete={() => fetchData()}
                    onUpdate={() => fetchData()}
                  />
                ))}
            </div>
          )}
          {pagination.total_pages > 1 && (
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-40 text-sm"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {page} of {pagination.total_pages}
              </span>
              <button
                onClick={() =>
                  setPage((p) => Math.min(pagination.total_pages, p + 1))
                }
                disabled={page === pagination.total_pages}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-40 text-sm"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
