// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Auth
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

// Dashboard
import Dashboard from "./pages/dashboard/Dashboard";
import DashboardLayout from "./components/DashboardLayout";

// Teachers
import TeachersList from "./pages/teachers/TeachersList";

// Placement Test Routes
import QuestionBanksList from "./pages/placement/QuestionBanksList";
import CreateQuestionBank from "./pages/placement/CreateQuestionBank";
import QuestionBankDetails from "./pages/placement/Questionbankdetail";
import AddVocabularyQuestion from "./pages/placement/Addvocabularyquestion";
import AddGrammarQuestion from "./pages/placement/Addgrammarquestion";
import AddReadingQuestion from "./pages/placement/Addreadingquestion";
import AddListeningQuestion from "./pages/placement/AddListeningQuestion";
import AddSpeakingQuestion from "./pages/placement/AddSpeakingQuestion";
import AddWritingQuestion from "./pages/placement/Addwritingquestion";

// Levels System Routes
import LevelsList from "./pages/levels/Levelslist";
import CreateLevel from "./pages/levels/Createlevel";
import LevelDetails from "./pages/levels/Leveldetails";
import EditLevel from "./pages/levels/Editlevel";

// Units Routes
import UnitsList from "./pages/levels/UnitsList";
import CreateUnit from "./pages/levels/CreateUnit";
import UnitDetails from "./pages/levels/UnitDetails";
import EditUnit from "./pages/levels/EditUnit";
import AddLessonContent from "./pages/levels/AddLessonContent";

// Lessons Routes
import LessonsList from "./pages/levels/LessonsList";
import CreateLesson from "./pages/levels/CreateLesson";
import LessonDetails from "./pages/levels/Lessondetails";
import EditLesson from "./pages/levels/Editlesson";

// Level Question Banks Routes
import LevelQuestionBanksList from "./pages/levels/Levelquestionbankslist";
import LevelQuestionBankDetails from "./pages/levels/Levelquestionbankdetails";
import AddLevelVocabularyQuestion from "./pages/levels/Addlevelvocabularyquestion";
import AddLevelGrammarQuestion from "./pages/levels/Addlevelgrammarquestion";
import AddLevelReadingQuestion from "./pages/levels/AddLevelReadingQuestion";
import AddLevelListeningQuestion from "./pages/levels/AddLevelListeningQuestion";
import AddLevelSpeakingQuestion from "./pages/levels/AddLevelSpeakingQuestion";
import AddLevelWritingQuestion from "./pages/levels/AddLevelWritingQuestion";

// IELTS Routes
import IELTSMain from "./pages/ielts/IELTSMain";
import IELTSSkillsList from "./pages/ielts/IELTSSkillsList";
import CreateIELTSSkill from "./pages/ielts/CreateIELTSSkill";
import EditIELTSSkill from "./pages/ielts/EditIELTSSkill";
import IELTSSkillDetails from "./pages/ielts/IELTSSkillDetails";
import CreateLessonPack from "./pages/ielts/CreateLessonPack";
import LessonPackDetails from "./pages/ielts/LessonPackDetails";
import EditLessonPack from "./pages/ielts/EditLessonPack";
import CreateIELTSLesson from "./pages/ielts/CreateIELTSLesson";
import EditIELTSLesson from "./pages/ielts/EditIELTSLesson";
import IELTSLessonDetails from "./pages/ielts/IELTSLessonDetails";
import PracticeExamDetails from "./pages/ielts/PracticeExamDetails";
import AddVocabularyToPracticeExam from "./pages/ielts/AddVocabularyToPracticeExam";
import AddGrammarToPracticeExam from "./pages/ielts/AddGrammarToPracticeExam";
import AddReadingToPracticeExam from "./pages/ielts/AddReadingToPracticeExam";
import AddListeningToPracticeExam from "./pages/ielts/AddListeningToPracticeExam";
import AddSpeakingToPracticeExam from "./pages/ielts/AddSpeakingToPracticeExam";
import AddWritingToPracticeExam from "./pages/ielts/AddWritingToPracticeExam";
import AddIELTSReadingContent from "./pages/ielts/AddIELTSReadingContent";
import AddIELTSListeningContent from "./pages/ielts/AddIELTSListeningContent";
import AddIELTSSpeakingContent from "./pages/ielts/AddIELTSSpeakingContent";
import AddIELTSWritingContent from "./pages/ielts/AddIELTSWritingContent";

