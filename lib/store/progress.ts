"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type ProgressState = {
  completedChapters: Record<string, boolean>;
  quizScores: Record<string, { correct: number; total: number; updatedAt: number }>;
  bookmarks: string[];
  notes: Record<string, string>;
  lastChapter?: string;

  toggleChapter: (slug: string) => void;
  recordQuiz: (chapter: string, correct: number, total: number) => void;
  toggleBookmark: (slug: string) => void;
  setNote: (slug: string, text: string) => void;
  setLastChapter: (slug: string) => void;
  reset: () => void;
};

export const useProgress = create<ProgressState>()(
  persist(
    (set) => ({
      completedChapters: {},
      quizScores: {},
      bookmarks: [],
      notes: {},
      lastChapter: undefined,

      toggleChapter: (slug) =>
        set((s) => ({
          completedChapters: {
            ...s.completedChapters,
            [slug]: !s.completedChapters[slug],
          },
        })),

      recordQuiz: (chapter, correct, total) =>
        set((s) => ({
          quizScores: {
            ...s.quizScores,
            [chapter]: { correct, total, updatedAt: Date.now() },
          },
        })),

      toggleBookmark: (slug) =>
        set((s) => ({
          bookmarks: s.bookmarks.includes(slug)
            ? s.bookmarks.filter((x) => x !== slug)
            : [...s.bookmarks, slug],
        })),

      setNote: (slug, text) =>
        set((s) => ({ notes: { ...s.notes, [slug]: text } })),

      setLastChapter: (slug) => set({ lastChapter: slug }),

      reset: () =>
        set({
          completedChapters: {},
          quizScores: {},
          bookmarks: [],
          notes: {},
          lastChapter: undefined,
        }),
    }),
    { name: "prob-stats-progress" },
  ),
);
