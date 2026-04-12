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

export default function GeneralSkillDetails() {
  const navigate = useNavigate();
  const { skillId } = useParams();

  const [skill, setSkill] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(null);
  const [deleting, setDeleting] = useState(false);

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
      const { type, id, parentId, parentType } = deleteModal;
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

  const renderQuestions = () => {
    const type = skill?.skill_type;

    if (type === "VOCABULARY" || type === "GRAMMAR") {
      return questions.map((q) => (
        <div
          key={q.id}
          className="bg-white rounded-xl border border-gray-200 p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <button
              onClick={() => setDeleteModal({ type, id: q.id })}
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <div className="text-right flex-1">
              <p className="font-medium text-gray-900 mb-2">
                {q.question_text}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {["choice_a", "choice_b", "choice_c", "choice_d"].map(
                  (ch, i) =>
                    q[ch] && (
                      <span
                        key={ch}
                        className={`text-sm px-3 py-1.5 rounded-lg ${
                          q.correct_answer === String.fromCharCode(65 + i)
                            ? "bg-emerald-100 text-emerald-700 font-semibold"
                            : "bg-gray-50 text-gray-600"
                        }`}
                      >
                        {String.fromCharCode(65 + i)}. {q[ch]}
                      </span>
                    )
                )}
              </div>
            </div>
          </div>
          {q.difficulty && (
            <div className="mt-2 text-right">
              <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                {q.difficulty}
              </span>
            </div>
          )}
        </div>
      ));
    }

    if (type === "READING") {
      return questions.map((passage) => (
        <div
          key={passage.id}
          className="bg-white rounded-xl border border-gray-200 p-5"
        >
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
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                {passage.difficulty}
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-600 text-right mb-3 line-clamp-3 border-r-4 border-amber-300 pr-3">
            {passage.passage_text}
          </p>
          <div className="flex items-center justify-between">
            <button
              onClick={() =>
                navigate(
                  `/dashboard/general/skills/${skillId}/add/reading/passage/${passage.id}/questions`
                )
              }
              className="flex items-center gap-1.5 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
            >
              <Plus className="w-4 h-4" />
              Add Question
            </button>
            <span className="text-xs text-gray-400">
              {passage.questions?.length || 0} Question
            </span>
          </div>
          {passage.questions?.length > 0 && (
            <div className="mt-3 space-y-2 pt-3 border-t border-gray-100">
              {passage.questions.map((q) => (
                <div
                  key={q.id}
                  className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2"
                >
                  <button
                    onClick={() =>
                      setDeleteModal({ type: "READING", id: q.id })
                    }
                    className="p-1 text-gray-400 hover:text-red-600 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <p className="text-sm text-gray-700 text-right flex-1 pr-2">
                    {q.question_text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      ));
    }

    if (type === "LISTENING") {
      return questions.map((audio) => (
        <div
          key={audio.id}
          className="bg-white rounded-xl border border-gray-200 p-5"
        >
          <div className="flex items-start justify-between mb-3">
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
                {audio.duration}s • {audio.difficulty}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <button
              onClick={() =>
                navigate(
                  `/dashboard/general/skills/${skillId}/add/listening/audio/${audio.id}/questions`
                )
              }
              className="flex items-center gap-1.5 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
            >
              <Plus className="w-4 h-4" />
              Add Question
            </button>
            <span className="text-xs text-gray-400">
              {audio.questions?.length || 0} Question
            </span>
          </div>
        </div>
      ));
    }

    if (type === "SPEAKING") {
      return questions.map((video) => (
        <div
          key={video.id}
          className="bg-white rounded-xl border border-gray-200 p-5"
        >
          <div className="flex items-start justify-between mb-3">
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
          <div className="flex items-center justify-between">
            <button
              onClick={() =>
                navigate(
                  `/dashboard/general/skills/${skillId}/add/speaking/video/${video.id}/questions`
                )
              }
              className="flex items-center gap-1.5 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
            >
              <Plus className="w-4 h-4" />
              Add Question
            </button>
            <span className="text-xs text-gray-400">
              {video.questions?.length || 0} Question
            </span>
          </div>
        </div>
      ));
    }

    if (type === "WRITING") {
      return questions.map((q) => (
        <div
          key={q.id}
          className="bg-white rounded-xl border border-gray-200 p-4"
        >
          <div className="flex items-start justify-between gap-3">
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
              <div className="flex gap-2 mt-2 justify-end">
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                  {q.min_words} - {q.max_words} words
                </span>
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                  {q.difficulty}
                </span>
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
                `/dashboard/general/categories/${skill?.category?.id}/skills`
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
              {SKILL_TYPE_LABELS[skill?.skill_type]} • {questions.length} Items
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate(getAddPath())}
          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl hover:bg-emerald-700 transition-colors font-medium"
        >
          <Plus className="w-4 h-4" />
          Add{" "}
          {skill?.skill_type === "READING"
            ? "Passage"
            : skill?.skill_type === "LISTENING"
            ? "Audio Recording"
            : skill?.skill_type === "SPEAKING"
            ? "Video"
            : "Question"}
        </button>
      </div>

      {/* Questions */}
      {questions.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <SkillIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No questions yet</p>
        </div>
      ) : (
        <div className="space-y-3">{renderQuestions()}</div>
      )}

      {/* Delete Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-center text-gray-900 mb-2">
              Confirm Deletion
            </h3>
            <p className="text-gray-500 text-center text-sm mb-6">
              Are you sure you want to delete this item? This action cannot be
              undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal(null)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteQuestion}
                disabled={deleting}
                className="flex-1 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 font-medium flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
