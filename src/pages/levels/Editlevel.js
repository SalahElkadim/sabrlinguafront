// src/pages/EditLevel.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowRight,
  Layers,
  AlertCircle,
  CheckCircle,
  Info,
  Loader2,
} from "lucide-react";
import { useLevelsStore } from "../store/levelsStore";

const updateLevelSchema = z.object({
  code: z.enum(["A1", "A2", "B1", "B2"]),
  title: z.string().min(3, "العنوان يجب أن يكون 3 أحرف على الأقل"),
  description: z.string().optional(),
  order: z.number().min(1, "الترتيب يجب أن يكون رقم موجب"),
  is_active: z.boolean(),
});

export default function EditLevel() {
  const { levelId } = useParams();
  const navigate = useNavigate();
  const {
    currentLevel,
    fetchLevelById,
    updateLevel,
    loading,
    error,
    clearError,
  } = useLevelsStore();
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(updateLevelSchema),
  });

  useEffect(() => {
    fetchLevelById(levelId);
  }, [levelId]);

  useEffect(() => {
    if (currentLevel) {
      reset({
        code: currentLevel.code,
        title: currentLevel.title,
        description: currentLevel.description || "",
        order: currentLevel.order,
        is_active: currentLevel.is_active,
      });
    }
  }, [currentLevel, reset]);

  const selectedCode = watch("code");

  const onSubmit = async (data) => {
    clearError();
    try {
      await updateLevel(levelId, data);
      setSuccess(true);
      setTimeout(() => {
        navigate(`/dashboard/levels/${levelId}`);
      }, 1500);
    } catch (err) {
      console.error("Update level error:", err);
    }
  };

  if (loading && !currentLevel) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!currentLevel) return null;

  if (success) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            تم تحديث المستوى بنجاح!
          </h2>
          <p className="text-gray-600 mb-6">جاري التحويل...</p>
          <div className="animate-spin inline-block w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full"></div>
        </div>
      </div>
    );
  }

  const levelInfo = {
    A1: {
      name: "Beginner - مبتدئ",
      color: "bg-green-100 text-green-700 border-green-300",
      description: "مستوى المبتدئين - أساسيات اللغة الإنجليزية",
    },
    A2: {
      name: "Elementary - أساسي",
      color: "bg-blue-100 text-blue-700 border-blue-300",
      description: "المستوى الأساسي - بناء المهارات الأولية",
    },
    B1: {
      name: "Intermediate - متوسط",
      color: "bg-purple-100 text-purple-700 border-purple-300",
      description: "المستوى المتوسط - تطوير المهارات",
    },
    B2: {
      name: "Upper Intermediate - فوق المتوسط",
      color: "bg-orange-100 text-orange-700 border-orange-300",
      description: "فوق المتوسط - إتقان اللغة",
    },
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to={`/dashboard/levels/${levelId}`}
          className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowRight className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">تعديل المستوى</h1>
          <p className="text-gray-600 mt-1">
            تحديث بيانات المستوى "{currentLevel.title}"
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

          {/* Level Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              كود المستوى <span className="text-red-600">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {["A1", "A2", "B1", "B2"].map((code) => (
                <label
                  key={code}
                  className={`relative flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedCode === code
                      ? levelInfo[code].color + " border-2"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    value={code}
                    {...register("code")}
                    className="sr-only"
                  />
                  <div className="flex-1">
                    <div className="font-bold text-lg">{code}</div>
                    <div className="text-sm mt-1">{levelInfo[code].name}</div>
                  </div>
                  {selectedCode === code && (
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  )}
                </label>
              ))}
            </div>
            {errors.code && (
              <p className="mt-1 text-sm text-red-600">{errors.code.message}</p>
            )}
            {selectedCode && (
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex gap-2">
                  <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-800">
                    {levelInfo[selectedCode].description}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              عنوان المستوى <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              {...register("title")}
              className={`input ${errors.title ? "border-red-500" : ""}`}
              placeholder="مثال: Beginner Level"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الوصف (اختياري)
            </label>
            <textarea
              {...register("description")}
              rows={4}
              className="input"
              placeholder="وصف مختصر عن المستوى وما يحتويه..."
            />
          </div>

          {/* Order */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الترتيب <span className="text-red-600">*</span>
            </label>
            <input
              type="number"
              {...register("order", { valueAsNumber: true })}
              min="1"
              className={`input ${errors.order ? "border-red-500" : ""}`}
            />
            {errors.order && (
              <p className="mt-1 text-sm text-red-600">
                {errors.order.message}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              الترتيب يحدد موضع المستوى في القائمة
            </p>
          </div>

          {/* Is Active */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              {...register("is_active")}
              id="is_active"
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <label
              htmlFor="is_active"
              className="text-sm font-medium text-gray-700"
            >
              تفعيل المستوى (سيكون متاحاً للطلاب)
            </label>
          </div>

          {/* Warning Box */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-medium mb-1">تنبيه:</p>
                <p>
                  تعديل البيانات الأساسية للمستوى قد يؤثر على الطلاب المسجلين
                  حالياً في هذا المستوى.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-6 border-t border-gray-200">
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
                  جاري الحفظ...
                </span>
              ) : (
                <>
                  <Layers className="w-5 h-5 ml-2" />
                  حفظ التغييرات
                </>
              )}
            </button>
            <Link
              to={`/dashboard/levels/${levelId}`}
              className="btn btn-secondary px-8 py-3"
            >
              إلغاء
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
