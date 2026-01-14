import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  X,
  AlertCircle,
  Upload,
  FileText,
  Loader2,
} from "lucide-react";

export function LessonsDashboard() {
  const [lessons, setLessons] = useState([]);
  const [sections, setSections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSection, setFilterSection] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    section: "",
    title: "",
    content: "",
    file: null,
    order: 0,
  });

  const API_URL = "https://sabrlinguaa-production.up.railway.app/levels";

  // دالة للحصول على التوكن
  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    fetchLessons();
    fetchSections();
  }, []);

  const fetchLessons = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/lessons/`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      if (!response.ok) throw new Error("فشل تحميل الدروس");
      const data = await response.json();
      setLessons(data);
    } catch (err) {
      setError("حدث خطأ في تحميل الدروس");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSections = async () => {
    try {
      const response = await fetch(`${API_URL}/sections/`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      if (!response.ok) throw new Error("فشل تحميل الأقسام");
      const data = await response.json();
      setSections(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const formDataToSend = new FormData();
    formDataToSend.append("section", formData.section);
    formDataToSend.append("title", formData.title);
    formDataToSend.append("content", formData.content);
    formDataToSend.append("order", formData.order);
    if (formData.file) {
      formDataToSend.append("file", formData.file);
    }

    try {
      const url = editingLesson
        ? `${API_URL}/lessons/${editingLesson.id}/`
        : `${API_URL}/lessons/`;

      const method = editingLesson ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(JSON.stringify(errorData));
      }

      await fetchLessons();
      handleCloseModal();
    } catch (err) {
      setError(editingLesson ? "فشل تحديث الدرس" : "فشل إضافة الدرس");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا الدرس؟")) return;

    try {
      const response = await fetch(`${API_URL}/lessons/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (!response.ok) throw new Error("فشل حذف الدرس");
      await fetchLessons();
    } catch (err) {
      setError("حدث خطأ أثناء حذف الدرس");
      console.error(err);
    }
  };

  const handleEdit = (lesson) => {
    setEditingLesson(lesson);
    setFormData({
      section: lesson.section,
      title: lesson.title,
      content: lesson.content || "",
      file: null,
      order: lesson.order,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingLesson(null);
    setFormData({
      section: "",
      title: "",
      content: "",
      file: null,
      order: 0,
    });
    setError("");
  };

  const filteredLessons = lessons.filter((lesson) => {
    const matchesSearch = lesson.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesSection = filterSection
      ? lesson.section === parseInt(filterSection)
      : true;
    return matchesSearch && matchesSection;
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
        <h1 className="text-4xl font-bold text-black mb-2">إدارة الدروس</h1>
        <p className="text-gray-600">إدارة المحتوى التعليمي للأقسام</p>
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
              placeholder="البحث عن درس..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <select
            value={filterSection}
            onChange={(e) => setFilterSection(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value="">كل الأقسام</option>
            {sections.map((section) => (
              <option key={section.id} value={section.id}>
                {section.title}
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowModal(true)}
            className="bg-yellow-500 text-black px-6 py-2 rounded font-bold hover:bg-yellow-600 transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <Plus size={20} />
            إضافة درس جديد
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredLessons.map((lesson) => (
          <div
            key={lesson.id}
            className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-black mb-2">
                  {lesson.title}
                </h3>
                <p className="text-sm text-gray-600 mb-1">
                  القسم: {lesson.section_title}
                </p>
                <p className="text-sm text-gray-600">الترتيب: {lesson.order}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(lesson)}
                  className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(lesson.id)}
                  className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            {lesson.content && (
              <div className="mb-4 p-3 bg-gray-50 rounded">
                <p className="text-sm text-gray-600 line-clamp-3">
                  {lesson.content}
                </p>
              </div>
            )}

            {lesson.file && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FileText size={16} />
                <span>يحتوي على ملف مرفق</span>
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-gray-200">
              <span className="text-sm font-medium text-gray-600">
                عدد التمارين: {lesson.exercises_count}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredLessons.length === 0 && (
        <div className="text-center py-12">
          <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-xl text-gray-600">لا توجد دروس</p>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-black">
                {editingLesson ? "تعديل الدرس" : "إضافة درس جديد"}
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
                    القسم *
                  </label>
                  <select
                    value={formData.section}
                    onChange={(e) =>
                      setFormData({ ...formData, section: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    required
                  >
                    <option value="">اختر القسم</option>
                    {sections.map((section) => (
                      <option key={section.id} value={section.id}>
                        {section.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-black mb-2">
                    عنوان الدرس *
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
                    محتوى الدرس
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="اكتب محتوى الدرس هنا..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-black mb-2">
                    ملف مرفق
                  </label>
                  <input
                    type="file"
                    onChange={(e) =>
                      setFormData({ ...formData, file: e.target.files[0] })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
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
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-yellow-500 text-black px-6 py-3 rounded font-bold hover:bg-yellow-600 transition-all"
                >
                  {editingLesson ? "تحديث" : "إضافة"}
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
