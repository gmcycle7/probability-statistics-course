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
  Legend,
} from "recharts";
import { Slider } from "@/components/ui/Slider";
import { Button } from "@/components/ui/Button";
import { mulberry32, randBernoulli } from "@/lib/math/random";
import { useT } from "@/lib/i18n/useT";

type Run = { i: number; r1: number; r2: number; r3: number };

export function LLNSimulator() {
  const { t } = useT();
  const [p, setP] = useState(0.3);
  const [steps, setSteps] = useState(1000);
  const [seed, setSeed] = useState(7);

  const data = useMemo<Run[]>(() => {
    const rngs = [
      mulberry32(seed),
      mulberry32(seed * 31 + 11),
      mulberry32(seed * 97 + 5),
    ];
    const sums = [0, 0, 0];
    const out: Run[] = [];
    for (let i = 1; i <= steps; i++) {
      sums[0] += randBernoulli(p, rngs[0]);
      sums[1] += randBernoulli(p, rngs[1]);
      sums[2] += randBernoulli(p, rngs[2]);
      if (i % Math.max(1, Math.floor(steps / 400)) === 0 || i === steps) {
        out.push({
          i,
          r1: sums[0] / i,
          r2: sums[1] / i,
          r3: sums[2] / i,
        });
      }
    }
    return out;
  }, [p, steps, seed]);

  return (
    <div className="rounded-2xl border border-bg-border bg-bg-card/60 p-5">
      <div className="grid lg:grid-cols-[1fr_240px] gap-5">
        <div style={{ width: "100%", height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
              <CartesianGrid stroke="#222b46" strokeDasharray="3 3" />
              <XAxis dataKey="i" stroke="#9aa4bf" />
              <YAxis domain={[0, 1]} stroke="#9aa4bf" tickFormatter={(v) => v.toFixed(2)} />
              <Tooltip formatter={(v: number) => v.toFixed(3)} labelFormatter={(v) => `n = ${v}`} />
              <ReferenceLine y={p} stroke="#ffc46b" strokeDasharray="4 4" label={{ value: `p=${p}`, fill: "#ffc46b", position: "insideTopRight", fontSize: 11 }} />
              <Line type="monotone" dataKey="r1" stroke="#7c9cff" dot={false} name="run 1" />
              <Line type="monotone" dataKey="r2" stroke="#5fd0a4" dot={false} name="run 2" />
              <Line type="monotone" dataKey="r3" stroke="#b08bff" dot={false} name="run 3" />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-4">
          <Slider label={t("sim.bernoulliP")} value={p} min={0.01} max={0.99} step={0.01} onChange={setP} format={(v) => v.toFixed(2)} />
          <Slider label={t("sim.trialsPerRun")} value={steps} min={50} max={5000} step={50} onChange={setSteps} />
          <Slider label={t("sim.seedShort")} value={seed} min={1} max={999} step={1} onChange={setSeed} />
          <Button variant="subtle" size="sm" onClick={() => setSeed(Math.floor(Math.random() * 999) + 1)}>
            {t("sim.reroll")}
          </Button>
          <div className="text-xs text-ink-dim leading-relaxed">{t("sim.lln.hint")}</div>
        </div>
      </div>
    </div>
  );
}
