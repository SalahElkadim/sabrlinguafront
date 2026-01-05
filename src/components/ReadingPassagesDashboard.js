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
const CLOUDINARY_BASE_URL = "https://res.cloudinary.com/dyxozpomy/";

export default function ReadingPassagesDashboard() {
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [passages, setPassages] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentView, setCurrentView] = useState("tests");
  const [selectedTest, setSelectedTest] = useState(null);
  const [selectedPassage, setSelectedPassage] = useState(null);

  const [showPassageModal, setShowPassageModal] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState("");

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

      const response = await fetch(url, {
        method: modalMode === "create" ? "POST" : "PUT",
        headers: { Authorization: `Bearer ${getToken()}` },
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
      let imageUrl = null;

      if (typeof passage.passage_image === "string") {
        imageUrl = passage.passage_image;
      } else if (passage.passage_image?.url) {
        imageUrl = passage.passage_image.url;
      } else if (typeof passage.passage_image === "object") {
        imageUrl = Object.values(passage.passage_image)[0];
      }

      if (imageUrl && !imageUrl.startsWith("http")) {
        imageUrl = CLOUDINARY_BASE_URL + imageUrl;
      }

      setPassageImagePreview(imageUrl);
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
      let imageUrl = null;

      if (typeof question.question_image === "string") {
        imageUrl = question.question_image;
      } else if (question.question_image?.url) {
        imageUrl = question.question_image.url;
      } else if (typeof question.question_image === "object") {
        imageUrl = Object.values(question.question_image)[0];
      }

      if (imageUrl && !imageUrl.startsWith("http")) {
        imageUrl = CLOUDINARY_BASE_URL + imageUrl;
      }

      setQuestionImagePreview(imageUrl);
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

  const renderTestsView = () => (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-black mb-2">اختر الامتحان</h2>
        <p className="text-gray-dark">اختر الامتحان لإدارة قطع القراءة</p>
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
                setCurrentView("passages");
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

  const renderPassagesView = () => (
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
            قطع القراءة - {selectedTest?.title}
          </h2>
          <p className="text-gray-dark">إدارة قطع القراءة للامتحان</p>
        </div>
        <button
          onClick={openCreatePassageModal}
          className="flex items-center gap-2 bg-yellow-primary text-black px-6 py-3 rounded font-bold hover:bg-yellow-hover transition-all shadow-md"
        >
          <Plus size={20} />
          قطعة جديدة
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-yellow-primary border-t-transparent"></div>
        </div>
      ) : passages.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <BookOpen size={48} className="mx-auto mb-4 text-gray-medium" />
          <p className="text-gray-dark text-lg">لا توجد قطع قراءة</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {passages.map((passage) => (
            <div
              key={passage.id}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all p-6 border-r-4 border-yellow-primary"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-12 h-12 bg-yellow-light rounded-full flex items-center justify-center flex-shrink-0">
                    <BookOpen className="text-black" size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-black mb-2">
                      {passage.title}
                    </h3>
                    <p className="text-gray-dark text-sm line-clamp-3 mb-3">
                      {passage.passage_text.substring(0, 150)}...
                    </p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold flex-shrink-0 ${
                    passage.is_active
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {passage.is_active ? "نشط" : "غير نشط"}
                </span>
              </div>

              <div className="space-y-2 mb-4 text-sm">
                {passage.source && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-dark">المصدر:</span>
                    <span className="font-bold text-black">
                      {passage.source}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-gray-dark">عدد الأسئلة:</span>
                  <span className="font-bold text-black">
                    {passage.questions_count}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-dark">إجمالي النقاط:</span>
                  <span className="font-bold text-black">
                    {passage.total_points}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-dark">الترتيب:</span>
                  <span className="font-bold text-black">{passage.order}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedPassage(passage);
                    setCurrentView("questions");
                  }}
                  className="flex-1 bg-yellow-light text-black py-2 rounded hover:bg-yellow-primary transition-all font-bold"
                >
                  الأسئلة
                </button>
                <button
                  onClick={() => openEditPassageModal(passage)}
                  className="flex items-center justify-center gap-2 bg-gray-lighter text-black px-4 py-2 rounded hover:bg-gray-light transition-all"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => {
                    setItemToDelete(passage);
                    setDeleteType("passage");
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
            setCurrentView("passages");
            setSelectedPassage(null);
          }}
          className="p-2 hover:bg-gray-lighter rounded transition-colors"
        >
          <ArrowLeft size={24} className="text-black" />
        </button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-black">
            الأسئلة - {selectedPassage?.title}
          </h2>
          <p className="text-gray-dark">إدارة أسئلة القطعة</p>
        </div>
        <button
          onClick={openCreateQuestionModal}
          className="flex items-center gap-2 bg-yellow-primary text-black px-6 py-3 rounded font-bold hover:bg-yellow-hover transition-all shadow-md"
        >
          <Plus size={20} />
          سؤال جديد
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-r-4 border-yellow-primary">
        <div className="flex items-start gap-3 mb-4">
          <FileText className="text-black flex-shrink-0" size={24} />
          <h3 className="text-xl font-bold text-black">نص القطعة</h3>
        </div>
        {selectedPassage?.passage_image &&
          (() => {
            // استخراج رابط صورة القطعة بشكل صحيح
            let imageUrl = null;

            if (typeof selectedPassage.passage_image === "string") {
              imageUrl = selectedPassage.passage_image;
            } else if (selectedPassage.passage_image?.url) {
              imageUrl = selectedPassage.passage_image.url;
            } else if (typeof selectedPassage.passage_image === "object") {
              imageUrl = Object.values(selectedPassage.passage_image)[0];
            }

            // إضافة base URL إذا كان الرابط نسبي
            if (imageUrl && !imageUrl.startsWith("http")) {
              imageUrl = CLOUDINARY_BASE_URL + imageUrl;
            }

            return imageUrl ? (
              <img
                src={imageUrl}
                alt={selectedPassage.title}
                className="mb-4 rounded-lg max-h-64 w-full object-contain border-2 border-gray-light"
                onError={(e) => {
                  console.error("فشل تحميل صورة القطعة:", imageUrl);
                  e.target.style.display = "none";
                }}
              />
            ) : null;
          })()}
        <p className="text-gray-dark whitespace-pre-line leading-relaxed">
          {selectedPassage?.passage_text}
        </p>
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
                      // استخراج رابط صورة السؤال بشكل صحيح
                      let imageUrl = null;

                      if (typeof question.question_image === "string") {
                        imageUrl = question.question_image;
                      } else if (question.question_image?.url) {
                        imageUrl = question.question_image.url;
                      } else if (typeof question.question_image === "object") {
                        imageUrl = Object.values(question.question_image)[0];
                      }

                      // إضافة base URL إذا كان الرابط نسبي
                      if (imageUrl && !imageUrl.startsWith("http")) {
                        imageUrl = CLOUDINARY_BASE_URL + imageUrl;
                      }

                      return imageUrl ? (
                        <img
                          src={imageUrl}
                          alt="سؤال"
                          className="mb-4 rounded-lg max-h-48 object-contain border-2 border-gray-light"
                          onError={(e) => {
                            console.error("فشل تحميل صورة السؤال:", imageUrl);
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
        {currentView === "passages" && renderPassagesView()}
        {currentView === "questions" && renderQuestionsView()}

        {/* Passage Modal */}
        {showPassageModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full my-8">
              <div className="sticky top-0 bg-black border-b-2 border-yellow-primary px-6 py-4 flex justify-between items-center rounded-t-lg">
                <h2 className="text-2xl font-bold text-yellow-primary">
                  {modalMode === "create" ? "إضافة قطعة جديدة" : "تعديل القطعة"}
                </h2>
                <button
                  onClick={() => setShowPassageModal(false)}
                  className="text-gray-light hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                <div>
                  <label className="block text-sm font-bold text-black mb-2">
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
                    className="w-full px-4 py-2 border-2 border-gray-light rounded focus:border-yellow-primary focus:outline-none"
                    placeholder="مثال: قطعة عن التكنولوجيا"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-black mb-2">
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
                    className="w-full px-4 py-2 border-2 border-gray-light rounded focus:border-yellow-primary focus:outline-none"
                    placeholder="اكتب نص القطعة هنا..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-black mb-2">
                    صورة القطعة (اختياري)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePassageImageChange}
                    className="w-full px-4 py-2 border-2 border-gray-light rounded focus:border-yellow-primary focus:outline-none"
                  />
                  {passageImagePreview && (
                    <img
                      src={passageImagePreview}
                      alt="معاينة"
                      className="mt-3 rounded-lg max-h-48 object-contain border-2 border-gray-light"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-black mb-2">
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
                    className="w-full px-4 py-2 border-2 border-gray-light rounded focus:border-yellow-primary focus:outline-none"
                    placeholder="مثال: مجلة العلوم"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-black mb-2">
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
                    className="w-full px-4 py-2 border-2 border-gray-light rounded focus:border-yellow-primary focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-lighter rounded">
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
                    className="w-5 h-5 accent-yellow-primary"
                  />
                  <label
                    htmlFor="passage_is_active"
                    className="text-sm font-bold text-black cursor-pointer"
                  >
                    القطعة نشطة
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handlePassageSubmit}
                    disabled={loading}
                    className="flex-1 bg-yellow-primary text-black py-3 rounded hover:bg-yellow-hover transition-all font-bold disabled:opacity-50 shadow-md"
                  >
                    {loading ? "جاري الحفظ..." : "حفظ"}
                  </button>
                  <button
                    onClick={() => setShowPassageModal(false)}
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
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full my-8">
              <div className="sticky top-0 bg-black border-b-2 border-yellow-primary px-6 py-4 flex justify-between items-center rounded-t-lg">
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

              <div className="p-6 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
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
                    onChange={handleQuestionImageChange}
                    className="w-full px-4 py-2 border-2 border-gray-light rounded focus:border-yellow-primary focus:outline-none"
                  />
                  {questionImagePreview && (
                    <img
                      src={questionImagePreview}
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
                  {deleteType === "passage" ? "القطعة" : "السؤال"}
                  <span className="font-bold text-black">
                    {" "}
                    "
                    {deleteType === "passage"
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
