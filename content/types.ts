import { ReactNode } from "react";
import type { QuizQuestion } from "@/components/learning/QuizCard";
import type { Misconception } from "@/components/learning/MisconceptionBox";

export type ChapterMeta = {
  slug: string;
  module: ModuleId;
  number: number;
  title: string;
  subtitle: string;
  /** ~1 sentence pitch for the roadmap card. */
  hook: string;
  /** Approximate study minutes (used to size cards). */
  minutes: number;
  /** Difficulty 1–5 (5 = graduate). */
  level: 1 | 2 | 3 | 4 | 5;
  prereqs?: string[];
  tags?: string[];
};

export type ChapterContent = {
  /** "Why this matters" — the elevator pitch. */
  whyItMatters: ReactNode;
  /** Three-layer view body parts. */
  intuition: ReactNode;
  formal: ReactNode;
  graduate: ReactNode;
  /** Worked examples + interactive blocks. */
  body: ReactNode;
  misconceptions: Misconception[];
  takeaways: string[];
  quiz: QuizQuestion[];
  furtherReading?: { title: string; href?: string; note?: string }[];
};

export type Chapter = {
  meta: ChapterMeta;
  content: ChapterContent;
};

export type ModuleId =
  | "A_basic_probability"
  | "B_random_variables"
  | "C_limit_theorems"
  | "D_inference"
  | "E_estimation"
  | "F_testing"
  | "G_regression"
  | "H_advanced";

export type ModuleInfo = {
  id: ModuleId;
  letter: string;
  title: string;
  blurb: string;
  color: "accent" | "green" | "amber" | "rose" | "violet";
};