// STEP Routes
import STEPMain from "./pages/step/STEPMain";
import STEPSkillsList from "./pages/step/STEPSkillsList";
import CreateSTEPSkill from "./pages/step/CreateSTEPSkill";
import EditSTEPSkill from "./pages/step/EditSTEPSkill";
import STEPSkillDetails from "./pages/step/STEPSkillDetails";
import AddVocabularyToSTEP from "./pages/step/AddVocabularyToSTEP";
import AddGrammarToSTEP from "./pages/step/AddGrammarToSTEP";
import AddReadingPassageToSTEP from "./pages/step/AddReadingPassageToSTEP";
import AddReadingQuestionsToSTEP from "./pages/step/AddReadingQuestionsToSTEP";
import AddListeningAudioToSTEP from "./pages/step/AddListeningAudioToSTEP";
import AddListeningQuestionsToSTEP from "./pages/step/AddListeningQuestionsToSTEP";
import AddSpeakingVideoToSTEP from "./pages/step/AddSpeakingVideoToSTEP";
import AddSpeakingQuestionsToSTEP from "./pages/step/AddSpeakingQuestionsToSTEP";
import AddWritingToSTEP from "./pages/step/AddWritingToSTEP";
import STEPProgress from "./pages/step/STEPProgress";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/reset-password/:uidb64/:token"
          element={<ResetPassword />}
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />

          {/* ============================================ */}
          {/* TEACHERS */}
          {/* ============================================ */}
          <Route path="teachers" element={<TeachersList />} />

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
          {/* STEP ROUTES */}
          {/* ============================================ */}
          <Route path="step" element={<STEPMain />} />
          <Route path="step/skills" element={<STEPSkillsList />} />
          <Route path="step/skills/create" element={<CreateSTEPSkill />} />
          <Route path="step/skills/:skillId" element={<STEPSkillDetails />} />
          <Route path="step/skills/:skillId/edit" element={<EditSTEPSkill />} />

          {/* Vocabulary */}
          <Route
            path="step/skills/:skillId/add/vocabulary"
            element={<AddVocabularyToSTEP />}
          />

          {/* Grammar */}
          <Route
            path="step/skills/:skillId/add/grammar"
            element={<AddGrammarToSTEP />}
          />

          {/* Reading */}
          <Route
            path="step/skills/:skillId/add/reading/passage"
            element={<AddReadingPassageToSTEP />}
          />
          <Route
            path="step/skills/:skillId/add/reading/passage/:passageId/questions"
            element={<AddReadingQuestionsToSTEP />}
          />

          {/* Listening */}
          <Route
            path="step/skills/:skillId/add/listening/audio"
            element={<AddListeningAudioToSTEP />}
          />
          <Route
            path="step/skills/:skillId/add/listening/audio/:audioId/questions"
            element={<AddListeningQuestionsToSTEP />}
          />

          {/* Speaking ← جديد */}
          <Route
            path="step/skills/:skillId/add/speaking/video"
            element={<AddSpeakingVideoToSTEP />}
          />
          <Route
            path="step/skills/:skillId/add/speaking/video/:videoId/questions"
            element={<AddSpeakingQuestionsToSTEP />}
          />

          {/* Writing */}
          <Route
            path="step/skills/:skillId/add/writing"
            element={<AddWritingToSTEP />}
          />

          {/* Progress */}
          <Route path="step/progress" element={<STEPProgress />} />
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
