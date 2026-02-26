// src/services/levelsService.js
import api from "../api/axios";

// ============================================
// 1. LEVELS API
// ============================================

export const levelsAPI = {
  // Get all levels
  getAll: async () => {
    const response = await api.get("/levels/levels/");
    return response.data;
  },

  // Get single level
  getById: async (levelId) => {
    const response = await api.get(`/levels/levels/${levelId}/`);
    return response.data;
  },

  // Create level
  create: async (data) => {
    const response = await api.post("/levels/levels/create/", data);
    return response.data;
  },

  // Update level
  update: async (levelId, data) => {
    const response = await api.put(`/levels/levels/${levelId}/update/`, data);
    return response.data;
  },

  // Delete level
  delete: async (levelId) => {
    const response = await api.delete(`/levels/levels/${levelId}/delete/`);
    return response.data;
  },
};

// ============================================
// 2. UNITS API
// ============================================

export const unitsAPI = {
  // Get all units (with optional level filter)
  getAll: async (levelId = null) => {
    const params = levelId ? { level_id: levelId } : {};
    const response = await api.get("/levels/units/", { params });
    return response.data;
  },

  // Get single unit
  getById: async (unitId) => {
    const response = await api.get(`/levels/units/${unitId}/`);
    return response.data;
  },

  // Create unit
  create: async (data) => {
    const response = await api.post("/levels/units/create/", data);
    return response.data;
  },

  // Update unit
  update: async (unitId, data) => {
    const response = await api.put(`/levels/units/${unitId}/update/`, data);
    return response.data;
  },

  // Delete unit
  delete: async (unitId) => {
    const response = await api.delete(`/levels/units/${unitId}/delete/`);
    return response.data;
  },
};

// ============================================
// 3. LESSONS API
// ============================================

export const lessonsAPI = {
  // Get all lessons (with optional filters)
  getAll: async (unitId = null, lessonType = null) => {
    const params = {};
    if (unitId) params.unit_id = unitId;
    if (lessonType) params.lesson_type = lessonType;
    const response = await api.get("/levels/lessons/", { params });
    return response.data;
  },

  // Get single lesson
  getById: async (lessonId) => {
    const response = await api.get(`/levels/lessons/${lessonId}/`);
    return response.data;
  },

  // Create lesson
  create: async (data) => {
    const response = await api.post("/levels/lessons/create/", data);
    return response.data;
  },

  // Update lesson
  update: async (lessonId, data) => {
    const response = await api.put(`/levels/lessons/${lessonId}/update/`, data);
    return response.data;
  },

  // Delete lesson
  delete: async (lessonId) => {
    const response = await api.delete(`/levels/lessons/${lessonId}/delete/`);
    return response.data;
  },
};

// ============================================
// 4. LESSON CONTENT API
// ============================================

