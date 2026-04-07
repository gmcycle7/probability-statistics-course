"use client";

import { useState } from "react";
import { BlockMath } from "react-katex";
import { ChevronRight, ChevronLeft, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useT } from "@/lib/i18n/useT";

export type ProofStep = {
  /** Plain-language reasoning rendered as the step's title. */
  title: string;
  /** Optional KaTeX line that this step produces. */
  math?: string;
  /** Optional explanatory paragraph. */
  reason?: string;
};

export function ProofStepper({
  title,
  steps,
}: {
  title?: string;
  steps: ProofStep[];
}) {
  const { t } = useT();
  const [index, setIndex] = useState(0);
  const visible = steps.slice(0, index + 1);
  const atEnd = index >= steps.length - 1;

  return (
    <div className="my-5 rounded-2xl border border-bg-border bg-bg-soft/60 p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs uppercase tracking-[0.18em] text-accent/80">
          {title ?? t("common.derivation")}
        </div>
        <div className="text-xs text-ink-muted">
          {t("common.step")} {index + 1} / {steps.length}
        </div>
      </div>

      <ol className="space-y-3">
        {visible.map((step, i) => (
          <li
            key={i}
            className="rounded-xl border border-bg-border bg-bg-card/60 px-4 py-3"
          >
            <div className="flex items-start gap-3">
              <span className="mt-0.5 grid h-6 w-6 place-items-center rounded-full bg-accent/15 text-accent text-xs font-semibold">
                {i + 1}
              </span>
              <div className="flex-1">
                <div className="text-ink font-medium">{step.title}</div>
                {step.math && (
                  <div className="mt-1 overflow-x-auto">
                    <BlockMath math={step.math} />
                  </div>
                )}
                {step.reason && (
                  <div className="mt-1 text-sm text-ink-dim">{step.reason}</div>
                )}
              </div>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-4 flex items-center gap-2">
        <Button
          variant="subtle"
          size="sm"
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0}
        >
          <ChevronLeft className="h-4 w-4" /> {t("common.back")}
        </Button>
        <Button
          size="sm"
          onClick={() => setIndex((i) => Math.min(steps.length - 1, i + 1))}
          disabled={atEnd}
        >
          {t("common.next")} <ChevronRight className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setIndex(0)}>
          <RotateCcw className="h-4 w-4" /> {t("common.restart")}
        </Button>
        {atEnd && (
          <span className="ml-auto text-xs text-accent-green">
            {t("common.complete")}
          </span>
        )}
      </div>
    </div>
  );
}
