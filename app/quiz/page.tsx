"use client";

import Link from "next/link";
import { CHAPTERS } from "@/content/registry";
import { useProgress } from "@/lib/store/progress";
import { Sparkles } from "lucide-react";

export default function QuizHub() {
  const scores = useProgress((s) => s.quizScores);

  const totalQs = CHAPTERS.reduce((a, c) => a + c.content.quiz.length, 0);
  const totalCorrect = CHAPTERS.reduce(
    (a, c) => a + (scores[c.meta.slug]?.correct ?? 0),
    0,
  );

  return (
    <div className="container-wide pt-12 pb-16">
      <div className="max-w-3xl">
        <div className="heading-eyebrow">Quiz hub</div>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-ink">
          Test what stuck
        </h1>
        <p className="mt-3 text-ink-dim leading-relaxed">
          Every chapter ends with a quick concept-check quiz. This page tracks
          your scores across all chapters so you can see where to revisit. All
          progress stays in your browser via localStorage.
        </p>
        <div className="mt-6 inline-flex items-center gap-2 rounded-xl border border-bg-border bg-bg-card/60 px-4 py-2 text-sm">
          <Sparkles className="h-4 w-4 text-accent" />
          <span className="text-ink-dim">Overall:</span>{" "}
          <span className="text-ink font-mono">
            {totalCorrect} / {totalQs}
          </span>
          <span className="text-ink-muted">
            ({totalQs ? Math.round((totalCorrect / totalQs) * 100) : 0}%)
          </span>
        </div>
      </div>

      <div className="mt-10 grid md:grid-cols-2 gap-3">
        {CHAPTERS.map((c) => {
          const s = scores[c.meta.slug];
          const total = c.content.quiz.length;
          return (
            <Link
              key={c.meta.slug}
              href={`/chapters/${c.meta.slug}#quiz`}
              className="group rounded-2xl border border-bg-border bg-bg-card/70 p-5 hover:border-accent/60 transition-colors flex justify-between items-start gap-4"
            >
              <div>
                <div className="text-xs text-ink-muted font-mono">
                  {String(c.meta.number).padStart(2, "0")}
                </div>
                <div className="font-medium text-ink group-hover:text-accent transition-colors">
                  {c.meta.title}
                </div>
                <div className="mt-1 text-xs text-ink-muted">{total} questions</div>
              </div>
              <div className="text-right">
                <div className="font-mono text-2xl text-ink">
                  {s ? `${s.correct}/${s.total}` : "—"}
                </div>
                <div className="text-xs text-ink-muted mt-1">
                  {s ? `${Math.round((s.correct / s.total) * 100)}%` : "not attempted"}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
