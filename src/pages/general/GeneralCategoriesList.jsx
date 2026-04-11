// src/pages/general/GeneralCategoriesList.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  FolderOpen,
  Pencil,
  Trash2,
  ChevronRight,
  Loader2,
  Search,
  BookOpen,
} from "lucide-react";
import { generalCategoriesAPI } from "../../services/generalService";

export default function GeneralCategoriesList() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteModal, setDeleteModal] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await generalCategoriesAPI.getAll();
      setCategories(data.categories || []);
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
      await generalCategoriesAPI.delete(deleteModal.id);
      setCategories((prev) => prev.filter((c) => c.id !== deleteModal.id));
      setDeleteModal(null);
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

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
          <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
            <FolderOpen className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">الكاتيجوريز</h1>
            <p className="text-sm text-gray-500">
              {categories.length} كاتيجوري
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate("/dashboard/general/categories/create")}
          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl hover:bg-emerald-700 transition-colors font-medium"
        >
          <Plus className="w-4 h-4" />
          إضافة كاتيجوري
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="ابحث عن كاتيجوري..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pr-10 pl-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-right"
        />
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>لا توجد كاتيجوريز</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md transition-all duration-200 hover:border-emerald-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      navigate(`/dashboard/general/categories/${cat.id}/edit`)
                    }
                    className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteModal(cat)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <FolderOpen className="w-5 h-5 text-emerald-700" />
                </div>
              </div>

              <h3 className="font-bold text-gray-900 text-right mb-1">
                {cat.name}
              </h3>
              {cat.description && (
                <p className="text-sm text-gray-500 text-right mb-3 line-clamp-2">
                  {cat.description}
                </p>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <button
                  onClick={() =>
                    navigate(`/dashboard/general/categories/${cat.id}/skills`)
                  }
                  className="flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                >
                  <ChevronRight className="w-4 h-4" />
                  عرض المهارات
                </button>
                <div className="text-right">
                  <span className="text-xs text-gray-400">
                    {cat.skills_count || 0} مهارة
                  </span>
                  <span className="mx-2 text-gray-200">|</span>
                  <span className="text-xs text-gray-400">
                    {cat.total_questions || 0} سؤال
                  </span>
                </div>
              </div>
            </div>
          ))}
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
              حذف الكاتيجوري
            </h3>
            <p className="text-gray-500 text-center text-sm mb-6">
              هل أنت متأكد من حذف{" "}
              <span className="font-semibold text-gray-700">
                "{deleteModal.name}"
              </span>
              ؟ سيتم حذف كل المهارات والأسئلة المرتبطة بها.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal(null)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 font-medium"
              >
                إلغاء
              </button>
              <button
                onClick={handleDelete}
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
