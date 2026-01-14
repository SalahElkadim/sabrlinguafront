import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  AlertCircle,
  Loader2,
  Headphones,
  HelpCircle,
  Play,
  Music,
  Save,
} from "lucide-react";

export function ExerciseListeningDashboard() {
  const [audios, setAudios] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAudioModal, setShowAudioModal] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [editingAudio, setEditingAudio] = useState(null);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [error, setError] = useState("");

  // بيانات ملف الصوت
  const [audioData, setAudioData] = useState({
    exercise: "",
    title: "",
    audio_file: null,
    transcript: "",
    order: 1,
  });

  // بيانات سؤال الاستماع
  const [questionData, setQuestionData] = useState({
    listening_audio: "",
    question_text: "",
    choice_a: "",
    choice_b: "",
    choice_c: "",
    choice_d: "",
    correct_answer: "A",
    explanation: "",
    points: 1,
    order: 1,
  });

  const API_URL = "https://sabrlinguaa-production.up.railway.app/levels";
  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [audRes, exRes, questRes] = await Promise.all([
        fetch(`${API_URL}/listening-audios/`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        }),
        fetch(`${API_URL}/exercises/`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        }),
        fetch(`${API_URL}/listening-questions/`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        }),
      ]);
      setAudios(await audRes.json());
      setExercises(await exRes.json());
      setQuestions(await questRes.json());
    } catch (err) {
      setError("حدث خطأ في جلب البيانات");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAudioSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(audioData).forEach((key) => {
      if (key === "audio_file" && audioData[key] instanceof File) {
        formData.append(key, audioData[key]);
      } else if (key !== "audio_file") {
        formData.append(key, audioData[key]);
      }
    });

    try {
      const url = editingAudio
        ? `${API_URL}/listening-audios/${editingAudio.id}/`
        : `${API_URL}/listening-audios/`;
      const response = await fetch(url, {
        method: editingAudio ? "PUT" : "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
        body: formData,
      });
      if (response.ok) {
        fetchData();
        setShowAudioModal(false);
        setEditingAudio(null);
      }
    } catch (err) {
      setError("فشل حفظ ملف الصوت");
    }
  };

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingQuestion
        ? `${API_URL}/listening-questions/${editingQuestion.id}/`
        : `${API_URL}/listening-questions/`;
      const response = await fetch(url, {
        method: editingQuestion ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(questionData),
      });
      if (response.ok) {
        fetchData();
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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-black">
            تمارين الاستماع (Listening)
          </h1>
          <p className="text-gray-600">
            إدارة الملفات الصوتية والأسئلة التابعة لها
          </p>
        </div>
        <button
          onClick={() => {
            setAudioData({
              exercise: "",
              title: "",
              audio_file: null,
              transcript: "",
              order: 1,
            });
            setShowAudioModal(true);
          }}
          className="bg-yellow-500 text-black px-6 py-2 rounded font-bold flex items-center gap-2 hover:bg-yellow-600"
        >
          <Plus size={20} /> إضافة ملف صوتي
        </button>
      </div>

      <div className="grid gap-6">
        {audios.map((audio) => (
          <div
            key={audio.id}
            className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
          >
            {/* Header الصوت */}
            <div className="p-4 bg-gray-800 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500 rounded-full text-black">
                  <Headphones size={20} />
                </div>
                <div>
                  <h3 className="font-bold">{audio.title}</h3>
                  <p className="text-xs text-gray-400">
                    التمرين: {audio.exercise_title || audio.exercise}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setQuestionData({
                      ...questionData,
                      listening_audio: audio.id,
                    });
                    setShowQuestionModal(true);
                  }}
                  className="bg-yellow-500 text-black text-xs px-3 py-1 rounded font-bold hover:bg-yellow-400"
                >
                  إضافة سؤال
                </button>
                <button
                  onClick={() => {
                    setEditingAudio(audio);
                    setAudioData(audio);
                    setShowAudioModal(true);
                  }}
                  className="p-1 hover:bg-gray-700 rounded"
                >
                  <Edit2 size={18} />
                </button>
                <button className="p-1 hover:bg-red-900 text-red-400 rounded">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            {/* مشغل الصوت */}
            <div className="p-4 bg-gray-50 border-b flex items-center gap-4">
              <audio
                src={audio.audio_file}
                controls
                className="w-full h-10 custom-audio"
              />
            </div>

            {/* الأسئلة */}
            <div className="p-4">
              <div className="space-y-2">
                {questions
                  .filter((q) => q.listening_audio === audio.id)
                  .map((q, idx) => (
                    <div
                      key={q.id}
                      className="flex items-center justify-between bg-white p-3 rounded border border-gray-100 shadow-sm hover:border-yellow-200 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded-full text-xs font-bold">
                          {idx + 1}
                        </span>
                        <span className="text-sm text-gray-700">
                          {q.question_text}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingQuestion(q);
                            setQuestionData(q);
                            setShowQuestionModal(true);
                          }}
                          className="text-blue-500 p-1 hover:bg-blue-50 rounded"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button className="text-red-500 p-1 hover:bg-red-50 rounded">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- Audio Modal --- */}
      {showAudioModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-xl">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">
                {editingAudio ? "تعديل ملف صوتي" : "إضافة ملف صوتي"}
              </h2>
              <button onClick={() => setShowAudioModal(false)}>
                <X />
              </button>
            </div>
            <form onSubmit={handleAudioSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1">
                  التمرين المرتبط
                </label>
                <select
                  className="w-full border p-2 rounded"
                  value={audioData.exercise}
                  onChange={(e) =>
                    setAudioData({ ...audioData, exercise: e.target.value })
                  }
                  required
                >
                  <option value="">اختر التمرين</option>
                  {exercises.map((ex) => (
                    <option key={ex.id} value={ex.id}>
                      {ex.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">العنوان</label>
                <input
                  type="text"
                  className="w-full border p-2 rounded"
                  value={audioData.title}
                  onChange={(e) =>
                    setAudioData({ ...audioData, title: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">
                  ملف الصوت
                </label>
                <input
                  type="file"
                  accept="audio/*"
                  className="w-full border p-2 rounded"
                  onChange={(e) =>
                    setAudioData({
                      ...audioData,
                      audio_file: e.target.files[0],
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">
                  النص (Transcript)
                </label>
                <textarea
                  className="w-full border p-2 rounded"
                  rows="3"
                  value={audioData.transcript}
                  onChange={(e) =>
                    setAudioData({ ...audioData, transcript: e.target.value })
                  }
                />
              </div>
              <button
                type="submit"
                className="w-full bg-yellow-500 text-black font-bold py-2 rounded"
              >
                حفظ
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- Question Modal --- */}
      {showQuestionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* هنا نضع فورم الأسئلة بنفس تصميم الـ MCQ الذي أرسلته سابقاً */}
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">إضافة سؤال استماع</h2>
              <button onClick={() => setShowQuestionModal(false)}>
                <X />
              </button>
            </div>
            <form onSubmit={handleQuestionSubmit} className="p-6 space-y-4">
              <textarea
                placeholder="نص السؤال..."
                className="w-full border p-2 rounded"
                value={questionData.question_text}
                onChange={(e) =>
                  setQuestionData({
                    ...questionData,
                    question_text: e.target.value,
                  })
                }
                required
              />
              <div className="grid grid-cols-2 gap-4">
                {["a", "b", "c", "d"].map((choice) => (
                  <input
                    key={choice}
                    placeholder={`خيار ${choice.toUpperCase()}`}
                    className="border p-2 rounded"
                    value={questionData[`choice_${choice}`]}
                    onChange={(e) =>
                      setQuestionData({
                        ...questionData,
                        [`choice_${choice}`]: e.target.value,
                      })
                    }
                    required
                  />
                ))}
              </div>
              <select
                className="w-full border p-2 rounded"
                value={questionData.correct_answer}
                onChange={(e) =>
                  setQuestionData({
                    ...questionData,
                    correct_answer: e.target.value,
                  })
                }
              >
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
              <button
                type="submit"
                className="w-full bg-black text-white font-bold py-2 rounded"
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
