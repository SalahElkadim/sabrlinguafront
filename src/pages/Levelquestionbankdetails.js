// src/pages/LevelQuestionBankDetails.jsx
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Database,
  Plus,
  Loader2,
  AlertCircle,
  BookOpen,
  FileText,
  Headphones,
  Mic,
  PenTool,
  CheckCircle,
  XCircle,
  TrendingUp,
} from "lucide-react";
import { levelQuestionBanksAPI } from "../services/levelsService";

export default function LevelQuestionBankDetails() {
  const { bankId } = useParams();
  const navigate = useNavigate();
  const [bank, setBank] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBankDetails();
  }, [bankId]);

  const fetchBankDetails = async () => {
    setLoading(true);
    try {
      const [bankResponse, statsResponse] = await Promise.all([
        levelQuestionBanksAPI.getById(bankId),
        levelQuestionBanksAPI.getStatistics(bankId),
      ]);
      setBank(bankResponse);
      setStatistics(statsResponse);
    } catch (err) {
      setError(err.response?.data?.error || "فشل تحميل البيانات");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (error || !bank) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">حدث خطأ</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            to="/dashboard/level-question-banks"
            className="btn btn-primary"
          >
            العودة للقائمة
          </Link>
        </div>
      </div>
    );
  }

  const levelColors = {
    A1: "bg-green-100 text-green-700",
    A2: "bg-blue-100 text-blue-700",
    B1: "bg-purple-100 text-purple-700",
    B2: "bg-orange-100 text-orange-700",
  };

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

  // Determine bank type and requirements
  const isUnitBank = !!bank.unit;
  const isLevelBank = !!bank.level;

  const requiredQuestions = statistics?.required_for_exam || {};
  const currentQuestions = statistics?.questions || {};
  const readyStatus = statistics?.ready_status || {};
  const isReady = statistics?.is_ready_for_exam || false;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/dashboard/level-question-banks"
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowRight className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-gray-900">{bank.title}</h1>
              {bank.level_details && (
                <span
                  className={`px-3 py-1 rounded-lg font-bold ${
                    levelColors[bank.level_details.code]
                  }`}
                >
                  {bank.level_details.code}
                </span>
              )}
              <span
                className={`px-3 py-1 rounded-lg text-sm ${
                  isUnitBank
                    ? "bg-blue-100 text-blue-700"
                    : "bg-purple-100 text-purple-700"
                }`}
              >
                {isUnitBank ? "بنك وحدة" : "بنك مستوى"}
              </span>
            </div>
            <p className="text-gray-600">
              {bank.unit_details?.title || bank.level_details?.title}
            </p>
          </div>
        </div>
      </div>

      {/* Readiness Status */}
      <div
        className={`card ${
          isReady
            ? "bg-green-50 border-green-200"
            : "bg-yellow-50 border-yellow-200"
        }`}
      >
        <div className="flex items-center gap-3">
          {isReady ? (
            <CheckCircle className="w-8 h-8 text-green-600" />
          ) : (
            <AlertCircle className="w-8 h-8 text-yellow-600" />
          )}
          <div className="flex-1">
            <h3
              className={`font-bold mb-1 ${
                isReady ? "text-green-900" : "text-yellow-900"
              }`}
            >
              {isReady ? "✓ البنك جاهز للامتحان" : "⚠ البنك غير جاهز بعد"}
            </h3>
            <p
              className={`text-sm ${
                isReady ? "text-green-700" : "text-yellow-700"
              }`}
            >
              {isReady
                ? `البنك يحتوي على العدد المطلوب من الأسئلة لإنشاء ${
                    isUnitBank ? "امتحان الوحدة" : "امتحان المستوى"
                  }`
                : `يجب إضافة المزيد من الأسئلة للوصول للعدد المطلوب`}
            </p>
          </div>
          {!isReady && (
            <div className="text-left">
              <p className="text-sm font-medium text-yellow-900">التقدم</p>
              <p className="text-2xl font-bold text-yellow-700">
                {Math.round(
                  (Object.values(currentQuestions).reduce((a, b) => a + b, 0) /
                    Object.values(requiredQuestions).reduce(
                      (a, b) => a + b,
                      0
                    )) *
                    100
                )}
                %
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <Database className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">إجمالي الأسئلة</p>
              <p className="text-2xl font-bold text-gray-900">
                {currentQuestions.total || 0}
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
                {Object.values(readyStatus).filter(Boolean).length} / 6
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
                {Object.values(requiredQuestions).reduce((a, b) => a + b, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-orange-50 to-orange-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center">
              {isReady ? (
                <CheckCircle className="w-6 h-6 text-white" />
              ) : (
                <XCircle className="w-6 h-6 text-white" />
              )}
            </div>
            <div>
              <p className="text-sm text-gray-600">الحالة</p>
              <p className="text-lg font-bold text-gray-900">
                {isReady ? "جاهز" : "غير جاهز"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Question Types Grid */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">أنواع الأسئلة</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {questionTypes.map((type) => {
            const Icon = type.icon;
            const current = currentQuestions[type.id] || 0;
            const required = requiredQuestions[type.id] || 0;
            const isComplete = readyStatus[type.id] || false;
            const percentage =
              required > 0 ? Math.round((current / required) * 100) : 0;

            return (
              <div
                key={type.id}
                className={`card border-2 ${getColorClasses(type.color)}`}
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
                      <h3 className="font-bold text-gray-900">{type.name}</h3>
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
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Add Button */}
                <Link
                  to={`/dashboard/level-question-banks/${bankId}/add/${type.path}`}
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
          متطلبات {isUnitBank ? "امتحان الوحدة" : "امتحان المستوى"}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
          {questionTypes.map((type) => {
            const required = requiredQuestions[type.id] || 0;
            const current = currentQuestions[type.id] || 0;
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

      {/* Description */}
      {bank.description && (
        <div className="card">
          <h3 className="font-bold text-gray-900 mb-2">الوصف</h3>
          <p className="text-gray-600">{bank.description}</p>
        </div>
      )}
    </div>
  );
}
