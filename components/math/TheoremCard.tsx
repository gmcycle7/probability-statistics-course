import { ReactNode } from "react";
import { BlockMath } from "react-katex";
import { cn } from "@/lib/cn";

type Kind = "theorem" | "definition" | "lemma" | "corollary" | "proposition";

const palette: Record<Kind, { ring: string; text: string; label: string }> = {
  theorem: { ring: "border-accent/40", text: "text-accent", label: "Theorem" },
  definition: {
    ring: "border-accent-violet/40",
    text: "text-accent-violet",
    label: "Definition",
  },
  lemma: {
    ring: "border-accent-green/40",
    text: "text-accent-green",
    label: "Lemma",
  },
  corollary: {
    ring: "border-accent-amber/40",
    text: "text-accent-amber",
    label: "Corollary",
  },
  proposition: {
    ring: "border-accent-rose/40",
    text: "text-accent-rose",
    label: "Proposition",
  },
};

export function TheoremCard({
  kind = "theorem",
  name,
  statement,
  formula,
  children,
  className,
}: {
  kind?: Kind;
  name?: string;
  statement?: ReactNode;
  formula?: string;
  children?: ReactNode;
  className?: string;
}) {
  const p = palette[kind];
  return (
    <div
      className={cn(
        "my-5 rounded-2xl border bg-bg-card/70 px-5 py-4 shadow-card",
        p.ring,
        className,
      )}
    >
      <div className={cn("text-[11px] uppercase tracking-[0.18em] mb-1.5", p.text)}>
        {p.label}
        {name ? ` · ${name}` : ""}
      </div>
      {statement && <div className="text-ink leading-relaxed">{statement}</div>}
      {formula && (
        <div className="mt-2 overflow-x-auto">
          <BlockMath math={formula} />
        </div>
      )}
      {children && <div className="mt-2 text-ink-dim text-sm">{children}</div>}
    </div>
  );
}
