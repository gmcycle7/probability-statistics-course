"use client";

import { useMemo, useState } from "react";
import {
  ComposedChart,
  Scatter,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Slider } from "@/components/ui/Slider";
import { Button } from "@/components/ui/Button";
import { useT } from "@/lib/i18n/useT";
import { mulberry32, randNormal, randUniform } from "@/lib/math/random";

/**
 * Polynomial fit overfitting demo.
 *  - Generates n training points from a fixed truth function f(x) + noise
 *  - Fits a polynomial of degree d via the closed-form normal equations
 *  - Shows the fit, train MSE, test MSE
 *  - User controls d, n, noise sigma
 *
 * As d grows, train MSE keeps falling but test MSE eventually rises ─
 * the U-shaped bias-variance trade-off.
 */

const TRUTH = (x: number) => Math.sin(2 * x) + 0.5 * x;
const X_LO = -2;
const X_HI = 2;

// Vandermonde + normal equations: solves a least-squares polynomial fit.
function fitPolynomial(xs: number[], ys: number[], degree: number): number[] {
  const n = xs.length;
  const p = degree + 1;
  // Build X (n x p) and y
  const X: number[][] = xs.map((x) => {
    const row = new Array(p);
    let v = 1;
    for (let j = 0; j < p; j++) {
      row[j] = v;
      v *= x;
    }
    return row;
  });
  // Compute X^T X (p x p) and X^T y (p)
  const XtX: number[][] = Array.from({ length: p }, () => new Array(p).fill(0));
  const Xty: number[] = new Array(p).fill(0);
  for (let i = 0; i < n; i++) {
    for (let a = 0; a < p; a++) {
      Xty[a] += X[i][a] * ys[i];
      for (let b = 0; b < p; b++) {
        XtX[a][b] += X[i][a] * X[i][b];
      }
    }
  }
  // Solve via Gaussian elimination
  return gaussianSolve(XtX, Xty);
}

function gaussianSolve(A: number[][], b: number[]): number[] {
  const n = A.length;
  const M: number[][] = A.map((row, i) => [...row, b[i]]);
  for (let i = 0; i < n; i++) {
    // Pivot
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(M[k][i]) > Math.abs(M[maxRow][i])) maxRow = k;
    }
    [M[i], M[maxRow]] = [M[maxRow], M[i]];
    // Eliminate
    for (let k = i + 1; k < n; k++) {
      const factor = M[k][i] / (M[i][i] || 1e-12);
      for (let j = i; j <= n; j++) M[k][j] -= factor * M[i][j];
    }
  }
  // Back-substitute
  const x = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    let s = M[i][n];
    for (let j = i + 1; j < n; j++) s -= M[i][j] * x[j];
    x[i] = s / (M[i][i] || 1e-12);
  }
  return x;
}

function evalPoly(coeffs: number[], x: number): number {
  let v = 0;
  let p = 1;
  for (const c of coeffs) {
    v += c * p;
    p *= x;
  }
  return v;
}

