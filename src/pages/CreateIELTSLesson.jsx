// src/pages/CreateIELTSLesson.jsx
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Trash2,
  BookOpen,
  Headphones,
  Video,
  PenLine,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { ieltsLessonPacksAPI } from "../services/Ieltsservice";
import api from "../api/axios";
import toast from "react-hot-toast";

// ============================================
// Constants
// ============================================
const SKILL_ICONS = {
  READING: { icon: BookOpen, emoji: "📖", color: "blue", label: "قراءة" },
  WRITING: { icon: PenLine, emoji: "✍️", color: "purple", label: "كتابة" },
  SPEAKING: { icon: Video, emoji: "🗣️", color: "green", label: "تحدث" },
  LISTENING: {
    icon: Headphones,
    emoji: "👂",
    color: "orange",
    label: "استماع",
  },
};

const EMPTY_QUESTION = {
  question_text: "",
  choice_a: "",
  choice_b: "",
  choice_c: "",
  choice_d: "",
  correct_answer: "A",
  explanation: "",
  points: 1,
  order: 1,
};

// ============================================
// Sub-components
// ============================================

function SectionHeader({ step, title, subtitle, icon: Icon, color }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div
        className={`w-8 h-8 rounded-full bg-${color}-100 flex items-center justify-center flex-shrink-0`}
      >
        <span className="text-sm font-bold text-gray-600">{step}</span>
      </div>
      <div>
        <h3 className="font-bold text-gray-900">{title}</h3>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
    </div>
  );
}

