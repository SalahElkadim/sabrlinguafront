// src/services/generalService.js
import api from "../api/axios";

const getFormDataConfig = () => ({
  headers: { "Content-Type": "multipart/form-data" },
});

// ============================================
// 1. CATEGORIES API
// ============================================
export const generalCategoriesAPI = {
  getAll: async () => {
    const response = await api.get("/general/categories/");
    return response.data;
  },

  getById: async (categoryId) => {
    const response = await api.get(`/general/categories/${categoryId}/`);
    return response.data;
  },

  create: async (data) => {
    const config = data instanceof FormData ? getFormDataConfig() : {};
    const response = await api.post(
      "/general/categories/create/",
      data,
      config
    );
    return response.data;
  },

  update: async (categoryId, data) => {
    const config = data instanceof FormData ? getFormDataConfig() : {};
    const response = await api.put(
      `/general/categories/${categoryId}/update/`,
      data,
      config
    );
    return response.data;
  },

  patch: async (categoryId, data) => {
    const config = data instanceof FormData ? getFormDataConfig() : {};
    const response = await api.patch(
      `/general/categories/${categoryId}/update/`,
      data,
      config
    );
    return response.data;
  },

  delete: async (categoryId) => {
    const response = await api.delete(
      `/general/categories/${categoryId}/delete/`
    );
    return response.data;
  },
};

// ============================================
// 2. SKILLS API
// ============================================
export const generalSkillsAPI = {
  getByCategory: async (categoryId) => {
    const response = await api.get(`/general/categories/${categoryId}/skills/`);
    return response.data;
  },

  getById: async (skillId) => {
    const response = await api.get(`/general/skills/${skillId}/`);
    return response.data;
  },

  create: async (categoryId, data) => {
    const config = data instanceof FormData ? getFormDataConfig() : {};
    const response = await api.post(
      `/general/categories/${categoryId}/skills/create/`,
      data,
      config
    );
    return response.data;
  },

  update: async (skillId, data) => {
    const config = data instanceof FormData ? getFormDataConfig() : {};
    const response = await api.put(
      `/general/skills/${skillId}/update/`,
      data,
      config
    );
    return response.data;
  },

  patch: async (skillId, data) => {
    const config = data instanceof FormData ? getFormDataConfig() : {};
    const response = await api.patch(
      `/general/skills/${skillId}/update/`,
      data,
      config
    );
    return response.data;
  },

  delete: async (skillId) => {
    const response = await api.delete(`/general/skills/${skillId}/delete/`);
    return response.data;
  },
};

