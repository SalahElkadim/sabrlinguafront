import { create } from "zustand";
import { questionBanksAPI } from "../api/questionbanks";

export const useQuestionBanksStore = create((set, get) => ({
  banks: [],
  currentBank: null,
  bankStatistics: null,
  questions: {},
  loading: false,
  error: null,

  // Fetch all banks
  fetchBanks: async () => {
    set({ loading: true, error: null });
    try {
      const data = await questionBanksAPI.getAllBanks();
      set({ banks: data.question_banks, loading: false });
      return data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.error_message || "حدث خطأ في تحميل البنوك";
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  // Fetch single bank
  fetchBank: async (bankId) => {
    set({ loading: true, error: null });
    try {
      const data = await questionBanksAPI.getBank(bankId);
      set({ currentBank: data, loading: false });
      return data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.error_message || "حدث خطأ في تحميل البنك";
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  // Create bank
  createBank: async (bankData) => {
    set({ loading: true, error: null });
    try {
      const data = await questionBanksAPI.createBank(bankData);
      const banks = get().banks;
      set({ banks: [data.question_bank, ...banks], loading: false });
      return data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.error_message || "حدث خطأ في إنشاء البنك";
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  // Update bank
  updateBank: async (bankId, bankData) => {
    set({ loading: true, error: null });
    try {
      const data = await questionBanksAPI.updateBank(bankId, bankData);
      const banks = get().banks.map((bank) =>
        bank.id === bankId ? data.question_bank : bank
      );
      set({ banks, currentBank: data.question_bank, loading: false });
      return data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.error_message || "حدث خطأ في تحديث البنك";
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  // Delete bank
  deleteBank: async (bankId) => {
    set({ loading: true, error: null });
    try {
      await questionBanksAPI.deleteBank(bankId);
      const banks = get().banks.filter((bank) => bank.id !== bankId);
      set({ banks, loading: false });
    } catch (error) {
      const errorMessage =
        error.response?.data?.error_message || "حدث خطأ في حذف البنك";
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  // Fetch bank statistics
  fetchBankStatistics: async (bankId) => {
    set({ loading: true, error: null });
    try {
      const data = await questionBanksAPI.getBankStatistics(bankId);
      set({ bankStatistics: data, loading: false });
      return data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.error_message || "حدث خطأ في تحميل الإحصائيات";
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  // Fetch all questions
  fetchAllQuestions: async (bankId, questionType = null) => {
    set({ loading: true, error: null });
    try {
      const data = await questionBanksAPI.getAllQuestions(bankId, questionType);
      set({ questions: data.questions, loading: false });
      return data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.error_message || "حدث خطأ في تحميل الأسئلة";
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  // Add vocabulary question
  addVocabularyQuestion: async (bankId, questionData) => {
    set({ loading: true, error: null });
    try {
      const data = await questionBanksAPI.addVocabularyQuestion(
        bankId,
        questionData
      );
      set({ loading: false });
      // Refresh statistics
      await get().fetchBankStatistics(bankId);
      return data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.error_message || "حدث خطأ في إضافة السؤال";
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  // Add grammar question
  addGrammarQuestion: async (bankId, questionData) => {
    set({ loading: true, error: null });
    try {
      const data = await questionBanksAPI.addGrammarQuestion(
        bankId,
        questionData
      );
      set({ loading: false });
      await get().fetchBankStatistics(bankId);
      return data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.error_message || "حدث خطأ في إضافة السؤال";
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  // Create reading passage
  createReadingPassage: async (bankId, passageData) => {
    set({ loading: true, error: null });
    try {
      const data = await questionBanksAPI.createReadingPassage(
        bankId,
        passageData
      );
      set({ loading: false });
      return data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.error_message || "حدث خطأ في إنشاء القطعة";
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  // Add reading question
  addReadingQuestion: async (bankId, passageId, questionData) => {
    set({ loading: true, error: null });
    try {
      const data = await questionBanksAPI.addReadingQuestion(
        bankId,
        passageId,
        questionData
      );
      set({ loading: false });
      await get().fetchBankStatistics(bankId);
      return data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.error_message || "حدث خطأ في إضافة السؤال";
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  // Create listening audio
  createListeningAudio: async (bankId, audioData) => {
    set({ loading: true, error: null });
    try {
      const data = await questionBanksAPI.createListeningAudio(
        bankId,
        audioData
      );
      set({ loading: false });
      return data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.error_message || "حدث خطأ في إنشاء التسجيل";
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  // Add listening question
  addListeningQuestion: async (bankId, audioId, questionData) => {
    set({ loading: true, error: null });
    try {
      const data = await questionBanksAPI.addListeningQuestion(
        bankId,
        audioId,
        questionData
      );
      set({ loading: false });
      await get().fetchBankStatistics(bankId);
      return data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.error_message || "حدث خطأ في إضافة السؤال";
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  // Create speaking video
  createSpeakingVideo: async (bankId, videoData) => {
    set({ loading: true, error: null });
    try {
      const data = await questionBanksAPI.createSpeakingVideo(
        bankId,
        videoData
      );
      set({ loading: false });
      return data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.error_message || "حدث خطأ في إنشاء الفيديو";
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  // Add speaking question
  addSpeakingQuestion: async (bankId, videoId, questionData) => {
    set({ loading: true, error: null });
    try {
      const data = await questionBanksAPI.addSpeakingQuestion(
        bankId,
        videoId,
        questionData
      );
      set({ loading: false });
      await get().fetchBankStatistics(bankId);
      return data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.error_message || "حدث خطأ في إضافة السؤال";
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  // Add writing question
  addWritingQuestion: async (bankId, questionData) => {
    set({ loading: true, error: null });
    try {
      const data = await questionBanksAPI.addWritingQuestion(
        bankId,
        questionData
      );
      set({ loading: false });
      await get().fetchBankStatistics(bankId);
      return data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.error_message || "حدث خطأ في إضافة السؤال";
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  // Clear error
  clearError: () => set({ error: null }),
}));
