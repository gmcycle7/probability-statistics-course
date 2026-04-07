import { BlockMath } from "react-katex";
import { cn } from "@/lib/cn";

export function FormulaBlock({
  formula,
  caption,
  question,
  className,
}: {
  formula: string;
  /** Short label rendered below the formula. */
  caption?: string;
  /** "What question does this formula answer?" — surfaces meaning, not just notation. */
  question?: string;
  className?: string;
}) {
  return (
    <figure
      className={cn(
        "my-4 rounded-2xl border border-bg-border bg-bg-soft/60 px-5 py-4",
        className,
      )}
    >
      {question && (
        <div className="mb-2 text-xs uppercase tracking-wider text-accent/80">
          What this answers · {question}
        </div>
      )}
      <div className="overflow-x-auto">
        <BlockMath math={formula} />
      </div>
      {caption && (
        <figcaption className="mt-2 text-xs text-ink-muted">{caption}</figcaption>
      )}
    </figure>
  );
}
