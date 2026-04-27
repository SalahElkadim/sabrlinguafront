// src/services/ieltsService.js
import api from "../api/axios";

const getFormDataConfig = () => ({
  headers: { "Content-Type": "multipart/form-data" },
});

// ============================================
// 1. IELTS SKILLS API
// ============================================
export const ieltsSkillsAPI = {
  getAll: async () => {
    const response = await api.get("/ielts/skills/");
    return response.data;
  },

  getById: async (skillId) => {
    const response = await api.get(`/ielts/skills/${skillId}/`);
    return response.data;
  },

  create: async (data) => {
    const config = data instanceof FormData ? getFormDataConfig() : {};
    const response = await api.post("/ielts/skills/create/", data, config);
    return response.data;
  },

  update: async (skillId, data) => {
    const config = data instanceof FormData ? getFormDataConfig() : {};
    const response = await api.put(
      `/ielts/skills/${skillId}/update/`,
      data,
      config
    );
    return response.data;
  },

  patch: async (skillId, data) => {
    const config = data instanceof FormData ? getFormDataConfig() : {};
    const response = await api.patch(
      `/ielts/skills/${skillId}/update/`,
      data,
      config
    );
    return response.data;
  },

  delete: async (skillId) => {
    const response = await api.delete(`/ielts/skills/${skillId}/delete/`);
    return response.data;
  },

  setChildSkills: async (skillId, childSkillIds) => {
    const response = await api.post(`/ielts/skills/${skillId}/set-children/`, {
      child_skill_ids: childSkillIds,
    });
    return response.data;
  },
};

// ============================================
// 2. IELTS QUESTIONS API (Create + Update + Delete)
// ============================================
export const ieltsQuestionsAPI = {
  // ---------- Vocabulary ----------
  createVocabulary: async (data) => {
    const response = await api.post("/ielts/vocabulary/create/", data);
    return response.data;
  },
  updateVocabulary: async (questionId, data) => {
    const response = await api.put(
      `/ielts/vocabulary/${questionId}/update/`,
      data
    );
    return response.data;
  },
  deleteVocabulary: async (questionId) => {
    const response = await api.delete(
      `/ielts/vocabulary/${questionId}/delete/`
    );
    return response.data;
  },

  // ---------- Grammar ----------
  createGrammar: async (data) => {
    const response = await api.post("/ielts/grammar/create/", data);
    return response.data;
  },
  updateGrammar: async (questionId, data) => {
    const response = await api.put(
      `/ielts/grammar/${questionId}/update/`,
      data
    );
    return response.data;
  },
  deleteGrammar: async (questionId) => {
    const response = await api.delete(`/ielts/grammar/${questionId}/delete/`);
    return response.data;
  },

  // ---------- Reading Passage ----------
  createReadingPassage: async (data) => {
    const config = data instanceof FormData ? getFormDataConfig() : {};
    const response = await api.post(
      "/ielts/reading/passages/create/",
      data,
      config
    );
    return response.data;
  },
  updateReadingPassage: async (passageId, data) => {
    const response = await api.put(
      `/ielts/reading/passages/${passageId}/update/`,
      data
    );
    return response.data;
  },
  deleteReadingPassage: async (passageId) => {
    const response = await api.delete(
      `/ielts/reading/passages/${passageId}/delete/`
    );
    return response.data;
  },

  // ---------- Reading Question ----------
  createReadingQuestion: async (passageId, data) => {
    const response = await api.post(
      `/ielts/reading/passages/${passageId}/questions/create/`,
      data
    );
    return response.data;
  },
  updateReadingQuestion: async (questionId, data) => {
    const response = await api.put(
      `/ielts/reading/questions/${questionId}/update/`,
      data
    );
    return response.data;
  },
  deleteReadingQuestion: async (questionId) => {
    const response = await api.delete(
      `/ielts/reading/questions/${questionId}/delete/`
    );
    return response.data;
  },

  // ---------- Listening Audio ----------
  createListeningAudio: async (data) => {
    const isFile =
      data instanceof FormData ||
      (data.audio_file && data.audio_file instanceof File);

    if (isFile && !(data instanceof FormData)) {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (data[key] !== undefined && data[key] !== null) {
          formData.append(key, data[key]);
        }
      });
      data = formData;
    }

    const config = data instanceof FormData ? getFormDataConfig() : {};
    const response = await api.post(
      "/ielts/listening/audio/create/",
      data,
      config
    );
    return response.data;
  },
  updateListeningAudio: async (audioId, data) => {
    const config = data instanceof FormData ? getFormDataConfig() : {};
    const response = await api.put(
      `/ielts/listening/audio/${audioId}/update/`,
      data,
      config
    );
    return response.data;
  },
  deleteListeningAudio: async (audioId) => {
    const response = await api.delete(
      `/ielts/listening/audio/${audioId}/delete/`
    );
    return response.data;
  },

  // ---------- Listening Question ----------
  createListeningQuestion: async (audioId, data) => {
    const response = await api.post(
      `/ielts/listening/audio/${audioId}/questions/create/`,
      data
    );
    return response.data;
  },
  updateListeningQuestion: async (questionId, data) => {
    const response = await api.put(
      `/ielts/listening/questions/${questionId}/update/`,
      data
    );
    return response.data;
  },
  deleteListeningQuestion: async (questionId) => {
    const response = await api.delete(
      `/ielts/listening/questions/${questionId}/delete/`
    );
    return response.data;
  },

  // ---------- Speaking Video ----------
  createSpeakingVideo: async (data) => {
    const isFile =
      data instanceof FormData ||
      (data.video_file && data.video_file instanceof File);

    if (isFile && !(data instanceof FormData)) {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (data[key] !== undefined && data[key] !== null) {
          formData.append(key, data[key]);
        }
      });
      data = formData;
    }

    const config = data instanceof FormData ? getFormDataConfig() : {};
    const response = await api.post(
      "/ielts/speaking/videos/create/",
      data,
      config
    );
    return response.data;
  },
  updateSpeakingVideo: async (videoId, data) => {
    const config = data instanceof FormData ? getFormDataConfig() : {};
    const response = await api.put(
      `/ielts/speaking/videos/${videoId}/update/`,
      data,
      config
    );
    return response.data;
  },
  deleteSpeakingVideo: async (videoId) => {
    const response = await api.delete(
      `/ielts/speaking/videos/${videoId}/delete/`
    );
    return response.data;
  },

  // ---------- Speaking Question ----------
  createSpeakingQuestion: async (videoId, data) => {
    const response = await api.post(
      `/ielts/speaking/videos/${videoId}/questions/create/`,
      data
    );
    return response.data;
  },
  updateSpeakingQuestion: async (questionId, data) => {
    const response = await api.put(
      `/ielts/speaking/questions/${questionId}/update/`,
      data
    );
    return response.data;
  },
  deleteSpeakingQuestion: async (questionId) => {
    const response = await api.delete(
      `/ielts/speaking/questions/${questionId}/delete/`
    );
    return response.data;
  },

  // ---------- Writing ----------
  createWriting: async (data) => {
    const config = data instanceof FormData ? getFormDataConfig() : {};
    const response = await api.post(
      "/ielts/writing/questions/create/",
      data,
      config
    );
    return response.data;
  },
  updateWriting: async (questionId, data) => {
    const response = await api.put(
      `/ielts/writing/questions/${questionId}/update/`,
      data
    );
    return response.data;
  },
  deleteWriting: async (questionId) => {
    const response = await api.delete(
      `/ielts/writing/questions/${questionId}/delete/`
    );
    return response.data;
  },

  // ---------- General ----------
  getSkillQuestions: async (skillId, page = 1, pageSize = 20) => {
    const response = await api.get(`/ielts/skills/${skillId}/questions/`, {
      params: { page, page_size: pageSize },
    });
    return response.data;
  },

  markViewed: async (skillId, questionType, questionId) => {
    const response = await api.post(
      `/ielts/skills/${skillId}/questions/${questionType}/${questionId}/mark-viewed/`
    );
    return response.data;
  },
};

