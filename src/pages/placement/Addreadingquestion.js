import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowRight,
  FileText,
  AlertCircle,
  CheckCircle,
  Image,
  Upload,
  Plus,
} from "lucide-react";
import { useQuestionBanksStore } from "../store/questionbanksstore";

// Schema للقطعة
const passageSchema = z.object({
  title: z.string().min(5, "عنوان القطعة يجب أن يكون 5 أحرف على الأقل"),
  passage_text: z.string().min(50, "نص القطعة يجب أن يكون 50 حرف على الأقل"),
  passage_image: z.string().optional(),
  source: z.string().optional(),
  order: z.number().min(0).default(0),
});

// Schema للسؤال
const questionSchema = z.object({
  question_text: z.string().min(5, "نص السؤال يجب أن يكون 5 أحرف على الأقل"),
  question_image: z.string().optional(),
  choice_a: z.string().min(1, "الخيار أ مطلوب"),
  choice_b: z.string().min(1, "الخيار ب مطلوب"),
  choice_c: z.string().min(1, "الخيار ج مطلوب"),
  choice_d: z.string().min(1, "الخيار د مطلوب"),
  correct_answer: z.enum(["A", "B", "C", "D"]),
  explanation: z.string().min(5, "الشرح مطلوب"),
  points: z.number().min(1).default(1),
  order: z.number().min(0).default(0),
});

export default function AddReadingQuestion() {
  const { bankId } = useParams();
  const {
    createReadingPassage,
    addReadingQuestion,
    loading,
    error,
    clearError,
  } = useQuestionBanksStore();

  const [step, setStep] = useState(1); // 1 = إنشاء قطعة، 2 = إضافة أسئلة
  const [currentPassage, setCurrentPassage] = useState(null);
  const [passageImageUrl, setPassageImageUrl] = useState("");
  const [questionImageUrl, setQuestionImageUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [success, setSuccess] = useState(false);
  const [addedQuestions, setAddedQuestions] = useState([]);

  // Form للقطعة
  const passageForm = useForm({
    resolver: zodResolver(passageSchema),
    defaultValues: { order: 0 },
  });

  // Form للسؤال
  const questionForm = useForm({
    resolver: zodResolver(questionSchema),
    defaultValues: { points: 1, order: 0, correct_answer: "A" },
  });

  const handlePassageImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("الرجاء اختيار صورة فقط");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("حجم الصورة يجب أن يكون أقل من 5 ميجابايت");
      return;
    }

    setUploadingImage(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "react_uploads"); // ✅ الجديد

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dyxozpomy/image/upload",
        { method: "POST", body: formData }
      );

      const data = await response.json();
      console.log("Passage image uploaded:", data);

      if (data.error) {
        throw new Error(data.error.message);
      }

      if (data.secure_url) {
        setPassageImageUrl(data.secure_url);
        passageForm.setValue("passage_image", data.secure_url);
      } else {
        throw new Error("لم يتم الحصول على رابط الصورة");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert(`حدث خطأ في رفع الصورة: ${err.message}`);
    } finally {
      setUploadingImage(false);
    }
  };
const handleQuestionImageUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    alert("الرجاء اختيار صورة فقط");
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    alert("حجم الصورة يجب أن يكون أقل من 5 ميجابايت");
    return;
  }

  setUploadingImage(true);
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "react_uploads"); // ✅ الجديد

  try {
    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dyxozpomy/image/upload",
      { method: "POST", body: formData }
    );

    const data = await response.json();
    console.log("Question image uploaded:", data);

    if (data.error) {
      throw new Error(data.error.message);
    }

    if (data.secure_url) {
      setQuestionImageUrl(data.secure_url);
      questionForm.setValue("question_image", data.secure_url);
    } else {
      throw new Error("لم يتم الحصول على رابط الصورة");
    }
  } catch (err) {
    console.error("Upload error:", err);
    alert(`حدث خطأ في رفع الصورة: ${err.message}`);
  } finally {
    setUploadingImage(false);
  }
};

  const onPassageSubmit = async (data) => {
    clearError();
    try {
      const result = await createReadingPassage(bankId, {
        ...data,
        is_active: true,
      });
      setCurrentPassage(result.passage);
      setStep(2);
    } catch (err) {
      console.error("Create passage error:", err);
    }
  };

  const onQuestionSubmit = async (data) => {
    clearError();
    try {
      await addReadingQuestion(bankId, currentPassage.id, {
        ...data,
        is_active: true,
      });
      setAddedQuestions([...addedQuestions, data.question_text]);
      setSuccess(true);
      questionForm.reset();
      setQuestionImageUrl("");
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Add question error:", err);
    }
  };

  // Step 1: إنشاء القطعة
  if (step === 1) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link
            to={`/dashboard/question-banks/${bankId}`}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowRight className="w-5 h-5 text-gray-600" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                إضافة قطعة قراءة
              </h1>
              <p className="text-gray-600">الخطوة 1: إنشاء قطعة القراءة</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form
          onSubmit={passageForm.handleSubmit(onPassageSubmit)}
          className="space-y-6"
        >
          <div className="card">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              معلومات القطعة
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  عنوان القطعة <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  {...passageForm.register("title")}
                  className={`input ${
                    passageForm.formState.errors.title ? "border-red-500" : ""
                  }`}
                  placeholder="مثال: The History of Coffee"
                />
                {passageForm.formState.errors.title && (
                  <p className="mt-1 text-sm text-red-600">
                    {passageForm.formState.errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نص القطعة <span className="text-red-600">*</span>
                </label>
                <textarea
                  {...passageForm.register("passage_text")}
                  rows={10}
                  className={`input ${
                    passageForm.formState.errors.passage_text
                      ? "border-red-500"
                      : ""
                  }`}
                  placeholder="اكتب قطعة القراءة هنا..."
                />
                {passageForm.formState.errors.passage_text && (
                  <p className="mt-1 text-sm text-red-600">
                    {passageForm.formState.errors.passage_text.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  صورة القطعة (اختياري)
                </label>
                <div className="flex items-center gap-4">
                  <label className="btn btn-secondary cursor-pointer flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    {uploadingImage ? "جاري الرفع..." : "رفع صورة"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePassageImageUpload}
                      className="hidden"
                      disabled={uploadingImage}
                    />
                  </label>
                  {passageImageUrl && (
                    <div className="flex items-center gap-2">
                      <Image className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-600">
                        تم رفع الصورة
                      </span>
                    </div>
                  )}
                </div>
                {passageImageUrl && (
                  <img
                    src={passageImageUrl}
                    alt="Passage"
                    className="mt-4 max-w-xs rounded-lg border"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  المصدر (اختياري)
                </label>
                <input
                  type="text"
                  {...passageForm.register("source")}
                  className="input"
                  placeholder="مثال: English Reading Book - Level 2"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn btn-primary py-3 disabled:opacity-50"
            >
              {loading ? "جاري الإنشاء..." : "التالي: إضافة الأسئلة"}
            </button>
            <Link
              to={`/dashboard/question-banks/${bankId}`}
              className="btn btn-secondary px-6 py-3"
            >
              إلغاء
            </Link>
          </div>
        </form>
      </div>
    );
  }

  // Step 2: إضافة الأسئلة
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setStep(1)}
          className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowRight className="w-5 h-5 text-gray-600" />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
            <FileText className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              إضافة أسئلة القراءة
            </h1>
            <p className="text-gray-600">
              الخطوة 2: أضف أسئلة للقطعة "{currentPassage?.title}"
            </p>
          </div>
        </div>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start gap-3">
          <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm">
            تم إضافة السؤال بنجاح! ({addedQuestions.length} أسئلة مضافة)
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <form
        onSubmit={questionForm.handleSubmit(onQuestionSubmit)}
        className="space-y-6"
      >
        <div className="card">
          <h2 className="text-lg font-bold text-gray-900 mb-4">سؤال جديد</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نص السؤال <span className="text-red-600">*</span>
              </label>
              <textarea
                {...questionForm.register("question_text")}
                rows={3}
                className={`input ${
                  questionForm.formState.errors.question_text
                    ? "border-red-500"
                    : ""
                }`}
                placeholder="مثال: Where did coffee originate?"
              />
              {questionForm.formState.errors.question_text && (
                <p className="mt-1 text-sm text-red-600">
                  {questionForm.formState.errors.question_text.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                صورة السؤال (اختياري)
              </label>
              <div className="flex items-center gap-4">
                <label className="btn btn-secondary cursor-pointer flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  {uploadingImage ? "جاري الرفع..." : "رفع صورة"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleQuestionImageUpload}
                    className="hidden"
                    disabled={uploadingImage}
                  />
                </label>
                {questionImageUrl && (
                  <div className="flex items-center gap-2">
                    <Image className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600">
                      تم رفع الصورة
                    </span>
                  </div>
                )}
              </div>
              {questionImageUrl && (
                <img
                  src={questionImageUrl}
                  alt="Question"
                  className="mt-4 max-w-xs rounded-lg border"
                />
              )}
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-bold text-gray-900 mb-4">الخيارات</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["a", "b", "c", "d"].map((choice) => (
              <div key={choice}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الخيار {choice.toUpperCase()}{" "}
                  <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  {...questionForm.register(`choice_${choice}`)}
                  className={`input ${
                    questionForm.formState.errors[`choice_${choice}`]
                      ? "border-red-500"
                      : ""
                  }`}
                  placeholder={`الخيار ${choice.toUpperCase()}`}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            الإجابة والشرح
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الإجابة الصحيحة
              </label>
              <div className="grid grid-cols-4 gap-3">
                {["A", "B", "C", "D"].map((choice) => (
                  <label
                    key={choice}
                    className="flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer hover:border-primary-500"
                  >
                    <input
                      type="radio"
                      value={choice}
                      {...questionForm.register("correct_answer")}
                      className="mr-2"
                    />
                    <span className="font-medium">{choice}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الشرح
              </label>
              <textarea
                {...questionForm.register("explanation")}
                rows={3}
                className={`input ${
                  questionForm.formState.errors.explanation
                    ? "border-red-500"
                    : ""
                }`}
                placeholder="اشرح الإجابة..."
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 btn btn-primary py-3 disabled:opacity-50"
          >
            <Plus className="w-4 h-4 inline ml-2" />
            {loading ? "جاري الإضافة..." : "إضافة سؤال آخر"}
          </button>
          <Link
            to={`/dashboard/question-banks/${bankId}`}
            className="btn bg-green-600 text-white hover:bg-green-700 px-6 py-3"
          >
            إنهاء ({addedQuestions.length} أسئلة)
          </Link>
        </div>
      </form>
    </div>
  );
}
