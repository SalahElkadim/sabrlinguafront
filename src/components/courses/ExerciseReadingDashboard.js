import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Loader2,
  FileText,
  HelpCircle,
  Save,
  AlignRight,
  BookOpen,
} from "lucide-react";

export function ExerciseReadingDashboard() {
  const [passages, setPassages] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPassageModal, setShowPassageModal] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [editingPassage, setEditingPassage] = useState(null);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [error, setError] = useState("");

  // بيانات القطعة
  const [passageData, setPassageData] = useState({
    exercise: "",
    title: "",
    content: "",
    order: 1,
  });

  // بيانات السؤال
  const [questionData, setQuestionData] = useState({
    passage: "",
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
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setIsLoading(true);
      const [passRes, exRes, questRes] = await Promise.all([
        fetch(`${API_URL}/reading-passages/`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        }),
        fetch(`${API_URL}/exercises/`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        }),
        fetch(`${API_URL}/reading-questions/`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        }),
      ]);
      setPassages(await passRes.json());
      setExercises(await exRes.json());
      setQuestions(await questRes.json());
    } catch (err) {
      setError("حدث خطأ في تحميل البيانات");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePassageSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingPassage
        ? `${API_URL}/reading-passages/${editingPassage.id}/`
        : `${API_URL}/reading-passages/`;
      const response = await fetch(url, {
        method: editingPassage ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(passageData),
      });
      if (response.ok) {
        await fetchInitialData();
        setShowPassageModal(false);
        setEditingPassage(null);
      }
    } catch (err) {
      setError("خطأ في حفظ القطعة");
    }
  };

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingQuestion
        ? `${API_URL}/reading-questions/${editingQuestion.id}/`
        : `${API_URL}/reading-questions/`;
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
      setError("خطأ في حفظ السؤال");
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
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold text-black flex items-center gap-2">
            <BookOpen className="text-yellow-500" /> نصوص القراءة (Reading)
          </h1>
          <p className="text-gray-600 mt-1">
            إدارة قطع القراءة والأسئلة المرتبطة بكل قطعة
          </p>
        </div>
        <button
          onClick={() => {
            setPassageData({ exercise: "", title: "", content: "", order: 1 });
            setEditingPassage(null);
            setShowPassageModal(true);
          }}
          className="bg-black text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-gray-800 transition-all"
        >
          <Plus size={20} /> إضافة قطعة جديدة
        </button>
      </div>

      {/* Grid of Passages */}
      <div className="grid gap-8">
        {passages.map((passage) => (
          <div
            key={passage.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md"
          >
            {/* Passage Header */}
            <div className="p-4 bg-gray-50 flex justify-between items-center border-b">
              <div className="flex items-center gap-3">
                <div className="bg-yellow-100 p-2 rounded-lg text-yellow-700">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-800">
                    {passage.title}
                  </h3>
                  <p className="text-xs text-gray-500">
                    الترتيب: {passage.order}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setQuestionData({ ...questionData, passage: passage.id });
                    setEditingQuestion(null);
                    setShowQuestionModal(true);
                  }}
                  className="bg-green-600 text-white text-xs px-3 py-1.5 rounded-md hover:bg-green-700 flex items-center gap-1"
                >
                  <Plus size={14} /> سؤال جديد
                </button>
                <button
                  onClick={() => {
                    setEditingPassage(passage);
                    setPassageData(passage);
                    setShowPassageModal(true);
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

            {/* Content Preview */}
            <div className="p-5 border-b bg-white">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm italic">
                {passage.content}
              </p>
            </div>

            {/* Associated Questions */}
            <div className="p-4 bg-gray-50/50">
              <div className="flex items-center gap-2 mb-4 text-gray-600">
                <HelpCircle size={16} />
                <span className="text-sm font-bold">
                  الأسئلة (
                  {questions.filter((q) => q.passage === passage.id).length})
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {questions
                  .filter((q) => q.passage === passage.id)
                  .map((q, idx) => (
                    <div
                      key={q.id}
                      className="bg-white p-3 rounded-lg border border-gray-100 flex justify-between items-center group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold bg-gray-100 w-6 h-6 flex items-center justify-center rounded-full">
                          {idx + 1}
                        </span>
                        <span className="text-sm text-gray-700 truncate max-w-[200px]">
                          {q.question_text}
                        </span>
                      </div>
                      <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => {
                            setEditingQuestion(q);
                            setQuestionData(q);
                            setShowQuestionModal(true);
                          }}
                          className="p-1.5 text-blue-500 hover:bg-blue-50 rounded"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button className="p-1.5 text-red-500 hover:bg-red-50 rounded">
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

      {/* --- Passage Modal (نافذة إضافة/تعديل القطعة) --- */}
      {showPassageModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b bg-gray-50 flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center gap-2">
                {editingPassage ? <Edit2 size={20} /> : <Plus size={20} />}
                {editingPassage
                  ? "تعديل قطعة القراءة"
                  : "إضافة قطعة قراءة جديدة"}
              </h2>
              <button
                onClick={() => setShowPassageModal(false)}
                className="hover:bg-gray-200 p-1 rounded-full"
              >
                <X />
              </button>
            </div>
            <form onSubmit={handlePassageSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    التمرين المرتبط
                  </label>
                  <select
                    className="w-full border-2 border-gray-100 p-2.5 rounded-xl focus:border-yellow-500 outline-none transition-all"
                    value={passageData.exercise}
                    onChange={(e) =>
                      setPassageData({
                        ...passageData,
                        exercise: e.target.value,
                      })
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
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    الترتيب
                  </label>
                  <input
                    type="number"
                    className="w-full border-2 border-gray-100 p-2.5 rounded-xl focus:border-yellow-500 outline-none"
                    value={passageData.order}
                    onChange={(e) =>
                      setPassageData({ ...passageData, order: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  عنوان القطعة
                </label>
                <input
                  type="text"
                  className="w-full border-2 border-gray-100 p-2.5 rounded-xl focus:border-yellow-500 outline-none"
                  placeholder="مثلاً: The Future of AI"
                  value={passageData.title}
                  onChange={(e) =>
                    setPassageData({ ...passageData, title: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  نص القطعة
                </label>
                <textarea
                  className="w-full border-2 border-gray-100 p-2.5 rounded-xl focus:border-yellow-500 outline-none min-h-[200px]"
                  placeholder="اكتب أو الصق النص هنا..."
                  value={passageData.content}
                  onChange={(e) =>
                    setPassageData({ ...passageData, content: e.target.value })
                  }
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-black py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Save size={20} /> حفظ القطعة
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- Question Modal (نافذة إضافة/تعديل السؤال) --- */}
      {showQuestionModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-white z-10 flex justify-between items-center">
              <h2 className="text-xl font-bold">
                سؤال لقطعة:{" "}
                {passages.find((p) => p.id === questionData.passage)?.title}
              </h2>
              <button onClick={() => setShowQuestionModal(false)}>
                <X />
              </button>
            </div>
            <form onSubmit={handleQuestionSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-bold mb-2">
                  نص السؤال
                </label>
                <textarea
                  className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-yellow-500 outline-none"
                  rows="2"
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["a", "b", "c", "d"].map((char) => (
                  <div key={char}>
                    <label className="block text-xs font-bold mb-1 uppercase text-gray-500">
                      خيار {char}
                    </label>
                    <input
                      type="text"
                      className="w-full border-2 border-gray-100 p-2.5 rounded-xl focus:border-yellow-500 outline-none"
                      value={questionData[`choice_${char}`]}
                      onChange={(e) =>
                        setQuestionData({
                          ...questionData,
                          [`choice_${char}`]: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1 text-green-700">
                    الإجابة الصحيحة
                  </label>
                  <select
                    className="w-full border-2 border-green-100 p-2.5 rounded-xl focus:border-green-500 outline-none bg-green-50/50"
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
                </div>
                <div>
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
                <div>
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

              <div>
                <label className="block text-sm font-bold mb-1 text-blue-700">
                  التفسير (Explanation)
                </label>
                <textarea
                  className="w-full border-2 border-blue-50 p-2.5 rounded-xl focus:border-blue-500 outline-none bg-blue-50/20"
                  rows="2"
                  value={questionData.explanation}
                  onChange={(e) =>
                    setQuestionData({
                      ...questionData,
                      explanation: e.target.value,
                    })
                  }
                />
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-gray-900 transition-all"
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
