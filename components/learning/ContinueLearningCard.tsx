"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Check } from "lucide-react";
import { useProgress } from "@/lib/store/progress";
import { useT } from "@/lib/i18n/useT";
import { getChapterBySlug, CHAPTERS } from "@/content/registry";
import { Badge } from "@/components/ui/Badge";

/**
 * Surfaces the user's last-visited chapter as a "resume" card on the home page.
 * Falls back to nothing if the user has never opened a chapter — first-time
 * visitors should not see an empty banner.
 */
export function ContinueLearningCard() {
  const lastSlug = useProgress((s) => s.lastChapter);
  const completed = useProgress((s) => s.completedChapters);
  const quizScores = useProgress((s) => s.quizScores);
  const { t, locale } = useT();

  if (!lastSlug) return null;
  const chapter = getChapterBySlug(lastSlug);
  if (!chapter) return null;

  const payload = chapter.localized[locale] ?? chapter.localized.en;
  const totalChapters = CHAPTERS.length;
  const doneCount = Object.values(completed).filter(Boolean).length;
  const score = quizScores[lastSlug];
  const isComplete = !!completed[lastSlug];

  return (
    <section className="container-wide pb-2">
      <Link
        href={`/chapters/${lastSlug}`}
        className="group flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl border border-accent/30 bg-gradient-to-br from-accent/8 via-accent-violet/5 to-transparent p-5 hover:border-accent/60 transition-colors"
      >
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-accent/40 bg-accent/10 text-accent">
          <BookOpen className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-[0.18em] text-accent">
              {t("home.continue.eyebrow")}
            </span>
            {isComplete ? (
              <Badge tone="green">
                <Check className="h-3 w-3 mr-1" /> {t("home.continue.complete")}
              </Badge>
            ) : (
              <Badge>{t("home.continue.notDone")}</Badge>
            )}
          </div>
          <div className="text-lg font-semibold text-ink truncate group-hover:text-accent transition-colors">
            {String(chapter.meta.number).padStart(2, "0")} · {payload.title}
          </div>
          <div className="mt-1 text-sm text-ink-dim line-clamp-1">{payload.hook}</div>
          <div className="mt-2 flex items-center gap-3 text-xs text-ink-muted">
            <span>
              {doneCount} / {totalChapters} {locale === "zh" ? "章已完成" : "chapters complete"}
            </span>
            {score && (
              <span>
                · {locale === "zh" ? "本章測驗" : "this chapter quiz"}{" "}
                <span className="font-mono text-ink">
                  {score.correct}/{score.total}
                </span>
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-accent flex-shrink-0">
          {t("home.continue.cta")} <ArrowRight className="h-4 w-4" />
        </div>
      </Link>
    </section>
  );
}
