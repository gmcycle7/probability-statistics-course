"use client";

import { useMemo, useState } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Line,
  ComposedChart,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Slider } from "@/components/ui/Slider";
import { Button } from "@/components/ui/Button";
import { useT } from "@/lib/i18n/useT";
import { mulberry32, randNormal } from "@/lib/math/random";
import { mean } from "@/lib/stats/summary";

/**
 * Simulates a Simpson's-paradox / confounder dataset.
 *
 * True causal model: Y = β·X + γ·Z + ε
 * The user controls the slope of true effect (β), the confounder strength (γ),
 * and how much Z drives X (correlation between X and Z).
 *
 * Marginal X→Y can show a slope very different from β when Z is omitted.
 * The "controlled" view splits the points by Z bins and computes the slope
 * inside each bin: those slopes recover something close to β.
 */

function fitOLS(xs: number[], ys: number[]): { a: number; b: number } {
  const n = xs.length;
  const xb = mean(xs);
  const yb = mean(ys);
  let num = 0;
  let den = 0;
  for (let i = 0; i < n; i++) {
    num += (xs[i] - xb) * (ys[i] - yb);
    den += (xs[i] - xb) ** 2;
  }
  const b = den === 0 ? 0 : num / den;
  return { a: yb - b * xb, b };
}

export function CausationLab() {
  const { locale } = useT();
  const [trueBeta, setTrueBeta] = useState(0.4);
  const [confounderStrength, setConfounderStrength] = useState(2.5);
  const [confounderToX, setConfounderToX] = useState(0.8);
  const [n, setN] = useState(200);
  const [seed, setSeed] = useState(7);

  const data = useMemo(() => {
    const rng = mulberry32(seed);
    type Pt = { x: number; y: number; z: number; group: 0 | 1 | 2 };
    const points: Pt[] = [];
    for (let i = 0; i < n; i++) {
      // Confounder Z is binary (group), but let's use 3 groups for clarity
      const u = rng();
      const z = u < 0.33 ? -1 : u < 0.66 ? 0 : 1;
      const x = confounderToX * z + randNormal(0, 0.6, rng);
      const y = trueBeta * x + confounderStrength * z + randNormal(0, 0.5, rng);
      points.push({ x, y, z, group: (z + 1) as 0 | 1 | 2 });
    }
    // Marginal slope (ignoring Z)
    const marg = fitOLS(points.map((p) => p.x), points.map((p) => p.y));
    // Per-group slopes
    const slopes = [0, 1, 2].map((g) => {
      const pts = points.filter((p) => p.group === g);
      return pts.length >= 2 ? fitOLS(pts.map((p) => p.x), pts.map((p) => p.y)) : { a: 0, b: 0 };
    });
    // Lines for plotting
    const xMin = Math.min(...points.map((p) => p.x));
    const xMax = Math.max(...points.map((p) => p.x));
    const margLine = [
      { x: xMin, y: marg.a + marg.b * xMin },
      { x: xMax, y: marg.a + marg.b * xMax },
    ];
    const groupLines = slopes.map((s, gi) => {
      const pts = points.filter((p) => p.group === gi);
      if (pts.length < 2) return [];
      const xMinG = Math.min(...pts.map((p) => p.x));
      const xMaxG = Math.max(...pts.map((p) => p.x));
      return [
        { x: xMinG, y: s.a + s.b * xMinG },
        { x: xMaxG, y: s.a + s.b * xMaxG },
      ];
    });
    return { points, marg, margLine, slopes, groupLines };
  }, [trueBeta, confounderStrength, confounderToX, n, seed]);

  const colors = ["#7c9cff", "#5fd0a4", "#b08bff"];

  return (
    <div className="rounded-2xl border border-bg-border bg-bg-card/60 p-5">
      <div className="grid lg:grid-cols-[1fr_260px] gap-5">
        <div style={{ width: "100%", height: 340 }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
              <CartesianGrid stroke="#222b46" strokeDasharray="3 3" />
              <XAxis dataKey="x" type="number" stroke="#9aa4bf" tickFormatter={(v) => Number(v).toFixed(1)} />
              <YAxis dataKey="y" type="number" stroke="#9aa4bf" tickFormatter={(v) => Number(v).toFixed(1)} />
              <Tooltip formatter={(v: number) => Number(v).toFixed(2)} />
              {[0, 1, 2].map((gi) => (
                <Scatter
                  key={gi}
                  data={data.points.filter((p) => p.group === gi)}
                  fill={colors[gi]}
                  name={`Z=${gi - 1}`}
                />
              ))}
              <Line data={data.margLine} dataKey="y" type="linear" stroke="#ffc46b" strokeWidth={2.5} dot={false} name={locale === "zh" ? "邊際斜率（忽略 Z）" : "marginal slope (ignore Z)"} />
              {data.groupLines.map((gl, i) => (
                <Line
                  key={"gl" + i}
                  data={gl}
                  dataKey="y"
                  type="linear"
                  stroke={colors[i]}
                  strokeWidth={1.5}
                  strokeDasharray="4 3"
                  dot={false}
                  name={`slope|Z=${i - 1}`}
                />
              ))}
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </ComposedChart>
          </ResponsiveContainer>
          <div className="mt-2 text-xs text-ink-dim leading-relaxed">
            {locale === "zh"
              ? "點按 Z 分組著色。橘色粗線是「忽略 Z 的邊際迴歸斜率」；三條彩色虛線是「在每組 Z 之內」的迴歸斜率。把 confounder 強度拉大，邊際斜率會被推到完全相反的方向 ── 這就是 Simpson 悖論。"
              : "Points coloured by Z. Amber line = marginal regression slope (ignoring Z). Coloured dashed lines = slope within each Z group. Crank confounder strength up — the marginal slope can flip sign relative to the within-group slopes. That's Simpson's paradox."}
          </div>
        </div>
        <div className="space-y-4">
          <Slider label={locale === "zh" ? "真實因果斜率 β" : "true causal slope β"} value={trueBeta} min={-1.5} max={1.5} step={0.05} onChange={setTrueBeta} format={(v) => v.toFixed(2)} />
          <Slider label={locale === "zh" ? "Confounder 對 Y 的影響 γ" : "confounder → Y strength γ"} value={confounderStrength} min={0} max={5} step={0.05} onChange={setConfounderStrength} format={(v) => v.toFixed(2)} />
          <Slider label={locale === "zh" ? "Confounder 對 X 的影響" : "confounder → X strength"} value={confounderToX} min={-2} max={2} step={0.05} onChange={setConfounderToX} format={(v) => v.toFixed(2)} />
          <Slider label="n" value={n} min={30} max={500} step={5} onChange={setN} />
          <Button variant="subtle" size="sm" onClick={() => setSeed(Math.floor(Math.random() * 999) + 1)}>
            {locale === "zh" ? "重新抽" : "Re-sample"}
          </Button>
          <div className="rounded-xl border border-bg-border bg-bg-soft p-3 text-xs font-mono space-y-1">
            <div className="text-ink-muted normal-case">
              {locale === "zh" ? "邊際 vs 條件斜率" : "marginal vs conditional"}
            </div>
            <div className="text-accent-amber">marginal β̂ = {data.marg.b.toFixed(3)}</div>
            <div>true β = {trueBeta.toFixed(3)}</div>
            <div className="mt-2 text-ink-muted normal-case">slope | Z</div>
            {data.slopes.map((s, i) => (
              <div key={i} style={{ color: colors[i] }}>
                Z={i - 1}: β̂ = {s.b.toFixed(3)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
