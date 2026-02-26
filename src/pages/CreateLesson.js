// src/pages/CreateLesson.jsx
import { useEffect, useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowRight,
  FileEdit,
  AlertCircle,
  CheckCircle,
  Info,
  Loader2,
  BookOpen,
  Headphones,
  Mic,
  PenTool,
} from "lucide-react";
import { useLevelsStore } from "../store/levelsStore";

const createLessonSchema = z.object({
  unit: z.number({ required_error: "يجب اختيار الوحدة" }),
  lesson_type: z.enum(["READING", "LISTENING", "SPEAKING", "WRITING"], {
    required_error: "يجب اختيار نوع الدرس",
  }),
  title: z.string().min(3, "العنوان يجب أن يكون 3 أحرف على الأقل"),
  order: z.number().min(1, "الترتيب يجب أن يكون رقم موجب"),
  is_active: z.boolean().default(true),
});

export default function CreateLesson() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { units, fetchUnits, createLesson, loading, error, clearError } =
    useLevelsStore();
  const [success, setSuccess] = useState(false);

  const preSelectedUnitId = searchParams.get("unit_id");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(createLessonSchema),
    defaultValues: {
      unit: preSelectedUnitId ? parseInt(preSelectedUnitId) : undefined,
      order: 1,
      is_active: true,
    },
  });

  useEffect(() => {
    fetchUnits();
  }, []);

  const selectedUnitId = watch("unit");
  const selectedLessonType = watch("lesson_type");

  const selectedUnit = units.find((unit) => unit.id === selectedUnitId);

  const onSubmit = async (data) => {
    clearError();
    try {
      const result = await createLesson(data);
      setSuccess(true);
      setTimeout(() => {
        navigate(`/dashboard/lessons/${result.lesson.id}`);
      }, 1500);
    } catch (err) {
      console.error("Create lesson error:", err);
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
            تم إنشاء الدرس بنجاح!
          </h2>
          <p className="text-gray-600 mb-6">
            يمكنك الآن إضافة المحتوى للدرس... جاري التحويل
          </p>
          <div className="animate-spin inline-block w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full"></div>
        </div>
      </div>
    );
  }

  const lessonTypes = [
    {
      value: "READING",
      label: "درس قراءة",
      icon: BookOpen,
      color: "bg-blue-100 text-blue-700 border-blue-300",
      description: "قراءة نصوص وفهم المعاني",
    },
    {
      value: "LISTENING",
      label: "درس استماع",
      icon: Headphones,
      color: "bg-purple-100 text-purple-700 border-purple-300",
      description: "الاستماع للمحادثات والتسجيلات",
    },
    {
      value: "SPEAKING",
      label: "درس تحدث",
      icon: Mic,
      color: "bg-green-100 text-green-700 border-green-300",
      description: "ممارسة النطق والمحادثة",
    },
    {
      value: "WRITING",
      label: "درس كتابة",
      icon: PenTool,
      color: "bg-orange-100 text-orange-700 border-orange-300",
      description: "كتابة الفقرات والتعبير",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/dashboard/lessons"
          className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowRight className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إنشاء درس جديد</h1>
          <p className="text-gray-600 mt-1">
            املأ البيانات التالية لإنشاء درس تعليمي
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

          {/* Unit Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الوحدة الدراسية <span className="text-red-600">*</span>
            </label>
            {units.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">جاري تحميل الوحدات...</p>
              </div>
            ) : (
              <select
                {...register("unit", { valueAsNumber: true })}
                className={`input ${errors.unit ? "border-red-500" : ""}`}
              >
                <option value="">اختر الوحدة</option>
                {units.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.title} ({unit.level_details?.code}) - الترتيب:{" "}
                    {unit.order}
                  </option>
                ))}
              </select>
            )}
            {errors.unit && (
              <p className="mt-1 text-sm text-red-600">{errors.unit.message}</p>
            )}
            {selectedUnit && (
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex gap-2">
                  <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">الوحدة المحددة:</p>
                    <p>{selectedUnit.title}</p>
                    <p className="text-xs mt-1 opacity-75">
                      المستوى: {selectedUnit.level_details?.code} -{" "}
                      {selectedUnit.lessons_count || 0} دروس
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Lesson Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              نوع الدرس <span className="text-red-600">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {lessonTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <label
                    key={type.value}
                    className={`relative flex items-start p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedLessonType === type.value
                        ? type.color + " border-2"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      value={type.value}
                      {...register("lesson_type")}
                      className="sr-only"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className="w-5 h-5" />
                        <span className="font-bold">{type.label}</span>
                      </div>
                      <p className="text-sm opacity-75">{type.description}</p>
                    </div>
                    {selectedLessonType === type.value && (
                      <CheckCircle className="w-5 h-5 flex-shrink-0" />
                    )}
                  </label>
                );
              })}
            </div>
            {errors.lesson_type && (
              <p className="mt-1 text-sm text-red-600">
                {errors.lesson_type.message}
              </p>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              عنوان الدرس <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              {...register("title")}
              className={`input ${errors.title ? "border-red-500" : ""}`}
              placeholder="مثال: Reading about animals"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">
                {errors.title.message}
              </p>
            )}
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
              placeholder="1"
            />
            {errors.order && (
              <p className="mt-1 text-sm text-red-600">
                {errors.order.message}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              الترتيب يحدد موضع الدرس داخل الوحدة
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
              تفعيل الدرس (سيكون متاحاً للطلاب)
            </label>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <FileEdit className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-2">الخطوة التالية:</p>
                <p>
                  بعد إنشاء الدرس، ستحتاج لإضافة المحتوى المناسب حسب نوع الدرس
                  (نص القراءة، الملف الصوتي، الفيديو، أو تعليمات الكتابة).
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
                  جاري الإنشاء...
                </span>
              ) : (
                <>
                  <FileEdit className="w-5 h-5 ml-2" />
                  إنشاء الدرس
                </>
              )}
            </button>
            <Link
              to="/dashboard/lessons"
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
