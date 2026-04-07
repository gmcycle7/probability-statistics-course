import { cn } from "@/lib/cn";

const tones = {
  default: "border-bg-border bg-bg-soft text-ink-dim",
  accent: "border-accent/40 bg-accent/10 text-accent",
  green: "border-accent-green/40 bg-accent-green/10 text-accent-green",
  amber: "border-accent-amber/40 bg-accent-amber/10 text-accent-amber",
  rose: "border-accent-rose/40 bg-accent-rose/10 text-accent-rose",
  violet: "border-accent-violet/40 bg-accent-violet/10 text-accent-violet",
} as const;

export function Badge({
  tone = "default",
  children,
  className,
}: {
  tone?: keyof typeof tones;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
