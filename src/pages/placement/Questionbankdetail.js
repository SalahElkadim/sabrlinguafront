import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Plus,
  BookOpen,
  MessageSquare,
  FileText,
  Headphones,
  Video,
  PenTool,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Edit,
} from "lucide-react";
import { useQuestionBanksStore } from "../store/questionbanksstore";

export default function QuestionBankDetails() {
  const { bankId } = useParams();
  const navigate = useNavigate();
  const {
    currentBank,
    bankStatistics,
    fetchBank,
    fetchBankStatistics,
    loading,
  } = useQuestionBanksStore();
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchBank(bankId);
    fetchBankStatistics(bankId);
  }, [bankId]);

  const questionTypes = [
    {
      id: "vocabulary",
      name: "المفردات",
      icon: BookOpen,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-200",
      count: bankStatistics?.questions?.vocabulary || 0,
      required: 10,
      path: `/dashboard/question-banks/${bankId}/add/vocabulary`,
    },
    {
      id: "grammar",
      name: "القواعد",
      icon: MessageSquare,
      color: "text-green-600",
      bg: "bg-green-50",
      border: "border-green-200",
      count: bankStatistics?.questions?.grammar || 0,
      required: 10,
      path: `/dashboard/question-banks/${bankId}/add/grammar`,
    },
    {
      id: "reading",
      name: "القراءة",
      icon: FileText,
      color: "text-purple-600",
      bg: "bg-purple-50",
      border: "border-purple-200",
      count: bankStatistics?.questions?.reading || 0,
      required: 6,
      path: `/dashboard/question-banks/${bankId}/add/reading`,
    },
    {
      id: "listening",
      name: "الاستماع",
      icon: Headphones,
      color: "text-orange-600",
      bg: "bg-orange-50",
      border: "border-orange-200",
      count: bankStatistics?.questions?.listening || 0,
      required: 10,
      path: `/dashboard/question-banks/${bankId}/add/listening`,
    },
    {
      id: "speaking",
      name: "التحدث",
      icon: Video,
      color: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-200",
      count: bankStatistics?.questions?.speaking || 0,
      required: 10,
      path: `/dashboard/question-banks/${bankId}/add/speaking`,
    },
    {
      id: "writing",
      name: "الكتابة",
      icon: PenTool,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      border: "border-indigo-200",
      count: bankStatistics?.questions?.writing || 0,
      required: 4,
      path: `/dashboard/question-banks/${bankId}/add/writing`,
    },
  ];

  if (loading && !currentBank) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full"></div>
      </div>
    );
  }

  if (!currentBank) {
    return (
      <div className="card text-center py-12">
        <AlertCircle className="w-16 h-16 text-red-300 mx-auto mb-4" />
        <p className="text-gray-500 mb-4">لم يتم العثور على البنك</p>
        <Link to="/dashboard/question-banks" className="btn btn-primary">
          العودة للقائمة
        </Link>
      </div>
    );
  }

  const isReady = bankStatistics?.is_ready_for_exam;
  const totalQuestions = bankStatistics?.questions?.total || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/dashboard/question-banks"
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowRight className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {currentBank.title}
            </h1>
            {currentBank.description && (
              <p className="text-gray-600 mt-1">{currentBank.description}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isReady ? (
            <span className="badge badge-success flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              جاهز للامتحان
            </span>
          ) : (
            <span className="badge badge-warning flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              يحتاج المزيد من الأسئلة
            </span>
          )}
          <Link
            to={`/dashboard/question-banks/${bankId}/edit`}
            className="btn btn-secondary flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            تعديل
          </Link>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center">
              <FileText className="w-8 h-8 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">إجمالي الأسئلة</p>
              <p className="text-3xl font-bold text-gray-900">
                {totalQuestions}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">الأسئلة المطلوبة</p>
              <p className="text-3xl font-bold text-gray-900">50</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div
              className={`w-16 h-16 ${
                isReady ? "bg-green-100" : "bg-yellow-100"
              } rounded-xl flex items-center justify-center`}
            >
              <TrendingUp
                className={`w-8 h-8 ${
                  isReady ? "text-green-600" : "text-yellow-600"
                }`}
              />
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">نسبة الإكمال</p>
              <p className="text-3xl font-bold text-gray-900">
                {Math.round((totalQuestions / 50) * 100)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Question Types Grid */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-6">إضافة الأسئلة</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {questionTypes.map((type) => {
            const Icon = type.icon;
            const isComplete = type.count >= type.required;
            const percentage = Math.min(
              (type.count / type.required) * 100,
              100
            );

            return (
              <div
                key={type.id}
                className={`border-2 ${type.border} ${type.bg} rounded-xl p-5 hover:shadow-md transition-all`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Icon className={`w-6 h-6 ${type.color}`} />
                    <h3 className="font-bold text-gray-900">{type.name}</h3>
                  </div>
                  {isComplete && (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  )}
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">
                      {type.count} / {type.required} سؤال
                    </span>
                    <span
                      className={`font-medium ${
                        isComplete ? "text-green-600" : type.color
                      }`}
                    >
                      {Math.round(percentage)}%
                    </span>
                  </div>
                  <div className="w-full bg-white rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        isComplete
                          ? "bg-green-500"
                          : type.color.replace("text", "bg")
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>

                <Link
                  to={type.path}
                  className={`btn w-full flex items-center justify-center gap-2 ${
                    isComplete ? "btn-secondary" : "btn-primary"
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  {isComplete ? "إضافة المزيد" : "إضافة أسئلة"}
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* Missing Questions Alert */}
      {!isReady && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium mb-2">البنك غير جاهز للامتحان:</p>
              <ul className="space-y-1 mr-4">
                {questionTypes.map((type) => {
                  const missing = type.required - type.count;
                  if (missing > 0) {
                    return (
                      <li key={type.id}>
                        • يحتاج {missing} سؤال {type.name} إضافي
                      </li>
                    );
                  }
                  return null;
                })}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
