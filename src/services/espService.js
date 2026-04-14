// src/services/espService.js
import api from "../api/axios";

const getFormDataConfig = () => ({
  headers: { "Content-Type": "multipart/form-data" },
});

// ============================================
// 1. CATEGORIES API
// ============================================
export const espCategoriesAPI = {
  getAll: async () => {
    const response = await api.get("/esp/categories/");
    return response.data;
  },

  getById: async (categoryId) => {
    const response = await api.get(`/esp/categories/${categoryId}/`);
    return response.data;
  },

  create: async (data) => {
    const config = data instanceof FormData ? getFormDataConfig() : {};
    const response = await api.post(
      "/esp/categories/create/",
      data,
      config
    );
    return response.data;
  },

  update: async (categoryId, data) => {
    const config = data instanceof FormData ? getFormDataConfig() : {};
    const response = await api.put(
      `/esp/categories/${categoryId}/update/`,
      data,
      config
    );
    return response.data;
  },

  patch: async (categoryId, data) => {
    const config = data instanceof FormData ? getFormDataConfig() : {};
    const response = await api.patch(
      `/esp/categories/${categoryId}/update/`,
      data,
      config
    );
    return response.data;
  },

  delete: async (categoryId) => {
    const response = await api.delete(
      `/esp/categories/${categoryId}/delete/`
    );
    return response.data;
  },
};

// ============================================
// 2. SKILLS API
// ============================================
export const espSkillsAPI = {
  getByCategory: async (categoryId) => {
    const response = await api.get(`/esp/categories/${categoryId}/skills/`);
    return response.data;
  },

  getById: async (skillId) => {
    const response = await api.get(`/esp/skills/${skillId}/`);
    return response.data;
  },

  create: async (categoryId, data) => {
    const config = data instanceof FormData ? getFormDataConfig() : {};
    const response = await api.post(
      `/esp/categories/${categoryId}/skills/create/`,
      data,
      config
    );
    return response.data;
  },

  update: async (skillId, data) => {
    const config = data instanceof FormData ? getFormDataConfig() : {};
    const response = await api.put(
      `/esp/skills/${skillId}/update/`,
      data,
      config
    );
    return response.data;
  },

  patch: async (skillId, data) => {
    const config = data instanceof FormData ? getFormDataConfig() : {};
    const response = await api.patch(
      `/esp/skills/${skillId}/update/`,
      data,
      config
    );
    return response.data;
  },

  delete: async (skillId) => {
    const response = await api.delete(`/esp/skills/${skillId}/delete/`);
    return response.data;
  },
};

