"use client";

import { useEffect, useMemo, useState } from "react";
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
import { Button } from "@/components/ui/Button";
import { Slider } from "@/components/ui/Slider";
import { useT } from "@/lib/i18n/useT";
import { mulberry32 } from "@/lib/math/random";

/**
 * A 3-state finite Markov chain visualizer.
 *  - User edits the 3x3 transition matrix (rows are normalized live).
 *  - We compute the stationary distribution by solving πP = π via power iteration.
 *  - We simulate one trajectory and show the empirical state occupancy converging.
 */

const STATES = ["A", "B", "C"] as const;
type State = (typeof STATES)[number];

const DEFAULT_MATRIX = [
  [0.6, 0.3, 0.1],
  [0.2, 0.5, 0.3],
  [0.1, 0.4, 0.5],
];

function powerIteration(P: number[][], iters = 200): number[] {
  let pi = [1 / P.length, 1 / P.length, 1 / P.length];
  for (let i = 0; i < iters; i++) {
    const next = [0, 0, 0];
    for (let j = 0; j < 3; j++) {
      for (let k = 0; k < 3; k++) next[j] += pi[k] * P[k][j];
    }
    const s = next.reduce((a, b) => a + b, 0);
    pi = next.map((v) => v / s);
  }
  return pi;
}

export function MarkovChainSimulator() {
  const { locale } = useT();
  const [matrix, setMatrix] = useState<number[][]>(DEFAULT_MATRIX);
  const [steps, setSteps] = useState(2000);
  const [seed, setSeed] = useState(7);

  // Row-normalized matrix
  const P = useMemo(() => {
    return matrix.map((row) => {
      const sum = row.reduce((a, b) => a + b, 0);
      if (sum === 0) return [1 / 3, 1 / 3, 1 / 3];
      return row.map((v) => v / sum);
    });
  }, [matrix]);

  const stationary = useMemo(() => powerIteration(P), [P]);

  const { empirical, trajectory } = useMemo(() => {
    const rng = mulberry32(seed);
    const counts = [0, 0, 0];
    let cur = 0;
    const traj: number[] = [];
    for (let i = 0; i < steps; i++) {
      counts[cur]++;
      traj.push(cur);
      const r = rng();
      let acc = 0;
      for (let j = 0; j < 3; j++) {
        acc += P[cur][j];
        if (r < acc) {
          cur = j;
          break;
        }
      }
    }
    const sum = counts.reduce((a, b) => a + b, 0);
    return {
      empirical: counts.map((c) => c / sum),
      trajectory: traj.slice(0, 80), // first 80 steps for the strip
    };
  }, [P, steps, seed]);

  const data = STATES.map((s, i) => ({
    state: s,
    empirical: empirical[i],
    stationary: stationary[i],
  }));

  function setCell(i: number, j: number, v: number) {
    setMatrix((m) => m.map((row, ri) => (ri === i ? row.map((c, ci) => (ci === j ? v : c)) : row)));
  }

  return (
    <div className="rounded-2xl border border-bg-border bg-bg-card/60 p-5">
      <div className="grid lg:grid-cols-[1fr_280px] gap-5">
        <div>
          {/* Empirical vs stationary bars */}
          <div style={{ width: "100%", height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
                <CartesianGrid stroke="#222b46" strokeDasharray="3 3" />
                <XAxis dataKey="state" stroke="#9aa4bf" />
                <YAxis stroke="#9aa4bf" tickFormatter={(v) => Number(v).toFixed(2)} domain={[0, 1]} />
                <Tooltip formatter={(v: number) => v.toFixed(3)} />
                <Bar dataKey="empirical" fill="#7c9cff" name={locale === "zh" ? "經驗" : "empirical"} />
                <Bar dataKey="stationary" fill="#ffc46b" name={locale === "zh" ? "穩態" : "stationary"} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          {/* Trajectory strip */}
          <div className="mt-3">
            <div className="text-xs text-ink-muted mb-1">
              {locale === "zh" ? "前 80 步的軌跡" : "first 80 steps"}
            </div>
            <div className="flex gap-[2px] flex-wrap">
              {trajectory.map((s, i) => (
                <span
                  key={i}
                  className={`inline-block w-3 h-3 rounded-sm ${s === 0 ? "bg-accent" : s === 1 ? "bg-accent-green" : "bg-accent-violet"}`}
                  title={`step ${i}: ${STATES[s]}`}
                />
              ))}
            </div>
          </div>
          <div className="mt-3 text-xs text-ink-dim leading-relaxed">
            {locale === "zh"
              ? "藍 = 經驗占比，琥珀 = 穩態分布。當步數越多，藍色應該收斂到琥珀色。"
              : "Blue = empirical occupancy, amber = stationary distribution. As steps grow, blue converges to amber."}
          </div>
        </div>
        <div className="space-y-4">
          <div className="text-xs text-ink-muted uppercase tracking-wider">
            {locale === "zh" ? "轉移矩陣 P (列自動歸一化)" : "Transition matrix P (rows auto-normalised)"}
          </div>
          <table className="w-full text-xs font-mono">
            <tbody>
              {[0, 1, 2].map((i) => (
                <tr key={i}>
                  <td className="text-ink-muted pr-2">{STATES[i]}→</td>
                  {[0, 1, 2].map((j) => (
                    <td key={j} className="px-1 py-1">
                      <input
                        type="number"
                        min={0}
                        max={1}
                        step={0.05}
                        value={matrix[i][j]}
                        onChange={(e) => setCell(i, j, Math.max(0, parseFloat(e.target.value) || 0))}
                        className="w-14 rounded-md border border-bg-border bg-bg-soft px-1 py-1 text-ink"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <Slider
            label={locale === "zh" ? "模擬步數" : "simulation steps"}
            value={steps}
            min={100}
            max={20000}
            step={100}
            onChange={setSteps}
          />
          <Button variant="subtle" size="sm" onClick={() => setSeed(Math.floor(Math.random() * 999) + 1)}>
            {locale === "zh" ? "重新抽軌跡" : "Re-roll trajectory"}
          </Button>
          <div className="rounded-xl border border-bg-border bg-bg-soft p-3 text-xs font-mono space-y-1">
            <div className="text-ink-muted normal-case">
              {locale === "zh" ? "穩態分布 π" : "Stationary π"}
            </div>
            {STATES.map((s, i) => (
              <div key={s} className="text-accent-amber">
                π({s}) = {stationary[i].toFixed(3)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
