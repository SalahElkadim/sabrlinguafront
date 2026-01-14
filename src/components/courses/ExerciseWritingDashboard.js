import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Loader2,
  PenTool,
  Save,
  FileText,
  Type,
  Hash,
  Star,
} from "lucide-react";

export function ExerciseWritingDashboard() {
  const [writingQuestions, setWritingQuestions] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [error, setError] = useState("");

  // بيانات سؤال الكتابة
  const [formData, setFormData] = useState({
    exercise: "",
    question_text: "",
    min_words: 50, // حقل اختياري إذا كنت أضفته في الموديل
    points: 10,
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
      const [questRes, exRes] = await Promise.all([
        fetch(`${API_URL}/writing-questions/`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        }),
        fetch(`${API_URL}/exercises/`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        }),
      ]);
      setWritingQuestions(await questRes.json());
      setExercises(await exRes.json());
    } catch (err) {
      setError("حدث خطأ في تحميل بيانات الكتابة");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingQuestion
        ? `${API_URL}/writing-questions/${editingQuestion.id}/`
        : `${API_URL}/writing-questions/`;

      const response = await fetch(url, {
        method: editingQuestion ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchData();
        setShowModal(false);
        setEditingQuestion(null);
        setFormData({ exercise: "", question_text: "", points: 10, order: 1 });
      }
    } catch (err) {
      setError("فشل في حفظ سؤال الكتابة");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذا السؤال؟")) {
      try {
        const response = await fetch(`${API_URL}/writing-questions/${id}/`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        if (response.ok) fetchData();
      } catch (err) {
        setError("فشل الحذف");
      }
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
      <div className="flex justify-between items-center mb-8 border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold text-black flex items-center gap-3">
            <PenTool className="text-blue-600" /> تمارين الكتابة (Writing)
          </h1>
          <p className="text-gray-600 mt-1">
            إنشاء موضوعات التعبير وأسئلة الكتابة الحرة
          </p>
        </div>
        <button
          onClick={() => {
            setEditingQuestion(null);
            setShowModal(true);
          }}
          className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 shadow-lg transition-all"
        >
          <Plus size={20} /> إضافة سؤال كتابة
        </button>
      </div>

      {/* Questions List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {writingQuestions.map((question) => (
          <div
            key={question.id}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-2 h-full bg-blue-600"></div>

            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                <Hash size={12} /> سؤال {question.order}
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => {
                    setEditingQuestion(question);
                    setFormData(question);
                    setShowModal(true);
                  }}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(question.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <h3 className="text-lg font-bold text-gray-800 mb-3 leading-relaxed">
              {question.question_text}
            </h3>

            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-50">
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Star size={14} className="text-yellow-500 fill-yellow-500" />
                <span>{question.points} نقطة</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <FileText size={14} />
                <span>
                  {exercises.find((ex) => ex.id === question.exercise)?.title ||
                    "تمرين عام"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- Modal Form --- */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <PenTool size={22} className="text-blue-600" />
                {editingQuestion ? "تعديل السؤال" : "سؤال كتابة جديد"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  التمرين المرتبط
                </label>
                <select
                  className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-blue-500 outline-none transition-all"
                  value={formData.exercise}
                  onChange={(e) =>
                    setFormData({ ...formData, exercise: e.target.value })
                  }
                  required
                >
                  <option value="">اختر التمرين المخصص للكتابة...</option>
                  {exercises.map((ex) => (
                    <option key={ex.id} value={ex.id}>
                      {ex.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  نص السؤال أو موضوع الكتابة
                </label>
                <textarea
                  className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-blue-500 outline-none min-h-[150px]"
                  placeholder="مثال: Write an essay about the advantages and disadvantages of online learning..."
                  value={formData.question_text}
                  onChange={(e) =>
                    setFormData({ ...formData, question_text: e.target.value })
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    النقاط
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-blue-500 outline-none pr-10"
                      value={formData.points}
                      onChange={(e) =>
                        setFormData({ ...formData, points: e.target.value })
                      }
                      required
                    />
                    <Star
                      className="absolute left-3 top-3.5 text-gray-300"
                      size={18}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    الترتيب
                  </label>
                  <input
                    type="number"
                    className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-blue-500 outline-none"
                    value={formData.order}
                    onChange={(e) =>
                      setFormData({ ...formData, order: e.target.value })
                    }
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Save size={20} />{" "}
                {editingQuestion ? "تحديث السؤال" : "حفظ السؤال"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
