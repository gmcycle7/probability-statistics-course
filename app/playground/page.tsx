"use client";

import { useState } from "react";
import { DistributionExplorer } from "@/components/interactive/DistributionExplorer";
import { CLTSimulator } from "@/components/interactive/CLTSimulator";
import { LLNSimulator } from "@/components/interactive/LLNSimulator";
import { BayesUpdater } from "@/components/interactive/BayesUpdater";
import { MLEExplorer } from "@/components/interactive/MLEExplorer";
import { CISimulator } from "@/components/interactive/CISimulator";
import { HypothesisTestVisualizer } from "@/components/interactive/HypothesisTestVisualizer";
import { RegressionPlayground } from "@/components/interactive/RegressionPlayground";
import { ConditionalProbabilityGrid } from "@/components/interactive/ConditionalProbabilityGrid";
import { ExpectationVarianceLab } from "@/components/interactive/ExpectationVarianceLab";

const TOOLS = [
  { id: "dist", label: "Distributions", el: <DistributionExplorer />, blurb: "Switch families and watch the shape change." },
  { id: "ev", label: "Expectation & Variance", el: <ExpectationVarianceLab />, blurb: "Build a discrete random variable by hand." },
  { id: "cond", label: "Conditional grid", el: <ConditionalProbabilityGrid />, blurb: "Visualise P(A∩B), P(B), P(A|B) as rectangles." },
  { id: "lln", label: "Law of Large Numbers", el: <LLNSimulator />, blurb: "Three running averages converging to p." },
  { id: "clt", label: "Central Limit Theorem", el: <CLTSimulator />, blurb: "Histogram of sample means versus the Normal limit." },
  { id: "bayes", label: "Bayesian update (Beta)", el: <BayesUpdater />, blurb: "Posterior = prior × likelihood, in real time." },
  { id: "mle", label: "MLE explorer", el: <MLEExplorer />, blurb: "Climb the log-likelihood and snap to the MLE." },
  { id: "ci", label: "Confidence intervals", el: <CISimulator />, blurb: "See what 95% coverage actually looks like." },
  { id: "test", label: "Hypothesis testing", el: <HypothesisTestVisualizer />, blurb: "α, β, and power as one picture." },
  { id: "reg", label: "Linear regression", el: <RegressionPlayground />, blurb: "Fit OLS and watch noise vs sample size." },
];

export default function PlaygroundPage() {
  const [active, setActive] = useState(TOOLS[0].id);
  const tool = TOOLS.find((t) => t.id === active)!;

  return (
    <div className="container-wide pt-12 pb-16">
      <div className="max-w-3xl">
        <div className="heading-eyebrow">Playground</div>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-ink">Every interactive in one place</h1>
        <p className="mt-3 text-ink-dim leading-relaxed">
          Use this page like a sandbox: pick any simulator, play with it for a
          while, develop your intuition, then go back to the chapter for the
          formalism.
        </p>
      </div>

      <div className="mt-8 grid lg:grid-cols-[260px_1fr] gap-6">
        <aside className="space-y-1">
          {TOOLS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className={`w-full text-left rounded-xl border px-4 py-3 transition-colors ${
                active === t.id
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-bg-border bg-bg-card/60 text-ink-dim hover:text-ink hover:border-accent/40"
              }`}
            >
              <div className="text-sm font-medium">{t.label}</div>
              <div className="mt-0.5 text-xs text-ink-muted">{t.blurb}</div>
            </button>
          ))}
        </aside>
        <div>
          <div className="rounded-2xl border border-bg-border bg-bg-card/40 p-1.5">
            {tool.el}
          </div>
          <div className="mt-3 text-xs text-ink-muted">
            All simulations run locally in your browser using JavaScript. No
            server, no telemetry — your sliders stay yours.
          </div>
        </div>
      </div>
    </div>
  );
}
