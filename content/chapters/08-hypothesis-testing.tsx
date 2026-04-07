import { Chapter } from "../types";
import { M, MD } from "@/components/math/Math";
import { FormulaBlock } from "@/components/math/FormulaBlock";
import { TheoremCard } from "@/components/math/TheoremCard";
import { ProofStepper } from "@/components/math/ProofStepper";
import { HypothesisTestVisualizer } from "@/components/interactive/HypothesisTestVisualizer";
import { SectionHeader } from "@/components/learning/SectionHeader";

const chapter: Chapter = {
  meta: {
    slug: "hypothesis-testing",
    module: "F_testing",
    number: 8,
    title: "Hypothesis Testing",
    subtitle:
      "Building decision rules under uncertainty: p-values, errors, power, and the Neyman–Pearson framework that makes them rigorous.",
    hook: "p-values are not the probability the null is true. Once you internalise what they actually are, the whole testing apparatus snaps into place.",
    minutes: 50,
    level: 4,
    prereqs: ["confidence-intervals"],
    tags: ["testing", "p-value", "power"],
  },
  content: {
    whyItMatters: (
      <>
        Hypothesis testing is the formalised &quot;disprove the boring story&quot;
        ritual that underpins science, A/B tests, clinical trials, and audits.
        Understanding it deeply lets you separate signal from noise{" "}
        <em>and</em> avoid the pervasive misuses that have plagued empirical
        research.
      </>
    ),

    intuition: (
      <>
        <p>
          Suppose someone claims their drug has no effect (the boring story —
          the <em>null hypothesis</em> <M>{`H_0`}</M>). You run a trial,
          observe a difference, and ask: <em>if the drug really had no effect,
          how surprising would the data I saw be?</em>
        </p>
        <p>
          That &quot;how surprising&quot; question is exactly what a{" "}
          <em>p-value</em> measures. Small p-value → the boring story is a
          poor fit → you reject it. Large p-value → the boring story still
          plausibly explains the data → you don&apos;t reject (but you
          don&apos;t prove it true either).
        </p>
        <p>
          The whole machinery is just a disciplined version of this question,
          with carefully drawn lines so you can&apos;t cheat by squinting.
        </p>
      </>
    ),

    formal: (
      <>
        <p>
          Specify a <em>null</em> <M>{`H_0`}</M> and an <em>alternative</em>{" "}
          <M>{`H_1`}</M>. Choose a <em>test statistic</em>{" "}
          <M>{`T(X)`}</M> whose distribution under <M>{`H_0`}</M> is known
          (call it the <em>null distribution</em>). Pick a{" "}
          <em>significance level</em> <M>{`\\alpha`}</M> (usually 0.05) and a{" "}
          <em>rejection region</em> <M>{`R`}</M> with{" "}
          <M>{`P_{H_0}(T \\in R) = \\alpha`}</M>. Reject <M>{`H_0`}</M> when
          your observed <M>{`T(x_{\\text{obs}}) \\in R`}</M>.
        </p>
        <FormulaBlock
          formula={`p\\text{-value} \\;=\\; P_{H_0}\\!\\big(T(X) \\text{ at least as extreme as } T(x_{\\text{obs}})\\big)`}
          question="If H₀ is true, how often would I see data this extreme or more?"
        />
        <p>The four possible outcomes:</p>
        <div className="my-3 overflow-x-auto rounded-xl border border-bg-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-bg-border bg-bg-soft text-ink-dim">
                <th className="px-3 py-2 text-left"></th>
                <th className="px-3 py-2 text-left">H₀ true</th>
                <th className="px-3 py-2 text-left">H₁ true</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-bg-border">
                <td className="px-3 py-2 text-ink-dim">Reject H₀</td>
                <td className="px-3 py-2 text-accent-rose">Type I error (α)</td>
                <td className="px-3 py-2 text-accent-green">Power (1−β)</td>
              </tr>
              <tr>
                <td className="px-3 py-2 text-ink-dim">Fail to reject</td>
                <td className="px-3 py-2 text-ink">Correct (1−α)</td>
                <td className="px-3 py-2 text-accent-amber">Type II error (β)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </>
    ),

    graduate: (
      <>
        <p>
          <strong>Neyman–Pearson lemma.</strong> For testing two simple
          hypotheses <M>{`H_0:\\theta=\\theta_0`}</M> versus{" "}
          <M>{`H_1:\\theta=\\theta_1`}</M>, the most powerful level-α test
          rejects when the likelihood ratio is large:
        </p>
        <FormulaBlock
          formula={`\\Lambda(x) = \\frac{f(x;\\theta_1)}{f(x;\\theta_0)} > k_\\alpha,`}
          question="What rejection region maximises power for a fixed false-positive rate?"
        />
        <p>
          where <M>{`k_\\alpha`}</M> is chosen to give exactly{" "}
          <M>{`P_{H_0}(\\Lambda > k_\\alpha) = \\alpha`}</M>. Many classical
          tests (t-test, chi-square, F-test) are likelihood-ratio tests in
          disguise.
        </p>
        <p>
          <strong>Wilks&apos; theorem.</strong> Under regularity conditions,
          for nested models with d degrees of freedom difference,{" "}
          <M>{`-2\\log \\Lambda \\xrightarrow{d} \\chi^2_d`}</M> as <M>n→∞</M>.
          This gives an asymptotic null distribution for the likelihood ratio
          and is the engine behind generalised LR tests.
        </p>
        <p>
          <strong>Multiple testing.</strong> If you run <M>m</M> independent
          tests at level α, the chance of at least one false rejection is{" "}
          <M>{`1-(1-\\alpha)^m`}</M>, which explodes quickly. The two main
          corrections: (i) Bonferroni — control family-wise error by using
          α/m per test; (ii) Benjamini–Hochberg — control the false discovery
          rate, a more powerful approach for genomics-scale problems.
        </p>
        <p>
          <strong>What a p-value is NOT.</strong> Not the probability that{" "}
          <M>{`H_0`}</M> is true. Not the probability of the observed data.
          Not the probability that the result was &quot;due to chance&quot;
          (this phrase is meaningless). It is purely{" "}
          <M>{`P_{H_0}(T \\ge t_{\\text{obs}})`}</M>.
        </p>
      </>
    ),

    body: (
      <>
        <SectionHeader step={1} title="See α, β, and power as one picture" blurb="Two distributions: blue under H₀, green under H₁. The dashed lines mark the rejection region. Drag them and watch the trade-off." />
        <HypothesisTestVisualizer />

        <SectionHeader step={2} title="Worked example: one-sample z-test" />
        <p className="text-ink-dim leading-relaxed">
          Suppose you suspect a biased coin. Out of 100 flips, you see 60
          heads. Test <M>{`H_0: p=0.5`}</M> against{" "}
          <M>{`H_1: p\\ne 0.5`}</M>.
        </p>
        <ProofStepper
          title="Two-sided z-test for a proportion"
          steps={[
            { title: "Compute the test statistic.", math: "Z = \\frac{\\hat p - p_0}{\\sqrt{p_0(1-p_0)/n}} = \\frac{0.6 - 0.5}{\\sqrt{0.25/100}} = 2.0" },
            { title: "Find the two-sided p-value under H₀.", math: "p\\text{-value} = 2 P(Z \\ge 2.0) \\approx 2(0.0228) = 0.0456" },
            { title: "Compare to α = 0.05.", reason: "0.0456 < 0.05 ⇒ reject H₀ at the 5% level." },
            { title: "Interpret with care.", reason: "We are NOT saying 'P(coin is fair) = 0.0456'. We are saying: if the coin were fair, getting at least this lopsided a result would happen ~4.6% of the time. That's rare enough to make us doubt fairness — at our chosen tolerance." },
          ]}
        />

        <TheoremCard
          kind="theorem"
          name="Neyman–Pearson lemma"
          statement={
            <>
              For testing simple <M>{`H_0`}</M> vs simple <M>{`H_1`}</M>, the
              likelihood-ratio test
              <MD>{`\\phi^*(x) = \\mathbb{1}\\!\\left\\{\\frac{f(x;\\theta_1)}{f(x;\\theta_0)} > k\\right\\}`}</MD>
              is uniformly most powerful at any level α it achieves.
            </>
          }
        >
          Intuition: if you only have a fixed budget of false positives to
          spend, the best place to spend them is on the data points that
          discriminate most strongly between the two hypotheses — and the
          likelihood ratio measures exactly that.
        </TheoremCard>

        <SectionHeader step={3} title="Power and sample size" />
        <p className="text-ink-dim leading-relaxed">
          Power is the probability of detecting a real effect of a given
          size. For a one-sided z-test of <M>{`H_0:\\mu=\\mu_0`}</M> against{" "}
          <M>{`H_1:\\mu=\\mu_1>\\mu_0`}</M> at level α, the power is:
        </p>
        <FormulaBlock
          formula={`\\text{Power} \\;=\\; \\Phi\\!\\left(\\frac{\\mu_1 - \\mu_0}{\\sigma/\\sqrt n} - z_{1-\\alpha}\\right)`}
        />
        <p className="text-ink-dim leading-relaxed">
          Three knobs: (i) effect size{" "}
          <M>{`(\\mu_1 - \\mu_0)/\\sigma`}</M>, (ii) sample size <M>n</M>,
          (iii) significance level α. Power calculations let you choose the
          smallest <M>n</M> that achieves a target power for a meaningful
          effect — and they are how you avoid running underpowered studies
          that can&apos;t learn anything.
        </p>
      </>
    ),

    misconceptions: [
      {
        wrong: "p < 0.05 means there is a 95% chance the effect is real.",
        right:
          "The p-value is P(data this extreme | H₀). It says nothing about P(H₀ | data) without a prior. The two are related by Bayes' theorem, not equal.",
        why: "This is the most common — and most consequential — misuse in published science.",
      },
      {
        wrong: "Failing to reject H₀ means H₀ is true.",
        right:
          "It means you don't have enough evidence to reject H₀. Absence of evidence is not evidence of absence — especially in underpowered studies.",
      },
      {
        wrong: "A small p-value means a large effect.",
        right:
          "It means a small probability of seeing such data under H₀. With huge n, even tiny effects yield tiny p-values. Always report effect sizes alongside p-values.",
      },
    ],

    takeaways: [
      "Tests are decision rules: pick α, choose a test statistic, compute its null distribution, decide.",
      "Type I = false alarm (controlled at α). Type II = miss (β). Power = 1 − β.",
      "Power depends on effect size, sample size, and α — three knobs you can trade off.",
      "Likelihood-ratio tests are optimal for simple-vs-simple hypotheses (Neyman–Pearson) and asymptotically χ² (Wilks).",
      "p-values are NOT P(H₀ | data) and never have been.",
    ],

    quiz: [
      {
        id: "q1",
        prompt: "A test rejects H₀ when p < 0.05. The 0.05 controls...",
        choices: [
          { id: "a", label: "P(H₀ true | reject)" },
          { id: "b", label: "P(reject | H₀ true)" },
          { id: "c", label: "P(reject | H₀ false)" },
          { id: "d", label: "P(H₁ true | reject)" },
        ],
        answer: "b",
        explanation:
          "α = P(reject H₀ | H₀ true) = type I error rate. Posterior probabilities require a prior — they're not what α is.",
      },
      {
        id: "q2",
        prompt:
          "You quadruple your sample size, holding everything else fixed. The standard error of the test statistic and the power change how?",
        choices: [
          { id: "a", label: "SE halves; power increases" },
          { id: "b", label: "SE quarters; power decreases" },
          { id: "c", label: "SE unchanged; power doubles" },
          { id: "d", label: "SE doubles; power decreases" },
        ],
        answer: "a",
        explanation:
          "SE ∝ 1/√n, so 4× n halves the SE. The same effect size becomes more 'visible', which increases power.",
      },
      {
        id: "q3",
        prompt:
          "You run 20 independent tests at α = 0.05. The probability of at least one false positive under all-true nulls is approximately...",
        choices: [
          { id: "a", label: "0.05" },
          { id: "b", label: "0.20" },
          { id: "c", label: "0.36" },
          { id: "d", label: "0.64" },
        ],
        answer: "d",
        explanation:
          "1 − (1 − 0.05)^20 ≈ 1 − 0.358 ≈ 0.642. Without correction, multiple testing makes false positives almost certain.",
      },
    ],

    furtherReading: [
      { title: "Lehmann & Romano — Testing Statistical Hypotheses" },
      { title: "Wasserman — All of Statistics, ch. 10 & 11" },
      { title: "ASA Statement on p-values (Wasserstein & Lazar, 2016)" },
    ],
  },
};

export default chapter;
