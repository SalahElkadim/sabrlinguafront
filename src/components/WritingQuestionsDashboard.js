import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  FileText,
  ArrowLeft,
  Save,
  X,
  CheckCircle,
} from "lucide-react";

const API_URL = "https://sabrlinguaa-production.up.railway.app/questions";

export default function WritingQuestionsDashboard() {
  const [tests, setTests] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentView, setCurrentView] = useState("tests"); // tests, questions
  const [selectedTest, setSelectedTest] = useState(null);

  // Modals
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Form Data
  const [questionFormData, setQuestionFormData] = useState({
    placement_test: "",
    title: "",
    question_text: "",
    question_image: null,
    min_words: "",
    max_words: "",
    sample_answer: "",
    rubric: "",
    points: "10",
    order: "1",
    is_active: true,
  });

  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchTests();
  }, []);

  useEffect(() => {
    if (selectedTest) {
      fetchQuestions(selectedTest.id);
    }
  }, [selectedTest]);

  const getToken = () => localStorage.getItem("token");

  // Fetch Tests
  const fetchTests = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/tests/`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const result = await response.json();
      if (result.success) {
        setTests(result.data);
      }
    } catch (error) {
      console.error("خطأ في جلب الامتحانات:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Questions
  const fetchQuestions = async (testId) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/writing-questions/?test_id=${testId}`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      const result = await response.json();
      if (result.success) {
        setQuestions(result.data);
      }
    } catch (error) {
      console.error("خطأ في جلب الأسئلة:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle Question Submit
  const handleQuestionSubmit = async () => {
    if (!questionFormData.title || !questionFormData.question_text) {
      alert("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();

      Object.keys(questionFormData).forEach((key) => {
        if (key === "question_image" && questionFormData[key]) {
          formData.append(key, questionFormData[key]);
        } else if (key !== "question_image") {
          formData.append(key, questionFormData[key]);
        }
      });

      const url =
        modalMode === "create"
          ? `${API_URL}/writing-questions/`
          : `${API_URL}/writing-questions/${itemToDelete?.id}/`;

      const method = modalMode === "create" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        alert(result.message);
        setShowQuestionModal(false);
        resetQuestionForm();
        if (selectedTest) {
          fetchQuestions(selectedTest.id);
        }
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

  // Handle Delete
  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/writing-questions/${itemToDelete.id}/`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );

      const result = await response.json();
      if (result.success) {
        alert(result.message);
        setShowDeleteConfirm(false);
        setItemToDelete(null);
        if (selectedTest) {
          fetchQuestions(selectedTest.id);
        }
      }
    } catch (error) {
      console.error("خطأ في الحذف:", error);
      alert("حدث خطأ في عملية الحذف");
    } finally {
      setLoading(false);
    }
  };

  const resetQuestionForm = () => {
    setQuestionFormData({
      placement_test: selectedTest?.id || "",
      title: "",
      question_text: "",
      question_image: null,
      min_words: "",
      max_words: "",
      sample_answer: "",
      rubric: "",
      points: "10",
      order: "1",
      is_active: true,
    });
    setImagePreview(null);
  };

  const openCreateQuestionModal = () => {
    setModalMode("create");
    resetQuestionForm();
    setQuestionFormData({
      ...questionFormData,
      placement_test: selectedTest.id,
    });
    setShowQuestionModal(true);
  };

  const openEditQuestionModal = (question) => {
    setModalMode("edit");
    setItemToDelete(question);
    setQuestionFormData({
      placement_test: question.placement_test,
      title: question.title,
      question_text: question.question_text,
      question_image: null,
      min_words: question.min_words?.toString() || "",
      max_words: question.max_words?.toString() || "",
      sample_answer: question.sample_answer || "",
      rubric: question.rubric || "",
      points: question.points.toString(),
      order: question.order.toString(),
      is_active: question.is_active,
    });
    if (question.question_image) {
      setImagePreview(question.question_image);
    }
    setShowQuestionModal(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setQuestionFormData({ ...questionFormData, question_image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Render Tests View
  const renderTestsView = () => (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">اختر الامتحان</h2>
        <p className="text-gray-600">اختر الامتحان لإدارة أسئلة الكتابة</p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-teal-600 border-t-transparent"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map((test) => (
            <div
              key={test.id}
              onClick={() => {
                setSelectedTest(test);
                setCurrentView("questions");
              }}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 cursor-pointer border-r-4 border-teal-500"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {test.title}
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">المدة:</span>
                  <span className="font-semibold">
                    {test.duration_minutes} دقيقة
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">عدد الأسئلة:</span>
                  <span className="font-semibold">
                    {test.questions_count || 0}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Render Questions View
  const renderQuestionsView = () => (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => {
            setCurrentView("tests");
            setSelectedTest(null);
          }}
          className="text-teal-600 hover:text-teal-700"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-800">
            أسئلة الكتابة - {selectedTest?.title}
          </h2>
          <p className="text-gray-600">إدارة أسئلة الكتابة للامتحان</p>
        </div>
        <button
          onClick={openCreateQuestionModal}
          className="flex items-center gap-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-6 py-3 rounded-lg hover:from-teal-700 hover:to-cyan-700 transition-all shadow-md"
        >
          <Plus size={20} />
          سؤال جديد
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-teal-600 border-t-transparent"></div>
        </div>
      ) : questions.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <p className="text-gray-500 text-lg">لا توجد أسئلة</p>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((question, index) => (
            <div
              key={question.id}
              className="bg-white rounded-xl shadow-md p-6 border-r-4 border-teal-500"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center font-bold text-teal-600">
                  {index + 1}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {question.title}
                      </h3>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          question.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {question.is_active ? "نشط" : "غير نشط"}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {question.question_text}
                  </p>

                  {question.question_image && (
                    <img
                      src={question.question_image}
                      alt="سؤال"
                      className="mb-4 rounded-lg max-h-48 object-contain border-2 border-gray-200"
                    />
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {question.min_words && (
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">
                          الحد الأدنى للكلمات
                        </p>
                        <p className="text-lg font-bold text-blue-600">
                          {question.min_words}
                        </p>
                      </div>
                    )}

                    {question.max_words && (
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">
                          الحد الأقصى للكلمات
                        </p>
                        <p className="text-lg font-bold text-purple-600">
                          {question.max_words}
                        </p>
                      </div>
                    )}

                    <div className="bg-teal-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">النقاط</p>
                      <p className="text-lg font-bold text-teal-600">
                        {question.points}
                      </p>
                    </div>
                  </div>

                  {question.sample_answer && (
                    <div className="bg-green-50 p-4 rounded-lg mb-4">
                      <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <CheckCircle size={16} className="text-green-600" />
                        إجابة نموذجية:
                      </p>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {question.sample_answer}
                      </p>
                    </div>
                  )}

                  {question.rubric && (
                    <div className="bg-yellow-50 p-4 rounded-lg mb-4">
                      <p className="text-sm font-semibold text-gray-700 mb-2">
                        معايير التقييم (Rubric):
                      </p>
                      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                        {question.rubric}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>الترتيب: {question.order}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => openEditQuestionModal(question)}
                    className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => {
                      setItemToDelete(question);
                      setShowDeleteConfirm(true);
                    }}
                    className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100 p-6"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto">
        {currentView === "tests" && renderTestsView()}
        {currentView === "questions" && renderQuestionsView()}

        {/* Question Modal */}
        {showQuestionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">
                  {modalMode === "create" ? "إضافة سؤال جديد" : "تعديل السؤال"}
                </h2>
                <button
                  onClick={() => setShowQuestionModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    عنوان السؤال *
                  </label>
                  <input
                    type="text"
                    value={questionFormData.title}
                    onChange={(e) =>
                      setQuestionFormData({
                        ...questionFormData,
                        title: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="مثال: كتابة رسالة رسمية"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    نص السؤال *
                  </label>
                  <textarea
                    value={questionFormData.question_text}
                    onChange={(e) =>
                      setQuestionFormData({
                        ...questionFormData,
                        question_text: e.target.value,
                      })
                    }
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="اكتب تعليمات السؤال بالتفصيل..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    صورة السؤال (اختياري)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="معاينة"
                      className="mt-3 rounded-lg max-h-48 object-contain border-2 border-gray-200"
                    />
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      الحد الأدنى للكلمات
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={questionFormData.min_words}
                      onChange={(e) =>
                        setQuestionFormData({
                          ...questionFormData,
                          min_words: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="مثال: 100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      الحد الأقصى للكلمات
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={questionFormData.max_words}
                      onChange={(e) =>
                        setQuestionFormData({
                          ...questionFormData,
                          max_words: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="مثال: 250"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    إجابة نموذجية (اختياري)
                  </label>
                  <textarea
                    value={questionFormData.sample_answer}
                    onChange={(e) =>
                      setQuestionFormData({
                        ...questionFormData,
                        sample_answer: e.target.value,
                      })
                    }
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="اكتب إجابة نموذجية للمرجعية..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    معايير التقييم - Rubric (اختياري)
                  </label>
                  <textarea
                    value={questionFormData.rubric}
                    onChange={(e) =>
                      setQuestionFormData({
                        ...questionFormData,
                        rubric: e.target.value,
                      })
                    }
                    rows="5"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="اكتب معايير التقييم التفصيلية..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      النقاط *
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={questionFormData.points}
                      onChange={(e) =>
                        setQuestionFormData({
                          ...questionFormData,
                          points: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      الترتيب *
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={questionFormData.order}
                      onChange={(e) =>
                        setQuestionFormData({
                          ...questionFormData,
                          order: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    id="question_is_active"
                    checked={questionFormData.is_active}
                    onChange={(e) =>
                      setQuestionFormData({
                        ...questionFormData,
                        is_active: e.target.checked,
                      })
                    }
                    className="w-5 h-5 text-teal-600 rounded focus:ring-2 focus:ring-teal-500"
                  />
                  <label
                    htmlFor="question_is_active"
                    className="text-sm font-semibold text-gray-700 cursor-pointer"
                  >
                    السؤال نشط
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleQuestionSubmit}
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-3 rounded-lg hover:from-teal-700 hover:to-cyan-700 transition-all font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        جاري الحفظ...
                      </>
                    ) : (
                      <>
                        <Save size={20} />
                        حفظ السؤال
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setShowQuestionModal(false)}
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
        {showDeleteConfirm && itemToDelete && (
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
                  هل أنت متأكد من حذف السؤال
                  <span className="font-bold text-gray-800">
                    {" "}
                    "{itemToDelete.title}"
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
                    setItemToDelete(null);
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
