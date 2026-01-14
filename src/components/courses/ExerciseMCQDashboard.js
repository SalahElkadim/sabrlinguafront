import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  X,
  AlertCircle,
  Loader2,
  CheckCircle,
  Image as ImageIcon,
} from "lucide-react";

export function ExerciseMCQDashboard() {
  const [questions, setQuestions] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterExercise, setFilterExercise] = useState("");
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
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
  });

  const API_URL = "https://sabrlinguaa-production.up.railway.app/levels";
  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    fetchQuestions();
    fetchExercises();
  }, []);

  const fetchQuestions = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/mcq-questions/`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!response.ok) throw new Error("فشل تحميل الأسئلة");
      const data = await response.json();
      setQuestions(data);
    } catch (err) {
      setError("حدث خطأ في تحميل الأسئلة");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchExercises = async () => {
    try {
      const response = await fetch(`${API_URL}/exercises/`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!response.ok) throw new Error("فشل تحميل التمارين");
      const data = await response.json();
      setExercises(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "question_image" && formData[key]) {
        formDataToSend.append(key, formData[key]);
      } else if (key !== "question_image") {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      const url = editingQuestion
        ? `${API_URL}/mcq-questions/${editingQuestion.id}/`
        : `${API_URL}/mcq-questions/`;

      const method = editingQuestion ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${getToken()}` },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(JSON.stringify(errorData));
      }

      await fetchQuestions();
      handleCloseModal();
    } catch (err) {
      setError(editingQuestion ? "فشل تحديث السؤال" : "فشل إضافة السؤال");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا السؤال؟")) return;

    try {
      const response = await fetch(`${API_URL}/mcq-questions/${id}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      if (!response.ok) throw new Error("فشل حذف السؤال");
      await fetchQuestions();
    } catch (err) {
      setError("حدث خطأ أثناء حذف السؤال");
      console.error(err);
    }
  };

  const handleEdit = (question) => {
    setEditingQuestion(question);
    setFormData({
      exercise: question.exercise,
      question_text: question.question_text,
      question_image: null,
      choice_a: question.choice_a,
      choice_b: question.choice_b,
      choice_c: question.choice_c,
      choice_d: question.choice_d,
      correct_answer: question.correct_answer,
      explanation: question.explanation || "",
      points: question.points,
      order: question.order,
    });
    if (question.question_image) {
      setImagePreview(question.question_image);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingQuestion(null);
    setFormData({
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
    });
    setImagePreview(null);
    setError("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, question_image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredQuestions = questions.filter((question) => {
    const matchesSearch = question.question_text
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesExercise = filterExercise
      ? question.exercise === parseInt(filterExercise)
      : true;
    return matchesSearch && matchesExercise;
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] w-full">
        <Loader2 className="w-12 h-12 animate-spin text-yellow-500 mb-2" />
        <p className="text-gray-500 font-medium">جاري تحميل الأسئلة...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir="rtl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-black mb-2">
          أسئلة الاختيار من متعدد - التمارين
        </h1>
        <p className="text-gray-600">إدارة أسئلة MCQ للتمارين</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded flex items-center gap-2">
          <AlertCircle size={20} />
          <span>{error}</span>
          <button onClick={() => setError("")} className="mr-auto">
            <X size={20} />
          </button>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="البحث عن سؤال..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <select
            value={filterExercise}
            onChange={(e) => setFilterExercise(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value="">كل التمارين</option>
            {exercises.map((exercise) => (
              <option key={exercise.id} value={exercise.id}>
                {exercise.title}
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowModal(true)}
            className="bg-yellow-500 text-black px-6 py-2 rounded font-bold hover:bg-yellow-600 transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <Plus size={20} />
            إضافة سؤال جديد
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredQuestions.map((question, index) => (
          <div
            key={question.id}
            className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center font-bold text-white">
                {index + 1}
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold text-black flex-1">
                    {question.question_text}
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(question)}
                      className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(question.id)}
                      className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {question.question_image && (
                  <img
                    src={question.question_image}
                    alt="سؤال"
                    className="mb-4 rounded-lg max-h-48 object-contain border-2 border-gray-300"
                  />
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  {["A", "B", "C", "D"].map((choice) => (
                    <div
                      key={choice}
                      className={`p-3 rounded border-2 ${
                        question.correct_answer === choice
                          ? "bg-green-50 border-green-500"
                          : "bg-gray-50 border-gray-300"
                      }`}
                    >
                      <span className="font-bold text-black">{choice}:</span>{" "}
                      <span className="text-gray-700">
                        {question[`choice_${choice.toLowerCase()}`]}
                      </span>
                      {question.correct_answer === choice && (
                        <CheckCircle
                          size={16}
                          className="inline-block mr-2 text-green-600"
                        />
                      )}
                    </div>
                  ))}
                </div>

                {question.explanation && (
                  <div className="bg-yellow-50 p-3 rounded mb-3 border border-yellow-300">
                    <p className="text-sm text-gray-700">
                      <span className="font-bold text-black">الشرح:</span>{" "}
                      {question.explanation}
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>التمرين: {question.exercise_title}</span>
                  <span>النقاط: {question.points}</span>
                  <span>الترتيب: {question.order}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredQuestions.length === 0 && (
        <div className="text-center py-12">
          <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-xl text-gray-600">لا توجد أسئلة</p>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-black">
                {editingQuestion ? "تعديل السؤال" : "إضافة سؤال جديد"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-bold text-black mb-2">
                  التمرين *
                </label>
                <select
                  value={formData.exercise}
                  onChange={(e) =>
                    setFormData({ ...formData, exercise: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                >
                  <option value="">اختر التمرين</option>
                  {exercises.map((exercise) => (
                    <option key={exercise.id} value={exercise.id}>
                      {exercise.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-black mb-2">
                  نص السؤال *
                </label>
                <textarea
                  value={formData.question_text}
                  onChange={(e) =>
                    setFormData({ ...formData, question_text: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
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
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="معاينة"
                    className="mt-3 rounded-lg max-h-48 object-contain border-2 border-gray-300"
                  />
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["A", "B", "C", "D"].map((choice) => (
                  <div key={choice}>
                    <label className="block text-sm font-bold text-black mb-2">
                      الخيار {choice} *
                    </label>
                    <input
                      type="text"
                      value={formData[`choice_${choice.toLowerCase()}`]}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [`choice_${choice.toLowerCase()}`]: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      required
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-bold text-black mb-2">
                  الإجابة الصحيحة *
                </label>
                <select
                  value={formData.correct_answer}
                  onChange={(e) =>
                    setFormData({ ...formData, correct_answer: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
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
                  value={formData.explanation}
                  onChange={(e) =>
                    setFormData({ ...formData, explanation: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
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
                    value={formData.points}
                    onChange={(e) =>
                      setFormData({ ...formData, points: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-black mb-2">
                    الترتيب *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.order}
                    onChange={(e) =>
                      setFormData({ ...formData, order: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-yellow-500 text-black px-6 py-3 rounded font-bold hover:bg-yellow-600 transition-all"
                >
                  {editingQuestion ? "تحديث" : "إضافة"}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 bg-gray-300 text-black px-6 py-3 rounded font-bold hover:bg-gray-400 transition-all"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