// ============================================
// 3. QUESTIONS API
// ============================================
export const generalQuestionsAPI = {
  getSkillQuestions: async (skillId, page = 1, pageSize = 20) => {
    const response = await api.get(`/general/skills/${skillId}/questions/`, {
      params: { page, page_size: pageSize },
    });
    return response.data;
  },

  // ---------- Vocabulary ----------
  createVocabulary: async (data) => {
    const response = await api.post("/general/vocabulary/create/", data);
    return response.data;
  },
  updateVocabulary: async (questionId, data) => {
    const response = await api.put(
      `/general/vocabulary/${questionId}/update/`,
      data
    );
    return response.data;
  },
  deleteVocabulary: async (questionId) => {
    const response = await api.delete(
      `/general/vocabulary/${questionId}/delete/`
    );
    return response.data;
  },

  // ---------- Grammar ----------
  createGrammar: async (data) => {
    const response = await api.post("/general/grammar/create/", data);
    return response.data;
  },
  updateGrammar: async (questionId, data) => {
    const response = await api.put(
      `/general/grammar/${questionId}/update/`,
      data
    );
    return response.data;
  },
  deleteGrammar: async (questionId) => {
    const response = await api.delete(`/general/grammar/${questionId}/delete/`);
    return response.data;
  },

  // ---------- Reading Passage ----------
  createReadingPassage: async (data) => {
    const response = await api.post("/general/reading/passages/create/", data);
    return response.data;
  },
  updateReadingPassage: async (passageId, data) => {
    const response = await api.put(
      `/general/reading/passages/${passageId}/update/`,
      data
    );
    return response.data;
  },
  deleteReadingPassage: async (passageId) => {
    const response = await api.delete(
      `/general/reading/passages/${passageId}/delete/`
    );
    return response.data;
  },

  // ---------- Reading Question ----------
  createReadingQuestion: async (passageId, data) => {
    const response = await api.post(
      `/general/reading/passages/${passageId}/questions/create/`,
      data
    );
    return response.data;
  },
  updateReadingQuestion: async (questionId, data) => {
    const response = await api.put(
      `/general/reading/questions/${questionId}/update/`,
      data
    );
    return response.data;
  },
  deleteReadingQuestion: async (questionId) => {
    const response = await api.delete(
      `/general/reading/questions/${questionId}/delete/`
    );
    return response.data;
  },

  // ---------- Listening Audio ----------
  createListeningAudio: async (data) => {
    const config = data instanceof FormData ? getFormDataConfig() : {};
    const response = await api.post(
      "/general/listening/audio/create/",
      data,
      config
    );
    return response.data;
  },
  updateListeningAudio: async (audioId, data) => {
    const config = data instanceof FormData ? getFormDataConfig() : {}; // ← أضف
    const response = await api.put(
      `/general/listening/audio/${audioId}/update/`,
      data,
      config // ← أضف
    );
    return response.data;
  },
  deleteListeningAudio: async (audioId) => {
    const response = await api.delete(
      `/general/listening/audio/${audioId}/delete/`
    );
    return response.data;
  },

  // ---------- Listening Question ----------
  createListeningQuestion: async (audioId, data) => {
    const response = await api.post(
      `/general/listening/audio/${audioId}/questions/create/`,
      data
    );
    return response.data;
  },
  updateListeningQuestion: async (questionId, data) => {
    const response = await api.put(
      `/general/listening/questions/${questionId}/update/`,
      data
    );
    return response.data;
  },
  deleteListeningQuestion: async (questionId) => {
    const response = await api.delete(
      `/general/listening/questions/${questionId}/delete/`
    );
    return response.data;
  },

  // ---------- Speaking Video ----------
  createSpeakingVideo: async (data) => {
    const response = await api.post("/general/speaking/videos/create/", data);
    return response.data;
  },
  updateSpeakingVideo: async (videoId, data) => {
    const config = data instanceof FormData ? getFormDataConfig() : {}; // ← أضف
    const response = await api.put(
      `/general/speaking/videos/${videoId}/update/`,
      data,
      config // ← أضف
    );
    return response.data;
  },
  deleteSpeakingVideo: async (videoId) => {
    const response = await api.delete(
      `/general/speaking/videos/${videoId}/delete/`
    );
    return response.data;
  },

  // ---------- Speaking Question ----------
  createSpeakingQuestion: async (videoId, data) => {
    const response = await api.post(
      `/general/speaking/videos/${videoId}/questions/create/`,
      data
    );
    return response.data;
  },
  updateSpeakingQuestion: async (questionId, data) => {
    const response = await api.put(
      `/general/speaking/questions/${questionId}/update/`,
      data
    );
    return response.data;
  },
  deleteSpeakingQuestion: async (questionId) => {
    const response = await api.delete(
      `/general/speaking/questions/${questionId}/delete/`
    );
    return response.data;
  },

  // ---------- Writing ----------
  createWriting: async (data) => {
    const response = await api.post("/general/writing/questions/create/", data);
    return response.data;
  },
  updateWriting: async (questionId, data) => {
    const response = await api.put(
      `/general/writing/questions/${questionId}/update/`,
      data
    );
    return response.data;
  },
  deleteWriting: async (questionId) => {
    const response = await api.delete(
      `/general/writing/questions/${questionId}/delete/`
    );
    return response.data;
  },

  // ---------- Attempts ----------
  submitMCQ: async (skillId, questionType, questionId, data) => {
    const response = await api.post(
      `/general/skills/${skillId}/questions/${questionType}/${questionId}/submit/`,
      data
    );
    return response.data;
  },

  showAnswer: async (skillId, questionType, questionId) => {
    const response = await api.post(
      `/general/skills/${skillId}/questions/${questionType}/${questionId}/show-answer/`
    );
    return response.data;
  },

  getAttemptStatus: async (skillId, questionType, questionId) => {
    const response = await api.get(
      `/general/skills/${skillId}/questions/${questionType}/${questionId}/attempt-status/`
    );
    return response.data;
  },

  submitWritingAnswer: async (questionId, data) => {
    const response = await api.post(
      `/general/writing/questions/${questionId}/submit/`,
      data
    );
    return response.data;
  },
};

// ============================================
// 4. PROGRESS API
// ============================================
export const generalProgressAPI = {
  getMyProgress: async () => {
    const response = await api.get("/general/my-progress/");
    return response.data;
  },

  getProgressByCategory: async (categoryId) => {
    const response = await api.get(
      `/general/categories/${categoryId}/my-progress/`
    );
    return response.data;
  },

  getSkillProgress: async (skillId) => {
    const response = await api.get(`/general/skills/${skillId}/my-progress/`);
    return response.data;
  },
};

// ============================================
// 5. AI GENERATION API
// ============================================
export const generalAIAPI = {
  // Books
  extractBook: async (formData) => {
    const response = await api.post(
      "/general/ai/extract-book/upload/",
      formData,
      getFormDataConfig()
    );
    return response.data;
  },
  getExtractBookStatus: async (bookId) => {
    const response = await api.get(
      `/general/ai/extract-book/${bookId}/status/`
    );
    return response.data;
  },
  listExtractedBooks: async () => {
    const response = await api.get("/general/ai/extract-book/");
    return response.data;
  },

  // Media
  extractMedia: async (formData) => {
    const response = await api.post(
      "/general/ai/extract-media/upload/",
      formData,
      getFormDataConfig()
    );
    return response.data;
  },
  getExtractMediaStatus: async (mediaId) => {
    const response = await api.get(
      `/general/ai/extract-media/${mediaId}/status/`
    );
    return response.data;
  },
  listExtractedMedia: async () => {
    const response = await api.get("/general/ai/extract-media/");
    return response.data;
  },

  // Generation
  generateSkill: async (data) => {
    const response = await api.post("/general/ai/generate-skill/", data);
    return response.data;
  },
  getJobStatus: async (jobId) => {
    const response = await api.get(`/general/ai/jobs/${jobId}/status/`);
    return response.data;
  },
  listJobs: async (categoryId = null) => {
    const params = categoryId ? { category_id: categoryId } : {};
    const response = await api.get("/general/ai/jobs/", { params });
    return response.data;
  },
};
