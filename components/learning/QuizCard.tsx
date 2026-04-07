"use client";

import { useState } from "react";
import { Check, X, Sparkles, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { useProgress } from "@/lib/store/progress";
import { useT } from "@/lib/i18n/useT";

/**
 * The quiz system supports three question types via a discriminated union:
 *  - "mc": multiple-choice (the original)
 *  - "numeric": user types a number, with a configurable tolerance
 *  - "ordering": pick the next derivation step from a shuffled list,
 *                a few steps at a time, until the proof is rebuilt
 *
 * All three share an optional `hint` (revealed on demand) and `explanation`
 * (revealed after submission). Per-chapter quizzes can mix types freely.
 */

type Common = {
  id: string;
  prompt: React.ReactNode;
  hint?: React.ReactNode;
  explanation?: React.ReactNode;
};

export type MCQuestion = Common & {
  type?: "mc";
  choices: { id: string; label: React.ReactNode }[];
  answer: string;
};

export type NumericQuestion = Common & {
  type: "numeric";
  /** The accepted numeric answer. */
  answer: number;
  /** Absolute tolerance for accepting near-misses (default 1e-2). */
  tolerance?: number;
  /** Optional units shown to the right of the input. */
  units?: string;
};

export type OrderingQuestion = Common & {
  type: "ordering";
  /** Steps in their CORRECT order. We shuffle them deterministically per render. */
  steps: { id: string; label: React.ReactNode }[];
};

export type QuizQuestion = MCQuestion | NumericQuestion | OrderingQuestion;

function isMC(q: QuizQuestion): q is MCQuestion {
  return q.type === undefined || q.type === "mc";
}
function isNumeric(q: QuizQuestion): q is NumericQuestion {
  return q.type === "numeric";
}
function isOrdering(q: QuizQuestion): q is OrderingQuestion {
  return q.type === "ordering";
}

// Stable pseudo-shuffle so the order is the same on every render of one
// session but different per question.
function shuffle<T>(arr: T[], salt: number): T[] {
  const out = arr.slice();
  let s = salt + 7;
  for (let i = out.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function QuizCard({
  chapterSlug,
  questions,
}: {
  chapterSlug: string;
  questions: QuizQuestion[];
}) {
  const { t } = useT();
  const [mcPicked, setMcPicked] = useState<Record<string, string>>({});
  const [numInput, setNumInput] = useState<Record<string, string>>({});
  const [orderPicks, setOrderPicks] = useState<Record<string, string[]>>({});
  const [hintsShown, setHintsShown] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const recordQuiz = useProgress((s) => s.recordQuiz);

  function isCorrect(q: QuizQuestion): boolean {
    if (isMC(q)) return mcPicked[q.id] === q.answer;
    if (isNumeric(q)) {
      const v = parseFloat(numInput[q.id]);
      if (!Number.isFinite(v)) return false;
      return Math.abs(v - q.answer) <= (q.tolerance ?? 0.01);
    }
    if (isOrdering(q)) {
      const picks = orderPicks[q.id] ?? [];
      if (picks.length !== q.steps.length) return false;
      for (let i = 0; i < q.steps.length; i++) if (picks[i] !== q.steps[i].id) return false;
      return true;
    }
    return false;
  }

  function isAnswered(q: QuizQuestion): boolean {
    if (isMC(q)) return mcPicked[q.id] !== undefined;
    if (isNumeric(q)) return (numInput[q.id] ?? "").trim() !== "";
    if (isOrdering(q)) return (orderPicks[q.id]?.length ?? 0) === q.steps.length;
    return false;
  }

  const correctCount = questions.filter(isCorrect).length;
  const allAnswered = questions.every(isAnswered);

  function submit() {
    setSubmitted(true);
    recordQuiz(chapterSlug, correctCount, questions.length);
  }

  function reset() {
    setMcPicked({});
    setNumInput({});
    setOrderPicks({});
    setHintsShown({});
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

            {/* Question body — branches by type */}
            {isMC(q) && (
              <McBody
                q={q}
                picked={mcPicked[q.id]}
                onPick={(c) => !submitted && setMcPicked((p) => ({ ...p, [q.id]: c }))}
                submitted={submitted}
              />
            )}
            {isNumeric(q) && (
              <NumericBody
                q={q}
                value={numInput[q.id] ?? ""}
                onChange={(v) => !submitted && setNumInput((s) => ({ ...s, [q.id]: v }))}
                submitted={submitted}
                isCorrect={isCorrect(q)}
              />
            )}
            {isOrdering(q) && (
              <OrderingBody
                q={q}
                picks={orderPicks[q.id] ?? []}
                onPick={(stepId) => {
                  if (submitted) return;
                  setOrderPicks((s) => {
                    const cur = s[q.id] ?? [];
                    if (cur.includes(stepId)) return s;
                    return { ...s, [q.id]: [...cur, stepId] };
                  });
                }}
                onUndo={() => {
                  if (submitted) return;
                  setOrderPicks((s) => {
                    const cur = s[q.id] ?? [];
                    return { ...s, [q.id]: cur.slice(0, -1) };
                  });
                }}
                submitted={submitted}
                isCorrect={isCorrect(q)}
                salt={qi}
              />
            )}

            {/* Hint reveal */}
            {q.hint && !submitted && (
              <div className="mt-2">
                {hintsShown[q.id] ? (
                  <div className="rounded-lg border border-accent-amber/30 bg-accent-amber/5 px-3 py-2 text-xs text-ink-dim">
                    <span className="inline-flex items-center gap-1 text-accent-amber font-medium mr-1.5">
                      <Lightbulb className="h-3 w-3" /> hint
                    </span>
                    {q.hint}
                  </div>
                ) : (
                  <button
                    onClick={() => setHintsShown((h) => ({ ...h, [q.id]: true }))}
                    className="inline-flex items-center gap-1 text-xs text-accent-amber hover:text-accent-amber/80"
                  >
                    <Lightbulb className="h-3 w-3" /> show hint
                  </button>
                )}
              </div>
            )}

            {/* Post-submit explanation */}
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
          <Button onClick={submit} disabled={!allAnswered}>
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

// ---------- Sub-components ----------

function McBody({
  q,
  picked,
  onPick,
  submitted,
}: {
  q: MCQuestion;
  picked: string | undefined;
  onPick: (id: string) => void;
  submitted: boolean;
}) {
  return (
    <div className="grid gap-2">
      {q.choices.map((c) => {
        const isPicked = picked === c.id;
        const isCorrect = c.id === q.answer;
        const showState = submitted && (isPicked || isCorrect);
        return (
          <button
            key={c.id}
            onClick={() => onPick(c.id)}
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
  );
}

function NumericBody({
  q,
  value,
  onChange,
  submitted,
  isCorrect,
}: {
  q: NumericQuestion;
  value: string;
  onChange: (v: string) => void;
  submitted: boolean;
  isCorrect: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={cn(
          "flex items-center gap-2 rounded-xl border px-3 py-2 transition-colors",
          submitted && isCorrect && "border-accent-green bg-accent-green/10",
          submitted && !isCorrect && "border-accent-rose bg-accent-rose/10",
          !submitted && "border-bg-border bg-bg-soft focus-within:border-accent",
        )}
      >
        <input
          type="number"
          step="any"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={submitted}
          placeholder="…"
          className="w-32 bg-transparent text-sm text-ink focus:outline-none disabled:opacity-70"
        />
        {q.units && <span className="text-xs text-ink-muted">{q.units}</span>}
      </div>
      {submitted && (
        <span className={cn("text-xs", isCorrect ? "text-accent-green" : "text-accent-rose")}>
          {isCorrect ? "✓" : `✗  expected ≈ ${q.answer}`}
        </span>
      )}
    </div>
  );
}

function OrderingBody({
  q,
  picks,
  onPick,
  onUndo,
  submitted,
  isCorrect,
  salt,
}: {
  q: OrderingQuestion;
  picks: string[];
  onPick: (id: string) => void;
  onUndo: () => void;
  submitted: boolean;
  isCorrect: boolean;
  salt: number;
}) {
  const shuffled = shuffle(q.steps, salt);
  return (
    <div>
      {/* Built sequence */}
      <ol className="mb-2 space-y-1.5">
        {picks.map((id, i) => {
          const step = q.steps.find((s) => s.id === id);
          const correctHere = submitted ? q.steps[i]?.id === id : null;
          return (
            <li
              key={i}
              className={cn(
                "rounded-lg border px-3 py-2 text-sm",
                correctHere === true && "border-accent-green bg-accent-green/10 text-ink",
                correctHere === false && "border-accent-rose bg-accent-rose/10 text-ink",
                correctHere === null && "border-bg-border bg-bg-card/60 text-ink",
              )}
            >
              <span className="text-ink-muted mr-2">{i + 1}.</span>
              {step?.label}
            </li>
          );
        })}
      </ol>
      {/* Picker */}
      {!submitted && (
        <>
          <div className="flex flex-wrap gap-2">
            {shuffled.map((s) => {
              const used = picks.includes(s.id);
              return (
                <button
                  key={s.id}
                  disabled={used}
                  onClick={() => onPick(s.id)}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-xs transition-colors",
                    used
                      ? "border-bg-border bg-bg-soft text-ink-muted opacity-40"
                      : "border-accent/40 bg-accent/10 text-accent hover:border-accent",
                  )}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
          {picks.length > 0 && (
            <button onClick={onUndo} className="mt-2 text-xs text-ink-muted hover:text-ink">
              undo last step
            </button>
          )}
        </>
      )}
      {submitted && (
        <div
          className={cn(
            "mt-1 text-xs",
            isCorrect ? "text-accent-green" : "text-accent-rose",
          )}
        >
          {isCorrect ? "✓ derivation correct" : "✗ correct order shown above"}
        </div>
      )}
    </div>
  );
}
