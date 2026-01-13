// ============================================
// LevelsDashboard.jsx - صفحة إدارة المستويات
// ============================================

import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search, BookOpen, X, Loader2 } from "lucide-react";
import axios from "axios";

const API_URL = "https://sabrlinguaa-production.up.railway.app/levels";

export default function LevelsDashboard() {
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingLevel, setEditingLevel] = useState(null);
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
  });

  // Fetch levels from API
  const fetchLevels = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");
      const response = await axios.get(`${API_URL}/levels/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLevels(response.data);
    } catch (error) {
      console.error("Error fetching levels:", error);
      alert("حدث خطأ في تحميل المستويات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLevels();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");

    try {
      if (editingLevel) {
        // Update existing level
        await axios.put(`${API_URL}/levels/${editingLevel.id}/`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("تم تحديث المستوى بنجاح");
      } else {
        // Create new level
        await axios.post(`${API_URL}/levels/`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("تم إضافة المستوى بنجاح");
      }

      setShowModal(false);
      setFormData({ code: "", name: "", description: "" });
      setEditingLevel(null);
      fetchLevels();
    } catch (error) {
      console.error("Error saving level:", error);
      alert("حدث خطأ في حفظ المستوى");
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا المستوى؟")) return;

    const token = localStorage.getItem("access_token");
    try {
      await axios.delete(`${API_URL}/levels/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("تم حذف المستوى بنجاح");
      fetchLevels();
    } catch (error) {
      console.error("Error deleting level:", error);
      alert("حدث خطأ في حذف المستوى");
    }
  };

  // Handle edit
  const handleEdit = (level) => {
    setEditingLevel(level);
    setFormData({
      code: level.code,
      name: level.name,
      description: level.description,
    });
    setShowModal(true);
  };

  // Filter levels based on search
  const filteredLevels = levels.filter(
    (level) =>
      level.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      level.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-black mb-2">إدارة المستويات</h2>
        <p className="text-gray-600">إدارة مستويات اللغة (A1, A2, B1, B2)</p>
      </div>

      {/* Actions Bar */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* Search */}
          <div className="relative flex-1 w-full md:w-auto">
            <Search
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="البحث عن مستوى..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-primary"
            />
          </div>

          {/* Add Button */}
          <button
            onClick={() => {
              setEditingLevel(null);
              setFormData({ code: "", name: "", description: "" });
              setShowModal(true);
            }}
            className="flex items-center gap-2 bg-yellow-primary text-black px-6 py-2 rounded-lg font-bold hover:bg-yellow-hover transition-all shadow-md hover:shadow-lg"
          >
            <Plus size={20} />
            <span>إضافة مستوى جديد</span>
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-yellow-primary" size={48} />
        </div>
      ) : (
        /* Levels Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredLevels.map((level) => (
            <div
              key={level.id}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6"
            >
              {/* Level Icon */}
              <div className="flex items-center justify-center w-16 h-16 bg-yellow-primary bg-opacity-10 rounded-full mb-4 mx-auto">
                <BookOpen className="text-yellow-primary" size={32} />
              </div>

              {/* Level Code */}
              <h3 className="text-2xl font-bold text-center text-black mb-2">
                {level.code}
              </h3>

              {/* Level Name */}
              <p className="text-center text-gray-600 font-semibold mb-3">
                {level.name}
              </p>

              {/* Description */}
              <p className="text-sm text-gray-500 text-center mb-4 line-clamp-3">
                {level.description}
              </p>

              {/* Stats */}
              <div className="flex justify-center gap-4 mb-4 pb-4 border-b">
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-primary">
                    {level.units_count || 0}
                  </p>
                  <p className="text-xs text-gray-500">وحدة</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(level)}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all"
                >
                  <Edit size={16} />
                  <span>تعديل</span>
                </button>
                <button
                  onClick={() => handleDelete(level.id)}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all"
                >
                  <Trash2 size={16} />
                  <span>حذف</span>
                </button>
              </div>
            </div>
          ))}

          {/* Empty State */}
          {filteredLevels.length === 0 && (
            <div className="col-span-full text-center py-16">
              <BookOpen className="mx-auto text-gray-300 mb-4" size={64} />
              <p className="text-gray-500 text-lg">
                {searchTerm
                  ? "لا توجد مستويات مطابقة للبحث"
                  : "لا توجد مستويات حالياً"}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-2xl font-bold text-black">
                {editingLevel ? "تعديل المستوى" : "إضافة مستوى جديد"}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingLevel(null);
                  setFormData({ code: "", name: "", description: "" });
                }}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                {/* Code Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    رمز المستوى <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value })
                    }
                    placeholder="مثال: A1"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-primary"
                  />
                </div>

                {/* Name Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    اسم المستوى <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="مثال: المستوى الأول"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-primary"
                  />
                </div>

                {/* Description Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    الوصف <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="وصف المستوى..."
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-primary resize-none"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 mt-6 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingLevel(null);
                    setFormData({ code: "", name: "", description: "" });
                  }}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-semibold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-yellow-primary text-black rounded-lg hover:bg-yellow-hover transition-all font-bold shadow-md hover:shadow-lg"
                >
                  {editingLevel ? "تحديث المستوى" : "إضافة المستوى"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
