"use client";

import { useMemo, useState } from "react";
import { Slider } from "@/components/ui/Slider";
import { useT } from "@/lib/i18n/useT";
import { mulberry32, randNormal } from "@/lib/math/random";

/**
 * Visualizes a bivariate Normal:
 *   - SVG contour plot of f(x,y; μ₁, μ₂, σ₁, σ₂, ρ)
 *   - Marginal Normals along the top (x) and right (y) edges
 *   - Optional scatter from a fresh sample for tactile feedback
 *
 * The point of this visual is to feel how covariance and correlation
 * tilt and stretch the joint while the marginals stay one-dimensional.
 */

const W = 320;
const H = 320;
const PAD = 28;

export function JointDistributionExplorer() {
  const { locale } = useT();
  const [mu1, setMu1] = useState(0);
  const [mu2, setMu2] = useState(0);
  const [sigma1, setSigma1] = useState(1);
  const [sigma2, setSigma2] = useState(1);
  const [rho, setRho] = useState(0.6);
  const [showSample, setShowSample] = useState(true);
  const [seed, setSeed] = useState(7);

  const xLo = -4;
  const xHi = 4;
  const yLo = -4;
  const yHi = 4;
  const sx = (x: number) => PAD + ((x - xLo) / (xHi - xLo)) * (W - 2 * PAD);
  const sy = (y: number) => H - PAD - ((y - yLo) / (yHi - yLo)) * (H - 2 * PAD);

  // Bivariate Normal density.
  function bivariate(x: number, y: number) {
    const z1 = (x - mu1) / sigma1;
    const z2 = (y - mu2) / sigma2;
    const r2 = 1 - rho * rho;
    if (r2 <= 0) return 0;
    const exponent = -(z1 * z1 - 2 * rho * z1 * z2 + z2 * z2) / (2 * r2);
    return Math.exp(exponent) / (2 * Math.PI * sigma1 * sigma2 * Math.sqrt(r2));
  }

  // Build a small contour grid (low-res is fine for SVG).
  const contours = useMemo(() => {
    const N = 50;
    const dx = (xHi - xLo) / N;
    const dy = (yHi - yLo) / N;
    // Density at each grid point
    const grid: number[][] = [];
    let max = 0;
    for (let i = 0; i <= N; i++) {
      const row: number[] = [];
      for (let j = 0; j <= N; j++) {
        const x = xLo + i * dx;
        const y = yLo + j * dy;
        const v = bivariate(x, y);
        row.push(v);
        if (v > max) max = v;
      }
      grid.push(row);
    }
    // Marching squares for ~6 contour levels.
    const levels = [0.95, 0.85, 0.7, 0.5, 0.3, 0.15, 0.05].map((l) => l * max);
    type Seg = { x1: number; y1: number; x2: number; y2: number; level: number };
    const segs: Seg[] = [];
    function interp(a: number, b: number, va: number, vb: number, level: number) {
      if (Math.abs(vb - va) < 1e-12) return a;
      return a + ((level - va) / (vb - va)) * (b - a);
    }
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        const x0 = xLo + i * dx;
        const x1 = xLo + (i + 1) * dx;
        const y0 = yLo + j * dy;
        const y1 = yLo + (j + 1) * dy;
        const a = grid[i][j];
        const b = grid[i + 1][j];
        const c = grid[i + 1][j + 1];
        const d = grid[i][j + 1];
        for (const level of levels) {
          const code =
            ((a > level ? 1 : 0) << 0) |
            ((b > level ? 1 : 0) << 1) |
            ((c > level ? 1 : 0) << 2) |
            ((d > level ? 1 : 0) << 3);
          // Edge midpoints (linear interpolation)
          const eAB = { x: interp(x0, x1, a, b, level), y: y0 };
          const eBC = { x: x1, y: interp(y0, y1, b, c, level) };
          const eCD = { x: interp(x0, x1, d, c, level), y: y1 };
          const eDA = { x: x0, y: interp(y0, y1, a, d, level) };
          const push = (p1: { x: number; y: number }, p2: { x: number; y: number }) =>
            segs.push({ x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y, level });
          // Marching squares cases (no saddle resolution — fine for visual).
          switch (code) {
            case 0: case 15: break;
            case 1: case 14: push(eAB, eDA); break;
            case 2: case 13: push(eAB, eBC); break;
            case 3: case 12: push(eBC, eDA); break;
            case 4: case 11: push(eBC, eCD); break;
            case 5: push(eAB, eDA); push(eBC, eCD); break;
            case 6: case 9: push(eAB, eCD); break;
            case 7: case 8: push(eCD, eDA); break;
            case 10: push(eAB, eBC); push(eCD, eDA); break;
          }
        }
      }
    }
    return segs.map((s) => ({
      x1: sx(s.x1),
      y1: sy(s.y1),
      x2: sx(s.x2),
      y2: sy(s.y2),
      opacity: 0.25 + 0.55 * (s.level / max),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mu1, mu2, sigma1, sigma2, rho]);

  // Sample points to overlay
  const sample = useMemo(() => {
    if (!showSample) return [];
    const rng = mulberry32(seed);
    const out: { x: number; y: number }[] = [];
    for (let i = 0; i < 200; i++) {
      // Cholesky for 2D: y ~ N(mu, Σ) using two indep normals.
      const z1 = randNormal(0, 1, rng);
      const z2 = randNormal(0, 1, rng);
      const x = mu1 + sigma1 * z1;
      const y = mu2 + sigma2 * (rho * z1 + Math.sqrt(1 - rho * rho) * z2);
      out.push({ x, y });
    }
    return out;
  }, [mu1, mu2, sigma1, sigma2, rho, seed, showSample]);

  // 1-D marginal Normal curves along the top (x) and right (y) edges
  const marginalX = useMemo(() => {
    const pts: { x: number; y: number }[] = [];
    const N = 80;
    let max = 0;
    for (let i = 0; i <= N; i++) {
      const x = xLo + (i / N) * (xHi - xLo);
      const z = (x - mu1) / sigma1;
      const f = Math.exp(-0.5 * z * z) / (sigma1 * Math.sqrt(2 * Math.PI));
      pts.push({ x, y: f });
      if (f > max) max = f;
    }
    return pts.map((p) => ({
      sx: sx(p.x),
      sy: 6 + (1 - p.y / max) * (PAD - 8),
    }));
  }, [mu1, sigma1]);
  const marginalY = useMemo(() => {
    const pts: { x: number; y: number }[] = [];
    const N = 80;
    let max = 0;
    for (let i = 0; i <= N; i++) {
      const y = yLo + (i / N) * (yHi - yLo);
      const z = (y - mu2) / sigma2;
      const f = Math.exp(-0.5 * z * z) / (sigma2 * Math.sqrt(2 * Math.PI));
      pts.push({ x: y, y: f });
      if (f > max) max = f;
    }
    return pts.map((p) => ({
      sy: sy(p.x),
      sx: W - 6 - (1 - p.y / max) * (PAD - 8),
    }));
  }, [mu2, sigma2]);

  return (
    <div className="rounded-2xl border border-bg-border bg-bg-card/60 p-5">
      <div className="grid lg:grid-cols-[1fr_260px] gap-5">
        <div>
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
            {/* Frame */}
            <rect x={PAD} y={PAD} width={W - 2 * PAD} height={H - 2 * PAD} fill="#11172b" stroke="#222b46" />
            {/* Contours */}
            {contours.map((seg, i) => (
              <line
                key={i}
                x1={seg.x1}
                y1={seg.y1}
                x2={seg.x2}
                y2={seg.y2}
                stroke="#7c9cff"
                strokeOpacity={seg.opacity}
                strokeWidth={1.2}
              />
            ))}
            {/* Sample */}
            {showSample &&
              sample.map((p, i) => (
                <circle key={i} cx={sx(p.x)} cy={sy(p.y)} r={1.6} fill="#5fd0a4" fillOpacity={0.7} />
              ))}
            {/* Marginal X (top) */}
            <polyline
              fill="none"
              stroke="#ffc46b"
              strokeWidth={1.5}
              points={marginalX.map((p) => `${p.sx},${p.sy}`).join(" ")}
            />
            {/* Marginal Y (right) */}
            <polyline
              fill="none"
              stroke="#b08bff"
              strokeWidth={1.5}
              points={marginalY.map((p) => `${p.sx},${p.sy}`).join(" ")}
            />
            {/* Center */}
            <circle cx={sx(mu1)} cy={sy(mu2)} r={3} fill="#ffc46b" />
            {/* Axes labels */}
            <text x={W / 2} y={H - 6} textAnchor="middle" fill="#9aa4bf" fontSize={10}>
              x
            </text>
            <text x={6} y={H / 2} fill="#9aa4bf" fontSize={10}>
              y
            </text>
          </svg>
          <div className="mt-1 text-xs text-ink-muted">
            {locale === "zh"
              ? "藍色等高線是聯合密度，琥珀色和紫色曲線是兩條邊際分布，綠色是樣本。中心點是 (μ₁, μ₂)。"
              : "Blue contours = joint density, amber + violet curves = the two marginals, green dots = a fresh sample. Center dot = (μ₁, μ₂)."}
          </div>
        </div>
        <div className="space-y-4">
          <Slider label="μ₁" value={mu1} min={-3} max={3} step={0.1} onChange={setMu1} format={(v) => v.toFixed(2)} />
          <Slider label="μ₂" value={mu2} min={-3} max={3} step={0.1} onChange={setMu2} format={(v) => v.toFixed(2)} />
          <Slider label="σ₁" value={sigma1} min={0.3} max={3} step={0.05} onChange={setSigma1} format={(v) => v.toFixed(2)} />
          <Slider label="σ₂" value={sigma2} min={0.3} max={3} step={0.05} onChange={setSigma2} format={(v) => v.toFixed(2)} />
          <Slider label="ρ (correlation)" value={rho} min={-0.95} max={0.95} step={0.01} onChange={setRho} format={(v) => v.toFixed(2)} />
          <button
            onClick={() => setShowSample((v) => !v)}
            className="text-xs text-accent underline-offset-4 hover:underline"
          >
            {showSample
              ? locale === "zh"
                ? "隱藏樣本"
                : "Hide sample"
              : locale === "zh"
                ? "顯示樣本"
                : "Show sample"}
          </button>
          {showSample && (
            <button
              onClick={() => setSeed(Math.floor(Math.random() * 999) + 1)}
              className="block text-xs text-ink-dim hover:text-ink"
            >
              {locale === "zh" ? "重新抽樣" : "Re-sample"}
            </button>
          )}
          <div className="rounded-xl border border-bg-border bg-bg-soft p-3 text-xs font-mono space-y-1">
            <div className="text-ink-muted normal-case">
              {locale === "zh" ? "共變異矩陣 Σ" : "Covariance Σ"}
            </div>
            <div>
              [ {(sigma1 * sigma1).toFixed(2)}, {(rho * sigma1 * sigma2).toFixed(2)} ]
            </div>
            <div>
              [ {(rho * sigma1 * sigma2).toFixed(2)}, {(sigma2 * sigma2).toFixed(2)} ]
            </div>
            <div className="text-accent-amber mt-1">Cor = {rho.toFixed(2)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
