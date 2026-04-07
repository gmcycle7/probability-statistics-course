import type { Chapter } from "./types";
import ch1 from "./chapters/01-conditional-bayes";
import ch2 from "./chapters/02-random-variables";
import ch3 from "./chapters/03-distributions";
import ch4 from "./chapters/04-lln";
import ch5 from "./chapters/05-clt";
import ch6 from "./chapters/06-mle";
import ch7 from "./chapters/07-confidence-intervals";
import ch8 from "./chapters/08-hypothesis-testing";
import ch9 from "./chapters/09-linear-regression";
import ch10 from "./chapters/10-bayesian-inference";

export const CHAPTERS: Chapter[] = [ch1, ch2, ch3, ch4, ch5, ch6, ch7, ch8, ch9, ch10];

export function getChapterBySlug(slug: string): Chapter | undefined {
  return CHAPTERS.find((c) => c.meta.slug === slug);
}

/**
 * Returns just the slugs of the previous and next chapters.
 * Titles are looked up in the active locale by the renderer.
 */
export function getNeighbors(slug: string): {
  prev?: { slug: string };
  next?: { slug: string };
} {
  const idx = CHAPTERS.findIndex((c) => c.meta.slug === slug);
  if (idx < 0) return {};
  return {
    prev: idx > 0 ? { slug: CHAPTERS[idx - 1].meta.slug } : undefined,
    next:
      idx < CHAPTERS.length - 1
        ? { slug: CHAPTERS[idx + 1].meta.slug }
        : undefined,
  };
}
