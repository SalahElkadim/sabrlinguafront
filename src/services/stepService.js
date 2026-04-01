// src/services/stepService.js
import api from "../api/axios";

const getFormDataConfig = () => ({
  headers: { "Content-Type": "multipart/form-data" },
});

// ============================================
// 1. STEP SKILLS API
// ============================================
export const stepSkillsAPI = {
  getAll: async () => {
    const response = await api.get("/step/skills/");
    return response.data;
  },

  getById: async (skillId) => {
    const response = await api.get(`/step/skills/${skillId}/`);
    return response.data;
  },

  create: async (data) => {
    const config = data instanceof FormData ? getFormDataConfig() : {};
    const response = await api.post("/step/skills/create/", data, config);
    return response.data;
  },

  update: async (skillId, data) => {
    const config = data instanceof FormData ? getFormDataConfig() : {};
    const response = await api.put(
      `/step/skills/${skillId}/update/`,
      data,
      config
    );
    return response.data;
  },

  patch: async (skillId, data) => {
    const config = data instanceof FormData ? getFormDataConfig() : {};
    const response = await api.patch(
      `/step/skills/${skillId}/update/`,
      data,
      config
    );
    return response.data;
  },

  delete: async (skillId) => {
    const response = await api.delete(`/step/skills/${skillId}/delete/`);
    return response.data;
  },
};

// ============================================
// 2. STEP QUESTIONS API (Create + Update + Delete)
// ============================================
export const stepQuestionsAPI = {
  // ---------- Vocabulary ----------
  createVocabulary: async (data) => {
    const response = await api.post("/step/vocabulary/create/", data);
    return response.data;
  },
  updateVocabulary: async (questionId, data) => {
    const response = await api.put(
      `/step/vocabulary/${questionId}/update/`,
      data
    );
    return response.data;
  },
  deleteVocabulary: async (questionId) => {
    const response = await api.delete(`/step/vocabulary/${questionId}/delete/`);
    return response.data;
  },

  // ---------- Grammar ----------
  createGrammar: async (data) => {
    const response = await api.post("/step/grammar/create/", data);
    return response.data;
  },
  updateGrammar: async (questionId, data) => {
    const response = await api.put(`/step/grammar/${questionId}/update/`, data);
    return response.data;
  },
  deleteGrammar: async (questionId) => {
    const response = await api.delete(`/step/grammar/${questionId}/delete/`);
    return response.data;
  },

  // ---------- Reading Passage ----------
  createReadingPassage: async (data) => {
    const config = data instanceof FormData ? getFormDataConfig() : {};
    const response = await api.post(
      "/step/reading/passages/create/",
      data,
      config
    );
    return response.data;
  },
  updateReadingPassage: async (passageId, data) => {
    const response = await api.put(
      `/step/reading/passages/${passageId}/update/`,
      data
    );
    return response.data;
  },
  deleteReadingPassage: async (passageId) => {
    const response = await api.delete(
      `/step/reading/passages/${passageId}/delete/`
    );
    return response.data;
  },

  // ---------- Reading Question ----------
  createReadingQuestion: async (passageId, data) => {
    const response = await api.post(
      `/step/reading/passages/${passageId}/questions/create/`,
      data
    );
    return response.data;
  },
  updateReadingQuestion: async (questionId, data) => {
    const response = await api.put(
      `/step/reading/questions/${questionId}/update/`,
      data
    );
    return response.data;
  },
  deleteReadingQuestion: async (questionId) => {
    const response = await api.delete(
      `/step/reading/questions/${questionId}/delete/`
    );
    return response.data;
  },

  // ---------- Listening Audio ----------
  createListeningAudio: async (data) => {
    const response = await api.post("/step/listening/audio/create/", data);
    return response.data;
  },
  updateListeningAudio: async (audioId, data) => {
    const response = await api.put(
      `/step/listening/audio/${audioId}/update/`,
      data
    );
    return response.data;
  },
  deleteListeningAudio: async (audioId) => {
    const response = await api.delete(
      `/step/listening/audio/${audioId}/delete/`
    );
    return response.data;
  },

  // ---------- Listening Question ----------
  createListeningQuestion: async (audioId, data) => {
    const response = await api.post(
      `/step/listening/audio/${audioId}/questions/create/`,
      data
    );
    return response.data;
  },
  updateListeningQuestion: async (questionId, data) => {
    const response = await api.put(
      `/step/listening/questions/${questionId}/update/`,
      data
    );
    return response.data;
  },
  deleteListeningQuestion: async (questionId) => {
    const response = await api.delete(
      `/step/listening/questions/${questionId}/delete/`
    );
    return response.data;
  },

  // ---------- Writing ----------
  createWriting: async (data) => {
    const config = data instanceof FormData ? getFormDataConfig() : {};
    const response = await api.post(
      "/step/writing/questions/create/",
      data,
      config
    );
    return response.data;
  },
  updateWriting: async (questionId, data) => {
    const response = await api.put(
      `/step/writing/questions/${questionId}/update/`,
      data
    );
    return response.data;
  },
  deleteWriting: async (questionId) => {
    const response = await api.delete(
      `/step/writing/questions/${questionId}/delete/`
    );
    return response.data;
  },

  // ---------- General ----------
  getSkillQuestions: async (skillId, page = 1, pageSize = 20) => {
    const response = await api.get(`/step/skills/${skillId}/questions/`, {
      params: { page, page_size: pageSize },
    });
    return response.data;
  },

  markViewed: async (skillId, questionType, questionId) => {
    const response = await api.post(
      `/step/skills/${skillId}/questions/${questionType}/${questionId}/mark-viewed/`
    );
    return response.data;
  },
};

// ============================================
// 3. STEP PROGRESS API
// ============================================
export const stepProgressAPI = {
  getMyProgress: async () => {
    const response = await api.get("/step/my-progress/");
    return response.data;
  },

  getSkillProgress: async (skillId) => {
    const response = await api.get(`/step/skills/${skillId}/my-progress/`);
    return response.data;
  },
};
