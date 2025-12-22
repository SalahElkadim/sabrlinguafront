import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Search, X } from "lucide-react";

const API_URL =
  "https://sabrlinguaa-production.up.railway.app/questions";

export default function PlacementTestsDashboard() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterActive, setFilterActive] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedTest, setSelectedTest] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [testToDelete, setTestToDelete] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    passing_score: "",
    total_score: "",
    is_active: true,
  });

  useEffect(() => {
    fetchTests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTests = async () => {
    setLoading(true);
    try {
      const url =
        filterActive === "all"
          ? `${API_URL}/tests/`
          : `${API_URL}/tests/?is_active=${filterActive === "active"}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const result = await response.json();
      if (result.success) {
        setTests(result.data);
      }
    } catch (error) {
      console.error("خطأ في جلب البيانات:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (
      !formData.title ||
      !formData.duration ||
      !formData.passing_score ||
      !formData.total_score
    ) {
      alert("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    setLoading(true);
    try {
      const url =
        modalMode === "create"
          ? `${API_URL}/tests/`
          : `${API_URL}/tests/${selectedTest.id}/`;

      const method = modalMode === "create" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        alert(result.message);
        setShowModal(false);
        resetForm();
        fetchTests();
      } else {
        alert("حدث خطأ: " + JSON.stringify(result.errors));
      }
    } catch (error) {
      console.error("خطأ:", error);
      alert("حدث خطأ في العملية");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/tests/${testToDelete.id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const result = await response.json();
      if (result.success) {
        alert(result.message);
        setShowDeleteConfirm(false);
        setTestToDelete(null);
        fetchTests();
      }
    } catch (error) {
      console.error("خطأ في الحذف:", error);
      alert("حدث خطأ في عملية الحذف");
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setModalMode("create");
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (test) => {
    setModalMode("edit");
    setSelectedTest(test);
    setFormData({
      title: test.title,
      description: test.description || "",
      duration: test.duration,
      passing_score: test.passing_score,
      total_score: test.total_score,
      is_active: test.is_active,
    });
    setShowModal(true);
  };

  const openDeleteConfirm = (test) => {
    setTestToDelete(test);
    setShowDeleteConfirm(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      duration: "",
      passing_score: "",
      total_score: "",
      is_active: true,
    });
    setSelectedTest(null);
  };

  const filteredTests = tests.filter(
    (test) =>
      test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (test.description &&
        test.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                إدارة امتحانات تحديد المستوى
              </h1>
              <p className="text-gray-600">إضافة وتعديل وحذف الامتحانات</p>
            </div>
            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
            >
              <Plus size={20} />
              امتحان جديد
            </button>
          </div>

          {/* Search and Filter */}
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 relative">
              <Search
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="ابحث عن امتحان..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setFilterActive("all");
                  fetchTests();
                }}
                className={`px-4 py-2 rounded-lg transition-all ${
                  filterActive === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                الكل
              </button>
              <button
                onClick={() => {
                  setFilterActive("active");
                  fetchTests();
                }}
                className={`px-4 py-2 rounded-lg transition-all ${
                  filterActive === "active"
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                نشط
              </button>
              <button
                onClick={() => {
                  setFilterActive("inactive");
                  fetchTests();
                }}
                className={`px-4 py-2 rounded-lg transition-all ${
                  filterActive === "inactive"
                    ? "bg-red-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                غير نشط
              </button>
            </div>
          </div>
        </div>

        {/* Tests Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">جاري التحميل...</p>
          </div>
        ) : filteredTests.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <p className="text-gray-500 text-lg">لا توجد امتحانات</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTests.map((test) => (
              <div
                key={test.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 border-r-4 border-blue-500"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-800 flex-1">
                    {test.title}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      test.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {test.is_active ? "نشط" : "غير نشط"}
                  </span>
                </div>

                {test.description && (
                  <p className="text-gray-600 mb-4 text-sm line-clamp-2">
                    {test.description}
                  </p>
                )}

                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">المدة:</span>
                    <span className="font-semibold text-gray-700">
                      {test.duration} دقيقة
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">درجة النجاح:</span>
                    <span className="font-semibold text-gray-700">
                      {test.passing_score}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">المجموع الكلي:</span>
                    <span className="font-semibold text-gray-700">
                      {test.total_score}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(test)}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 py-2 rounded-lg hover:bg-blue-100 transition-all"
                  >
                    <Edit2 size={16} />
                    تعديل
                  </button>
                  <button
                    onClick={() => openDeleteConfirm(test)}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 py-2 rounded-lg hover:bg-red-100 transition-all"
                  >
                    <Trash2 size={16} />
                    حذف
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">
                  {modalMode === "create"
                    ? "إضافة امتحان جديد"
                    : "تعديل الامتحان"}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    عنوان الامتحان *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="مثال: امتحان تحديد المستوى - المستوى المبتدئ"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    الوصف
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="وصف مختصر عن الامتحان..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      المدة (بالدقائق) *
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.duration}
                      onChange={(e) =>
                        setFormData({ ...formData, duration: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      درجة النجاح *
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.passing_score}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          passing_score: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      المجموع الكلي *
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.total_score}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          total_score: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) =>
                      setFormData({ ...formData, is_active: e.target.checked })
                    }
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="is_active"
                    className="text-sm font-semibold text-gray-700 cursor-pointer"
                  >
                    الامتحان نشط ومتاح للطلاب
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold disabled:opacity-50"
                  >
                    {loading
                      ? "جاري الحفظ..."
                      : modalMode === "create"
                      ? "إضافة الامتحان"
                      : "حفظ التعديلات"}
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all font-semibold"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && testToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
              <div className="text-center mb-6">
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <Trash2 className="text-red-600" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  تأكيد الحذف
                </h3>
                <p className="text-gray-600">
                  هل أنت متأكد من حذف الامتحان
                  <span className="font-bold text-gray-800">
                    {" "}
                    "{testToDelete.title}"
                  </span>
                  ؟
                </p>
                <p className="text-sm text-red-600 mt-2">
                  لا يمكن التراجع عن هذا الإجراء
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-all font-semibold disabled:opacity-50"
                >
                  {loading ? "جاري الحذف..." : "حذف نهائياً"}
                </button>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setTestToDelete(null);
                  }}
                  className="flex-1 border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition-all font-semibold"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
