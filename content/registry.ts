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
import ch11 from "./chapters/11-method-of-moments";
import ch12 from "./chapters/07-confidence-intervals";
import ch13 from "./chapters/13-bootstrap";
import ch14 from "./chapters/08-hypothesis-testing";
import ch15 from "./chapters/15-specific-tests";
import ch16 from "./chapters/16-likelihood-ratio-test";
import ch17 from "./chapters/17-multiple-comparisons";
import ch18 from "./chapters/09-linear-regression";
import ch19 from "./chapters/19-overfitting";
import ch20 from "./chapters/20-causation";
import ch21 from "./chapters/10-bayesian-inference";
import ch22 from "./chapters/15-markov-chains";
import ch23 from "./chapters/16-pca";

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
  ch17,
  ch18,
  ch19,
  ch20,
  ch21,
  ch22,
  ch23,
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
