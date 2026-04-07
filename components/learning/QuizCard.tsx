"use client";

import { useState } from "react";
import { Check, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { useProgress } from "@/lib/store/progress";
import { useT } from "@/lib/i18n/useT";

export type QuizQuestion = {
  id: string;
  prompt: React.ReactNode;
  choices: { id: string; label: React.ReactNode }[];
  answer: string;
  explanation?: React.ReactNode;
};

export function QuizCard({
  chapterSlug,
  questions,
}: {
  chapterSlug: string;
  questions: QuizQuestion[];
}) {
  const { t } = useT();
  const [picked, setPicked] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const recordQuiz = useProgress((s) => s.recordQuiz);

  const correctCount = questions.filter((q) => picked[q.id] === q.answer).length;

  function submit() {
    setSubmitted(true);
    recordQuiz(chapterSlug, correctCount, questions.length);
  }

  function reset() {
    setPicked({});
    setSubmitted(false);
  }

  return (
    <div className="my-8 rounded-2xl border border-bg-border bg-bg-soft/60 p-5 sm:p-6">
      <div className="flex items-center gap-2 text-accent text-xs uppercase tracking-[0.18em] mb-4">
        <Sparkles className="h-3.5 w-3.5" /> {t("common.quiz")}
      </div>
      <ol className="space-y-6">
        {questions.map((q, qi) => (
          <li key={q.id}>
            <div className="text-ink mb-2.5 leading-relaxed">
              <span className="text-ink-muted mr-2">Q{qi + 1}.</span>
              {q.prompt}
            </div>
            <div className="grid gap-2">
              {q.choices.map((c) => {
                const isPicked = picked[q.id] === c.id;
                const isCorrect = c.id === q.answer;
                const showState = submitted && (isPicked || isCorrect);
                return (
                  <button
                    key={c.id}
                    onClick={() =>
                      !submitted && setPicked((p) => ({ ...p, [q.id]: c.id }))
                    }
                    className={cn(
                      "text-left flex items-start gap-3 rounded-xl border px-3.5 py-2.5 text-sm transition-colors",
                      !submitted && isPicked && "border-accent bg-accent/10 text-ink",
                      !submitted && !isPicked && "border-bg-border hover:border-accent/50 text-ink-dim hover:text-ink",
                      submitted && isCorrect && "border-accent-green bg-accent-green/10 text-ink",
                      submitted && isPicked && !isCorrect && "border-accent-rose bg-accent-rose/10 text-ink",
                      submitted && !isCorrect && !isPicked && "border-bg-border text-ink-muted",
                    )}
                  >
                    {showState ? (
                      isCorrect ? (
                        <Check className="h-4 w-4 text-accent-green flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="h-4 w-4 text-accent-rose flex-shrink-0 mt-0.5" />
                      )
                    ) : (
                      <span className="mt-1 h-3 w-3 rounded-full border border-bg-border flex-shrink-0" />
                    )}
                    <span>{c.label}</span>
                  </button>
                );
              })}
            </div>
            {submitted && q.explanation && (
              <div className="mt-2 rounded-lg border border-bg-border bg-bg-card/60 px-3 py-2 text-sm text-ink-dim">
                <span className="text-accent font-medium mr-1.5">{t("common.why")}</span>
                {q.explanation}
              </div>
            )}
          </li>
        ))}
      </ol>

      <div className="mt-6 flex items-center gap-3">
        {!submitted ? (
          <Button onClick={submit} disabled={Object.keys(picked).length < questions.length}>
            {t("common.submit")}
          </Button>
        ) : (
          <>
            <Button variant="subtle" onClick={reset}>
              {t("common.tryAgain")}
            </Button>
            <div className="text-sm text-ink-dim">
              {t("common.scored")}{" "}
              <span className="text-ink font-semibold">
                {correctCount}/{questions.length}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
