"use client";

import { useMemo, useState } from "react";
import { Slider } from "@/components/ui/Slider";
import { Button } from "@/components/ui/Button";
import { useT } from "@/lib/i18n/useT";
import { mulberry32, randNormal } from "@/lib/math/random";
import { normal } from "@/lib/stats/distributions";

/**
 * Simulates m hypothesis tests where m₁ are true alternatives (effect size = δ)
 * and m₀ = m − m₁ are nulls. For each test we compute a one-sided z-test
 * p-value, then apply three procedures and report the false-discovery and
 * false-negative rates:
 *  - No correction (raw α)
 *  - Bonferroni (α/m)
 *  - Benjamini–Hochberg (FDR control at level α)
 */

export function MultipleTestingExplorer() {
  const { locale } = useT();
  const [m, setM] = useState(50);
  const [m1, setM1] = useState(10);
  const [delta, setDelta] = useState(2.5);
  const [alpha, setAlpha] = useState(0.05);
  const [seed, setSeed] = useState(7);

  const stats = useMemo(() => {
    const rng = mulberry32(seed);
    const trueAlt = new Array(m).fill(false);
    for (let i = 0; i < Math.min(m1, m); i++) trueAlt[i] = true;
    // p-values: under null Z ~ N(0,1); under H1 Z ~ N(delta, 1)
    const ps = new Array(m).fill(0);
    for (let i = 0; i < m; i++) {
      const z = trueAlt[i] ? randNormal(delta, 1, rng) : randNormal(0, 1, rng);
      ps[i] = 1 - normal.cdf(z);
    }

    function evaluate(reject: boolean[]) {
      let TP = 0;
      let FP = 0;
      let TN = 0;
      let FN = 0;
      for (let i = 0; i < m; i++) {
        if (reject[i] && trueAlt[i]) TP++;
        if (reject[i] && !trueAlt[i]) FP++;
        if (!reject[i] && !trueAlt[i]) TN++;
        if (!reject[i] && trueAlt[i]) FN++;
      }
      const discoveries = TP + FP;
      const fdp = discoveries > 0 ? FP / discoveries : 0;
      const power = m1 > 0 ? TP / m1 : 0;
      return { TP, FP, TN, FN, discoveries, fdp, power };
    }

    // No correction
    const noneRej = ps.map((p) => p < alpha);
    // Bonferroni
    const bonRej = ps.map((p) => p < alpha / m);
    // Benjamini–Hochberg
    const sorted = ps
      .map((p, i) => ({ p, i }))
      .sort((a, b) => a.p - b.p);
    let kStar = -1;
    for (let k = 0; k < sorted.length; k++) {
      if (sorted[k].p <= ((k + 1) / m) * alpha) kStar = k;
    }
    const bhRej = new Array(m).fill(false);
    if (kStar >= 0) for (let k = 0; k <= kStar; k++) bhRej[sorted[k].i] = true;

    return {
      none: evaluate(noneRej),
      bon: evaluate(bonRej),
      bh: evaluate(bhRej),
      ps,
      trueAlt,
    };
  }, [m, m1, delta, alpha, seed]);

  return (
    <div className="rounded-2xl border border-bg-border bg-bg-card/60 p-5">
      <div className="grid lg:grid-cols-[1fr_260px] gap-5">
        <div>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-bg-border text-ink-dim">
                <th className="text-left px-2 py-1.5">{locale === "zh" ? "方法" : "method"}</th>
                <th className="text-right px-2 py-1.5">{locale === "zh" ? "拒絕數" : "rejected"}</th>
                <th className="text-right px-2 py-1.5">{locale === "zh" ? "真陽性" : "TP"}</th>
                <th className="text-right px-2 py-1.5">{locale === "zh" ? "假陽性" : "FP"}</th>
                <th className="text-right px-2 py-1.5">FDP</th>
                <th className="text-right px-2 py-1.5">{locale === "zh" ? "檢定力" : "power"}</th>
              </tr>
            </thead>
            <tbody className="font-mono">
              <Row label={locale === "zh" ? "未校正 α" : "no correction"} s={stats.none} />
              <Row label="Bonferroni" s={stats.bon} />
              <Row label="Benjamini–Hochberg" s={stats.bh} />
            </tbody>
          </table>
          <div className="mt-3 text-xs text-ink-dim leading-relaxed">
            {locale === "zh"
              ? "未校正會放出大量假陽性。Bonferroni 把每個檢定的門檻砍到 α/m，極度保守 ── 檢定力很低。BH 控制 false discovery proportion 在 α 附近，並保留可觀的檢定力。"
              : "No correction floods you with false positives. Bonferroni clamps each test at α/m, which is extremely conservative — power tanks. BH targets the false discovery proportion at level α and preserves substantial power."}
          </div>
          {/* Strip showing tests as coloured cells */}
          <div className="mt-3">
            <div className="text-xs text-ink-muted mb-1">
              {locale === "zh" ? "全部 m 個檢定（綠 = 真效應，紅 = 真實虛無）" : "all m tests (green = true effect, red = null)"}
            </div>
            <div className="flex flex-wrap gap-[2px]">
              {stats.ps.map((p, i) => (
                <span
                  key={i}
                  className={`inline-block w-2.5 h-2.5 rounded-sm ${
                    stats.trueAlt[i] ? "bg-accent-green" : "bg-accent-rose"
                  }`}
                  style={{ opacity: 0.3 + 0.7 * (1 - Math.min(1, p / 0.1)) }}
                  title={`test ${i}: p=${p.toFixed(3)}, ${stats.trueAlt[i] ? "alt" : "null"}`}
                />
              ))}
            </div>
            <div className="mt-1 text-[10px] text-ink-muted">
              {locale === "zh" ? "顏色越亮 = p 值越小" : "brighter = smaller p-value"}
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <Slider label={locale === "zh" ? "m（檢定總數）" : "m (number of tests)"} value={m} min={5} max={500} step={1} onChange={setM} />
          <Slider label={locale === "zh" ? "m₁（真效應數）" : "m₁ (true effects)"} value={m1} min={0} max={m} step={1} onChange={setM1} />
          <Slider label={locale === "zh" ? "效應大小 δ" : "effect size δ"} value={delta} min={0} max={5} step={0.1} onChange={setDelta} format={(v) => v.toFixed(2)} />
          <Slider label="α" value={alpha} min={0.001} max={0.2} step={0.001} onChange={setAlpha} format={(v) => v.toFixed(3)} />
          <Button variant="subtle" size="sm" onClick={() => setSeed(Math.floor(Math.random() * 999) + 1)}>
            {locale === "zh" ? "重新抽" : "Re-sample"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  s,
}: {
  label: string;
  s: { discoveries: number; TP: number; FP: number; fdp: number; power: number };
}) {
  return (
    <tr className="border-b border-bg-border">
      <td className="px-2 py-1.5 text-ink">{label}</td>
      <td className="text-right px-2 py-1.5 text-ink">{s.discoveries}</td>
      <td className="text-right px-2 py-1.5 text-accent-green">{s.TP}</td>
      <td className="text-right px-2 py-1.5 text-accent-rose">{s.FP}</td>
      <td className="text-right px-2 py-1.5 text-accent-amber">{(s.fdp * 100).toFixed(1)}%</td>
      <td className="text-right px-2 py-1.5 text-accent">{(s.power * 100).toFixed(1)}%</td>
    </tr>
  );
}
