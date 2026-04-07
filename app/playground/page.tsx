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
import { EstimatorComparisonLab } from "@/components/interactive/EstimatorComparisonLab";
import { JointDistributionExplorer } from "@/components/interactive/JointDistributionExplorer";
import { MarkovChainSimulator } from "@/components/interactive/MarkovChainSimulator";
import { useT } from "@/lib/i18n/useT";

const TOOLS = (locale: "en" | "zh") => [
  {
    id: "dist",
    label: { en: "Distributions", zh: "分布" }[locale],
    el: <DistributionExplorer />,
    blurb: { en: "Switch families and watch the shape change.", zh: "切換分布族，看形狀如何改變。" }[locale],
  },
  {
    id: "ev",
    label: { en: "Expectation & Variance", zh: "期望值與變異數" }[locale],
    el: <ExpectationVarianceLab />,
    blurb: { en: "Build a discrete random variable by hand.", zh: "親手建一個離散隨機變數。" }[locale],
  },
  {
    id: "cond",
    label: { en: "Conditional grid", zh: "條件機率方格" }[locale],
    el: <ConditionalProbabilityGrid />,
    blurb: { en: "Visualise P(A∩B), P(B), P(A|B) as rectangles.", zh: "用矩形視覺化 P(A∩B)、P(B)、P(A|B)。" }[locale],
  },
  {
    id: "joint",
    label: { en: "Joint Gaussian", zh: "雙變量常態" }[locale],
    el: <JointDistributionExplorer />,
    blurb: { en: "Tilt ρ and watch the contour ellipse rotate.", zh: "調整 ρ，看等高線橢圓旋轉。" }[locale],
  },
  {
    id: "estimator",
    label: { en: "Estimator comparison", zh: "估計量比較" }[locale],
    el: <EstimatorComparisonLab />,
    blurb: { en: "Compare bias, variance, MSE of three estimators.", zh: "比較三個估計量的 bias / variance / MSE。" }[locale],
  },
  {
    id: "lln",
    label: { en: "Law of Large Numbers", zh: "大數法則" }[locale],
    el: <LLNSimulator />,
    blurb: { en: "Three running averages converging to p.", zh: "三條跑動平均逐漸收斂到 p。" }[locale],
  },
  {
    id: "clt",
    label: { en: "Central Limit Theorem", zh: "中央極限定理" }[locale],
    el: <CLTSimulator />,
    blurb: { en: "Histogram of sample means versus the Normal limit.", zh: "樣本平均的直方圖對上常態極限。" }[locale],
  },
  {
    id: "bayes",
    label: { en: "Bayesian update (Beta)", zh: "貝氏更新（Beta）" }[locale],
    el: <BayesUpdater />,
    blurb: { en: "Posterior = prior × likelihood, in real time.", zh: "後驗 = 先驗 × 概似，即時運作。" }[locale],
  },
  {
    id: "mle",
    label: { en: "MLE explorer", zh: "MLE 探索器" }[locale],
    el: <MLEExplorer />,
    blurb: { en: "Climb the log-likelihood and snap to the MLE.", zh: "爬上對數概似曲線，對齊到 MLE。" }[locale],
  },
  {
    id: "ci",
    label: { en: "Confidence intervals", zh: "信賴區間" }[locale],
    el: <CISimulator />,
    blurb: { en: "See what 95% coverage actually looks like.", zh: "看看 95% 覆蓋率實際上長什麼樣子。" }[locale],
  },
  {
    id: "test",
    label: { en: "Hypothesis testing", zh: "假設檢定" }[locale],
    el: <HypothesisTestVisualizer />,
    blurb: { en: "α, β, and power as one picture.", zh: "α、β、檢定力，全在一張圖裡。" }[locale],
  },
  {
    id: "reg",
    label: { en: "Linear regression", zh: "線性迴歸" }[locale],
    el: <RegressionPlayground />,
    blurb: { en: "Fit OLS and watch noise vs sample size.", zh: "擬合 OLS，看雜訊與樣本數的拉鋸。" }[locale],
  },
  {
    id: "markov",
    label: { en: "Markov chain", zh: "Markov 鏈" }[locale],
    el: <MarkovChainSimulator />,
    blurb: { en: "Edit the transition matrix and watch convergence to π.", zh: "編輯轉移矩陣，看經驗占比收斂到 π。" }[locale],
  },
];

export default function PlaygroundPage() {
  const { t, locale } = useT();
  const tools = TOOLS(locale);
  const [active, setActive] = useState(tools[0].id);
  const tool = tools.find((tt) => tt.id === active)!;

  return (
    <div className="container-wide pt-12 pb-16">
      <div className="max-w-3xl">
        <div className="heading-eyebrow">{t("playground.eyebrow")}</div>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-ink">{t("playground.title")}</h1>
        <p className="mt-3 text-ink-dim leading-relaxed">{t("playground.intro")}</p>
      </div>

      <div className="mt-8 grid lg:grid-cols-[260px_1fr] gap-6">
        <aside className="space-y-1">
          {tools.map((tt) => (
            <button
              key={tt.id}
              onClick={() => setActive(tt.id)}
              className={`w-full text-left rounded-xl border px-4 py-3 transition-colors ${
                active === tt.id
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-bg-border bg-bg-card/60 text-ink-dim hover:text-ink hover:border-accent/40"
              }`}
            >
              <div className="text-sm font-medium">{tt.label}</div>
              <div className="mt-0.5 text-xs text-ink-muted">{tt.blurb}</div>
            </button>
          ))}
        </aside>
        <div>
          <div className="rounded-2xl border border-bg-border bg-bg-card/40 p-1.5">
            {tool.el}
          </div>
          <div className="mt-3 text-xs text-ink-muted">
            {t("playground.note")}
          </div>
        </div>
      </div>
    </div>
  );
}
