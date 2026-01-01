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
} from "lucide-react";

const API_URL = "https://sabrlinguaa-production.up.railway.app/questions";

export default function SpeakingQuestionsDashboard() {
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [videos, setVideos] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentView, setCurrentView] = useState("tests"); // tests, videos, questions
  const [selectedTest, setSelectedTest] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Modals
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState(""); // 'video' or 'question'

  // Form Data
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

  // Fetch Tests
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

  // Fetch Videos
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

  // Fetch Questions
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

  // Handle Video Submit
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

  // Handle Question Submit
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

  // Handle Delete
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

  // Render Tests View
  const renderTestsView = () => (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">اختر الامتحان</h2>
        <p className="text-gray-600">اختر الامتحان لإدارة فيديوهات التحدث</p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-600 border-t-transparent"></div>
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
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 cursor-pointer border-r-4 border-orange-500"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {test.title}
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">المدة:</span>
                  <span className="font-semibold">
                    {test.duration_minutes} دقيقة
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">عدد الأسئلة:</span>
                  <span className="font-semibold">
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

  // Render Videos View
  const renderVideosView = () => (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => {
            setCurrentView("tests");
            setSelectedTest(null);
          }}
          className="text-orange-600 hover:text-orange-700"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-800">
            فيديوهات التحدث - {selectedTest?.title}
          </h2>
          <p className="text-gray-600">إدارة فيديوهات التحدث للامتحان</p>
        </div>
        <button
          onClick={openCreateVideoModal}
          className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3 rounded-lg hover:from-orange-700 hover:to-red-700 transition-all shadow-md"
        >
          <Plus size={20} />
          فيديو جديد
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-600 border-t-transparent"></div>
        </div>
      ) : videos.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <p className="text-gray-500 text-lg">لا توجد فيديوهات</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div
              key={video.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden border-r-4 border-red-500"
            >
              {video.thumbnail ? (
                <div className="relative h-48 bg-gray-200">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                      <Play className="text-red-600 mr-1" size={28} />
                    </div>
                  </div>
                </div>
              ) : video.video_file ? (
                <div className="relative h-48 bg-gray-900">
                  <video
                    src={video.video_file}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                      <Play className="text-red-600 mr-1" size={28} />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-48 bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                  <Video className="text-orange-400" size={64} />
                </div>
              )}

              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-gray-800 flex-1">
                    {video.title}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      video.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {video.is_active ? "نشط" : "غير نشط"}
                  </span>
                </div>

                {video.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {video.description}
                  </p>
                )}

                <div className="space-y-2 mb-4 text-sm">
                  {video.duration && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock size={16} />
                      <span>المدة: {video.duration}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-500">عدد الأسئلة:</span>
                    <span className="font-semibold">
                      {video.questions_count}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">إجمالي النقاط:</span>
                    <span className="font-semibold">{video.total_points}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">الترتيب:</span>
                    <span className="font-semibold">{video.order}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedVideo(video);
                      setCurrentView("questions");
                    }}
                    className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg hover:bg-red-100 transition-all font-semibold"
                  >
                    الأسئلة
                  </button>
                  <button
                    onClick={() => openEditVideoModal(video)}
                    className="flex items-center justify-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-all"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => {
                      setItemToDelete(video);
                      setDeleteType("video");
                      setShowDeleteConfirm(true);
                    }}
                    className="flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Render Questions View
  const renderQuestionsView = () => (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => {
            setCurrentView("videos");
            setSelectedVideo(null);
          }}
          className="text-orange-600 hover:text-orange-700"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-800">
            الأسئلة - {selectedVideo?.title}
          </h2>
          <p className="text-gray-600">إدارة أسئلة الفيديو</p>
        </div>
        <button
          onClick={openCreateQuestionModal}
          className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-orange-600 text-white px-6 py-3 rounded-lg hover:from-red-700 hover:to-orange-700 transition-all shadow-md"
        >
          <Plus size={20} />
          سؤال جديد
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-red-600 border-t-transparent"></div>
        </div>
      ) : questions.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <p className="text-gray-500 text-lg">لا توجد أسئلة</p>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((question, index) => (
            <div
              key={question.id}
              className="bg-white rounded-xl shadow-md p-6 border-r-4 border-orange-500"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center font-bold text-orange-600">
                  {index + 1}
                </div>

                <div className="flex-1">
                  <p className="text-lg font-semibold text-gray-800 mb-3">
                    {question.question_text}
                  </p>

                  {question.question_image && (
                    <img
                      src={question.question_image}
                      alt="سؤال"
                      className="mb-4 rounded-lg max-h-48 object-contain"
                    />
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                    {["A", "B", "C", "D"].map((choice) => (
                      <div
                        key={choice}
                        className={`p-3 rounded-lg border-2 ${
                          question.correct_answer === choice
                            ? "bg-green-50 border-green-500"
                            : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <span className="font-bold text-gray-700">
                          {choice}:
                        </span>{" "}
                        {question[`choice_${choice.toLowerCase()}`]}
                      </div>
                    ))}
                  </div>

                  {question.explanation && (
                    <div className="bg-blue-50 p-3 rounded-lg mb-3">
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">الشرح:</span>{" "}
                        {question.explanation}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>النقاط: {question.points}</span>
                    <span>الترتيب: {question.order}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => openEditQuestionModal(question)}
                    className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => {
                      setItemToDelete(question);
                      setDeleteType("question");
                      setShowDeleteConfirm(true);
                    }}
                    className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all"
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
    <div
      className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 p-6"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto">
        {currentView === "tests" && renderTestsView()}
        {currentView === "videos" && renderVideosView()}
        {currentView === "questions" && renderQuestionsView()}

        {/* Video Modal */}
        {showVideoModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">
                  {modalMode === "create"
                    ? "إضافة فيديو جديد"
                    : "تعديل الفيديو"}
                </h2>
                <button
                  onClick={() => setShowVideoModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="مثال: مقدمة عن نفسك"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    ملف الفيديو *
                  </label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                  {videoPreview && (
                    <div className="mt-3">
                      <video controls className="w-full rounded-lg max-h-64">
                        <source src={videoPreview} type="video/mp4" />
                      </video>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    صورة مصغرة (Thumbnail)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                  {thumbnailPreview && (
                    <img
                      src={thumbnailPreview}
                      alt="معاينة"
                      className="mt-3 rounded-lg max-h-48 object-contain border-2 border-gray-200"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="وصف مختصر للفيديو..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="مثال: 5:30"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
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
                    className="w-5 h-5 text-orange-600 rounded focus:ring-2 focus:ring-orange-500"
                  />
                  <label
                    htmlFor="video_is_active"
                    className="text-sm font-semibold text-gray-700 cursor-pointer"
                  >
                    الفيديو نشط
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleVideoSubmit}
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 rounded-lg hover:from-orange-700 hover:to-red-700 transition-all font-semibold disabled:opacity-50"
                  >
                    {loading ? "جاري الحفظ..." : "حفظ"}
                  </button>
                  <button
                    onClick={() => setShowVideoModal(false)}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all font-semibold"
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">
                  {modalMode === "create" ? "إضافة سؤال جديد" : "تعديل السؤال"}
                </h2>
                <button
                  onClick={() => setShowQuestionModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="اكتب السؤال هنا..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    صورة السؤال (اختياري)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="معاينة"
                      className="mt-3 rounded-lg max-h-48 object-contain border-2 border-gray-200"
                    />
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="الخيار الأول"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="الخيار الثاني"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="الخيار الثالث"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="الخيار الرابع"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="شرح الإجابة الصحيحة..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleQuestionSubmit}
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-red-600 to-orange-600 text-white py-3 rounded-lg hover:from-red-700 hover:to-orange-700 transition-all font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
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
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all font-semibold"
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
              <div className="text-center mb-6">
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <Trash2 className="text-red-600" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  تأكيد الحذف
                </h3>
                <p className="text-gray-600">
                  هل أنت متأكد من حذف{" "}
                  {deleteType === "video" ? "الفيديو" : "السؤال"}
                  <span className="font-bold text-gray-800">
                    {" "}
                    "
                    {deleteType === "video"
                      ? itemToDelete.title
                      : itemToDelete.question_text?.substring(0, 50)}
                    ..."
                  </span>
                  ؟
                </p>
                <p className="text-sm text-red-600 mt-2">
                  لا يمكن التراجع عن هذا الإجراء
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-all font-semibold disabled:opacity-50"
                >
                  {loading ? "جاري الحذف..." : "حذف نهائياً"}
                </button>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setItemToDelete(null);
                  }}
                  className="flex-1 border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition-all font-semibold"
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
