"use client";

import { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { Slider } from "@/components/ui/Slider";
import { Button } from "@/components/ui/Button";
import { mulberry32, randNormal } from "@/lib/math/random";
import { linspace, mean, variance } from "@/lib/stats/summary";
import { normal } from "@/lib/stats/distributions";

/**
 * MLE for a Normal model with known σ:
 *   ℓ(μ) = -n/2 log(2πσ²) - 1/(2σ²) Σ (xᵢ - μ)²
 * The MLE is μ̂ = sample mean.
 */
export function MLEExplorer() {
  const [trueMu, setTrueMu] = useState(2);
  const [n, setN] = useState(20);
  const [sigma, setSigma] = useState(1);
  const [seed, setSeed] = useState(1);
  const [muTry, setMuTry] = useState(0);

  const data = useMemo(() => {
    const rng = mulberry32(seed);
    const xs = Array.from({ length: n }, () => randNormal(trueMu, sigma, rng));
    const muHat = mean(xs);
    const sigmaHat = Math.sqrt(variance(xs, false));
    // log-likelihood as a function of μ for plotting
    const grid = linspace(trueMu - 3, trueMu + 3, 200);
    const ll = grid.map((mu) => {
      let s = 0;
      for (const x of xs) s += (x - mu) * (x - mu);
      return {
        mu,
        ll: -0.5 * n * Math.log(2 * Math.PI * sigma * sigma) - s / (2 * sigma * sigma),
      };
    });
    return { xs, muHat, sigmaHat, ll };
  }, [trueMu, n, sigma, seed]);

  const userLL = useMemo(() => {
    let s = 0;
    for (const x of data.xs) s += (x - muTry) * (x - muTry);
    return -0.5 * n * Math.log(2 * Math.PI * sigma * sigma) - s / (2 * sigma * sigma);
  }, [data.xs, muTry, n, sigma]);

  return (
    <div className="rounded-2xl border border-bg-border bg-bg-card/60 p-5">
      <div className="grid lg:grid-cols-[1fr_260px] gap-5">
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.ll} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
              <CartesianGrid stroke="#222b46" strokeDasharray="3 3" />
              <XAxis dataKey="mu" type="number" stroke="#9aa4bf" tickFormatter={(v) => Number(v).toFixed(2)} />
              <YAxis stroke="#9aa4bf" />
              <Tooltip
                formatter={(v: number) => v.toFixed(2)}
                labelFormatter={(v) => `μ = ${Number(v).toFixed(3)}`}
              />
              <Line type="monotone" dataKey="ll" stroke="#7c9cff" dot={false} />
              <ReferenceLine x={trueMu} stroke="#ffc46b" strokeDasharray="4 4" label={{ value: "true μ", fill: "#ffc46b", position: "top", fontSize: 11 }} />
              <ReferenceLine x={data.muHat} stroke="#5fd0a4" strokeDasharray="4 4" label={{ value: "MLE", fill: "#5fd0a4", position: "bottom", fontSize: 11 }} />
              <ReferenceLine x={muTry} stroke="#b08bff" label={{ value: "your guess", fill: "#b08bff", position: "top", fontSize: 11 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-4">
          <Slider label="true μ" value={trueMu} min={-3} max={3} step={0.1} onChange={setTrueMu} format={(v) => v.toFixed(2)} />
          <Slider label="σ (known)" value={sigma} min={0.2} max={3} step={0.05} onChange={setSigma} format={(v) => v.toFixed(2)} />
          <Slider label="n (sample size)" value={n} min={2} max={500} step={1} onChange={setN} />
          <Slider label="seed" value={seed} min={1} max={999} step={1} onChange={setSeed} />
          <Slider label="your guess for μ" value={muTry} min={-5} max={5} step={0.05} onChange={setMuTry} format={(v) => v.toFixed(2)} />
          <Button variant="subtle" size="sm" onClick={() => setMuTry(parseFloat(data.muHat.toFixed(2)))}>
            Snap to MLE
          </Button>
          <div className="rounded-xl border border-bg-border bg-bg-soft p-3 text-xs font-mono space-y-1">
            <div className="text-ink-muted normal-case">log-likelihood</div>
            <div>at MLE = {data.ll.reduce((m, p) => Math.max(m, p.ll), -Infinity).toFixed(2)}</div>
            <div className="text-accent-violet">at your guess = {userLL.toFixed(2)}</div>
            <div className="mt-2 text-ink-muted normal-case">point estimates</div>
            <div className="text-accent-green">μ̂ = {data.muHat.toFixed(3)}</div>
            <div>σ̂ (MLE) = {data.sigmaHat.toFixed(3)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
