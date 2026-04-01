// src/pages/EditUnit.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowRight,
  BookOpen,
  AlertCircle,
  CheckCircle,
  Info,
  Loader2,
} from "lucide-react";
import { useLevelsStore } from "../store/levelsStore";

const updateUnitSchema = z.object({
  level: z.number(),
  title: z.string().min(3, "العنوان يجب أن يكون 3 أحرف على الأقل"),
  description: z.string().optional(),
  order: z.number().min(1, "الترتيب يجب أن يكون رقم موجب"),
  is_active: z.boolean(),
});

export default function EditUnit() {
  const { unitId } = useParams();
  const navigate = useNavigate();
  const {
    currentUnit,
    levels,
    fetchUnitById,
    fetchLevels,
    updateUnit,
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
    resolver: zodResolver(updateUnitSchema),
  });

  useEffect(() => {
    fetchLevels();
    fetchUnitById(unitId);
  }, [unitId]);

  useEffect(() => {
    if (currentUnit) {
      reset({
        level: currentUnit.level,
        title: currentUnit.title,
        description: currentUnit.description || "",
        order: currentUnit.order,
        is_active: currentUnit.is_active,
      });
    }
  }, [currentUnit, reset]);

  const selectedLevelId = watch("level");
  const selectedLevel = levels.find((level) => level.id === selectedLevelId);

  const onSubmit = async (data) => {
    clearError();
    try {
      await updateUnit(unitId, data);
      setSuccess(true);
      setTimeout(() => {
        navigate(`/dashboard/units/${unitId}`);
      }, 1500);
    } catch (err) {
      console.error("Update unit error:", err);
    }
  };

  if (loading && !currentUnit) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!currentUnit) return null;

  if (success) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            تم تحديث الوحدة بنجاح!
          </h2>
          <p className="text-gray-600 mb-6">جاري التحويل...</p>
          <div className="animate-spin inline-block w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full"></div>
        </div>
      </div>
    );
  }

  const levelColors = {
    A1: "bg-green-100 text-green-700 border-green-300",
    A2: "bg-blue-100 text-blue-700 border-blue-300",
    B1: "bg-purple-100 text-purple-700 border-purple-300",
    B2: "bg-orange-100 text-orange-700 border-orange-300",
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to={`/dashboard/units/${unitId}`}
          className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowRight className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">تعديل الوحدة</h1>
          <p className="text-gray-600 mt-1">
            تحديث بيانات الوحدة "{currentUnit.title}"
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

          {/* Level Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              المستوى التعليمي <span className="text-red-600">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {levels.map((level) => (
                <label
                  key={level.id}
                  className={`relative flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedLevelId === level.id
                      ? levelColors[level.code] + " border-2"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    value={level.id}
                    {...register("level", { valueAsNumber: true })}
                    className="sr-only"
                  />
                  <div className="flex-1">
                    <div className="font-bold text-lg">{level.code}</div>
                    <div className="text-sm mt-1">{level.title}</div>
                  </div>
                  {selectedLevelId === level.id && (
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  )}
                </label>
              ))}
            </div>
            {selectedLevel && (
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex gap-2">
                  <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-800">
                    المستوى المحدد: {selectedLevel.code} - {selectedLevel.title}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              عنوان الوحدة <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              {...register("title")}
              className={`input ${errors.title ? "border-red-500" : ""}`}
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
            <textarea {...register("description")} rows={4} className="input" />
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
              تفعيل الوحدة (ستكون متاحة للطلاب)
            </label>
          </div>

          {/* Warning */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-medium mb-1">تنبيه:</p>
                <p>
                  تعديل البيانات الأساسية للوحدة قد يؤثر على الطلاب المسجلين
                  حالياً.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn btn-primary py-3"
            >
              {loading ? "جاري الحفظ..." : "حفظ التغييرات"}
            </button>
            <Link
              to={`/dashboard/units/${unitId}`}
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
