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
import AddVocabularyToIELTS from "./pages/ielts/AddVocabularyToIELTS";
import AddGrammarToIELTS from "./pages/ielts/AddGrammarToIELTS";
import AddReadingPassageToIELTS from "./pages/ielts/AddReadingPassageToIELTS";
import AddReadingQuestionsToIELTS from "./pages/ielts/AddReadingQuestionsToIELTS";
import AddListeningAudioToIELTS from "./pages/ielts/AddListeningAudioToIELTS";
import AddListeningQuestionsToIELTS from "./pages/ielts/AddListeningQuestionsToIELTS";
import AddSpeakingVideoToIELTS from "./pages/ielts/AddSpeakingVideoToIELTS";
import AddSpeakingQuestionsToIELTS from "./pages/ielts/AddSpeakingQuestionsToIELTS";
import AddWritingToIELTS from "./pages/ielts/AddWritingToIELTS";
import IELTSProgress from "./pages/ielts/IELTSProgress";
import IELTSAIGeneration from "./pages/ielts/IELTSAIGeneration";

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
import STEPAIGeneration from "./pages/step/STEPAIGeneration";

// ============================================
// GENERAL ENGLISH Routes
// ============================================
import GeneralMain from "./pages/general/GeneralMain";
import GeneralCategoriesList from "./pages/general/GeneralCategoriesList";
import CreateGeneralCategory from "./pages/general/CreateGeneralCategory";
import GeneralSkillsList from "./pages/general/GeneralSkillsList";
import CreateGeneralSkill from "./pages/general/CreateGeneralSkill";
import GeneralSkillDetails from "./pages/general/GeneralSkillDetails";
import AddMCQToGeneral from "./pages/general/AddMCQToGeneral";
import AddReadingToGeneral from "./pages/general/AddReadingToGeneral";
import AddReadingQuestionsToGeneral from "./pages/general/AddReadingQuestionsToGeneral";
import AddListeningToGeneral from "./pages/general/AddListeningToGeneral";
import AddListeningQuestionsToGeneral from "./pages/general/AddListeningQuestionsToGeneral";
import AddSpeakingToGeneral from "./pages/general/AddSpeakingToGeneral";
import AddSpeakingQuestionsToGeneral from "./pages/general/AddSpeakingQuestionsToGeneral";
import AddWritingToGeneral from "./pages/general/AddWritingToGeneral";
import GeneralAIGeneration from "./pages/general/GeneralAIGeneration";

// ============================================
// ESP ENGLISH Routes
// ============================================
import EspMain from "./pages/esp/EspMain";
import EspCategoriesList from "./pages/esp/EspCategoriesList";
import CreateEspCategory from "./pages/esp/CreateEspCategory";
import EspSkillsList from "./pages/esp/EspSkillsList";
import CreateEspSkill from "./pages/esp/CreateEspSkill";
import EspSkillDetails from "./pages/esp/EspSkillDetails";
import AddMCQToEsp from "./pages/esp/AddMCQToEsp";
import AddReadingToEsp from "./pages/esp/AddReadingToEsp";
import AddReadingQuestionsToEsp from "./pages/esp/AddReadingQuestionsToEsp";
import AddListeningToEsp from "./pages/esp/AddListeningToEsp";
import AddListeningQuestionsToEsp from "./pages/esp/AddListeningQuestionsToEsp";
import AddSpeakingToEsp from "./pages/esp/AddSpeakingToEsp";
import AddSpeakingQuestionsToEsp from "./pages/esp/AddSpeakingQuestionsToEsp";
import AddWritingToEsp from "./pages/esp/AddWritingToEsp";
import EspAIGeneration from "./pages/esp/EspAIGeneration";

