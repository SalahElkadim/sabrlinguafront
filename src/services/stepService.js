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
// 2. STEP QUESTIONS API (Create)
// ============================================
export const stepQuestionsAPI = {
  // Vocabulary
  createVocabulary: async (data) => {
    const response = await api.post("/step/vocabulary/create/", data);
    return response.data;
  },

  // Grammar
  createGrammar: async (data) => {
    const response = await api.post("/step/grammar/create/", data);
    return response.data;
  },

  // Reading Passage
  createReadingPassage: async (data) => {
    const config = data instanceof FormData ? getFormDataConfig() : {};
    const response = await api.post(
      "/step/reading/passages/create/",
      data,
      config
    );
    return response.data;
  },

  // Reading Question (linked to passage)
  createReadingQuestion: async (passageId, data) => {
    const response = await api.post(
      `/step/reading/passages/${passageId}/questions/create/`,
      data
    );
    return response.data;
  },

  // Writing
  createWriting: async (data) => {
    const config = data instanceof FormData ? getFormDataConfig() : {};
    const response = await api.post(
      "/step/writing/questions/create/",
      data,
      config
    );
    return response.data;
  },

  // Get questions for a skill
  getSkillQuestions: async (skillId, page = 1, pageSize = 20) => {
    const response = await api.get(`/step/skills/${skillId}/questions/`, {
      params: { page, page_size: pageSize },
    });
    return response.data;
  },

  // Mark question as viewed
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
