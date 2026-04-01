// src/pages/AddLevelListeningQuestion.jsx
import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowRight,
  Headphones,
  Loader2,
  AlertCircle,
  Plus,
  Trash2,
  Upload,
  CheckCircle,
} from "lucide-react";
import { levelQuestionBanksAPI } from "../services/levelsService";

export default function AddLevelListeningQuestion() {
  const { bankId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1); // 1 = Audio, 2 = Questions
  const [audioId, setAudioId] = useState(null);
  const [uploadingAudio, setUploadingAudio] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");

  // Audio Form
  const [audioData, setAudioData] = useState({
    title: "",
    audio_file: "",
    transcript: "",
    duration: 0,
    order: 0,
    is_active: true,
  });

  // Questions List
  const [questions, setQuestions] = useState([
    {
      question_text: "",
      choice_a: "",
      choice_b: "",
      choice_c: "",
      choice_d: "",
      correct_answer: "A",
      explanation: "",
      points: 1,
      order: 1,
      is_active: true,
    },
  ]);

  const handleAudioUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith("audio/")) {
      alert("الرجاء اختيار ملف صوتي فقط");
      return;
    }

    // Check file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      alert("حجم الملف يجب أن يكون أقل من 50 ميجابايت");
      return;
    }

    setUploadingAudio(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "react_uploads");
    formData.append("resource_type", "video"); // يدعم الصوت والفيديو

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dyxozpomy/upload",
        { method: "POST", body: formData }
      );

      const data = await response.json();
      console.log("Audio file uploaded:", data);

      if (data.error) {
        throw new Error(data.error.message);
      }

      if (data.secure_url) {
        setAudioUrl(data.secure_url);
        setAudioData((prev) => ({
          ...prev,
          audio_file: data.secure_url,
          duration: data.duration ? Math.round(data.duration) : prev.duration,
        }));
      } else {
        throw new Error("لم يتم الحصول على رابط الملف");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert(`حدث خطأ في رفع الملف: ${err.message}`);
    } finally {
      setUploadingAudio(false);
    }
  };

  const handleAudioChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAudioData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleQuestionChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    const updated = [...questions];
    updated[index][name] = type === "checkbox" ? checked : value;
    setQuestions(updated);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question_text: "",
        choice_a: "",
        choice_b: "",
        choice_c: "",
        choice_d: "",
        correct_answer: "A",
        explanation: "",
        points: 1,
        order: questions.length + 1,
        is_active: true,
      },
    ]);
  };

  const removeQuestion = (index) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const handleSubmitAudio = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await levelQuestionBanksAPI.createListeningAudio(
        bankId,
        audioData
      );
      setAudioId(response.audio.id);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || "فشل إضافة التسجيل الصوتي");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitQuestions = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      for (const question of questions) {
        await levelQuestionBanksAPI.addListeningQuestion(
          bankId,
          audioId,
          question
        );
      }
      navigate(`/dashboard/level-question-banks/${bankId}`);
    } catch (err) {
      setError(err.response?.data?.error || "فشل إضافة الأسئلة");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to={`/dashboard/level-question-banks/${bankId}`}
          className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100"
        >
          <ArrowRight className="w-5 h-5 text-gray-600" />
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
            <Headphones className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              إضافة سؤال استماع
            </h1>
            <p className="text-gray-600">
              {step === 1
                ? "الخطوة 1: رفع الملف الصوتي"
                : "الخطوة 2: إضافة الأسئلة"}
            </p>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="card bg-red-50 border border-red-200">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Step 1: Audio */}
      {step === 1 && (
        <form onSubmit={handleSubmitAudio} className="space-y-6">
          <div className="card">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              معلومات التسجيل
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  عنوان التسجيل <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={audioData.title}
                  onChange={handleAudioChange}
                  className="input"
                  required
                  placeholder="مثال: Conversation at Restaurant"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الملف الصوتي <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-4">
                  <label className="btn btn-secondary cursor-pointer flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    {uploadingAudio ? "جاري الرفع..." : "رفع ملف صوتي"}
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={handleAudioUpload}
                      className="hidden"
                      disabled={uploadingAudio}
                    />
                  </label>
                  {audioUrl && (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-5 h-5" />
                      <span className="text-sm">تم رفع الملف بنجاح</span>
                    </div>
                  )}
                </div>
                {uploadingAudio && (
                  <p className="text-sm text-gray-500 mt-2">
                    <Loader2 className="w-4 h-4 inline animate-spin ml-1" />
                    جاري رفع الملف...
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  النص المكتوب (Transcript) - اختياري
                </label>
                <textarea
                  name="transcript"
                  value={audioData.transcript}
                  onChange={handleAudioChange}
                  rows={6}
                  className="input"
                  placeholder="اكتب النص المنطوق في التسجيل..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المدة (بالثواني)
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={audioData.duration}
                    onChange={handleAudioChange}
                    className="input"
                    min="0"
                    placeholder="120"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    يتم ملؤها تلقائياً عند الرفع
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الترتيب
                  </label>
                  <input
                    type="number"
                    name="order"
                    value={audioData.order}
                    onChange={handleAudioChange}
                    className="input"
                    min="0"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  name="is_active"
                  checked={audioData.is_active}
                  onChange={handleAudioChange}
                  className="w-4 h-4 text-primary-600 rounded"
                />
                <label htmlFor="is_active" className="text-sm text-gray-700">
                  تسجيل نشط
                </label>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading || !audioUrl}
              className="btn btn-primary flex-1 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                  جاري الحفظ...
                </>
              ) : (
                "التالي: إضافة الأسئلة"
              )}
            </button>
            <Link
              to={`/dashboard/level-question-banks/${bankId}`}
              className="btn btn-secondary"
            >
              إلغاء
            </Link>
          </div>
        </form>
      )}

      {/* Step 2: Questions */}
      {step === 2 && (
        <form onSubmit={handleSubmitQuestions} className="space-y-6">
          {questions.map((question, index) => (
            <div key={index} className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  السؤال {index + 1}
                </h3>
                {questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeQuestion(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نص السؤال <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="question_text"
                    value={question.question_text}
                    onChange={(e) => handleQuestionChange(index, e)}
                    rows={3}
                    className="input"
                    required
                    placeholder="مثال: What did the customer order?"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الاختيار أ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="choice_a"
                      value={question.choice_a}
                      onChange={(e) => handleQuestionChange(index, e)}
                      className="input"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الاختيار ب <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="choice_b"
                      value={question.choice_b}
                      onChange={(e) => handleQuestionChange(index, e)}
                      className="input"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الاختيار ج <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="choice_c"
                      value={question.choice_c}
                      onChange={(e) => handleQuestionChange(index, e)}
                      className="input"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الاختيار د <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="choice_d"
                      value={question.choice_d}
                      onChange={(e) => handleQuestionChange(index, e)}
                      className="input"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الإجابة الصحيحة <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="correct_answer"
                      value={question.correct_answer}
                      onChange={(e) => handleQuestionChange(index, e)}
                      className="input"
                      required
                    >
                      <option value="A">أ</option>
                      <option value="B">ب</option>
                      <option value="C">ج</option>
                      <option value="D">د</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      النقاط
                    </label>
                    <input
                      type="number"
                      name="points"
                      value={question.points}
                      onChange={(e) => handleQuestionChange(index, e)}
                      className="input"
                      min="1"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    شرح الإجابة
                  </label>
                  <textarea
                    name="explanation"
                    value={question.explanation}
                    onChange={(e) => handleQuestionChange(index, e)}
                    rows={2}
                    className="input"
                    placeholder="شرح مفصل للإجابة الصحيحة..."
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addQuestion}
            className="btn btn-secondary w-full"
          >
            <Plus className="w-4 h-4 ml-2" />
            إضافة سؤال آخر
          </button>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                  جاري الحفظ...
                </>
              ) : (
                "حفظ الأسئلة"
              )}
            </button>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="btn btn-secondary"
            >
              السابق
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
