import type { Chapter } from "./types";
import ch1 from "./chapters/01-conditional-bayes";
import ch2 from "./chapters/02-random-variables";
import ch3 from "./chapters/03-distributions";
import ch4 from "./chapters/04-joint-distributions";
import ch5 from "./chapters/04-lln";
import ch6 from "./chapters/05-clt";
import ch7 from "./chapters/06-estimators";
import ch8 from "./chapters/07-sampling-distributions";
import ch9 from "./chapters/08-sufficiency-efficiency";
import ch10 from "./chapters/06-mle";
import ch11 from "./chapters/07-confidence-intervals";
import ch12 from "./chapters/08-hypothesis-testing";
import ch13 from "./chapters/09-linear-regression";
import ch14 from "./chapters/10-bayesian-inference";
import ch15 from "./chapters/15-markov-chains";
import ch16 from "./chapters/16-pca";

export const CHAPTERS: Chapter[] = [
  ch1,
  ch2,
  ch3,
  ch4,
  ch5,
  ch6,
  ch7,
  ch8,
  ch9,
  ch10,
  ch11,
  ch12,
  ch13,
  ch14,
  ch15,
  ch16,
];

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
