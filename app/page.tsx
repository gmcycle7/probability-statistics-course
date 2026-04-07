import Link from "next/link";
import { ArrowRight, BookOpen, Brain, FlaskConical, Sigma } from "lucide-react";
import { CHAPTERS } from "@/content/registry";
import { MODULES } from "@/content/modules";
import { Badge } from "@/components/ui/Badge";

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="container-wide pt-16 pb-10">
        <div className="max-w-3xl">
          <Badge tone="accent">Interactive · Graduate-level · Self-paced</Badge>
          <h1 className="mt-4 text-4xl sm:text-5xl font-semibold tracking-tight text-ink">
            Probability & Statistics,{" "}
            <span className="bg-gradient-to-r from-accent via-accent-violet to-accent-rose bg-clip-text text-transparent">
              learned by playing with it.
            </span>
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-ink-dim">
            A complete graduate-level course built around three layers per
            topic — intuition, formal definitions, and graduate-level insight —
            with live simulations, derivations you can step through, and
            quizzes that actually score you.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href={`/chapters/${CHAPTERS[0].meta.slug}`}
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 text-bg font-medium hover:bg-accent/90 transition-colors"
            >
              Start with Chapter 1 <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/roadmap"
              className="inline-flex items-center gap-2 rounded-xl border border-bg-border bg-bg-card px-5 py-3 text-ink hover:border-accent/60 hover:text-accent transition-colors"
            >
              View the full roadmap
            </Link>
            <Link
              href="/playground"
              className="inline-flex items-center gap-2 rounded-xl border border-bg-border bg-bg-card px-5 py-3 text-ink hover:border-accent/60 hover:text-accent transition-colors"
            >
              Open the playground
            </Link>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="container-wide pb-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Pillar
            icon={<Brain className="h-5 w-5" />}
            title="Intuition first"
            text="Every concept starts with a picture you can manipulate, not a definition."
            tint="amber"
          />
          <Pillar
            icon={<Sigma className="h-5 w-5" />}
            title="Formal mathematics"
            text="Definitions, theorems, and step-by-step derivations rendered in KaTeX."
            tint="accent"
          />
          <Pillar
            icon={<FlaskConical className="h-5 w-5" />}
            title="Live simulations"
            text="See LLN, CLT, Bayes updates and confidence intervals run in your browser."
            tint="green"
          />
          <Pillar
            icon={<BookOpen className="h-5 w-5" />}
            title="Graduate insight"
            text="Each chapter ends with the technical details, common misuses, and connections."
            tint="violet"
          />
        </div>
      </section>

      {/* Featured chapters */}
      <section className="container-wide pb-10">
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="text-2xl font-semibold text-ink">Start here</h2>
          <Link href="/roadmap" className="text-sm text-accent hover:underline">
            All chapters →
          </Link>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {CHAPTERS.slice(0, 4).map((c) => (
            <Link
              key={c.meta.slug}
              href={`/chapters/${c.meta.slug}`}
              className="group rounded-2xl border border-bg-border bg-bg-card/70 p-5 hover:border-accent/60 transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-xs text-ink-muted">
                  {String(c.meta.number).padStart(2, "0")}
                </span>
                <Badge tone="accent">{moduleLetter(c.meta.module)}</Badge>
                <span className="text-xs text-ink-muted">
                  ~{c.meta.minutes} min · level {c.meta.level}
                </span>
              </div>
              <div className="text-lg font-semibold text-ink group-hover:text-accent transition-colors">
                {c.meta.title}
              </div>
              <div className="mt-1 text-sm text-ink-dim leading-relaxed">{c.meta.hook}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Modules */}
      <section className="container-wide pb-16">
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="text-2xl font-semibold text-ink">The eight modules</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {MODULES.map((m) => (
            <div
              key={m.id}
              className="rounded-2xl border border-bg-border bg-bg-card/70 p-5"
            >
              <div className="text-xs uppercase tracking-wider text-accent">
                Module {m.letter}
              </div>
              <div className="mt-1 font-semibold text-ink">{m.title}</div>
              <div className="mt-2 text-sm text-ink-dim leading-relaxed">{m.blurb}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Pillar({
  icon,
  title,
  text,
  tint,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  tint: "accent" | "green" | "amber" | "violet";
}) {
  const tints: Record<typeof tint, string> = {
    accent: "text-accent border-accent/40",
    green: "text-accent-green border-accent-green/40",
    amber: "text-accent-amber border-accent-amber/40",
    violet: "text-accent-violet border-accent-violet/40",
  };
  return (
    <div className="rounded-2xl border border-bg-border bg-bg-card/70 p-5">
      <div className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border ${tints[tint]}`}>
        {icon}
      </div>
      <div className="mt-3 font-semibold text-ink">{title}</div>
      <div className="mt-1 text-sm text-ink-dim leading-relaxed">{text}</div>
    </div>
  );
}

function moduleLetter(id: string) {
  return id.split("_")[0];
}
