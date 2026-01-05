import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Edit2,
  Trash2,
  Image,
  ArrowLeft,
  Save,
  X,
  FileText,
  List,
} from "lucide-react";

const API_URL = "https://sabrlinguaa-production.up.railway.app/questions";

export default function MCQQuestionsDashboard() {
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [questionSets, setQuestionSets] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentView, setCurrentView] = useState("tests");
  const [selectedTest, setSelectedTest] = useState(null);
  const [selectedSet, setSelectedSet] = useState(null);

  const [showSetModal, setShowSetModal] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState("");

  const [setFormData, setSetFormData] = useState({
    placement_test: "",
    title: "",
    description: "",
    order: "1",
    is_active: true,
  });

  const [questionFormData, setQuestionFormData] = useState({
    question_set: "",
    question_text: "",
    question_image: null,
    choice_a: "",
    choice_b: "",
    choice_c: "",
    choice_d: "",
    correct_answer: "A",
    explanation: "",
    points: "1",
    order: "1",
  });

  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchTests();
  }, []);

  useEffect(() => {
    if (selectedTest) {
      fetchQuestionSets(selectedTest.id);
    }
  }, [selectedTest]);

  useEffect(() => {
    if (selectedSet) {
      fetchQuestions(selectedSet.id);
    }
  }, [selectedSet]);

  const getToken = () => localStorage.getItem("token");

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

  const fetchQuestionSets = async (testId) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/mcq-sets/?test_id=${testId}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const result = await response.json();
      if (result.success) {
        setQuestionSets(result.data);
      }
    } catch (error) {
      console.error("خطأ في جلب المجموعات:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async (setId) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/mcq-questions/?set_id=${setId}`,
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

  const handleSetSubmit = async () => {
    if (!setFormData.title || !setFormData.placement_test) {
      alert("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    setLoading(true);
    try {
      const url =
        modalMode === "create"
          ? `${API_URL}/mcq-sets/`
          : `${API_URL}/mcq-sets/${itemToDelete?.id || selectedSet.id}/`;

      const response = await fetch(url, {
        method: modalMode === "create" ? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(setFormData),
      });

      const result = await response.json();

      if (result.success) {
        alert(result.message);
        setShowSetModal(false);
        resetSetForm();
        if (selectedTest) {
          fetchQuestionSets(selectedTest.id);
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

  const handleQuestionSubmit = async () => {
    if (
      !questionFormData.question_text ||
      !questionFormData.choice_a ||
      !questionFormData.choice_b ||
      !questionFormData.choice_c ||
      !questionFormData.choice_d
    ) {
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
          ? `${API_URL}/mcq-questions/`
          : `${API_URL}/mcq-questions/${itemToDelete?.id}/`;

      const response = await fetch(url, {
        method: modalMode === "create" ? "POST" : "PUT",
        headers: { Authorization: `Bearer ${getToken()}` },
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        alert(result.message);
        setShowQuestionModal(false);
        resetQuestionForm();
        if (selectedSet) {
          fetchQuestions(selectedSet.id);
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
      const url =
        deleteType === "set"
          ? `${API_URL}/mcq-sets/${itemToDelete.id}/`
          : `${API_URL}/mcq-questions/${itemToDelete.id}/`;

      const response = await fetch(url, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      const result = await response.json();
      if (result.success) {
        alert(result.message);
        setShowDeleteConfirm(false);
        setItemToDelete(null);
        if (deleteType === "set" && selectedTest) {
          fetchQuestionSets(selectedTest.id);
        } else if (deleteType === "question" && selectedSet) {
          fetchQuestions(selectedSet.id);
        }
      }
    } catch (error) {
      console.error("خطأ في الحذف:", error);
      alert("حدث خطأ في عملية الحذف");
    } finally {
      setLoading(false);
    }
  };

  const resetSetForm = () => {
    setSetFormData({
      placement_test: selectedTest?.id || "",
      title: "",
      description: "",
      order: "1",
      is_active: true,
    });
  };

  const resetQuestionForm = () => {
    setQuestionFormData({
      question_set: selectedSet?.id || "",
      question_text: "",
      question_image: null,
      choice_a: "",
      choice_b: "",
      choice_c: "",
      choice_d: "",
      correct_answer: "A",
      explanation: "",
      points: "1",
      order: "1",
    });
    setImagePreview(null);
  };

  const openCreateSetModal = () => {
    setModalMode("create");
    resetSetForm();
    setSetFormData({ ...setFormData, placement_test: selectedTest.id });
    setShowSetModal(true);
  };

  const openEditSetModal = (set) => {
    setModalMode("edit");
    setItemToDelete(set);
    setSetFormData({
      placement_test: set.placement_test,
      title: set.title,
      description: set.description || "",
      order: set.order.toString(),
      is_active: set.is_active,
    });
    setShowSetModal(true);
  };

  const openCreateQuestionModal = () => {
    setModalMode("create");
    resetQuestionForm();
    setQuestionFormData({ ...questionFormData, question_set: selectedSet.id });
    setShowQuestionModal(true);
  };

  const openEditQuestionModal = (question) => {
    setModalMode("edit");
    setItemToDelete(question);
    setQuestionFormData({
      question_set: question.question_set,
      question_text: question.question_text,
      question_image: null,
      choice_a: question.choice_a,
      choice_b: question.choice_b,
      choice_c: question.choice_c,
      choice_d: question.choice_d,
      correct_answer: question.correct_answer,
      explanation: question.explanation || "",
      points: question.points.toString(),
      order: question.order.toString(),
    });
    if (question.question_image) {
      setImagePreview(question.question_image.url || question.question_image);
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
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-black mb-2">اختر الامتحان</h2>
        <p className="text-gray-dark">اختر الامتحان لإدارة مجموعات الأسئلة</p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-yellow-primary border-t-transparent"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map((test) => (
            <div
              key={test.id}
              onClick={() => {
                setSelectedTest(test);
                setCurrentView("sets");
              }}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all p-6 cursor-pointer border-r-4 border-yellow-primary"
            >
              <h3 className="text-xl font-bold text-black mb-3">
                {test.title}
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-dark">المدة:</span>
                  <span className="font-bold text-black">
                    {test.duration_minutes} دقيقة
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-dark">عدد الأسئلة:</span>
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

  const renderSetsView = () => (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => {
            setCurrentView("tests");
            setSelectedTest(null);
          }}
          className="p-2 hover:bg-gray-lighter rounded transition-colors"
        >
          <ArrowLeft size={24} className="text-black" />
        </button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-black">
            مجموعات الأسئلة - {selectedTest?.title}
          </h2>
          <p className="text-gray-dark">إدارة مجموعات الأسئلة للامتحان</p>
        </div>
        <button
          onClick={openCreateSetModal}
          className="flex items-center gap-2 bg-yellow-primary text-black px-6 py-3 rounded font-bold hover:bg-yellow-hover transition-all shadow-md"
        >
          <Plus size={20} />
          مجموعة جديدة
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-yellow-primary border-t-transparent"></div>
        </div>
      ) : questionSets.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <List size={48} className="mx-auto mb-4 text-gray-medium" />
          <p className="text-gray-dark text-lg">لا توجد مجموعات أسئلة</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {questionSets.map((set) => (
            <div
              key={set.id}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all p-6 border-r-4 border-yellow-primary"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-black flex-1">
                  {set.title}
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    set.is_active
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {set.is_active ? "نشط" : "غير نشط"}
                </span>
              </div>

              {set.description && (
                <p className="text-gray-dark mb-4 text-sm">{set.description}</p>
              )}

              <div className="space-y-2 mb-4 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-dark">عدد الأسئلة:</span>
                  <span className="font-bold text-black">
                    {set.questions_count}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-dark">إجمالي النقاط:</span>
                  <span className="font-bold text-black">
                    {set.total_points}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-dark">الترتيب:</span>
                  <span className="font-bold text-black">{set.order}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedSet(set);
                    setCurrentView("questions");
                  }}
                  className="flex-1 bg-yellow-light text-black py-2 rounded hover:bg-yellow-primary transition-all font-bold"
                >
                  الأسئلة
                </button>
                <button
                  onClick={() => openEditSetModal(set)}
                  className="flex items-center justify-center gap-2 bg-gray-lighter text-black px-4 py-2 rounded hover:bg-gray-light transition-all"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => {
                    setItemToDelete(set);
                    setDeleteType("set");
                    setShowDeleteConfirm(true);
                  }}
                  className="flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded hover:bg-red-100 transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderQuestionsView = () => (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => {
            setCurrentView("sets");
            setSelectedSet(null);
          }}
          className="p-2 hover:bg-gray-lighter rounded transition-colors"
        >
          <ArrowLeft size={24} className="text-black" />
        </button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-black">
            الأسئلة - {selectedSet?.title}
          </h2>
          <p className="text-gray-dark">إدارة أسئلة المجموعة</p>
        </div>
        <button
          onClick={openCreateQuestionModal}
          className="flex items-center gap-2 bg-yellow-primary text-black px-6 py-3 rounded font-bold hover:bg-yellow-hover transition-all shadow-md"
        >
          <Plus size={20} />
          سؤال جديد
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-yellow-primary border-t-transparent"></div>
        </div>
      ) : questions.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <FileText size={48} className="mx-auto mb-4 text-gray-medium" />
          <p className="text-gray-dark text-lg">لا توجد أسئلة</p>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((question, index) => (
            <div
              key={question.id}
              className="bg-white rounded-lg shadow-md p-6 border-r-4 border-yellow-primary"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-yellow-light rounded-full flex items-center justify-center font-bold text-black">
                  {index + 1}
                </div>

                <div className="flex-1">
                  <p className="text-lg font-bold text-black mb-3">
                    {question.question_text}
                  </p>

                  {question.question_image &&
                    (() => {
                      // استخراج رابط الصورة بشكل صحيح
                      let imageUrl = null;

                      if (typeof question.question_image === "string") {
                        imageUrl = question.question_image;
                      } else if (question.question_image?.url) {
                        imageUrl = question.question_image.url;
                      } else if (typeof question.question_image === "object") {
                        // في حالة كان object يحتوي على الرابط مباشرة
                        imageUrl = Object.values(question.question_image)[0];
                      }

                      console.log(
                        "Image URL:",
                        imageUrl,
                        "Type:",
                        typeof question.question_image
                      );

                      return imageUrl ? (
                        <img
                          src={imageUrl}
                          alt="سؤال"
                          className="mb-4 rounded-lg max-h-48 object-contain border-2 border-gray-light"
                          onError={(e) => {
                            console.error(
                              "فشل تحميل الصورة. الرابط:",
                              imageUrl
                            );
                            console.error(
                              "البيانات الأصلية:",
                              question.question_image
                            );
                            e.target.style.display = "none";
                          }}
                        />
                      ) : null;
                    })()}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                    {["A", "B", "C", "D"].map((choice) => (
                      <div
                        key={choice}
                        className={`p-3 rounded border-2 ${
                          question.correct_answer === choice
                            ? "bg-green-50 border-green-500"
                            : "bg-gray-lighter border-gray-light"
                        }`}
                      >
                        <span className="font-bold text-black">{choice}:</span>{" "}
                        <span className="text-gray-dark">
                          {question[`choice_${choice.toLowerCase()}`]}
                        </span>
                      </div>
                    ))}
                  </div>

                  {question.explanation && (
                    <div className="bg-yellow-light p-3 rounded mb-3 border border-yellow-primary">
                      <p className="text-sm text-gray-dark">
                        <span className="font-bold text-black">الشرح:</span>{" "}
                        {question.explanation}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-sm text-gray-dark">
                    <span className="font-semibold">
                      النقاط: {question.points}
                    </span>
                    <span className="font-semibold">
                      الترتيب: {question.order}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => openEditQuestionModal(question)}
                    className="p-2 bg-gray-lighter text-black rounded hover:bg-gray-light transition-all"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => {
                      setItemToDelete(question);
                      setDeleteType("question");
                      setShowDeleteConfirm(true);
                    }}
                    className="p-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-all"
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
    <div className="min-h-screen bg-gray-lighter p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {currentView === "tests" && renderTestsView()}
        {currentView === "sets" && renderSetsView()}
        {currentView === "questions" && renderQuestionsView()}

        {/* Set Modal */}
        {showSetModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-black border-b-2 border-yellow-primary px-6 py-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-yellow-primary">
                  {modalMode === "create"
                    ? "إضافة مجموعة جديدة"
                    : "تعديل المجموعة"}
                </h2>
                <button
                  onClick={() => setShowSetModal(false)}
                  className="text-gray-light hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-black mb-2">
                    عنوان المجموعة *
                  </label>
                  <input
                    type="text"
                    value={setFormData.title}
                    onChange={(e) =>
                      setSetFormData({ ...setFormData, title: e.target.value })
                    }
                    className="w-full px-4 py-2 border-2 border-gray-light rounded focus:border-yellow-primary focus:outline-none"
                    placeholder="مثال: القراءة والفهم"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-black mb-2">
                    الوصف
                  </label>
                  <textarea
                    value={setFormData.description}
                    onChange={(e) =>
                      setSetFormData({
                        ...setFormData,
                        description: e.target.value,
                      })
                    }
                    rows="3"
                    className="w-full px-4 py-2 border-2 border-gray-light rounded focus:border-yellow-primary focus:outline-none"
                    placeholder="وصف مختصر..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-black mb-2">
                    الترتيب *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={setFormData.order}
                    onChange={(e) =>
                      setSetFormData({ ...setFormData, order: e.target.value })
                    }
                    className="w-full px-4 py-2 border-2 border-gray-light rounded focus:border-yellow-primary focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-lighter rounded">
                  <input
                    type="checkbox"
                    id="set_is_active"
                    checked={setFormData.is_active}
                    onChange={(e) =>
                      setSetFormData({
                        ...setFormData,
                        is_active: e.target.checked,
                      })
                    }
                    className="w-5 h-5 accent-yellow-primary"
                  />
                  <label
                    htmlFor="set_is_active"
                    className="text-sm font-bold text-black cursor-pointer"
                  >
                    المجموعة نشطة
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSetSubmit}
                    disabled={loading}
                    className="flex-1 bg-yellow-primary text-black py-3 rounded hover:bg-yellow-hover transition-all font-bold disabled:opacity-50 shadow-md"
                  >
                    {loading ? "جاري الحفظ..." : "حفظ"}
                  </button>
                  <button
                    onClick={() => setShowSetModal(false)}
                    className="px-6 py-3 border-2 border-gray-light rounded hover:bg-gray-lighter transition-all font-bold"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Question Modal */}
        {showQuestionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-black border-b-2 border-yellow-primary px-6 py-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-yellow-primary">
                  {modalMode === "create" ? "إضافة سؤال جديد" : "تعديل السؤال"}
                </h2>
                <button
                  onClick={() => setShowQuestionModal(false)}
                  className="text-gray-light hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 space-y-4">
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
                    rows="3"
                    className="w-full px-4 py-2 border-2 border-gray-light rounded focus:border-yellow-primary focus:outline-none"
                    placeholder="اكتب السؤال هنا..."
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
                    className="w-full px-4 py-2 border-2 border-gray-light rounded focus:border-yellow-primary focus:outline-none"
                  />
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="معاينة"
                      className="mt-3 rounded-lg max-h-48 object-contain border-2 border-gray-light"
                    />
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">
                      الخيار A *
                    </label>
                    <input
                      type="text"
                      value={questionFormData.choice_a}
                      onChange={(e) =>
                        setQuestionFormData({
                          ...questionFormData,
                          choice_a: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border-2 border-gray-light rounded focus:border-yellow-primary focus:outline-none"
                      placeholder="الخيار الأول"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-black mb-2">
                      الخيار B *
                    </label>
                    <input
                      type="text"
                      value={questionFormData.choice_b}
                      onChange={(e) =>
                        setQuestionFormData({
                          ...questionFormData,
                          choice_b: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border-2 border-gray-light rounded focus:border-yellow-primary focus:outline-none"
                      placeholder="الخيار الثاني"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-black mb-2">
                      الخيار C *
                    </label>
                    <input
                      type="text"
                      value={questionFormData.choice_c}
                      onChange={(e) =>
                        setQuestionFormData({
                          ...questionFormData,
                          choice_c: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border-2 border-gray-light rounded focus:border-yellow-primary focus:outline-none"
                      placeholder="الخيار الثالث"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-black mb-2">
                      الخيار D *
                    </label>
                    <input
                      type="text"
                      value={questionFormData.choice_d}
                      onChange={(e) =>
                        setQuestionFormData({
                          ...questionFormData,
                          choice_d: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border-2 border-gray-light rounded focus:border-yellow-primary focus:outline-none"
                      placeholder="الخيار الرابع"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-black mb-2">
                    الإجابة الصحيحة *
                  </label>
                  <select
                    value={questionFormData.correct_answer}
                    onChange={(e) =>
                      setQuestionFormData({
                        ...questionFormData,
                        correct_answer: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border-2 border-gray-light rounded focus:border-yellow-primary focus:outline-none"
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-black mb-2">
                    الشرح (اختياري)
                  </label>
                  <textarea
                    value={questionFormData.explanation}
                    onChange={(e) =>
                      setQuestionFormData({
                        ...questionFormData,
                        explanation: e.target.value,
                      })
                    }
                    rows="3"
                    className="w-full px-4 py-2 border-2 border-gray-light rounded focus:border-yellow-primary focus:outline-none"
                    placeholder="شرح الإجابة الصحيحة..."
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
                      className="w-full px-4 py-2 border-2 border-gray-light rounded focus:border-yellow-primary focus:outline-none"
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
                      className="w-full px-4 py-2 border-2 border-gray-light rounded focus:border-yellow-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleQuestionSubmit}
                    disabled={loading}
                    className="flex-1 bg-yellow-primary text-black py-3 rounded hover:bg-yellow-hover transition-all font-bold disabled:opacity-50 flex items-center justify-center gap-2 shadow-md"
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
        {showDeleteConfirm && itemToDelete && (
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
                  هل أنت متأكد من حذف{" "}
                  {deleteType === "set" ? "المجموعة" : "السؤال"}
                  <span className="font-bold text-black">
                    {" "}
                    "
                    {deleteType === "set"
                      ? itemToDelete.title
                      : itemToDelete.question_text?.substring(0, 50)}
                    ..."
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
                    setItemToDelete(null);
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
