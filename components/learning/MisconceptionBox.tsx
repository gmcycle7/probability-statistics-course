import { AlertTriangle } from "lucide-react";

export type Misconception = {
  wrong: string;
  right: string;
  why?: string;
};

export function MisconceptionBox({ items }: { items: Misconception[] }) {
  return (
    <div className="my-6 rounded-2xl border border-accent-rose/30 bg-accent-rose/5 p-5">
      <div className="flex items-center gap-2 text-accent-rose text-xs uppercase tracking-[0.18em] mb-3">
        <AlertTriangle className="h-3.5 w-3.5" /> Common misconceptions
      </div>
      <div className="space-y-4">
        {items.map((m, i) => (
          <div key={i} className="rounded-xl border border-bg-border bg-bg-card/60 p-4">
            <div className="text-sm">
              <span className="font-mono text-[10px] uppercase tracking-wider text-accent-rose mr-2">
                myth
              </span>
              <span className="text-ink-dim">{m.wrong}</span>
            </div>
            <div className="mt-1.5 text-sm">
              <span className="font-mono text-[10px] uppercase tracking-wider text-accent-green mr-2">
                truth
              </span>
              <span className="text-ink">{m.right}</span>
            </div>
            {m.why && (
              <div className="mt-2 text-xs text-ink-muted leading-relaxed">
                {m.why}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
