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

/**
 * A small lab for experimenting with E[X] and Var(X) on a 6-outcome
 * discrete random variable, where the user controls the probabilities
 * (re-normalized) and the values.
 */
export function ExpectationVarianceLab() {
  const [vals, setVals] = useState([1, 2, 3, 4, 5, 6]);
  const [w, setW] = useState([1, 1, 1, 1, 1, 1]);

  const probs = useMemo(() => {
    const s = w.reduce((a, b) => a + b, 0);
    return s === 0 ? w.map(() => 0) : w.map((x) => x / s);
  }, [w]);

  const E = useMemo(() => vals.reduce((a, x, i) => a + x * probs[i], 0), [vals, probs]);
  const E2 = useMemo(() => vals.reduce((a, x, i) => a + x * x * probs[i], 0), [vals, probs]);
  const Var = E2 - E * E;

  const data = vals.map((x, i) => ({ x, p: probs[i] }));

  return (
    <div className="rounded-2xl border border-bg-border bg-bg-card/60 p-5">
      <div className="grid lg:grid-cols-[1fr_280px] gap-5">
        <div style={{ width: "100%", height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
              <CartesianGrid stroke="#222b46" strokeDasharray="3 3" />
              <XAxis dataKey="x" stroke="#9aa4bf" />
              <YAxis stroke="#9aa4bf" tickFormatter={(v) => Number(v).toFixed(2)} />
              <Tooltip formatter={(v: number) => v.toFixed(3)} />
              <Bar dataKey="p" fill="#7c9cff" />
              <ReferenceLine x={E} stroke="#ffc46b" strokeDasharray="4 4" label={{ value: "E[X]", fill: "#ffc46b", fontSize: 11, position: "top" }} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-2 text-xs text-ink-dim">
            Drag the weights to reshape the distribution. The amber line is the
            mean — the balance point of the distribution.
          </div>
        </div>
        <div className="space-y-3">
          {w.map((wi, i) => (
            <div key={i} className="grid grid-cols-[60px_1fr] items-center gap-2">
              <input
                type="number"
                value={vals[i]}
                onChange={(e) => {
                  const v = parseFloat(e.target.value);
                  setVals((arr) => arr.map((x, j) => (j === i ? (Number.isFinite(v) ? v : x) : x)));
                }}
                className="w-full rounded-lg border border-bg-border bg-bg-soft px-2 py-1 text-xs text-ink"
              />
              <Slider
                value={wi}
                min={0}
                max={5}
                step={0.05}
                onChange={(v) =>
                  setW((arr) => arr.map((x, j) => (j === i ? v : x)))
                }
                format={(v) => v.toFixed(2)}
              />
            </div>
          ))}
          <div className="rounded-xl border border-bg-border bg-bg-soft p-3 text-xs font-mono space-y-1">
            <div className="text-accent-amber">E[X] = {E.toFixed(3)}</div>
            <div>E[X²] = {E2.toFixed(3)}</div>
            <div className="text-accent">Var(X) = {Var.toFixed(3)}</div>
            <div className="text-accent">SD(X) = {Math.sqrt(Math.max(0, Var)).toFixed(3)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
