"use client";

import { useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Slider } from "@/components/ui/Slider";
import { Button } from "@/components/ui/Button";
import { beta } from "@/lib/stats/distributions";
import { linspace } from "@/lib/stats/summary";

export function BayesUpdater() {
  const [alpha0, setAlpha0] = useState(2);
  const [beta0, setBeta0] = useState(2);
  const [heads, setHeads] = useState(0);
  const [tails, setTails] = useState(0);

  const data = useMemo(() => {
    const xs = linspace(0.001, 0.999, 200);
    const a1 = alpha0 + heads;
    const b1 = beta0 + tails;
    return xs.map((x) => ({
      x,
      prior: beta.pdf(x, alpha0, beta0),
      posterior: beta.pdf(x, a1, b1),
    }));
  }, [alpha0, beta0, heads, tails]);

  const a1 = alpha0 + heads;
  const b1 = beta0 + tails;
  const postMean = a1 / (a1 + b1);
  const postMode = a1 > 1 && b1 > 1 ? (a1 - 1) / (a1 + b1 - 2) : NaN;

  return (
    <div className="rounded-2xl border border-bg-border bg-bg-card/60 p-5">
      <div className="grid lg:grid-cols-[1fr_260px] gap-5">
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
              <CartesianGrid stroke="#222b46" strokeDasharray="3 3" />
              <XAxis dataKey="x" type="number" tickFormatter={(v) => v.toFixed(2)} stroke="#9aa4bf" />
              <YAxis stroke="#9aa4bf" tickFormatter={(v) => v.toFixed(1)} />
              <Tooltip
                formatter={(v: number) => v.toFixed(3)}
                labelFormatter={(v) => `θ = ${Number(v).toFixed(3)}`}
              />
              <Area type="monotone" dataKey="prior" stroke="#9aa4bf" fill="#9aa4bf" fillOpacity={0.15} name="prior" />
              <Area type="monotone" dataKey="posterior" stroke="#7c9cff" fill="#7c9cff" fillOpacity={0.35} name="posterior" />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-4">
          <div className="text-xs text-ink-muted uppercase tracking-wider">Prior · Beta(α₀, β₀)</div>
          <Slider label="α₀" value={alpha0} min={0.5} max={20} step={0.1} onChange={setAlpha0} format={(v) => v.toFixed(1)} />
          <Slider label="β₀" value={beta0} min={0.5} max={20} step={0.1} onChange={setBeta0} format={(v) => v.toFixed(1)} />

          <div className="text-xs text-ink-muted uppercase tracking-wider mt-3">Coin tosses observed</div>
          <div className="grid grid-cols-2 gap-2">
            <Button size="sm" variant="subtle" onClick={() => setHeads((h) => h + 1)}>
              + heads ({heads})
            </Button>
            <Button size="sm" variant="subtle" onClick={() => setTails((t) => t + 1)}>
              + tails ({tails})
            </Button>
          </div>
          <Button size="sm" variant="ghost" onClick={() => { setHeads(0); setTails(0); }}>
            reset evidence
          </Button>

          <div className="rounded-xl border border-bg-border bg-bg-soft p-3 text-xs space-y-1 font-mono">
            <div className="text-ink-muted normal-case tracking-normal">posterior</div>
            <div>Beta({a1.toFixed(1)}, {b1.toFixed(1)})</div>
            <div className="text-accent-amber">mean = {postMean.toFixed(3)}</div>
            {!Number.isNaN(postMode) && (
              <div className="text-accent">mode = {postMode.toFixed(3)}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
