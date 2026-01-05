import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Edit2,
  Trash2,
  Music,
  Volume2,
  ArrowLeft,
  Save,
  X,
  Clock,
  FileText,
} from "lucide-react";

const API_URL = "https://sabrlinguaa-production.up.railway.app/questions";
const CLOUDINARY_BASE_URL = "https://res.cloudinary.com/dyxozpomy/";
const getOptimizedAudioUrl = (url) => {
  if (!url) return url;
  if (url.includes("cloudinary.com") && url.includes("/upload/")) {
    return url.replace("/upload/", "/upload/f_mp3,q_auto/");
  }
  return url;
};


export default function ListeningQuestionsDashboard() {
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [audios, setAudios] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentView, setCurrentView] = useState("tests");
  const [selectedTest, setSelectedTest] = useState(null);
  const [selectedAudio, setSelectedAudio] = useState(null);

  const [showAudioModal, setShowAudioModal] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState("");

  const [audioFormData, setAudioFormData] = useState({
    placement_test: "",
    title: "",
    audio_file: null,
    transcript: "",
    duration: "",
    order: "1",
    is_active: true,
  });

  const [questionFormData, setQuestionFormData] = useState({
    audio: "",
    question_text: "",
    question_image: null,
    choice_a: "",
    choice_b: "",
    choice_c: "",
    choice_d: "",
    correct_answer: "A",
    explanation: "",
    points: "1",
    order: "1",
  });

  const [audioPreview, setAudioPreview] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchTests();
  }, []);

  useEffect(() => {
    if (selectedTest) {
      fetchAudios(selectedTest.id);
    }
  }, [selectedTest]);

  useEffect(() => {
    if (selectedAudio) {
      fetchQuestions(selectedAudio.id);
    }
  }, [selectedAudio]);

  const getToken = () => localStorage.getItem("token");

  const fetchTests = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/tests/`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const result = await response.json();
      if (result.success) {
        setTests(result.data);
      }
    } catch (error) {
      console.error("خطأ في جلب الامتحانات:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAudios = async (testId) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/listening-audios/?test_id=${testId}`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      const result = await response.json();
      if (result.success) {
        setAudios(result.data);
      }
    } catch (error) {
      console.error("خطأ في جلب التسجيلات:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async (audioId) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/listening-questions/?audio_id=${audioId}`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      const result = await response.json();
      if (result.success) {
        setQuestions(result.data);
      }
    } catch (error) {
      console.error("خطأ في جلب الأسئلة:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAudioSubmit = async () => {
    if (!audioFormData.title || !audioFormData.placement_test) {
      alert("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    // التحقق من وجود ملف صوتي عند الإنشاء
    if (modalMode === "create" && !audioFormData.audio_file) {
      alert("يرجى اختيار ملف صوتي");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();

      // إضافة جميع الحقول ماعدا audio_file
      Object.keys(audioFormData).forEach((key) => {
        if (key !== "audio_file") {
          formData.append(key, audioFormData[key]);
        }
      });

      // إضافة ملف الصوت فقط إذا كان موجود
      if (audioFormData.audio_file) {
        formData.append("audio_file", audioFormData.audio_file);
      }

      const url =
        modalMode === "create"
          ? `${API_URL}/listening-audios/`
          : `${API_URL}/listening-audios/${
              itemToDelete?.id || selectedAudio.id
            }/`;

      const response = await fetch(url, {
        method: modalMode === "create" ? "POST" : "PUT",
        headers: { Authorization: `Bearer ${getToken()}` },
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        alert(result.message);
        setShowAudioModal(false);
        resetAudioForm();
        if (selectedTest) {
          fetchAudios(selectedTest.id);
        }
      } else {
        // عرض الأخطاء بشكل أوضح
        console.error("Server errors:", result.errors);
        const errorMessage = result.errors
          ? Object.entries(result.errors)
              .map(([key, value]) => `${key}: ${value}`)
              .join("\n")
          : result.message || "حدث خطأ غير معروف";
        alert("حدث خطأ:\n" + errorMessage);
      }
    } catch (error) {
      console.error("خطأ:", error);
      alert("حدث خطأ في الاتصال بالسيرفر");
    } finally {
      setLoading(false);
    }
  };

  const handleQuestionSubmit = async () => {
    if (
      !questionFormData.question_text ||
      !questionFormData.choice_a ||
      !questionFormData.choice_b ||
      !questionFormData.choice_c ||
      !questionFormData.choice_d
    ) {
      alert("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();

      // إضافة جميع الحقول ماعدا question_image
      Object.keys(questionFormData).forEach((key) => {
        if (key !== "question_image") {
          formData.append(key, questionFormData[key]);
        }
      });

      // إضافة الصورة فقط إذا كانت موجودة
      if (questionFormData.question_image) {
        formData.append("question_image", questionFormData.question_image);
      }

      const url =
        modalMode === "create"
          ? `${API_URL}/listening-questions/`
          : `${API_URL}/listening-questions/${itemToDelete?.id}/`;

      const response = await fetch(url, {
        method: modalMode === "create" ? "POST" : "PUT",
        headers: { Authorization: `Bearer ${getToken()}` },
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        alert(result.message);
        setShowQuestionModal(false);
        resetQuestionForm();
        if (selectedAudio) {
          fetchQuestions(selectedAudio.id);
        }
      } else {
        // عرض الأخطاء بشكل أوضح
        console.error("Server errors:", result.errors);
        const errorMessage = result.errors
          ? Object.entries(result.errors)
              .map(([key, value]) => `${key}: ${value}`)
              .join("\n")
          : result.message || "حدث خطأ غير معروف";
        alert("حدث خطأ:\n" + errorMessage);
      }
    } catch (error) {
      console.error("خطأ:", error);
      alert("حدث خطأ في الاتصال بالسيرفر");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const url =
        deleteType === "audio"
          ? `${API_URL}/listening-audios/${itemToDelete.id}/`
          : `${API_URL}/listening-questions/${itemToDelete.id}/`;

      const response = await fetch(url, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      const result = await response.json();
      if (result.success) {
        alert(result.message);
        setShowDeleteConfirm(false);
        setItemToDelete(null);
        if (deleteType === "audio" && selectedTest) {
          fetchAudios(selectedTest.id);
        } else if (deleteType === "question" && selectedAudio) {
          fetchQuestions(selectedAudio.id);
        }
      }
    } catch (error) {
      console.error("خطأ في الحذف:", error);
      alert("حدث خطأ في عملية الحذف");
    } finally {
      setLoading(false);
    }
  };

  const resetAudioForm = () => {
    setAudioFormData({
      placement_test: selectedTest?.id || "",
      title: "",
      audio_file: null,
      transcript: "",
      duration: "",
      order: "1",
      is_active: true,
    });
    setAudioPreview(null);
  };

  const resetQuestionForm = () => {
    setQuestionFormData({
      audio: selectedAudio?.id || "",
      question_text: "",
      question_image: null,
      choice_a: "",
      choice_b: "",
      choice_c: "",
      choice_d: "",
      correct_answer: "A",
      explanation: "",
      points: "1",
      order: "1",
    });
    setImagePreview(null);
  };

  const openCreateAudioModal = () => {
    setModalMode("create");
    resetAudioForm();
    setAudioFormData({ ...audioFormData, placement_test: selectedTest.id });
    setShowAudioModal(true);
  };

  const openEditAudioModal = (audio) => {
    setModalMode("edit");
    setItemToDelete(audio);
    setAudioFormData({
      placement_test: audio.placement_test,
      title: audio.title,
      audio_file: null,
      transcript: audio.transcript || "",
      duration: audio.duration || "",
      order: audio.order.toString(),
      is_active: audio.is_active,
    });
    if (audio.audio_file) {
      setAudioPreview(audio.audio_file);
    }
    setShowAudioModal(true);
  };

  const openCreateQuestionModal = () => {
    setModalMode("create");
    resetQuestionForm();
    setQuestionFormData({ ...questionFormData, audio: selectedAudio.id });
    setShowQuestionModal(true);
  };

  const openEditQuestionModal = (question) => {
    setModalMode("edit");
    setItemToDelete(question);
    setQuestionFormData({
      audio: question.audio,
      question_text: question.question_text,
      question_image: null,
      choice_a: question.choice_a,
      choice_b: question.choice_b,
      choice_c: question.choice_c,
      choice_d: question.choice_d,
      correct_answer: question.correct_answer,
      explanation: question.explanation || "",
      points: question.points.toString(),
      order: question.order.toString(),
    });
    if (question.question_image) {
      let imageUrl = null;

      if (typeof question.question_image === "string") {
        imageUrl = question.question_image;
      } else if (question.question_image?.url) {
        imageUrl = question.question_image.url;
      } else if (typeof question.question_image === "object") {
        imageUrl = Object.values(question.question_image)[0];
      }

      if (imageUrl && !imageUrl.startsWith("http")) {
        imageUrl = CLOUDINARY_BASE_URL + imageUrl;
      }

      setImagePreview(imageUrl);
    }
    setShowQuestionModal(true);
  };

  const handleAudioChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAudioFormData({ ...audioFormData, audio_file: file });
      const url = URL.createObjectURL(file);
      setAudioPreview(url);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setQuestionFormData({ ...questionFormData, question_image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const renderTestsView = () => (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-black mb-2">اختر الامتحان</h2>
        <p className="text-gray-dark">اختر الامتحان لإدارة تسجيلات الاستماع</p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-yellow-primary border-t-transparent"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map((test) => (
            <div
              key={test.id}
              onClick={() => {
                setSelectedTest(test);
                setCurrentView("audios");
              }}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all p-6 cursor-pointer border-r-4 border-yellow-primary"
            >
              <h3 className="text-xl font-bold text-black mb-3">
                {test.title}
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-dark">المدة:</span>
                  <span className="font-semibold text-black">
                    {test.duration_minutes} دقيقة
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-dark">عدد الأسئلة:</span>
                  <span className="font-semibold text-black">
                    {test.questions_count || 0}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderAudiosView = () => (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => {
            setCurrentView("tests");
            setSelectedTest(null);
          }}
          className="p-2 hover:bg-gray-lighter rounded transition-colors"
        >
          <ArrowLeft size={24} className="text-black" />
        </button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-black">
            تسجيلات الاستماع - {selectedTest?.title}
          </h2>
          <p className="text-gray-dark">إدارة التسجيلات الصوتية للامتحان</p>
        </div>
        <button
          onClick={openCreateAudioModal}
          className="flex items-center gap-2 bg-yellow-primary text-black px-6 py-3 rounded font-bold hover:bg-yellow-hover transition-all shadow-md"
        >
          <Plus size={20} />
          تسجيل جديد
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-yellow-primary border-t-transparent"></div>
        </div>
      ) : audios.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Music size={48} className="mx-auto mb-4 text-gray-medium" />
          <p className="text-gray-dark text-lg">لا توجد تسجيلات صوتية</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {audios.map((audio) => (
            <div
              key={audio.id}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all p-6 border-r-4 border-yellow-primary"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-12 h-12 bg-yellow-light rounded-full flex items-center justify-center">
                    <Music className="text-black" size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-black">
                    {audio.title}
                  </h3>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    audio.is_active
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {audio.is_active ? "نشط" : "غير نشط"}
                </span>
              </div>

              {audio.audio_file && (
                <div className="mb-4">
                  <audio controls className="w-full" preload="metadata">
                    <source
                      src={getOptimizedAudioUrl(audio.audio_file)}
                      type="audio/mpeg"
                    />
                    <source src={audio.audio_file} type="audio/ogg" />
                    متصفحك لا يدعم تشغيل الملفات الصوتية
                  </audio>
                </div>
              )}

              <div className="space-y-2 mb-4 text-sm">
                {audio.duration && (
                  <div className="flex items-center gap-2 text-gray-dark">
                    <Clock size={16} />
                    <span>المدة: {audio.duration}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-gray-dark">عدد الأسئلة:</span>
                  <span className="font-bold text-black">
                    {audio.questions_count}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-dark">إجمالي النقاط:</span>
                  <span className="font-bold text-black">
                    {audio.total_points}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-dark">الترتيب:</span>
                  <span className="font-bold text-black">{audio.order}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedAudio(audio);
                    setCurrentView("questions");
                  }}
                  className="flex-1 bg-yellow-light text-black py-2 rounded hover:bg-yellow-primary transition-all font-bold"
                >
                  الأسئلة
                </button>
                <button
                  onClick={() => openEditAudioModal(audio)}
                  className="flex items-center justify-center gap-2 bg-gray-lighter text-black px-4 py-2 rounded hover:bg-gray-light transition-all"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => {
                    setItemToDelete(audio);
                    setDeleteType("audio");
                    setShowDeleteConfirm(true);
                  }}
                  className="flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded hover:bg-red-100 transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderQuestionsView = () => (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => {
            setCurrentView("audios");
            setSelectedAudio(null);
          }}
          className="p-2 hover:bg-gray-lighter rounded transition-colors"
        >
          <ArrowLeft size={24} className="text-black" />
        </button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-black">
            الأسئلة - {selectedAudio?.title}
          </h2>
          <p className="text-gray-dark">إدارة أسئلة التسجيل الصوتي</p>
        </div>
        <button
          onClick={openCreateQuestionModal}
          className="flex items-center gap-2 bg-yellow-primary text-black px-6 py-3 rounded font-bold hover:bg-yellow-hover transition-all shadow-md"
        >
          <Plus size={20} />
          سؤال جديد
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-yellow-primary border-t-transparent"></div>
        </div>
      ) : questions.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <FileText size={48} className="mx-auto mb-4 text-gray-medium" />
          <p className="text-gray-dark text-lg">لا توجد أسئلة</p>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((question, index) => (
            <div
              key={question.id}
              className="bg-white rounded-lg shadow-md p-6 border-r-4 border-yellow-primary"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-yellow-light rounded-full flex items-center justify-center font-bold text-black">
                  {index + 1}
                </div>

                <div className="flex-1">
                  <p className="text-lg font-bold text-black mb-3">
                    {question.question_text}
                  </p>

                  {question.question_image &&
                    (() => {
                      // استخراج رابط الصورة بشكل صحيح
                      let imageUrl = null;

                      if (typeof question.question_image === "string") {
                        imageUrl = question.question_image;
                      } else if (question.question_image?.url) {
                        imageUrl = question.question_image.url;
                      } else if (typeof question.question_image === "object") {
                        imageUrl = Object.values(question.question_image)[0];
                      }

                      // إضافة base URL إذا كان الرابط نسبي
                      if (imageUrl && !imageUrl.startsWith("http")) {
                        imageUrl = CLOUDINARY_BASE_URL + imageUrl;
                      }

                      return imageUrl ? (
                        <img
                          src={imageUrl}
                          alt="سؤال"
                          className="mb-4 rounded-lg max-h-48 object-contain border-2 border-gray-light"
                          onError={(e) => {
                            console.error(
                              "فشل تحميل الصورة. الرابط:",
                              imageUrl
                            );
                            console.error(
                              "البيانات الأصلية:",
                              question.question_image
                            );
                            e.target.style.display = "none";
                          }}
                        />
                      ) : null;
                    })()}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                    {["A", "B", "C", "D"].map((choice) => (
                      <div
                        key={choice}
                        className={`p-3 rounded border-2 ${
                          question.correct_answer === choice
                            ? "bg-green-50 border-green-500"
                            : "bg-gray-lighter border-gray-light"
                        }`}
                      >
                        <span className="font-bold text-black">{choice}:</span>{" "}
                        <span className="text-gray-dark">
                          {question[`choice_${choice.toLowerCase()}`]}
                        </span>
                      </div>
                    ))}
                  </div>

                  {question.explanation && (
                    <div className="bg-yellow-light p-3 rounded mb-3 border border-yellow-primary">
                      <p className="text-sm text-gray-dark">
                        <span className="font-bold text-black">الشرح:</span>{" "}
                        {question.explanation}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-sm text-gray-dark">
                    <span className="font-semibold">
                      النقاط: {question.points}
                    </span>
                    <span className="font-semibold">
                      الترتيب: {question.order}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => openEditQuestionModal(question)}
                    className="p-2 bg-gray-lighter text-black rounded hover:bg-gray-light transition-all"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => {
                      setItemToDelete(question);
                      setDeleteType("question");
                      setShowDeleteConfirm(true);
                    }}
                    className="p-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-lighter p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {currentView === "tests" && renderTestsView()}
        {currentView === "audios" && renderAudiosView()}
        {currentView === "questions" && renderQuestionsView()}

        {/* Audio Modal */}
        {showAudioModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-black border-b-2 border-yellow-primary px-6 py-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-yellow-primary">
                  {modalMode === "create"
                    ? "إضافة تسجيل صوتي جديد"
                    : "تعديل التسجيل الصوتي"}
                </h2>
                <button
                  onClick={() => setShowAudioModal(false)}
                  className="text-gray-light hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-black mb-2">
                    عنوان التسجيل *
                  </label>
                  <input
                    type="text"
                    value={audioFormData.title}
                    onChange={(e) =>
                      setAudioFormData({
                        ...audioFormData,
                        title: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border-2 border-gray-light rounded focus:border-yellow-primary focus:outline-none"
                    placeholder="مثال: محادثة في المطار"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-black mb-2">
                    ملف الصوت *
                  </label>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleAudioChange}
                    className="w-full px-4 py-2 border-2 border-gray-light rounded focus:border-yellow-primary focus:outline-none"
                  />
                  {audioPreview && (
                    <div className="mt-3">
                      <audio controls className="w-full" preload="metadata">
                        <source src={audioPreview} type="audio/mpeg" />
                        <source src={audioPreview} type="audio/ogg" />
                        <source src={audioPreview} type="audio/wav" />
                        متصفحك لا يدعم تشغيل الملفات الصوتية
                      </audio>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-black mb-2">
                    النص المكتوب (Transcript)
                  </label>
                  <textarea
                    value={audioFormData.transcript}
                    onChange={(e) =>
                      setAudioFormData({
                        ...audioFormData,
                        transcript: e.target.value,
                      })
                    }
                    rows="4"
                    className="w-full px-4 py-2 border-2 border-gray-light rounded focus:border-yellow-primary focus:outline-none"
                    placeholder="اكتب النص المسموع..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-black mb-2">
                    المدة (اختياري)
                  </label>
                  <input
                    type="text"
                    value={audioFormData.duration}
                    onChange={(e) =>
                      setAudioFormData({
                        ...audioFormData,
                        duration: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border-2 border-gray-light rounded focus:border-yellow-primary focus:outline-none"
                    placeholder="مثال: 3:45"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-black mb-2">
                    الترتيب *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={audioFormData.order}
                    onChange={(e) =>
                      setAudioFormData({
                        ...audioFormData,
                        order: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border-2 border-gray-light rounded focus:border-yellow-primary focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-lighter rounded">
                  <input
                    type="checkbox"
                    id="audio_is_active"
                    checked={audioFormData.is_active}
                    onChange={(e) =>
                      setAudioFormData({
                        ...audioFormData,
                        is_active: e.target.checked,
                      })
                    }
                    className="w-5 h-5 accent-yellow-primary"
                  />
                  <label
                    htmlFor="audio_is_active"
                    className="text-sm font-bold text-black cursor-pointer"
                  >
                    التسجيل نشط
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleAudioSubmit}
                    disabled={loading}
                    className="flex-1 bg-yellow-primary text-black py-3 rounded hover:bg-yellow-hover transition-all font-bold disabled:opacity-50 shadow-md"
                  >
                    {loading ? "جاري الحفظ..." : "حفظ"}
                  </button>
                  <button
                    onClick={() => setShowAudioModal(false)}
                    className="px-6 py-3 border-2 border-gray-light rounded hover:bg-gray-lighter transition-all font-bold"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Question Modal */}
        {showQuestionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-black border-b-2 border-yellow-primary px-6 py-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-yellow-primary">
                  {modalMode === "create" ? "إضافة سؤال جديد" : "تعديل السؤال"}
                </h2>
                <button
                  onClick={() => setShowQuestionModal(false)}
                  className="text-gray-light hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-black mb-2">
                    نص السؤال *
                  </label>
                  <textarea
                    value={questionFormData.question_text}
                    onChange={(e) =>
                      setQuestionFormData({
                        ...questionFormData,
                        question_text: e.target.value,
                      })
                    }
                    rows="3"
                    className="w-full px-4 py-2 border-2 border-gray-light rounded focus:border-yellow-primary focus:outline-none"
                    placeholder="اكتب السؤال هنا..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-black mb-2">
                    صورة السؤال (اختياري)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-4 py-2 border-2 border-gray-light rounded focus:border-yellow-primary focus:outline-none"
                  />
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="معاينة"
                      className="mt-3 rounded-lg max-h-48 object-contain border-2 border-gray-light"
                    />
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">
                      الخيار A *
                    </label>
                    <input
                      type="text"
                      value={questionFormData.choice_a}
                      onChange={(e) =>
                        setQuestionFormData({
                          ...questionFormData,
                          choice_a: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border-2 border-gray-light rounded focus:border-yellow-primary focus:outline-none"
                      placeholder="الخيار الأول"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-black mb-2">
                      الخيار B *
                    </label>
                    <input
                      type="text"
                      value={questionFormData.choice_b}
                      onChange={(e) =>
                        setQuestionFormData({
                          ...questionFormData,
                          choice_b: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border-2 border-gray-light rounded focus:border-yellow-primary focus:outline-none"
                      placeholder="الخيار الثاني"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-black mb-2">
                      الخيار C *
                    </label>
                    <input
                      type="text"
                      value={questionFormData.choice_c}
                      onChange={(e) =>
                        setQuestionFormData({
                          ...questionFormData,
                          choice_c: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border-2 border-gray-light rounded focus:border-yellow-primary focus:outline-none"
                      placeholder="الخيار الثالث"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-black mb-2">
                      الخيار D *
                    </label>
                    <input
                      type="text"
                      value={questionFormData.choice_d}
                      onChange={(e) =>
                        setQuestionFormData({
                          ...questionFormData,
                          choice_d: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border-2 border-gray-light rounded focus:border-yellow-primary focus:outline-none"
                      placeholder="الخيار الرابع"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-black mb-2">
                    الإجابة الصحيحة *
                  </label>
                  <select
                    value={questionFormData.correct_answer}
                    onChange={(e) =>
                      setQuestionFormData({
                        ...questionFormData,
                        correct_answer: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border-2 border-gray-light rounded focus:border-yellow-primary focus:outline-none"
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-black mb-2">
                    الشرح (اختياري)
                  </label>
                  <textarea
                    value={questionFormData.explanation}
                    onChange={(e) =>
                      setQuestionFormData({
                        ...questionFormData,
                        explanation: e.target.value,
                      })
                    }
                    rows="3"
                    className="w-full px-4 py-2 border-2 border-gray-light rounded focus:border-yellow-primary focus:outline-none"
                    placeholder="شرح الإجابة الصحيحة..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">
                      النقاط *
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={questionFormData.points}
                      onChange={(e) =>
                        setQuestionFormData({
                          ...questionFormData,
                          points: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border-2 border-gray-light rounded focus:border-yellow-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-black mb-2">
                      الترتيب *
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={questionFormData.order}
                      onChange={(e) =>
                        setQuestionFormData({
                          ...questionFormData,
                          order: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border-2 border-gray-light rounded focus:border-yellow-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleQuestionSubmit}
                    disabled={loading}
                    className="flex-1 bg-yellow-primary text-black py-3 rounded hover:bg-yellow-hover transition-all font-bold disabled:opacity-50 flex items-center justify-center gap-2 shadow-md"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-black border-t-transparent"></div>
                        جاري الحفظ...
                      </>
                    ) : (
                      <>
                        <Save size={20} />
                        حفظ السؤال
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setShowQuestionModal(false)}
                    className="px-6 py-3 border-2 border-gray-light rounded hover:bg-gray-lighter transition-all font-bold"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && itemToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6">
              <div className="text-center mb-6">
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <Trash2 className="text-red-600" size={32} />
                </div>
                <h3 className="text-xl font-bold text-black mb-2">
                  تأكيد الحذف
                </h3>
                <p className="text-gray-dark">
                  هل أنت متأكد من حذف{" "}
                  {deleteType === "audio" ? "التسجيل الصوتي" : "السؤال"}
                  <span className="font-bold text-black">
                    {" "}
                    "
                    {deleteType === "audio"
                      ? itemToDelete.title
                      : itemToDelete.question_text?.substring(0, 50)}
                    ..."
                  </span>
                  ؟
                </p>
                <p className="text-sm text-red-600 mt-2 font-semibold">
                  لا يمكن التراجع عن هذا الإجراء
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="flex-1 bg-red-600 text-white py-3 rounded hover:bg-red-700 transition-all font-bold disabled:opacity-50 shadow-md"
                >
                  {loading ? "جاري الحذف..." : "حذف نهائياً"}
                </button>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setItemToDelete(null);
                  }}
                  className="flex-1 border-2 border-gray-light py-3 rounded hover:bg-gray-lighter transition-all font-bold"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
