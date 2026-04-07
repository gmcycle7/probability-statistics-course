"use client";

import { cn } from "@/lib/cn";
import { useState } from "react";

export function Tabs({
  tabs,
  initial = 0,
  className,
}: {
  tabs: { label: string; content: React.ReactNode }[];
  initial?: number;
  className?: string;
}) {
  const [active, setActive] = useState(initial);
  return (
    <div className={cn("w-full", className)}>
      <div className="flex flex-wrap gap-1 border-b border-bg-border mb-4">
        {tabs.map((t, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={cn(
              "px-3 py-2 text-sm rounded-t-lg border-b-2 transition-colors",
              i === active
                ? "border-accent text-accent"
                : "border-transparent text-ink-dim hover:text-ink",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div>{tabs[active]?.content}</div>
    </div>
  );
}
