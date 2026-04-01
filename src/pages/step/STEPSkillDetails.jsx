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
  X,
  Check,
  Loader2,
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
    addLabel: "إضافة سؤال",
  },
  GRAMMAR: {
    label: "Grammar",
    icon: PenTool,
    color: "text-purple-600",
    bg: "bg-purple-50",
    addLabel: "إضافة سؤال",
  },
  READING: {
    label: "Reading",
    icon: BookOpen,
    color: "text-orange-600",
    bg: "bg-orange-50",
    addLabel: "إضافة قطعة قراءة",
  },
  LISTENING: {
    label: "Listening",
    icon: Headphones,
    color: "text-cyan-600",
    bg: "bg-cyan-50",
    addLabel: "إضافة تسجيل صوتي",
  },
  WRITING: {
    label: "Writing",
    icon: FileText,
    color: "text-green-600",
    bg: "bg-green-50",
    addLabel: "إضافة سؤال",
  },
};

const addRouteMap = (skillId, skillType) =>
  ({
    VOCABULARY: `/dashboard/step/skills/${skillId}/add/vocabulary`,
    GRAMMAR: `/dashboard/step/skills/${skillId}/add/grammar`,
    READING: `/dashboard/step/skills/${skillId}/add/reading/passage`,
    LISTENING: `/dashboard/step/skills/${skillId}/add/listening/audio`,
    WRITING: `/dashboard/step/skills/${skillId}/add/writing`,
  }[skillType]);

// ============================================
// Difficulty Badge Helper
// ============================================
const difficultyBadge = {
  EASY: { label: "سهل", color: "bg-green-100 text-green-700" },
  MEDIUM: { label: "متوسط", color: "bg-yellow-100 text-yellow-700" },
  HARD: { label: "صعب", color: "bg-red-100 text-red-700" },
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
          <h3 className="font-bold text-gray-900">تأكيد الحذف</h3>
        </div>
        <p className="text-gray-600 text-sm mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm transition-colors"
          >
            إلغاء
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            حذف
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// MCQ Edit Form (Vocabulary / Grammar)
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
    if (!form.question_text.trim()) return setError("نص السؤال مطلوب");
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
    } catch (e) {
      setError("حدث خطأ أثناء الحفظ");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="border-2 border-blue-200 rounded-xl p-4 bg-blue-50/30 space-y-3">
      <div>
        <label className="text-xs font-medium text-gray-600 mb-1 block">
          نص السؤال
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
              الخيار {letter}{" "}
              <span className="text-gray-400">(اختر الصحيح)</span>
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
                className={`px-2 py-1 rounded-lg text-xs font-bold transition-colors ${
                  form.correct_answer === letter
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 text-gray-500 hover:bg-green-100"
                }`}
              >
                ✓
              </button>
            </div>
          </div>
        ))}
      </div>
      <div>
        <label className="text-xs font-medium text-gray-600 mb-1 block">
          التوضيح (اختياري)
        </label>
        <input
          value={form.explanation}
          onChange={(e) => setForm({ ...form, explanation: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
      </div>
      <div>
        <label className="text-xs font-medium text-gray-600 mb-1 block">
          مستوى الصعوبة
        </label>
        <select
          value={form.difficulty}
          onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          <option value="EASY">سهل</option>
          <option value="MEDIUM">متوسط</option>
          <option value="HARD">صعب</option>
        </select>
      </div>
      {error && <p className="text-red-500 text-xs">{error}</p>}
      <div className="flex gap-2 justify-end">
        <button
          onClick={onCancel}
          className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 text-xs hover:bg-gray-50"
        >
          إلغاء
        </button>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs hover:bg-blue-700 flex items-center gap-1"
        >
          {saving ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Check className="w-3 h-3" />
          )}
          حفظ
        </button>
      </div>
    </div>
  );
}

