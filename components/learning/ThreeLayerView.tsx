"use client";

import { ReactNode } from "react";
import { Tabs } from "@/components/ui/Tabs";
import { Eye, FunctionSquare, Telescope } from "lucide-react";

export function ThreeLayerView({
  intuition,
  formal,
  graduate,
}: {
  intuition: ReactNode;
  formal: ReactNode;
  graduate: ReactNode;
}) {
  return (
    <div className="my-8">
      <Tabs
        tabs={[
          {
            label: "Level 1 · Intuition",
            content: (
              <div className="rounded-2xl border border-bg-border bg-bg-card/60 p-5">
                <div className="flex items-center gap-2 text-accent-amber text-xs uppercase tracking-[0.18em] mb-3">
                  <Eye className="h-3.5 w-3.5" /> Intuition first
                </div>
                <div className="text-ink leading-relaxed">{intuition}</div>
              </div>
            ),
          },
          {
            label: "Level 2 · Formalism",
            content: (
              <div className="rounded-2xl border border-bg-border bg-bg-card/60 p-5">
                <div className="flex items-center gap-2 text-accent text-xs uppercase tracking-[0.18em] mb-3">
                  <FunctionSquare className="h-3.5 w-3.5" /> Mathematical
                  definition
                </div>
                <div className="text-ink leading-relaxed">{formal}</div>
              </div>
            ),
          },
          {
            label: "Level 3 · Graduate insight",
            content: (
              <div className="rounded-2xl border border-bg-border bg-bg-card/60 p-5">
                <div className="flex items-center gap-2 text-accent-violet text-xs uppercase tracking-[0.18em] mb-3">
                  <Telescope className="h-3.5 w-3.5" /> Graduate-level insight
                </div>
                <div className="text-ink leading-relaxed">{graduate}</div>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