export function OverfittingExplorer() {
  const { locale } = useT();
  const [degree, setDegree] = useState(3);
  const [n, setN] = useState(20);
  const [noise, setNoise] = useState(0.4);
  const [seed, setSeed] = useState(7);

  const data = useMemo(() => {
    const rng = mulberry32(seed);
    // Train and held-out test sets
    const xsTrain = Array.from({ length: n }, () => randUniform(X_LO, X_HI, rng));
    const ysTrain = xsTrain.map((x) => TRUTH(x) + randNormal(0, noise, rng));
    const xsTest = Array.from({ length: 200 }, () => randUniform(X_LO, X_HI, rng));
    const ysTest = xsTest.map((x) => TRUTH(x) + randNormal(0, noise, rng));
    // Fit
    const coeffs = fitPolynomial(xsTrain, ysTrain, Math.min(degree, n - 1));
    // Train MSE
    let trainMSE = 0;
    for (let i = 0; i < n; i++) {
      const e = ysTrain[i] - evalPoly(coeffs, xsTrain[i]);
      trainMSE += e * e;
    }
    trainMSE /= n;
    // Test MSE
    let testMSE = 0;
    for (let i = 0; i < xsTest.length; i++) {
      const e = ysTest[i] - evalPoly(coeffs, xsTest[i]);
      testMSE += e * e;
    }
    testMSE /= xsTest.length;
    // Curves for plotting
    const grid: { x: number; truth: number; fit: number }[] = [];
    for (let i = 0; i <= 100; i++) {
      const x = X_LO + ((X_HI - X_LO) * i) / 100;
      grid.push({ x, truth: TRUTH(x), fit: evalPoly(coeffs, x) });
    }
    const trainPts = xsTrain.map((x, i) => ({ x, y: ysTrain[i] }));
    return { grid, trainPts, trainMSE, testMSE, coeffs };
  }, [degree, n, noise, seed]);

  return (
    <div className="rounded-2xl border border-bg-border bg-bg-card/60 p-5">
      <div className="grid lg:grid-cols-[1fr_260px] gap-5">
        <div style={{ width: "100%", height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
              <CartesianGrid stroke="#222b46" strokeDasharray="3 3" />
              <XAxis dataKey="x" type="number" domain={[X_LO, X_HI]} stroke="#9aa4bf" />
              <YAxis stroke="#9aa4bf" />
              <Tooltip formatter={(v: number) => Number(v).toFixed(3)} />
              <Scatter data={data.trainPts} dataKey="y" fill="#7c9cff" name={locale === "zh" ? "訓練資料" : "training data"} />
              <Line data={data.grid} dataKey="truth" type="monotone" stroke="#ffc46b" strokeWidth={2} strokeDasharray="5 4" dot={false} name={locale === "zh" ? "真實函數" : "truth"} />
              <Line data={data.grid} dataKey="fit" type="monotone" stroke="#5fd0a4" strokeWidth={2} dot={false} name={locale === "zh" ? "多項式擬合" : "poly fit"} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </ComposedChart>
          </ResponsiveContainer>
          <div className="mt-2 text-xs text-ink-dim leading-relaxed">
            {locale === "zh"
              ? "藍點是訓練資料；琥珀虛線是真實函數；綠線是多項式擬合。把 degree 拉到太高，綠線會穿過每個藍點 ── 完美的訓練擬合，但測試誤差爆炸。"
              : "Blue dots are training data; amber dashed = truth; green = polynomial fit. Push degree too high and the green line threads every blue dot — perfect train fit, exploding test error."}
          </div>
        </div>
        <div className="space-y-4">
          <Slider label={locale === "zh" ? "多項式次數 d" : "polynomial degree d"} value={degree} min={0} max={20} step={1} onChange={setDegree} />
          <Slider label={locale === "zh" ? "n（訓練樣本）" : "n (train size)"} value={n} min={5} max={200} step={1} onChange={setN} />
          <Slider label={locale === "zh" ? "雜訊 σ" : "noise σ"} value={noise} min={0} max={1.5} step={0.05} onChange={setNoise} format={(v) => v.toFixed(2)} />
          <Button variant="subtle" size="sm" onClick={() => setSeed(Math.floor(Math.random() * 999) + 1)}>
            {locale === "zh" ? "重新抽樣" : "Re-sample"}
          </Button>
          <div className="rounded-xl border border-bg-border bg-bg-soft p-3 text-xs font-mono space-y-1">
            <div className="text-ink-muted normal-case">
              {locale === "zh" ? "誤差" : "error"}
            </div>
            <div className="text-accent-green">train MSE = {data.trainMSE.toFixed(3)}</div>
            <div className="text-accent-rose">test MSE = {data.testMSE.toFixed(3)}</div>
            <div className="text-ink-muted normal-case mt-2">
              {locale === "zh" ? "差距" : "gap"}
            </div>
            <div className="text-accent-amber">{(data.testMSE - data.trainMSE).toFixed(3)}</div>
          </div>
          <div className="text-[10px] text-ink-muted leading-relaxed">
            {locale === "zh"
              ? "把 d 從 0 慢慢拉到 20。觀察 train MSE 一路下降，但 test MSE 先降後升。最低點就是「最佳的偏誤–變異權衡」。"
              : "Slide d from 0 to 20. Watch train MSE fall monotonically while test MSE first drops, then rises. The minimum is the optimal bias-variance trade-off."}
          </div>
        </div>
      </div>
    </div>
  );
}
