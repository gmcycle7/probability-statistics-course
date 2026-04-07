"use client";

import Link from "next/link";
import { CHAPTERS } from "@/content/registry";
import { useProgress } from "@/lib/store/progress";
import { Button } from "@/components/ui/Button";
import { Trash2 } from "lucide-react";

export default function NotesPage() {
  const notes = useProgress((s) => s.notes);
  const setNote = useProgress((s) => s.setNote);
  const bookmarks = useProgress((s) => s.bookmarks);
  const reset = useProgress((s) => s.reset);

  return (
    <div className="container-wide pt-12 pb-16">
      <div className="flex items-start justify-between gap-4">
        <div className="max-w-3xl">
          <div className="heading-eyebrow">Notes & bookmarks</div>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-ink">
            Your study journal
          </h1>
          <p className="mt-3 text-ink-dim leading-relaxed">
            Jot one note per chapter — a confusing point, a re-derivation, the
            mental model that finally clicked. Bookmarks are listed at the
            top.
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            if (
              confirm("This wipes all chapter completion, quiz scores, notes, and bookmarks. Continue?")
            ) {
              reset();
            }
          }}
        >
          <Trash2 className="h-4 w-4" /> reset all progress
        </Button>
      </div>

      {bookmarks.length > 0 && (
        <section className="mt-8">
          <div className="text-xs uppercase tracking-wider text-accent mb-2">
            Bookmarks
          </div>
          <div className="flex flex-wrap gap-2">
            {bookmarks.map((slug) => {
              const c = CHAPTERS.find((c) => c.meta.slug === slug);
              if (!c) return null;
              return (
                <Link
                  key={slug}
                  href={`/chapters/${slug}`}
                  className="rounded-full border border-bg-border bg-bg-card/60 px-3 py-1 text-xs text-ink-dim hover:text-accent hover:border-accent/60"
                >
                  {c.meta.title}
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <div className="mt-8 space-y-4">
        {CHAPTERS.map((c) => (
          <div key={c.meta.slug} className="rounded-2xl border border-bg-border bg-bg-card/60 p-5">
            <div className="flex items-baseline justify-between gap-3 mb-2">
              <Link
                href={`/chapters/${c.meta.slug}`}
                className="text-ink font-semibold hover:text-accent transition-colors"
              >
                <span className="font-mono text-xs text-ink-muted mr-2">
                  {String(c.meta.number).padStart(2, "0")}
                </span>
                {c.meta.title}
              </Link>
              <span className="text-xs text-ink-muted">
                {(notes[c.meta.slug]?.length ?? 0)} chars
              </span>
            </div>
            <textarea
              value={notes[c.meta.slug] ?? ""}
              onChange={(e) => setNote(c.meta.slug, e.target.value)}
              placeholder="Type your notes here…"
              rows={3}
              className="w-full rounded-xl border border-bg-border bg-bg-soft px-3 py-2 text-sm text-ink leading-relaxed placeholder:text-ink-muted focus:outline-none focus:border-accent/60"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
