"use client";

import { useMemo, useState } from "react";
import { Slider } from "@/components/ui/Slider";
import { Button } from "@/components/ui/Button";
import { useT } from "@/lib/i18n/useT";
import { mulberry32, randNormal } from "@/lib/math/random";

/**
 * Visualises PCA on a 2D point cloud the user controls via covariance.
 *  - Generates n points from N((0,0), Σ) with chosen σ₁, σ₂, ρ
 *  - Computes the SVD/eigendecomposition of the empirical covariance
 *  - Draws PC1 and PC2 axes scaled by sqrt(eigenvalue)
 *  - Optionally projects each point onto PC1 (drops a perpendicular)
 *
 * The whole point of the visual: PCA finds the orthogonal directions of
 * maximum variance, which are exactly the eigenvectors of the (sample)
 * covariance matrix sorted by eigenvalue.
 */

const W = 360;
const H = 320;
const PAD = 24;

function eigen2x2(C: [[number, number], [number, number]]) {
  // Returns eigenvalues and unit eigenvectors of a symmetric 2x2 matrix.
  const [[a, b], [, d]] = C;
  const tr = a + d;
  const det = a * d - b * b;
  const disc = Math.sqrt(Math.max(0, (tr * tr) / 4 - det));
  const lam1 = tr / 2 + disc;
  const lam2 = tr / 2 - disc;
  // eigenvector for lam1
  let v1: [number, number];
  if (Math.abs(b) > 1e-9) {
    v1 = [lam1 - d, b];
  } else {
    v1 = a >= d ? [1, 0] : [0, 1];
  }
  const n1 = Math.hypot(v1[0], v1[1]) || 1;
  v1 = [v1[0] / n1, v1[1] / n1];
  const v2: [number, number] = [-v1[1], v1[0]];
  return { lam1, lam2, v1, v2 };
}

