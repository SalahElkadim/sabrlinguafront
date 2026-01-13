// ============================================
// SectionsDashboard.jsx
// ============================================

import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  FolderTree,
  X,
  Loader2,
} from "lucide-react";
import axios from "axios";

const API_URL = "https://sabrlinguaa-production.up.railway.app/levels";

export function SectionsDashboard() {
  const [sections, setSections] = useState([]);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [formData, setFormData] = useState({
    unit: "",
    section_type: "",
    title: "",
    order: 0,
  });

  const SECTION_TYPES = [
    { value: "listening_speaking", label: "Listening & Speaking" },
    { value: "grammar", label: "Grammar" },
    { value: "reading", label: "Reading" },
    { value: "vocabulary", label: "Vocabulary" },
    { value: "writing", label: "Writing" },
    { value: "interactive", label: "Interactive Exercises" },
    { value: "quiz", label: "Quiz" },
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");
      const [sectionsRes, unitsRes] = await Promise.all([
        axios.get(`${API_URL}/sections/`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/units/`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setSections(sectionsRes.data);
      setUnits(unitsRes.data);
    } catch (error) {
      console.error("Error:", error);
      alert("حدث خطأ في تحميل البيانات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");
    try {
      if (editingSection) {
        await axios.put(`${API_URL}/sections/${editingSection.id}/`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("تم تحديث القسم بنجاح");
      } else {
        await axios.post(`${API_URL}/sections/`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("تم إضافة القسم بنجاح");
      }
      setShowModal(false);
      setFormData({ unit: "", section_type: "", title: "", order: 0 });
      setEditingSection(null);
      fetchData();
    } catch (error) {
      console.error("Error:", error);
      alert("حدث خطأ في حفظ القسم");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا القسم؟")) return;
    const token = localStorage.getItem("access_token");
    try {
      await axios.delete(`${API_URL}/sections/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("تم حذف القسم بنجاح");
      fetchData();
    } catch (error) {
      console.error("Error:", error);
      alert("حدث خطأ في حذف القسم");
    }
  };

  const filteredSections = sections.filter((section) =>
    section.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-black mb-2">إدارة الأقسام</h2>
        <p className="text-gray-600">إدارة أقسام الوحدات الدراسية</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative flex-1">
            <Search
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="البحث عن قسم..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-primary"
            />
          </div>
          <button
            onClick={() => {
              setEditingSection(null);
              setFormData({ unit: "", section_type: "", title: "", order: 0 });
              setShowModal(true);
            }}
            className="flex items-center gap-2 bg-yellow-primary text-black px-6 py-2 rounded-lg font-bold hover:bg-yellow-hover transition-all"
          >
            <Plus size={20} />
            <span>إضافة قسم جديد</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-yellow-primary" size={48} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSections.map((section) => (
            <div
              key={section.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-3 mb-4">
                <FolderTree className="text-yellow-primary" size={24} />
                <h3 className="font-bold text-lg">{section.title}</h3>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                الوحدة: {section.unit_title}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                النوع: {section.section_type_display}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingSection(section);
                    setFormData({
                      unit: section.unit,
                      section_type: section.section_type,
                      title: section.title,
                      order: section.order,
                    });
                    setShowModal(true);
                  }}
                  className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  تعديل
                </button>
                <button
                  onClick={() => handleDelete(section.id)}
                  className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-2xl font-bold">
                {editingSection ? "تعديل القسم" : "إضافة قسم جديد"}
              </h3>
              <button onClick={() => setShowModal(false)}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    الوحدة *
                  </label>
                  <select
                    value={formData.unit}
                    onChange={(e) =>
                      setFormData({ ...formData, unit: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-primary"
                  >
                    <option value="">اختر الوحدة</option>
                    {units.map((unit) => (
                      <option key={unit.id} value={unit.id}>
                        Unit {unit.number} - {unit.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    نوع القسم *
                  </label>
                  <select
                    value={formData.section_type}
                    onChange={(e) =>
                      setFormData({ ...formData, section_type: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-primary"
                  >
                    <option value="">اختر النوع</option>
                    {SECTION_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    عنوان القسم *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    الترتيب
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) =>
                      setFormData({ ...formData, order: e.target.value })
                    }
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-primary"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-3 border rounded-lg"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-yellow-primary text-black rounded-lg font-bold"
                >
                  {editingSection ? "تحديث" : "إضافة"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}




