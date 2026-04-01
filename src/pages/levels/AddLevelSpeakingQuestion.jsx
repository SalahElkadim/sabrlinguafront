// src/pages/AddLevelSpeakingQuestion.jsx
import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowRight,
  Video,
  Loader2,
  AlertCircle,
  Plus,
  Trash2,
  Upload,
  CheckCircle,
} from "lucide-react";
import { levelQuestionBanksAPI } from "../services/levelsService";

export default function AddLevelSpeakingQuestion() {
  const { bankId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1); // 1 = Video, 2 = Questions
  const [videoId, setVideoId] = useState(null);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");

  // Video Form
  const [videoData, setVideoData] = useState({
    title: "",
    video_file: "",
    description: "",
    duration: 0,
    thumbnail: "",
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

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith("video/")) {
      alert("الرجاء اختيار ملف فيديو فقط");
      return;
    }

    // Check file size (max 100MB)
    if (file.size > 100 * 1024 * 1024) {
      alert("حجم الفيديو يجب أن يكون أقل من 100 ميجابايت");
      return;
    }

    setUploadingVideo(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "react_uploads");
    formData.append("resource_type", "video");

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dyxozpomy/upload",
        { method: "POST", body: formData }
      );

      const data = await response.json();
      console.log("Video uploaded:", data);

      if (data.error) {
        throw new Error(data.error.message);
      }

      if (data.secure_url) {
        setVideoUrl(data.secure_url);
        setVideoData((prev) => ({
          ...prev,
          video_file: data.secure_url,
          duration: data.duration ? Math.round(data.duration) : prev.duration,
        }));

        // لو Cloudinary رجع thumbnail تلقائي
        if (data.thumbnail_url) {
          setThumbnailUrl(data.thumbnail_url);
          setVideoData((prev) => ({
            ...prev,
            thumbnail: data.thumbnail_url,
          }));
        }
      } else {
        throw new Error("لم يتم الحصول على رابط الفيديو");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert(`حدث خطأ في رفع الفيديو: ${err.message}`);
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleThumbnailUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith("image/")) {
      alert("الرجاء اختيار صورة فقط");
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("حجم الصورة يجب أن يكون أقل من 5 ميجابايت");
      return;
    }

    setUploadingThumbnail(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "react_uploads");

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dyxozpomy/image/upload",
        { method: "POST", body: formData }
      );

      const data = await response.json();
      console.log("Thumbnail uploaded:", data);

      if (data.error) {
        throw new Error(data.error.message);
      }

      if (data.secure_url) {
        setThumbnailUrl(data.secure_url);
        setVideoData((prev) => ({
          ...prev,
          thumbnail: data.secure_url,
        }));
      } else {
        throw new Error("لم يتم الحصول على رابط الصورة");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert(`حدث خطأ في رفع الصورة: ${err.message}`);
    } finally {
      setUploadingThumbnail(false);
    }
  };

  const handleVideoChange = (e) => {
    const { name, value, type, checked } = e.target;
    setVideoData((prev) => ({
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

  const handleSubmitVideo = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await levelQuestionBanksAPI.createSpeakingVideo(
        bankId,
        videoData
      );
      setVideoId(response.video.id);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || "فشل إضافة الفيديو");
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
        await levelQuestionBanksAPI.addSpeakingQuestion(
          bankId,
          videoId,
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
          <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
            <Video className="w-6 h-6 text-pink-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              إضافة سؤال تحدث
            </h1>
            <p className="text-gray-600">
              {step === 1 ? "الخطوة 1: رفع الفيديو" : "الخطوة 2: إضافة الأسئلة"}
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

      {/* Step 1: Video */}
      {step === 1 && (
        <form onSubmit={handleSubmitVideo} className="space-y-6">
          <div className="card">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              معلومات الفيديو
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  عنوان الفيديو <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={videoData.title}
                  onChange={handleVideoChange}
                  className="input"
                  required
                  placeholder="مثال: How to introduce yourself"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ملف الفيديو <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-4">
                  <label className="btn btn-secondary cursor-pointer flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    {uploadingVideo ? "جاري الرفع..." : "رفع فيديو"}
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoUpload}
                      className="hidden"
                      disabled={uploadingVideo}
                    />
                  </label>
                  {videoUrl && (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-5 h-5" />
                      <span className="text-sm">تم رفع الفيديو بنجاح</span>
                    </div>
                  )}
                </div>
                {uploadingVideo && (
                  <p className="text-sm text-gray-500 mt-2">
                    <Loader2 className="w-4 h-4 inline animate-spin ml-1" />
                    جاري رفع الفيديو...
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  صورة مصغرة (Thumbnail) - اختياري
                </label>
                <div className="flex items-center gap-4">
                  <label className="btn btn-secondary cursor-pointer flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    {uploadingThumbnail ? "جاري الرفع..." : "رفع صورة"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailUpload}
                      className="hidden"
                      disabled={uploadingThumbnail}
                    />
                  </label>
                  {thumbnailUrl && (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-5 h-5" />
                      <span className="text-sm">تم رفع الصورة</span>
                    </div>
                  )}
                </div>
                {thumbnailUrl && (
                  <img
                    src={thumbnailUrl}
                    alt="Thumbnail"
                    className="mt-4 max-w-xs rounded-lg border"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الوصف - اختياري
                </label>
                <textarea
                  name="description"
                  value={videoData.description}
                  onChange={handleVideoChange}
                  rows={3}
                  className="input"
                  placeholder="وصف مختصر للفيديو..."
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
                    value={videoData.duration}
                    onChange={handleVideoChange}
                    className="input"
                    min="0"
                    placeholder="180"
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
                    value={videoData.order}
                    onChange={handleVideoChange}
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
                  checked={videoData.is_active}
                  onChange={handleVideoChange}
                  className="w-4 h-4 text-primary-600 rounded"
                />
                <label htmlFor="is_active" className="text-sm text-gray-700">
                  فيديو نشط
                </label>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading || !videoUrl}
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
                    placeholder="مثال: What should you say first when introducing yourself?"
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