export const lessonContentAPI = {
  // Reading Content
  reading: {
    get: async (lessonId) => {
      const response = await api.get(
        `/levels/lesson-content/reading/${lessonId}/`
      );
      return response.data;
    },
    create: async (data) => {
      const response = await api.post(
        "/levels/lesson-content/reading/create/",
        data
      );
      return response.data;
    },
    update: async (lessonId, data) => {
      const response = await api.put(
        `/levels/lesson-content/reading/${lessonId}/update/`,
        data
      );
      return response.data;
    },
    delete: async (lessonId) => {
      const response = await api.delete(
        `/levels/lesson-content/reading/${lessonId}/delete/`
      );
      return response.data;
    },
  },

  // Listening Content
  listening: {
    get: async (lessonId) => {
      const response = await api.get(
        `/levels/lesson-content/listening/${lessonId}/`
      );
      return response.data;
    },
    create: async (data) => {
      const response = await api.post(
        "/levels/lesson-content/listening/create/",
        data
      );
      return response.data;
    },
    update: async (lessonId, data) => {
      const response = await api.put(
        `/levels/lesson-content/listening/${lessonId}/update/`,
        data
      );
      return response.data;
    },
    delete: async (lessonId) => {
      const response = await api.delete(
        `/levels/lesson-content/listening/${lessonId}/delete/`
      );
      return response.data;
    },
  },

  // Speaking Content
  speaking: {
    get: async (lessonId) => {
      const response = await api.get(
        `/levels/lesson-content/speaking/${lessonId}/`
      );
      return response.data;
    },
    create: async (data) => {
      const response = await api.post(
        "/levels/lesson-content/speaking/create/",
        data
      );
      return response.data;
    },
    update: async (lessonId, data) => {
      const response = await api.put(
        `/levels/lesson-content/speaking/${lessonId}/update/`,
        data
      );
      return response.data;
    },
    delete: async (lessonId) => {
      const response = await api.delete(
        `/levels/lesson-content/speaking/${lessonId}/delete/`
      );
      return response.data;
    },
  },

  // Writing Content
  writing: {
    get: async (lessonId) => {
      const response = await api.get(
        `/levels/lesson-content/writing/${lessonId}/`
      );
      return response.data;
    },
    create: async (data) => {
      const response = await api.post(
        "/levels/lesson-content/writing/create/",
        data
      );
      return response.data;
    },
    update: async (lessonId, data) => {
      const response = await api.put(
        `/levels/lesson-content/writing/${lessonId}/update/`,
        data
      );
      return response.data;
    },
    delete: async (lessonId) => {
      const response = await api.delete(
        `/levels/lesson-content/writing/${lessonId}/delete/`
      );
      return response.data;
    },
  },
};

// ============================================
// 5. EXAMS API
// ============================================

export const examsAPI = {
  // Unit Exams
  unit: {
    getAll: async (unitId = null) => {
      const params = unitId ? { unit_id: unitId } : {};
      const response = await api.get("/levels/exams/unit/", { params });
      return response.data;
    },
    getById: async (examId) => {
      const response = await api.get(`/levels/exams/unit/${examId}/`);
      return response.data;
    },
    create: async (data) => {
      const response = await api.post("/levels/exams/unit/create/", data);
      return response.data;
    },
    update: async (examId, data) => {
      const response = await api.put(
        `/levels/exams/unit/${examId}/update/`,
        data
      );
      return response.data;
    },
    delete: async (examId) => {
      const response = await api.delete(`/levels/exams/unit/${examId}/delete/`);
      return response.data;
    },
  },

  // Level Exams
  level: {
    getAll: async (levelId = null) => {
      const params = levelId ? { level_id: levelId } : {};
      const response = await api.get("/levels/exams/level/", { params });
      return response.data;
    },
    getById: async (examId) => {
      const response = await api.get(`/levels/exams/level/${examId}/`);
      return response.data;
    },
    create: async (data) => {
      const response = await api.post("/levels/exams/level/create/", data);
      return response.data;
    },
    update: async (examId, data) => {
      const response = await api.put(
        `/levels/exams/level/${examId}/update/`,
        data
      );
      return response.data;
    },
    delete: async (examId) => {
      const response = await api.delete(
        `/levels/exams/level/${examId}/delete/`
      );
      return response.data;
    },
  },
};

// ============================================
// 6. QUESTION BANKS API (For Levels)
// ============================================

