import React, { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Save,
  X,
  LogOut,
} from "lucide-react";

const API_BASE_URL = "https://sabrlinguaa-production.up.railway.app";

const PlacementTestDashboard = () => {
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [showTestForm, setShowTestForm] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  // Store tokens in state instead of localStorage
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);

  const [testForm, setTestForm] = useState({
    title: "",
    description: "",
    duration_minutes: 60,
    a1_min_score: 0,
    a2_min_score: 20,
    b1_min_score: 40,
    b2_min_score: 60,
    is_active: true,
  });

  const [mcqSetForm, setMcqSetForm] = useState({
    title: "",
    description: "",
    order: 0,
  });

  const [mcqQuestionForm, setMcqQuestionForm] = useState({
    question_text: "",
    choice_a: "",
    choice_b: "",
    choice_c: "",
    choice_d: "",
    correct_answer: "A",
    explanation: "",
    points: 1,
    order: 0,
  });

  const [readingPassageForm, setReadingPassageForm] = useState({
    title: "",
    passage_text: "",
    source: "",
    order: 0,
  });

  const [writingQuestionForm, setWritingQuestionForm] = useState({
    title: "",
    question_text: "",
    min_words: 100,
    max_words: 500,
    points: 10,
    order: 0,
  });

  const [mcqSets, setMcqSets] = useState([]);
  const [selectedMcqSet, setSelectedMcqSet] = useState(null);
  const [readingPassages, setReadingPassages] = useState([]);

  // Logout
  const handleLogout = useCallback(() => {
    setAccessToken(null);
    setRefreshToken(null);
    setIsAuthenticated(false);
    setTests([]);
    setSelectedTest(null);
  }, []);

  // Refresh Access Token
  const refreshAccessToken = useCallback(async () => {
    if (!refreshToken) return false;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/token/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        setAccessToken(data.access);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error refreshing token:", error);
      return false;
    }
  }, [refreshToken]);

  // API Request with Auto Token Refresh
  const apiRequest = useCallback(
    async (url, options = {}) => {
      const headers = {
        "Content-Type": "application/json",
        ...options.headers,
      };

      if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
      }

      let response = await fetch(url, { ...options, headers });

      // If 401, try to refresh token
      if (response.status === 401) {
        const refreshed = await refreshAccessToken();
        if (refreshed) {
          headers.Authorization = `Bearer ${accessToken}`;
          response = await fetch(url, { ...options, headers });
        } else {
          handleLogout();
          throw new Error("Authentication failed");
        }
      }

      return response;
    },
    [accessToken, refreshAccessToken, handleLogout]
  );

  // Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });

      if (response.ok) {
        const data = await response.json();
        setAccessToken(data.access);
        setRefreshToken(data.refresh);
        setIsAuthenticated(true);
        setLoginForm({ email: "", password: "" });
        setError("");
      } else {
        const errorData = await response.json();
        setError(errorData.detail || "اسم المستخدم أو كلمة المرور غير صحيحة");
      }
    } catch (error) {
      setError("حدث خطأ في الاتصال");
      console.error("Login error:", error);
    }
    setLoading(false);
  };

  // Load Tests
  const loadTests = useCallback(async () => {
    try {
      const response = await apiRequest(`${API_BASE_URL}/questions/tests/`);
      const data = await response.json();
      setTests(data);
    } catch (error) {
      console.error("Error loading tests:", error);
    }
  }, [apiRequest]);

  useEffect(() => {
    if (isAuthenticated) {
      loadTests();
    }
  }, [isAuthenticated, loadTests]);

  // Create/Update Test
  const handleSaveTest = async () => {
    setLoading(true);
    try {
      const method = testForm.id ? "PUT" : "POST";
      const url = testForm.id
        ? `${API_BASE_URL}/questions/tests/${testForm.id}/`
        : `${API_BASE_URL}/questions/tests/`;

      const response = await apiRequest(url, {
        method,
        body: JSON.stringify(testForm),
      });

      if (response.ok) {
        await loadTests();
        setShowTestForm(false);
        resetTestForm();
      }
    } catch (error) {
      console.error("Error saving test:", error);
      setError("حدث خطأ في حفظ الامتحان");
    }
    setLoading(false);
  };

  // Delete Test
  const handleDeleteTest = async (testId) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا الامتحان؟")) return;

    try {
      await apiRequest(`${API_BASE_URL}/questions/tests/${testId}/`, {
        method: "DELETE",
      });
      await loadTests();
    } catch (error) {
      console.error("Error deleting test:", error);
    }
  };

  // Load MCQ Sets
  const loadMcqSets = async (testId) => {
    try {
      const response = await apiRequest(
        `${API_BASE_URL}/questions/mcq-sets/?placement_test=${testId}`
      );
      const data = await response.json();
      setMcqSets(data);
    } catch (error) {
      console.error("Error loading MCQ sets:", error);
    }
  };

  // Save MCQ Set
  const handleSaveMcqSet = async () => {
    if (!selectedTest) return;

    setLoading(true);
    try {
      const response = await apiRequest(`${API_BASE_URL}/questions/mcq-sets/`, {
        method: "POST",
        body: JSON.stringify({
          ...mcqSetForm,
          placement_test: selectedTest.id,
        }),
      });

      if (response.ok) {
        await loadMcqSets(selectedTest.id);
        setMcqSetForm({ title: "", description: "", order: 0 });
      }
    } catch (error) {
      console.error("Error saving MCQ set:", error);
    }
    setLoading(false);
  };

  // Save MCQ Question
  const handleSaveMcqQuestion = async () => {
    if (!selectedMcqSet) return;

    setLoading(true);
    try {
      const response = await apiRequest(
        `${API_BASE_URL}/questions/mcq-questions/`,
        {
          method: "POST",
          body: JSON.stringify({
            ...mcqQuestionForm,
            question_set: selectedMcqSet.id,
          }),
        }
      );

      if (response.ok) {
        await loadMcqSets(selectedTest.id);
        setMcqQuestionForm({
          question_text: "",
          choice_a: "",
          choice_b: "",
          choice_c: "",
          choice_d: "",
          correct_answer: "A",
          explanation: "",
          points: 1,
          order: 0,
        });
      }
    } catch (error) {
      console.error("Error saving MCQ question:", error);
    }
    setLoading(false);
  };

  // Load Reading Passages
  const loadReadingPassages = async (testId) => {
    try {
      const response = await apiRequest(
        `${API_BASE_URL}/questions/reading-passages/?placement_test=${testId}`
      );
      const data = await response.json();
      setReadingPassages(data);
    } catch (error) {
      console.error("Error loading reading passages:", error);
    }
  };

  // Save Reading Passage
  const handleSaveReadingPassage = async () => {
    if (!selectedTest) return;

    setLoading(true);
    try {
      const response = await apiRequest(
        `${API_BASE_URL}/questions/reading-passages/`,
        {
          method: "POST",
          body: JSON.stringify({
            ...readingPassageForm,
            placement_test: selectedTest.id,
          }),
        }
      );

      if (response.ok) {
        await loadReadingPassages(selectedTest.id);
        setReadingPassageForm({
          title: "",
          passage_text: "",
          source: "",
          order: 0,
        });
      }
    } catch (error) {
      console.error("Error saving reading passage:", error);
    }
    setLoading(false);
  };

  // Save Writing Question
  const handleSaveWritingQuestion = async () => {
    if (!selectedTest) return;

    setLoading(true);
    try {
      const response = await apiRequest(
        `${API_BASE_URL}/questions/writing-questions/`,
        {
          method: "POST",
          body: JSON.stringify({
            ...writingQuestionForm,
            placement_test: selectedTest.id,
          }),
        }
      );

      if (response.ok) {
        setWritingQuestionForm({
          title: "",
          question_text: "",
          min_words: 100,
          max_words: 500,
          points: 10,
          order: 0,
        });
        alert("تم إضافة سؤال الكتابة بنجاح");
      }
    } catch (error) {
      console.error("Error saving writing question:", error);
    }
    setLoading(false);
  };

  const resetTestForm = () => {
    setTestForm({
      title: "",
      description: "",
      duration_minutes: 60,
      a1_min_score: 0,
      a2_min_score: 20,
      b1_min_score: 40,
      b2_min_score: 60,
      is_active: true,
    });
  };

  const handleTestSelect = async (test) => {
    setSelectedTest(test);
    await loadMcqSets(test.id);
    await loadReadingPassages(test.id);
    setActiveSection("mcq");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
            تسجيل الدخول
          </h1>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-700">
                البريد الالكتروني
              </label>
              <input
                type="text"
                value={loginForm.email}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, email: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-gray-700">
                كلمة المرور
              </label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, password: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-medium"
            >
              {loading ? "جاري تسجيل الدخول..." : "دخول"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
              إدارة امتحانات تحديد المستوى
            </h1>
            <div className="flex gap-2">
              <button
                onClick={() => setShowTestForm(!showTestForm)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
              >
                <Plus size={20} />
                امتحان جديد
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700"
              >
                <LogOut size={20} />
                خروج
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {showTestForm && (
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h2 className="text-xl font-bold mb-4">إضافة امتحان جديد</h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    عنوان الامتحان
                  </label>
                  <input
                    type="text"
                    value={testForm.title}
                    onChange={(e) =>
                      setTestForm({ ...testForm, title: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    المدة (بالدقائق)
                  </label>
                  <input
                    type="number"
                    value={testForm.duration_minutes}
                    onChange={(e) =>
                      setTestForm({
                        ...testForm,
                        duration_minutes: parseInt(e.target.value),
                      })
                    }
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">الوصف</label>
                <textarea
                  value={testForm.description}
                  onChange={(e) =>
                    setTestForm({ ...testForm, description: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg"
                  rows="3"
                />
              </div>
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    A1 (من 0)
                  </label>
                  <input
                    type="number"
                    value={testForm.a1_min_score}
                    onChange={(e) =>
                      setTestForm({
                        ...testForm,
                        a1_min_score: parseInt(e.target.value),
                      })
                    }
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    A2 (من)
                  </label>
                  <input
                    type="number"
                    value={testForm.a2_min_score}
                    onChange={(e) =>
                      setTestForm({
                        ...testForm,
                        a2_min_score: parseInt(e.target.value),
                      })
                    }
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    B1 (من)
                  </label>
                  <input
                    type="number"
                    value={testForm.b1_min_score}
                    onChange={(e) =>
                      setTestForm({
                        ...testForm,
                        b1_min_score: parseInt(e.target.value),
                      })
                    }
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    B2 (من)
                  </label>
                  <input
                    type="number"
                    value={testForm.b2_min_score}
                    onChange={(e) =>
                      setTestForm({
                        ...testForm,
                        b2_min_score: parseInt(e.target.value),
                      })
                    }
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSaveTest}
                  disabled={loading}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700"
                >
                  <Save size={18} />
                  حفظ
                </button>
                <button
                  onClick={() => setShowTestForm(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-600"
                >
                  <X size={18} />
                  إلغاء
                </button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {tests.map((test) => (
              <div
                key={test.id}
                className="border rounded-lg p-4 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-center">
                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => handleTestSelect(test)}
                  >
                    <h3 className="text-xl font-bold text-gray-800">
                      {test.title}
                    </h3>
                    <p className="text-gray-600">{test.description}</p>
                    <div className="flex gap-4 mt-2 text-sm text-gray-500">
                      <span>المدة: {test.duration_minutes} دقيقة</span>
                      <span>الأسئلة: {test.questions_count || 0}</span>
                      <span>النقاط: {test.total_points || 0}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDeleteTest(test.id)}
                      className="text-red-600 hover:bg-red-50 p-2 rounded"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {selectedTest?.id === test.id && (
                  <div className="mt-6 border-t pt-6">
                    <div className="flex gap-2 mb-6">
                      <button
                        onClick={() => setActiveSection("mcq")}
                        className={`px-4 py-2 rounded-lg ${
                          activeSection === "mcq"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200"
                        }`}
                      >
                        أسئلة MCQ
                      </button>
                      <button
                        onClick={() => setActiveSection("reading")}
                        className={`px-4 py-2 rounded-lg ${
                          activeSection === "reading"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200"
                        }`}
                      >
                        أسئلة القراءة
                      </button>
                      <button
                        onClick={() => setActiveSection("writing")}
                        className={`px-4 py-2 rounded-lg ${
                          activeSection === "writing"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200"
                        }`}
                      >
                        أسئلة الكتابة
                      </button>
                    </div>

                    {activeSection === "mcq" && (
                      <div>
                        <div className="bg-blue-50 p-4 rounded-lg mb-4">
                          <h3 className="font-bold mb-3">
                            إضافة مجموعة أسئلة MCQ
                          </h3>
                          <div className="grid grid-cols-2 gap-4 mb-3">
                            <input
                              type="text"
                              placeholder="عنوان المجموعة"
                              value={mcqSetForm.title}
                              onChange={(e) =>
                                setMcqSetForm({
                                  ...mcqSetForm,
                                  title: e.target.value,
                                })
                              }
                              className="p-2 border rounded-lg"
                            />
                            <input
                              type="number"
                              placeholder="الترتيب"
                              value={mcqSetForm.order}
                              onChange={(e) =>
                                setMcqSetForm({
                                  ...mcqSetForm,
                                  order: parseInt(e.target.value),
                                })
                              }
                              className="p-2 border rounded-lg"
                            />
                          </div>
                          <textarea
                            placeholder="وصف المجموعة"
                            value={mcqSetForm.description}
                            onChange={(e) =>
                              setMcqSetForm({
                                ...mcqSetForm,
                                description: e.target.value,
                              })
                            }
                            className="w-full p-2 border rounded-lg mb-3"
                            rows="2"
                          />
                          <button
                            onClick={handleSaveMcqSet}
                            disabled={loading}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                          >
                            إضافة المجموعة
                          </button>
                        </div>

                        {mcqSets.map((set) => (
                          <div
                            key={set.id}
                            className="border rounded-lg p-4 mb-4"
                          >
                            <div
                              className="flex justify-between items-center cursor-pointer"
                              onClick={() =>
                                setSelectedMcqSet(
                                  selectedMcqSet?.id === set.id ? null : set
                                )
                              }
                            >
                              <div>
                                <h4 className="font-bold">{set.title}</h4>
                                <p className="text-sm text-gray-600">
                                  الأسئلة: {set.questions_count || 0} | النقاط:{" "}
                                  {set.total_points || 0}
                                </p>
                              </div>
                              {selectedMcqSet?.id === set.id ? (
                                <ChevronUp />
                              ) : (
                                <ChevronDown />
                              )}
                            </div>

                            {selectedMcqSet?.id === set.id && (
                              <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                                <h5 className="font-bold mb-3">إضافة سؤال</h5>
                                <textarea
                                  placeholder="نص السؤال"
                                  value={mcqQuestionForm.question_text}
                                  onChange={(e) =>
                                    setMcqQuestionForm({
                                      ...mcqQuestionForm,
                                      question_text: e.target.value,
                                    })
                                  }
                                  className="w-full p-2 border rounded-lg mb-2"
                                  rows="2"
                                />
                                <div className="grid grid-cols-2 gap-2 mb-2">
                                  <input
                                    type="text"
                                    placeholder="الاختيار أ"
                                    value={mcqQuestionForm.choice_a}
                                    onChange={(e) =>
                                      setMcqQuestionForm({
                                        ...mcqQuestionForm,
                                        choice_a: e.target.value,
                                      })
                                    }
                                    className="p-2 border rounded-lg"
                                  />
                                  <input
                                    type="text"
                                    placeholder="الاختيار ب"
                                    value={mcqQuestionForm.choice_b}
                                    onChange={(e) =>
                                      setMcqQuestionForm({
                                        ...mcqQuestionForm,
                                        choice_b: e.target.value,
                                      })
                                    }
                                    className="p-2 border rounded-lg"
                                  />
                                  <input
                                    type="text"
                                    placeholder="الاختيار ج"
                                    value={mcqQuestionForm.choice_c}
                                    onChange={(e) =>
                                      setMcqQuestionForm({
                                        ...mcqQuestionForm,
                                        choice_c: e.target.value,
                                      })
                                    }
                                    className="p-2 border rounded-lg"
                                  />
                                  <input
                                    type="text"
                                    placeholder="الاختيار د"
                                    value={mcqQuestionForm.choice_d}
                                    onChange={(e) =>
                                      setMcqQuestionForm({
                                        ...mcqQuestionForm,
                                        choice_d: e.target.value,
                                      })
                                    }
                                    className="p-2 border rounded-lg"
                                  />
                                </div>
                                <div className="grid grid-cols-3 gap-2 mb-2">
                                  <select
                                    value={mcqQuestionForm.correct_answer}
                                    onChange={(e) =>
                                      setMcqQuestionForm({
                                        ...mcqQuestionForm,
                                        correct_answer: e.target.value,
                                      })
                                    }
                                    className="p-2 border rounded-lg"
                                  >
                                    <option value="A">أ</option>
                                    <option value="B">ب</option>
                                    <option value="C">ج</option>
                                    <option value="D">د</option>
                                  </select>
                                  <input
                                    type="number"
                                    placeholder="النقاط"
                                    value={mcqQuestionForm.points}
                                    onChange={(e) =>
                                      setMcqQuestionForm({
                                        ...mcqQuestionForm,
                                        points: parseInt(e.target.value),
                                      })
                                    }
                                    className="p-2 border rounded-lg"
                                  />
                                  <input
                                    type="number"
                                    placeholder="الترتيب"
                                    value={mcqQuestionForm.order}
                                    onChange={(e) =>
                                      setMcqQuestionForm({
                                        ...mcqQuestionForm,
                                        order: parseInt(e.target.value),
                                      })
                                    }
                                    className="p-2 border rounded-lg"
                                  />
                                </div>
                                <textarea
                                  placeholder="شرح الإجابة"
                                  value={mcqQuestionForm.explanation}
                                  onChange={(e) =>
                                    setMcqQuestionForm({
                                      ...mcqQuestionForm,
                                      explanation: e.target.value,
                                    })
                                  }
                                  className="w-full p-2 border rounded-lg mb-2"
                                  rows="2"
                                />
                                <button
                                  onClick={handleSaveMcqQuestion}
                                  disabled={loading}
                                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                                >
                                  إضافة السؤال
                                </button>

                                {set.questions && set.questions.length > 0 && (
                                  <div className="mt-4 space-y-2">
                                    {set.questions.map((q, idx) => (
                                      <div
                                        key={q.id}
                                        className="bg-white p-3 rounded border"
                                      >
                                        <p className="font-medium">
                                          س{idx + 1}: {q.question_text}
                                        </p>
                                        <div className="text-sm text-gray-600 mt-1">
                                          <span className="text-green-600 font-bold">
                                            ✓ الإجابة: {q.correct_answer}
                                          </span>
                                          <span className="mr-4">
                                            النقاط: {q.points}
                                          </span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {activeSection === "reading" && (
                      <div>
                        <div className="bg-green-50 p-4 rounded-lg mb-4">
                          <h3 className="font-bold mb-3">إضافة قطعة قراءة</h3>
                          <input
                            type="text"
                            placeholder="عنوان القطعة"
                            value={readingPassageForm.title}
                            onChange={(e) =>
                              setReadingPassageForm({
                                ...readingPassageForm,
                                title: e.target.value,
                              })
                            }
                            className="w-full p-2 border rounded-lg mb-2"
                          />
                          <textarea
                            placeholder="نص القطعة"
                            value={readingPassageForm.passage_text}
                            onChange={(e) =>
                              setReadingPassageForm({
                                ...readingPassageForm,
                                passage_text: e.target.value,
                              })
                            }
                            className="w-full p-2 border rounded-lg mb-2"
                            rows="4"
                          />
                          <div className="grid grid-cols-2 gap-2 mb-3">
                            <input
                              type="text"
                              placeholder="المصدر"
                              value={readingPassageForm.source}
                              onChange={(e) =>
                                setReadingPassageForm({
                                  ...readingPassageForm,
                                  source: e.target.value,
                                })
                              }
                              className="p-2 border rounded-lg"
                            />
                            <input
                              type="number"
                              placeholder="الترتيب"
                              value={readingPassageForm.order}
                              onChange={(e) =>
                                setReadingPassageForm({
                                  ...readingPassageForm,
                                  order: parseInt(e.target.value),
                                })
                              }
                              className="p-2 border rounded-lg"
                            />
                          </div>
                          <button
                            onClick={handleSaveReadingPassage}
                            disabled={loading}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                          >
                            إضافة القطعة
                          </button>
                        </div>

                        {readingPassages.map((passage) => (
                          <div
                            key={passage.id}
                            className="border rounded-lg p-4 mb-4"
                          >
                            <h4 className="font-bold">{passage.title}</h4>
                            <p className="text-sm text-gray-600 mt-2">
                              {passage.passage_text.substring(0, 150)}...
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                              الأسئلة: {passage.questions_count || 0} | النقاط:{" "}
                              {passage.total_points || 0}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {activeSection === "writing" && (
                      <div>
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <h3 className="font-bold mb-3">إضافة سؤال كتابة</h3>
                          <input
                            type="text"
                            placeholder="عنوان السؤال"
                            value={writingQuestionForm.title}
                            onChange={(e) =>
                              setWritingQuestionForm({
                                ...writingQuestionForm,
                                title: e.target.value,
                              })
                            }
                            className="w-full p-2 border rounded-lg mb-2"
                          />
                          <textarea
                            placeholder="نص السؤال"
                            value={writingQuestionForm.question_text}
                            onChange={(e) =>
                              setWritingQuestionForm({
                                ...writingQuestionForm,
                                question_text: e.target.value,
                              })
                            }
                            className="w-full p-2 border rounded-lg mb-2"
                            rows="3"
                          />
                          <div className="grid grid-cols-4 gap-2 mb-3">
                            <input
                              type="number"
                              placeholder="الحد الأدنى للكلمات"
                              value={writingQuestionForm.min_words}
                              onChange={(e) =>
                                setWritingQuestionForm({
                                  ...writingQuestionForm,
                                  min_words: parseInt(e.target.value),
                                })
                              }
                              className="p-2 border rounded-lg"
                            />
                            <input
                              type="number"
                              placeholder="الحد الأقصى للكلمات"
                              value={writingQuestionForm.max_words}
                              onChange={(e) =>
                                setWritingQuestionForm({
                                  ...writingQuestionForm,
                                  max_words: parseInt(e.target.value),
                                })
                              }
                              className="p-2 border rounded-lg"
                            />
                            <input
                              type="number"
                              placeholder="النقاط"
                              value={writingQuestionForm.points}
                              onChange={(e) =>
                                setWritingQuestionForm({
                                  ...writingQuestionForm,
                                  points: parseInt(e.target.value),
                                })
                              }
                              className="p-2 border rounded-lg"
                            />
                            <input
                              type="number"
                              placeholder="الترتيب"
                              value={writingQuestionForm.order}
                              onChange={(e) =>
                                setWritingQuestionForm({
                                  ...writingQuestionForm,
                                  order: parseInt(e.target.value),
                                })
                              }
                              className="p-2 border rounded-lg"
                            />
                          </div>
                          <button
                            onClick={handleSaveWritingQuestion}
                            disabled={loading}
                            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                          >
                            إضافة السؤال
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlacementTestDashboard;
