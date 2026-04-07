"use client";

import Link from "next/link";
import { CHAPTERS } from "@/content/registry";
import { MODULES } from "@/content/modules";
import { Badge } from "@/components/ui/Badge";
import { useProgress } from "@/lib/store/progress";
import { useT } from "@/lib/i18n/useT";
import { CheckCircle2, Circle } from "lucide-react";

export default function RoadmapPage() {
  const completed = useProgress((s) => s.completedChapters);
  const quizScores = useProgress((s) => s.quizScores);
  const { t, locale } = useT();

  const chaptersByModule = MODULES.map((m) => ({
    module: m,
    chapters: CHAPTERS.filter((c) => c.meta.module === m.id),
  }));

  return (
    <div className="container-wide pt-12 pb-16">
      <div className="max-w-3xl">
        <div className="heading-eyebrow">{t("roadmap.eyebrow")}</div>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-ink">
          {t("roadmap.title")}
        </h1>
        <p className="mt-3 text-ink-dim leading-relaxed">{t("roadmap.intro")}</p>
      </div>

      <div className="mt-10 space-y-10">
        {chaptersByModule.map(({ module: m, chapters }) => (
          <section key={m.id}>
            <div className="flex items-baseline gap-3 mb-3">
              <div className="font-mono text-xs text-accent">{t("roadmap.module")} {m.letter}</div>
              <h2 className="text-xl font-semibold text-ink">{m.title[locale]}</h2>
            </div>
            <p className="text-sm text-ink-dim leading-relaxed mb-4 max-w-3xl">{m.blurb[locale]}</p>
            {chapters.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-bg-border p-5 text-sm text-ink-muted">
                {t("roadmap.empty")}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-3">
                {chapters.map((c) => {
                  const done = completed[c.meta.slug];
                  const score = quizScores[c.meta.slug];
                  const payload = c.localized[locale] ?? c.localized.en;
                  return (
                    <Link
                      key={c.meta.slug}
                      href={`/chapters/${c.meta.slug}`}
                      className="group rounded-2xl border border-bg-border bg-bg-card/70 p-5 hover:border-accent/60 transition-colors flex gap-4"
                    >
                      <div className="pt-1">
                        {done ? (
                          <CheckCircle2 className="h-5 w-5 text-accent-green" />
                        ) : (
                          <Circle className="h-5 w-5 text-ink-muted" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs text-ink-muted">
                            {String(c.meta.number).padStart(2, "0")}
                          </span>
                          <Badge tone="accent">{t("home.level")} {c.meta.level}</Badge>
                          <span className="text-xs text-ink-muted">~{c.meta.minutes} {t("home.minutes")}</span>
                        </div>
                        <div className="text-base font-semibold text-ink group-hover:text-accent transition-colors">
                          {payload.title}
                        </div>
                        <div className="mt-1 text-sm text-ink-dim leading-relaxed">
                          {payload.hook}
                        </div>
                        {score && (
                          <div className="mt-2 text-xs text-ink-muted">
                            {t("roadmap.quizScore")}:{" "}
                            <span className="text-ink font-mono">
                              {score.correct}/{score.total}
                            </span>
                          </div>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
