// ============================================
// UnitsDashboard.jsx - صفحة إدارة الوحدات
// ============================================

import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  BookMarked,
  X,
  Loader2,
  FolderTree,
} from "lucide-react";
import axios from "axios";

const API_URL = "https://sabrlinguaa-production.up.railway.app/levels";

export default function UnitsDashboard() {
  const [units, setUnits] = useState([]);
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLevel, setFilterLevel] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingUnit, setEditingUnit] = useState(null);
  const [formData, setFormData] = useState({
    level: "",
    title: "",
    number: "",
  });

  // Fetch units and levels
  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");

      const [unitsRes, levelsRes] = await Promise.all([
        axios.get(`${API_URL}/units/`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/levels/`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setUnits(unitsRes.data);
      setLevels(levelsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("حدث خطأ في تحميل البيانات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");

    try {
      if (editingUnit) {
        await axios.put(`${API_URL}/units/${editingUnit.id}/`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("تم تحديث الوحدة بنجاح");
      } else {
        await axios.post(`${API_URL}/units/`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("تم إضافة الوحدة بنجاح");
      }

      setShowModal(false);
      setFormData({ level: "", title: "", number: "" });
      setEditingUnit(null);
      fetchData();
    } catch (error) {
      console.error("Error saving unit:", error);
      alert("حدث خطأ في حفظ الوحدة");
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذه الوحدة؟")) return;

    const token = localStorage.getItem("access_token");
    try {
      await axios.delete(`${API_URL}/units/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("تم حذف الوحدة بنجاح");
      fetchData();
    } catch (error) {
      console.error("Error deleting unit:", error);
      alert("حدث خطأ في حذف الوحدة");
    }
  };

  // Handle edit
  const handleEdit = (unit) => {
    setEditingUnit(unit);
    setFormData({
      level: unit.level,
      title: unit.title,
      number: unit.number,
    });
    setShowModal(true);
  };

  // Filter units
  const filteredUnits = units.filter((unit) => {
    const matchesSearch =
      unit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unit.number.toString().includes(searchTerm);
    const matchesLevel =
      filterLevel === "" || unit.level.toString() === filterLevel;
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-black mb-2">إدارة الوحدات</h2>
        <p className="text-gray-600">إدارة الوحدات الدراسية لكل مستوى</p>
      </div>

      {/* Actions Bar */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
          <div className="flex flex-col md:flex-row gap-4 flex-1 w-full">
            {/* Search */}
            <div className="relative flex-1">
              <Search
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="البحث عن وحدة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-primary"
              />
            </div>

            {/* Level Filter */}
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-primary"
            >
              <option value="">كل المستويات</option>
              {levels.map((level) => (
                <option key={level.id} value={level.id}>
                  {level.code} - {level.name}
                </option>
              ))}
            </select>
          </div>

          {/* Add Button */}
          <button
            onClick={() => {
              setEditingUnit(null);
              setFormData({ level: "", title: "", number: "" });
              setShowModal(true);
            }}
            className="flex items-center gap-2 bg-yellow-primary text-black px-6 py-2 rounded-lg font-bold hover:bg-yellow-hover transition-all shadow-md hover:shadow-lg w-full lg:w-auto"
          >
            <Plus size={20} />
            <span>إضافة وحدة جديدة</span>
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-yellow-primary" size={48} />
        </div>
      ) : (
        /* Units Table */
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">
                    رقم الوحدة
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">
                    عنوان الوحدة
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">
                    المستوى
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">
                    عدد الأقسام
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUnits.map((unit) => (
                  <tr
                    key={unit.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-yellow-primary bg-opacity-10 rounded-lg">
                          <BookMarked
                            className="text-yellow-primary"
                            size={20}
                          />
                        </div>
                        <span className="font-bold text-lg text-gray-900">
                          Unit {unit.number}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-900 font-semibold">
                        {unit.title}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                        {unit.level_name}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <FolderTree className="text-gray-400" size={16} />
                        <span className="font-bold text-gray-700">
                          {unit.sections_count || 0}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(unit)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="تعديل"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(unit.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="حذف"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Empty State */}
            {filteredUnits.length === 0 && (
              <div className="text-center py-16">
                <BookMarked className="mx-auto text-gray-300 mb-4" size={64} />
                <p className="text-gray-500 text-lg">
                  {searchTerm || filterLevel
                    ? "لا توجد وحدات مطابقة للبحث"
                    : "لا توجد وحدات حالياً"}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-2xl font-bold text-black">
                {editingUnit ? "تعديل الوحدة" : "إضافة وحدة جديدة"}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingUnit(null);
                  setFormData({ level: "", title: "", number: "" });
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    المستوى <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.level}
                    onChange={(e) =>
                      setFormData({ ...formData, level: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-primary"
                  >
                    <option value="">اختر المستوى</option>
                    {levels.map((level) => (
                      <option key={level.id} value={level.id}>
                        {level.code} - {level.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    رقم الوحدة <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.number}
                    onChange={(e) =>
                      setFormData({ ...formData, number: e.target.value })
                    }
                    placeholder="1, 2, 3..."
                    required
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    عنوان الوحدة <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="مثال: Introduction to English"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-primary"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingUnit(null);
                    setFormData({ level: "", title: "", number: "" });
                  }}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-semibold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-yellow-primary text-black rounded-lg hover:bg-yellow-hover transition-all font-bold shadow-md hover:shadow-lg"
                >
                  {editingUnit ? "تحديث الوحدة" : "إضافة الوحدة"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