// ============================================
// 3. IELTS PROGRESS API
// ============================================
export const ieltsProgressAPI = {
  getMyProgress: async () => {
    const response = await api.get("/ielts/my-progress/");
    return response.data;
  },

  getSkillProgress: async (skillId) => {
    const response = await api.get(`/ielts/skills/${skillId}/my-progress/`);
    return response.data;
  },
};

// ============================================
// 4. IELTS AI GENERATION API
// ============================================
export const ieltsAIAPI = {
  // كتب
  uploadBook: async (formData) => {
    const response = await api.post(
      "/ielts/ai/extract-book/upload/",
      formData,
      getFormDataConfig()
    );
    return response.data;
  },
  getBookStatus: async (bookId) => {
    const response = await api.get(`/ielts/ai/extract-book/${bookId}/status/`);
    return response.data;
  },
  listBooks: async () => {
    const response = await api.get("/ielts/ai/extract-book/");
    return response.data;
  },

  // ميديا
  uploadMedia: async (formData) => {
    const response = await api.post(
      "/ielts/ai/extract-media/upload/",
      formData,
      getFormDataConfig()
    );
    return response.data;
  },
  getMediaStatus: async (mediaId) => {
    const response = await api.get(
      `/ielts/ai/extract-media/${mediaId}/status/`
    );
    return response.data;
  },
  listMedia: async () => {
    const response = await api.get("/ielts/ai/extract-media/");
    return response.data;
  },

  // توليد مهارة جديدة
  generateSkill: async (data) => {
    const response = await api.post("/ielts/ai/generate-skill/", data);
    return response.data;
  },

  // إضافة أسئلة لمهارة موجودة ← جديد
  addQuestionsToSkill: async (data) => {
    const response = await api.post("/ielts/ai/add-questions/", data);
    return response.data;
  },

  // حالة الـ job
  getJobStatus: async (jobId) => {
    const response = await api.get(`/ielts/ai/jobs/${jobId}/status/`);
    return response.data;
  },
};
