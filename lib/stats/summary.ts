// Summary statistics + small helpers used across simulators.

export function mean(xs: number[]): number {
  if (xs.length === 0) return NaN;
  let s = 0;
  for (const x of xs) s += x;
  return s / xs.length;
}

export function variance(xs: number[], unbiased = true): number {
  const n = xs.length;
  if (n < 2) return 0;
  const m = mean(xs);
  let s = 0;
  for (const x of xs) s += (x - m) * (x - m);
  return s / (unbiased ? n - 1 : n);
}

export function std(xs: number[], unbiased = true): number {
  return Math.sqrt(variance(xs, unbiased));
}

export function quantile(sorted: number[], q: number): number {
  if (sorted.length === 0) return NaN;
  const pos = (sorted.length - 1) * q;
  const lo = Math.floor(pos);
  const hi = Math.ceil(pos);
  if (lo === hi) return sorted[lo];
  const w = pos - lo;
  return sorted[lo] * (1 - w) + sorted[hi] * w;
}

/** Build a histogram and return {bin center, count, density} buckets. */
export function histogram(
  xs: number[],
  bins: number,
  range?: [number, number],
): { x: number; count: number; density: number }[] {
  if (xs.length === 0) return [];
  const lo = range ? range[0] : Math.min(...xs);
  const hi = range ? range[1] : Math.max(...xs);
  const w = (hi - lo) / bins || 1;
  const counts = new Array(bins).fill(0);
  for (const x of xs) {
    if (x < lo || x > hi) continue;
    let i = Math.floor((x - lo) / w);
    if (i >= bins) i = bins - 1;
    counts[i] += 1;
  }
  return counts.map((c, i) => ({
    x: lo + (i + 0.5) * w,
    count: c,
    density: c / (xs.length * w),
  }));
}

/** Linearly spaced points (inclusive). */
export function linspace(lo: number, hi: number, n: number): number[] {
  if (n <= 1) return [lo];
  const step = (hi - lo) / (n - 1);
  return Array.from({ length: n }, (_, i) => lo + i * step);
}
