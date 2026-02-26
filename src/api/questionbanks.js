import api from "./axios";

export const questionBanksAPI = {
  // ========== Question Bank CRUD ==========

  // Create question bank
  createBank: async (data) => {
    const response = await api.post("/place/question-banks/create/", data);
    return response.data;
  },

  // Get all banks
  getAllBanks: async () => {
    const response = await api.get("/place/question-banks/");
    return response.data;
  },

  // Get single bank
  getBank: async (bankId) => {
    const response = await api.get(`/place/question-banks/${bankId}/`);
    return response.data;
  },

  // Update bank
  updateBank: async (bankId, data) => {
    const response = await api.put(
      `/place/question-banks/${bankId}/update/`,
      data
    );
    return response.data;
  },

  // Partial update bank
  patchBank: async (bankId, data) => {
    const response = await api.patch(
      `/place/question-banks/${bankId}/update/`,
      data
    );
    return response.data;
  },

  // Delete bank
  deleteBank: async (bankId) => {
    const response = await api.delete(
      `/place/question-banks/${bankId}/delete/`
    );
    return response.data;
  },

  // Get bank statistics
  getBankStatistics: async (bankId) => {
    const response = await api.get(
      `/place/question-banks/${bankId}/statistics/`
    );
    return response.data;
  },

  // ========== Add Questions ==========

  // Add Vocabulary Question
  addVocabularyQuestion: async (bankId, data) => {
    const response = await api.post(
      `/place/question-banks/${bankId}/add-vocabulary-question/`,
      data
    );
    return response.data;
  },

  // Add Grammar Question
  addGrammarQuestion: async (bankId, data) => {
    const response = await api.post(
      `/place/question-banks/${bankId}/add-grammar-question/`,
      data
    );
    return response.data;
  },

  // Create Reading Passage
  createReadingPassage: async (bankId, data) => {
    const response = await api.post(
      `/place/question-banks/${bankId}/create-reading-passage/`,
      data
    );
    return response.data;
  },

  // Add Reading Question
  addReadingQuestion: async (bankId, passageId, data) => {
    const response = await api.post(
      `/place/question-banks/${bankId}/reading-passages/${passageId}/add-question/`,
      data
    );
    return response.data;
  },

  // Create Listening Audio
  createListeningAudio: async (bankId, data) => {
    const response = await api.post(
      `/place/question-banks/${bankId}/create-listening-audio/`,
      data
    );
    return response.data;
  },

  // Add Listening Question
  addListeningQuestion: async (bankId, audioId, data) => {
    const response = await api.post(
      `/place/question-banks/${bankId}/listening-audios/${audioId}/add-question/`,
      data
    );
    return response.data;
  },

  // Create Speaking Video
  createSpeakingVideo: async (bankId, data) => {
    const response = await api.post(
      `/place/question-banks/${bankId}/create-speaking-video/`,
      data
    );
    return response.data;
  },

  // Add Speaking Question
  addSpeakingQuestion: async (bankId, videoId, data) => {
    const response = await api.post(
      `/place/question-banks/${bankId}/speaking-videos/${videoId}/add-question/`,
      data
    );
    return response.data;
  },

  // Add Writing Question
  addWritingQuestion: async (bankId, data) => {
    const response = await api.post(
      `/place/question-banks/${bankId}/add-writing-question/`,
      data
    );
    return response.data;
  },

  // ========== List Questions ==========

  // Get all questions
  getAllQuestions: async (bankId, questionType = null) => {
    const params = questionType ? { question_type: questionType } : {};
    const response = await api.get(
      `/place/question-banks/${bankId}/all-questions/`,
      { params }
    );
    return response.data;
  },

  // Get vocabulary questions
  getVocabularyQuestions: async (bankId) => {
    const response = await api.get(
      `/place/question-banks/${bankId}/vocabulary-questions/`
    );
    return response.data;
  },

  // Get grammar questions
  getGrammarQuestions: async (bankId) => {
    const response = await api.get(
      `/place/question-banks/${bankId}/grammar-questions/`
    );
    return response.data;
  },

  // Get reading passages
  getReadingPassages: async (bankId) => {
    const response = await api.get(
      `/place/question-banks/${bankId}/reading-passages/`
    );
    return response.data;
  },

  // Get listening audios
  getListeningAudios: async (bankId) => {
    const response = await api.get(
      `/place/question-banks/${bankId}/listening-audios/`
    );
    return response.data;
  },

  // Get speaking videos
  getSpeakingVideos: async (bankId) => {
    const response = await api.get(
      `/place/question-banks/${bankId}/speaking-videos/`
    );
    return response.data;
  },

  // Get writing questions
  getWritingQuestions: async (bankId) => {
    const response = await api.get(
      `/place/question-banks/${bankId}/writing-questions/`
    );
    return response.data;
  },
};