function QuestionCard({ question, index, onChange, onRemove }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Question Header */}
      <div
        className="flex items-center justify-between p-3 bg-gray-50 cursor-pointer hover:bg-gray-100"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
            {index + 1}
          </span>
          <span className="text-sm font-medium text-gray-700 truncate max-w-xs">
            {question.question_text || `سؤال ${index + 1}`}
          </span>
          {question.question_text && (
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                question.correct_answer
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              إجابة: {question.correct_answer}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="text-red-400 hover:text-red-600 p-1"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </div>

      {/* Question Body */}
      {expanded && (
        <div className="p-4 space-y-4">
          {/* Question Text */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              نص السؤال <span className="text-red-500">*</span>
            </label>
            <textarea
              value={question.question_text}
              onChange={(e) => onChange("question_text", e.target.value)}
              className="input-field resize-none"
              rows={2}
              placeholder="اكتب السؤال هنا..."
            />
          </div>

          {/* Choices */}
          <div className="grid grid-cols-2 gap-3">
            {["a", "b", "c", "d"].map((choice) => (
              <div key={choice}>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  <span
                    className={`inline-flex w-5 h-5 rounded-full items-center justify-center text-xs font-bold mr-1 ${
                      question.correct_answer === choice.toUpperCase()
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {choice.toUpperCase()}
                  </span>
                  {choice === "a"
                    ? "الاختيار الأول"
                    : choice === "b"
                    ? "الاختيار الثاني"
                    : choice === "c"
                    ? "الاختيار الثالث"
                    : "الاختيار الرابع"}
                  <span className="text-red-500"> *</span>
                </label>
                <input
                  type="text"
                  value={question[`choice_${choice}`]}
                  onChange={(e) => onChange(`choice_${choice}`, e.target.value)}
                  className="input-field"
                  placeholder={`اختيار ${choice.toUpperCase()}`}
                />
              </div>
            ))}
          </div>

          {/* Correct Answer + Points */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                الإجابة الصحيحة <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                {["A", "B", "C", "D"].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => onChange("correct_answer", opt)}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg border-2 transition-all ${
                      question.correct_answer === opt
                        ? "bg-green-500 border-green-500 text-white"
                        : "border-gray-200 text-gray-600 hover:border-green-300"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                الدرجة
              </label>
              <input
                type="number"
                value={question.points}
                onChange={(e) =>
                  onChange("points", parseInt(e.target.value) || 1)
                }
                className="input-field"
                min={1}
                max={10}
              />
            </div>
          </div>

          {/* Explanation */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              الشرح (اختياري)
            </label>
            <input
              type="text"
              value={question.explanation}
              onChange={(e) => onChange("explanation", e.target.value)}
              className="input-field"
              placeholder="شرح الإجابة الصحيحة..."
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// Content Forms per skill type
// ============================================

function ReadingContentForm({ data, onChange }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">
          النص القرائي <span className="text-red-500">*</span>
        </label>
        <textarea
          value={data.reading_text}
          onChange={(e) => onChange("reading_text", e.target.value)}
          className="input-field resize-none"
          rows={6}
          placeholder="أدخل النص القرائي هنا..."
        />
      </div>
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">
          الشرح
        </label>
        <textarea
          value={data.explanation}
          onChange={(e) => onChange("explanation", e.target.value)}
          className="input-field resize-none"
          rows={3}
          placeholder="شرح الدرس..."
        />
      </div>
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">
          رابط الفيديو
        </label>
        <input
          type="url"
          value={data.video_url}
          onChange={(e) => onChange("video_url", e.target.value)}
          className="input-field"
          placeholder="https://youtube.com/..."
          dir="ltr"
        />
      </div>
    </div>
  );
}

function ListeningContentForm({ data, onChange }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">
          رابط الصوت (Cloudinary) <span className="text-red-500">*</span>
        </label>
        <input
          type="url"
          value={data.audio_file}
          onChange={(e) => onChange("audio_file", e.target.value)}
          className="input-field"
          placeholder="https://res.cloudinary.com/..."
          dir="ltr"
        />
      </div>
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">
          النص المكتوب (Transcript)
        </label>
        <textarea
          value={data.transcript}
          onChange={(e) => onChange("transcript", e.target.value)}
          className="input-field resize-none"
          rows={4}
          placeholder="نص المقطع الصوتي..."
        />
      </div>
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">
          شرح المفردات
        </label>
        <textarea
          value={data.vocabulary_explanation}
          onChange={(e) => onChange("vocabulary_explanation", e.target.value)}
          className="input-field resize-none"
          rows={3}
          placeholder="شرح الكلمات الصعبة..."
        />
      </div>
    </div>
  );
}

function SpeakingContentForm({ data, onChange }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">
          رابط الفيديو (Cloudinary) <span className="text-red-500">*</span>
        </label>
        <input
          type="url"
          value={data.video_file}
          onChange={(e) => onChange("video_file", e.target.value)}
          className="input-field"
          placeholder="https://res.cloudinary.com/..."
          dir="ltr"
        />
      </div>
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">
          نصائح النطق
        </label>
        <textarea
          value={data.pronunciation_tips}
          onChange={(e) => onChange("pronunciation_tips", e.target.value)}
          className="input-field resize-none"
          rows={3}
          placeholder="نصائح للنطق الصحيح..."
        />
      </div>
    </div>
  );
}

function WritingContentForm({ data, onChange }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">
          تعليمات الكتابة
        </label>
        <textarea
          value={data.writing_instructions}
          onChange={(e) => onChange("writing_instructions", e.target.value)}
          className="input-field resize-none"
          rows={4}
          placeholder="أدخل تعليمات الكتابة..."
        />
      </div>
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">
          رابط الفيديو
        </label>
        <input
          type="url"
          value={data.video_url}
          onChange={(e) => onChange("video_url", e.target.value)}
          className="input-field"
          placeholder="https://youtube.com/..."
          dir="ltr"
        />
      </div>
    </div>
  );
}

// ============================================
// Default content per skill type
// ============================================
const getDefaultContent = (skillType) => {
  switch (skillType) {
    case "READING":
      return {
        reading_text: "",
        explanation: "",
        vocabulary_words: [],
        examples: [],
        video_url: "",
        resources: [],
      };
    case "LISTENING":
      return {
        audio_file: "",
        transcript: "",
        vocabulary_explanation: "",
        listening_exercises: [],
        tips: [],
      };
    case "SPEAKING":
      return {
        video_file: "",
        dialogue_texts: [],
        useful_phrases: [],
        audio_examples: [],
        pronunciation_tips: "",
      };
    case "WRITING":
      return {
        sample_texts: [],
        writing_instructions: "",
        tips: [],
        examples: [],
        video_url: "",
      };
    default:
      return {};
  }
};

// ============================================
// Main Component
// ============================================
export default function CreateIELTSLesson() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedPackId = searchParams.get("lesson_pack_id");

  const [lessonPacks, setLessonPacks] = useState([]);
  const [selectedPack, setSelectedPack] = useState(null);
  const [loading, setLoading] = useState(false);
  const [packsLoading, setPacksLoading] = useState(true);

  // Form state
  const [lessonData, setLessonData] = useState({
    lesson_pack: preselectedPackId || "",
    title: "",
    description: "",
    order: 1,
    is_active: true,
  });
  const [contentData, setContentData] = useState({});
  const [questions, setQuestions] = useState([]);

  // Load lesson packs
  useEffect(() => {
    const fetchPacks = async () => {
      try {
        setPacksLoading(true);
        const data = await ieltsLessonPacksAPI.getAll();
        console.log("Lesson Packs Response:", data); // ← هنا
        setLessonPacks(
          data.lesson_packs || data.results || (Array.isArray(data) ? data : [])
        );
      } catch {
        toast.error("فشل في تحميل Lesson Packs");
      } finally {
        setPacksLoading(false);
      }
    };
    fetchPacks();
  }, []);

  // When pack changes, update skill type + reset content
  useEffect(() => {
    if (lessonData.lesson_pack && lessonPacks.length > 0) {
      const pack = lessonPacks.find(
        (p) => String(p.id) === String(lessonData.lesson_pack)
      );
      setSelectedPack(pack || null);
      if (pack) {
        setContentData(getDefaultContent(pack.skill_type));
        setQuestions([]);
      }
    }
  }, [lessonData.lesson_pack, lessonPacks]);

  // Auto-select preselected pack
  useEffect(() => {
    if (preselectedPackId && lessonPacks.length > 0) {
      const pack = lessonPacks.find((p) => String(p.id) === preselectedPackId);
      if (pack) {
        setSelectedPack(pack);
        setContentData(getDefaultContent(pack.skill_type));
      }
    }
  }, [preselectedPackId, lessonPacks]);

  const handleLessonChange = (field, value) => {
    setLessonData((prev) => ({ ...prev, [field]: value }));
  };

  const handleContentChange = (field, value) => {
    setContentData((prev) => ({ ...prev, [field]: value }));
  };

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      { ...EMPTY_QUESTION, order: prev.length + 1 },
    ]);
  };

  const updateQuestion = (index, field, value) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, [field]: value } : q))
    );
  };

  const removeQuestion = (index) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    if (!lessonData.lesson_pack) {
      toast.error("يجب اختيار Lesson Pack");
      return false;
    }
    if (!lessonData.title.trim()) {
      toast.error("يجب إدخال عنوان الدرس");
      return false;
    }

    const skillType = selectedPack?.skill_type;

    if (skillType === "READING" && !contentData.reading_text?.trim()) {
      toast.error("يجب إدخال النص القرائي");
      return false;
    }
    if (skillType === "LISTENING" && !contentData.audio_file?.trim()) {
      toast.error("يجب إدخال رابط الصوت");
      return false;
    }
    if (skillType === "SPEAKING" && !contentData.video_file?.trim()) {
      toast.error("يجب إدخال رابط الفيديو");
      return false;
    }

    // Validate questions
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question_text.trim()) {
        toast.error(`السؤال ${i + 1}: يجب إدخال نص السؤال`);
        return false;
      }
      if (!q.choice_a || !q.choice_b || !q.choice_c || !q.choice_d) {
        toast.error(`السؤال ${i + 1}: يجب إدخال جميع الاختيارات`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload = {
        lesson_pack: parseInt(lessonData.lesson_pack),
        title: lessonData.title,
        description: lessonData.description,
        order: parseInt(lessonData.order),
        is_active: lessonData.is_active,
        content: contentData,
        questions: questions,
      };

      const response = await api.post("/ielts/lessons/create-full/", payload);

      toast.success("تم إنشاء الدرس والمحتوى والأسئلة بنجاح! 🎉");
      navigate(`/dashboard/ielts/lessons/${response.data.lesson.id}`);
    } catch (error) {
      const msg = error.response?.data?.error || "فشل في إنشاء الدرس";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const skillInfo = selectedPack ? SKILL_ICONS[selectedPack.skill_type] : null;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          to={
            preselectedPackId
              ? `/dashboard/ielts/lesson-packs/${preselectedPackId}`
              : "/dashboard/ielts/skills"
          }
          className="btn-secondary flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>رجوع</span>
        </Link>
        <div className="flex items-center gap-3">
          {skillInfo && <span className="text-2xl">{skillInfo.emoji}</span>}
          <h1 className="text-xl font-bold text-gray-900">إنشاء درس جديد</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ====== Step 1: Lesson Info ====== */}
        <div className="card">
          <SectionHeader
            step="1"
            title="معلومات الدرس"
            subtitle="البيانات الأساسية للدرس"
            color="blue"
          />

          <div className="space-y-4">
            {/* Lesson Pack */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Lesson Pack <span className="text-red-500">*</span>
              </label>
              {packsLoading ? (
                <div className="input-field text-gray-400">جاري التحميل...</div>
              ) : (
                <select
                  value={lessonData.lesson_pack}
                  onChange={(e) =>
                    handleLessonChange("lesson_pack", e.target.value)
                  }
                  className="input-field"
                  required
                >
                  <option value="">اختر Lesson Pack</option>
                  {lessonPacks.map((pack) => (
                    <option key={pack.id} value={pack.id}>
                      {pack.title} ({pack.skill_type})
                    </option>
                  ))}
                </select>
              )}
              {selectedPack && (
                <div
                  className={`mt-2 flex items-center gap-2 text-xs text-${skillInfo?.color}-600 font-medium`}
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>
                    المهارة: {skillInfo?.label} — {selectedPack.title}
                  </span>
                </div>
              )}
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                عنوان الدرس <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={lessonData.title}
                onChange={(e) => handleLessonChange("title", e.target.value)}
                className="input-field"
                placeholder="أدخل عنوان الدرس..."
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                الوصف
              </label>
              <textarea
                value={lessonData.description}
                onChange={(e) =>
                  handleLessonChange("description", e.target.value)
                }
                className="input-field resize-none"
                rows={2}
                placeholder="وصف مختصر للدرس..."
              />
            </div>

            {/* Order + Active */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  الترتيب
                </label>
                <input
                  type="number"
                  value={lessonData.order}
                  onChange={(e) => handleLessonChange("order", e.target.value)}
                  className="input-field"
                  min={1}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  الحالة
                </label>
                <select
                  value={lessonData.is_active}
                  onChange={(e) =>
                    handleLessonChange("is_active", e.target.value === "true")
                  }
                  className="input-field"
                >
                  <option value="true">نشط</option>
                  <option value="false">غير نشط</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* ====== Step 2: Content (only when pack selected) ====== */}
        {selectedPack && (
          <div className="card">
            <SectionHeader
              step="2"
              title={`محتوى درس ${skillInfo?.label}`}
              subtitle="المحتوى التعليمي للدرس"
              color={skillInfo?.color || "gray"}
            />

            {selectedPack.skill_type === "READING" && (
              <ReadingContentForm
                data={contentData}
                onChange={handleContentChange}
              />
            )}
            {selectedPack.skill_type === "LISTENING" && (
              <ListeningContentForm
                data={contentData}
                onChange={handleContentChange}
              />
            )}
            {selectedPack.skill_type === "SPEAKING" && (
              <SpeakingContentForm
                data={contentData}
                onChange={handleContentChange}
              />
            )}
            {selectedPack.skill_type === "WRITING" && (
              <WritingContentForm
                data={contentData}
                onChange={handleContentChange}
              />
            )}
          </div>
        )}

        {/* ====== Step 3: Questions (only for READING, LISTENING, SPEAKING) ====== */}
        {selectedPack && selectedPack.skill_type !== "WRITING" && (
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <SectionHeader
                step="3"
                title="أسئلة الدرس (MCQ)"
                subtitle={`أسئلة اختيار من متعدد — ${questions.length} سؤال`}
                color="green"
              />
              <button
                type="button"
                onClick={addQuestion}
                className="btn-primary flex items-center gap-2 text-sm py-2"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة سؤال</span>
              </button>
            </div>

            {questions.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                <AlertCircle className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500 mb-3">
                  لم تتم إضافة أسئلة بعد
                </p>
                <button
                  type="button"
                  onClick={addQuestion}
                  className="btn-secondary text-sm inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة أول سؤال</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {questions.map((q, index) => (
                  <QuestionCard
                    key={index}
                    question={q}
                    index={index}
                    onChange={(field, value) =>
                      updateQuestion(index, field, value)
                    }
                    onRemove={() => removeQuestion(index)}
                  />
                ))}

                <button
                  type="button"
                  onClick={addQuestion}
                  className="w-full py-3 border-2 border-dashed border-gray-200 rounded-lg text-sm text-gray-500 hover:border-primary-300 hover:text-primary-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة سؤال آخر</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* ====== Summary ====== */}
        {selectedPack && (
          <div className="card bg-gray-50">
            <h3 className="text-sm font-bold text-gray-700 mb-3">ملخص</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary-600">1</div>
                <div className="text-xs text-gray-500">درس</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {Object.values(contentData).filter(Boolean).length}
                </div>
                <div className="text-xs text-gray-500">حقل محتوى</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {questions.length}
                </div>
                <div className="text-xs text-gray-500">سؤال</div>
              </div>
            </div>
          </div>
        )}

        {/* ====== Submit ====== */}
        <div className="flex items-center justify-end gap-3 pb-6">
          <Link
            to={
              preselectedPackId
                ? `/dashboard/ielts/lesson-packs/${preselectedPackId}`
                : "/dashboard/ielts/skills"
            }
            className="btn-secondary"
          >
            إلغاء
          </Link>
          <button
            type="submit"
            disabled={loading || !selectedPack}
            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>جاري الإنشاء...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>إنشاء الدرس</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
