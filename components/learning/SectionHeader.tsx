import { ReactNode } from "react";

export function SectionHeader({
  step,
  title,
  blurb,
}: {
  step?: number | string;
  title: string;
  blurb?: ReactNode;
}) {
  return (
    <div className="mt-10 mb-4">
      <div className="flex items-baseline gap-3">
        {step !== undefined && (
          <span className="font-mono text-xs text-accent">{String(step).padStart(2, "0")}</span>
        )}
        <h2 className="text-2xl font-semibold text-ink">{title}</h2>
      </div>
      {blurb && <p className="mt-1.5 text-ink-dim leading-relaxed">{blurb}</p>}
    </div>
  );
}