export const levelQuestionBanksAPI = {
  // Get all question banks
  getAll: async (unitId = null, levelId = null) => {
    const params = {};
    if (unitId) params.unit_id = unitId;
    if (levelId) params.level_id = levelId;
    const response = await api.get("/levels/question-banks/", { params });
    return response.data;
  },

  // Get single question bank
  getById: async (bankId) => {
    const response = await api.get(`/levels/question-banks/${bankId}/`);
    return response.data;
  },

  // Get question bank statistics
  getStatistics: async (bankId) => {
    const response = await api.get(
      `/levels/question-banks/${bankId}/statistics/`
    );
    return response.data;
  },

  // Add questions to bank
  addVocabulary: async (bankId, data) => {
    const response = await api.post(
      `/levels/question-banks/${bankId}/add-vocabulary/`,
      data
    );
    return response.data;
  },

  addGrammar: async (bankId, data) => {
    const response = await api.post(
      `/levels/question-banks/${bankId}/add-grammar/`,
      data
    );
    return response.data;
  },

  createReadingPassage: async (bankId, data) => {
    const response = await api.post(
      `/levels/question-banks/${bankId}/create-reading-passage/`,
      data
    );
    return response.data;
  },

  addReadingQuestion: async (bankId, passageId, data) => {
    const response = await api.post(
      `/levels/question-banks/${bankId}/reading-passages/${passageId}/add-question/`,
      data
    );
    return response.data;
  },

  createListeningAudio: async (bankId, data) => {
    const response = await api.post(
      `/levels/question-banks/${bankId}/create-listening-audio/`,
      data
    );
    return response.data;
  },

  addListeningQuestion: async (bankId, audioId, data) => {
    const response = await api.post(
      `/levels/question-banks/${bankId}/listening-audios/${audioId}/add-question/`,
      data
    );
    return response.data;
  },

  createSpeakingVideo: async (bankId, data) => {
    const response = await api.post(
      `/levels/question-banks/${bankId}/create-speaking-video/`,
      data
    );
    return response.data;
  },

  addSpeakingQuestion: async (bankId, videoId, data) => {
    const response = await api.post(
      `/levels/question-banks/${bankId}/speaking-videos/${videoId}/add-question/`,
      data
    );
    return response.data;
  },

  addWriting: async (bankId, data) => {
    const response = await api.post(
      `/levels/question-banks/${bankId}/add-writing/`,
      data
    );
    return response.data;
  },
};

// ============================================
// 7. STUDENT PROGRESS API
// ============================================

export const studentProgressAPI = {
  // Start level
  startLevel: async (levelId) => {
    const response = await api.post(`/levels/student/start-level/${levelId}/`);
    return response.data;
  },

  // Start unit
  startUnit: async (unitId) => {
    const response = await api.post(`/levels/student/start-unit/${unitId}/`);
    return response.data;
  },

  // Complete lesson
  completeLesson: async (lessonId) => {
    const response = await api.post(
      `/levels/student/complete-lesson/${lessonId}/`
    );
    return response.data;
  },

  // Get my progress
  getMyProgress: async (levelId = null) => {
    const params = levelId ? { level_id: levelId } : {};
    const response = await api.get("/levels/student/my-progress/", { params });
    return response.data;
  },

  // Get current level
  getCurrentLevel: async () => {
    const response = await api.get("/levels/student/my-current-level/");
    return response.data;
  },
};

// ============================================
// 8. EXAM TAKING API
// ============================================

export const examTakingAPI = {
  // Unit Exams
  unit: {
    start: async (examId) => {
      const response = await api.post(
        `/levels/student/exams/unit/${examId}/start/`
      );
      return response.data;
    },
    submit: async (attemptId, answers) => {
      const response = await api.post(
        `/levels/student/exams/unit/submit/${attemptId}/`,
        { answers }
      );
      return response.data;
    },
    getMyAttempts: async (unitId = null) => {
      const params = unitId ? { unit_id: unitId } : {};
      const response = await api.get(
        "/levels/student/exams/unit/my-attempts/",
        {
          params,
        }
      );
      return response.data;
    },
  },

  // Level Exams
  level: {
    start: async (examId) => {
      const response = await api.post(
        `/levels/student/exams/level/${examId}/start/`
      );
      return response.data;
    },
    submit: async (attemptId, answers) => {
      const response = await api.post(
        `/levels/student/exams/level/submit/${attemptId}/`,
        { answers }
      );
      return response.data;
    },
    getMyAttempts: async (levelId = null) => {
      const params = levelId ? { level_id: levelId } : {};
      const response = await api.get(
        "/levels/student/exams/level/my-attempts/",
        { params }
      );
      return response.data;
    },
  },
};
