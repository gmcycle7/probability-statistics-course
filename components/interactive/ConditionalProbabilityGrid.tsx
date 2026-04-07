"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/Slider";

/**
 * Visualizes a 2-event joint distribution as a 100×100 grid.
 * Lets the user manipulate P(A), P(B|A), P(B|¬A), then read off
 * P(A∩B), P(B), P(A|B) — all interactively, without numbers first.
 */
export function ConditionalProbabilityGrid() {
  const [pA, setPA] = useState(0.3);
  const [pBgivenA, setPBgivenA] = useState(0.8);
  const [pBgivenNotA, setPBgivenNotA] = useState(0.1);

  const pNotA = 1 - pA;
  const pAB = pA * pBgivenA;
  const pNotAB = pNotA * pBgivenNotA;
  const pB = pAB + pNotAB;
  const pAgivenB = pB > 0 ? pAB / pB : 0;

  // Layout: x-axis splits A vs ¬A, y-axis splits B vs ¬B
  const W = 320;
  const H = 220;
  const xA = pA * W;

  return (
    <div className="rounded-2xl border border-bg-border bg-bg-card/60 p-5">
      <div className="grid lg:grid-cols-[1fr_260px] gap-5">
        <div>
          <svg viewBox={`0 0 ${W} ${H + 28}`} className="w-full h-auto">
            {/* full sample space outline */}
            <rect x={0} y={0} width={W} height={H} fill="#11172b" stroke="#222b46" />

            {/* A ∩ B (top-left) */}
            <rect
              x={0}
              y={0}
              width={xA}
              height={pBgivenA * H}
              fill="#7c9cff"
              fillOpacity={0.65}
            />
            {/* A ∩ ¬B */}
            <rect
              x={0}
              y={pBgivenA * H}
              width={xA}
              height={(1 - pBgivenA) * H}
              fill="#7c9cff"
              fillOpacity={0.18}
            />
            {/* ¬A ∩ B */}
            <rect
              x={xA}
              y={0}
              width={W - xA}
              height={pBgivenNotA * H}
              fill="#5fd0a4"
              fillOpacity={0.65}
            />
            {/* ¬A ∩ ¬B */}
            <rect
              x={xA}
              y={pBgivenNotA * H}
              width={W - xA}
              height={(1 - pBgivenNotA) * H}
              fill="#5fd0a4"
              fillOpacity={0.18}
            />

            {/* dividers */}
            <line x1={xA} y1={0} x2={xA} y2={H} stroke="#0b1020" strokeWidth={2} />

            {/* A label */}
            <text x={xA / 2} y={H + 18} textAnchor="middle" fill="#9aa4bf" fontSize={11}>
              A ({(pA * 100).toFixed(0)}%)
            </text>
            <text x={xA + (W - xA) / 2} y={H + 18} textAnchor="middle" fill="#9aa4bf" fontSize={11}>
              ¬A ({((1 - pA) * 100).toFixed(0)}%)
            </text>

            {/* B label = darker portions on top */}
            <text x={6} y={14} fill="#e6eaf2" fontSize={11}>
              B (dark)
            </text>
          </svg>
          <div className="mt-1 text-xs text-ink-muted">
            Width = P(A); inside each column, the dark band is P(B | A) (or P(B | ¬A)).
            The dark area equals P(A∩B) + P(¬A∩B) = P(B). Bayes&apos; rule reads off as the dark
            area inside A divided by the total dark area.
          </div>
        </div>
        <div className="space-y-4">
          <Slider label="P(A)" value={pA} min={0.01} max={0.99} step={0.01} onChange={setPA} format={(v) => v.toFixed(2)} />
          <Slider label="P(B | A)" value={pBgivenA} min={0} max={1} step={0.01} onChange={setPBgivenA} format={(v) => v.toFixed(2)} />
          <Slider label="P(B | ¬A)" value={pBgivenNotA} min={0} max={1} step={0.01} onChange={setPBgivenNotA} format={(v) => v.toFixed(2)} />

          <div className="rounded-xl border border-bg-border bg-bg-soft p-3 text-xs font-mono space-y-1">
            <Row label="P(A ∩ B)" v={pAB.toFixed(3)} />
            <Row label="P(B)" v={pB.toFixed(3)} />
            <Row label="P(A | B)" v={pAgivenB.toFixed(3)} accent />
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, v, accent }: { label: string; v: string; accent?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-ink-muted">{label}</span>
      <span className={accent ? "text-accent-amber" : "text-ink"}>{v}</span>
    </div>
  );
}
