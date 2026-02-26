// src/services/ieltsService.js
import api from "../api/axios";

// Helper function to create config for FormData
const getFormDataConfig = () => ({
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

// ============================================
// 1. IELTS SKILLS API
// ============================================

export const ieltsSkillsAPI = {
  // Get all skills
  getAll: async () => {
    const response = await api.get("/ielts/skills/");
    return response.data;
  },

  // Get single skill
  getById: async (skillId) => {
    const response = await api.get(`/ielts/skills/${skillId}/`);
    return response.data;
  },

  // Create skill (Admin only) - with FormData support
  create: async (data) => {
    const config = data instanceof FormData ? getFormDataConfig() : {};
    const response = await api.post("/ielts/skills/create/", data, config);
    return response.data;
  },

  // Update skill (Admin only) - with FormData support
  update: async (skillId, data) => {
    const config = data instanceof FormData ? getFormDataConfig() : {};
    const response = await api.put(
      `/ielts/skills/${skillId}/update/`,
      data,
      config
    );
    return response.data;
  },

  // Partial update skill (Admin only) - with FormData support
  patch: async (skillId, data) => {
    const config = data instanceof FormData ? getFormDataConfig() : {};
    const response = await api.patch(
      `/ielts/skills/${skillId}/update/`,
      data,
      config
    );
    return response.data;
  },

  // Delete skill (Admin only)
  delete: async (skillId) => {
    const response = await api.delete(`/ielts/skills/${skillId}/delete/`);
    return response.data;
  },

  // Get lesson packs for skill
  getLessonPacks: async (skillId) => {
    const response = await api.get(`/ielts/skills/${skillId}/lesson-packs/`);
    return response.data;
  },
};

// ============================================
// 2. LESSON PACKS API
// ============================================

export const ieltsLessonPacksAPI = {
  // Get all lesson packs
  getAll: async (skillId = null, skillType = null) => {
    const params = {};
    if (skillId) params.skill_id = skillId;
    if (skillType) params.skill_type = skillType;
    const response = await api.get("/ielts/lesson-packs/", { params });
    return response.data;
  },

  // Get single lesson pack
  getById: async (packId) => {
    const response = await api.get(`/ielts/lesson-packs/${packId}/`);
    return response.data;
  },

  // Create lesson pack (Admin only)
  create: async (data) => {
    const response = await api.post("/ielts/lesson-packs/create/", data);
    return response.data;
  },

  // Update lesson pack (Admin only)
  update: async (packId, data) => {
    const response = await api.put(
      `/ielts/lesson-packs/${packId}/update/`,
      data
    );
    return response.data;
  },

  // Partial update lesson pack (Admin only)
  patch: async (packId, data) => {
    const response = await api.patch(
      `/ielts/lesson-packs/${packId}/update/`,
      data
    );
    return response.data;
  },

  // Delete lesson pack (Admin only)
  delete: async (packId) => {
    const response = await api.delete(`/ielts/lesson-packs/${packId}/delete/`);
    return response.data;
  },

  // Get lessons in pack
  getLessons: async (packId) => {
    const response = await api.get(`/ielts/lesson-packs/${packId}/lessons/`);
    return response.data;
  },

  // Get practice exam for pack
  getPracticeExam: async (packId) => {
    const response = await api.get(
      `/ielts/lesson-packs/${packId}/practice-exam/`
    );
    return response.data;
  },
};

// ============================================
// 3. LESSONS API
// ============================================

export const ieltsLessonsAPI = {
  // Get all lessons
  getAll: async (lessonPackId = null, skillId = null) => {
    const params = {};
    if (lessonPackId) params.lesson_pack_id = lessonPackId;
    if (skillId) params.skill_id = skillId;
    const response = await api.get("/ielts/lessons/", { params });
    return response.data;
  },

  // Get single lesson (with content)
  getById: async (lessonId) => {
    const response = await api.get(`/ielts/lessons/${lessonId}/`);
    return response.data;
  },

  // Create lesson (Admin only)
  create: async (data) => {
    const response = await api.post("/ielts/lessons/create/", data);
    return response.data;
  },

  // Update lesson (Admin only)
  update: async (lessonId, data) => {
    const response = await api.put(`/ielts/lessons/${lessonId}/update/`, data);
    return response.data;
  },

  // Partial update lesson (Admin only)
  patch: async (lessonId, data) => {
    const response = await api.patch(
      `/ielts/lessons/${lessonId}/update/`,
      data
    );
    return response.data;
  },

  // Delete lesson (Admin only)
  delete: async (lessonId) => {
    const response = await api.delete(`/ielts/lessons/${lessonId}/delete/`);
    return response.data;
  },

  // Mark lesson as complete
  markComplete: async (lessonId) => {
    const response = await api.post(
      `/ielts/lessons/${lessonId}/mark-complete/`
    );
    return response.data;
  },
};

// ============================================
// 4. STUDENT PROGRESS API
// ============================================

export const ieltsProgressAPI = {
  // Get my progress
  getMyProgress: async () => {
    const response = await api.get("/ielts/student/my-progress/");
    return response.data;
  },

  // Mark lesson pack as complete
  markLessonPackComplete: async (packId) => {
    const response = await api.post(
      `/ielts/student/lesson-packs/${packId}/mark-complete/`
    );
    return response.data;
  },
};

// ============================================
// 5. PRACTICE EXAMS API
// ============================================

export const ieltsPracticeExamsAPI = {
  // Get practice exam by ID
  getById: async (examId) => {
    const response = await api.get(`/ielts/practice-exams/${examId}/`);
    return response.data;
  },

  // Start practice exam
  start: async (packId) => {
    const response = await api.post(
      `/ielts/student/practice-exams/start/${packId}/`
    );
    return response.data;
  },

  // Submit practice exam
  submit: async (attemptId, data) => {
    const response = await api.post(
      `/ielts/student/practice-exams/submit/${attemptId}/`,
      data
    );
    return response.data;
  },

  // Get my exam attempts
  getMyAttempts: async (lessonPackId = null) => {
    const params = {};
    if (lessonPackId) params.lesson_pack_id = lessonPackId;
    const response = await api.get("/ielts/student/my-exam-attempts/", {
      params,
    });
    return response.data;
  },
};
