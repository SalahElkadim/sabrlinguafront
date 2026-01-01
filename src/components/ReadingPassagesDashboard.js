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
  BookOpen,
  FileText,
} from "lucide-react";

const API_URL = "https://sabrlinguaa-production.up.railway.app/questions";

export default function ReadingPassagesDashboard() {
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [passages, setPassages] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentView, setCurrentView] = useState("tests"); // tests, passages, questions
  const [selectedTest, setSelectedTest] = useState(null);
  const [selectedPassage, setSelectedPassage] = useState(null);

  // Modals
  const [showPassageModal, setShowPassageModal] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState(""); // 'passage' or 'question'

  // Form Data
  const [passageFormData, setPassageFormData] = useState({
    placement_test: "",
    title: "",
    passage_text: "",
    passage_image: null,
    source: "",
    order: "1",
    is_active: true,
  });

  const [questionFormData, setQuestionFormData] = useState({
    passage: "",
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

  const [passageImagePreview, setPassageImagePreview] = useState(null);
  const [questionImagePreview, setQuestionImagePreview] = useState(null);

  useEffect(() => {
    fetchTests();
  }, []);

  useEffect(() => {
    if (selectedTest) {
      fetchPassages(selectedTest.id);
    }
  }, [selectedTest]);

  useEffect(() => {
    if (selectedPassage) {
      fetchQuestions(selectedPassage.id);
    }
  }, [selectedPassage]);

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

  // Fetch Passages
  const fetchPassages = async (testId) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/reading-passages/?test_id=${testId}`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      const result = await response.json();
      if (result.success) {
        setPassages(result.data);
      }
    } catch (error) {
      console.error("خطأ في جلب القطع:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Questions
  const fetchQuestions = async (passageId) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/reading-questions/?passage_id=${passageId}`,
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

  // Handle Passage Submit
  const handlePassageSubmit = async () => {
    if (
      !passageFormData.title ||
      !passageFormData.passage_text ||
      !passageFormData.placement_test
    ) {
      alert("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();

      Object.keys(passageFormData).forEach((key) => {
        if (key === "passage_image" && passageFormData[key]) {
          formData.append(key, passageFormData[key]);
        } else if (key !== "passage_image") {
          formData.append(key, passageFormData[key]);
        }
      });

      const url =
        modalMode === "create"
          ? `${API_URL}/reading-passages/`
          : `${API_URL}/reading-passages/${
              itemToDelete?.id || selectedPassage.id
            }/`;

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
        setShowPassageModal(false);
        resetPassageForm();
        if (selectedTest) {
          fetchPassages(selectedTest.id);
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

  // Handle Question Submit
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
          ? `${API_URL}/reading-questions/`
          : `${API_URL}/reading-questions/${itemToDelete?.id}/`;

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
        if (selectedPassage) {
          fetchQuestions(selectedPassage.id);
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
      const url =
        deleteType === "passage"
          ? `${API_URL}/reading-passages/${itemToDelete.id}/`
          : `${API_URL}/reading-questions/${itemToDelete.id}/`;

      const response = await fetch(url, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      const result = await response.json();
      if (result.success) {
        alert(result.message);
        setShowDeleteConfirm(false);
        setItemToDelete(null);
        if (deleteType === "passage" && selectedTest) {
          fetchPassages(selectedTest.id);
        } else if (deleteType === "question" && selectedPassage) {
          fetchQuestions(selectedPassage.id);
        }
      }
    } catch (error) {
      console.error("خطأ في الحذف:", error);
      alert("حدث خطأ في عملية الحذف");
    } finally {
      setLoading(false);
    }
  };

  const resetPassageForm = () => {
    setPassageFormData({
      placement_test: selectedTest?.id || "",
      title: "",
      passage_text: "",
      passage_image: null,
      source: "",
      order: "1",
      is_active: true,
    });
    setPassageImagePreview(null);
  };

  const resetQuestionForm = () => {
    setQuestionFormData({
      passage: selectedPassage?.id || "",
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
    setQuestionImagePreview(null);
  };

  const openCreatePassageModal = () => {
    setModalMode("create");
    resetPassageForm();
    setPassageFormData({ ...passageFormData, placement_test: selectedTest.id });
    setShowPassageModal(true);
  };

  const openEditPassageModal = (passage) => {
    setModalMode("edit");
    setItemToDelete(passage);
    setPassageFormData({
      placement_test: passage.placement_test,
      title: passage.title,
      passage_text: passage.passage_text,
      passage_image: null,
      source: passage.source || "",
      order: passage.order.toString(),
      is_active: passage.is_active,
    });
    if (passage.passage_image) {
      setPassageImagePreview(passage.passage_image);
    }
    setShowPassageModal(true);
  };

  const openCreateQuestionModal = () => {
    setModalMode("create");
    resetQuestionForm();
    setQuestionFormData({ ...questionFormData, passage: selectedPassage.id });
    setShowQuestionModal(true);
  };

  const openEditQuestionModal = (question) => {
    setModalMode("edit");
    setItemToDelete(question);
    setQuestionFormData({
      passage: question.passage,
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
      setQuestionImagePreview(question.question_image);
    }
    setShowQuestionModal(true);
  };

  const handlePassageImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPassageFormData({ ...passageFormData, passage_image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPassageImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleQuestionImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setQuestionFormData({ ...questionFormData, question_image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setQuestionImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Render Tests View
  const renderTestsView = () => (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">اختر الامتحان</h2>
        <p className="text-gray-600">اختر الامتحان لإدارة قطع القراءة</p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-600 border-t-transparent"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map((test) => (
            <div
              key={test.id}
              onClick={() => {
                setSelectedTest(test);
                setCurrentView("passages");
              }}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 cursor-pointer border-r-4 border-orange-500"
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

  // Render Passages View
  const renderPassagesView = () => (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => {
            setCurrentView("tests");
            setSelectedTest(null);
          }}
          className="text-orange-600 hover:text-orange-700"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-800">
            قطع القراءة - {selectedTest?.title}
          </h2>
          <p className="text-gray-600">إدارة قطع القراءة للامتحان</p>
        </div>
        <button
          onClick={openCreatePassageModal}
          className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3 rounded-lg hover:from-orange-700 hover:to-red-700 transition-all shadow-md"
        >
          <Plus size={20} />
          قطعة جديدة
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-600 border-t-transparent"></div>
        </div>
      ) : passages.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <p className="text-gray-500 text-lg">لا توجد قطع قراءة</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {passages.map((passage) => (
            <div
              key={passage.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 border-r-4 border-orange-500"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <BookOpen className="text-orange-600" size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {passage.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                      {passage.passage_text.substring(0, 150)}...
                    </p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${
                    passage.is_active
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {passage.is_active ? "نشط" : "غير نشط"}
                </span>
              </div>

              {passage.passage_image && (
                <img
                  src={passage.passage_image}
                  alt={passage.title}
                  className="mb-4 rounded-lg max-h-32 w-full object-cover"
                />
              )}

              <div className="space-y-2 mb-4 text-sm">
                {passage.source && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">المصدر:</span>
                    <span className="font-semibold">{passage.source}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">عدد الأسئلة:</span>
                  <span className="font-semibold">
                    {passage.questions_count}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">إجمالي النقاط:</span>
                  <span className="font-semibold">{passage.total_points}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">الترتيب:</span>
                  <span className="font-semibold">{passage.order}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedPassage(passage);
                    setCurrentView("questions");
                  }}
                  className="flex-1 bg-orange-50 text-orange-600 py-2 rounded-lg hover:bg-orange-100 transition-all font-semibold"
                >
                  الأسئلة
                </button>
                <button
                  onClick={() => openEditPassageModal(passage)}
                  className="flex items-center justify-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-all"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => {
                    setItemToDelete(passage);
                    setDeleteType("passage");
                    setShowDeleteConfirm(true);
                  }}
                  className="flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-all"
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

  // Render Questions View
  const renderQuestionsView = () => (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => {
            setCurrentView("passages");
            setSelectedPassage(null);
          }}
          className="text-orange-600 hover:text-orange-700"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-800">
            الأسئلة - {selectedPassage?.title}
          </h2>
          <p className="text-gray-600">إدارة أسئلة القطعة</p>
        </div>
        <button
          onClick={openCreateQuestionModal}
          className="flex items-center gap-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-6 py-3 rounded-lg hover:from-teal-700 hover:to-cyan-700 transition-all shadow-md"
        >
          <Plus size={20} />
          سؤال جديد
        </button>
      </div>

      {/* Display Passage Text */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6 border-r-4 border-orange-500">
        <div className="flex items-start gap-3 mb-4">
          <FileText className="text-orange-600 flex-shrink-0" size={24} />
          <h3 className="text-xl font-bold text-gray-800">نص القطعة</h3>
        </div>
        {selectedPassage?.passage_image && (
          <img
            src={selectedPassage.passage_image}
            alt={selectedPassage.title}
            className="mb-4 rounded-lg max-h-64 w-full object-contain"
          />
        )}
        <p className="text-gray-700 whitespace-pre-line leading-relaxed">
          {selectedPassage?.passage_text}
        </p>
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
                  <p className="text-lg font-semibold text-gray-800 mb-3">
                    {question.question_text}
                  </p>

                  {question.question_image && (
                    <img
                      src={question.question_image}
                      alt="سؤال"
                      className="mb-4 rounded-lg max-h-48 object-contain"
                    />
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                    {["A", "B", "C", "D"].map((choice) => (
                      <div
                        key={choice}
                        className={`p-3 rounded-lg border-2 ${
                          question.correct_answer === choice
                            ? "bg-green-50 border-green-500"
                            : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <span className="font-bold text-gray-700">
                          {choice}:
                        </span>{" "}
                        {question[`choice_${choice.toLowerCase()}`]}
                      </div>
                    ))}
                  </div>

                  {question.explanation && (
                    <div className="bg-blue-50 p-3 rounded-lg mb-3">
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">الشرح:</span>{" "}
                        {question.explanation}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>النقاط: {question.points}</span>
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
                      setDeleteType("question");
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
      className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 p-6"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto">
        {currentView === "tests" && renderTestsView()}
        {currentView === "passages" && renderPassagesView()}
        {currentView === "questions" && renderQuestionsView()}

        {/* Passage Modal */}
        {showPassageModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full my-8">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center rounded-t-2xl">
                <h2 className="text-2xl font-bold text-gray-800">
                  {modalMode === "create" ? "إضافة قطعة جديدة" : "تعديل القطعة"}
                </h2>
                <button
                  onClick={() => setShowPassageModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    عنوان القطعة *
                  </label>
                  <input
                    type="text"
                    value={passageFormData.title}
                    onChange={(e) =>
                      setPassageFormData({
                        ...passageFormData,
                        title: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="مثال: قطعة عن التكنولوجيا"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    نص القطعة *
                  </label>
                  <textarea
                    value={passageFormData.passage_text}
                    onChange={(e) =>
                      setPassageFormData({
                        ...passageFormData,
                        passage_text: e.target.value,
                      })
                    }
                    rows="10"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="اكتب نص القطعة هنا..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    صورة القطعة (اختياري)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePassageImageChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                  {passageImagePreview && (
                    <img
                      src={passageImagePreview}
                      alt="معاينة"
                      className="mt-3 rounded-lg max-h-48 object-contain border-2 border-gray-200"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    المصدر (اختياري)
                  </label>
                  <input
                    type="text"
                    value={passageFormData.source}
                    onChange={(e) =>
                      setPassageFormData({
                        ...passageFormData,
                        source: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="مثال: مجلة العلوم"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    الترتيب *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={passageFormData.order}
                    onChange={(e) =>
                      setPassageFormData({
                        ...passageFormData,
                        order: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    id="passage_is_active"
                    checked={passageFormData.is_active}
                    onChange={(e) =>
                      setPassageFormData({
                        ...passageFormData,
                        is_active: e.target.checked,
                      })
                    }
                    className="w-5 h-5 text-orange-600 rounded focus:ring-2 focus:ring-orange-500"
                  />
                  <label
                    htmlFor="passage_is_active"
                    className="text-sm font-semibold text-gray-700 cursor-pointer"
                  >
                    القطعة نشطة
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handlePassageSubmit}
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 rounded-lg hover:from-orange-700 hover:to-red-700 transition-all font-semibold disabled:opacity-50"
                  >
                    {loading ? "جاري الحفظ..." : "حفظ"}
                  </button>
                  <button
                    onClick={() => setShowPassageModal(false)}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all font-semibold"
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full my-8">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center rounded-t-2xl">
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

              <div className="p-6 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
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
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="اكتب السؤال هنا..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    صورة السؤال (اختياري)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleQuestionImageChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                  {questionImagePreview && (
                    <img
                      src={questionImagePreview}
                      alt="معاينة"
                      className="mt-3 rounded-lg max-h-48 object-contain border-2 border-gray-200"
                    />
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="الخيار الأول"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="الخيار الثاني"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="الخيار الثالث"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="الخيار الرابع"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="شرح الإجابة الصحيحة..."
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
                  هل أنت متأكد من حذف{" "}
                  {deleteType === "passage" ? "القطعة" : "السؤال"}
                  <span className="font-bold text-gray-800">
                    {" "}
                    "
                    {deleteType === "passage"
                      ? itemToDelete.title
                      : itemToDelete.question_text?.substring(0, 50)}
                    ..."
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
