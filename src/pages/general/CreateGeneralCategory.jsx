// src/pages/general/CreateGeneralCategory.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FolderOpen, Save, ArrowRight, Loader2, Upload, X } from "lucide-react";
import { generalCategoriesAPI } from "../../services/generalService";

export default function CreateGeneralCategory() {
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const isEdit = Boolean(categoryId);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    order: 0,
    is_active: true,
  });
  const [iconFile, setIconFile] = useState(null); // الملف الفعلي
  const [iconPreview, setIconPreview] = useState(null); // preview للعرض
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEdit) fetchCategory();
  }, [categoryId]);

  const fetchCategory = async () => {
    try {
      const data = await generalCategoriesAPI.getById(categoryId);
      setForm({
        name: data.name || "",
        description: data.description || "",
        order: data.order || 0,
        is_active: data.is_active ?? true,
      });
      if (data.icon) setIconPreview(data.icon); // عرض الأيقونة الحالية
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  const handleIconChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIconFile(file);
    setIconPreview(URL.createObjectURL(file)); // preview فوري
  };

  const handleRemoveIcon = () => {
    setIconFile(null);
    setIconPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
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

      // ✅ لازم FormData عشان ترفع ملف
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description || "");
      formData.append("order", form.order);
      formData.append("is_active", form.is_active);
      if (iconFile) {
        formData.append("icon", iconFile);
      }

      if (isEdit) {
        await generalCategoriesAPI.update(categoryId, formData);
      } else {
        await generalCategoriesAPI.create(formData);
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

        {/* ✅ حقل الأيقونة */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700 text-right">
            الأيقونة
          </label>
          <div className="flex items-center gap-4">
            {/* Preview */}
            {iconPreview ? (
              <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-200 flex-shrink-0">
                <img
                  src={iconPreview}
                  alt="icon preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveIcon}
                  className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div className="w-16 h-16 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center flex-shrink-0">
                <FolderOpen className="w-6 h-6 text-gray-400" />
              </div>
            )}

            {/* Upload Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gray-50"
            >
              <Upload className="w-4 h-4" />
              {iconPreview ? "تغيير الأيقونة" : "رفع أيقونة"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleIconChange}
              className="hidden"
            />
          </div>
        </div>

        {/* باقي الحقول زي ما هي */}
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
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <span className="text-sm font-medium text-gray-700">نشط</span>
            <button
              type="button"
              onClick={() => setForm({ ...form, is_active: !form.is_active })}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                form.is_active ? "bg-emerald-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                  form.is_active ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
          </div>
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
