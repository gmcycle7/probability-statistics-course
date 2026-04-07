"use client";

import { useMemo, useState } from "react";
import {
  AreaChart,
  Area,
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
import {
  binomial,
  exponential,
  geometric,
  normal,
  poisson,
  uniform,
} from "@/lib/stats/distributions";
import { linspace } from "@/lib/stats/summary";

type Family =
  | "normal"
  | "binomial"
  | "poisson"
  | "exponential"
  | "uniform"
  | "geometric";

const families: { id: Family; label: string; kind: "discrete" | "continuous" }[] = [
  { id: "normal", label: "Normal", kind: "continuous" },
  { id: "exponential", label: "Exponential", kind: "continuous" },
  { id: "uniform", label: "Uniform", kind: "continuous" },
  { id: "binomial", label: "Binomial", kind: "discrete" },
  { id: "poisson", label: "Poisson", kind: "discrete" },
  { id: "geometric", label: "Geometric", kind: "discrete" },
];

export function DistributionExplorer({
  initialFamily = "normal",
  height = 280,
}: {
  initialFamily?: Family;
  height?: number;
}) {
  const [family, setFamily] = useState<Family>(initialFamily);

  // shared params (re-used per family)
  const [mu, setMu] = useState(0);
  const [sigma, setSigma] = useState(1);
  const [n, setN] = useState(20);
  const [p, setP] = useState(0.4);
  const [lambda, setLambda] = useState(3);
  const [rate, setRate] = useState(1);
  const [a, setA] = useState(0);
  const [b, setB] = useState(1);

  const data = useMemo(() => {
    switch (family) {
      case "normal": {
        const xs = linspace(mu - 4 * sigma, mu + 4 * sigma, 200);
        return xs.map((x) => ({ x, y: normal.pdf(x, mu, sigma) }));
      }
      case "exponential": {
        const xs = linspace(0, 5 / rate, 200);
        return xs.map((x) => ({ x, y: exponential.pdf(x, rate) }));
      }
      case "uniform": {
        const lo = Math.min(a, b);
        const hi = Math.max(a, b);
        const pad = (hi - lo) * 0.25 || 1;
        const xs = linspace(lo - pad, hi + pad, 200);
        return xs.map((x) => ({ x, y: uniform.pdf(x, lo, hi) }));
      }
      case "binomial": {
        return Array.from({ length: n + 1 }, (_, k) => ({
          x: k,
          y: binomial.pmf(k, n, p),
        }));
      }
      case "poisson": {
        const upper = Math.max(15, Math.ceil(lambda * 3));
        return Array.from({ length: upper + 1 }, (_, k) => ({
          x: k,
          y: poisson.pmf(k, lambda),
        }));
      }
      case "geometric": {
        const upper = Math.max(20, Math.ceil(5 / p));
        return Array.from({ length: upper }, (_, k) => ({
          x: k + 1,
          y: geometric.pmf(k + 1, p),
        }));
      }
    }
  }, [family, mu, sigma, n, p, lambda, rate, a, b]);

  const meanLine = useMemo(() => {
    switch (family) {
      case "normal":
        return mu;
      case "exponential":
        return 1 / rate;
      case "uniform":
        return (a + b) / 2;
      case "binomial":
        return n * p;
      case "poisson":
        return lambda;
      case "geometric":
        return 1 / p;
    }
  }, [family, mu, rate, a, b, n, p, lambda]);

  const isContinuous =
    families.find((f) => f.id === family)?.kind === "continuous";

  return (
    <div className="rounded-2xl border border-bg-border bg-bg-card/60 p-5">
      <div className="flex flex-wrap gap-2 mb-4">
        {families.map((f) => (
          <button
            key={f.id}
            onClick={() => setFamily(f.id)}
            className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
              family === f.id
                ? "border-accent bg-accent/15 text-accent"
                : "border-bg-border bg-bg-soft text-ink-dim hover:text-ink"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_260px] gap-5">
        <div style={{ width: "100%", height }}>
          <ResponsiveContainer width="100%" height="100%">
            {isContinuous ? (
              <AreaChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
                <CartesianGrid stroke="#222b46" strokeDasharray="3 3" />
                <XAxis
                  dataKey="x"
                  type="number"
                  domain={["auto", "auto"]}
                  tickFormatter={(v) => Number(v).toFixed(1)}
                  stroke="#9aa4bf"
                />
                <YAxis stroke="#9aa4bf" tickFormatter={(v) => Number(v).toFixed(2)} />
                <Tooltip
                  formatter={(v: number) => v.toFixed(4)}
                  labelFormatter={(v) => `x = ${Number(v).toFixed(2)}`}
                />
                <ReferenceLine x={meanLine} stroke="#ffc46b" strokeDasharray="4 4" label={{ value: "E[X]", fill: "#ffc46b", fontSize: 11, position: "top" }} />
                <Area
                  type="monotone"
                  dataKey="y"
                  stroke="#7c9cff"
                  fill="#7c9cff"
                  fillOpacity={0.25}
                />
              </AreaChart>
            ) : (
              <BarChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
                <CartesianGrid stroke="#222b46" strokeDasharray="3 3" />
                <XAxis dataKey="x" stroke="#9aa4bf" />
                <YAxis stroke="#9aa4bf" tickFormatter={(v) => Number(v).toFixed(2)} />
                <Tooltip
                  formatter={(v: number) => v.toFixed(4)}
                  labelFormatter={(v) => `k = ${v}`}
                />
                <ReferenceLine x={meanLine} stroke="#ffc46b" strokeDasharray="4 4" />
                <Bar dataKey="y" fill="#7c9cff" />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        <div className="space-y-4">
          {family === "normal" && (
            <>
              <Slider label="μ (mean)" value={mu} min={-5} max={5} step={0.1} onChange={setMu} format={(v) => v.toFixed(2)} />
              <Slider label="σ (std)" value={sigma} min={0.1} max={4} step={0.05} onChange={setSigma} format={(v) => v.toFixed(2)} />
            </>
          )}
          {family === "exponential" && (
            <Slider label="λ (rate)" value={rate} min={0.1} max={5} step={0.05} onChange={setRate} format={(v) => v.toFixed(2)} />
          )}
          {family === "uniform" && (
            <>
              <Slider label="a" value={a} min={-5} max={5} step={0.1} onChange={setA} format={(v) => v.toFixed(1)} />
              <Slider label="b" value={b} min={-5} max={5} step={0.1} onChange={setB} format={(v) => v.toFixed(1)} />
            </>
          )}
          {family === "binomial" && (
            <>
              <Slider label="n (trials)" value={n} min={1} max={60} step={1} onChange={setN} />
              <Slider label="p" value={p} min={0.01} max={0.99} step={0.01} onChange={setP} format={(v) => v.toFixed(2)} />
            </>
          )}
          {family === "poisson" && (
            <Slider label="λ" value={lambda} min={0.1} max={20} step={0.1} onChange={setLambda} format={(v) => v.toFixed(1)} />
          )}
          {family === "geometric" && (
            <Slider label="p" value={p} min={0.05} max={0.95} step={0.01} onChange={setP} format={(v) => v.toFixed(2)} />
          )}

          <div className="rounded-xl border border-bg-border bg-bg-soft p-3 text-xs text-ink-dim space-y-1">
            <div>
              <span className="text-ink-muted">E[X] =</span>{" "}
              <span className="text-accent-amber font-mono">{meanLine.toFixed(3)}</span>
            </div>
            <Stats family={family} mu={mu} sigma={sigma} n={n} p={p} lambda={lambda} rate={rate} a={a} b={b} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Stats({
  family,
  mu,
  sigma,
  n,
  p,
  lambda,
  rate,
  a,
  b,
}: {
  family: Family;
  mu: number;
  sigma: number;
  n: number;
  p: number;
  lambda: number;
  rate: number;
  a: number;
  b: number;
}) {
  let varX = 0;
  if (family === "normal") varX = sigma * sigma;
  if (family === "binomial") varX = n * p * (1 - p);
  if (family === "poisson") varX = lambda;
  if (family === "geometric") varX = (1 - p) / (p * p);
  if (family === "exponential") varX = 1 / (rate * rate);
  if (family === "uniform") {
    const w = Math.abs(b - a);
    varX = (w * w) / 12;
  }
  return (
    <div>
      <span className="text-ink-muted">Var(X) =</span>{" "}
      <span className="font-mono text-accent">{varX.toFixed(3)}</span>
    </div>
  );
}
