// src/pages/AddReadingPassageToSTEP.jsx
import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowRight, Save } from "lucide-react";
import { stepQuestionsAPI } from "../../services/stepService";

export default function AddReadingPassageToSTEP() {
  const { skillId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    title: "",
    passage_text: "",
    source: "",
    difficulty: "MEDIUM",
    is_active: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      const res = await stepQuestionsAPI.createReadingPassage({
        ...form,
        step_skill: skillId,
      });
      navigate(
        `/dashboard/step/skills/${skillId}/add/reading/passage/${res.passage.id}/questions`
      );
    } catch (err) {
      setErrors(
        err.response?.data || { general: "An error occurred, please try again" }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          to={`/dashboard/step/skills/${skillId}`}
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
        >
          <ArrowRight className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Add Reading Passage
          </h1>
          <p className="text-gray-500 text-sm">
            Add a passage, then you'll be taken to add its questions
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-5">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Passage Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            placeholder="Example: Climate Change and Its Effects"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          {errors.title && (
            <p className="text-red-500 text-xs mt-1">{errors.title}</p>
          )}
        </div>

        {/* Passage Text */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Passage Text <span className="text-red-500">*</span>
          </label>
          <textarea
            name="passage_text"
            value={form.passage_text}
            onChange={handleChange}
            required
            rows={8}
            placeholder="Enter the full passage text here..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none leading-relaxed"
          />
          {errors.passage_text && (
            <p className="text-red-500 text-xs mt-1">{errors.passage_text}</p>
          )}
        </div>

        {/* Source */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Source (Optional)
          </label>
          <input
            type="text"
            name="source"
            value={form.source}
            onChange={handleChange}
            placeholder="Example: National Geographic, 2023"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Difficulty Level
          </label>
          <select
            name="difficulty"
            value={form.difficulty}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>
        </div>

        {/* Active */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="is_active"
            id="is_active"
            checked={form.is_active}
            onChange={handleChange}
            className="w-4 h-4 text-orange-600"
          />
          <label
            htmlFor="is_active"
            className="text-sm font-medium text-gray-700"
          >
            Active
          </label>
        </div>

        {errors.general && (
          <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
            {errors.general}
          </p>
        )}

        <div className="bg-orange-50 rounded-lg p-3 text-sm text-orange-700">
          💡 After saving the passage, you'll be automatically redirected to add
          questions for it
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white py-3 rounded-lg font-medium transition-colors"
        >
          <Save className="w-5 h-5" />
          {loading ? "Saving..." : "Save Passage & Continue"}
        </button>
      </form>
    </div>
  );
}
