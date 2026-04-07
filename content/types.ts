import { ReactNode } from "react";
import type { QuizQuestion } from "@/components/learning/QuizCard";
import type { Misconception } from "@/components/learning/MisconceptionBox";

/** A value that exists in both languages. */
export type Localized<T> = { en: T; zh: T };

/** Locale-independent metadata. */
export type ChapterMeta = {
  slug: string;
  module: ModuleId;
  number: number;
  /** Approximate study minutes (used to size cards). */
  minutes: number;
  /** Difficulty 1–5 (5 = graduate). */
  level: 1 | 2 | 3 | 4 | 5;
  prereqs?: string[];
  tags?: string[];
};

/** The locale-specific payload of a chapter. */
export type ChapterPayload = {
  title: string;
  subtitle: string;
  /** ~1 sentence pitch for the roadmap card. */
  hook: string;

  whyItMatters: ReactNode;
  intuition: ReactNode;
  formal: ReactNode;
  graduate: ReactNode;
  body: ReactNode;
  misconceptions: Misconception[];
  takeaways: string[];
  quiz: QuizQuestion[];
  furtherReading?: { title: string; href?: string; note?: string }[];
};

export type Chapter = {
  meta: ChapterMeta;
  localized: Localized<ChapterPayload>;
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
  title: Localized<string>;
  blurb: Localized<string>;
  color: "accent" | "green" | "amber" | "rose" | "violet";
};
