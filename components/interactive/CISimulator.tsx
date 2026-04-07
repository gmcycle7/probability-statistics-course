"use client";

import { useMemo, useState } from "react";
import { Slider } from "@/components/ui/Slider";
import { Button } from "@/components/ui/Button";
import { mulberry32, randNormal } from "@/lib/math/random";
import { mean, std } from "@/lib/stats/summary";
import { normal } from "@/lib/stats/distributions";
import { useT } from "@/lib/i18n/useT";

/**
 * Simulates `numCIs` 95% z-intervals for the mean of a Normal(μ, σ²)
 * with σ known, using sample size n. Each interval is drawn as a horizontal
 * bar; bars covering the true μ are blue, bars missing it are rose.
 */
export function CISimulator() {
  const { t } = useT();
  const [trueMu, setTrueMu] = useState(0);
  const [sigma, setSigma] = useState(1);
  const [n, setN] = useState(15);
  const [conf, setConf] = useState(0.95);
  const [numCIs, setNumCIs] = useState(50);
  const [seed, setSeed] = useState(3);

  const z = useMemo(() => normal.quantile(0.5 + conf / 2), [conf]);

  const intervals = useMemo(() => {
    const rng = mulberry32(seed);
    const out: { lo: number; hi: number; covers: boolean }[] = [];
    for (let i = 0; i < numCIs; i++) {
      const xs = Array.from({ length: n }, () => randNormal(trueMu, sigma, rng));
      const m = mean(xs);
      const half = (z * sigma) / Math.sqrt(n);
      out.push({ lo: m - half, hi: m + half, covers: m - half <= trueMu && trueMu <= m + half });
    }
    return out;
  }, [trueMu, sigma, n, conf, numCIs, seed, z]);

  const coverage = intervals.filter((iv) => iv.covers).length / intervals.length;

  // Visual scaling
  const lo = trueMu - 4 * (sigma / Math.sqrt(n));
  const hi = trueMu + 4 * (sigma / Math.sqrt(n));
  const W = (x: number) => ((x - lo) / (hi - lo)) * 100;

  return (
    <div className="rounded-2xl border border-bg-border bg-bg-card/60 p-5">
      <div className="grid lg:grid-cols-[1fr_260px] gap-5">
        <div>
          <div className="relative h-[320px] w-full rounded-xl border border-bg-border bg-bg-soft/60 overflow-hidden">
            {/* true mu line */}
            <div
              className="absolute top-0 bottom-0 border-l-2 border-accent-amber"
              style={{ left: `${W(trueMu)}%` }}
            >
              <span className="absolute -top-0.5 left-1 text-[10px] text-accent-amber">μ</span>
            </div>
            {intervals.map((iv, i) => (
              <div
                key={i}
                className="absolute h-[5px] rounded-full"
                style={{
                  top: `${(i + 0.5) * (100 / numCIs)}%`,
                  left: `${W(iv.lo)}%`,
                  width: `${W(iv.hi) - W(iv.lo)}%`,
                  background: iv.covers ? "#7c9cff" : "#ff7a9a",
                  opacity: iv.covers ? 0.85 : 1,
                }}
              />
            ))}
          </div>
          <div className="mt-2 text-xs text-ink-dim flex items-center justify-between">
            <div>{t("sim.eachBar")}</div>
            <div>
              {t("sim.empCoverage")}:{" "}
              <span className="font-mono text-ink">{(coverage * 100).toFixed(1)}%</span>{" "}
              · {t("sim.target")} {(conf * 100).toFixed(0)}%
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <Slider label={t("sim.muTrueLabel")} value={trueMu} min={-3} max={3} step={0.1} onChange={setTrueMu} format={(v) => v.toFixed(2)} />
          <Slider label="σ" value={sigma} min={0.1} max={3} step={0.05} onChange={setSigma} format={(v) => v.toFixed(2)} />
          <Slider label="n" value={n} min={2} max={200} step={1} onChange={setN} />
          <Slider label={t("sim.confidence")} value={conf} min={0.5} max={0.99} step={0.01} onChange={setConf} format={(v) => `${(v * 100).toFixed(0)}%`} />
          <Slider label={t("sim.numCIs")} value={numCIs} min={10} max={200} step={5} onChange={setNumCIs} />
          <Button variant="subtle" size="sm" onClick={() => setSeed(Math.floor(Math.random() * 999) + 1)}>
            {t("sim.newSamples")}
          </Button>
        </div>
      </div>
    </div>
  );
}
