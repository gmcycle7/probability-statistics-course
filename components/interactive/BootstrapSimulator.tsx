"use client";

import { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { Slider } from "@/components/ui/Slider";
import { Button } from "@/components/ui/Button";
import {
  mulberry32,
  randExponential,
  randNormal,
  randUniform,
} from "@/lib/math/random";
import { histogram, mean, std } from "@/lib/stats/summary";
import { useT } from "@/lib/i18n/useT";

/**
 * Bootstrap simulator. Draws ONE original sample from a chosen distribution,
 * then resamples with replacement many times and plots the histogram of the
 * bootstrap sample means. The 2.5% / 97.5% quantiles of that histogram give a
 * percentile bootstrap CI for the mean.
 */

type Source = "normal" | "exponential" | "uniform";

function drawOne(s: Source, rng: () => number) {
  if (s === "normal") return randNormal(0, 1, rng);
  if (s === "exponential") return randExponential(1, rng);
  return randUniform(-1, 1, rng);
}
const trueMean = (s: Source) => (s === "exponential" ? 1 : 0);

export function BootstrapSimulator() {
  const { t, locale } = useT();
  const [source, setSource] = useState<Source>("exponential");
  const [n, setN] = useState(30);
  const [B, setB] = useState(2000);
  const [seed, setSeed] = useState(11);

  const { hist, sampleMean, ci, originalSample } = useMemo(() => {
    const rng = mulberry32(seed);
    const original: number[] = Array.from({ length: n }, () => drawOne(source, rng));
    const xb = mean(original);
    // Bootstrap means
    const bootMeans: number[] = new Array(B);
    for (let b = 0; b < B; b++) {
      let s = 0;
      for (let i = 0; i < n; i++) s += original[Math.floor(rng() * n)];
      bootMeans[b] = s / n;
    }
    // 2.5 / 97.5 percentiles
    const sorted = [...bootMeans].sort((a, b) => a - b);
    const lo = sorted[Math.floor(0.025 * B)];
    const hi = sorted[Math.floor(0.975 * B)];
    const h = histogram(bootMeans, 40);
    return {
      hist: h,
      sampleMean: xb,
      ci: { lo, hi },
      originalSample: original,
    };
  }, [source, n, B, seed]);

  const tm = trueMean(source);
  const ciCovers = ci.lo <= tm && tm <= ci.hi;

  const labels = {
    normal: { en: "Normal(0,1)", zh: "Normal(0,1)" }[locale],
    exponential: { en: "Exponential(1)", zh: "Exponential(1)" }[locale],
    uniform: { en: "Uniform(-1,1)", zh: "Uniform(-1,1)" }[locale],
  };

  return (
    <div className="rounded-2xl border border-bg-border bg-bg-card/60 p-5">
      <div className="flex flex-wrap gap-2 mb-3">
        {(["normal", "exponential", "uniform"] as Source[]).map((s) => (
          <button
            key={s}
            onClick={() => setSource(s)}
            className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
              source === s
                ? "border-accent bg-accent/15 text-accent"
                : "border-bg-border bg-bg-soft text-ink-dim hover:text-ink"
            }`}
          >
            {labels[s]}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_260px] gap-5">
        <div style={{ width: "100%", height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hist} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
              <CartesianGrid stroke="#222b46" strokeDasharray="3 3" />
              <XAxis dataKey="x" type="number" tickFormatter={(v) => Number(v).toFixed(2)} stroke="#9aa4bf" />
              <YAxis stroke="#9aa4bf" tickFormatter={(v) => Number(v).toFixed(2)} />
              <Tooltip formatter={(v: number) => v.toFixed(3)} labelFormatter={(v) => `value ≈ ${Number(v).toFixed(3)}`} />
              <Bar dataKey="density" fill="#7c9cff" fillOpacity={0.7} />
              <ReferenceLine x={tm} stroke="#ffc46b" strokeDasharray="4 4" label={{ value: locale === "zh" ? "真值 μ" : "true μ", fill: "#ffc46b", fontSize: 11, position: "top" }} />
              <ReferenceLine x={sampleMean} stroke="#5fd0a4" label={{ value: "x̄", fill: "#5fd0a4", fontSize: 11, position: "top" }} />
              <ReferenceLine x={ci.lo} stroke="#b08bff" strokeDasharray="3 3" />
              <ReferenceLine x={ci.hi} stroke="#b08bff" strokeDasharray="3 3" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-2 text-xs text-ink-dim">
            {locale === "zh"
              ? "藍色直方圖是 B 次重抽樣得到的「樣本平均」分布；紫色虛線是 2.5 / 97.5 百分位（percentile bootstrap CI）；琥珀線是真實 μ。"
              : "The blue histogram is the distribution of bootstrap sample means; violet dashed lines are the 2.5 / 97.5 percentiles (percentile bootstrap CI); amber line is the true μ."}
          </div>
        </div>
        <div className="space-y-4">
          <Slider label={t("sim.n")} value={n} min={5} max={300} step={1} onChange={setN} />
          <Slider label={locale === "zh" ? "重抽樣次數 B" : "B (resamples)"} value={B} min={200} max={10000} step={100} onChange={setB} />
          <Slider label={t("sim.seedShort")} value={seed} min={1} max={999} step={1} onChange={setSeed} />
          <Button variant="subtle" size="sm" onClick={() => setSeed(Math.floor(Math.random() * 999) + 1)}>
            {t("sim.newSamples")}
          </Button>
          <div className="rounded-xl border border-bg-border bg-bg-soft p-3 text-xs font-mono space-y-1">
            <div className="text-ink-muted normal-case">
              {locale === "zh" ? "原始樣本" : "original sample"}
            </div>
            <div>x̄ = {sampleMean.toFixed(3)}</div>
            <div>s = {std(originalSample).toFixed(3)}</div>
            <div className="text-ink-muted normal-case mt-2">
              {locale === "zh" ? "Bootstrap 95% CI" : "Bootstrap 95% CI"}
            </div>
            <div className="text-accent-violet">[{ci.lo.toFixed(3)}, {ci.hi.toFixed(3)}]</div>
            <div className={ciCovers ? "text-accent-green" : "text-accent-rose"}>
              {ciCovers ? (locale === "zh" ? "✓ 包含真值" : "✓ covers truth") : (locale === "zh" ? "✗ 沒包含真值" : "✗ misses truth")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
