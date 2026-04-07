"use client";

import { useMemo, useState } from "react";
import { Slider } from "@/components/ui/Slider";
import { Button } from "@/components/ui/Button";
import { useT } from "@/lib/i18n/useT";
import { mulberry32, randNormal } from "@/lib/math/random";

/**
 * Correlation heatmap simulator. Generates p correlated Normal variables
 * via a Cholesky factorisation of a tunable AR(1)-style covariance matrix:
 *   Σ_{ij} = ρ^|i-j| · σ²
 * Then computes the empirical correlation matrix from n samples and renders
 * it as a colour heatmap.
 *
 * Slide ρ from -1 to 1 and watch the off-diagonals shift.
 */

function cholesky(M: number[][]): number[][] {
  const n = M.length;
  const L: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= i; j++) {
      let s = 0;
      for (let k = 0; k < j; k++) s += L[i][k] * L[j][k];
      if (i === j) {
        L[i][j] = Math.sqrt(Math.max(0, M[i][i] - s));
      } else {
        L[i][j] = (M[i][j] - s) / (L[j][j] || 1e-12);
      }
    }
  }
  return L;
}

function colorFor(c: number): string {
  // Diverging blue → white → rose. c in [-1, 1].
  const t = (c + 1) / 2;
  if (c >= 0) {
    const w = c;
    const r = Math.round(124 + (255 - 124) * (1 - w));
    const g = Math.round(156 + (122 - 156) * (1 - w));
    const b = Math.round(255 + (154 - 255) * (1 - w));
    return `rgb(${r}, ${g}, ${b})`;
  } else {
    const w = -c;
    const r = Math.round(124 + (95 - 124) * w);
    const g = Math.round(156 + (208 - 156) * w);
    const b = Math.round(255 + (164 - 255) * w);
    return `rgb(${r}, ${g}, ${b})`;
  }
}

export function CorrelationHeatmap() {
  const { locale } = useT();
  const [p, setP] = useState(8);
  const [n, setN] = useState(200);
  const [rho, setRho] = useState(0.6);
  const [seed, setSeed] = useState(7);

  const matrix = useMemo(() => {
    const rng = mulberry32(seed);
    // True covariance: AR(1)-style, ρ^|i-j|
    const Sigma: number[][] = Array.from({ length: p }, (_, i) =>
      Array.from({ length: p }, (_, j) => Math.pow(rho, Math.abs(i - j))),
    );
    const L = cholesky(Sigma);
    // Sample n p-dimensional vectors
    const samples: number[][] = [];
    for (let s = 0; s < n; s++) {
      const z = Array.from({ length: p }, () => randNormal(0, 1, rng));
      const x = new Array(p).fill(0);
      for (let i = 0; i < p; i++) for (let j = 0; j <= i; j++) x[i] += L[i][j] * z[j];
      samples.push(x);
    }
    // Empirical correlation matrix
    const means = new Array(p).fill(0);
    for (const s of samples) for (let i = 0; i < p; i++) means[i] += s[i];
    for (let i = 0; i < p; i++) means[i] /= n;
    const cov: number[][] = Array.from({ length: p }, () => new Array(p).fill(0));
    for (const s of samples) {
      for (let i = 0; i < p; i++) {
        for (let j = 0; j < p; j++) {
          cov[i][j] += (s[i] - means[i]) * (s[j] - means[j]);
        }
      }
    }
    for (let i = 0; i < p; i++) for (let j = 0; j < p; j++) cov[i][j] /= n;
    const sds = Array.from({ length: p }, (_, i) => Math.sqrt(cov[i][i]));
    const corr: number[][] = Array.from({ length: p }, () => new Array(p).fill(0));
    for (let i = 0; i < p; i++) for (let j = 0; j < p; j++) corr[i][j] = cov[i][j] / (sds[i] * sds[j] + 1e-12);
    return corr;
  }, [p, n, rho, seed]);

  const cell = 36;

  return (
    <div className="rounded-2xl border border-bg-border bg-bg-card/60 p-5">
      <div className="grid lg:grid-cols-[1fr_260px] gap-5">
        <div>
          <svg viewBox={`0 0 ${p * cell + 24} ${p * cell + 24}`} className="w-full h-auto max-w-md">
            {Array.from({ length: p }).map((_, i) =>
              Array.from({ length: p }).map((_, j) => (
                <g key={`${i}-${j}`}>
                  <rect x={12 + j * cell} y={12 + i * cell} width={cell - 1} height={cell - 1} fill={colorFor(matrix[i][j])} />
                  <text
                    x={12 + j * cell + cell / 2}
                    y={12 + i * cell + cell / 2 + 3}
                    textAnchor="middle"
                    fontSize={9}
                    fill={Math.abs(matrix[i][j]) > 0.5 ? "#0b1020" : "#0b1020"}
                    fontFamily="monospace"
                  >
                    {matrix[i][j].toFixed(2)}
                  </text>
                </g>
              )),
            )}
          </svg>
          <div className="mt-2 text-xs text-ink-dim leading-relaxed">
            {locale === "zh"
              ? "藍 = 強正相關，玫紅 = 強負相關，淡色 = 弱相關。對角線永遠是 1。AR(1) 結構讓相鄰變數高度相關，遠的變數弱相關。"
              : "Blue = strongly positive, rose = strongly negative, pale = weak. Diagonal is always 1. AR(1) structure makes adjacent variables highly correlated and distant variables weakly so."}
          </div>
        </div>
        <div className="space-y-4">
          <Slider label={locale === "zh" ? "p（變數數）" : "p (number of variables)"} value={p} min={3} max={12} step={1} onChange={setP} />
          <Slider label={locale === "zh" ? "n（樣本數）" : "n (sample size)"} value={n} min={20} max={2000} step={10} onChange={setN} />
          <Slider label="ρ (AR(1))" value={rho} min={-0.95} max={0.95} step={0.01} onChange={setRho} format={(v) => v.toFixed(2)} />
          <Button variant="subtle" size="sm" onClick={() => setSeed(Math.floor(Math.random() * 999) + 1)}>
            {locale === "zh" ? "重新抽" : "Re-sample"}
          </Button>
          <div className="text-[10px] text-ink-muted leading-relaxed">
            {locale === "zh"
              ? "真實 Σ 是 AR(1)：Σᵢⱼ = ρ^|i-j|。減小 n 看樣本相關矩陣的雜訊；增大 n 看它收斂到真實結構。"
              : "True Σ is AR(1): Σᵢⱼ = ρ^|i-j|. Shrink n to see sampling noise in the empirical correlation; grow n to see it converge to the true structure."}
          </div>
        </div>
      </div>
    </div>
  );
}
