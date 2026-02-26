// src/pages/UnitsList.jsx
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Plus,
  BookOpen,
  FileText,
  AlertCircle,
  Loader2,
  Search,
  Edit,
  Trash2,
  Eye,
  Filter,
  X,
  Layers,
} from "lucide-react";
import { useLevelsStore } from "../store/levelsStore";

export default function UnitsList() {
  const { units, levels, loading, error, fetchUnits, fetchLevels, deleteUnit } =
    useLevelsStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState(
    searchParams.get("level_id") || ""
  );
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchLevels();
  }, []);

  useEffect(() => {
    fetchUnits(selectedLevel || null);
  }, [selectedLevel]);

  const handleDelete = async (unitId) => {
    try {
      await deleteUnit(unitId);
      setDeleteConfirm(null);
      fetchUnits(selectedLevel || null);
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleLevelFilter = (levelId) => {
    setSelectedLevel(levelId);
    if (levelId) {
      setSearchParams({ level_id: levelId });
    } else {
      setSearchParams({});
    }
  };

  const filteredUnits = units.filter((unit) =>
    unit.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedLevelData = levels.find(
    (level) => level.id === parseInt(selectedLevel)
  );

  if (loading && units.length === 0 && levels.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  const levelColors = {
    A1: "bg-green-100 text-green-700",
    A2: "bg-blue-100 text-blue-700",
    B1: "bg-purple-100 text-purple-700",
    B2: "bg-orange-100 text-orange-700",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">الوحدات الدراسية</h1>
          <p className="text-gray-600 mt-1">إدارة الوحدات التعليمية والدروس</p>
        </div>
        <Link to="/dashboard/units/create" className="btn btn-primary">
          <Plus className="w-5 h-5 ml-2" />
          إضافة وحدة جديدة
        </Link>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Filters */}
      <div className="card">
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="ابحث عن وحدة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pr-10"
            />
          </div>

          {/* Level Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Filter className="w-4 h-4 inline ml-1" />
              تصفية حسب المستوى
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleLevelFilter("")}
                className={`px-4 py-2 rounded-lg border-2 transition-all ${
                  !selectedLevel
                    ? "border-primary-600 bg-primary-50 text-primary-700 font-medium"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                الكل
              </button>
              {levels.map((level) => (
                <button
                  key={level.id}
                  onClick={() => handleLevelFilter(level.id.toString())}
                  className={`px-4 py-2 rounded-lg border-2 transition-all ${
                    selectedLevel === level.id.toString()
                      ? `${levelColors[level.code]} border-2 font-medium`
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {level.code}
                </button>
              ))}
            </div>
            {selectedLevel && (
              <button
                onClick={() => handleLevelFilter("")}
                className="mt-2 text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                إلغاء التصفية
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">إجمالي الوحدات</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredUnits.length}
              </p>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-green-50 to-green-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">إجمالي الدروس</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredUnits.reduce(
                  (acc, unit) => acc + (unit.lessons_count || 0),
                  0
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-purple-50 to-purple-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
              <Layers className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">
                {selectedLevelData
                  ? `مستوى ${selectedLevelData.code}`
                  : "جميع المستويات"}
              </p>
              <p className="text-lg font-bold text-gray-900">
                {selectedLevelData
                  ? selectedLevelData.title
                  : `${levels.length} مستوى`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Units List */}
      {filteredUnits.length === 0 ? (
        <div className="card text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm || selectedLevel
              ? "لا توجد نتائج"
              : "لا توجد وحدات بعد"}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || selectedLevel
              ? "جرب البحث بكلمات أخرى أو تغيير الفلتر"
              : "ابدأ بإنشاء أول وحدة دراسية"}
          </p>
          {!searchTerm && !selectedLevel && (
            <Link to="/dashboard/units/create" className="btn btn-primary">
              <Plus className="w-5 h-5 ml-2" />
              إنشاء وحدة جديدة
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredUnits.map((unit) => (
            <div
              key={unit.id}
              className="card hover:shadow-lg transition-shadow"
            >
              {/* Unit Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{unit.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      {unit.level_details && (
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            levelColors[unit.level_details.code]
                          }`}
                        >
                          {unit.level_details.code}
                        </span>
                      )}
                      <span className="text-xs text-gray-500">
                        الترتيب: {unit.order}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    to={`/dashboard/units/${unit.id}`}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                    title="عرض التفاصيل"
                  >
                    <Eye className="w-4 h-4 text-gray-600" />
                  </Link>
                  <Link
                    to={`/dashboard/units/${unit.id}/edit`}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                    title="تعديل"
                  >
                    <Edit className="w-4 h-4 text-gray-600" />
                  </Link>
                  <button
                    onClick={() => setDeleteConfirm(unit.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 transition-colors"
                    title="حذف"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>

              {/* Description */}
              {unit.description && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {unit.description}
                </p>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">الدروس</p>
                  <p className="text-lg font-bold text-gray-900">
                    {unit.lessons_count || 0}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">بنك الأسئلة</p>
                  <p className="text-sm font-bold text-gray-900">
                    {unit.has_question_bank ? "✓ متوفر" : "✗ غير متوفر"}
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    unit.is_active
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {unit.is_active ? "نشط" : "غير نشط"}
                </span>
                {unit.has_exam && (
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    يحتوي على امتحان
                  </span>
                )}
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
              سيتم حذف الوحدة وجميع الدروس والمحتوى المرتبط بها. هذا الإجراء لا
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
