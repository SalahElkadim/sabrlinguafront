// src/App.jsx - WITH IELTS + STEP ROUTES
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import DashboardLayout from "./components/DashboardLayout";
import Dashboard from "./pages/Dashboard";

// Placement Test Routes
import QuestionBanksList from "./pages/QuestionBanksList";
import CreateQuestionBank from "./pages/CreateQuestionBank";
import QuestionBankDetails from "./pages/Questionbankdetail";
import AddVocabularyQuestion from "./pages/Addvocabularyquestion";
import AddGrammarQuestion from "./pages/Addgrammarquestion";
import AddReadingQuestion from "./pages/Addreadingquestion";
import AddListeningQuestion from "./pages/AddListeningQuestion";
import AddSpeakingQuestion from "./pages/AddSpeakingQuestion";
import AddWritingQuestion from "./pages/Addwritingquestion";

// Levels System Routes
import LevelsList from "./pages/Levelslist";
import CreateLevel from "./pages/Createlevel";
import LevelDetails from "./pages/Leveldetails";
import EditLevel from "./pages/Editlevel";

// Units Routes
import UnitsList from "./pages/UnitsList";
import CreateUnit from "./pages/CreateUnit";
import UnitDetails from "./pages/UnitDetails";
import EditUnit from "./pages/EditUnit";
import AddLessonContent from "./pages/AddLessonContent";

// Lessons Routes
import LessonsList from "./pages/LessonsList";
import CreateLesson from "./pages/CreateLesson";
import LessonDetails from "./pages/Lessondetails";
import EditLesson from "./pages/Editlesson";

// Level Question Banks Routes
import LevelQuestionBanksList from "./pages/Levelquestionbankslist";
import LevelQuestionBankDetails from "./pages/Levelquestionbankdetails";
import AddLevelVocabularyQuestion from "./pages/Addlevelvocabularyquestion";
import AddLevelGrammarQuestion from "./pages/Addlevelgrammarquestion";
import AddLevelReadingQuestion from "./pages/AddLevelReadingQuestion";
import AddLevelListeningQuestion from "./pages/AddLevelListeningQuestion";
import AddLevelSpeakingQuestion from "./pages/AddLevelSpeakingQuestion";
import AddLevelWritingQuestion from "./pages/AddLevelWritingQuestion";

// IELTS Routes
import IELTSMain from "./pages/IELTSMain";
import IELTSSkillsList from "./pages/IELTSSkillsList";
import CreateIELTSSkill from "./pages/CreateIELTSSkill";
import EditIELTSSkill from "./pages/EditIELTSSkill";
import IELTSSkillDetails from "./pages/IELTSSkillDetails";
import CreateLessonPack from "./pages/CreateLessonPack";
import LessonPackDetails from "./pages/LessonPackDetails";
import EditLessonPack from "./pages/EditLessonPack";
import CreateIELTSLesson from "./pages/CreateIELTSLesson";
import EditIELTSLesson from "./pages/EditIELTSLesson";
import IELTSLessonDetails from "./pages/IELTSLessonDetails";
import PracticeExamDetails from "./pages/PracticeExamDetails";
import AddVocabularyToPracticeExam from "./pages/AddVocabularyToPracticeExam";
import AddGrammarToPracticeExam from "./pages/AddGrammarToPracticeExam";
import AddReadingToPracticeExam from "./pages/AddReadingToPracticeExam";
import AddListeningToPracticeExam from "./pages/AddListeningToPracticeExam";
import AddSpeakingToPracticeExam from "./pages/AddSpeakingToPracticeExam";
import AddWritingToPracticeExam from "./pages/AddWritingToPracticeExam";
import AddIELTSReadingContent from "./pages/AddIELTSReadingContent";
import AddIELTSListeningContent from "./pages/AddIELTSListeningContent";
import AddIELTSSpeakingContent from "./pages/AddIELTSSpeakingContent";
import AddIELTSWritingContent from "./pages/AddIELTSWritingContent";

