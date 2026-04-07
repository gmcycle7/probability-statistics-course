"use client";

import { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  Line,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Slider } from "@/components/ui/Slider";
import { Button } from "@/components/ui/Button";
import {
  randBernoulli,
  randExponential,
  randNormal,
  randUniform,
  mulberry32,
} from "@/lib/math/random";
import { histogram, mean, std } from "@/lib/stats/summary";
import { normal } from "@/lib/stats/distributions";
import { useT } from "@/lib/i18n/useT";

type Source = "uniform" | "exponential" | "bernoulli" | "bimodal";

const sourceLabel = (id: Source, locale: "zh" | "en") =>
  ({
    uniform: { en: "Uniform[0,1]", zh: "Uniform[0,1]" },
    exponential: { en: "Exponential(1)", zh: "Exponential(1)" },
    bernoulli: { en: "Bernoulli(0.2)", zh: "Bernoulli(0.2)" },
    bimodal: { en: "Bimodal mix", zh: "雙峰混合" },
  }[id][locale]);

const sources: Source[] = ["uniform", "exponential", "bernoulli", "bimodal"];

function trueMomentsOf(s: Source): { mu: number; sigma: number } {
  switch (s) {
    case "uniform":
      return { mu: 0.5, sigma: Math.sqrt(1 / 12) };
    case "exponential":
      return { mu: 1, sigma: 1 };
    case "bernoulli":
      return { mu: 0.2, sigma: Math.sqrt(0.2 * 0.8) };
    case "bimodal":
      // 0.5·N(-2,0.5²) + 0.5·N(2,0.5²)
      return { mu: 0, sigma: Math.sqrt(0.25 + 4) };
  }
}

function drawOne(s: Source, rng: () => number): number {
  switch (s) {
    case "uniform":
      return randUniform(0, 1, rng);
    case "exponential":
      return randExponential(1, rng);
    case "bernoulli":
      return randBernoulli(0.2, rng);
    case "bimodal":
      return rng() < 0.5 ? randNormal(-2, 0.5, rng) : randNormal(2, 0.5, rng);
  }
}

export function CLTSimulator() {
  const { t, locale } = useT();
  const [source, setSource] = useState<Source>("exponential");
  const [n, setN] = useState(20);
  const [trials, setTrials] = useState(2000);
  const [seed, setSeed] = useState(42);

  const { samples, hist, momentsObs, momentsTrue } = useMemo(() => {
    const rng = mulberry32(seed);
    const samples = new Array<number>(trials);
    for (let t = 0; t < trials; t++) {
      let s = 0;
      for (let i = 0; i < n; i++) s += drawOne(source, rng);
      samples[t] = s / n; // sample mean
    }
    const lo = Math.min(...samples);
    const hi = Math.max(...samples);
    const pad = (hi - lo) * 0.05 || 0.1;
    const h = histogram(samples, 35, [lo - pad, hi + pad]);
    return {
      samples,
      hist: h,
      momentsObs: { mu: mean(samples), sigma: std(samples) },
      momentsTrue: trueMomentsOf(source),
    };
  }, [source, n, trials, seed]);

  // Overlay the limit Normal(μ, σ²/n)
  const overlay = useMemo(() => {
    const { mu, sigma } = momentsTrue;
    const sd = sigma / Math.sqrt(n);
    return hist.map((b) => ({ ...b, normal: normal.pdf(b.x, mu, sd) }));
  }, [hist, momentsTrue, n]);

  return (
    <div className="rounded-2xl border border-bg-border bg-bg-card/60 p-5">
      <div className="flex flex-wrap gap-2 mb-3">
        {sources.map((s) => (
          <button
            key={s}
            onClick={() => setSource(s)}
            className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
              source === s
                ? "border-accent bg-accent/15 text-accent"
                : "border-bg-border bg-bg-soft text-ink-dim hover:text-ink"
            }`}
          >
            {sourceLabel(s, locale)}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_240px] gap-5">
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={overlay} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
              <CartesianGrid stroke="#222b46" strokeDasharray="3 3" />
              <XAxis
                dataKey="x"
                type="number"
                tickFormatter={(v) => Number(v).toFixed(2)}
                stroke="#9aa4bf"
              />
              <YAxis stroke="#9aa4bf" tickFormatter={(v) => Number(v).toFixed(2)} />
              <Tooltip
                formatter={(v: number, key) =>
                  key === "density"
                    ? [`density ${v.toFixed(3)}`, "histogram"]
                    : [`f(x) ${v.toFixed(3)}`, "Normal limit"]
                }
                labelFormatter={(v) => `mean ≈ ${Number(v).toFixed(3)}`}
              />
              <Bar dataKey="density" fill="#7c9cff" fillOpacity={0.55} />
              <Line type="monotone" dataKey="normal" stroke="#ffc46b" strokeWidth={2} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-4">
          <Slider label={t("sim.n")} value={n} min={1} max={200} step={1} onChange={setN} />
          <Slider label={t("sim.numMeans")} value={trials} min={200} max={10000} step={100} onChange={setTrials} />
          <Slider label={t("sim.seed")} value={seed} min={1} max={999} step={1} onChange={setSeed} />
          <Button variant="subtle" size="sm" onClick={() => setSeed(Math.floor(Math.random() * 999) + 1)}>
            {t("sim.reroll")}
          </Button>

          <div className="rounded-xl border border-bg-border bg-bg-soft p-3 text-xs space-y-1.5">
            <div className="text-ink-muted uppercase tracking-wider">{t("sim.observedVsTheory")}</div>
            <Row label={t("sim.muTrue")} value={momentsTrue.mu.toFixed(3)} accent="amber" />
            <Row label={t("sim.meanOfMeans")} value={momentsObs.mu.toFixed(3)} />
            <Row label={`σ/√n ${t("sim.theory")}`} value={(momentsTrue.sigma / Math.sqrt(n)).toFixed(3)} accent="amber" />
            <Row label={t("sim.stdOfMeans")} value={momentsObs.sigma.toFixed(3)} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: "amber";
}) {
  return (
    <div className="flex justify-between font-mono text-xs">
      <span className="text-ink-muted">{label}</span>
      <span className={accent === "amber" ? "text-accent-amber" : "text-ink"}>
        {value}
      </span>
    </div>
  );
}
