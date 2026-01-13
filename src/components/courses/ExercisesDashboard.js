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
  Target,
  HelpCircle,
} from "lucide-react";

export function ExercisesDashboard() {
  const [exercises, setExercises] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingExercise, setEditingExercise] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLesson, setFilterLesson] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    lesson: "",
    title: "",
    description: "",
    order: 0,
    is_active: true,
  });

const API_URL = "https://sabrlinguaa-production.up.railway.app/levels";

  useEffect(() => {
    fetchExercises();
    fetchLessons();
  }, []);

  const fetchExercises = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/exercises/`);
      if (!response.ok) throw new Error("فشل تحميل التمارين");
      const data = await response.json();
      setExercises(data);
    } catch (err) {
      setError("حدث خطأ في تحميل التمارين");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLessons = async () => {
    try {
      const response = await fetch(`${API_URL}/lessons/`);
      if (!response.ok) throw new Error("فشل تحميل الدروس");
      const data = await response.json();
      setLessons(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const url = editingExercise
        ? `${API_URL}/exercises/${editingExercise.id}/`
        : `${API_URL}/exercises/`;

      const method = editingExercise ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(JSON.stringify(errorData));
      }

      await fetchExercises();
      handleCloseModal();
    } catch (err) {
      setError(editingExercise ? "فشل تحديث التمرين" : "فشل إضافة التمرين");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا التمرين؟")) return;

    try {
      const response = await fetch(`${API_URL}/exercises/${id}/`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("فشل حذف التمرين");
      await fetchExercises();
    } catch (err) {
      setError("حدث خطأ أثناء حذف التمرين");
      console.error(err);
    }
  };

  const handleEdit = (exercise) => {
    setEditingExercise(exercise);
    setFormData({
      lesson: exercise.lesson,
      title: exercise.title,
      description: exercise.description || "",
      order: exercise.order,
      is_active: exercise.is_active,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingExercise(null);
    setFormData({
      lesson: "",
      title: "",
      description: "",
      order: 0,
      is_active: true,
    });
    setError("");
  };

  const toggleActive = async (exercise) => {
    try {
      const response = await fetch(`${API_URL}/exercises/${exercise.id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...exercise,
          is_active: !exercise.is_active,
        }),
      });

      if (!response.ok) throw new Error("فشل تحديث الحالة");
      await fetchExercises();
    } catch (err) {
      setError("حدث خطأ أثناء تحديث الحالة");
      console.error(err);
    }
  };

  const filteredExercises = exercises.filter((exercise) => {
    const matchesSearch = exercise.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesLesson = filterLesson
      ? exercise.lesson === parseInt(filterLesson)
      : true;
    return matchesSearch && matchesLesson;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-yellow-500" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir="rtl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-black mb-2">إدارة التمارين</h1>
        <p className="text-gray-600">إدارة التمارين والأسئلة التعليمية</p>
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
              placeholder="البحث عن تمرين..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <select
            value={filterLesson}
            onChange={(e) => setFilterLesson(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value="">كل الدروس</option>
            {lessons.map((lesson) => (
              <option key={lesson.id} value={lesson.id}>
                {lesson.title}
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowModal(true)}
            className="bg-yellow-500 text-black px-6 py-2 rounded font-bold hover:bg-yellow-600 transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <Plus size={20} />
            إضافة تمرين جديد
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredExercises.map((exercise) => (
          <div
            key={exercise.id}
            className={`bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6 ${
              !exercise.is_active ? "opacity-60" : ""
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-bold text-black">
                    {exercise.title}
                  </h3>
                  {exercise.is_active ? (
                    <CheckCircle size={20} className="text-green-500" />
                  ) : (
                    <X size={20} className="text-red-500" />
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-1">
                  الدرس: {exercise.lesson_title}
                </p>
                <p className="text-sm text-gray-600">
                  الترتيب: {exercise.order}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(exercise)}
                  className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(exercise.id)}
                  className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            {exercise.description && (
              <div className="mb-4 p-3 bg-gray-50 rounded">
                <p className="text-sm text-gray-600">{exercise.description}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Target size={16} className="text-yellow-500" />
                <span className="text-sm font-medium">
                  النقاط: {exercise.total_points}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <HelpCircle size={16} className="text-blue-500" />
                <span className="text-sm font-medium">
                  الأسئلة: {exercise.questions_count}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={() => toggleActive(exercise)}
                className={`w-full py-2 px-4 rounded font-medium transition-colors ${
                  exercise.is_active
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                }`}
              >
                {exercise.is_active ? "نشط" : "غير نشط"}
              </button>
            </div>

            <div className="mt-3 text-xs text-gray-500 text-center">
              آخر تحديث:{" "}
              {new Date(exercise.updated_at).toLocaleDateString("ar-EG")}
            </div>
          </div>
        ))}
      </div>

      {filteredExercises.length === 0 && (
        <div className="text-center py-12">
          <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-xl text-gray-600">لا توجد تمارين</p>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-black">
                {editingExercise ? "تعديل التمرين" : "إضافة تمرين جديد"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-black mb-2">
                    الدرس *
                  </label>
                  <select
                    value={formData.lesson}
                    onChange={(e) =>
                      setFormData({ ...formData, lesson: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    required
                  >
                    <option value="">اختر الدرس</option>
                    {lessons.map((lesson) => (
                      <option key={lesson.id} value={lesson.id}>
                        {lesson.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-black mb-2">
                    عنوان التمرين *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-black mb-2">
                    وصف التمرين
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="اكتب وصف التمرين هنا..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-black mb-2">
                    الترتيب *
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) =>
                      setFormData({ ...formData, order: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    min="0"
                    required
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) =>
                      setFormData({ ...formData, is_active: e.target.checked })
                    }
                    className="w-5 h-5 text-yellow-500 border-gray-300 rounded focus:ring-2 focus:ring-yellow-500"
                  />
                  <label
                    htmlFor="is_active"
                    className="text-sm font-bold text-black"
                  >
                    التمرين نشط
                  </label>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-yellow-500 text-black px-6 py-3 rounded font-bold hover:bg-yellow-600 transition-all"
                >
                  {editingExercise ? "تحديث" : "إضافة"}
                </button>
                <button
                  onClick={handleCloseModal}
                  className="flex-1 bg-gray-300 text-black px-6 py-3 rounded font-bold hover:bg-gray-400 transition-all"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
