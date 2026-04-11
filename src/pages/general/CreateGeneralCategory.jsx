// src/pages/general/CreateGeneralCategory.jsx
// يُستخدم لإنشاء كاتيجوري جديدة أو تعديل موجودة (حسب وجود categoryId في params)
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FolderOpen, Save, ArrowRight, Loader2 } from "lucide-react";
import { generalCategoriesAPI } from "../../services/generalService";

export default function CreateGeneralCategory() {
  const navigate = useNavigate();
  const { categoryId } = useParams(); // موجود لو edit
  const isEdit = Boolean(categoryId);

  const [form, setForm] = useState({ name: "", description: "", order: 0 });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEdit) {
      fetchCategory();
    }
  }, [categoryId]);

  const fetchCategory = async () => {
    try {
      const data = await generalCategoriesAPI.getById(categoryId);
      setForm({
        name: data.name || "",
        description: data.description || "",
        order: data.order || 0,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("اسم الكاتيجوري مطلوب");
      return;
    }
    try {
      setLoading(true);
      setError("");
      if (isEdit) {
        await generalCategoriesAPI.update(categoryId, form);
      } else {
        await generalCategoriesAPI.create(form);
      }
      navigate("/dashboard/general/categories");
    } catch (err) {
      setError(err.response?.data?.message || "حدث خطأ، حاول مرة أخرى");
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
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/dashboard/general/categories")}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowRight className="w-5 h-5 text-gray-600" />
        </button>
        <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
          <FolderOpen className="w-5 h-5 text-emerald-700" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            {isEdit ? "تعديل الكاتيجوري" : "إضافة كاتيجوري جديدة"}
          </h1>
        </div>
      </div>

      {/* Form */}
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
            اسم الكاتيجوري <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="مثال: Business English"
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
            placeholder="وصف مختصر للكاتيجوري..."
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

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate("/dashboard/general/categories")}
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
            {isEdit ? "حفظ التعديلات" : "إنشاء الكاتيجوري"}
          </button>
        </div>
      </form>
    </div>
  );
}
