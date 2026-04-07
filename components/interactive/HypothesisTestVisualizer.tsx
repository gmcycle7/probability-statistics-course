"use client";

import { useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Slider } from "@/components/ui/Slider";
import { normal } from "@/lib/stats/distributions";
import { linspace } from "@/lib/stats/summary";
import { useT } from "@/lib/i18n/useT";

/**
 * Two-sided z-test for the mean of a Normal(μ, σ²) with σ known.
 * H0: μ = μ0    H1: μ ≠ μ0
 */
export function HypothesisTestVisualizer() {
  const { t } = useT();
  const [mu0, setMu0] = useState(0);
  const [mu1, setMu1] = useState(0.5);
  const [sigma, setSigma] = useState(1);
  const [n, setN] = useState(25);
  const [alpha, setAlpha] = useState(0.05);

  const se = sigma / Math.sqrt(n);

  // Two-sided rejection region under H0
  const zCrit = useMemo(() => normal.quantile(1 - alpha / 2), [alpha]);
  const lo = mu0 - zCrit * se;
  const hi = mu0 + zCrit * se;

  // Power: P( reject | μ = μ1 )
  const power = useMemo(() => {
    return 1 - (normal.cdf(hi, mu1, se) - normal.cdf(lo, mu1, se));
  }, [hi, lo, mu1, se]);
  const beta = 1 - power;

  const data = useMemo(() => {
    const span = Math.max(4 * se, Math.abs(mu1 - mu0) + 4 * se);
    const xs = linspace(mu0 - span, mu0 + span, 240);
    return xs.map((x) => ({
      x,
      h0: normal.pdf(x, mu0, se),
      h1: normal.pdf(x, mu1, se),
      // shaded "type I" region under H0 outside the accept band
      typeI: x < lo || x > hi ? normal.pdf(x, mu0, se) : 0,
      // shaded "type II" region under H1 inside the accept band
      typeII: x >= lo && x <= hi ? normal.pdf(x, mu1, se) : 0,
    }));
  }, [mu0, mu1, sigma, n, alpha, se, lo, hi]);

  return (
    <div className="rounded-2xl border border-bg-border bg-bg-card/60 p-5">
      <div className="grid lg:grid-cols-[1fr_260px] gap-5">
        <div style={{ width: "100%", height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
              <CartesianGrid stroke="#222b46" strokeDasharray="3 3" />
              <XAxis dataKey="x" type="number" tickFormatter={(v) => Number(v).toFixed(2)} stroke="#9aa4bf" />
              <YAxis stroke="#9aa4bf" />
              <Tooltip formatter={(v: number) => v.toFixed(3)} labelFormatter={(v) => `x̄ = ${Number(v).toFixed(3)}`} />
              <Area type="monotone" dataKey="h0" name="H₀" stroke="#7c9cff" fill="#7c9cff" fillOpacity={0.18} />
              <Area type="monotone" dataKey="h1" name="H₁" stroke="#5fd0a4" fill="#5fd0a4" fillOpacity={0.18} />
              <Area type="monotone" dataKey="typeI" name="α" stroke="#ff7a9a" fill="#ff7a9a" fillOpacity={0.55} />
              <Area type="monotone" dataKey="typeII" name="β" stroke="#ffc46b" fill="#ffc46b" fillOpacity={0.55} />
              <ReferenceLine x={lo} stroke="#9aa4bf" strokeDasharray="3 3" />
              <ReferenceLine x={hi} stroke="#9aa4bf" strokeDasharray="3 3" />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-4">
          <Slider label={t("sim.mu0")} value={mu0} min={-3} max={3} step={0.05} onChange={setMu0} format={(v) => v.toFixed(2)} />
          <Slider label={t("sim.mu1")} value={mu1} min={-3} max={3} step={0.05} onChange={setMu1} format={(v) => v.toFixed(2)} />
          <Slider label="σ" value={sigma} min={0.1} max={3} step={0.05} onChange={setSigma} format={(v) => v.toFixed(2)} />
          <Slider label="n" value={n} min={2} max={500} step={1} onChange={setN} />
          <Slider label="α" value={alpha} min={0.001} max={0.2} step={0.001} onChange={setAlpha} format={(v) => v.toFixed(3)} />

          <div className="rounded-xl border border-bg-border bg-bg-soft p-3 text-xs space-y-1.5 font-mono">
            <Row label={t("sim.se")} v={se.toFixed(3)} />
            <Row label={t("sim.rejectIf")} v={lo.toFixed(3)} c="rose" />
            <Row label={t("sim.orXBar")} v={hi.toFixed(3)} c="rose" />
            <Row label={t("sim.alphaLevel")} v={alpha.toFixed(3)} />
            <Row label={t("sim.beta")} v={beta.toFixed(3)} c="amber" />
            <Row label={t("sim.power")} v={power.toFixed(3)} c="green" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, v, c }: { label: string; v: string; c?: "rose" | "amber" | "green" }) {
  const cls =
    c === "rose"
      ? "text-accent-rose"
      : c === "amber"
        ? "text-accent-amber"
        : c === "green"
          ? "text-accent-green"
          : "text-ink";
  return (
    <div className="flex justify-between">
      <span className="text-ink-muted">{label}</span>
      <span className={cls}>{v}</span>
    </div>
  );
}
