"use client";

import { useEffect } from "react";
import type { Chapter } from "@/content/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ThreeLayerView } from "@/components/learning/ThreeLayerView";
import { KeyTakeaways } from "@/components/learning/KeyTakeaways";
import { MisconceptionBox } from "@/components/learning/MisconceptionBox";
import { QuizCard } from "@/components/learning/QuizCard";
import { ChapterNavigator } from "@/components/learning/ChapterNavigator";
import { SectionHeader } from "@/components/learning/SectionHeader";
import { useProgress } from "@/lib/store/progress";
import { useT } from "@/lib/i18n/useT";
import { Bookmark, BookmarkCheck, Check, CheckCheck } from "lucide-react";
import { getNeighbors, getChapterBySlug } from "@/content/registry";
import type { Locale } from "@/lib/i18n/locale";

type Props = {
  chapter: Chapter;
};

export function ChapterRenderer({ chapter }: Props) {
  const { meta } = chapter;
  const { t, locale } = useT();
  const payload = chapter.localized[locale] ?? chapter.localized.en;
  const neighbors = getNeighbors(meta.slug);
  const setLast = useProgress((s) => s.setLastChapter);
  const completed = useProgress((s) => s.completedChapters[meta.slug]);
  const toggleChapter = useProgress((s) => s.toggleChapter);
  const bookmarks = useProgress((s) => s.bookmarks);
  const toggleBookmark = useProgress((s) => s.toggleBookmark);

  const isBookmarked = bookmarks.includes(meta.slug);

  useEffect(() => {
    setLast(meta.slug);
  }, [meta.slug, setLast]);

  // Localize the neighbour titles via a registry lookup.
  const prevTitle = neighbors.prev
    ? getLocalizedTitle(neighbors.prev.slug, locale)
    : undefined;
  const nextTitle = neighbors.next
    ? getLocalizedTitle(neighbors.next.slug, locale)
    : undefined;

  return (
    <article className="container-prose pt-12 pb-16">
      {/* Header */}
      <header>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <Badge tone="accent">
            {t("chapter.badge")}
            {String(meta.number).padStart(2, "0")}
            {t("chapter.badgeSuffix")}
          </Badge>
          <Badge tone="violet">
            {locale === "zh" ? "難度" : "level"} {meta.level}
          </Badge>
          <span className="text-ink-muted">
            ~{meta.minutes} {t("chapter.minRead")}
          </span>
        </div>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink">
          {payload.title}
        </h1>
        <p className="mt-2 text-lg text-ink-dim leading-relaxed">{payload.subtitle}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={completed ? "primary" : "subtle"}
            onClick={() => toggleChapter(meta.slug)}
          >
            {completed ? (
              <>
                <CheckCheck className="h-4 w-4" /> {t("chapter.markedComplete")}
              </>
            ) : (
              <>
                <Check className="h-4 w-4" /> {t("chapter.markComplete")}
              </>
            )}
          </Button>
          <Button
            size="sm"
            variant="subtle"
            onClick={() => toggleBookmark(meta.slug)}
          >
            {isBookmarked ? (
              <>
                <BookmarkCheck className="h-4 w-4" /> {t("chapter.bookmarked")}
              </>
            ) : (
              <>
                <Bookmark className="h-4 w-4" /> {t("chapter.bookmark")}
              </>
            )}
          </Button>
        </div>
      </header>

      <SectionHeader step="01" title={t("chapter.section.why")} />
      <div className="text-ink leading-relaxed">{payload.whyItMatters}</div>

      <SectionHeader
        step="02"
        title={t("chapter.section.layers")}
        blurb={t("chapter.section.layers.blurb")}
      />
      <ThreeLayerView
        intuition={payload.intuition}
        formal={payload.formal}
        graduate={payload.graduate}
      />

      <SectionHeader
        step="03"
        title={t("chapter.section.body")}
        blurb={t("chapter.section.body.blurb")}
      />
      <div className="prose-tight">{payload.body}</div>

      <SectionHeader step="04" title={t("chapter.section.misconceptions")} />
      <MisconceptionBox items={payload.misconceptions} />

      <SectionHeader
        step="05"
        title={t("chapter.section.quiz")}
        blurb={t("chapter.section.quiz.blurb")}
      />
      <QuizCard chapterSlug={meta.slug} questions={payload.quiz} />

      <SectionHeader step="06" title={t("chapter.section.takeaways")} />
      <KeyTakeaways items={payload.takeaways} />

      {payload.furtherReading && payload.furtherReading.length > 0 && (
        <>
          <SectionHeader step="07" title={t("chapter.section.further")} />
          <ul className="space-y-1.5 text-ink-dim">
            {payload.furtherReading.map((r, i) => (
              <li key={i}>
                ·{" "}
                {r.href ? (
                  <a href={r.href} className="link">
                    {r.title}
                  </a>
                ) : (
                  <span className="text-ink">{r.title}</span>
                )}
                {r.note && <span className="text-ink-muted"> — {r.note}</span>}
              </li>
            ))}
          </ul>
        </>
      )}

      <ChapterNavigator
        prev={
          neighbors.prev && prevTitle
            ? { slug: neighbors.prev.slug, title: prevTitle }
            : undefined
        }
        next={
          neighbors.next && nextTitle
            ? { slug: neighbors.next.slug, title: nextTitle }
            : undefined
        }
      />
    </article>
  );
}

function getLocalizedTitle(slug: string, locale: Locale): string {
  const c = getChapterBySlug(slug);
  if (!c) return slug;
  return c.localized[locale]?.title ?? c.localized.en.title;
}
