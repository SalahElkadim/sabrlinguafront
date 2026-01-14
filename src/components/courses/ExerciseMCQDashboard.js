import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Loader2,
  FileText,
  Save,
  CheckCircle,
  Image,
  AlertCircle,
} from "lucide-react";

export function ExerciseMCQDashboard() {
  const [questions, setQuestions] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [error, setError] = useState("");
  const [selectedExerciseFilter, setSelectedExerciseFilter] = useState("");

  const [questionData, setQuestionData] = useState({
    exercise: "",
    question_text: "",
    question_image: null,
    choice_a: "",
    choice_b: "",
    choice_c: "",
    choice_d: "",
    correct_answer: "A",
    explanation: "",
    points: 1,
    order: 1,
    is_active: true,
  });

  const API_URL = "https://sabrlinguaa-production.up.railway.app/levels";
  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setIsLoading(true);
      const [questRes, exRes] = await Promise.all([
        fetch(`${API_URL}/mcq-questions/`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        }),
        fetch(`${API_URL}/exercises/`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        }),
      ]);
      setQuestions(await questRes.json());
      setExercises(await exRes.json());
    } catch (err) {
      setError("حدث خطأ في تحميل البيانات");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      
      Object.keys(questionData).forEach((key) => {
        if (key === "question_image") {
          if (questionData[key] && questionData[key] instanceof File) {
            formData.append(key, questionData[key]);
          }
        } else {
          formData.append(key, questionData[key]);
        }
      });

      const url = editingQuestion
        ? `${API_URL}/mcq-questions/${editingQuestion.id}/`
        : `${API_URL}/mcq-questions/`;
      
      const response = await fetch(url, {
        method: editingQuestion ? "PUT" : "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        body: formData,
      });

      if (response.ok) {
        await fetchInitialData();
        setShowQuestionModal(false);
        setEditingQuestion(null);
        resetQuestionForm();
      }
    } catch (err) {
      setError("خطأ في حفظ السؤال");
    }
  };

  const handleDeleteQuestion = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا السؤال؟")) return;
    
    try {
      const response = await fetch(`${API_URL}/mcq-questions/${id}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (response.ok) {
        await fetchInitialData();
      }
    } catch (err) {
      setError("خطأ في حذف السؤال");
    }
  };

  const resetQuestionForm = () => {
    setQuestionData({
      exercise: "",
      question_text: "",
      question_image: null,
      choice_a: "",
      choice_b: "",
      choice_c: "",
      choice_d: "",
      correct_answer: "A",
      explanation: "",
      points: 1,
      order: 1,
      is_active: true,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setQuestionData({ ...questionData, question_image: file });
    }
  };

  const filteredQuestions = selectedExerciseFilter
    ? questions.filter((q) => q.exercise === parseInt(selectedExerciseFilter))
    : questions;

  const questionsByExercise = exercises.map((exercise) => ({
    exercise,
    questions: questions.filter((q) => q.exercise === exercise.id),
  }));

  if (isLoading)
    return (
      <div className="flex justify-center h-screen items-center">
        <Loader2 className="animate-spin text-yellow-500" size={48} />
      </div>
    );

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir="rtl">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold text-black flex items-center gap-2">
            <FileText className="text-yellow-500" /> أسئلة الاختيار من متعدد (MCQ)
          </h1>
          <p className="text-gray-600 mt-1">
            إدارة أسئلة الاختيار المرتبطة بالتمارين (Grammar & Vocabulary)
          </p>
        </div>
        <button
          onClick={() => {
            resetQuestionForm();
            setEditingQuestion(null);
            setShowQuestionModal(true);
          }}
          className="bg-black text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-gray-800 transition-all"
        >
          <Plus size={20} /> إضافة سؤال جديد
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
        <div className="flex items-center gap-4">
          <label className="text-sm font-bold text-gray-700">
            تصفية حسب التمرين:
          </label>
          <select
            className="flex-1 max-w-md border-2 border-gray-200 p-2 rounded-lg focus:border-yellow-500 outline-none"
            value={selectedExerciseFilter}
            onChange={(e) => setSelectedExerciseFilter(e.target.value)}
          >
            <option value="">كل التمارين ({questions.length} سؤال)</option>
            {exercises.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.title} ({questions.filter((q) => q.exercise === ex.id).length})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-8">
        {questionsByExercise
          .filter((item) => 
            !selectedExerciseFilter || 
            item.exercise.id === parseInt(selectedExerciseFilter)
          )
          .map(({ exercise, questions: exQuestions }) => (
            <div
              key={exercise.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="p-4 bg-gradient-to-r from-yellow-50 to-gray-50 border-b flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-yellow-500 p-2 rounded-lg text-white">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">
                      {exercise.title}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {exQuestions.length} سؤال • {exercise.lesson_title}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setQuestionData({ ...questionData, exercise: exercise.id });
                    setEditingQuestion(null);
                    setShowQuestionModal(true);
                  }}
                  className="bg-green-600 text-white text-sm px-4 py-2 rounded-md hover:bg-green-700 flex items-center gap-2"
                >
                  <Plus size={16} /> سؤال جديد
                </button>
              </div>

              <div className="p-4">
                {exQuestions.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <AlertCircle className="mx-auto mb-2" size={32} />
                    <p>لا توجد أسئلة في هذا التمرين</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {exQuestions.map((q, idx) => (
                      <div
                        key={q.id}
                        className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition-all bg-gray-50/50"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-start gap-3 flex-1">
                            <span className="bg-black text-white text-xs font-bold px-2.5 py-1 rounded-full">
                              {idx + 1}
                            </span>
                            <div className="flex-1">
                              <p className="text-gray-800 font-medium mb-2">
                                {q.question_text}
                              </p>
                              {q.question_image && (
                                <div className="flex items-center gap-1 text-xs text-blue-600 mb-2">
                                  <Image size={14} />
                                  <span>يحتوي على صورة</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setEditingQuestion(q);
                                setQuestionData(q);
                                setShowQuestionModal(true);
                              }}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteQuestion(q.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mr-10">
                          {["a", "b", "c", "d"].map((choice) => (
                            <div
                              key={choice}
                              className={`p-2 rounded-md text-sm border ${
                                q.correct_answer === choice.toUpperCase()
                                  ? "bg-green-50 border-green-300 text-green-800"
                                  : "bg-white border-gray-200 text-gray-700"
                              }`}
                            >
                              <span className="font-bold uppercase mr-1">
                                {choice}:
                              </span>
                              {q[`choice_${choice}`]}
                              {q.correct_answer === choice.toUpperCase() && (
                                <CheckCircle
                                  size={14}
                                  className="inline mr-1 text-green-600"
                                />
                              )}
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500">
                          <div className="flex gap-4">
                            <span>النقاط: {q.points}</span>
                            <span>الترتيب: {q.order}</span>
                            <span
                              className={
                                q.is_active ? "text-green-600" : "text-red-600"
                              }
                            >
                              {q.is_active ? "نشط" : "غير نشط"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>

      {showQuestionModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-white z-10 flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center gap-2">
                {editingQuestion ? (
                  <>
                    <Edit2 size={20} /> تعديل السؤال
                  </>
                ) : (
                  <>
                    <Plus size={20} /> إضافة سؤال جديد
                  </>
                )}
              </h2>
              <button
                onClick={() => {
                  setShowQuestionModal(false);
                  setEditingQuestion(null);
                }}
                className="hover:bg-gray-200 p-1 rounded-full"
              >
                <X />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  التمرين المرتبط *
                </label>
                <select
                  className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-yellow-500 outline-none"
                  value={questionData.exercise}
                  onChange={(e) =>
                    setQuestionData({
                      ...questionData,
                      exercise: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">اختر التمرين...</option>
                  {exercises.map((ex) => (
                    <option key={ex.id} value={ex.id}>
                      {ex.title} - {ex.lesson_title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  نص السؤال *
                </label>
                <textarea
                  className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-yellow-500 outline-none"
                  rows="3"
                  placeholder="اكتب السؤال هنا..."
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

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  صورة السؤال (اختياري)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-yellow-500 outline-none"
                  onChange={handleImageChange}
                />
                {editingQuestion?.question_image && (
                  <p className="text-xs text-gray-500 mt-1">
                    صورة موجودة: {editingQuestion.question_image.split("/").pop()}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["a", "b", "c", "d"].map((char) => (
                  <div key={char}>
                    <label className="block text-xs font-bold mb-2 uppercase text-gray-600">
                      خيار {char.toUpperCase()} *
                    </label>
                    <input
                      type="text"
                      className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-yellow-500 outline-none"
                      placeholder={`الخيار ${char.toUpperCase()}`}
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

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2 text-green-700">
                    الإجابة الصحيحة *
                  </label>
                  <select
                    className="w-full border-2 border-green-100 p-3 rounded-xl focus:border-green-500 outline-none bg-green-50/50"
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
                  <label className="block text-sm font-bold mb-2 text-gray-700">
                    النقاط *
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-yellow-500 outline-none"
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
                  <label className="block text-sm font-bold mb-2 text-gray-700">
                    الترتيب *
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-yellow-500 outline-none"
                    value={questionData.order}
                    onChange={(e) =>
                      setQuestionData({
                        ...questionData,
                        order: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-700">
                    الحالة
                  </label>
                  <select
                    className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-yellow-500 outline-none"
                    value={questionData.is_active}
                    onChange={(e) =>
                      setQuestionData({
                        ...questionData,
                        is_active: e.target.value === "true",
                      })
                    }
                  >
                    <option value="true">نشط</option>
                    <option value="false">غير نشط</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 text-blue-700">
                  التفسير (Explanation)
                </label>
                <textarea
                  className="w-full border-2 border-blue-50 p-3 rounded-xl focus:border-blue-500 outline-none bg-blue-50/20"
                  rows="3"
                  placeholder="اشرح لماذا هذه الإجابة صحيحة..."
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
                onClick={handleQuestionSubmit}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-black py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Save size={20} /> حفظ السؤال
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="fixed bottom-4 left-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg">
          {error}
        </div>
      )}
    </div>
  );
}