import PaymentCallback from "./pages/payment/PaymentCallback";
import PaymentPage from "./pages/payment/PaymentPage";

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

          {/* TEACHERS */}
          <Route path="teachers" element={<TeachersList />} />

          {/* PLACEMENT TEST */}
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

          {/* LEVELS */}
          <Route path="levels" element={<LevelsList />} />
          <Route path="levels/create" element={<CreateLevel />} />
          <Route path="levels/:levelId" element={<LevelDetails />} />
          <Route path="levels/:levelId/edit" element={<EditLevel />} />

          {/* UNITS */}
          <Route path="units" element={<UnitsList />} />
          <Route path="units/create" element={<CreateUnit />} />
          <Route path="units/:unitId" element={<UnitDetails />} />
          <Route path="units/:unitId/edit" element={<EditUnit />} />

          {/* LESSONS */}
          <Route path="lessons" element={<LessonsList />} />
          <Route path="lessons/create" element={<CreateLesson />} />
          <Route path="lessons/:lessonId" element={<LessonDetails />} />
          <Route path="lessons/:lessonId/edit" element={<EditLesson />} />
          <Route
            path="lessons/:lessonId/content/add"
            element={<AddLessonContent />}
          />

          {/* LEVEL QUESTION BANKS */}
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

          {/* IELTS */}
          <Route path="ielts" element={<IELTSMain />} />
          <Route path="ielts/skills" element={<IELTSSkillsList />} />
          <Route path="ielts/skills/create" element={<CreateIELTSSkill />} />
          <Route path="ielts/skills/:skillId" element={<IELTSSkillDetails />} />
          <Route
            path="ielts/skills/:skillId/edit"
            element={<EditIELTSSkill />}
          />
          <Route
            path="ielts/skills/:skillId/add/vocabulary"
            element={<AddVocabularyToIELTS />}
          />
          <Route
            path="ielts/skills/:skillId/add/grammar"
            element={<AddGrammarToIELTS />}
          />
          <Route
            path="ielts/skills/:skillId/add/reading/passage"
            element={<AddReadingPassageToIELTS />}
          />
          <Route
            path="ielts/skills/:skillId/add/reading/passage/:passageId/questions"
            element={<AddReadingQuestionsToIELTS />}
          />
          <Route
            path="ielts/skills/:skillId/add/listening/audio"
            element={<AddListeningAudioToIELTS />}
          />
          <Route
            path="ielts/skills/:skillId/add/listening/audio/:audioId/questions"
            element={<AddListeningQuestionsToIELTS />}
          />
          <Route
            path="ielts/skills/:skillId/add/speaking/video"
            element={<AddSpeakingVideoToIELTS />}
          />
          <Route
            path="ielts/skills/:skillId/add/speaking/video/:videoId/questions"
            element={<AddSpeakingQuestionsToIELTS />}
          />
          <Route
            path="ielts/skills/:skillId/add/writing"
            element={<AddWritingToIELTS />}
          />
          <Route path="ielts/progress" element={<IELTSProgress />} />
          <Route path="ielts/ai" element={<IELTSAIGeneration />} />

          {/* STEP */}
          <Route path="step" element={<STEPMain />} />
          <Route path="step/skills" element={<STEPSkillsList />} />
          <Route path="step/skills/create" element={<CreateSTEPSkill />} />
          <Route path="step/skills/:skillId" element={<STEPSkillDetails />} />
          <Route path="step/skills/:skillId/edit" element={<EditSTEPSkill />} />
          <Route
            path="step/skills/:skillId/add/vocabulary"
            element={<AddVocabularyToSTEP />}
          />
          <Route
            path="step/skills/:skillId/add/grammar"
            element={<AddGrammarToSTEP />}
          />
          <Route
            path="step/skills/:skillId/add/reading/passage"
            element={<AddReadingPassageToSTEP />}
          />
          <Route
            path="step/skills/:skillId/add/reading/passage/:passageId/questions"
            element={<AddReadingQuestionsToSTEP />}
          />
          <Route
            path="step/skills/:skillId/add/listening/audio"
            element={<AddListeningAudioToSTEP />}
          />
          <Route
            path="step/skills/:skillId/add/listening/audio/:audioId/questions"
            element={<AddListeningQuestionsToSTEP />}
          />
          <Route
            path="step/skills/:skillId/add/speaking/video"
            element={<AddSpeakingVideoToSTEP />}
          />
          <Route
            path="step/skills/:skillId/add/speaking/video/:videoId/questions"
            element={<AddSpeakingQuestionsToSTEP />}
          />
          <Route
            path="step/skills/:skillId/add/writing"
            element={<AddWritingToSTEP />}
          />
          <Route path="step/progress" element={<STEPProgress />} />
          <Route path="step/ai" element={<STEPAIGeneration />} />

          {/* ============================================ */}
          {/* GENERAL ENGLISH ROUTES */}
          {/* ============================================ */}
          <Route path="general" element={<GeneralMain />} />

          {/* Categories */}
          <Route
            path="general/categories"
            element={<GeneralCategoriesList />}
          />
          <Route
            path="general/categories/create"
            element={<CreateGeneralCategory />}
          />
          <Route
            path="general/categories/:categoryId/edit"
            element={<CreateGeneralCategory />}
          />

          {/* Skills */}
          <Route
            path="general/categories/:categoryId/skills"
            element={<GeneralSkillsList />}
          />
          <Route
            path="general/categories/:categoryId/skills/create"
            element={<CreateGeneralSkill />}
          />
          <Route
            path="general/categories/:categoryId/skills/:skillId/edit"
            element={<CreateGeneralSkill />}
          />

          {/* Skill Details */}
          <Route
            path="general/skills/:skillId"
            element={<GeneralSkillDetails />}
          />

          {/* Vocabulary */}
          <Route
            path="general/skills/:skillId/add/vocabulary"
            element={<AddMCQToGeneral questionType="VOCABULARY" />}
          />

          {/* Grammar */}
          <Route
            path="general/skills/:skillId/add/grammar"
            element={<AddMCQToGeneral questionType="GRAMMAR" />}
          />

          {/* Reading */}
          <Route
            path="general/skills/:skillId/add/reading/passage"
            element={<AddReadingToGeneral />}
          />
          <Route
            path="general/skills/:skillId/add/reading/passage/:passageId/questions"
            element={<AddReadingQuestionsToGeneral />}
          />

          {/* Listening */}
          <Route
            path="general/skills/:skillId/add/listening/audio"
            element={<AddListeningToGeneral />}
          />
          <Route
            path="general/skills/:skillId/add/listening/audio/:audioId/questions"
            element={<AddListeningQuestionsToGeneral />}
          />

          {/* Speaking */}
          <Route
            path="general/skills/:skillId/add/speaking/video"
            element={<AddSpeakingToGeneral />}
          />
          <Route
            path="general/skills/:skillId/add/speaking/video/:videoId/questions"
            element={<AddSpeakingQuestionsToGeneral />}
          />

          {/* Writing */}
          <Route
            path="general/skills/:skillId/add/writing"
            element={<AddWritingToGeneral />}
          />

          {/* AI Generation */}
          <Route path="general/ai" element={<GeneralAIGeneration />} />

          {/* ============================================ */}
          {/* ESP ENGLISH ROUTES */}
          {/* ============================================ */}
          <Route path="esp" element={<EspMain />} />

          {/* Categories */}
          <Route path="esp/categories" element={<EspCategoriesList />} />
          <Route path="esp/categories/create" element={<CreateEspCategory />} />
          <Route
            path="esp/categories/:categoryId/edit"
            element={<CreateEspCategory />}
          />

          {/* Skills */}
          <Route
            path="esp/categories/:categoryId/skills"
            element={<EspSkillsList />}
          />
          <Route
            path="esp/categories/:categoryId/skills/create"
            element={<CreateEspSkill />}
          />
          <Route
            path="esp/categories/:categoryId/skills/:skillId/edit"
            element={<CreateEspSkill />}
          />

          {/* Skill Details */}
          <Route path="esp/skills/:skillId" element={<EspSkillDetails />} />

          {/* Vocabulary */}
          <Route
            path="esp/skills/:skillId/add/vocabulary"
            element={<AddMCQToEsp questionType="VOCABULARY" />}
          />

          {/* Grammar */}
          <Route
            path="esp/skills/:skillId/add/grammar"
            element={<AddMCQToEsp questionType="GRAMMAR" />}
          />

          {/* Reading */}
          <Route
            path="esp/skills/:skillId/add/reading/passage"
            element={<AddReadingToEsp />}
          />
          <Route
            path="esp/skills/:skillId/add/reading/passage/:passageId/questions"
            element={<AddReadingQuestionsToEsp />}
          />

          {/* Listening */}
          <Route
            path="esp/skills/:skillId/add/listening/audio"
            element={<AddListeningToEsp />}
          />
          <Route
            path="esp/skills/:skillId/add/listening/audio/:audioId/questions"
            element={<AddListeningQuestionsToEsp />}
          />

          {/* Speaking */}
          <Route
            path="esp/skills/:skillId/add/speaking/video"
            element={<AddSpeakingToEsp />}
          />
          <Route
            path="esp/skills/:skillId/add/speaking/video/:videoId/questions"
            element={<AddSpeakingQuestionsToEsp />}
          />

          {/* Writing */}
          <Route
            path="esp/skills/:skillId/add/writing"
            element={<AddWritingToEsp />}
          />

          {/* AI Generation */}
          <Route path="esp/ai" element={<EspAIGeneration />} />
        </Route>
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/payment/callback" element={<PaymentCallback />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
