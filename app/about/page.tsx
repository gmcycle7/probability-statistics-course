import { Badge } from "@/components/ui/Badge";

export default function AboutPage() {
  return (
    <div className="container-prose pt-12 pb-16">
      <div className="heading-eyebrow">About this course</div>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight text-ink">Methodology</h1>
      <p className="mt-3 text-ink-dim leading-relaxed text-lg">
        A graduate-level probability and statistics course designed to be{" "}
        <em>actually learnable</em> by a self-studying engineer who is willing
        to think but not to memorise.
      </p>

      <h2 className="mt-10 text-xl font-semibold text-ink">Three layers, every chapter</h2>
      <div className="mt-3 grid sm:grid-cols-3 gap-3">
        <Layer
          tone="amber"
          title="Level 1 · Intuition"
          text="A picture, a story, and an analogy. No equations until you have a feel for what's happening."
        />
        <Layer
          tone="accent"
          title="Level 2 · Formalism"
          text="Definitions, theorems, and step-by-step derivations rendered in KaTeX."
        />
        <Layer
          tone="violet"
          title="Level 3 · Graduate insight"
          text="Stricter conditions, common misuses, and connections to other areas. The 'taste' of a real statistician."
        />
      </div>

      <h2 className="mt-10 text-xl font-semibold text-ink">Every chapter follows the same template</h2>
      <ol className="mt-3 list-decimal pl-6 space-y-1.5 text-ink-dim leading-relaxed">
        <li>Why this matters — the elevator pitch.</li>
        <li>Three-layer view (intuition → formal → graduate).</li>
        <li>Visual exploration with a live simulator.</li>
        <li>Step-by-step derivation you can advance one move at a time.</li>
        <li>Worked example with clean numbers.</li>
        <li>Common misconceptions, paired with the corrected version.</li>
        <li>Quick quiz that scores you and remembers your result.</li>
        <li>Key takeaways, distilled.</li>
        <li>Further reading.</li>
      </ol>

      <h2 className="mt-10 text-xl font-semibold text-ink">Why interactive matters</h2>
      <p className="mt-2 text-ink-dim leading-relaxed">
        Probability is fundamentally a <em>visual</em> subject. Most beginners
        get derailed by notation that&apos;s really just describing an
        operation on a picture: a region, an area, a balance point. The
        simulators here let you turn the knobs that the formulas describe and
        see them respond — which is what builds <em>feel</em>, not just
        knowledge.
      </p>

      <h2 className="mt-10 text-xl font-semibold text-ink">Stack</h2>
      <p className="mt-2 text-ink-dim leading-relaxed">
        Built with Next.js (App Router), TypeScript, Tailwind CSS, KaTeX,
        Recharts, and Zustand for local progress storage. All simulators run
        in the browser with no server. The course content lives in plain
        TypeScript modules, which means adding a new chapter is just dropping
        a file into <code className="font-mono text-ink">content/chapters/</code> and registering it.
      </p>

      <div className="mt-10 flex flex-wrap gap-2">
        <Badge tone="accent">Next.js</Badge>
        <Badge tone="violet">TypeScript</Badge>
        <Badge tone="green">Tailwind CSS</Badge>
        <Badge tone="amber">KaTeX</Badge>
        <Badge tone="rose">Recharts</Badge>
      </div>
    </div>
  );
}

function Layer({
  tone,
  title,
  text,
}: {
  tone: "amber" | "accent" | "violet";
  title: string;
  text: string;
}) {
  const tints = {
    amber: "border-accent-amber/40 text-accent-amber",
    accent: "border-accent/40 text-accent",
    violet: "border-accent-violet/40 text-accent-violet",
  };
  return (
    <div className="rounded-2xl border border-bg-border bg-bg-card/60 p-4">
      <div className={`text-xs uppercase tracking-wider ${tints[tone]} mb-1`}>{title}</div>
      <div className="text-sm text-ink-dim leading-relaxed">{text}</div>
    </div>
  );
}
