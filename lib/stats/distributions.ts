// Closed-form PMF/PDF/CDFs for the distributions we visualize.
// These are written for clarity, not maximum numerical precision.

import { erf, logBinom, logFact, logGamma } from "@/lib/math/special";

// ---------- Normal (μ, σ²) ----------
export const normal = {
  pdf(x: number, mu = 0, sigma = 1): number {
    const z = (x - mu) / sigma;
    return Math.exp(-0.5 * z * z) / (sigma * Math.sqrt(2 * Math.PI));
  },
  cdf(x: number, mu = 0, sigma = 1): number {
    return 0.5 * (1 + erf((x - mu) / (sigma * Math.SQRT2)));
  },
  /** Inverse CDF using Beasley–Springer–Moro. */
  quantile(p: number, mu = 0, sigma = 1): number {
    if (p <= 0) return -Infinity;
    if (p >= 1) return Infinity;
    const a = [
      -3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2,
      1.38357751867269e2, -3.066479806614716e1, 2.506628277459239,
    ];
    const b = [
      -5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2,
      6.680131188771972e1, -1.328068155288572e1,
    ];
    const c = [
      -7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838,
      -2.549732539343734, 4.374664141464968, 2.938163982698783,
    ];
    const d = [
      7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996,
      3.754408661907416,
    ];
    const pl = 0.02425;
    const ph = 1 - pl;
    let q;
    let r;
    let z;
    if (p < pl) {
      q = Math.sqrt(-2 * Math.log(p));
      z =
        (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
        ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
    } else if (p <= ph) {
      q = p - 0.5;
      r = q * q;
      z =
        ((((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) *
          q) /
        (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
    } else {
      q = Math.sqrt(-2 * Math.log(1 - p));
      z =
        -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
        ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
    }
    return mu + sigma * z;
  },
};

// ---------- Bernoulli / Binomial ----------
export const binomial = {
  pmf(k: number, n: number, p: number): number {
    if (k < 0 || k > n || !Number.isInteger(k)) return 0;
    return Math.exp(logBinom(n, k) + k * Math.log(p) + (n - k) * Math.log(1 - p));
  },
  cdf(k: number, n: number, p: number): number {
    let s = 0;
    const upper = Math.min(n, Math.floor(k));
    for (let i = 0; i <= upper; i++) s += binomial.pmf(i, n, p);
    return s;
  },
  mean: (n: number, p: number) => n * p,
  variance: (n: number, p: number) => n * p * (1 - p),
};

// ---------- Poisson ----------
export const poisson = {
  pmf(k: number, lambda: number): number {
    if (k < 0 || !Number.isInteger(k)) return 0;
    return Math.exp(-lambda + k * Math.log(lambda) - logFact(k));
  },
  cdf(k: number, lambda: number): number {
    let s = 0;
    for (let i = 0; i <= Math.floor(k); i++) s += poisson.pmf(i, lambda);
    return s;
  },
};

// ---------- Geometric (k = 1, 2, …) ----------
export const geometric = {
  pmf(k: number, p: number): number {
    if (k < 1 || !Number.isInteger(k)) return 0;
    return Math.pow(1 - p, k - 1) * p;
  },
  cdf(k: number, p: number): number {
    if (k < 1) return 0;
    return 1 - Math.pow(1 - p, Math.floor(k));
  },
};

// ---------- Exponential (rate λ) ----------
export const exponential = {
  pdf(x: number, rate: number): number {
    return x < 0 ? 0 : rate * Math.exp(-rate * x);
  },
  cdf(x: number, rate: number): number {
    return x < 0 ? 0 : 1 - Math.exp(-rate * x);
  },
};

// ---------- Uniform[a,b] ----------
export const uniform = {
  pdf(x: number, a: number, b: number): number {
    return x < a || x > b ? 0 : 1 / (b - a);
  },
  cdf(x: number, a: number, b: number): number {
    if (x < a) return 0;
    if (x > b) return 1;
    return (x - a) / (b - a);
  },
};

// ---------- Beta(α, β) ----------
export const beta = {
  pdf(x: number, a: number, b: number): number {
    if (x <= 0 || x >= 1) return 0;
    const logB = logGamma(a) + logGamma(b) - logGamma(a + b);
    return Math.exp((a - 1) * Math.log(x) + (b - 1) * Math.log(1 - x) - logB);
  },
};

// ---------- Student-t (ν degrees of freedom) ----------
export const studentT = {
  pdf(x: number, df: number): number {
    const num = logGamma((df + 1) / 2);
    const den = 0.5 * Math.log(df * Math.PI) + logGamma(df / 2);
    const log = num - den - ((df + 1) / 2) * Math.log(1 + (x * x) / df);
    return Math.exp(log);
  },
};
