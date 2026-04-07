"use client";

import { Badge } from "@/components/ui/Badge";
import { useT } from "@/lib/i18n/useT";

export default function AboutPage() {
  const { t, tA } = useT();
  return (
    <div className="container-prose pt-12 pb-16">
      <div className="heading-eyebrow">{t("about.eyebrow")}</div>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight text-ink">{t("about.title")}</h1>
      <p className="mt-3 text-ink-dim leading-relaxed text-lg">{t("about.subtitle")}</p>

      <h2 className="mt-10 text-xl font-semibold text-ink">{t("about.threelayers")}</h2>
      <div className="mt-3 grid sm:grid-cols-3 gap-3">
        <Layer tone="amber" title={t("about.l1.title")} text={t("about.l1.text")} />
        <Layer tone="accent" title={t("about.l2.title")} text={t("about.l2.text")} />
        <Layer tone="violet" title={t("about.l3.title")} text={t("about.l3.text")} />
      </div>

      <h2 className="mt-10 text-xl font-semibold text-ink">{t("about.template")}</h2>
      <ol className="mt-3 list-decimal pl-6 space-y-1.5 text-ink-dim leading-relaxed">
        {tA("about.template.steps").map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ol>

      <h2 className="mt-10 text-xl font-semibold text-ink">{t("about.interactive")}</h2>
      <p className="mt-2 text-ink-dim leading-relaxed">{t("about.interactive.text")}</p>

      <h2 className="mt-10 text-xl font-semibold text-ink">{t("about.stack")}</h2>
      <p className="mt-2 text-ink-dim leading-relaxed">{t("about.stack.text")}</p>

      <div className="mt-10 flex flex-wrap gap-2">
        <Badge tone="accent">Next.js</Badge>
        <Badge tone="violet">TypeScript</Badge>
        <Badge tone="green">Tailwind CSS</Badge>
        <Badge tone="amber">KaTeX</Badge>
        <Badge tone="rose">Recharts</Badge>
      </div>
    </div>
  );
}

function Layer({
  tone,
  title,
  text,
}: {
  tone: "amber" | "accent" | "violet";
  title: string;
  text: string;
}) {
  const tints = {
    amber: "border-accent-amber/40 text-accent-amber",
    accent: "border-accent/40 text-accent",
    violet: "border-accent-violet/40 text-accent-violet",
  };
  return (
    <div className="rounded-2xl border border-bg-border bg-bg-card/60 p-4">
      <div className={`text-xs uppercase tracking-wider ${tints[tone]} mb-1`}>{title}</div>
      <div className="text-sm text-ink-dim leading-relaxed">{text}</div>
    </div>
  );
}
