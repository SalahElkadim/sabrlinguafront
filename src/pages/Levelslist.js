// src/pages/LevelsList.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Layers,
  BookOpen,
  FileText,
  AlertCircle,
  Loader2,
  Search,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";
import { useLevelsStore } from "../store/levelsStore";

export default function LevelsList() {
  const { levels, loading, error, fetchLevels, deleteLevel } = useLevelsStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchLevels();
  }, []);

  const handleDelete = async (levelId) => {
    try {
      await deleteLevel(levelId);
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const filteredLevels = levels.filter(
    (level) =>
      level.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      level.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && levels.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            المستويات التعليمية
          </h1>
          <p className="text-gray-600 mt-1">إدارة المستويات والوحدات والدروس</p>
        </div>
        <Link to="/dashboard/levels/create" className="btn btn-primary">
          <Plus className="w-5 h-5 ml-2" />
          إضافة مستوى جديد
        </Link>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Search */}
      <div className="card">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="ابحث عن مستوى..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pr-10"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <Layers className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">إجمالي المستويات</p>
              <p className="text-2xl font-bold text-gray-900">
                {levels.length}
              </p>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-green-50 to-green-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">إجمالي الوحدات</p>
              <p className="text-2xl font-bold text-gray-900">
                {levels.reduce(
                  (acc, level) => acc + (level.units_count || 0),
                  0
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-purple-50 to-purple-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">إجمالي الدروس</p>
              <p className="text-2xl font-bold text-gray-900">
                {levels.reduce(
                  (acc, level) => acc + (level.total_lessons || 0),
                  0
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Levels List */}
      {filteredLevels.length === 0 ? (
        <div className="card text-center py-12">
          <Layers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? "لا توجد نتائج" : "لا توجد مستويات بعد"}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm
              ? "جرب البحث بكلمات أخرى"
              : "ابدأ بإنشاء أول مستوى تعليمي"}
          </p>
          {!searchTerm && (
            <Link to="/dashboard/levels/create" className="btn btn-primary">
              <Plus className="w-5 h-5 ml-2" />
              إنشاء مستوى جديد
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredLevels.map((level) => (
            <div
              key={level.id}
              className="card hover:shadow-lg transition-shadow"
            >
              {/* Level Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      level.code === "A1"
                        ? "bg-green-100 text-green-700"
                        : level.code === "A2"
                        ? "bg-blue-100 text-blue-700"
                        : level.code === "B1"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    <span className="text-lg font-bold">{level.code}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{level.title}</h3>
                    <p className="text-sm text-gray-500">
                      الترتيب: {level.order}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    to={`/dashboard/levels/${level.id}`}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                    title="عرض التفاصيل"
                  >
                    <Eye className="w-4 h-4 text-gray-600" />
                  </Link>
                  <Link
                    to={`/dashboard/levels/${level.id}/edit`}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                    title="تعديل"
                  >
                    <Edit className="w-4 h-4 text-gray-600" />
                  </Link>
                  <button
                    onClick={() => setDeleteConfirm(level.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 transition-colors"
                    title="حذف"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>

              {/* Description */}
              {level.description && (
                <p className="text-gray-600 text-sm mb-4">
                  {level.description}
                </p>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">الوحدات</p>
                  <p className="text-lg font-bold text-gray-900">
                    {level.units_count || 0}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">الدروس</p>
                  <p className="text-lg font-bold text-gray-900">
                    {level.total_lessons || 0}
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    level.is_active
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {level.is_active ? "نشط" : "غير نشط"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">تأكيد الحذف</h3>
                <p className="text-sm text-gray-600">هل أنت متأكد؟</p>
              </div>
            </div>
            <p className="text-gray-600 mb-6">
              سيتم حذف المستوى وجميع الوحدات والدروس المرتبطة به. هذا الإجراء لا
              يمكن التراجع عنه.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={loading}
                className="flex-1 btn bg-red-600 hover:bg-red-700 text-white"
              >
                {loading ? "جاري الحذف..." : "تأكيد الحذف"}
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={loading}
                className="flex-1 btn btn-secondary"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
