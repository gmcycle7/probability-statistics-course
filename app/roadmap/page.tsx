"use client";

import Link from "next/link";
import { CHAPTERS } from "@/content/registry";
import { MODULES } from "@/content/modules";
import { Badge } from "@/components/ui/Badge";
import { useProgress } from "@/lib/store/progress";
import { CheckCircle2, Circle } from "lucide-react";

export default function RoadmapPage() {
  const completed = useProgress((s) => s.completedChapters);
  const quizScores = useProgress((s) => s.quizScores);

  const chaptersByModule = MODULES.map((m) => ({
    module: m,
    chapters: CHAPTERS.filter((c) => c.meta.module === m.id),
  }));

  return (
    <div className="container-wide pt-12 pb-16">
      <div className="max-w-3xl">
        <div className="heading-eyebrow">Course roadmap</div>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-ink">
          From sample spaces to graduate-level inference
        </h1>
        <p className="mt-3 text-ink-dim leading-relaxed">
          The course is organised into eight modules. Each chapter is
          self-contained and follows the same{" "}
          <em>intuition → formalism → graduate insight</em> structure, with
          live simulations and a quiz at the end. Numbers below show your
          progress on chapters and quizzes.
        </p>
      </div>

      <div className="mt-10 space-y-10">
        {chaptersByModule.map(({ module: m, chapters }) => (
          <section key={m.id}>
            <div className="flex items-baseline gap-3 mb-3">
              <div className="font-mono text-xs text-accent">Module {m.letter}</div>
              <h2 className="text-xl font-semibold text-ink">{m.title}</h2>
            </div>
            <p className="text-sm text-ink-dim leading-relaxed mb-4 max-w-3xl">{m.blurb}</p>
            {chapters.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-bg-border p-5 text-sm text-ink-muted">
                Chapters in this module are coming soon. Add them by dropping a
                new file into <code className="font-mono text-ink">content/chapters/</code> and
                registering it in <code className="font-mono text-ink">content/registry.ts</code>.
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-3">
                {chapters.map((c) => {
                  const done = completed[c.meta.slug];
                  const score = quizScores[c.meta.slug];
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
                          <Badge tone="accent">level {c.meta.level}</Badge>
                          <span className="text-xs text-ink-muted">~{c.meta.minutes} min</span>
                        </div>
                        <div className="text-base font-semibold text-ink group-hover:text-accent transition-colors">
                          {c.meta.title}
                        </div>
                        <div className="mt-1 text-sm text-ink-dim leading-relaxed">
                          {c.meta.hook}
                        </div>
                        {score && (
                          <div className="mt-2 text-xs text-ink-muted">
                            quiz score:{" "}
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
