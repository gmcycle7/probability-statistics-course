"use client";

import { ReactNode } from "react";
import { Tabs } from "@/components/ui/Tabs";
import { Eye, FunctionSquare, Telescope } from "lucide-react";
import { useT } from "@/lib/i18n/useT";

export function ThreeLayerView({
  intuition,
  formal,
  graduate,
}: {
  intuition: ReactNode;
  formal: ReactNode;
  graduate: ReactNode;
}) {
  const { t } = useT();
  return (
    <div className="my-8">
      <Tabs
        tabs={[
          {
            label: t("layer.l1"),
            content: (
              <div className="rounded-2xl border border-bg-border bg-bg-card/60 p-5">
                <div className="flex items-center gap-2 text-accent-amber text-xs uppercase tracking-[0.18em] mb-3">
                  <Eye className="h-3.5 w-3.5" /> {t("layer.l1.label")}
                </div>
                <div className="text-ink leading-relaxed">{intuition}</div>
              </div>
            ),
          },
          {
            label: t("layer.l2"),
            content: (
              <div className="rounded-2xl border border-bg-border bg-bg-card/60 p-5">
                <div className="flex items-center gap-2 text-accent text-xs uppercase tracking-[0.18em] mb-3">
                  <FunctionSquare className="h-3.5 w-3.5" /> {t("layer.l2.label")}
                </div>
                <div className="text-ink leading-relaxed">{formal}</div>
              </div>
            ),
          },
          {
            label: t("layer.l3"),
            content: (
              <div className="rounded-2xl border border-bg-border bg-bg-card/60 p-5">
                <div className="flex items-center gap-2 text-accent-violet text-xs uppercase tracking-[0.18em] mb-3">
                  <Telescope className="h-3.5 w-3.5" /> {t("layer.l3.label")}
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
