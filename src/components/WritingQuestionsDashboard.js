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
  XCircle,
  AlertCircle,
} from "lucide-react";

const API_URL = "https://sabrlinguaa-production.up.railway.app/questions";

export default function WritingQuestionsDashboard() {
  const [tests, setTests] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentView, setCurrentView] = useState("tests");
  const [selectedTest, setSelectedTest] = useState(null);

  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

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

  const getToken = () => {
    if (typeof localStorage !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  };

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

  const renderTestsView = () => (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-black mb-3">اختر الامتحان</h2>
        <p className="text-gray-dark text-lg">
          اختر الامتحان لإدارة أسئلة الكتابة
        </p>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-yellow-primary border-t-transparent"></div>
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
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all p-6 cursor-pointer border-2 border-gray-light hover:border-yellow-primary"
            >
              <h3 className="text-2xl font-bold text-black mb-4">
                {test.title}
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-lighter rounded">
                  <span className="text-gray-dark font-semibold">المدة:</span>
                  <span className="font-bold text-black">
                    {test.duration_minutes} دقيقة
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-yellow-light rounded">
                  <span className="text-gray-dark font-semibold">
                    عدد الأسئلة:
                  </span>
                  <span className="font-bold text-black">
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

  const renderQuestionsView = () => (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => {
            setCurrentView("tests");
            setSelectedTest(null);
          }}
          className="p-2 rounded hover:bg-yellow-light transition-colors"
        >
          <ArrowLeft size={28} className="text-black" />
        </button>
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-black">
            أسئلة الكتابة - {selectedTest?.title}
          </h2>
          <p className="text-gray-dark text-lg mt-1">
            إدارة أسئلة الكتابة للامتحان
          </p>
        </div>
        <button
          onClick={openCreateQuestionModal}
          className="flex items-center gap-3 bg-yellow-primary text-black px-6 py-3 rounded font-bold hover:bg-yellow-hover transition-all shadow-md hover:shadow-lg"
        >
          <Plus size={22} />
          <span>سؤال جديد</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-yellow-primary border-t-transparent"></div>
        </div>
      ) : questions.length === 0 ? (
        <div className="bg-white rounded-lg shadow-lg p-16 text-center border-2 border-gray-light">
          <FileText size={64} className="mx-auto mb-4 text-gray-medium" />
          <p className="text-gray-dark text-xl font-semibold">لا توجد أسئلة</p>
        </div>
      ) : (
        <div className="space-y-5">
          {questions.map((question, index) => (
            <div
              key={question.id}
              className="bg-white rounded-lg shadow-md p-6 border-2 border-gray-light hover:border-yellow-primary transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-14 h-14 bg-yellow-primary rounded-full flex items-center justify-center font-bold text-black text-xl shadow-md">
                  {index + 1}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-black mb-3">
                        {question.title}
                      </h3>
                      {question.is_active ? (
                        <div className="flex items-center gap-1 px-3 py-1 bg-yellow-light rounded-full inline-flex">
                          <CheckCircle size={16} className="text-black" />
                          <span className="text-xs font-bold text-black">
                            نشط
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 px-3 py-1 bg-gray-light rounded-full inline-flex">
                          <XCircle size={16} className="text-gray-dark" />
                          <span className="text-xs font-bold text-gray-dark">
                            غير نشط
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-dark text-lg mb-5 leading-relaxed font-semibold">
                    {question.question_text}
                  </p>

                  {question.question_image && (
                    <img
                      src={question.question_image}
                      alt="سؤال"
                      className="mb-5 rounded-lg max-h-64 object-contain border-2 border-yellow-primary"
                    />
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                    {question.min_words && (
                      <div className="bg-gray-lighter border-2 border-gray-light p-4 rounded-lg">
                        <p className="text-xs text-gray-dark mb-2 font-semibold">
                          الحد الأدنى للكلمات
                        </p>
                        <p className="text-2xl font-bold text-black">
                          {question.min_words}
                        </p>
                      </div>
                    )}

                    {question.max_words && (
                      <div className="bg-gray-lighter border-2 border-gray-light p-4 rounded-lg">
                        <p className="text-xs text-gray-dark mb-2 font-semibold">
                          الحد الأقصى للكلمات
                        </p>
                        <p className="text-2xl font-bold text-black">
                          {question.max_words}
                        </p>
                      </div>
                    )}

                    <div className="bg-yellow-light border-2 border-yellow-primary p-4 rounded-lg">
                      <p className="text-xs text-gray-dark mb-2 font-semibold">
                        النقاط
                      </p>
                      <p className="text-2xl font-bold text-black">
                        {question.points}
                      </p>
                    </div>
                  </div>

                  {question.sample_answer && (
                    <div className="bg-yellow-light border-2 border-yellow-primary p-4 rounded-lg mb-4">
                      <p className="text-sm font-bold text-black mb-3 flex items-center gap-2">
                        <CheckCircle size={18} className="text-black" />
                        إجابة نموذجية:
                      </p>
                      <p className="text-gray-dark leading-relaxed font-semibold">
                        {question.sample_answer}
                      </p>
                    </div>
                  )}

                  {question.rubric && (
                    <div className="bg-gray-lighter border-2 border-gray-light p-4 rounded-lg mb-4">
                      <p className="text-sm font-bold text-black mb-3 flex items-center gap-2">
                        <AlertCircle size={18} className="text-black" />
                        معايير التقييم (Rubric):
                      </p>
                      <p className="text-gray-dark leading-relaxed whitespace-pre-line font-semibold">
                        {question.rubric}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <span className="text-gray-dark font-semibold">
                      الترتيب:
                    </span>
                    <span className="bg-gray-lighter text-black px-3 py-1 rounded font-bold">
                      {question.order}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => openEditQuestionModal(question)}
                    className="p-3 bg-white border-2 border-gray-light text-black rounded hover:border-yellow-primary hover:bg-yellow-light transition-all"
                  >
                    <Edit2 size={20} />
                  </button>
                  <button
                    onClick={() => {
                      setItemToDelete(question);
                      setShowDeleteConfirm(true);
                    }}
                    className="p-3 bg-white border-2 border-gray-light text-black rounded hover:border-red-500 hover:bg-red-50 hover:text-red-600 transition-all"
                  >
                    <Trash2 size={20} />
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
    <div className="min-h-screen bg-gray-lighter p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {currentView === "tests" && renderTestsView()}
        {currentView === "questions" && renderQuestionsView()}

        {showQuestionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
            <div
              className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-screen overflow-y-auto"
              style={{ maxHeight: "90vh" }}
            >
              <div className="sticky top-0 bg-black border-b-2 border-yellow-primary px-6 py-5 flex justify-between items-center z-10">
                <h2 className="text-2xl font-bold text-yellow-primary">
                  {modalMode === "create" ? "إضافة سؤال جديد" : "تعديل السؤال"}
                </h2>
                <button
                  onClick={() => setShowQuestionModal(false)}
                  className="text-white hover:text-yellow-primary transition-colors"
                >
                  <X size={28} />
                </button>
              </div>

              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-bold text-black mb-2">
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
                    className="w-full px-4 py-3 border-2 border-gray-light rounded focus:border-yellow-primary focus:outline-none transition-colors font-semibold"
                    placeholder="مثال: كتابة رسالة رسمية"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-black mb-2">
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
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-light rounded focus:border-yellow-primary focus:outline-none transition-colors font-semibold"
                    placeholder="اكتب تعليمات السؤال بالتفصيل..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-black mb-2">
                    صورة السؤال (اختياري)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-4 py-3 border-2 border-gray-light rounded focus:border-yellow-primary focus:outline-none transition-colors"
                  />
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="معاينة"
                      className="mt-4 rounded-lg max-h-56 object-contain border-2 border-yellow-primary"
                    />
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">
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
                      className="w-full px-4 py-3 border-2 border-gray-light rounded focus:border-yellow-primary focus:outline-none transition-colors font-bold"
                      placeholder="مثال: 100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-black mb-2">
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
                      className="w-full px-4 py-3 border-2 border-gray-light rounded focus:border-yellow-primary focus:outline-none transition-colors font-bold"
                      placeholder="مثال: 250"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-black mb-2">
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
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-light rounded focus:border-yellow-primary focus:outline-none transition-colors font-semibold"
                    placeholder="اكتب إجابة نموذجية للمرجعية..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-black mb-2">
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
                    rows={5}
                    className="w-full px-4 py-3 border-2 border-gray-light rounded focus:border-yellow-primary focus:outline-none transition-colors font-semibold"
                    placeholder="اكتب معايير التقييم التفصيلية..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">
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
                      className="w-full px-4 py-3 border-2 border-gray-light rounded focus:border-yellow-primary focus:outline-none transition-colors font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-black mb-2">
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
                      className="w-full px-4 py-3 border-2 border-gray-light rounded focus:border-yellow-primary focus:outline-none transition-colors font-bold"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-yellow-light border-2 border-yellow-primary rounded-lg">
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
                    className="w-6 h-6 text-yellow-primary rounded focus:ring-2 focus:ring-yellow-primary cursor-pointer"
                  />
                  <label
                    htmlFor="question_is_active"
                    className="text-sm font-bold text-black cursor-pointer"
                  >
                    السؤال نشط
                  </label>
                </div>

                <div className="flex gap-3 pt-4 border-t-2 border-gray-light">
                  <button
                    onClick={handleQuestionSubmit}
                    disabled={loading}
                    className="flex-1 bg-yellow-primary text-black py-4 rounded font-bold hover:bg-yellow-hover transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-black border-t-transparent"></div>
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
                    className="px-8 py-4 border-2 border-gray-light rounded hover:bg-gray-lighter transition-all font-bold"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showDeleteConfirm && itemToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8 border-2 border-gray-light">
              <div className="text-center mb-6">
                <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <Trash2 className="text-red-600" size={40} />
                </div>
                <h3 className="text-2xl font-bold text-black mb-3">
                  تأكيد الحذف
                </h3>
                <p className="text-gray-dark text-lg mb-2">
                  هل أنت متأكد من حذف السؤال
                </p>
                <p className="font-bold text-black text-lg">
                  "{itemToDelete.title}"
                </p>
                <p className="text-sm text-red-600 mt-3 font-semibold">
                  ⚠️ لا يمكن التراجع عن هذا الإجراء
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="flex-1 bg-red-600 text-white py-4 rounded font-bold hover:bg-red-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "جاري الحذف..." : "حذف نهائياً"}
                </button>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setItemToDelete(null);
                  }}
                  className="flex-1 border-2 border-gray-light py-4 rounded hover:bg-gray-lighter transition-all font-bold"
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
