import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Edit2,
  Trash2,
  Video,
  Play,
  ArrowLeft,
  Save,
  X,
  Clock,
  Image as ImageIcon,
  CheckCircle,
  XCircle,
} from "lucide-react";

const API_URL = "https://sabrlinguaa-production.up.railway.app/questions";

export default function SpeakingQuestionsDashboard() {
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [videos, setVideos] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentView, setCurrentView] = useState("tests");
  const [selectedTest, setSelectedTest] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState("");

  const [videoFormData, setVideoFormData] = useState({
    placement_test: "",
    title: "",
    video_file: null,
    description: "",
    duration: "",
    thumbnail: null,
    order: "1",
    is_active: true,
  });

  const [questionFormData, setQuestionFormData] = useState({
    video: "",
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

  const [videoPreview, setVideoPreview] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchTests();
  }, []);

  useEffect(() => {
    if (selectedTest) {
      fetchVideos(selectedTest.id);
    }
  }, [selectedTest]);

  useEffect(() => {
    if (selectedVideo) {
      fetchQuestions(selectedVideo.id);
    }
  }, [selectedVideo]);

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

  const fetchVideos = async (testId) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/speaking-videos/?test_id=${testId}`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      const result = await response.json();
      if (result.success) {
        setVideos(result.data);
      }
    } catch (error) {
      console.error("خطأ في جلب الفيديوهات:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async (videoId) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/speaking-questions/?video_id=${videoId}`,
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

  const handleVideoSubmit = async () => {
    if (!videoFormData.title || !videoFormData.placement_test) {
      alert("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();

      Object.keys(videoFormData).forEach((key) => {
        if (
          (key === "video_file" || key === "thumbnail") &&
          videoFormData[key]
        ) {
          formData.append(key, videoFormData[key]);
        } else if (key !== "video_file" && key !== "thumbnail") {
          formData.append(key, videoFormData[key]);
        }
      });

      const url =
        modalMode === "create"
          ? `${API_URL}/speaking-videos/`
          : `${API_URL}/speaking-videos/${
              itemToDelete?.id || selectedVideo.id
            }/`;

      const method = modalMode === "create" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        alert(result.message);
        setShowVideoModal(false);
        resetVideoForm();
        if (selectedTest) {
          fetchVideos(selectedTest.id);
        }
      } else {
        alert("حدث خطأ: " + JSON.stringify(result.errors));
      }
    } catch (error) {
      console.error("خطأ:", error);
      alert("حدث خطأ في العملية");
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

      Object.keys(questionFormData).forEach((key) => {
        if (key === "question_image" && questionFormData[key]) {
          formData.append(key, questionFormData[key]);
        } else if (key !== "question_image") {
          formData.append(key, questionFormData[key]);
        }
      });

      const url =
        modalMode === "create"
          ? `${API_URL}/speaking-questions/`
          : `${API_URL}/speaking-questions/${itemToDelete?.id}/`;

      const method = modalMode === "create" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        alert(result.message);
        setShowQuestionModal(false);
        resetQuestionForm();
        if (selectedVideo) {
          fetchQuestions(selectedVideo.id);
        }
      } else {
        alert("حدث خطأ: " + JSON.stringify(result.errors));
      }
    } catch (error) {
      console.error("خطأ:", error);
      alert("حدث خطأ في العملية");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const url =
        deleteType === "video"
          ? `${API_URL}/speaking-videos/${itemToDelete.id}/`
          : `${API_URL}/speaking-questions/${itemToDelete.id}/`;

      const response = await fetch(url, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      const result = await response.json();
      if (result.success) {
        alert(result.message);
        setShowDeleteConfirm(false);
        setItemToDelete(null);
        if (deleteType === "video" && selectedTest) {
          fetchVideos(selectedTest.id);
        } else if (deleteType === "question" && selectedVideo) {
          fetchQuestions(selectedVideo.id);
        }
      }
    } catch (error) {
      console.error("خطأ في الحذف:", error);
      alert("حدث خطأ في عملية الحذف");
    } finally {
      setLoading(false);
    }
  };

  const resetVideoForm = () => {
    setVideoFormData({
      placement_test: selectedTest?.id || "",
      title: "",
      video_file: null,
      description: "",
      duration: "",
      thumbnail: null,
      order: "1",
      is_active: true,
    });
    setVideoPreview(null);
    setThumbnailPreview(null);
  };

  const resetQuestionForm = () => {
    setQuestionFormData({
      video: selectedVideo?.id || "",
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

  const openCreateVideoModal = () => {
    setModalMode("create");
    resetVideoForm();
    setVideoFormData({ ...videoFormData, placement_test: selectedTest.id });
    setShowVideoModal(true);
  };

  const openEditVideoModal = (video) => {
    setModalMode("edit");
    setItemToDelete(video);
    setVideoFormData({
      placement_test: video.placement_test,
      title: video.title,
      video_file: null,
      description: video.description || "",
      duration: video.duration || "",
      thumbnail: null,
      order: video.order.toString(),
      is_active: video.is_active,
    });
    if (video.video_file) {
      setVideoPreview(video.video_file);
    }
    if (video.thumbnail) {
      setThumbnailPreview(video.thumbnail);
    }
    setShowVideoModal(true);
  };

  const openCreateQuestionModal = () => {
    setModalMode("create");
    resetQuestionForm();
    setQuestionFormData({ ...questionFormData, video: selectedVideo.id });
    setShowQuestionModal(true);
  };

  const openEditQuestionModal = (question) => {
    setModalMode("edit");
    setItemToDelete(question);
    setQuestionFormData({
      video: question.video,
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
      setImagePreview(question.question_image);
    }
    setShowQuestionModal(true);
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFormData({ ...videoFormData, video_file: file });
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
    }
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFormData({ ...videoFormData, thumbnail: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result);
      };
      reader.readAsDataURL(file);
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
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-black mb-3">اختر الامتحان</h2>
        <p className="text-gray-dark text-lg">
          اختر الامتحان لإدارة فيديوهات التحدث
        </p>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-yellow-primary border-t-transparent"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map((test) => (
            <div
              key={test.id}
              onClick={() => {
                setSelectedTest(test);
                setCurrentView("videos");
              }}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all p-6 cursor-pointer border-2 border-gray-light hover:border-yellow-primary"
            >
              <h3 className="text-2xl font-bold text-black mb-4">
                {test.title}
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-lighter rounded">
                  <span className="text-gray-dark font-semibold">المدة:</span>
                  <span className="font-bold text-black">
                    {test.duration_minutes} دقيقة
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-yellow-light rounded">
                  <span className="text-gray-dark font-semibold">
                    عدد الأسئلة:
                  </span>
                  <span className="font-bold text-black">
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

  const renderVideosView = () => (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => {
            setCurrentView("tests");
            setSelectedTest(null);
          }}
          className="p-2 rounded hover:bg-yellow-light transition-colors"
        >
          <ArrowLeft size={28} className="text-black" />
        </button>
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-black">
            فيديوهات التحدث - {selectedTest?.title}
          </h2>
          <p className="text-gray-dark text-lg mt-1">
            إدارة فيديوهات التحدث للامتحان
          </p>
        </div>
        <button
          onClick={openCreateVideoModal}
          className="flex items-center gap-3 bg-yellow-primary text-black px-6 py-3 rounded font-bold hover:bg-yellow-hover transition-all shadow-md hover:shadow-lg"
        >
          <Plus size={22} />
          <span>فيديو جديد</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-yellow-primary border-t-transparent"></div>
        </div>
      ) : videos.length === 0 ? (
        <div className="bg-white rounded-lg shadow-lg p-16 text-center border-2 border-gray-light">
          <Video size={64} className="mx-auto mb-4 text-gray-medium" />
          <p className="text-gray-dark text-xl font-semibold">
            لا توجد فيديوهات
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div
              key={video.id}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all overflow-hidden border-2 border-gray-light"
            >
              {video.thumbnail ? (
                <div className="relative h-56 bg-black">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <div className="w-20 h-20 bg-yellow-primary rounded-full flex items-center justify-center shadow-xl">
                      <Play className="text-black mr-1" size={32} />
                    </div>
                  </div>
                </div>
              ) : video.video_file ? (
                <div className="relative h-56 bg-black">
                  <video
                    src={video.video_file}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <div className="w-20 h-20 bg-yellow-primary rounded-full flex items-center justify-center shadow-xl">
                      <Play className="text-black mr-1" size={32} />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-56 bg-gray-lighter flex items-center justify-center">
                  <Video className="text-gray-medium" size={80} />
                </div>
              )}

              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-black flex-1">
                    {video.title}
                  </h3>
                  {video.is_active ? (
                    <div className="flex items-center gap-1 px-3 py-1 bg-yellow-light rounded-full">
                      <CheckCircle size={16} className="text-black" />
                      <span className="text-xs font-bold text-black">نشط</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 px-3 py-1 bg-gray-light rounded-full">
                      <XCircle size={16} className="text-gray-dark" />
                      <span className="text-xs font-bold text-gray-dark">
                        غير نشط
                      </span>
                    </div>
                  )}
                </div>

                {video.description && (
                  <p className="text-gray-dark mb-4 line-clamp-2">
                    {video.description}
                  </p>
                )}

                <div className="space-y-2 mb-5">
                  {video.duration && (
                    <div className="flex items-center gap-2 text-gray-dark p-2 bg-gray-lighter rounded">
                      <Clock size={18} />
                      <span className="font-semibold">
                        المدة: {video.duration}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between p-2 bg-yellow-light rounded">
                    <span className="text-gray-dark font-semibold">
                      عدد الأسئلة:
                    </span>
                    <span className="font-bold text-black">
                      {video.questions_count}
                    </span>
                  </div>
                  <div className="flex justify-between p-2 bg-gray-lighter rounded">
                    <span className="text-gray-dark font-semibold">
                      إجمالي النقاط:
                    </span>
                    <span className="font-bold text-black">
                      {video.total_points}
                    </span>
                  </div>
                  <div className="flex justify-between p-2 bg-gray-lighter rounded">
                    <span className="text-gray-dark font-semibold">
                      الترتيب:
                    </span>
                    <span className="font-bold text-black">{video.order}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedVideo(video);
                      setCurrentView("questions");
                    }}
                    className="flex-1 bg-yellow-primary text-black py-3 rounded font-bold hover:bg-yellow-hover transition-all shadow-md"
                  >
                    الأسئلة
                  </button>
                  <button
                    onClick={() => openEditVideoModal(video)}
                    className="flex items-center justify-center bg-white border-2 border-gray-light text-black px-4 py-3 rounded hover:border-yellow-primary hover:bg-yellow-light transition-all"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => {
                      setItemToDelete(video);
                      setDeleteType("video");
                      setShowDeleteConfirm(true);
                    }}
                    className="flex items-center justify-center bg-white border-2 border-gray-light text-black px-4 py-3 rounded hover:border-red-500 hover:bg-red-50 hover:text-red-600 transition-all"
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

  const renderQuestionsView = () => (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => {
            setCurrentView("videos");
            setSelectedVideo(null);
          }}
          className="p-2 rounded hover:bg-yellow-light transition-colors"
        >
          <ArrowLeft size={28} className="text-black" />
        </button>
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-black">
            الأسئلة - {selectedVideo?.title}
          </h2>
          <p className="text-gray-dark text-lg mt-1">إدارة أسئلة الفيديو</p>
        </div>
        <button
          onClick={openCreateQuestionModal}
          className="flex items-center gap-3 bg-yellow-primary text-black px-6 py-3 rounded font-bold hover:bg-yellow-hover transition-all shadow-md hover:shadow-lg"
        >
          <Plus size={22} />
          <span>سؤال جديد</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-yellow-primary border-t-transparent"></div>
        </div>
      ) : questions.length === 0 ? (
        <div className="bg-white rounded-lg shadow-lg p-16 text-center border-2 border-gray-light">
          <p className="text-gray-dark text-xl font-semibold">لا توجد أسئلة</p>
        </div>
      ) : (
        <div className="space-y-5">
          {questions.map((question, index) => (
            <div
              key={question.id}
              className="bg-white rounded-lg shadow-md p-6 border-2 border-gray-light hover:border-yellow-primary transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-14 h-14 bg-yellow-primary rounded-full flex items-center justify-center font-bold text-black text-xl shadow-md">
                  {index + 1}
                </div>

                <div className="flex-1">
                  <p className="text-xl font-bold text-black mb-4">
                    {question.question_text}
                  </p>

                  {question.question_image && (
                    <img
                      src={question.question_image}
                      alt="سؤال"
                      className="mb-5 rounded-lg max-h-64 object-contain border-2 border-gray-light"
                    />
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
                    {["A", "B", "C", "D"].map((choice) => (
                      <div
                        key={choice}
                        className={`p-4 rounded-lg border-2 font-semibold ${
                          question.correct_answer === choice
                            ? "bg-yellow-light border-yellow-primary text-black"
                            : "bg-gray-lighter border-gray-light text-gray-dark"
                        }`}
                      >
                        <span className="font-bold text-black">{choice}:</span>{" "}
                        {question[`choice_${choice.toLowerCase()}`]}
                      </div>
                    ))}
                  </div>

                  {question.explanation && (
                    <div className="bg-yellow-light border-2 border-yellow-primary p-4 rounded-lg mb-4">
                      <p className="text-gray-dark">
                        <span className="font-bold text-black">الشرح:</span>{" "}
                        {question.explanation}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center gap-6 text-gray-dark font-semibold">
                    <div className="flex items-center gap-2">
                      <span className="text-black">النقاط:</span>
                      <span className="bg-yellow-primary text-black px-3 py-1 rounded font-bold">
                        {question.points}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-black">الترتيب:</span>
                      <span className="bg-gray-lighter text-black px-3 py-1 rounded font-bold">
                        {question.order}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => openEditQuestionModal(question)}
                    className="p-3 bg-white border-2 border-gray-light text-black rounded hover:border-yellow-primary hover:bg-yellow-light transition-all"
                  >
                    <Edit2 size={20} />
                  </button>
                  <button
                    onClick={() => {
                      setItemToDelete(question);
                      setDeleteType("question");
                      setShowDeleteConfirm(true);
                    }}
                    className="p-3 bg-white border-2 border-gray-light text-black rounded hover:border-red-500 hover:bg-red-50 hover:text-red-600 transition-all"
                  >
                    <Trash2 size={20} />
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
        {currentView === "videos" && renderVideosView()}
        {currentView === "questions" && renderQuestionsView()}

        {/* Video Modal */}
        {showVideoModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-black border-b-2 border-yellow-primary px-6 py-5 flex justify-between items-center z-10">
                <h2 className="text-2xl font-bold text-yellow-primary">
                  {modalMode === "create"
                    ? "إضافة فيديو جديد"
                    : "تعديل الفيديو"}
                </h2>
                <button
                  onClick={() => setShowVideoModal(false)}
                  className="text-white hover:text-yellow-primary transition-colors"
                >
                  <X size={28} />
                </button>
              </div>

              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-bold text-black mb-2">
                    عنوان الفيديو *
                  </label>
                  <input
                    type="text"
                    value={videoFormData.title}
                    onChange={(e) =>
                      setVideoFormData({
                        ...videoFormData,
                        title: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-light rounded focus:border-yellow-primary focus:outline-none transition-colors font-semibold"
                    placeholder="مثال: مقدمة عن نفسك"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-black mb-2">
                    ملف الفيديو *
                  </label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                    className="w-full px-4 py-3 border-2 border-gray-light rounded focus:border-yellow-primary focus:outline-none transition-colors"
                  />
                  {videoPreview && (
                    <div className="mt-4 border-2 border-yellow-primary rounded-lg overflow-hidden">
                      <video controls className="w-full max-h-72 bg-black">
                        <source src={videoPreview} type="video/mp4" />
                      </video>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-black mb-2">
                    صورة مصغرة (Thumbnail)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                    className="w-full px-4 py-3 border-2 border-gray-light rounded focus:border-yellow-primary focus:outline-none transition-colors"
                  />
                  {thumbnailPreview && (
                    <img
                      src={thumbnailPreview}
                      alt="معاينة"
                      className="mt-4 rounded-lg max-h-56 object-contain border-2 border-yellow-primary"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-black mb-2">
                    الوصف
                  </label>
                  <textarea
                    value={videoFormData.description}
                    onChange={(e) =>
                      setVideoFormData({
                        ...videoFormData,
                        description: e.target.value,
                      })
                    }
                    rows="3"
                    className="w-full px-4 py-3 border-2 border-gray-light rounded focus:border-yellow-primary focus:outline-none transition-colors font-semibold"
                    placeholder="وصف مختصر للفيديو..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-black mb-2">
                    المدة (اختياري)
                  </label>
                  <input
                    type="text"
                    value={videoFormData.duration}
                    onChange={(e) =>
                      setVideoFormData({
                        ...videoFormData,
                        duration: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-light rounded focus:border-yellow-primary focus:outline-none transition-colors font-semibold"
                    placeholder="مثال: 5:30"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-black mb-2">
                    الترتيب *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={videoFormData.order}
                    onChange={(e) =>
                      setVideoFormData({
                        ...videoFormData,
                        order: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-light rounded focus:border-yellow-primary focus:outline-none transition-colors font-bold"
                  />
                </div>

                <div className="flex items-center gap-3 p-4 bg-yellow-light border-2 border-yellow-primary rounded-lg">
                  <input
                    type="checkbox"
                    id="video_is_active"
                    checked={videoFormData.is_active}
                    onChange={(e) =>
                      setVideoFormData({
                        ...videoFormData,
                        is_active: e.target.checked,
                      })
                    }
                    className="w-6 h-6 text-yellow-primary rounded focus:ring-2 focus:ring-yellow-primary cursor-pointer"
                  />
                  <label
                    htmlFor="video_is_active"
                    className="text-sm font-bold text-black cursor-pointer"
                  >
                    الفيديو نشط
                  </label>
                </div>

                <div className="flex gap-3 pt-4 border-t-2 border-gray-light">
                  <button
                    onClick={handleVideoSubmit}
                    disabled={loading}
                    className="flex-1 bg-yellow-primary text-black py-4 rounded font-bold hover:bg-yellow-hover transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "جاري الحفظ..." : "حفظ"}
                  </button>
                  <button
                    onClick={() => setShowVideoModal(false)}
                    className="px-8 py-4 border-2 border-gray-light rounded hover:bg-gray-lighter transition-all font-bold"
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
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-black border-b-2 border-yellow-primary px-6 py-5 flex justify-between items-center z-10">
                <h2 className="text-2xl font-bold text-yellow-primary">
                  {modalMode === "create" ? "إضافة سؤال جديد" : "تعديل السؤال"}
                </h2>
                <button
                  onClick={() => setShowQuestionModal(false)}
                  className="text-white hover:text-yellow-primary transition-colors"
                >
                  <X size={28} />
                </button>
              </div>

              <div className="p-6 space-y-5">
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
                    className="w-full px-4 py-3 border-2 border-gray-light rounded focus:border-yellow-primary focus:outline-none transition-colors font-semibold"
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
                    className="w-full px-4 py-3 border-2 border-gray-light rounded focus:border-yellow-primary focus:outline-none transition-colors"
                  />
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="معاينة"
                      className="mt-4 rounded-lg max-h-56 object-contain border-2 border-yellow-primary"
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
                      className="w-full px-4 py-3 border-2 border-gray-light rounded focus:border-yellow-primary focus:outline-none transition-colors font-semibold"
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
                      className="w-full px-4 py-3 border-2 border-gray-light rounded focus:border-yellow-primary focus:outline-none transition-colors font-semibold"
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
                      className="w-full px-4 py-3 border-2 border-gray-light rounded focus:border-yellow-primary focus:outline-none transition-colors font-semibold"
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
                      className="w-full px-4 py-3 border-2 border-gray-light rounded focus:border-yellow-primary focus:outline-none transition-colors font-semibold"
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
                    className="w-full px-4 py-3 border-2 border-gray-light rounded focus:border-yellow-primary focus:outline-none transition-colors font-bold bg-white"
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
                    className="w-full px-4 py-3 border-2 border-gray-light rounded focus:border-yellow-primary focus:outline-none transition-colors font-semibold"
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
                      className="w-full px-4 py-3 border-2 border-gray-light rounded focus:border-yellow-primary focus:outline-none transition-colors font-bold"
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
                      className="w-full px-4 py-3 border-2 border-gray-light rounded focus:border-yellow-primary focus:outline-none transition-colors font-bold"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t-2 border-gray-light">
                  <button
                    onClick={handleQuestionSubmit}
                    disabled={loading}
                    className="flex-1 bg-yellow-primary text-black py-4 rounded font-bold hover:bg-yellow-hover transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                    className="px-8 py-4 border-2 border-gray-light rounded hover:bg-gray-lighter transition-all font-bold"
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
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8 border-2 border-gray-light">
              <div className="text-center mb-6">
                <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <Trash2 className="text-red-600" size={40} />
                </div>
                <h3 className="text-2xl font-bold text-black mb-3">
                  تأكيد الحذف
                </h3>
                <p className="text-gray-dark text-lg mb-2">
                  هل أنت متأكد من حذف{" "}
                  {deleteType === "video" ? "الفيديو" : "السؤال"}
                </p>
                <p className="font-bold text-black text-lg">
                  "
                  {deleteType === "video"
                    ? itemToDelete.title
                    : itemToDelete.question_text?.substring(0, 50)}
                  ..."
                </p>
                <p className="text-sm text-red-600 mt-3 font-semibold">
                  ⚠️ لا يمكن التراجع عن هذا الإجراء
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="flex-1 bg-red-600 text-white py-4 rounded font-bold hover:bg-red-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "جاري الحذف..." : "حذف نهائياً"}
                </button>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setItemToDelete(null);
                  }}
                  className="flex-1 border-2 border-gray-light py-4 rounded hover:bg-gray-lighter transition-all font-bold"
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
