// src/pages/LessonsList.jsx
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Plus,
  FileEdit,
  AlertCircle,
  Loader2,
  Search,
  Edit,
  Trash2,
  Eye,
  Filter,
  X,
  BookOpen,
  Headphones,
  Mic,
  PenTool,
} from "lucide-react";
import { useLevelsStore } from "../store/levelsStore";

export default function LessonsList() {
  const {
    lessons,
    units,
    loading,
    error,
    fetchLessons,
    fetchUnits,
    deleteLesson,
  } = useLevelsStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUnit, setSelectedUnit] = useState(
    searchParams.get("unit_id") || ""
  );
  const [selectedType, setSelectedType] = useState(
    searchParams.get("lesson_type") || ""
  );
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchUnits();
  }, []);

  useEffect(() => {
    fetchLessons(selectedUnit || null, selectedType || null);
  }, [selectedUnit, selectedType]);

  const handleDelete = async (lessonId) => {
    try {
      await deleteLesson(lessonId);
      setDeleteConfirm(null);
      fetchLessons(selectedUnit || null, selectedType || null);
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleUnitFilter = (unitId) => {
    setSelectedUnit(unitId);
    const params = {};
    if (unitId) params.unit_id = unitId;
    if (selectedType) params.lesson_type = selectedType;
    setSearchParams(params);
  };

  const handleTypeFilter = (type) => {
    setSelectedType(type);
    const params = {};
    if (selectedUnit) params.unit_id = selectedUnit;
    if (type) params.lesson_type = type;
    setSearchParams(params);
  };

  const filteredLessons = lessons.filter((lesson) =>
    lesson.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lessonTypes = [
    { value: "READING", label: "قراءة", icon: BookOpen, color: "blue" },
    { value: "LISTENING", label: "استماع", icon: Headphones, color: "purple" },
    { value: "SPEAKING", label: "تحدث", icon: Mic, color: "green" },
    { value: "WRITING", label: "كتابة", icon: PenTool, color: "orange" },
  ];

  const lessonTypeColors = {
    READING: "bg-blue-100 text-blue-700",
    LISTENING: "bg-purple-100 text-purple-700",
    SPEAKING: "bg-green-100 text-green-700",
    WRITING: "bg-orange-100 text-orange-700",
  };

  const lessonTypeIcons = {
    READING: BookOpen,
    LISTENING: Headphones,
    SPEAKING: Mic,
    WRITING: PenTool,
  };

  if (loading && lessons.length === 0 && units.length === 0) {
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
          <h1 className="text-2xl font-bold text-gray-900">الدروس التعليمية</h1>
          <p className="text-gray-600 mt-1">
            إدارة دروس القراءة والاستماع والتحدث والكتابة
          </p>
        </div>
        <Link to="/dashboard/lessons/create" className="btn btn-primary">
          <Plus className="w-5 h-5 ml-2" />
          إضافة درس جديد
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
              placeholder="ابحث عن درس..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pr-10"
            />
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Filter className="w-4 h-4 inline ml-1" />
              تصفية حسب النوع
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleTypeFilter("")}
                className={`px-4 py-2 rounded-lg border-2 transition-all ${
                  !selectedType
                    ? "border-primary-600 bg-primary-50 text-primary-700 font-medium"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                الكل
              </button>
              {lessonTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.value}
                    onClick={() => handleTypeFilter(type.value)}
                    className={`px-4 py-2 rounded-lg border-2 transition-all flex items-center gap-2 ${
                      selectedType === type.value
                        ? `bg-${type.color}-100 text-${type.color}-700 border-${type.color}-300 font-medium`
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {type.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Unit Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              تصفية حسب الوحدة
            </label>
            <select
              value={selectedUnit}
              onChange={(e) => handleUnitFilter(e.target.value)}
              className="input"
            >
              <option value="">جميع الوحدات</option>
              {units.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.title} ({unit.level_details?.code})
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters */}
          {(selectedUnit || selectedType) && (
            <button
              onClick={() => {
                handleUnitFilter("");
                handleTypeFilter("");
              }}
              className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              إلغاء جميع الفلاتر
            </button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {lessonTypes.map((type) => {
          const Icon = type.icon;
          const count = lessons.filter(
            (l) => l.lesson_type === type.value
          ).length;
          return (
            <div
              key={type.value}
              className={`card bg-gradient-to-br from-${type.color}-50 to-${type.color}-100`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 bg-${type.color}-600 rounded-xl flex items-center justify-center`}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{type.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lessons List */}
      {filteredLessons.length === 0 ? (
        <div className="card text-center py-12">
          <FileEdit className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm || selectedUnit || selectedType
              ? "لا توجد نتائج"
              : "لا توجد دروس بعد"}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || selectedUnit || selectedType
              ? "جرب البحث بكلمات أخرى أو تغيير الفلاتر"
              : "ابدأ بإنشاء أول درس"}
          </p>
          {!searchTerm && !selectedUnit && !selectedType && (
            <Link to="/dashboard/lessons/create" className="btn btn-primary">
              <Plus className="w-5 h-5 ml-2" />
              إنشاء درس جديد
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredLessons.map((lesson) => {
            const LessonIcon = lessonTypeIcons[lesson.lesson_type] || FileEdit;
            return (
              <div
                key={lesson.id}
                className="card hover:shadow-lg transition-shadow"
              >
                {/* Lesson Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        lessonTypeColors[lesson.lesson_type]
                      }`}
                    >
                      <LessonIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">
                        {lesson.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            lessonTypeColors[lesson.lesson_type]
                          }`}
                        >
                          {lesson.lesson_type === "READING" && "قراءة"}
                          {lesson.lesson_type === "LISTENING" && "استماع"}
                          {lesson.lesson_type === "SPEAKING" && "تحدث"}
                          {lesson.lesson_type === "WRITING" && "كتابة"}
                        </span>
                        <span className="text-xs text-gray-500">
                          الترتيب: {lesson.order}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/dashboard/lessons/${lesson.id}`}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                      title="عرض التفاصيل"
                    >
                      <Eye className="w-4 h-4 text-gray-600" />
                    </Link>
                    <Link
                      to={`/dashboard/lessons/${lesson.id}/edit`}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                      title="تعديل"
                    >
                      <Edit className="w-4 h-4 text-gray-600" />
                    </Link>
                    <button
                      onClick={() => setDeleteConfirm(lesson.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 transition-colors"
                      title="حذف"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>

                {/* Unit Info */}
                {lesson.unit_details && (
                  <div className="bg-gray-50 p-3 rounded-lg mb-4">
                    <p className="text-xs text-gray-500 mb-1">الوحدة</p>
                    <p className="text-sm font-medium text-gray-900">
                      {lesson.unit_details.title}
                    </p>
                  </div>
                )}

                {/* Content Status */}
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      lesson.has_content
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {lesson.has_content ? "المحتوى متوفر" : "بحاجة لمحتوى"}
                  </span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      lesson.is_active
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {lesson.is_active ? "نشط" : "غير نشط"}
                  </span>
                </div>
              </div>
            );
          })}
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
              سيتم حذف الدرس وجميع المحتوى المرتبط به. هذا الإجراء لا يمكن
              التراجع عنه.
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
