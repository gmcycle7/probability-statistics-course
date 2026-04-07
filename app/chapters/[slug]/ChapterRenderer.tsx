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
import { Bookmark, BookmarkCheck, Check, CheckCheck } from "lucide-react";

type Props = {
  chapter: Chapter;
  neighbors: { prev?: { slug: string; title: string }; next?: { slug: string; title: string } };
};

export function ChapterRenderer({ chapter, neighbors }: Props) {
  const { meta, content } = chapter;
  const setLast = useProgress((s) => s.setLastChapter);
  const completed = useProgress((s) => s.completedChapters[meta.slug]);
  const toggleChapter = useProgress((s) => s.toggleChapter);
  const bookmarks = useProgress((s) => s.bookmarks);
  const toggleBookmark = useProgress((s) => s.toggleBookmark);

  const isBookmarked = bookmarks.includes(meta.slug);

  useEffect(() => {
    setLast(meta.slug);
  }, [meta.slug, setLast]);

  return (
    <article className="container-prose pt-12 pb-16">
      {/* Header */}
      <header>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <Badge tone="accent">Chapter {String(meta.number).padStart(2, "0")}</Badge>
          <Badge tone="violet">level {meta.level}</Badge>
          <span className="text-ink-muted">~{meta.minutes} min read</span>
        </div>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink">
          {meta.title}
        </h1>
        <p className="mt-2 text-lg text-ink-dim leading-relaxed">{meta.subtitle}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={completed ? "primary" : "subtle"}
            onClick={() => toggleChapter(meta.slug)}
          >
            {completed ? (
              <>
                <CheckCheck className="h-4 w-4" /> Marked complete
              </>
            ) : (
              <>
                <Check className="h-4 w-4" /> Mark complete
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
                <BookmarkCheck className="h-4 w-4" /> Bookmarked
              </>
            ) : (
              <>
                <Bookmark className="h-4 w-4" /> Bookmark
              </>
            )}
          </Button>
        </div>
      </header>

      {/* 1. Why this matters */}
      <SectionHeader step="01" title="Why this matters" />
      <div className="text-ink leading-relaxed">{content.whyItMatters}</div>

      {/* 2-4. Three-layer view */}
      <SectionHeader
        step="02"
        title="Three layers"
        blurb="Move through Intuition → Formalism → Graduate insight at your own pace."
      />
      <ThreeLayerView
        intuition={content.intuition}
        formal={content.formal}
        graduate={content.graduate}
      />

      {/* 5. Body: visualisations, derivations, examples */}
      <SectionHeader
        step="03"
        title="Visual & worked exploration"
        blurb="Live simulations, derivations you can step through, and worked examples."
      />
      <div className="prose-tight">{content.body}</div>

      {/* 6. Common misconceptions */}
      <SectionHeader step="04" title="Common misconceptions" />
      <MisconceptionBox items={content.misconceptions} />

      {/* 7. Quick quiz */}
      <SectionHeader step="05" title="Quick quiz" blurb="Lock in your understanding before moving on." />
      <QuizCard chapterSlug={meta.slug} questions={content.quiz} />

      {/* 8. Key takeaways */}
      <SectionHeader step="06" title="Key takeaways" />
      <KeyTakeaways items={content.takeaways} />

      {/* 9. Further reading */}
      {content.furtherReading && content.furtherReading.length > 0 && (
        <>
          <SectionHeader step="07" title="Further reading" />
          <ul className="space-y-1.5 text-ink-dim">
            {content.furtherReading.map((r, i) => (
              <li key={i}>
                · {r.href ? (
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

      <ChapterNavigator prev={neighbors.prev} next={neighbors.next} />
    </article>
  );
}
