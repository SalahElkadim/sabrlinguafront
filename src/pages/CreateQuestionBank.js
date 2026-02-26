import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, Database, AlertCircle, CheckCircle } from "lucide-react";
import { useQuestionBanksStore } from "../store/questionbanksstore";

const createBankSchema = z.object({
  title: z.string().min(3, "العنوان يجب أن يكون 3 أحرف على الأقل"),
  description: z.string().optional(),
});

export default function CreateQuestionBank() {
  const navigate = useNavigate();
  const { createBank, loading, error, clearError } = useQuestionBanksStore();
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createBankSchema),
  });

  const onSubmit = async (data) => {
    clearError();
    try {
      const result = await createBank(data);
      setSuccess(true);
      setTimeout(() => {
        navigate(`/dashboard/question-banks/${result.question_bank.id}`);
      }, 1500);
    } catch (err) {
      console.error("Create bank error:", err);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            تم إنشاء البنك بنجاح!
          </h2>
          <p className="text-gray-600 mb-6">جاري التحويل إلى صفحة البنك...</p>
          <div className="animate-spin inline-block w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/dashboard/question-banks"
          className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowRight className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            إنشاء بنك أسئلة جديد
          </h1>
          <p className="text-gray-600 mt-1">
            املأ البيانات التالية لإنشاء بنك أسئلة
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="card">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Title Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              عنوان البنك <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              {...register("title")}
              className={`input ${errors.title ? "border-red-500" : ""}`}
              placeholder="مثال: بنك الأسئلة - المستوى المبتدئ"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Description Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الوصف (اختياري)
            </label>
            <textarea
              {...register("description")}
              rows={4}
              className={`input ${errors.description ? "border-red-500" : ""}`}
              placeholder="وصف مختصر لبنك الأسئلة وما يحتويه..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <Database className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">
                  متطلبات البنك الجاهز للامتحان:
                </p>
                <ul className="space-y-1 mr-4">
                  <li>• 10 أسئلة مفردات على الأقل</li>
                  <li>• 10 أسئلة قواعد على الأقل</li>
                  <li>• 6 أسئلة قراءة على الأقل</li>
                  <li>• 10 أسئلة استماع على الأقل</li>
                  <li>• 10 أسئلة تحدث على الأقل</li>
                  <li>• 4 أسئلة كتابة على الأقل</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  جاري الإنشاء...
                </span>
              ) : (
                "إنشاء البنك"
              )}
            </button>
            <Link
              to="/dashboard/question-banks"
              className="btn btn-secondary px-6 py-3"
            >
              إلغاء
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
