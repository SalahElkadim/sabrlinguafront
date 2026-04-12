// src/pages/general/GeneralSkillsList.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Plus,
  BookOpen,
  Pencil,
  Trash2,
  ChevronRight,
  Loader2,
  ArrowRight,
} from "lucide-react";
import {
  generalCategoriesAPI,
  generalSkillsAPI,
} from "../../services/generalService";

const SKILL_TYPE_LABELS = {
  VOCABULARY: { label: "Vocabulary", color: "bg-blue-100 text-blue-700" },
  GRAMMAR: { label: "Grammar", color: "bg-purple-100 text-purple-700" },
  READING: { label: "Reading", color: "bg-amber-100 text-amber-700" },
  LISTENING: { label: "Listening", color: "bg-cyan-100 text-cyan-700" },
  SPEAKING: { label: "Speaking", color: "bg-orange-100 text-orange-700" },
  WRITING: { label: "Writing", color: "bg-pink-100 text-pink-700" },
};

export default function GeneralSkillsList() {
  const navigate = useNavigate();
  const { categoryId } = useParams();

  const [category, setCategory] = useState(null);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [categoryId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [catData, skillsData] = await Promise.all([
        generalCategoriesAPI.getById(categoryId),
        generalSkillsAPI.getByCategory(categoryId),
      ]);
      setCategory(catData);
      setSkills(skillsData.skills || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal) return;
    try {
      setDeleting(true);
      await generalSkillsAPI.delete(deleteModal.id);
      setSkills((prev) => prev.filter((s) => s.id !== deleteModal.id));
      setDeleteModal(null);
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  const getSkillDetailsPath = (skill) => {
    const typeMap = {
      VOCABULARY: "vocabulary",
      GRAMMAR: "grammar",
      READING: "reading",
      LISTENING: "listening",
      SPEAKING: "speaking",
      WRITING: "writing",
    };
    return `/dashboard/general/skills/${skill.id}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/dashboard/general/categories")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowRight className="w-5 h-5 text-gray-600" />
          </button>
          <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {category?.name}
            </h1>
            <p className="text-sm text-gray-500">{skills.length} Skills</p>
          </div>
        </div>
        <button
          onClick={() =>
            navigate(
              `/dashboard/general/categories/${categoryId}/skills/create`
            )
          }
          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl hover:bg-emerald-700 transition-colors font-medium"
        >
          <Plus className="w-4 h-4" />
          Add Skill
        </button>
      </div>

      {/* Skills List */}
      {skills.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No skills in this category yet</p>
          <button
            onClick={() =>
              navigate(
                `/dashboard/general/categories/${categoryId}/skills/create`
              )
            }
            className="mt-4 inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium"
          >
            <Plus className="w-4 h-4" />
            Add a skill now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map((skill) => {
            const typeInfo = SKILL_TYPE_LABELS[skill.skill_type] || {
              label: skill.skill_type,
              color: "bg-gray-100 text-gray-700",
            };
            return (
              <div
                key={skill.id}
                className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md transition-all hover:border-emerald-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        navigate(
                          `/dashboard/general/categories/${categoryId}/skills/${skill.id}/edit`
                        )
                      }
                      className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteModal(skill)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${typeInfo.color}`}
                  >
                    {typeInfo.label}
                  </span>
                </div>

                <h3 className="font-bold text-gray-900 text-right mb-1">
                  {skill.title}
                </h3>
                {skill.description && (
                  <p className="text-sm text-gray-500 text-right mb-3 line-clamp-2">
                    {skill.description}
                  </p>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <button
                    onClick={() =>
                      navigate(`/dashboard/general/skills/${skill.id}`)
                    }
                    className="flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                  >
                    <ChevronRight className="w-4 h-4" />
                    Manage Questions
                  </button>
                  <span className="text-xs text-gray-400">
                    {skill.total_questions || 0} Questions
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-center text-gray-900 mb-2">
              Delete Skill
            </h3>
            <p className="text-gray-500 text-center text-sm mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-700">
                "{deleteModal.title}"
              </span>
              ?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal(null)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
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
