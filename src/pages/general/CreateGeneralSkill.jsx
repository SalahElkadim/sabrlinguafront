// src/pages/general/CreategeneralSkill.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BookOpen, Save, ArrowRight, Loader2 } from "lucide-react";
import { generalSkillsAPI } from "../../services/generalService";

const SKILL_TYPES = [
  { value: "VOCABULARY", label: "Vocabulary" },
  { value: "GRAMMAR", label: "Grammar" },
  { value: "READING", label: "Reading" },
  { value: "LISTENING", label: "Listening" },
  { value: "SPEAKING", label: "Speaking" },
  { value: "WRITING", label: "Writing" },
  { value: "GENERAL_PATH", label: "General Path" },
];
const ORDER_TYPES = [
  {
    value: "SEQUENTIAL",
    label: "تسلسلي",
    desc: "سهل ← متوسط ← صعب",
    icon: "→",
  },
  {
    value: "CYCLIC",
    label: "دوري",
    desc: "3 سهل، 3 متوسط، 3 صعب، تكرار",
    icon: "↻",
  },
  {
    value: "RANDOM",
    label: "عشوائي",
    desc: "يتغير مع كل جلسة",
    icon: "⁂",
  },
];
export default function CreategeneralSkill() {
  const navigate = useNavigate();
  const { categoryId, skillId } = useParams();
  const isEdit = Boolean(skillId);

  const [form, setForm] = useState({
    title: "",
    skill_type: "VOCABULARY",
    question_order_type: "SEQUENTIAL",
    description: "",
    order: 0,
    is_active: true,
    category: categoryId,
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEdit) fetchSkill();
  }, [skillId]);

  const fetchSkill = async () => {
    try {
      const data = await generalSkillsAPI.getById(skillId);
      setForm({
        title: data.title || "",
        skill_type: data.skill_type || "VOCABULARY",
        description: data.description || "",
        order: data.order || 0,
        is_active: data.is_active ?? true,
        category: data.category || categoryId,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("عنوان المهارة مطلوب");
      return;
    }
    try {
      setLoading(true);
      setError("");
      if (isEdit) {
        await generalSkillsAPI.update(skillId, form);
      } else {
        await generalSkillsAPI.create(categoryId, form);
      }
      navigate(`/dashboard/general/categories/${categoryId}/skills`);
    } catch (err) {
      setError(err.rgeneralonse?.data?.message || "حدث خطأ، حاول مرة أخرى");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() =>
            navigate(`/dashboard/general/categories/${categoryId}/skills`)
          }
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowRight className="w-5 h-5 text-gray-600" />
        </button>
        <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-emerald-700" />
        </div>
        <h1 className="text-xl font-bold text-gray-900">
          {isEdit ? "تعديل المهارة" : "إضافة مهارة جديدة"}
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5"
      >
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700 text-right">
            نوع المهارة <span className="text-red-500">*</span>
          </label>
          <select
            value={form.skill_type}
            onChange={(e) => setForm({ ...form, skill_type: e.target.value })}
            disabled={isEdit}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-right bg-white disabled:bg-gray-50 disabled:text-gray-400"
          >
            {SKILL_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          {isEdit && (
            <p className="text-xs text-gray-400 text-right">
              لا يمكن تغيير نوع المهارة بعد الإنشاء
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700 text-right">
            العنوان <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="مثال: Advanced Vocabulary"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-right"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700 text-right">
            الوصف
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="وصف مختصر للمهارة..."
            rows={3}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-right resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700 text-right">
            الترتيب
          </label>
          <input
            type="number"
            value={form.order}
            onChange={(e) =>
              setForm({ ...form, order: parseInt(e.target.value) || 0 })
            }
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-right"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 text-right">
            طريقة ترتيب الأسئلة
          </label>
          <div className="grid grid-cols-3 gap-2">
            {ORDER_TYPES.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() =>
                  setForm({ ...form, question_order_type: t.value })
                }
                className={`p-3 rounded-xl border text-center transition-all ${
                  form.question_order_type === t.value
                    ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                    : "border-gray-200 hover:border-gray-300 text-gray-600"
                }`}
              >
                <div className="text-xl mb-1">{t.icon}</div>
                <div className="text-xs font-medium">{t.label}</div>
                <div className="text-xs text-gray-400 mt-0.5">{t.desc}</div>
              </button>
            ))}
          </div>
        </div>
        {/* is_active toggle */}
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-700">حالة المهارة</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {form.is_active
                ? "المهارة نشطة وظاهرة للطلاب"
                : "المهارة معطلة وغير ظاهرة"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setForm({ ...form, is_active: !form.is_active })}
            className={`relative w-12 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${
              form.is_active ? "bg-emerald-500" : "bg-gray-300"
            }`}
          >
            <span
              className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                form.is_active ? "translate-x-7" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() =>
              navigate(`/dashboard/general/categories/${categoryId}/skills`)
            }
            className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 font-medium"
          >
            إلغاء
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-medium flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isEdit ? "حفظ التعديلات" : "إنشاء المهارة"}
          </button>
        </div>
      </form>
    </div>
  );
}
