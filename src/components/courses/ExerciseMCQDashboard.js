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
    } finally {
      setIsLoading(false);
    }
  };

  const fetchExercises = async () => {
    try {
      const response = await fetch(`${API_URL}/exercises/`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
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
      const response = await fetch(url, {
        method: editingQuestion ? "PUT" : "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
        body: formDataToSend,
      });
      if (!response.ok) throw new Error("فشل الحفظ");
      await fetchQuestions();
      handleCloseModal();
    } catch (err) {
      setError("حدث خطأ أثناء حفظ البيانات");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد؟")) return;
    try {
      await fetch(`${API_URL}/mcq-questions/${id}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      await fetchQuestions();
    } catch (err) {
      setError("فشل الحذف");
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
    setImagePreview(question.question_image);
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
  };

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch = q.question_text
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesExercise = filterExercise
      ? q.exercise === parseInt(filterExercise)
      : true;
    return matchesSearch && matchesExercise;
  });

  // تم حل مشكلة الاختفاء باستخدام min-h-[400px] بدلاً من h-screen
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] w-full py-20">
        <Loader2 className="w-12 h-12 animate-spin text-yellow-500 mb-2" />
        <p className="text-gray-500 font-medium">جاري تحميل الأسئلة...</p>
      </div>
    );
  }

  return (
    <div
      className="w-full max-w-full overflow-x-hidden p-4 md:p-6 bg-gray-50 min-h-screen"
      dir="rtl"
    >
      {/* Header - متجاوب */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-4xl font-bold text-black mb-2">
          أسئلة الاختيار - التمارين
        </h1>
        <p className="text-sm md:text-base text-gray-600">
          إدارة أسئلة MCQ للتمارين
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded flex items-center gap-2">
          <AlertCircle size={20} />
          <span className="flex-1 text-sm">{error}</span>
          <button onClick={() => setError("")}>
            <X size={20} />
          </button>
        </div>
      )}

      {/* شريط البحث والفلترة - تم تعديله للموبايل */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="البحث عن سؤال..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-500 outline-none text-sm"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={filterExercise}
              onChange={(e) => setFilterExercise(e.target.value)}
              className="w-full sm:w-48 px-4 py-2 border border-gray-300 rounded text-sm outline-none"
            >
              <option value="">كل التمارين</option>
              {exercises.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.title}
                </option>
              ))}
            </select>

            <button
              onClick={() => setShowModal(true)}
              className="w-full sm:w-auto bg-yellow-500 text-black px-4 py-2 rounded font-bold hover:bg-yellow-600 flex items-center justify-center gap-2 text-sm whitespace-nowrap"
            >
              <Plus size={18} /> إضافة سؤال
            </button>
          </div>
        </div>
      </div>

      {/* قائمة الأسئلة */}
      <div className="space-y-4">
        {filteredQuestions.map((question, index) => (
          <div
            key={question.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="hidden md:flex flex-shrink-0 w-10 h-10 bg-yellow-500 rounded-full items-center justify-center font-bold text-white">
                {index + 1}
              </div>

              <div className="flex-1 overflow-hidden">
                <div className="flex justify-between items-start gap-2 mb-4">
                  <h3 className="text-lg font-bold text-gray-800 leading-tight">
                    <span className="md:hidden text-yellow-600 ml-1">
                      {index + 1}.
                    </span>{" "}
                    {question.question_text}
                  </h3>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleEdit(question)}
                      className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(question.id)}
                      className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {question.question_image && (
                  <div className="mb-4 flex justify-center md:justify-start">
                    <img
                      src={question.question_image}
                      alt="سؤال"
                      className="rounded-lg max-h-48 w-full md:w-auto object-contain border border-gray-200"
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  {["a", "b", "c", "d"].map((key) => (
                    <div
                      key={key}
                      className={`p-3 rounded-lg border ${
                        question.correct_answer === key.toUpperCase()
                          ? "bg-green-50 border-green-500"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <span className="font-bold uppercase ml-2 text-gray-500">
                        {key}:
                      </span>
                      <span className="text-sm text-gray-700">
                        {question[`choice_${key}`]}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-4 text-xs text-gray-500 border-t pt-3">
                  <span className="bg-gray-100 px-2 py-1 rounded">
                    التمرين: {question.exercise_title}
                  </span>
                  <span className="bg-gray-100 px-2 py-1 rounded">
                    النقاط: {question.points}
                  </span>
                  <span className="bg-gray-100 px-2 py-1 rounded">
                    الترتيب: {question.order}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* المودال - تم تعديله للموبايل */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-2 md:p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[95vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center z-10">
              <h2 className="text-xl font-bold">
                {editingQuestion ? "تعديل السؤال" : "إضافة سؤال"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4">
              {/* الحقول هنا تبقى كما هي لكن تأكد من استخدام grid-cols-1 للموبايل */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold mb-1">
                    السؤال *
                  </label>
                  <textarea
                    className="w-full p-2 border rounded-lg h-20 outline-none focus:ring-2 focus:ring-yellow-500"
                    value={formData.question_text}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        question_text: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                {/* ... بقية حقول الفورم ... */}
              </div>
              <button
                type="submit"
                className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors"
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
