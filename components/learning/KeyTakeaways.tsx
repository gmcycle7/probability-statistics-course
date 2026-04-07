"use client";

import { CheckCircle2 } from "lucide-react";
import { useT } from "@/lib/i18n/useT";

export function KeyTakeaways({ items }: { items: string[] }) {
  const { t } = useT();
  return (
    <div className="my-6 rounded-2xl border border-accent-green/30 bg-accent-green/5 p-5">
      <div className="text-xs uppercase tracking-[0.18em] text-accent-green mb-3">
        {t("common.takeaways")}
      </div>
      <ul className="space-y-2.5">
        {items.map((tt, i) => (
          <li key={i} className="flex items-start gap-2.5 text-ink leading-relaxed">
            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent-green" />
            <span>{tt}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
