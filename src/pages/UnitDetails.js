// src/pages/UnitDetails.jsx - UPDATED WITH QUESTION BANK BUTTON
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Edit,
  Trash2,
  Plus,
  FileText,
  Database,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
  ChevronRight,
  BookOpen,
  Headphones,
  Mic,
  PenTool,
  FileEdit,
} from "lucide-react";
import { useLevelsStore } from "../store/levelsStore";
import { levelQuestionBanksAPI } from "../services/levelsService";

export default function UnitDetails() {
  const { unitId } = useParams();
  const navigate = useNavigate();
  const { currentUnit, fetchUnitById, deleteUnit, loading, error } =
    useLevelsStore();
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [questionBank, setQuestionBank] = useState(null);
  const [loadingBank, setLoadingBank] = useState(false);
  const [bankError, setBankError] = useState(null); // 🆕

  useEffect(() => {
    fetchUnitById(unitId);
  }, [unitId]);

  // 🆕 FIXED: Fetch Question Bank for this unit
  useEffect(() => {
    const fetchQuestionBank = async () => {
      if (!currentUnit || activeTab !== "questions") return;

      setLoadingBank(true);
      setBankError(null); // 🆕 Reset error
      try {
        console.log("🔍 Fetching question bank for unit:", unitId); // Debug log

        // ✅ CORRECT: Pass unitId as first parameter
        const response = await levelQuestionBanksAPI.getAll(unitId, null);

        console.log("📦 Response:", response); // Debug log

        // ✅ CORRECT: Check for banks array
        if (response && response.banks && response.banks.length > 0) {
          const unitBank = response.banks.find(
            (bank) => bank.unit === parseInt(unitId)
          );

          if (unitBank) {
            setQuestionBank(unitBank);
            console.log("✅ Found question bank:", unitBank);
          } else {
            console.warn("⚠️ No bank found for this unit");
            setBankError("لم يتم العثور على بنك الأسئلة لهذه الوحدة");
          }
        } else {
          console.warn("⚠️ No banks in response");
          setBankError("لا يوجد بنك أسئلة لهذه الوحدة");
        }
      } catch (error) {
        console.error("❌ Error fetching question bank:", error);
        setBankError(error.response?.data?.error || "فشل تحميل بنك الأسئلة");
      } finally {
        setLoadingBank(false);
      }
    };

    fetchQuestionBank();
  }, [currentUnit, unitId, activeTab]);

  const handleDelete = async () => {
    try {
      await deleteUnit(unitId);
      navigate("/dashboard/units");
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  if (loading && !currentUnit) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (error && !currentUnit) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">حدث خطأ</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link to="/dashboard/units" className="btn btn-primary">
            العودة للقائمة
          </Link>
        </div>
      </div>
    );
  }

  if (!currentUnit) return null;

  const levelColors = {
    A1: "bg-green-100 text-green-700",
    A2: "bg-blue-100 text-blue-700",
    B1: "bg-purple-100 text-purple-700",
    B2: "bg-orange-100 text-orange-700",
  };

  const lessonTypeIcons = {
    READING: BookOpen,
    LISTENING: Headphones,
    SPEAKING: Mic,
    WRITING: PenTool,
  };

  const lessonTypeColors = {
    READING: "bg-blue-100 text-blue-700",
    LISTENING: "bg-purple-100 text-purple-700",
    SPEAKING: "bg-green-100 text-green-700",
    WRITING: "bg-orange-100 text-orange-700",
  };

  const tabs = [
    { id: "overview", name: "نظرة عامة", icon: FileText },
    { id: "lessons", name: "الدروس", icon: FileEdit },
    { id: "questions", name: "بنك الأسئلة", icon: Database },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/dashboard/units"
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowRight className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-1">
              {currentUnit.level_details && (
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-lg font-bold ${
                    levelColors[currentUnit.level_details.code]
                  }`}
                >
                  {currentUnit.level_details.code}
                </span>
              )}
              <h1 className="text-2xl font-bold text-gray-900">
                {currentUnit.title}
              </h1>
            </div>
            <p className="text-gray-600">
              الوحدة الدراسية - الترتيب: {currentUnit.order}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to={`/dashboard/units/${unitId}/edit`}
            className="btn btn-secondary"
          >
            <Edit className="w-4 h-4 ml-2" />
            تعديل
          </Link>
          <button
            onClick={() => setDeleteConfirm(true)}
            className="btn bg-red-600 hover:bg-red-700 text-white"
          >
            <Trash2 className="w-4 h-4 ml-2" />
            حذف
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">الدروس</p>
              <p className="text-2xl font-bold text-gray-900">
                {currentUnit.lessons_count || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-green-50 to-green-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
              <Database className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">بنك الأسئلة</p>
              <p className="text-xl font-bold text-gray-900">
                {currentUnit.has_question_bank ? "متوفر" : "غير متوفر"}
              </p>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-purple-50 to-purple-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
              <FileEdit className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">امتحان الوحدة</p>
              <p className="text-xl font-bold text-gray-900">
                {currentUnit.has_exam ? "متوفر" : "غير متوفر"}
              </p>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-orange-50 to-orange-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center">
              {currentUnit.is_active ? (
                <CheckCircle className="w-6 h-6 text-white" />
              ) : (
                <XCircle className="w-6 h-6 text-white" />
              )}
            </div>
            <div>
              <p className="text-sm text-gray-600">الحالة</p>
              <p className="text-xl font-bold text-gray-900">
                {currentUnit.is_active ? "نشط" : "غير نشط"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex gap-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 pb-4 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-primary-600 text-primary-700 font-medium"
                      : "border-transparent text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Level Info */}
            {currentUnit.level_details && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  المستوى التعليمي
                </h3>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-lg font-bold ${
                      levelColors[currentUnit.level_details.code]
                    }`}
                  >
                    {currentUnit.level_details.code}
                  </span>
                  <span className="text-gray-700">
                    {currentUnit.level_details.title}
                  </span>
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <h3 className="font-bold text-gray-900 mb-2">الوصف</h3>
              <p className="text-gray-600">
                {currentUnit.description || "لا يوجد وصف"}
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">الترتيب</p>
                <p className="text-xl font-bold text-gray-900">
                  {currentUnit.order}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">عدد الدروس</p>
                <p className="text-xl font-bold text-gray-900">
                  {currentUnit.lessons_count || 0}
                </p>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-bold text-blue-900 mb-2">إحصائيات الوحدة</h4>
              <div className="space-y-2 text-sm text-blue-800">
                <p>• عدد الدروس: {currentUnit.lessons_count || 0}</p>
                <p>
                  • بنك الأسئلة:{" "}
                  {currentUnit.has_question_bank ? "متوفر ✓" : "غير متوفر ✗"}
                </p>
                <p>
                  • امتحان الوحدة:{" "}
                  {currentUnit.has_exam ? "متوفر ✓" : "غير متوفر ✗"}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "lessons" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">الدروس</h3>
              <Link
                to={`/dashboard/lessons/create?unit_id=${unitId}`}
                className="btn btn-primary btn-sm"
              >
                <Plus className="w-4 h-4 ml-2" />
                إضافة درس
              </Link>
            </div>

            {currentUnit.lessons && currentUnit.lessons.length > 0 ? (
              <div className="space-y-3">
                {currentUnit.lessons.map((lesson) => {
                  const LessonIcon =
                    lessonTypeIcons[lesson.lesson_type] || FileText;
                  return (
                    <Link
                      key={lesson.id}
                      to={`/dashboard/lessons/${lesson.id}`}
                      className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              lessonTypeColors[lesson.lesson_type]
                            }`}
                          >
                            <LessonIcon className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {lesson.title}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {lesson.lesson_type === "READING" && "درس قراءة"}
                              {lesson.lesson_type === "LISTENING" &&
                                "درس استماع"}
                              {lesson.lesson_type === "SPEAKING" && "درس تحدث"}
                              {lesson.lesson_type === "WRITING" && "درس كتابة"}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <FileEdit className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 mb-4">لا توجد دروس بعد</p>
                <Link
                  to={`/dashboard/lessons/create?unit_id=${unitId}`}
                  className="btn btn-primary btn-sm"
                >
                  <Plus className="w-4 h-4 ml-2" />
                  إضافة أول درس
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === "questions" && (
          <div className="space-y-4">
            {loadingBank ? (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto" />
              </div>
            ) : questionBank ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-900">بنك أسئلة الوحدة</h3>
                  <Link
                    to={`/dashboard/level-question-banks/${questionBank.id}`}
                    className="btn btn-primary"
                  >
                    <Database className="w-4 h-4 ml-2" />
                    إدارة بنك الأسئلة
                  </Link>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">إجمالي الأسئلة</p>
                    <p className="text-lg font-bold text-gray-900">
                      {questionBank.total_questions || 0}
                    </p>
                  </div>
                </div>

                {/* Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>ملاحظة:</strong> تم إنشاء بنك الأسئلة تلقائياً عند
                    إنشاء الوحدة. يمكنك إضافة أسئلة من خلال صفحة إدارة البنك.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Database className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 mb-4">
                  بنك الأسئلة تم إنشاؤه تلقائياً
                </p>
                <p className="text-sm text-gray-500">جاري تحميل البيانات...</p>
              </div>
            )}
          </div>
        )}
      </div>

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
              سيتم حذف الوحدة "{currentUnit.title}" وجميع الدروس والأسئلة
              المرتبطة بها. هذا الإجراء لا يمكن التراجع عنه.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 btn bg-red-600 hover:bg-red-700 text-white"
              >
                {loading ? "جاري الحذف..." : "تأكيد الحذف"}
              </button>
              <button
                onClick={() => setDeleteConfirm(false)}
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
