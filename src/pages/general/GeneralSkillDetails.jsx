// src/pages/general/GeneralSkillDetails.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Plus,
  BookOpen,
  Loader2,
  ArrowRight,
  Trash2,
  BookText,
  Headphones,
  Mic,
  PenLine,
  AlignLeft,
  Hash,
  Pencil,
  CheckCircle2,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  generalSkillsAPI,
  generalQuestionsAPI,
} from "../../services/generalService";

const SKILL_TYPE_LABELS = {
  VOCABULARY: "Vocabulary",
  GRAMMAR: "Grammar",
  READING: "Reading",
  LISTENING: "Listening",
  SPEAKING: "Speaking",
  WRITING: "Writing",
};

const SKILL_ICONS = {
  VOCABULARY: Hash,
  GRAMMAR: AlignLeft,
  READING: BookText,
  LISTENING: Headphones,
  SPEAKING: Mic,
  WRITING: PenLine,
};

const DIFFICULTY_COLORS = {
  EASY: "bg-emerald-100 text-emerald-700",
  MEDIUM: "bg-amber-100 text-amber-700",
  HARD: "bg-red-100 text-red-700",
};

// ─────────────────────────────────────────────
// MCQ Card — shared for Vocabulary, Grammar,
//            Reading questions, Listening questions, Speaking questions
// ─────────────────────────────────────────────
function MCQCard({ q, type, onDelete, onEdit }) {
  const [expanded, setExpanded] = useState(false);
  const choices = [
    { key: "A", value: q.choice_a },
    { key: "B", value: q.choice_b },
    { key: "C", value: q.choice_c },
    { key: "D", value: q.choice_d },
  ].filter((c) => c.value);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Question header */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Actions */}
          <div className="flex flex-col gap-1 flex-shrink-0">
            <button
              onClick={() => onEdit({ q, type })}
              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="تعديل"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete({ type, id: q.id })}
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="حذف"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Question text */}
          <div className="flex-1 text-right">
            <p className="font-medium text-gray-900 leading-relaxed">
              {q.question_text}
            </p>
            {q.question_image && (
              <img
                src={q.question_image}
                alt="question"
                className="mt-2 rounded-lg max-h-40 object-contain ml-auto"
              />
            )}
          </div>
        </div>

        {/* Choices */}
        <div className="grid grid-cols-2 gap-2 mt-3">
          {choices.map((c) => (
            <div
              key={c.key}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                q.correct_answer === c.key
                  ? "bg-emerald-50 border border-emerald-300"
                  : "bg-gray-50 border border-transparent"
              }`}
            >
              {q.correct_answer === c.key && (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              )}
              <span
                className={`font-semibold flex-shrink-0 ${
                  q.correct_answer === c.key
                    ? "text-emerald-700"
                    : "text-gray-400"
                }`}
              >
                {c.key}.
              </span>
              <span
                className={
                  q.correct_answer === c.key
                    ? "text-emerald-800 font-medium"
                    : "text-gray-600"
                }
              >
                {c.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer: difficulty + toggle explanation */}
      <div className="px-4 pb-3 flex items-center justify-between">
        <button
          onClick={() => setExpanded((p) => !p)}
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          {expanded ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
          {expanded ? "إخفاء الشرح" : "عرض الشرح"}
        </button>
        {q.difficulty && (
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              DIFFICULTY_COLORS[q.difficulty] || "bg-gray-100 text-gray-500"
            }`}
          >
            {q.difficulty}
          </span>
        )}
      </div>

      {/* Explanation */}
      {expanded && q.explanation && (
        <div className="px-4 pb-4 border-t border-gray-100 pt-3">
          <p className="text-sm text-gray-600 text-right leading-relaxed bg-amber-50 rounded-lg px-3 py-2 border-r-4 border-amber-400">
            {q.explanation}
          </p>
        </div>
      )}
      {expanded && !q.explanation && (
        <div className="px-4 pb-4 border-t border-gray-100 pt-3">
          <p className="text-xs text-gray-400 text-right italic">
            لا يوجد شرح لهذا السؤال
          </p>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Edit MCQ Modal
// ─────────────────────────────────────────────
function EditMCQModal({ editTarget, onClose, onSaved }) {
  const { q, type } = editTarget;

  const initialOptions = [
    q.choice_a,
    q.choice_b,
    q.choice_c,
    q.choice_d,
  ].filter(Boolean);

  const [form, setForm] = useState({
    question_text: q.question_text || "",
    explanation: q.explanation || "",
    difficulty: q.difficulty || "MEDIUM",
    options: initialOptions.length >= 2 ? initialOptions : ["", "", "", ""],
    correct_answer_index: ["A", "B", "C", "D"].indexOf(q.correct_answer),
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const updateOption = (i, val) => {
    setForm((f) => {
      const opts = [...f.options];
      opts[i] = val;
      return { ...f, options: opts };
    });
  };

  const handleSave = async () => {
    if (!form.question_text.trim()) {
      setError("نص السؤال مطلوب");
      return;
    }
    if (form.options.filter((o) => o.trim()).length < 2) {
      setError("أدخل خيارين على الأقل");
      return;
    }
    if (form.correct_answer_index < 0) {
      setError("اختر الإجابة الصحيحة");
      return;
    }
    setError("");
    setSaving(true);

    const payload = {
      question_text: form.question_text,
      explanation: form.explanation,
      difficulty: form.difficulty,
      options: form.options,
      correct_answer: form.options[form.correct_answer_index],
    };

    try {
      if (type === "VOCABULARY") {
        await generalQuestionsAPI.updateVocabulary(q.id, payload);
      } else if (type === "GRAMMAR") {
        await generalQuestionsAPI.updateGrammar(q.id, payload);
      } else if (type === "READING") {
        await generalQuestionsAPI.updateReadingQuestion(q.id, payload);
      } else if (type === "LISTENING") {
        await generalQuestionsAPI.updateListeningQuestion(q.id, payload);
      } else if (type === "SPEAKING") {
        await generalQuestionsAPI.updateSpeakingQuestion(q.id, payload);
      }
      onSaved();
    } catch (e) {
      setError("حدث خطأ أثناء الحفظ");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="font-bold text-gray-900 text-base">تعديل السؤال</h2>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">
          {/* Question text */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 text-right">
              نص السؤال
            </label>
            <textarea
              dir="auto"
              rows={3}
              value={form.question_text}
              onChange={(e) =>
                setForm((f) => ({ ...f, question_text: e.target.value }))
              }
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            />
          </div>

          {/* Options */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 text-right">
              الخيارات — اختر الإجابة الصحيحة
            </label>
            <div className="space-y-2">
              {form.options.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    dir="auto"
                    type="text"
                    value={opt}
                    onChange={(e) => updateOption(i, e.target.value)}
                    placeholder={`الخيار ${String.fromCharCode(65 + i)}`}
                    className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm text-right focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setForm((f) => ({ ...f, correct_answer_index: i }))
                    }
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      form.correct_answer_index === i
                        ? "bg-emerald-500 border-emerald-500 text-white"
                        : "border-gray-300 text-gray-300 hover:border-emerald-400"
                    }`}
                  >
                    {form.correct_answer_index === i ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <span className="text-xs font-bold">
                        {String.fromCharCode(65 + i)}
                      </span>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 text-right">
              الصعوبة
            </label>
            <div className="flex gap-2 justify-end">
              {["EASY", "MEDIUM", "HARD"].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, difficulty: d }))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    form.difficulty === d
                      ? DIFFICULTY_COLORS[d]
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Explanation */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 text-right">
              الشرح (اختياري)
            </label>
            <textarea
              dir="auto"
              rows={3}
              value={form.explanation}
              onChange={(e) =>
                setForm((f) => ({ ...f, explanation: e.target.value }))
              }
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              placeholder="اكتب الشرح هنا..."
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-right font-medium">
              {error}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-100 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 font-medium text-sm transition-colors"
          >
            إلغاء
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-60 transition-colors"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            حفظ التعديلات
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────
export default function GeneralSkillDetails() {
  const navigate = useNavigate();
  const { skillId } = useParams();

  const [skill, setSkill] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [editTarget, setEditTarget] = useState(null); // { q, type }

  useEffect(() => {
    fetchData();
  }, [skillId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [skillData, qData] = await Promise.all([
        generalSkillsAPI.getById(skillId),
        generalQuestionsAPI.getSkillQuestions(skillId),
      ]);
      setSkill(skillData);
      setQuestions(qData.questions || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getAddPath = () => {
    const type = skill?.skill_type;
    if (type === "VOCABULARY")
      return `/dashboard/general/skills/${skillId}/add/vocabulary`;
    if (type === "GRAMMAR")
      return `/dashboard/general/skills/${skillId}/add/grammar`;
    if (type === "READING")
      return `/dashboard/general/skills/${skillId}/add/reading/passage`;
    if (type === "LISTENING")
      return `/dashboard/general/skills/${skillId}/add/listening/audio`;
    if (type === "SPEAKING")
      return `/dashboard/general/skills/${skillId}/add/speaking/video`;
    if (type === "WRITING")
      return `/dashboard/general/skills/${skillId}/add/writing`;
    return "#";
  };

  const handleDeleteQuestion = async () => {
    if (!deleteModal) return;
    try {
      setDeleting(true);
      const { type, id, parentType } = deleteModal;
      if (type === "VOCABULARY") await generalQuestionsAPI.deleteVocabulary(id);
      else if (type === "GRAMMAR") await generalQuestionsAPI.deleteGrammar(id);
      else if (type === "READING" && parentType === "passage")
        await generalQuestionsAPI.deleteReadingPassage(id);
      else if (type === "READING")
        await generalQuestionsAPI.deleteReadingQuestion(id);
      else if (type === "LISTENING" && parentType === "audio")
        await generalQuestionsAPI.deleteListeningAudio(id);
      else if (type === "LISTENING")
        await generalQuestionsAPI.deleteListeningQuestion(id);
      else if (type === "SPEAKING" && parentType === "video")
        await generalQuestionsAPI.deleteSpeakingVideo(id);
      else if (type === "SPEAKING")
        await generalQuestionsAPI.deleteSpeakingQuestion(id);
      else if (type === "WRITING") await generalQuestionsAPI.deleteWriting(id);
      setDeleteModal(null);
      fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  const SkillIcon = SKILL_ICONS[skill?.skill_type] || BookOpen;

  // ── Render helpers ──────────────────────────
  const renderQuestions = () => {
    const type = skill?.skill_type;

    // ── Vocabulary & Grammar ──
    if (type === "VOCABULARY" || type === "GRAMMAR") {
      return questions.map((q) => (
        <MCQCard
          key={q.id}
          q={q}
          type={type}
          onDelete={setDeleteModal}
          onEdit={setEditTarget}
        />
      ));
    }

    // ── Reading ──
    if (type === "READING") {
      return questions.map((passage) => (
        <div
          key={passage.id}
          className="bg-white rounded-xl border border-gray-200 overflow-hidden"
        >
          {/* Passage header */}
          <div className="p-5 border-b border-gray-100">
            <div className="flex items-start justify-between mb-3">
              <button
                onClick={() =>
                  setDeleteModal({
                    type: "READING",
                    id: passage.id,
                    parentType: "passage",
                  })
                }
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="text-right">
                <h4 className="font-bold text-gray-900">{passage.title}</h4>
                {passage.difficulty && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      DIFFICULTY_COLORS[passage.difficulty] ||
                      "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {passage.difficulty}
                  </span>
                )}
              </div>
            </div>
            <p className="text-sm text-gray-600 text-right leading-relaxed border-r-4 border-amber-300 pr-3">
              {passage.passage_text}
            </p>
          </div>

          {/* Passage questions */}
          <div className="p-4 bg-gray-50">
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() =>
                  navigate(
                    `/dashboard/general/skills/${skillId}/add/reading/passage/${passage.id}/questions`
                  )
                }
                className="flex items-center gap-1.5 text-sm text-emerald-600 hover:text-emerald-700 font-semibold"
              >
                <Plus className="w-4 h-4" />
                إضافة سؤال
              </button>
              <span className="text-xs text-gray-400 font-medium">
                {passage.questions?.length || 0} سؤال
              </span>
            </div>

            {passage.questions?.length > 0 && (
              <div className="space-y-3">
                {passage.questions.map((q) => (
                  <MCQCard
                    key={q.id}
                    q={q}
                    type="READING"
                    onDelete={setDeleteModal}
                    onEdit={setEditTarget}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      ));
    }

    // ── Listening ──
    if (type === "LISTENING") {
      return questions.map((audio) => (
        <div
          key={audio.id}
          className="bg-white rounded-xl border border-gray-200 overflow-hidden"
        >
          <div className="p-5 border-b border-gray-100">
            <div className="flex items-start justify-between">
              <button
                onClick={() =>
                  setDeleteModal({
                    type: "LISTENING",
                    id: audio.id,
                    parentType: "audio",
                  })
                }
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="text-right">
                <h4 className="font-bold text-gray-900">{audio.title}</h4>
                <span className="text-xs text-gray-400">
                  {audio.duration}s •{" "}
                  <span
                    className={`font-medium ${
                      DIFFICULTY_COLORS[audio.difficulty]
                        ? "text-current"
                        : "text-gray-400"
                    }`}
                  >
                    {audio.difficulty}
                  </span>
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50">
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() =>
                  navigate(
                    `/dashboard/general/skills/${skillId}/add/listening/audio/${audio.id}/questions`
                  )
                }
                className="flex items-center gap-1.5 text-sm text-emerald-600 hover:text-emerald-700 font-semibold"
              >
                <Plus className="w-4 h-4" />
                إضافة سؤال
              </button>
              <span className="text-xs text-gray-400 font-medium">
                {audio.questions?.length || 0} سؤال
              </span>
            </div>
            {audio.questions?.length > 0 && (
              <div className="space-y-3">
                {audio.questions.map((q) => (
                  <MCQCard
                    key={q.id}
                    q={q}
                    type="LISTENING"
                    onDelete={setDeleteModal}
                    onEdit={setEditTarget}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      ));
    }

    // ── Speaking ──
    if (type === "SPEAKING") {
      return questions.map((video) => (
        <div
          key={video.id}
          className="bg-white rounded-xl border border-gray-200 overflow-hidden"
        >
          <div className="p-5 border-b border-gray-100">
            <div className="flex items-start justify-between">
              <button
                onClick={() =>
                  setDeleteModal({
                    type: "SPEAKING",
                    id: video.id,
                    parentType: "video",
                  })
                }
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="text-right">
                <h4 className="font-bold text-gray-900">{video.title}</h4>
                <span className="text-xs text-gray-400">
                  {video.duration}s • {video.difficulty}
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50">
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() =>
                  navigate(
                    `/dashboard/general/skills/${skillId}/add/speaking/video/${video.id}/questions`
                  )
                }
                className="flex items-center gap-1.5 text-sm text-emerald-600 hover:text-emerald-700 font-semibold"
              >
                <Plus className="w-4 h-4" />
                إضافة سؤال
              </button>
              <span className="text-xs text-gray-400 font-medium">
                {video.questions?.length || 0} سؤال
              </span>
            </div>
            {video.questions?.length > 0 && (
              <div className="space-y-3">
                {video.questions.map((q) => (
                  <MCQCard
                    key={q.id}
                    q={q}
                    type="SPEAKING"
                    onDelete={setDeleteModal}
                    onEdit={setEditTarget}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      ));
    }

    // ── Writing ──
    if (type === "WRITING") {
      return questions.map((q) => (
        <div
          key={q.id}
          className="bg-white rounded-xl border border-gray-200 p-4"
        >
          <div className="flex items-start gap-3">
            <button
              onClick={() => setDeleteModal({ type: "WRITING", id: q.id })}
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg flex-shrink-0"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <div className="text-right flex-1">
              <h4 className="font-bold text-gray-900 mb-1">{q.title}</h4>
              <p className="text-sm text-gray-600 line-clamp-2">
                {q.question_text}
              </p>
              <div className="flex gap-2 mt-2 justify-end flex-wrap">
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                  {q.min_words} - {q.max_words} كلمة
                </span>
                {q.difficulty && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      DIFFICULTY_COLORS[q.difficulty] ||
                      "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {q.difficulty}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      ));
    }

    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() =>
              navigate(
                `/dashboard/general/categories/${skill?.category}/skills`
              )
            }
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowRight className="w-5 h-5 text-gray-600" />
          </button>
          <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
            <SkillIcon className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{skill?.title}</h1>
            <p className="text-sm text-gray-500">
              {SKILL_TYPE_LABELS[skill?.skill_type]} • {questions.length} عنصر
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate(getAddPath())}
          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl hover:bg-emerald-700 transition-colors font-medium"
        >
          <Plus className="w-4 h-4" />
          إضافة{" "}
          {skill?.skill_type === "READING"
            ? "قطعة"
            : skill?.skill_type === "LISTENING"
            ? "تسجيل صوتي"
            : skill?.skill_type === "SPEAKING"
            ? "فيديو"
            : "سؤال"}
        </button>
      </div>

      {/* Questions */}
      {questions.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <SkillIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>لا توجد أسئلة بعد</p>
        </div>
      ) : (
        <div className="space-y-3">{renderQuestions()}</div>
      )}

      {/* Edit Modal */}
      {editTarget && (
        <EditMCQModal
          editTarget={editTarget}
          onClose={() => setEditTarget(null)}
          onSaved={() => {
            setEditTarget(null);
            fetchData();
          }}
        />
      )}

      {/* Delete Confirm Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-center text-gray-900 mb-2">
              تأكيد الحذف
            </h3>
            <p className="text-gray-500 text-center text-sm mb-6">
              هل أنت متأكد من حذف هذا العنصر؟ لا يمكن التراجع عن هذا الإجراء.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal(null)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 font-medium"
              >
                إلغاء
              </button>
              <button
                onClick={handleDeleteQuestion}
                disabled={deleting}
                className="flex-1 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 font-medium flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
                حذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
