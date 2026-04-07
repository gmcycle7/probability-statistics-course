// Special functions used by PDFs/CDFs.
// All routines are pure, dependency-free, and tuned for chart-grade accuracy
// (not numerical-analysis grade — good to ~6 decimals).

/** Error function via Abramowitz & Stegun 7.1.26 (max error ≈ 1.5e-7). */
export function erf(x: number): number {
  const sign = x < 0 ? -1 : 1;
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  const ax = Math.abs(x);
  const t = 1.0 / (1.0 + p * ax);
  const y =
    1.0 -
    (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-ax * ax);
  return sign * y;
}

/** Inverse error function via Winitzki's approximation. */
export function erfInv(x: number): number {
  const a = 0.147;
  const ln = Math.log(1 - x * x);
  const term = 2 / (Math.PI * a) + ln / 2;
  const inside = term * term - ln / a;
  const sign = x < 0 ? -1 : 1;
  return sign * Math.sqrt(Math.sqrt(inside) - term);
}

/** log Γ via Lanczos approximation. */
export function logGamma(z: number): number {
  const g = 7;
  const c = [
    0.99999999999980993, 676.5203681218851, -1259.1392167224028,
    771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7,
  ];
  if (z < 0.5) {
    return (
      Math.log(Math.PI / Math.sin(Math.PI * z)) - logGamma(1 - z)
    );
  }
  z -= 1;
  let x = c[0];
  for (let i = 1; i < g + 2; i++) x += c[i] / (z + i);
  const t = z + g + 0.5;
  return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(x);
}

export function gamma(z: number): number {
  return Math.exp(logGamma(z));
}

/** log of binomial coefficient C(n,k). */
export function logBinom(n: number, k: number): number {
  if (k < 0 || k > n) return -Infinity;
  return logGamma(n + 1) - logGamma(k + 1) - logGamma(n - k + 1);
}

/** log of factorial. */
export function logFact(n: number): number {
  return logGamma(n + 1);
}
