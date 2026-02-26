// src/store/levelsStore.js
import { create } from "zustand";
import {
  levelsAPI,
  unitsAPI,
  lessonsAPI,
  examsAPI,
  levelQuestionBanksAPI,
} from "../services/levelsService";

export const useLevelsStore = create((set, get) => ({
  // ============================================
  // STATE
  // ============================================
  levels: [],
  currentLevel: null,
  units: [],
  currentUnit: null,
  lessons: [],
  currentLesson: null,
  loading: false,
  error: null,

  // ============================================
  // LEVELS ACTIONS
  // ============================================
  fetchLevels: async () => {
    set({ loading: true, error: null });
    try {
      const data = await levelsAPI.getAll();
      set({ levels: data.levels, loading: false });
      return data;
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "فشل في تحميل المستويات";
      set({ error: errorMsg, loading: false });
      throw error;
    }
  },

  fetchLevelById: async (levelId) => {
    set({ loading: true, error: null });
    try {
      const data = await levelsAPI.getById(levelId);
      set({ currentLevel: data, loading: false });
      return data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || "فشل في تحميل المستوى";
      set({ error: errorMsg, loading: false });
      throw error;
    }
  },

  createLevel: async (levelData) => {
    set({ loading: true, error: null });
    try {
      const data = await levelsAPI.create(levelData);
      set((state) => ({
        levels: [...state.levels, data.level],
        loading: false,
      }));
      return data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || "فشل في إنشاء المستوى";
      set({ error: errorMsg, loading: false });
      throw error;
    }
  },

  updateLevel: async (levelId, levelData) => {
    set({ loading: true, error: null });
    try {
      const data = await levelsAPI.update(levelId, levelData);
      set((state) => ({
        levels: state.levels.map((level) =>
          level.id === levelId ? data.level : level
        ),
        currentLevel:
          state.currentLevel?.id === levelId ? data.level : state.currentLevel,
        loading: false,
      }));
      return data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || "فشل في تحديث المستوى";
      set({ error: errorMsg, loading: false });
      throw error;
    }
  },

  deleteLevel: async (levelId) => {
    set({ loading: true, error: null });
    try {
      await levelsAPI.delete(levelId);
      set((state) => ({
        levels: state.levels.filter((level) => level.id !== levelId),
        currentLevel:
          state.currentLevel?.id === levelId ? null : state.currentLevel,
        loading: false,
      }));
    } catch (error) {
      const errorMsg = error.response?.data?.message || "فشل في حذف المستوى";
      set({ error: errorMsg, loading: false });
      throw error;
    }
  },

  // ============================================
  // UNITS ACTIONS
  // ============================================
  fetchUnits: async (levelId = null) => {
    set({ loading: true, error: null });
    try {
      const data = await unitsAPI.getAll(levelId);
      set({ units: data.units, loading: false });
      return data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || "فشل في تحميل الوحدات";
      set({ error: errorMsg, loading: false });
      throw error;
    }
  },

  fetchUnitById: async (unitId) => {
    set({ loading: true, error: null });
    try {
      const data = await unitsAPI.getById(unitId);
      set({ currentUnit: data, loading: false });
      return data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || "فشل في تحميل الوحدة";
      set({ error: errorMsg, loading: false });
      throw error;
    }
  },

  createUnit: async (unitData) => {
    set({ loading: true, error: null });
    try {
      const data = await unitsAPI.create(unitData);
      set((state) => ({
        units: [...state.units, data.unit],
        loading: false,
      }));
      return data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || "فشل في إنشاء الوحدة";
      set({ error: errorMsg, loading: false });
      throw error;
    }
  },

  updateUnit: async (unitId, unitData) => {
    set({ loading: true, error: null });
    try {
      const data = await unitsAPI.update(unitId, unitData);
      set((state) => ({
        units: state.units.map((unit) =>
          unit.id === unitId ? data.unit : unit
        ),
        currentUnit:
          state.currentUnit?.id === unitId ? data.unit : state.currentUnit,
        loading: false,
      }));
      return data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || "فشل في تحديث الوحدة";
      set({ error: errorMsg, loading: false });
      throw error;
    }
  },

  deleteUnit: async (unitId) => {
    set({ loading: true, error: null });
    try {
      await unitsAPI.delete(unitId);
      set((state) => ({
        units: state.units.filter((unit) => unit.id !== unitId),
        currentUnit:
          state.currentUnit?.id === unitId ? null : state.currentUnit,
        loading: false,
      }));
    } catch (error) {
      const errorMsg = error.response?.data?.message || "فشل في حذف الوحدة";
      set({ error: errorMsg, loading: false });
      throw error;
    }
  },

  // ============================================
  // LESSONS ACTIONS
  // ============================================
  fetchLessons: async (unitId = null, lessonType = null) => {
    set({ loading: true, error: null });
    try {
      const data = await lessonsAPI.getAll(unitId, lessonType);
      set({ lessons: data.lessons, loading: false });
      return data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || "فشل في تحميل الدروس";
      set({ error: errorMsg, loading: false });
      throw error;
    }
  },

  fetchLessonById: async (lessonId) => {
    set({ loading: true, error: null });
    try {
      const data = await lessonsAPI.getById(lessonId);
      set({ currentLesson: data, loading: false });
      return data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || "فشل في تحميل الدرس";
      set({ error: errorMsg, loading: false });
      throw error;
    }
  },

  createLesson: async (lessonData) => {
    set({ loading: true, error: null });
    try {
      const data = await lessonsAPI.create(lessonData);
      set((state) => ({
        lessons: [...state.lessons, data.lesson],
        loading: false,
      }));
      return data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || "فشل في إنشاء الدرس";
      set({ error: errorMsg, loading: false });
      throw error;
    }
  },

  updateLesson: async (lessonId, lessonData) => {
    set({ loading: true, error: null });
    try {
      const data = await lessonsAPI.update(lessonId, lessonData);
      set((state) => ({
        lessons: state.lessons.map((lesson) =>
          lesson.id === lessonId ? data.lesson : lesson
        ),
        currentLesson:
          state.currentLesson?.id === lessonId
            ? data.lesson
            : state.currentLesson,
        loading: false,
      }));
      return data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || "فشل في تحديث الدرس";
      set({ error: errorMsg, loading: false });
      throw error;
    }
  },

  deleteLesson: async (lessonId) => {
    set({ loading: true, error: null });
    try {
      await lessonsAPI.delete(lessonId);
      set((state) => ({
        lessons: state.lessons.filter((lesson) => lesson.id !== lessonId),
        currentLesson:
          state.currentLesson?.id === lessonId ? null : state.currentLesson,
        loading: false,
      }));
    } catch (error) {
      const errorMsg = error.response?.data?.message || "فشل في حذف الدرس";
      set({ error: errorMsg, loading: false });
      throw error;
    }
  },

  // ============================================
  // UTILITY ACTIONS
  // ============================================
  clearError: () => set({ error: null }),
  clearCurrentLevel: () => set({ currentLevel: null }),
  clearCurrentUnit: () => set({ currentUnit: null }),
  clearCurrentLesson: () => set({ currentLesson: null }),
}));
