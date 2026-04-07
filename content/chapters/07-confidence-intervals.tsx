import { Chapter } from "../types";
import { M, MD } from "@/components/math/Math";
import { FormulaBlock } from "@/components/math/FormulaBlock";
import { TheoremCard } from "@/components/math/TheoremCard";
import { ProofStepper } from "@/components/math/ProofStepper";
import { CISimulator } from "@/components/interactive/CISimulator";
import { SectionHeader } from "@/components/learning/SectionHeader";

const chapter: Chapter = {
  meta: {
    slug: "confidence-intervals",
    module: "E_estimation",
    number: 7,
    title: "Confidence Intervals",
    subtitle:
      "What a 95% interval really means — and the careful frequentist semantics that almost everyone gets wrong on the first try.",
    hook: "Confidence is a property of the procedure, not the interval. This subtle shift unlocks the whole frequentist worldview.",
    minutes: 35,
    level: 4,
    prereqs: ["central-limit-theorem", "maximum-likelihood-estimation"],
    tags: ["CI", "inference"],
  },
  content: {
    whyItMatters: (
      <>
        Point estimates are useful, but they hide their uncertainty. A
        confidence interval is the simplest tool that quantifies how much your
        estimate could be off, in a way that&apos;s frequency-calibrated. Used
        right, it&apos;s the bridge between &quot;the data say…&quot; and
        &quot;…and we should believe it to within ±X.&quot;
      </>
    ),

    intuition: (
      <>
        <p>
          You estimate a population mean from a sample and get{" "}
          <M>{`\\bar x = 7.3`}</M>. How much should you trust that number?
          The CLT says the sample mean is jiggling around the truth with
          standard deviation <M>{`\\sigma/\\sqrt{n}`}</M>. So an interval of
          roughly two standard errors on each side captures the truth most of
          the time.
        </p>
        <p>
          The subtle bit is what &quot;most of the time&quot; means. A 95%
          confidence interval is a <em>procedure</em> with the property that{" "}
          <em>before you see the data</em>, the random interval it produces
          will contain the true parameter 95% of the time. <em>After</em> you
          compute it, it&apos;s just a fixed pair of numbers — the truth is
          either in it or it isn&apos;t. There is no probability statement
          about that single interval.
        </p>
      </>
    ),

    formal: (
      <>
        <p>
          A <em>confidence interval at level <M>{`1-\\alpha`}</M></em> for a
          parameter <M>θ</M> is a pair of statistics{" "}
          <M>{`L(X), U(X)`}</M> with
        </p>
        <FormulaBlock
          formula={`P_\\theta\\!\\big(L(X) \\le \\theta \\le U(X)\\big) \\;\\ge\\; 1 - \\alpha \\quad \\forall\\, \\theta.`}
          question="Across hypothetical replications, how often does the random interval cover the true θ?"
        />
        <p>
          The probability is over the data <M>X</M>; <M>θ</M> is fixed. For
          the standard z-interval on a Normal mean with known <M>σ</M>:
        </p>
        <FormulaBlock formula={`\\bar X_n \\pm z_{1-\\alpha/2} \\cdot \\frac{\\sigma}{\\sqrt{n}}.`} />
        <p>
          When <M>σ</M> is unknown, we replace it with the sample standard
          deviation <M>s</M> and the z-quantile with the corresponding{" "}
          <M>{`t_{n-1}`}</M> quantile, giving the celebrated <em>t-interval</em>.
        </p>
      </>
    ),

    graduate: (
      <>
        <p>
          <strong>Pivotal method.</strong> Most CIs come from finding a{" "}
          <em>pivot</em>: a function of the data and parameter whose
          distribution does not depend on θ. For the Normal mean (σ known),{" "}
          <M>{`Z = (\\bar X - \\mu)/(\\sigma/\\sqrt n)`}</M> is{" "}
          <M>{`\\mathcal{N}(0,1)`}</M> regardless of μ — that&apos;s the
          pivot. Solving{" "}
          <M>{`-z_{1-\\alpha/2} \\le Z \\le z_{1-\\alpha/2}`}</M> for μ gives
          the CI.
        </p>
        <p>
          <strong>Approximate vs exact.</strong> The CLT-based interval is
          asymptotic: coverage approaches <M>{`1-\\alpha`}</M> as <M>n→∞</M>
          but is wrong for small <M>n</M>. The Wilson and Clopper–Pearson
          intervals are exact (or near-exact) finite-sample alternatives for
          binomial proportions; they outperform the naive Wald interval
          dramatically near 0 or 1.
        </p>
        <p>
          <strong>Inversion of tests ↔ duality with hypothesis testing.</strong>{" "}
          A <M>{`(1-\\alpha)`}</M> CI is exactly the set of parameter values{" "}
          <M>{`\\theta_0`}</M> that would <em>not</em> be rejected by a level-α
          test of <M>{`H_0:\\theta=\\theta_0`}</M>. Every test gives you a CI
          and vice versa — a fact that the frequentist edifice is built on.
        </p>
        <p>
          <strong>Frequentist vs Bayesian credible intervals.</strong> A 95%
          credible interval is a different beast: it&apos;s a posterior
          probability statement{" "}
          <M>{`P(\\theta \\in [L,U] \\mid \\text{data}) = 0.95`}</M>. They
          numerically coincide for many large-sample problems but conceptually
          differ — credible intervals talk about θ given the data; CIs talk
          about the procedure across hypothetical data.
        </p>
      </>
    ),

    body: (
      <>
        <SectionHeader step={1} title="Watch coverage in action" blurb="Each blue bar is a 95% interval that captured μ. Each rose bar missed. Empirical coverage approaches 95% as the number of intervals grows." />
        <CISimulator />

        <SectionHeader step={2} title="Construct one from scratch — the pivot trick" />
        <ProofStepper
          title="Z-interval for a Normal mean (σ known)"
          steps={[
            { title: "Identify the pivot.", math: "Z = \\frac{\\bar X_n - \\mu}{\\sigma/\\sqrt{n}} \\sim \\mathcal{N}(0,1)", reason: "Its distribution does not depend on μ — that is exactly what makes it a pivot." },
            { title: "Bound the pivot at level 1−α.", math: "P\\!\\left(-z_{1-\\alpha/2} \\le Z \\le z_{1-\\alpha/2}\\right) = 1-\\alpha" },
            { title: "Solve for μ inside the inequality.", math: "P\\!\\left(\\bar X_n - z_{1-\\alpha/2}\\frac{\\sigma}{\\sqrt n} \\le \\mu \\le \\bar X_n + z_{1-\\alpha/2}\\frac{\\sigma}{\\sqrt n}\\right) = 1-\\alpha" },
            { title: "Read off the interval.", math: "\\text{CI}_{1-\\alpha}(\\mu) = \\bar X_n \\pm z_{1-\\alpha/2}\\,\\frac{\\sigma}{\\sqrt n}" },
            { title: "Interpret carefully.", reason: "The probability statement is about Z (random), not about μ (fixed). After computing, the interval is just two numbers — μ is either in it or not." },
          ]}
        />

        <TheoremCard
          kind="proposition"
          name="Test–CI duality"
          statement={
            <>A two-sided level-α test of <M>{`H_0:\\theta=\\theta_0`}</M> rejects iff <M>{`\\theta_0`}</M> lies outside a corresponding (1−α) confidence interval, and vice versa.</>
          }
        >
          So every CI in this course is, secretly, a family of hypothesis
          tests. We exploit this in the next chapter.
        </TheoremCard>
      </>
    ),

    misconceptions: [
      {
        wrong: "There is a 95% probability the true mean lies in this specific interval.",
        right:
          "Not in the frequentist framework. Once computed, the interval is fixed; θ is fixed. Either it's in or it isn't. The 95% is a property of the procedure across hypothetical samples.",
      },
      {
        wrong: "Bigger CI is always more reliable.",
        right:
          "A wider interval has higher confidence at the cost of precision. A 100% CI is (-∞, ∞) — useless. The art is balancing width against confidence.",
      },
      {
        wrong: "If two CIs overlap, the means aren't significantly different.",
        right:
          "Overlapping CIs do NOT imply non-significance. A direct two-sample test or a CI for the difference is the right tool.",
      },
    ],

    takeaways: [
      "A CI is a frequency-calibrated random interval; the parameter is fixed.",
      "Construct CIs by finding a pivot, bounding it, and inverting back to the parameter.",
      "Test–CI duality: a CI is the set of parameter values that wouldn't be rejected by a level-α test.",
      "For proportions near 0 or 1, prefer Wilson or Clopper–Pearson over the Wald interval.",
      "Bayesian credible intervals are not the same object — they're answering a different question.",
    ],

    quiz: [
      {
        id: "q1",
        prompt:
          "Which statement is the correct frequentist interpretation of a 95% CI?",
        choices: [
          { id: "a", label: "There's a 95% chance μ lies in this interval." },
          { id: "b", label: "If we repeated the experiment, 95% of the produced intervals would cover μ." },
          { id: "c", label: "95% of the population lies in this interval." },
          { id: "d", label: "The point estimate is correct with 95% probability." },
        ],
        answer: "b",
        explanation:
          "Confidence is a property of the random procedure across many hypothetical replications.",
      },
      {
        id: "q2",
        prompt:
          "You quadruple your sample size. The width of a CLT-based CI for the mean changes by what factor?",
        choices: [
          { id: "a", label: "÷4" },
          { id: "b", label: "÷2" },
          { id: "c", label: "÷√4 = ÷2" },
          { id: "d", label: "Both (b) and (c)" },
        ],
        answer: "d",
        explanation:
          "Width is proportional to σ/√n, so 4× the sample size halves the width. (b) and (c) say the same thing.",
      },
      {
        id: "q3",
        prompt: "A 95% CI for μ excludes 0. What can you conclude about a two-sided test of H₀: μ = 0 at α = 0.05?",
        choices: [
          { id: "a", label: "Reject H₀." },
          { id: "b", label: "Fail to reject H₀." },
          { id: "c", label: "Need a separate p-value to decide." },
          { id: "d", label: "Cannot say without σ." },
        ],
        answer: "a",
        explanation:
          "By test–CI duality, the test rejects iff the corresponding CI excludes the null value.",
      },
    ],

    furtherReading: [
      { title: "Wasserman — All of Statistics, ch. 6 & 7" },
      { title: "Brown, Cai & DasGupta — 'Interval Estimation for a Binomial Proportion' (2001)" },
    ],
  },
};

export default chapter;