// ============================================
// MCQ Card (Vocabulary / Grammar)
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

  if (editing) {
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
  }

  return (
    <>
      {confirmDelete && (
        <ConfirmDeleteModal
          message="هل أنت متأكد من حذف هذا السؤال؟ لا يمكن التراجع عن هذا الإجراء."
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
              title="إظهار/إخفاء الإجابة"
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
              title="تعديل"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => setConfirmDelete(true)}
              className="text-gray-400 hover:text-red-600 p-1"
              title="حذف"
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
          العنوان
        </label>
        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
        />
      </div>
      <div>
        <label className="text-xs font-medium text-gray-600 mb-1 block">
          نص القطعة
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
          المصدر (اختياري)
        </label>
        <input
          value={form.source}
          onChange={(e) => setForm({ ...form, source: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
        />
      </div>
      <div>
        <label className="text-xs font-medium text-gray-600 mb-1 block">
          مستوى الصعوبة
        </label>
        <select
          value={form.difficulty}
          onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
        >
          <option value="EASY">سهل</option>
          <option value="MEDIUM">متوسط</option>
          <option value="HARD">صعب</option>
        </select>
      </div>
      <div className="flex gap-2 justify-end">
        <button
          onClick={onCancel}
          className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 text-xs hover:bg-gray-50"
        >
          إلغاء
        </button>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="px-3 py-1.5 rounded-lg bg-orange-500 text-white text-xs hover:bg-orange-600 flex items-center gap-1"
        >
          {saving ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Check className="w-3 h-3" />
          )}
          حفظ
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
        placeholder="نص السؤال"
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
              placeholder={`الخيار ${letter}`}
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
        placeholder="التوضيح (اختياري)"
        className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none"
      />
      <div>
        <label className="text-xs font-medium text-gray-600 mb-1 block">
          مستوى الصعوبة
        </label>
        <select
          value={form.difficulty}
          onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-orange-300"
        >
          <option value="EASY">سهل</option>
          <option value="MEDIUM">متوسط</option>
          <option value="HARD">صعب</option>
        </select>
      </div>
      <div className="flex gap-2 justify-end">
        <button
          onClick={onCancel}
          className="px-3 py-1 rounded-lg border text-xs text-gray-600"
        >
          إلغاء
        </button>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="px-3 py-1 rounded-lg bg-orange-500 text-white text-xs flex items-center gap-1"
        >
          {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : "حفظ"}
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

  if (editing) {
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
  }

  return (
    <>
      {confirmDelete && (
        <ConfirmDeleteModal
          message="هل أنت متأكد من حذف هذه القطعة وجميع أسئلتها؟"
          onConfirm={handleDeletePassage}
          onCancel={() => setConfirmDelete(false)}
          loading={deleting}
        />
      )}
      {confirmDeleteQuestion && (
        <ConfirmDeleteModal
          message="هل أنت متأكد من حذف هذا السؤال؟"
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
              {passage.questions?.length} أسئلة
            </span>
            <button
              onClick={() => setEditing(true)}
              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => setConfirmDelete(true)}
              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
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
                      <div className="flex gap-1 shrink-0 items-center">
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
    audio_file: audio.audio_file || "",
    transcript: audio.transcript || "",
    duration: audio.duration || 0,
    difficulty: audio.difficulty || "MEDIUM",
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await stepQuestionsAPI.updateListeningAudio(audio.id, form);
      onSave();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="border-2 border-cyan-200 rounded-xl p-4 bg-cyan-50/30 space-y-3">
      <div>
        <label className="text-xs font-medium text-gray-600 mb-1 block">
          العنوان
        </label>
        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300"
        />
      </div>
      <div>
        <label className="text-xs font-medium text-gray-600 mb-1 block">
          رابط الصوت
        </label>
        <input
          value={form.audio_file}
          onChange={(e) => setForm({ ...form, audio_file: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300"
        />
      </div>
      <div>
        <label className="text-xs font-medium text-gray-600 mb-1 block">
          النص (اختياري)
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
          المدة (ثانية)
        </label>
        <input
          type="number"
          value={form.duration}
          onChange={(e) => setForm({ ...form, duration: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300"
        />
      </div>
      <div>
        <label className="text-xs font-medium text-gray-600 mb-1 block">
          مستوى الصعوبة
        </label>
        <select
          value={form.difficulty}
          onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300"
        >
          <option value="EASY">سهل</option>
          <option value="MEDIUM">متوسط</option>
          <option value="HARD">صعب</option>
        </select>
      </div>
      <div className="flex gap-2 justify-end">
        <button
          onClick={onCancel}
          className="px-3 py-1.5 rounded-lg border text-xs text-gray-600"
        >
          إلغاء
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
          حفظ
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
        placeholder="نص السؤال"
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
              placeholder={`الخيار ${letter}`}
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
        placeholder="التوضيح (اختياري)"
        className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none"
      />
      <div>
        <label className="text-xs font-medium text-gray-600 mb-1 block">
          مستوى الصعوبة
        </label>
        <select
          value={form.difficulty}
          onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-300"
        >
          <option value="EASY">سهل</option>
          <option value="MEDIUM">متوسط</option>
          <option value="HARD">صعب</option>
        </select>
      </div>
      <div className="flex gap-2 justify-end">
        <button
          onClick={onCancel}
          className="px-3 py-1 rounded-lg border text-xs text-gray-600"
        >
          إلغاء
        </button>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="px-3 py-1 rounded-lg bg-cyan-500 text-white text-xs flex items-center gap-1"
        >
          {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : "حفظ"}
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

  if (editing) {
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
  }

  return (
    <>
      {confirmDelete && (
        <ConfirmDeleteModal
          message="هل أنت متأكد من حذف هذا التسجيل الصوتي وجميع أسئلته؟"
          onConfirm={handleDeleteAudio}
          onCancel={() => setConfirmDelete(false)}
          loading={deleting}
        />
      )}
      {confirmDeleteQuestion && (
        <ConfirmDeleteModal
          message="هل أنت متأكد من حذف هذا السؤال؟"
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
                {audio.duration} ث
              </span>
            )}
            <span className="text-xs text-cyan-600 mr-2">
              {audio.questions?.length} أسئلة
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
                  التسجيل الصوتي:
                </p>
                <audio controls className="w-full" src={audio.audio_file}>
                  المتصفح لا يدعم تشغيل الصوت
                </audio>
              </div>
            )}
            {audio.transcript && (
              <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 leading-relaxed max-h-32 overflow-y-auto">
                <p className="text-xs font-medium text-gray-500 mb-1">النص:</p>
                {audio.transcript}
              </div>
            )}
            <Link
              to={`/dashboard/step/skills/${skillId}/add/listening/audio/${audio.id}/questions`}
              className="flex items-center gap-2 text-cyan-600 hover:text-cyan-700 text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              إضافة سؤال لهذا التسجيل
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
                      <div className="flex gap-1 shrink-0 items-center">
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
          العنوان
        </label>
        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
        />
      </div>
      <div>
        <label className="text-xs font-medium text-gray-600 mb-1 block">
          نص السؤال
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
            الحد الأدنى للكلمات
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
            الحد الأقصى للكلمات
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
          الإجابة النموذجية
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
          معيار التقييم
        </label>
        <textarea
          value={form.rubric}
          onChange={(e) => setForm({ ...form, rubric: e.target.value })}
          rows={2}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
        />
      </div>
      <div>
        <label className="text-xs font-medium text-gray-600 mb-1 block">
          مستوى الصعوبة
        </label>
        <select
          value={form.difficulty}
          onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
        >
          <option value="EASY">سهل</option>
          <option value="MEDIUM">متوسط</option>
          <option value="HARD">صعب</option>
        </select>
      </div>
      <div className="flex gap-2 justify-end">
        <button
          onClick={onCancel}
          className="px-3 py-1.5 rounded-lg border text-xs text-gray-600"
        >
          إلغاء
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
          حفظ
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

  if (editing) {
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
  }

  return (
    <>
      {confirmDelete && (
        <ConfirmDeleteModal
          message="هل أنت متأكد من حذف هذا السؤال؟"
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
          <span>الحد الأدنى: {q.min_words} كلمة</span>
          <span>الحد الأقصى: {q.max_words} كلمة</span>
          <span>النقاط: {q.points}</span>
        </div>
        {showSample && q.sample_answer && (
          <div className="mt-3 bg-green-50 rounded-lg p-3 text-xs text-green-700">
            <strong>الإجابة النموذجية:</strong>
            <p className="mt-1 leading-relaxed">{q.sample_answer}</p>
          </div>
        )}
      </div>
    </>
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
      const [skillData, questionsData] = await Promise.all([
        stepSkillsAPI.getById(skillId),
        stepQuestionsAPI.getSkillQuestions(skillId, page),
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
          <p className="text-xs text-gray-500">إجمالي الأسئلة</p>
        </div>
        <div className="flex gap-3">
          <Link
            to={`/dashboard/step/skills/${skillId}/edit`}
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm transition-colors"
          >
            تعديل المهارة
          </Link>
          <Link
            to={addRoute}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            {config.addLabel}
          </Link>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-gray-900">الأسئلة</h2>

        {questions.length === 0 ? (
          <div className="card text-center py-12">
            <Icon
              className={`w-10 h-10 ${config.color} mx-auto mb-3 opacity-30`}
            />
            <p className="text-gray-500 text-sm">
              لا توجد أسئلة بعد. ابدأ بإضافة أسئلة.
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
      </div>

      {/* Pagination */}
      {pagination.total_pages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-40 text-sm"
          >
            السابق
          </button>
          <span className="text-sm text-gray-600">
            صفحة {page} من {pagination.total_pages}
          </span>
          <button
            onClick={() =>
              setPage((p) => Math.min(pagination.total_pages, p + 1))
            }
            disabled={page === pagination.total_pages}
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-40 text-sm"
          >
            التالي
          </button>
        </div>
      )}
    </div>
  );
}
