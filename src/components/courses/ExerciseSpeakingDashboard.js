import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Loader2,
  Video,
  Mic,
  Save,
  Film,
  HelpCircle,
  PlayCircle,
} from "lucide-react";

export function ExerciseSpeakingDashboard() {
  const [videos, setVideos] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [error, setError] = useState("");

  // بيانات الفيديو
  const [videoData, setVideoData] = useState({
    exercise: "",
    title: "",
    video_file: null,
    description: "",
    order: 1,
  });

  // بيانات سؤال التحدث
  const [questionData, setQuestionData] = useState({
    speaking_video: "",
    question_text: "",
    points: 1,
    order: 1,
  });

  const API_URL = "https://sabrlinguaa-production.up.railway.app/levels";
  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setIsLoading(true);
      const [vidRes, exRes, questRes] = await Promise.all([
        fetch(`${API_URL}/speaking-videos/`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        }),
        fetch(`${API_URL}/exercises/`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        }),
        fetch(`${API_URL}/speaking-questions/`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        }),
      ]);
      setVideos(await vidRes.json());
      setExercises(await exRes.json());
      setQuestions(await questRes.json());
    } catch (err) {
      setError("خطأ في تحميل البيانات");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVideoSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(videoData).forEach((key) => {
      if (key === "video_file" && videoData[key] instanceof File) {
        formData.append(key, videoData[key]);
      } else if (key !== "video_file") {
        formData.append(key, videoData[key]);
      }
    });

    try {
      const url = editingVideo
        ? `${API_URL}/speaking-videos/${editingVideo.id}/`
        : `${API_URL}/speaking-videos/`;
      const response = await fetch(url, {
        method: editingVideo ? "PUT" : "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
        body: formData,
      });
      if (response.ok) {
        await fetchInitialData();
        setShowVideoModal(false);
        setEditingVideo(null);
      }
    } catch (err) {
      setError("فشل حفظ الفيديو");
    }
  };

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingQuestion
        ? `${API_URL}/speaking-questions/${editingQuestion.id}/`
        : `${API_URL}/speaking-questions/`;
      const response = await fetch(url, {
        method: editingQuestion ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(questionData),
      });
      if (response.ok) {
        await fetchInitialData();
        setShowQuestionModal(false);
        setEditingQuestion(null);
      }
    } catch (err) {
      setError("فشل حفظ السؤال");
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center h-screen items-center">
        <Loader2 className="animate-spin text-yellow-500" size={48} />
      </div>
    );

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-black flex items-center gap-3">
            <Film className="text-red-500" /> تمارين التحدث (Speaking)
          </h1>
          <p className="text-gray-600 mt-1">
            إدارة فيديوهات المحادثة والأسئلة الشفهية
          </p>
        </div>
        <button
          onClick={() => {
            setVideoData({
              exercise: "",
              title: "",
              video_file: null,
              description: "",
              order: 1,
            });
            setShowVideoModal(true);
          }}
          className="bg-red-600 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-red-700 transition-all"
        >
          <Plus size={20} /> إضافة فيديو جديد
        </button>
      </div>

      {/* Videos Grid */}
      <div className="grid gap-8">
        {videos.map((video) => (
          <div
            key={video.id}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
          >
            <div className="flex flex-col md:flex-row">
              {/* Video Preview Section */}
              <div className="md:w-1/3 bg-black aspect-video flex items-center justify-center relative">
                {video.video_file ? (
                  <video
                    src={video.video_file}
                    controls
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <PlayCircle size={48} className="text-gray-600" />
                )}
              </div>

              {/* Details & Questions Section */}
              <div className="md:w-2/3 p-6 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {video.title}
                    </h3>
                    <p className="text-sm text-gray-500">{video.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingVideo(video);
                        setVideoData(video);
                        setShowVideoModal(true);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-bold text-gray-600 flex items-center gap-2">
                      <Mic size={16} /> الأسئلة المطروحة
                    </span>
                    <button
                      onClick={() => {
                        setQuestionData({
                          ...questionData,
                          speaking_video: video.id,
                        });
                        setShowQuestionModal(true);
                      }}
                      className="text-xs bg-black text-white px-3 py-1.5 rounded-lg hover:bg-gray-800"
                    >
                      إضافة سؤال صوتي
                    </button>
                  </div>

                  <div className="space-y-2">
                    {questions
                      .filter((q) => q.speaking_video === video.id)
                      .map((q, idx) => (
                        <div
                          key={q.id}
                          className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex justify-between items-center group"
                        >
                          <span className="text-sm text-gray-700">
                            {idx + 1}. {q.question_text}
                          </span>
                          <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => {
                                setEditingQuestion(q);
                                setQuestionData(q);
                                setShowQuestionModal(true);
                              }}
                              className="p-1.5 text-blue-500"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button className="p-1.5 text-red-500">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- Video Modal --- */}
      {showVideoModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">
                {editingVideo ? "تعديل الفيديو" : "رفع فيديو جديد"}
              </h2>
              <button onClick={() => setShowVideoModal(false)}>
                <X />
              </button>
            </div>
            <form onSubmit={handleVideoSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1">
                  التمرين المرتبط
                </label>
                <select
                  className="w-full border-2 border-gray-100 p-2.5 rounded-xl"
                  value={videoData.exercise}
                  onChange={(e) =>
                    setVideoData({ ...videoData, exercise: e.target.value })
                  }
                  required
                >
                  <option value="">اختر التمرين...</option>
                  {exercises.map((ex) => (
                    <option key={ex.id} value={ex.id}>
                      {ex.title}
                    </option>
                  ))}
                </select>
              </div>
              <input
                type="text"
                placeholder="عنوان الفيديو"
                className="w-full border-2 border-gray-100 p-2.5 rounded-xl"
                value={videoData.title}
                onChange={(e) =>
                  setVideoData({ ...videoData, title: e.target.value })
                }
                required
              />
              <input
                type="file"
                accept="video/*"
                className="w-full border-2 border-gray-100 p-2.5 rounded-xl"
                onChange={(e) =>
                  setVideoData({ ...videoData, video_file: e.target.files[0] })
                }
              />
              <textarea
                placeholder="وصف قصير للفيديو"
                className="w-full border-2 border-gray-100 p-2.5 rounded-xl"
                value={videoData.description}
                onChange={(e) =>
                  setVideoData({ ...videoData, description: e.target.value })
                }
              />
              <button
                type="submit"
                className="w-full bg-red-600 text-white font-bold py-3 rounded-xl shadow-lg"
              >
                حفظ الفيديو
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- Question Modal --- */}
      {showQuestionModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold">سؤال تحدث جديد</h2>
              <button onClick={() => setShowQuestionModal(false)}>
                <X />
              </button>
            </div>
            <form onSubmit={handleQuestionSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1">
                  نص السؤال (ماذا سيقول الطالب؟)
                </label>
                <textarea
                  className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-red-500 outline-none"
                  rows="3"
                  placeholder="مثال: Describe the main idea of the video in 1 minute."
                  value={questionData.question_text}
                  onChange={(e) =>
                    setQuestionData({
                      ...questionData,
                      question_text: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-bold mb-1">النقاط</label>
                  <input
                    type="number"
                    className="w-full border-2 border-gray-100 p-2.5 rounded-xl"
                    value={questionData.points}
                    onChange={(e) =>
                      setQuestionData({
                        ...questionData,
                        points: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-bold mb-1">
                    الترتيب
                  </label>
                  <input
                    type="number"
                    className="w-full border-2 border-gray-100 p-2.5 rounded-xl"
                    value={questionData.order}
                    onChange={(e) =>
                      setQuestionData({
                        ...questionData,
                        order: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-black text-white font-bold py-3 rounded-xl transition-all"
              >
                حفظ السؤال
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