export function PCAVisualizer() {
  const { locale } = useT();
  const [sigma1, setSigma1] = useState(2);
  const [sigma2, setSigma2] = useState(0.7);
  const [rho, setRho] = useState(0.6);
  const [n, setN] = useState(200);
  const [seed, setSeed] = useState(7);
  const [showProj, setShowProj] = useState(true);

  // Sample points + sample covariance + eigendecomposition
  const { points, eig, sampleCov } = useMemo(() => {
    const rng = mulberry32(seed);
    const pts: [number, number][] = [];
    for (let i = 0; i < n; i++) {
      const z1 = randNormal(0, 1, rng);
      const z2 = randNormal(0, 1, rng);
      const x = sigma1 * z1;
      const y = sigma2 * (rho * z1 + Math.sqrt(1 - rho * rho) * z2);
      pts.push([x, y]);
    }
    // Sample covariance (n divisor — fine for visual)
    let m1 = 0;
    let m2 = 0;
    for (const p of pts) {
      m1 += p[0];
      m2 += p[1];
    }
    m1 /= n;
    m2 /= n;
    let s11 = 0;
    let s22 = 0;
    let s12 = 0;
    for (const p of pts) {
      s11 += (p[0] - m1) ** 2;
      s22 += (p[1] - m2) ** 2;
      s12 += (p[0] - m1) * (p[1] - m2);
    }
    const cov: [[number, number], [number, number]] = [
      [s11 / n, s12 / n],
      [s12 / n, s22 / n],
    ];
    return { points: pts, eig: eigen2x2(cov), sampleCov: cov };
  }, [sigma1, sigma2, rho, n, seed]);

  // Mapping from data space to SVG space
  const span = 4 * Math.max(sigma1, sigma2);
  const sx = (x: number) => PAD + ((x + span) / (2 * span)) * (W - 2 * PAD);
  const sy = (y: number) => H - PAD - ((y + span) / (2 * span)) * (H - 2 * PAD);

  // Axis line endpoints (length proportional to sqrt(eigenvalue))
  const scale = 2.2;
  const pc1End = [eig.v1[0] * Math.sqrt(eig.lam1) * scale, eig.v1[1] * Math.sqrt(eig.lam1) * scale];
  const pc1Start = [-pc1End[0], -pc1End[1]];
  const pc2End = [eig.v2[0] * Math.sqrt(eig.lam2) * scale, eig.v2[1] * Math.sqrt(eig.lam2) * scale];
  const pc2Start = [-pc2End[0], -pc2End[1]];

  return (
    <div className="rounded-2xl border border-bg-border bg-bg-card/60 p-5">
      <div className="grid lg:grid-cols-[1fr_260px] gap-5">
        <div>
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
            <rect x={PAD} y={PAD} width={W - 2 * PAD} height={H - 2 * PAD} fill="#11172b" stroke="#222b46" />
            {/* Origin axes */}
            <line x1={PAD} y1={sy(0)} x2={W - PAD} y2={sy(0)} stroke="#222b46" />
            <line x1={sx(0)} y1={PAD} x2={sx(0)} y2={H - PAD} stroke="#222b46" />
            {/* Projection lines onto PC1 */}
            {showProj &&
              points.map((p, i) => {
                // Projection scalar onto PC1
                const t = p[0] * eig.v1[0] + p[1] * eig.v1[1];
                const proj = [t * eig.v1[0], t * eig.v1[1]];
                return (
                  <line
                    key={"pl" + i}
                    x1={sx(p[0])}
                    y1={sy(p[1])}
                    x2={sx(proj[0])}
                    y2={sy(proj[1])}
                    stroke="#9aa4bf"
                    strokeOpacity={0.18}
                    strokeWidth={0.7}
                  />
                );
              })}
            {/* Points */}
            {points.map((p, i) => (
              <circle key={i} cx={sx(p[0])} cy={sy(p[1])} r={1.6} fill="#7c9cff" fillOpacity={0.7} />
            ))}
            {/* Projected points on PC1 */}
            {showProj &&
              points.map((p, i) => {
                const t = p[0] * eig.v1[0] + p[1] * eig.v1[1];
                return (
                  <circle
                    key={"pp" + i}
                    cx={sx(t * eig.v1[0])}
                    cy={sy(t * eig.v1[1])}
                    r={1.5}
                    fill="#5fd0a4"
                  />
                );
              })}
            {/* PC1 axis */}
            <line
              x1={sx(pc1Start[0])}
              y1={sy(pc1Start[1])}
              x2={sx(pc1End[0])}
              y2={sy(pc1End[1])}
              stroke="#ffc46b"
              strokeWidth={2}
            />
            {/* PC2 axis */}
            <line
              x1={sx(pc2Start[0])}
              y1={sy(pc2Start[1])}
              x2={sx(pc2End[0])}
              y2={sy(pc2End[1])}
              stroke="#b08bff"
              strokeWidth={2}
            />
            {/* Labels */}
            <text x={sx(pc1End[0]) + 4} y={sy(pc1End[1])} fill="#ffc46b" fontSize={11}>
              PC1
            </text>
            <text x={sx(pc2End[0]) + 4} y={sy(pc2End[1])} fill="#b08bff" fontSize={11}>
              PC2
            </text>
          </svg>
          <div className="mt-1 text-xs text-ink-muted">
            {locale === "zh"
              ? "藍點是資料；琥珀軸是 PC1（最大變異方向），紫軸是 PC2（垂直於 PC1 的剩餘變異方向）。綠點是把藍點正交投影到 PC1 上的結果。"
              : "Blue dots are data; amber axis is PC1 (max-variance direction), violet is PC2 (orthogonal residual). Green dots are the projections of the blue dots onto PC1."}
          </div>
        </div>
        <div className="space-y-4">
          <Slider label="σ₁" value={sigma1} min={0.3} max={4} step={0.05} onChange={setSigma1} format={(v) => v.toFixed(2)} />
          <Slider label="σ₂" value={sigma2} min={0.1} max={4} step={0.05} onChange={setSigma2} format={(v) => v.toFixed(2)} />
          <Slider label="ρ" value={rho} min={-0.95} max={0.95} step={0.01} onChange={setRho} format={(v) => v.toFixed(2)} />
          <Slider label={locale === "zh" ? "n（樣本數）" : "n (sample size)"} value={n} min={20} max={1000} step={10} onChange={setN} />
          <Button variant="subtle" size="sm" onClick={() => setSeed(Math.floor(Math.random() * 999) + 1)}>
            {locale === "zh" ? "重新抽樣" : "Re-sample"}
          </Button>
          <button
            onClick={() => setShowProj((v) => !v)}
            className="block text-xs text-accent hover:underline"
          >
            {showProj
              ? locale === "zh" ? "隱藏投影" : "Hide projections"
              : locale === "zh" ? "顯示投影" : "Show projections"}
          </button>
          <div className="rounded-xl border border-bg-border bg-bg-soft p-3 text-xs font-mono space-y-1">
            <div className="text-ink-muted normal-case">
              {locale === "zh" ? "樣本共變異矩陣 Σ̂" : "Sample covariance Σ̂"}
            </div>
            <div>
              [ {sampleCov[0][0].toFixed(2)}, {sampleCov[0][1].toFixed(2)} ]
            </div>
            <div>
              [ {sampleCov[1][0].toFixed(2)}, {sampleCov[1][1].toFixed(2)} ]
            </div>
            <div className="mt-2 text-ink-muted normal-case">
              {locale === "zh" ? "特徵值" : "eigenvalues"}
            </div>
            <div className="text-accent-amber">λ₁ = {eig.lam1.toFixed(3)}</div>
            <div className="text-accent-violet">λ₂ = {eig.lam2.toFixed(3)}</div>
            <div className="text-ink-dim mt-1">
              {locale === "zh" ? "PC1 解釋變異" : "PC1 explained var"}{" "}
              <span className="text-accent">
                {((eig.lam1 / (eig.lam1 + eig.lam2)) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
