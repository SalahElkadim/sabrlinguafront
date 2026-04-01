// src/pages/LevelDetails.jsx
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Edit,
  Trash2,
  Plus,
  BookOpen,
  FileText,
  Database,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
  ChevronRight,
  Headphones,
  Mic,
  PenTool,
  TrendingUp,
} from "lucide-react";
import { useLevelsStore } from "../store/levelsStore";
import { levelQuestionBanksAPI } from "../services/levelsService";

export default function LevelDetails() {
  const { levelId } = useParams();
  const navigate = useNavigate();
  const { currentLevel, fetchLevelById, deleteLevel, loading, error } =
    useLevelsStore();
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Question Bank State
  const [questionBank, setQuestionBank] = useState(null);
  const [bankStatistics, setBankStatistics] = useState(null);
  const [loadingBank, setLoadingBank] = useState(false);

  useEffect(() => {
    fetchLevelById(levelId);
  }, [levelId]);

  useEffect(() => {
    if (activeTab === "questions" && currentLevel) {
      fetchQuestionBank();
    }
  }, [activeTab, currentLevel]);

  const fetchQuestionBank = async () => {
    setLoadingBank(true);
    try {
      // Get all question banks filtered by this level
      const banksResponse = await levelQuestionBanksAPI.getAll(null, levelId);

      if (banksResponse.banks && banksResponse.banks.length > 0) {
        const bank = banksResponse.banks[0]; // First bank for this level
        setQuestionBank(bank);

        // Get statistics
        const statsResponse = await levelQuestionBanksAPI.getStatistics(
          bank.id
        );
        setBankStatistics(statsResponse);
      }
    } catch (err) {
      console.error("Error fetching question bank:", err);
    } finally {
      setLoadingBank(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteLevel(levelId);
      navigate("/dashboard/levels");
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  if (loading && !currentLevel) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (error && !currentLevel) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">حدث خطأ</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link to="/dashboard/levels" className="btn btn-primary">
            العودة للقائمة
          </Link>
        </div>
      </div>
    );
  }

  if (!currentLevel) return null;

  const levelColors = {
    A1: "bg-green-100 text-green-700 border-green-300",
    A2: "bg-blue-100 text-blue-700 border-blue-300",
    B1: "bg-purple-100 text-purple-700 border-purple-300",
    B2: "bg-orange-100 text-orange-700 border-orange-300",
  };

  const tabs = [
    { id: "overview", name: "نظرة عامة", icon: FileText },
    { id: "units", name: "الوحدات", icon: BookOpen },
    { id: "questions", name: "بنك الأسئلة", icon: Database },
  ];

  const questionTypes = [
    {
      id: "vocabulary",
      name: "المفردات",
      icon: BookOpen,
      color: "blue",
      path: "vocabulary",
    },
    {
      id: "grammar",
      name: "القواعد",
      icon: FileText,
      color: "green",
      path: "grammar",
    },
    {
      id: "reading",
      name: "القراءة",
      icon: BookOpen,
      color: "purple",
      path: "reading",
    },
    {
      id: "listening",
      name: "الاستماع",
      icon: Headphones,
      color: "orange",
      path: "listening",
    },
    {
      id: "speaking",
      name: "التحدث",
      icon: Mic,
      color: "pink",
      path: "speaking",
    },
    {
      id: "writing",
      name: "الكتابة",
      icon: PenTool,
      color: "indigo",
      path: "writing",
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: "bg-blue-50 border-blue-200 text-blue-700",
      green: "bg-green-50 border-green-200 text-green-700",
      purple: "bg-purple-50 border-purple-200 text-purple-700",
      orange: "bg-orange-50 border-orange-200 text-orange-700",
      pink: "bg-pink-50 border-pink-200 text-pink-700",
      indigo: "bg-indigo-50 border-indigo-200 text-indigo-700",
    };
    return colors[color] || colors.blue;
  };

  const getIconBgColor = (color) => {
    const colors = {
      blue: "bg-blue-600",
      green: "bg-green-600",
      purple: "bg-purple-600",
      orange: "bg-orange-600",
      pink: "bg-pink-600",
      indigo: "bg-indigo-600",
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/dashboard/levels"
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowRight className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-lg font-bold border-2 ${
                  levelColors[currentLevel.code]
                }`}
              >
                {currentLevel.code}
              </span>
              <h1 className="text-2xl font-bold text-gray-900">
                {currentLevel.title}
              </h1>
            </div>
            <p className="text-gray-600">
              المستوى التعليمي - الترتيب: {currentLevel.order}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to={`/dashboard/levels/${levelId}/edit`}
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
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">الوحدات</p>
              <p className="text-2xl font-bold text-gray-900">
                {currentLevel.units_count || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-green-50 to-green-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">الدروس</p>
              <p className="text-2xl font-bold text-gray-900">
                {currentLevel.total_lessons || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-purple-50 to-purple-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
              <Database className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">بنك الأسئلة</p>
              <p className="text-2xl font-bold text-gray-900">
                {questionBank ? "متوفر" : "جاري التحميل..."}
              </p>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-orange-50 to-orange-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center">
              {currentLevel.is_active ? (
                <CheckCircle className="w-6 h-6 text-white" />
              ) : (
                <XCircle className="w-6 h-6 text-white" />
              )}
            </div>
            <div>
              <p className="text-sm text-gray-600">الحالة</p>
              <p className="text-xl font-bold text-gray-900">
                {currentLevel.is_active ? "نشط" : "غير نشط"}
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
            <div>
              <h3 className="font-bold text-gray-900 mb-2">الوصف</h3>
              <p className="text-gray-600">
                {currentLevel.description || "لا يوجد وصف"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">كود المستوى</p>
                <p className="text-xl font-bold text-gray-900">
                  {currentLevel.code}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">الترتيب</p>
                <p className="text-xl font-bold text-gray-900">
                  {currentLevel.order}
                </p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-bold text-blue-900 mb-2">إحصائيات المستوى</h4>
              <div className="space-y-2 text-sm text-blue-800">
                <p>• عدد الوحدات: {currentLevel.units_count || 0}</p>
                <p>• عدد الدروس: {currentLevel.total_lessons || 0}</p>
                <p>
                  • بنك الأسئلة:{" "}
                  {questionBank ? "متوفر ✓" : "تم إنشاؤه تلقائياً ✓"}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "units" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">الوحدات</h3>
              <Link
                to={`/dashboard/units/create?level_id=${levelId}`}
                className="btn btn-primary btn-sm"
              >
                <Plus className="w-4 h-4 ml-2" />
                إضافة وحدة
              </Link>
            </div>

            {currentLevel.units && currentLevel.units.length > 0 ? (
              <div className="space-y-3">
                {currentLevel.units.map((unit) => (
                  <Link
                    key={unit.id}
                    to={`/dashboard/units/${unit.id}`}
                    className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <BookOpen className="w-5 h-5 text-gray-400" />
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {unit.title}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {unit.lessons_count || 0} دروس
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 mb-4">لا توجد وحدات بعد</p>
                <Link
                  to={`/dashboard/units/create?level_id=${levelId}`}
                  className="btn btn-primary btn-sm"
                >
                  <Plus className="w-4 h-4 ml-2" />
                  إضافة أول وحدة
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === "questions" && (
          <div className="space-y-6">
            {loadingBank ? (
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-3" />
                <p className="text-gray-600">جاري تحميل بنك الأسئلة...</p>
              </div>
            ) : questionBank && bankStatistics ? (
              <>
                {/* Readiness Status */}
                <div
                  className={`card ${
                    bankStatistics.is_ready_for_exam
                      ? "bg-green-50 border-green-200"
                      : "bg-yellow-50 border-yellow-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {bankStatistics.is_ready_for_exam ? (
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    ) : (
                      <AlertCircle className="w-8 h-8 text-yellow-600" />
                    )}
                    <div className="flex-1">
                      <h3
                        className={`font-bold mb-1 ${
                          bankStatistics.is_ready_for_exam
                            ? "text-green-900"
                            : "text-yellow-900"
                        }`}
                      >
                        {bankStatistics.is_ready_for_exam
                          ? "✓ البنك جاهز لامتحان المستوى"
                          : "⚠ البنك غير جاهز بعد"}
                      </h3>
                      <p
                        className={`text-sm ${
                          bankStatistics.is_ready_for_exam
                            ? "text-green-700"
                            : "text-yellow-700"
                        }`}
                      >
                        {bankStatistics.is_ready_for_exam
                          ? "البنك يحتوي على العدد المطلوب من الأسئلة لإنشاء امتحان المستوى"
                          : "يجب إضافة المزيد من الأسئلة للوصول للعدد المطلوب"}
                      </p>
                    </div>
                    {!bankStatistics.is_ready_for_exam && (
                      <div className="text-left">
                        <p className="text-sm font-medium text-yellow-900">
                          التقدم
                        </p>
                        <p className="text-2xl font-bold text-yellow-700">
                          {Math.round(
                            (Object.values(
                              bankStatistics.questions || {}
                            ).reduce((a, b) => a + b, 0) /
                              Object.values(
                                bankStatistics.required_for_exam || {}
                              ).reduce((a, b) => a + b, 0)) *
                              100
                          )}
                          %
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="card bg-gradient-to-br from-blue-50 to-blue-100">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                        <Database className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">إجمالي الأسئلة</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {bankStatistics.questions?.total || 0}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="card bg-gradient-to-br from-green-50 to-green-100">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">أقسام جاهزة</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {
                            Object.values(
                              bankStatistics.ready_status || {}
                            ).filter(Boolean).length
                          }{" "}
                          / 6
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="card bg-gradient-to-br from-purple-50 to-purple-100">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">مطلوب للامتحان</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {Object.values(
                            bankStatistics.required_for_exam || {}
                          ).reduce((a, b) => a + b, 0)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="card bg-gradient-to-br from-orange-50 to-orange-100">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center">
                        {bankStatistics.is_ready_for_exam ? (
                          <CheckCircle className="w-6 h-6 text-white" />
                        ) : (
                          <XCircle className="w-6 h-6 text-white" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">الحالة</p>
                        <p className="text-lg font-bold text-gray-900">
                          {bankStatistics.is_ready_for_exam
                            ? "جاهز"
                            : "غير جاهز"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Question Types Grid */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    أنواع الأسئلة
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {questionTypes.map((type) => {
                      const Icon = type.icon;
                      const current = bankStatistics.questions?.[type.id] || 0;
                      const required =
                        bankStatistics.required_for_exam?.[type.id] || 0;
                      const isComplete =
                        bankStatistics.ready_status?.[type.id] || false;
                      const percentage =
                        required > 0
                          ? Math.round((current / required) * 100)
                          : 0;

                      return (
                        <div
                          key={type.id}
                          className={`card border-2 ${getColorClasses(
                            type.color
                          )}`}
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-12 h-12 ${getIconBgColor(
                                  type.color
                                )} rounded-xl flex items-center justify-center`}
                              >
                                <Icon className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <h4 className="font-bold text-gray-900">
                                  {type.name}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {current} / {required}
                                </p>
                              </div>
                            </div>
                            {isComplete ? (
                              <CheckCircle className="w-6 h-6 text-green-600" />
                            ) : (
                              <XCircle className="w-6 h-6 text-gray-400" />
                            )}
                          </div>

                          {/* Progress Bar */}
                          <div className="mb-4">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-600">التقدم</span>
                              <span className="font-bold text-gray-900">
                                {percentage}%
                              </span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${getIconBgColor(
                                  type.color
                                )} transition-all duration-300`}
                                style={{
                                  width: `${Math.min(percentage, 100)}%`,
                                }}
                              />
                            </div>
                          </div>

                          {/* Add Button */}
                          <Link
                            to={`/dashboard/level-question-banks/${questionBank.id}/add/${type.path}`}
                            className={`btn btn-sm w-full ${
                              isComplete
                                ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                : getIconBgColor(type.color) + " text-white"
                            }`}
                          >
                            <Plus className="w-4 h-4 ml-2" />
                            إضافة سؤال {type.name}
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Requirements Info */}
                <div className="card bg-blue-50 border border-blue-200">
                  <h3 className="font-bold text-blue-900 mb-3">
                    متطلبات امتحان المستوى ({currentLevel.code})
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                    {questionTypes.map((type) => {
                      const required =
                        bankStatistics.required_for_exam?.[type.id] || 0;
                      const current = bankStatistics.questions?.[type.id] || 0;
                      const missing = Math.max(0, required - current);

                      return (
                        <div key={type.id} className="bg-white rounded-lg p-3">
                          <p className="text-gray-600 mb-1">{type.name}</p>
                          <p className="font-bold text-gray-900">
                            {current} / {required}
                            {missing > 0 && (
                              <span className="text-red-600 text-xs mr-2">
                                (ناقص {missing})
                              </span>
                            )}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Database className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">
                  بنك الأسئلة تم إنشاؤه تلقائياً مع المستوى
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  يمكنك البدء في إضافة الأسئلة الآن
                </p>
                <button onClick={fetchQuestionBank} className="btn btn-primary">
                  <Database className="w-4 h-4 ml-2" />
                  تحميل بنك الأسئلة
                </button>
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
              سيتم حذف المستوى "{currentLevel.title}" وجميع الوحدات والدروس
              والأسئلة المرتبطة به. هذا الإجراء لا يمكن التراجع عنه.
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
