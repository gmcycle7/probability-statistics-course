"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Locale = "zh" | "en";

type LocaleState = {
  locale: Locale;
  setLocale: (l: Locale) => void;
};

export const useLocale = create<LocaleState>()(
  persist(
    (set) => ({
      locale: "zh", // default to Chinese
      setLocale: (l) => set({ locale: l }),
    }),
    { name: "prob-stats-locale" },
  ),
);
