"use client";

import { useMemo, useState } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Line,
  ComposedChart,
  ResponsiveContainer,
} from "recharts";
import { Slider } from "@/components/ui/Slider";
import { Button } from "@/components/ui/Button";
import { mulberry32, randNormal } from "@/lib/math/random";
import { mean } from "@/lib/stats/summary";
import { useT } from "@/lib/i18n/useT";

type Pt = { x: number; y: number; yhat?: number };

export function RegressionPlayground() {
  const { t } = useT();
  const [n, setN] = useState(40);
  const [trueA, setTrueA] = useState(1);
  const [trueB, setTrueB] = useState(0.8);
  const [noise, setNoise] = useState(1);
  const [seed, setSeed] = useState(2);

  const { points, a, b, sse, r2 } = useMemo(() => {
    const rng = mulberry32(seed);
    const xs = Array.from({ length: n }, () => randNormal(0, 2, rng));
    const ys = xs.map((x) => trueA + trueB * x + randNormal(0, noise, rng));
    const xbar = mean(xs);
    const ybar = mean(ys);
    let num = 0;
    let den = 0;
    for (let i = 0; i < n; i++) {
      num += (xs[i] - xbar) * (ys[i] - ybar);
      den += (xs[i] - xbar) ** 2;
    }
    const bHat = num / den;
    const aHat = ybar - bHat * xbar;
    let sse = 0;
    let sst = 0;
    for (let i = 0; i < n; i++) {
      const yh = aHat + bHat * xs[i];
      sse += (ys[i] - yh) ** 2;
      sst += (ys[i] - ybar) ** 2;
    }
    const points: Pt[] = xs.map((x, i) => ({ x, y: ys[i], yhat: aHat + bHat * x }));
    return { points, a: aHat, b: bHat, sse, r2: 1 - sse / sst };
  }, [n, trueA, trueB, noise, seed]);

  // Build a smooth line for the fit
  const xMin = Math.min(...points.map((p) => p.x));
  const xMax = Math.max(...points.map((p) => p.x));
  const fitLine = [
    { x: xMin, y: a + b * xMin },
    { x: xMax, y: a + b * xMax },
  ];
  const trueLine = [
    { x: xMin, y: trueA + trueB * xMin },
    { x: xMax, y: trueA + trueB * xMax },
  ];

  return (
    <div className="rounded-2xl border border-bg-border bg-bg-card/60 p-5">
      <div className="grid lg:grid-cols-[1fr_260px] gap-5">
        <div style={{ width: "100%", height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
              <CartesianGrid stroke="#222b46" strokeDasharray="3 3" />
              <XAxis dataKey="x" type="number" stroke="#9aa4bf" tickFormatter={(v) => Number(v).toFixed(1)} />
              <YAxis dataKey="y" type="number" stroke="#9aa4bf" tickFormatter={(v) => Number(v).toFixed(1)} />
              <Tooltip formatter={(v: number) => Number(v).toFixed(3)} />
              <Scatter data={points} fill="#7c9cff" name="data" />
              <Line data={fitLine} dataKey="y" type="linear" stroke="#5fd0a4" strokeWidth={2} dot={false} name="OLS" />
              <Line data={trueLine} dataKey="y" type="linear" stroke="#ffc46b" strokeWidth={2} strokeDasharray="5 4" dot={false} name="truth" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-4">
          <Slider label={t("sim.trueAlpha")} value={trueA} min={-3} max={3} step={0.05} onChange={setTrueA} format={(v) => v.toFixed(2)} />
          <Slider label={t("sim.trueBeta")} value={trueB} min={-3} max={3} step={0.05} onChange={setTrueB} format={(v) => v.toFixed(2)} />
          <Slider label={t("sim.noise")} value={noise} min={0} max={3} step={0.05} onChange={setNoise} format={(v) => v.toFixed(2)} />
          <Slider label={t("sim.nPoints")} value={n} min={5} max={300} step={1} onChange={setN} />
          <Button variant="subtle" size="sm" onClick={() => setSeed(Math.floor(Math.random() * 999) + 1)}>
            {t("sim.newSamples")}
          </Button>
          <div className="rounded-xl border border-bg-border bg-bg-soft p-3 text-xs space-y-1 font-mono">
            <div className="text-ink-muted normal-case">{t("sim.olsEstimates")}</div>
            <div className="text-accent-green">{t("sim.alphaHat")} {a.toFixed(3)}</div>
            <div className="text-accent-green">{t("sim.betaHat")} {b.toFixed(3)}</div>
            <div>SSE = {sse.toFixed(2)}</div>
            <div className="text-accent-amber">R² = {r2.toFixed(3)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