// 🆕 STEP Routes
import STEPMain from "./pages/STEPMain";
import STEPSkillsList from "./pages/STEPSkillsList";
import CreateSTEPSkill from "./pages/CreateSTEPSkill";
import EditSTEPSkill from "./pages/EditSTEPSkill";
import STEPSkillDetails from "./pages/STEPSkillDetails";
import AddVocabularyToSTEP from "./pages/AddVocabularyToSTEP";
import AddGrammarToSTEP from "./pages/AddGrammarToSTEP";
import AddReadingPassageToSTEP from "./pages/AddReadingPassageToSTEP";
import AddReadingQuestionsToSTEP from "./pages/AddReadingQuestionsToSTEP";
import AddWritingToSTEP from "./pages/AddWritingToSTEP";
import STEPProgress from "./pages/STEPProgress";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard Home */}
          <Route index element={<Dashboard />} />

          {/* ============================================ */}
          {/* PLACEMENT TEST ROUTES */}
          {/* ============================================ */}
          <Route path="question-banks" element={<QuestionBanksList />} />
          <Route
            path="question-banks/create"
            element={<CreateQuestionBank />}
          />
          <Route
            path="question-banks/:bankId"
            element={<QuestionBankDetails />}
          />
          <Route
            path="question-banks/:bankId/add/vocabulary"
            element={<AddVocabularyQuestion />}
          />
          <Route
            path="question-banks/:bankId/add/grammar"
            element={<AddGrammarQuestion />}
          />
          <Route
            path="question-banks/:bankId/add/reading"
            element={<AddReadingQuestion />}
          />
          <Route
            path="question-banks/:bankId/add/listening"
            element={<AddListeningQuestion />}
          />
          <Route
            path="question-banks/:bankId/add/speaking"
            element={<AddSpeakingQuestion />}
          />
          <Route
            path="question-banks/:bankId/add/writing"
            element={<AddWritingQuestion />}
          />

          {/* ============================================ */}
          {/* LEVELS ROUTES */}
          {/* ============================================ */}
          <Route path="levels" element={<LevelsList />} />
          <Route path="levels/create" element={<CreateLevel />} />
          <Route path="levels/:levelId" element={<LevelDetails />} />
          <Route path="levels/:levelId/edit" element={<EditLevel />} />

          {/* ============================================ */}
          {/* UNITS ROUTES */}
          {/* ============================================ */}
          <Route path="units" element={<UnitsList />} />
          <Route path="units/create" element={<CreateUnit />} />
          <Route path="units/:unitId" element={<UnitDetails />} />
          <Route path="units/:unitId/edit" element={<EditUnit />} />

          {/* ============================================ */}
          {/* LESSONS ROUTES */}
          {/* ============================================ */}
          <Route path="lessons" element={<LessonsList />} />
          <Route path="lessons/create" element={<CreateLesson />} />
          <Route path="lessons/:lessonId" element={<LessonDetails />} />
          <Route path="lessons/:lessonId/edit" element={<EditLesson />} />
          <Route
            path="lessons/:lessonId/content/add"
            element={<AddLessonContent />}
          />

          {/* ============================================ */}
          {/* LEVEL QUESTION BANKS ROUTES */}
          {/* ============================================ */}
          <Route
            path="level-question-banks"
            element={<LevelQuestionBanksList />}
          />
          <Route
            path="level-question-banks/:bankId"
            element={<LevelQuestionBankDetails />}
          />
          <Route
            path="level-question-banks/:bankId/add/vocabulary"
            element={<AddLevelVocabularyQuestion />}
          />
          <Route
            path="level-question-banks/:bankId/add/grammar"
            element={<AddLevelGrammarQuestion />}
          />
          <Route
            path="level-question-banks/:bankId/add/reading"
            element={<AddLevelReadingQuestion />}
          />
          <Route
            path="level-question-banks/:bankId/add/listening"
            element={<AddLevelListeningQuestion />}
          />
          <Route
            path="level-question-banks/:bankId/add/speaking"
            element={<AddLevelSpeakingQuestion />}
          />
          <Route
            path="level-question-banks/:bankId/add/writing"
            element={<AddLevelWritingQuestion />}
          />

          {/* ============================================ */}
          {/* IELTS ROUTES */}
          {/* ============================================ */}
          <Route path="ielts" element={<IELTSMain />} />
          <Route path="ielts/skills" element={<IELTSSkillsList />} />
          <Route path="ielts/skills/create" element={<CreateIELTSSkill />} />
          <Route path="ielts/skills/:skillId" element={<IELTSSkillDetails />} />
          <Route
            path="ielts/skills/:skillId/edit"
            element={<EditIELTSSkill />}
          />
          <Route
            path="ielts/lesson-packs/create"
            element={<CreateLessonPack />}
          />
          <Route
            path="ielts/lesson-packs/:packId"
            element={<LessonPackDetails />}
          />
          <Route
            path="ielts/lesson-packs/:packId/edit"
            element={<EditLessonPack />}
          />
          <Route path="ielts/lessons/create" element={<CreateIELTSLesson />} />
          <Route
            path="ielts/lessons/:lessonId"
            element={<IELTSLessonDetails />}
          />
          <Route
            path="ielts/lessons/:lessonId/edit"
            element={<EditIELTSLesson />}
          />
          <Route
            path="ielts/practice-exams/:examId"
            element={<PracticeExamDetails />}
          />
          <Route
            path="ielts/practice-exams/:examId/add/vocabulary"
            element={<AddVocabularyToPracticeExam />}
          />
          <Route
            path="ielts/practice-exams/:examId/add/grammar"
            element={<AddGrammarToPracticeExam />}
          />
          <Route
            path="ielts/practice-exams/:examId/add/reading"
            element={<AddReadingToPracticeExam />}
          />
          <Route
            path="ielts/practice-exams/:examId/add/listening"
            element={<AddListeningToPracticeExam />}
          />
          <Route
            path="ielts/practice-exams/:examId/add/speaking"
            element={<AddSpeakingToPracticeExam />}
          />
          <Route
            path="ielts/practice-exams/:examId/add/writing"
            element={<AddWritingToPracticeExam />}
          />
          <Route
            path="ielts/lessons/:lessonId/content/add/reading"
            element={<AddIELTSReadingContent />}
          />
          <Route
            path="ielts/lessons/:lessonId/content/add/listening"
            element={<AddIELTSListeningContent />}
          />
          <Route
            path="ielts/lessons/:lessonId/content/add/speaking"
            element={<AddIELTSSpeakingContent />}
          />
          <Route
            path="ielts/lessons/:lessonId/content/add/writing"
            element={<AddIELTSWritingContent />}
          />

          {/* ============================================ */}
          {/* 🆕 STEP ROUTES */}
          {/* ============================================ */}
          <Route path="step" element={<STEPMain />} />

          {/* Skills */}
          <Route path="step/skills" element={<STEPSkillsList />} />
          <Route path="step/skills/create" element={<CreateSTEPSkill />} />
          <Route path="step/skills/:skillId" element={<STEPSkillDetails />} />
          <Route path="step/skills/:skillId/edit" element={<EditSTEPSkill />} />

          {/* Questions - Vocabulary */}
          <Route
            path="step/skills/:skillId/add/vocabulary"
            element={<AddVocabularyToSTEP />}
          />

          {/* Questions - Grammar */}
          <Route
            path="step/skills/:skillId/add/grammar"
            element={<AddGrammarToSTEP />}
          />

          {/* Questions - Reading */}
          <Route
            path="step/skills/:skillId/add/reading/passage"
            element={<AddReadingPassageToSTEP />}
          />
          <Route
            path="step/skills/:skillId/add/reading/passage/:passageId/questions"
            element={<AddReadingQuestionsToSTEP />}
          />

          {/* Questions - Writing */}
          <Route
            path="step/skills/:skillId/add/writing"
            element={<AddWritingToSTEP />}
          />

          {/* Progress */}
          <Route path="step/progress" element={<STEPProgress />} />
        </Route>

        {/* Redirect root to dashboard or login */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* 404 - Redirect to dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
