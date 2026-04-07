// Deterministic + ad-hoc random number generation utilities.
// We use mulberry32 for reproducible demos and Math.random for live ones.

export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Standard normal via Box–Muller. */
export function randn(rng: () => number = Math.random): number {
  let u = 0;
  let v = 0;
  while (u === 0) u = rng();
  while (v === 0) v = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

export function randNormal(
  mu = 0,
  sigma = 1,
  rng: () => number = Math.random,
): number {
  return mu + sigma * randn(rng);
}

export function randUniform(
  a = 0,
  b = 1,
  rng: () => number = Math.random,
): number {
  return a + (b - a) * rng();
}

export function randExponential(
  rate = 1,
  rng: () => number = Math.random,
): number {
  return -Math.log(1 - rng()) / rate;
}

export function randBernoulli(p: number, rng: () => number = Math.random): 0 | 1 {
  return rng() < p ? 1 : 0;
}

export function randBinomial(
  n: number,
  p: number,
  rng: () => number = Math.random,
): number {
  // O(n) — fine for n up to a few thousand in demos.
  let s = 0;
  for (let i = 0; i < n; i++) s += randBernoulli(p, rng);
  return s;
}

export function randPoisson(lambda: number, rng: () => number = Math.random): number {
  // Knuth's algorithm — fine for moderate λ.
  if (lambda < 30) {
    const L = Math.exp(-lambda);
    let k = 0;
    let p = 1;
    do {
      k += 1;
      p *= rng();
    } while (p > L);
    return k - 1;
  }
  // Normal approximation for large λ
  return Math.max(0, Math.round(randNormal(lambda, Math.sqrt(lambda), rng)));
}

export function randGeometric(p: number, rng: () => number = Math.random): number {
  return Math.ceil(Math.log(1 - rng()) / Math.log(1 - p));
}

/** Sample n values from `sampler`. */
export function sampleN<T>(n: number, sampler: () => T): T[] {
  const out = new Array<T>(n);
  for (let i = 0; i < n; i++) out[i] = sampler();
  return out;
}
