"use client";

import { useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Slider } from "@/components/ui/Slider";
import { Button } from "@/components/ui/Button";
import { mulberry32, randNormal } from "@/lib/math/random";
import { mean, variance, histogram, linspace } from "@/lib/stats/summary";
import { useT } from "@/lib/i18n/useT";

/**
 * Compares the sampling distributions of three estimators of μ
 * for X_i ~ N(μ, σ²):
 *   1. Sample mean        — unbiased, variance σ²/n
 *   2. First observation  — unbiased, variance σ² (much higher)
 *   3. Shrunk mean (k·X̄)  — biased toward 0, lower variance for k<1
 * The point: bias and variance can trade off — minimum MSE need not be unbiased.
 */
export function EstimatorComparisonLab() {
  const { t, locale } = useT();
  const [trueMu, setTrueMu] = useState(2);
  const [sigma, setSigma] = useState(1);
  const [n, setN] = useState(20);
  const [k, setK] = useState(0.7);
  const [trials, setTrials] = useState(2000);
  const [seed, setSeed] = useState(7);

  const { data, stats } = useMemo(() => {
    const rng = mulberry32(seed);
    const meanEst: number[] = [];
    const firstEst: number[] = [];
    const shrunkEst: number[] = [];
    for (let t = 0; t < trials; t++) {
      const xs = Array.from({ length: n }, () => randNormal(trueMu, sigma, rng));
      const xb = mean(xs);
      meanEst.push(xb);
      firstEst.push(xs[0]);
      shrunkEst.push(k * xb);
    }
    // Histogram bins shared across all three
    const all = [...meanEst, ...firstEst, ...shrunkEst];
    const lo = Math.min(...all);
    const hi = Math.max(...all);
    const pad = (hi - lo) * 0.05 || 0.1;
    const bins = 40;
    const hMean = histogram(meanEst, bins, [lo - pad, hi + pad]);
    const hFirst = histogram(firstEst, bins, [lo - pad, hi + pad]);
    const hShrunk = histogram(shrunkEst, bins, [lo - pad, hi + pad]);
    const merged = hMean.map((b, i) => ({
      x: b.x,
      mean: b.density,
      first: hFirst[i].density,
      shrunk: hShrunk[i].density,
    }));

    function statsFor(arr: number[]) {
      const m = mean(arr);
      const v = variance(arr, false);
      const bias = m - trueMu;
      const mse = bias * bias + v;
      return { mean: m, variance: v, bias, mse };
    }

    return {
      data: merged,
      stats: {
        mean: statsFor(meanEst),
        first: statsFor(firstEst),
        shrunk: statsFor(shrunkEst),
      },
    };
  }, [trueMu, sigma, n, k, trials, seed]);

  const labels = {
    mean: { en: "Sample mean X̄", zh: "樣本平均 X̄" }[locale],
    first: { en: "First observation X₁", zh: "第一個觀察 X₁" }[locale],
    shrunk: { en: "Shrunken k·X̄", zh: "縮減估計 k·X̄" }[locale],
  };

  return (
    <div className="rounded-2xl border border-bg-border bg-bg-card/60 p-5">
      <div className="grid lg:grid-cols-[1fr_260px] gap-5">
        <div style={{ width: "100%", height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
              <CartesianGrid stroke="#222b46" strokeDasharray="3 3" />
              <XAxis dataKey="x" type="number" stroke="#9aa4bf" tickFormatter={(v) => Number(v).toFixed(2)} />
              <YAxis stroke="#9aa4bf" tickFormatter={(v) => Number(v).toFixed(2)} />
              <Tooltip formatter={(v: number) => v.toFixed(3)} labelFormatter={(v) => `value ≈ ${Number(v).toFixed(3)}`} />
              <Area type="monotone" dataKey="first" stroke="#ff7a9a" fill="#ff7a9a" fillOpacity={0.18} name={labels.first} />
              <Area type="monotone" dataKey="mean" stroke="#7c9cff" fill="#7c9cff" fillOpacity={0.35} name={labels.mean} />
              <Area type="monotone" dataKey="shrunk" stroke="#5fd0a4" fill="#5fd0a4" fillOpacity={0.35} name={labels.shrunk} />
              <ReferenceLine x={trueMu} stroke="#ffc46b" strokeDasharray="4 4" label={{ value: locale === "zh" ? "真值 μ" : "true μ", fill: "#ffc46b", fontSize: 11, position: "top" }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-4">
          <Slider label={t("sim.muTrueLabel")} value={trueMu} min={-3} max={3} step={0.1} onChange={setTrueMu} format={(v) => v.toFixed(2)} />
          <Slider label="σ" value={sigma} min={0.2} max={3} step={0.05} onChange={setSigma} format={(v) => v.toFixed(2)} />
          <Slider label={t("sim.n")} value={n} min={2} max={200} step={1} onChange={setN} />
          <Slider label={locale === "zh" ? "縮減因子 k" : "shrink factor k"} value={k} min={0} max={1.2} step={0.01} onChange={setK} format={(v) => v.toFixed(2)} />
          <Slider label={t("sim.numMeans")} value={trials} min={500} max={10000} step={100} onChange={setTrials} />
          <Button variant="subtle" size="sm" onClick={() => setSeed(Math.floor(Math.random() * 999) + 1)}>
            {t("sim.reroll")}
          </Button>

          <div className="rounded-xl border border-bg-border bg-bg-soft p-3 text-[11px] font-mono space-y-1.5">
            <div className="text-ink-muted normal-case">{locale === "zh" ? "估計量比較" : "Estimator comparison"}</div>
            <Row name={labels.mean} bias={stats.mean.bias} variance={stats.mean.variance} mse={stats.mean.mse} />
            <Row name={labels.first} bias={stats.first.bias} variance={stats.first.variance} mse={stats.first.mse} />
            <Row name={labels.shrunk} bias={stats.shrunk.bias} variance={stats.shrunk.variance} mse={stats.shrunk.mse} accent />
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({
  name,
  bias,
  variance,
  mse,
  accent,
}: {
  name: string;
  bias: number;
  variance: number;
  mse: number;
  accent?: boolean;
}) {
  return (
    <div className={accent ? "text-accent-green" : "text-ink-dim"}>
      <div className="text-ink">{name}</div>
      <div className="pl-2">
        bias={bias.toFixed(3)} · var={variance.toFixed(3)} · <span className="text-accent-amber">MSE={mse.toFixed(3)}</span>
      </div>
    </div>
  );
}
