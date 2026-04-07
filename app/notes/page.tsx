"use client";

import Link from "next/link";
import { CHAPTERS } from "@/content/registry";
import { useProgress } from "@/lib/store/progress";
import { useT } from "@/lib/i18n/useT";
import { Button } from "@/components/ui/Button";
import { Trash2 } from "lucide-react";

export default function NotesPage() {
  const notes = useProgress((s) => s.notes);
  const setNote = useProgress((s) => s.setNote);
  const bookmarks = useProgress((s) => s.bookmarks);
  const reset = useProgress((s) => s.reset);
  const { t, locale } = useT();

  return (
    <div className="container-wide pt-12 pb-16">
      <div className="flex items-start justify-between gap-4">
        <div className="max-w-3xl">
          <div className="heading-eyebrow">{t("notes.eyebrow")}</div>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-ink">
            {t("notes.title")}
          </h1>
          <p className="mt-3 text-ink-dim leading-relaxed">{t("notes.intro")}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            if (confirm(t("notes.confirmReset"))) {
              reset();
            }
          }}
        >
          <Trash2 className="h-4 w-4" /> {t("notes.reset")}
        </Button>
      </div>

      {bookmarks.length > 0 && (
        <section className="mt-8">
          <div className="text-xs uppercase tracking-wider text-accent mb-2">
            {t("notes.bookmarks")}
          </div>
          <div className="flex flex-wrap gap-2">
            {bookmarks.map((slug) => {
              const c = CHAPTERS.find((c) => c.meta.slug === slug);
              if (!c) return null;
              const payload = c.localized[locale] ?? c.localized.en;
              return (
                <Link
                  key={slug}
                  href={`/chapters/${slug}`}
                  className="rounded-full border border-bg-border bg-bg-card/60 px-3 py-1 text-xs text-ink-dim hover:text-accent hover:border-accent/60"
                >
                  {payload.title}
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <div className="mt-8 space-y-4">
        {CHAPTERS.map((c) => {
          const payload = c.localized[locale] ?? c.localized.en;
          return (
            <div key={c.meta.slug} className="rounded-2xl border border-bg-border bg-bg-card/60 p-5">
              <div className="flex items-baseline justify-between gap-3 mb-2">
                <Link
                  href={`/chapters/${c.meta.slug}`}
                  className="text-ink font-semibold hover:text-accent transition-colors"
                >
                  <span className="font-mono text-xs text-ink-muted mr-2">
                    {String(c.meta.number).padStart(2, "0")}
                  </span>
                  {payload.title}
                </Link>
                <span className="text-xs text-ink-muted">
                  {(notes[c.meta.slug]?.length ?? 0)} {t("notes.chars")}
                </span>
              </div>
              <textarea
                value={notes[c.meta.slug] ?? ""}
                onChange={(e) => setNote(c.meta.slug, e.target.value)}
                placeholder={t("notes.placeholder")}
                rows={3}
                className="w-full rounded-xl border border-bg-border bg-bg-soft px-3 py-2 text-sm text-ink leading-relaxed placeholder:text-ink-muted focus:outline-none focus:border-accent/60"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
