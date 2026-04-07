import { Chapter } from "../types";
import { M } from "@/components/math/Math";
import { FormulaBlock } from "@/components/math/FormulaBlock";
import { TheoremCard } from "@/components/math/TheoremCard";
import { ProofStepper } from "@/components/math/ProofStepper";
import { LLNSimulator } from "@/components/interactive/LLNSimulator";
import { SectionHeader } from "@/components/learning/SectionHeader";

const chapter: Chapter = {
  meta: {
    slug: "law-of-large-numbers",
    module: "C_limit_theorems",
    number: 4,
    title: "The Law of Large Numbers",
    subtitle:
      "Why averages are predictable even when individual outcomes are not.",
    hook: "The hidden machinery behind A/B tests, Monte Carlo, and 'enough data fixes it'.",
    minutes: 30,
    level: 3,
    prereqs: ["random-variables-expectation-variance"],
    tags: ["LLN", "convergence", "limits"],
  },
  content: {
    whyItMatters: (
      <>
        Almost every quantitative claim about a system — &quot;the average
        click-through rate is 3%&quot;, &quot;this estimator is unbiased&quot;,
        &quot;Monte Carlo will converge if we run long enough&quot; — implicitly
        invokes the law of large numbers. It is the formal justification for
        the everyday intuition that big enough samples make randomness
        average out.
      </>
    ),

    intuition: (
      <>
        <p>
          Flip a coin once: you get heads or tails. Flip it ten times: maybe 7
          heads, maybe 3. Flip it a million times: the proportion of heads
          will sit incredibly close to 0.5. The LLN says this is not luck —
          it&apos;s mathematically forced. As the sample size grows, the sample
          mean&apos;s distribution becomes a needle pinned to the true mean.
        </p>
        <p>
          Crucially, the LLN does <em>not</em> say &quot;heads has to come back
          to balance tails&quot; (the gambler&apos;s fallacy). It says the
          ratio approaches 0.5 because the absolute deviation grows slowly
          (like <M>{`\\sqrt{n}`}</M>) while the denominator grows like{" "}
          <M>n</M>. The fraction is squeezed toward the mean by arithmetic,
          not by self-correction.
        </p>
      </>
    ),

    formal: (
      <>
        <p>
          Let <M>{`X_1, X_2, \\dots`}</M> be i.i.d. random variables with
          mean <M>{`\\mu = E[X_i]`}</M>. Define the sample mean{" "}
          <M>{`\\bar X_n = \\frac{1}{n}\\sum_{i=1}^n X_i`}</M>.
        </p>
        <FormulaBlock
          formula={`\\textbf{Weak LLN: } \\bar X_n \\xrightarrow{P} \\mu \\quad\\text{as } n\\to\\infty.`}
          question="In what sense does the sample mean approach the true mean?"
        />
        <p>This says that for every <M>{`\\varepsilon > 0`}</M>:</p>
        <FormulaBlock
          formula={`P(|\\bar X_n - \\mu| > \\varepsilon) \\;\\longrightarrow\\; 0 \\text{ as } n\\to\\infty.`}
        />
        <p>
          The <em>strong</em> LLN says even more: with probability 1 the
          entire trajectory of sample means converges to <M>μ</M>. We&apos;ll
          treat the strong LLN as a black box and prove the weak version,
          since one quick application of Chebyshev does the job.
        </p>
      </>
    ),

    graduate: (
      <>
        <p>
          <strong>Weak vs strong vs almost sure.</strong> The weak LLN talks
          about the marginal distribution of <M>{`\\bar X_n`}</M> at each n.
          The strong LLN is a statement about the entire sample path:{" "}
          <M>{`P(\\lim_n \\bar X_n = \\mu) = 1`}</M>. These are conceptually
          different — the weak version follows from Chebyshev when the
          variance is finite; the strong version typically uses Borel–Cantelli
          and the truncation method (Etemadi&apos;s proof).
        </p>
        <p>
          <strong>Conditions actually matter.</strong> The classical LLN
          assumes either i.i.d. with finite mean (Kolmogorov&apos;s SLLN), or
          finite variance (the version we prove below). When the underlying
          distribution has heavy tails — Cauchy, Pareto with{" "}
          <M>{`\\alpha\\le 1`}</M> — sample means do not converge at all. This
          is not a pathology: many financial and network datasets live in
          this regime, and using the LLN there is dangerous.
        </p>
        <p>
          <strong>Connection to ergodic theory.</strong> The LLN is the
          baseline result of ergodic theory: time averages equal space
          averages. Birkhoff&apos;s ergodic theorem generalises the SLLN to
          dependent sequences (e.g. ergodic Markov chains), and is the formal
          backbone of MCMC.
        </p>
      </>
    ),

    body: (
      <>
        <SectionHeader step={1} title="Watch it happen" blurb="Three independent runs of running averages. Notice how they all funnel toward p without crossing back over each other in any disciplined way." />
        <LLNSimulator />

        <SectionHeader step={2} title="A clean proof of the weak LLN (finite variance case)" />
        <ProofStepper
          title="Weak LLN via Chebyshev"
          steps={[
            { title: "Compute mean and variance of the sample mean.", math: "E[\\bar X_n] = \\mu, \\quad \\text{Var}(\\bar X_n) = \\frac{\\sigma^2}{n}.", reason: "By linearity of expectation and independence of the X_i." },
            { title: "Apply Chebyshev's inequality.", math: "P(|\\bar X_n - \\mu| > \\varepsilon) \\le \\frac{\\text{Var}(\\bar X_n)}{\\varepsilon^2} = \\frac{\\sigma^2}{n \\varepsilon^2}." },
            { title: "Take n → ∞.", math: "\\frac{\\sigma^2}{n\\varepsilon^2} \\to 0.", reason: "The right-hand side vanishes for any fixed ε > 0, which is exactly convergence in probability." },
            { title: "Conclude.", reason: "Therefore X̄_n → μ in probability — the weak LLN. Notice what we used: only finite variance and independence. No assumption about the shape of the distribution." },
          ]}
        />

        <TheoremCard
          kind="theorem"
          name="Strong Law of Large Numbers (Kolmogorov)"
          statement={
            <>
              If <M>{`X_1, X_2, \\dots`}</M> are i.i.d. with finite mean{" "}
              <M>{`\\mu`}</M>, then{" "}
              <M>{`P(\\bar X_n \\to \\mu) = 1`}</M> as <M>n→∞</M>.
            </>
          }
        >
          The proof is more delicate (Etemadi&apos;s argument is the cleanest
          modern version) but the conclusion is the practical one: with
          probability one, your running average will eventually be arbitrarily
          close to the true mean and stay there.
        </TheoremCard>
      </>
    ),

    misconceptions: [
      {
        wrong: "After many tails, heads is 'due'.",
        right:
          "The coin has no memory. Past flips do not change future probabilities. The LLN drives the ratio to 0.5 because the denominator grows faster than the deviation, not because the coin self-corrects.",
        why: "This is the gambler's fallacy. The absolute imbalance |H - T| can keep growing — it's the proportion that stabilises.",
      },
      {
        wrong: "LLN means estimators are always accurate with enough data.",
        right:
          "It says they converge to the true mean. The rate is only governed by the CLT (and only when variance is finite). If you sample from a Cauchy, no amount of data helps.",
      },
      {
        wrong: "LLN holds for any sequence of random variables.",
        right:
          "It needs at least independence (or ergodicity) and finite mean. Strongly correlated processes can fail dramatically — that's why time series analysis exists.",
      },
    ],

    takeaways: [
      "The sample mean converges to the population mean: in probability (weak), or with probability 1 (strong).",
      "The proof reduces to Chebyshev: variance of the sample mean is σ²/n, which goes to 0.",
      "LLN says nothing about how fast — that is the job of the CLT.",
      "Independence + finite mean (or finite variance) are required. Heavy tails or strong dependence can break it.",
    ],

    quiz: [
      {
        id: "q1",
        prompt:
          "Which assumption is NOT used in the proof of the weak LLN via Chebyshev?",
        choices: [
          { id: "a", label: "Finite variance" },
          { id: "b", label: "Independence" },
          { id: "c", label: "Identically distributed" },
          { id: "d", label: "Symmetric distribution" },
        ],
        answer: "d",
        explanation:
          "Symmetry is irrelevant. We need i.i.d. and finite variance — the distribution can have any shape.",
      },
      {
        id: "q2",
        prompt:
          "A gambler has lost 9 fair coin flips in a row. The probability that flip 10 is heads is...",
        choices: [
          { id: "a", label: "Greater than 0.5 (regression to the mean)" },
          { id: "b", label: "Exactly 0.5" },
          { id: "c", label: "Less than 0.5" },
          { id: "d", label: "Cannot say without LLN" },
        ],
        answer: "b",
        explanation:
          "Independent flips have no memory. The LLN talks about long-run frequencies, not next-flip probabilities.",
      },
      {
        id: "q3",
        prompt:
          "The standard deviation of the sample mean of n i.i.d. random variables with variance σ² is...",
        choices: [
          { id: "a", label: "σ²/n" },
          { id: "b", label: "σ²" },
          { id: "c", label: "σ/√n" },
          { id: "d", label: "σ·√n" },
        ],
        answer: "c",
        explanation:
          "Var(X̄_n) = σ²/n, so SD(X̄_n) = σ/√n. This is the famous 'square-root-n' rule that drives sample size planning.",
      },
    ],

    furtherReading: [
      { title: "Durrett — Probability: Theory and Examples, ch. 2" },
      { title: "Williams — Probability with Martingales, ch. 12" },
    ],
  },
};

export default chapter;
