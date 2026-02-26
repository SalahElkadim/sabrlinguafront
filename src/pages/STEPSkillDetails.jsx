// src/pages/STEPSkillDetails.jsx
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
} from "lucide-react";
import { stepSkillsAPI, stepQuestionsAPI } from "../services/stepService";

const skillTypeConfig = {
  VOCABULARY: {
    label: "Vocabulary",
    icon: Volume2,
    color: "text-blue-600",
    bg: "bg-blue-50",
    addRoute: "vocabulary",
  },
  GRAMMAR: {
    label: "Grammar",
    icon: PenTool,
    color: "text-purple-600",
    bg: "bg-purple-50",
    addRoute: "grammar",
  },
  READING: {
    label: "Reading",
    icon: BookOpen,
    color: "text-orange-600",
    bg: "bg-orange-50",
    addRoute: "reading/passage",
  },
  WRITING: {
    label: "Writing",
    icon: FileText,
    color: "text-green-600",
    bg: "bg-green-50",
    addRoute: "writing",
  },
};

function MCQCard({ q, index, color }) {
  const [showAnswer, setShowAnswer] = useState(false);
  const choices = [
    { key: "A", val: q.choice_a },
    { key: "B", val: q.choice_b },
    { key: "C", val: q.choice_c },
    { key: "D", val: q.choice_d },
  ].filter((c) => c.val);

  return (
    <div className="border border-gray-200 rounded-xl p-4">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-3">
          <span
            className={`text-xs font-bold px-2 py-1 rounded-full ${color} bg-opacity-10`}
          >
            {index + 1}
          </span>
          <p className="text-gray-800 text-sm font-medium">{q.question_text}</p>
        </div>
        <button
          onClick={() => setShowAnswer((v) => !v)}
          className="text-gray-400 hover:text-gray-600 shrink-0"
          title="عرض الإجابة"
        >
          {showAnswer ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
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
  );
}

function ReadingPassageCard({ passage, index }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 bg-orange-50 hover:bg-orange-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
            {index + 1}
          </span>
          <p className="font-medium text-gray-800 text-sm text-right">
            {passage.title}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-orange-600">
            {passage.questions?.length} أسئلة
          </span>
          {expanded ? (
            <ChevronDown className="w-4 h-4 text-orange-500" />
          ) : (
            <ChevronRight className="w-4 h-4 text-orange-500" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="p-4 space-y-4">
          <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 leading-relaxed max-h-40 overflow-y-auto">
            {passage.passage_text}
          </div>
          {passage.questions?.map((q, qi) => (
            <MCQCard key={q.id} q={q} index={qi} color="text-orange-600" />
          ))}
        </div>
      )}
    </div>
  );
}

function WritingCard({ q, index }) {
  const [showSample, setShowSample] = useState(false);

  return (
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
        <button
          onClick={() => setShowSample((v) => !v)}
          className="text-gray-400 hover:text-gray-600 shrink-0"
        >
          {showSample ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
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
  );
}

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

  const addRouteMap = {
    VOCABULARY: `/dashboard/step/skills/${skillId}/add/vocabulary`,
    GRAMMAR: `/dashboard/step/skills/${skillId}/add/grammar`,
    READING: `/dashboard/step/skills/${skillId}/add/reading/passage`,
    WRITING: `/dashboard/step/skills/${skillId}/add/writing`,
  };

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
        <div className="flex gap-4">
          <div className="card !py-3 !px-5 text-center">
            <p className={`text-2xl font-bold ${config.color}`}>
              {skill.total_questions}
            </p>
            <p className="text-xs text-gray-500">إجمالي الأسئلة</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Link
            to={`/dashboard/step/skills/${skillId}/edit`}
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm transition-colors"
          >
            تعديل المهارة
          </Link>
          <Link
            to={addRouteMap[skill.skill_type]}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            {skill.skill_type === "READING" ? "إضافة قطعة قراءة" : "إضافة سؤال"}
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
            {(skill.skill_type === "VOCABULARY" ||
              skill.skill_type === "GRAMMAR") &&
              questions.map((q, i) => (
                <MCQCard key={q.id} q={q} index={i} color={config.color} />
              ))}

            {skill.skill_type === "READING" &&
              questions.map((p, i) => (
                <ReadingPassageCard key={p.id} passage={p} index={i} />
              ))}

            {skill.skill_type === "WRITING" &&
              questions.map((q, i) => (
                <WritingCard key={q.id} q={q} index={i} />
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
