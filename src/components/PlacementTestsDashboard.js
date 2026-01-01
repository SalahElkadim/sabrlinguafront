import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X, FileText } from "lucide-react";

const API_URL = "https://sabrlinguaa-production.up.railway.app/questions";

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
    duration_minutes: "",
    a1_min_score: "0",
    a2_min_score: "",
    b1_min_score: "",
    b2_min_score: "",
    is_active: true,
  });

  useEffect(() => {
    fetchTests();
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
      !formData.duration_minutes ||
      !formData.a2_min_score ||
      !formData.b1_min_score ||
      !formData.b2_min_score
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
      duration_minutes: test.duration,
      a1_min_score: test.a1_min_score,
      a2_min_score: test.a2_min_score,
      b1_min_score: test.b1_min_score,
      b2_min_score: test.b2_min_score,
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
      duration_minutes: "",
      a1_min_score: "0",
      a2_min_score: "",
      b1_min_score: "",
      b2_min_score: "",
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
    <div className="min-h-screen bg-gray-lighter p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-gray-dark">إضافة وتعديل وحذف الامتحانات</p>
          </div>

          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 bg-yellow-primary text-black px-6 py-3 rounded font-bold hover:bg-yellow-hover transition-all shadow-md"
          >
            <Plus size={20} />
            امتحان جديد
          </button>
        </div>

        {/* Tests Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-yellow-primary border-t-transparent"></div>
            <p className="mt-4 text-gray-dark">جاري التحميل...</p>
          </div>
        ) : filteredTests.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FileText size={48} className="mx-auto mb-4 text-gray-medium" />
            <p className="text-gray-dark text-lg">لا توجد امتحانات</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTests.map((test) => (
              <div
                key={test.id}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all p-6 border-r-4 border-yellow-primary"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-black flex-1">
                    {test.title}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      test.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {test.is_active ? "نشط" : "غير نشط"}
                  </span>
                </div>

                {test.description && (
                  <p className="text-gray-dark mb-4 text-sm line-clamp-2">
                    {test.description}
                  </p>
                )}

                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-dark">المدة:</span>
                    <span className="font-bold text-black">
                      {test.duration_minutes} دقيقة
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-dark">A1:</span>
                    <span className="font-bold text-black">
                      {test.a1_min_score}+
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-dark">A2:</span>
                    <span className="font-bold text-black">
                      {test.a2_min_score}+
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-dark">B1:</span>
                    <span className="font-bold text-black">
                      {test.b1_min_score}+
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-dark">B2:</span>
                    <span className="font-bold text-black">
                      {test.b2_min_score}+
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-dark">إجمالي الأسئلة:</span>
                    <span className="font-bold text-black">
                      {test.questions_count || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-dark">إجمالي النقاط:</span>
                    <span className="font-bold text-black">
                      {test.total_points || 0}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(test)}
                    className="flex-1 flex items-center justify-center gap-2 bg-gray-lighter text-black py-2 rounded hover:bg-gray-light transition-all font-semibold"
                  >
                    <Edit2 size={16} />
                    تعديل
                  </button>
                  <button
                    onClick={() => openDeleteConfirm(test)}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 py-2 rounded hover:bg-red-100 transition-all font-semibold"
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
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-black border-b-2 border-yellow-primary px-6 py-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-yellow-primary">
                  {modalMode === "create"
                    ? "إضافة امتحان جديد"
                    : "تعديل الامتحان"}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-light hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-black mb-2">
                    عنوان الامتحان *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-4 py-2 border-2 border-gray-light rounded focus:border-yellow-primary focus:outline-none"
                    placeholder="مثال: امتحان تحديد المستوى - يناير 2025"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-black mb-2">
                    الوصف
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows="3"
                    className="w-full px-4 py-2 border-2 border-gray-light rounded focus:border-yellow-primary focus:outline-none"
                    placeholder="وصف مختصر عن الامتحان..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-black mb-2">
                    المدة (بالدقائق) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.duration_minutes}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        duration_minutes: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border-2 border-gray-light rounded focus:border-yellow-primary focus:outline-none"
                    placeholder="90"
                  />
                </div>

                <div className="border-t-2 border-gray-light pt-4">
                  <h3 className="text-lg font-bold text-black mb-4">
                    الحد الأدنى للدرجات حسب المستوى
                  </h3>
                  <p className="text-sm text-gray-dark mb-4">
                    يجب أن تكون الدرجات متصاعدة (A1 {"<"} A2 {"<"} B1 {"<"} B2)
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-black mb-2">
                        A1 (مبتدئ) *
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.a1_min_score}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            a1_min_score: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border-2 border-gray-light rounded focus:border-yellow-primary focus:outline-none"
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-black mb-2">
                        A2 (ابتدائي) *
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.a2_min_score}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            a2_min_score: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border-2 border-gray-light rounded focus:border-yellow-primary focus:outline-none"
                        placeholder="25"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-black mb-2">
                        B1 (متوسط) *
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.b1_min_score}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            b1_min_score: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border-2 border-gray-light rounded focus:border-yellow-primary focus:outline-none"
                        placeholder="50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-black mb-2">
                        B2 (متقدم) *
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.b2_min_score}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            b2_min_score: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border-2 border-gray-light rounded focus:border-yellow-primary focus:outline-none"
                        placeholder="75"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-lighter rounded">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) =>
                      setFormData({ ...formData, is_active: e.target.checked })
                    }
                    className="w-5 h-5 accent-yellow-primary"
                  />
                  <label
                    htmlFor="is_active"
                    className="text-sm font-bold text-black cursor-pointer"
                  >
                    الامتحان نشط ومتاح للطلاب
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-1 bg-yellow-primary text-black py-3 rounded hover:bg-yellow-hover transition-all font-bold disabled:opacity-50 shadow-md"
                  >
                    {loading
                      ? "جاري الحفظ..."
                      : modalMode === "create"
                      ? "إضافة الامتحان"
                      : "حفظ التعديلات"}
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-6 py-3 border-2 border-gray-light rounded hover:bg-gray-lighter transition-all font-bold"
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
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6">
              <div className="text-center mb-6">
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <Trash2 className="text-red-600" size={32} />
                </div>
                <h3 className="text-xl font-bold text-black mb-2">
                  تأكيد الحذف
                </h3>
                <p className="text-gray-dark">
                  هل أنت متأكد من حذف الامتحان
                  <span className="font-bold text-black">
                    {" "}
                    "{testToDelete.title}"
                  </span>
                  ؟
                </p>
                <p className="text-sm text-red-600 mt-2 font-semibold">
                  لا يمكن التراجع عن هذا الإجراء
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="flex-1 bg-red-600 text-white py-3 rounded hover:bg-red-700 transition-all font-bold disabled:opacity-50 shadow-md"
                >
                  {loading ? "جاري الحذف..." : "حذف نهائياً"}
                </button>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setTestToDelete(null);
                  }}
                  className="flex-1 border-2 border-gray-light py-3 rounded hover:bg-gray-lighter transition-all font-bold"
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
