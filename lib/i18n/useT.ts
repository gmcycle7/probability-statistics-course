"use client";

import { useLocale } from "./locale";
import { tArray, tString, type StringKey } from "./strings";

/** UI string translation hook. */
export function useT() {
  const locale = useLocale((s) => s.locale);
  const t = (key: StringKey) => tString(key, locale);
  const tA = (key: StringKey) => tArray(key, locale);
  return { t, tA, locale };
}

/** Pick a localized value from a `{ zh, en }` map (or fall back to en). */
export function useL<T>(values: { zh: T; en: T }): T {
  const locale = useLocale((s) => s.locale);
  return values[locale] ?? values.en;
}