// ============================================
// 3. QUESTIONS API
// ============================================
export const espQuestionsAPI = {
  getSkillQuestions: async (skillId, page = 1, pageSize = 20) => {
    const response = await api.get(`/esp/skills/${skillId}/questions/`, {
      params: { page, page_size: pageSize },
    });
    return response.data;
  },

  // ---------- Vocabulary ----------
  createVocabulary: async (data) => {
    const response = await api.post("/esp/vocabulary/create/", data);
    return response.data;
  },
  updateVocabulary: async (questionId, data) => {
    const response = await api.put(
      `/esp/vocabulary/${questionId}/update/`,
      data
    );
    return response.data;
  },
  deleteVocabulary: async (questionId) => {
    const response = await api.delete(
      `/esp/vocabulary/${questionId}/delete/`
    );
    return response.data;
  },

  // ---------- Grammar ----------
  createGrammar: async (data) => {
    const response = await api.post("/esp/grammar/create/", data);
    return response.data;
  },
  updateGrammar: async (questionId, data) => {
    const response = await api.put(
      `/esp/grammar/${questionId}/update/`,
      data
    );
    return response.data;
  },
  deleteGrammar: async (questionId) => {
    const response = await api.delete(`/esp/grammar/${questionId}/delete/`);
    return response.data;
  },

  // ---------- Reading Passage ----------
  createReadingPassage: async (data) => {
    const response = await api.post("/esp/reading/passages/create/", data);
    return response.data;
  },
  updateReadingPassage: async (passageId, data) => {
    const response = await api.put(
      `/esp/reading/passages/${passageId}/update/`,
      data
    );
    return response.data;
  },
  deleteReadingPassage: async (passageId) => {
    const response = await api.delete(
      `/esp/reading/passages/${passageId}/delete/`
    );
    return response.data;
  },

  // ---------- Reading Question ----------
  createReadingQuestion: async (passageId, data) => {
    const response = await api.post(
      `/esp/reading/passages/${passageId}/questions/create/`,
      data
    );
    return response.data;
  },
  updateReadingQuestion: async (questionId, data) => {
    const response = await api.put(
      `/esp/reading/questions/${questionId}/update/`,
      data
    );
    return response.data;
  },
  deleteReadingQuestion: async (questionId) => {
    const response = await api.delete(
      `/esp/reading/questions/${questionId}/delete/`
    );
    return response.data;
  },

  // ---------- Listening Audio ----------
  createListeningAudio: async (data) => {
    const response = await api.post("/esp/listening/audio/create/", data);
    return response.data;
  },
  updateListeningAudio: async (audioId, data) => {
    const response = await api.put(
      `/esp/listening/audio/${audioId}/update/`,
      data
    );
    return response.data;
  },
  deleteListeningAudio: async (audioId) => {
    const response = await api.delete(
      `/esp/listening/audio/${audioId}/delete/`
    );
    return response.data;
  },

  // ---------- Listening Question ----------
  createListeningQuestion: async (audioId, data) => {
    const response = await api.post(
      `/esp/listening/audio/${audioId}/questions/create/`,
      data
    );
    return response.data;
  },
  updateListeningQuestion: async (questionId, data) => {
    const response = await api.put(
      `/esp/listening/questions/${questionId}/update/`,
      data
    );
    return response.data;
  },
  deleteListeningQuestion: async (questionId) => {
    const response = await api.delete(
      `/esp/listening/questions/${questionId}/delete/`
    );
    return response.data;
  },

  // ---------- Speaking Video ----------
  createSpeakingVideo: async (data) => {
    const response = await api.post("/esp/speaking/videos/create/", data);
    return response.data;
  },
  updateSpeakingVideo: async (videoId, data) => {
    const response = await api.put(
      `/esp/speaking/videos/${videoId}/update/`,
      data
    );
    return response.data;
  },
  deleteSpeakingVideo: async (videoId) => {
    const response = await api.delete(
      `/esp/speaking/videos/${videoId}/delete/`
    );
    return response.data;
  },

  // ---------- Speaking Question ----------
  createSpeakingQuestion: async (videoId, data) => {
    const response = await api.post(
      `/esp/speaking/videos/${videoId}/questions/create/`,
      data
    );
    return response.data;
  },
  updateSpeakingQuestion: async (questionId, data) => {
    const response = await api.put(
      `/esp/speaking/questions/${questionId}/update/`,
      data
    );
    return response.data;
  },
  deleteSpeakingQuestion: async (questionId) => {
    const response = await api.delete(
      `/esp/speaking/questions/${questionId}/delete/`
    );
    return response.data;
  },

  // ---------- Writing ----------
  createWriting: async (data) => {
    const response = await api.post("/esp/writing/questions/create/", data);
    return response.data;
  },
  updateWriting: async (questionId, data) => {
    const response = await api.put(
      `/esp/writing/questions/${questionId}/update/`,
      data
    );
    return response.data;
  },
  deleteWriting: async (questionId) => {
    const response = await api.delete(
      `/esp/writing/questions/${questionId}/delete/`
    );
    return response.data;
  },

  // ---------- Attempts ----------
  submitMCQ: async (skillId, questionType, questionId, data) => {
    const response = await api.post(
      `/esp/skills/${skillId}/questions/${questionType}/${questionId}/submit/`,
      data
    );
    return response.data;
  },

  showAnswer: async (skillId, questionType, questionId) => {
    const response = await api.post(
      `/esp/skills/${skillId}/questions/${questionType}/${questionId}/show-answer/`
    );
    return response.data;
  },

  getAttemptStatus: async (skillId, questionType, questionId) => {
    const response = await api.get(
      `/esp/skills/${skillId}/questions/${questionType}/${questionId}/attempt-status/`
    );
    return response.data;
  },

  submitWritingAnswer: async (questionId, data) => {
    const response = await api.post(
      `/esp/writing/questions/${questionId}/submit/`,
      data
    );
    return response.data;
  },
};

// ============================================
// 4. PROGRESS API
// ============================================
export const espProgressAPI = {
  getMyProgress: async () => {
    const response = await api.get("/esp/my-progress/");
    return response.data;
  },

  getProgressByCategory: async (categoryId) => {
    const response = await api.get(
      `/esp/categories/${categoryId}/my-progress/`
    );
    return response.data;
  },

  getSkillProgress: async (skillId) => {
    const response = await api.get(`/esp/skills/${skillId}/my-progress/`);
    return response.data;
  },
};

// ============================================
// 5. AI GENERATION API
// ============================================
export const espAIAPI = {
  // Books
  extractBook: async (formData) => {
    const response = await api.post(
      "/esp/ai/extract-book/upload/",
      formData,
      getFormDataConfig()
    );
    return response.data;
  },
  getExtractBookStatus: async (bookId) => {
    const response = await api.get(
      `/esp/ai/extract-book/${bookId}/status/`
    );
    return response.data;
  },
  listExtractedBooks: async () => {
    const response = await api.get("/esp/ai/extract-book/");
    return response.data;
  },

  // Media
  extractMedia: async (formData) => {
    const response = await api.post(
      "/esp/ai/extract-media/upload/",
      formData,
      getFormDataConfig()
    );
    return response.data;
  },
  getExtractMediaStatus: async (mediaId) => {
    const response = await api.get(
      `/esp/ai/extract-media/${mediaId}/status/`
    );
    return response.data;
  },
  listExtractedMedia: async () => {
    const response = await api.get("/esp/ai/extract-media/");
    return response.data;
  },

  // Generation
  generateSkill: async (data) => {
    const response = await api.post("/esp/ai/generate-skill/", data);
    return response.data;
  },
  getJobStatus: async (jobId) => {
    const response = await api.get(`/esp/ai/jobs/${jobId}/status/`);
    return response.data;
  },
  listJobs: async (categoryId = null) => {
    const params = categoryId ? { category_id: categoryId } : {};
    const response = await api.get("/esp/ai/jobs/", { params });
    return response.data;
  },
};
