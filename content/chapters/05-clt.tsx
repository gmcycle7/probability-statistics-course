import { Chapter } from "../types";
import { M, MD } from "@/components/math/Math";
import { FormulaBlock } from "@/components/math/FormulaBlock";
import { TheoremCard } from "@/components/math/TheoremCard";
import { ProofStepper } from "@/components/math/ProofStepper";
import { CLTSimulator } from "@/components/interactive/CLTSimulator";
import { SectionHeader } from "@/components/learning/SectionHeader";

const chapter: Chapter = {
  meta: {
    slug: "central-limit-theorem",
    module: "C_limit_theorems",
    number: 5,
    title: "The Central Limit Theorem",
    subtitle:
      "Why averages of almost anything are approximately Normal — and why that single fact powers nearly every confidence interval and z-test.",
    hook: "Pick any distribution. Average enough samples. Get a Normal. The depth of this miracle is hard to overstate.",
    minutes: 40,
    level: 4,
    prereqs: ["law-of-large-numbers"],
    tags: ["CLT", "normal", "convergence"],
  },
  content: {
    whyItMatters: (
      <>
        The CLT is the reason the Normal distribution sits at the centre of
        statistics: it&apos;s the limiting shape of (almost) any sample mean.
        That single fact is what lets you build a confidence interval without
        knowing the underlying distribution, what justifies most z and t
        tests, and what makes machine-learning loss landscapes asymptotically
        Gaussian. If the LLN says &quot;averages converge&quot;, the CLT says{" "}
        <em>how fast</em> and <em>in what shape</em>.
      </>
    ),

    intuition: (
      <>
        <p>
          Take any well-behaved distribution — Uniform, Exponential,
          Bernoulli, weird bimodal mixtures. Sample <M>n</M> values from it
          independently and average them. Now repeat that experiment a
          thousand times and look at the histogram of the averages.
        </p>
        <p>
          The miracle is that this histogram looks Gaussian, regardless of
          where you started. The original shape gets averaged into a smooth
          bell. The mean of the bell is the true mean of the source; the
          standard deviation shrinks like <M>{`\\sigma/\\sqrt{n}`}</M>.
        </p>
        <p>
          This is the deepest reason why the Normal distribution is everywhere
          in nature: any quantity that is itself a sum of many small,
          independent contributions automatically inherits a Normal shape.
        </p>
      </>
    ),

    formal: (
      <>
        <p>
          Let <M>{`X_1, X_2, \\dots`}</M> be i.i.d. with mean <M>{`\\mu`}</M>{" "}
          and finite variance <M>{`\\sigma^2`}</M>. Then the standardised
          sample mean
        </p>
        <FormulaBlock
          formula={`Z_n \\;=\\; \\frac{\\bar X_n - \\mu}{\\sigma / \\sqrt{n}}`}
          question="What does the deviation of the sample mean look like, on the right scale?"
        />
        <p>converges in distribution to a standard Normal:</p>
        <FormulaBlock formula={`Z_n \\xrightarrow{d} \\mathcal{N}(0, 1) \\quad \\text{as } n\\to\\infty.`} />
        <p>
          Equivalently, for large <M>n</M>:{" "}
          <M>{`\\bar X_n \\;\\dot\\sim\\; \\mathcal{N}\\!\\big(\\mu,\\,\\sigma^2/n\\big)`}</M>.
          That is the form you actually use in practice.
        </p>
      </>
    ),

    graduate: (
      <>
        <p>
          <strong>Convergence in distribution.</strong> The CLT is a statement
          about CDFs: <M>{`P(Z_n \\le z) \\to \\Phi(z)`}</M> at every point of
          continuity of the limit. This is weaker than convergence in
          probability — the random variables themselves do not have to settle
          down to a single value, only the <em>distributions</em>.
        </p>
        <p>
          <strong>Finite variance is essential.</strong> Without it, the CLT
          fails. For symmetric stable distributions with index{" "}
          <M>{`\\alpha < 2`}</M> (e.g. Cauchy), the sample mean has the same
          distribution as one observation — averaging does <em>nothing</em>.
          Heavy-tailed regimes are governed by the generalised CLT and stable
          laws.
        </p>
        <p>
          <strong>Berry–Esseen.</strong> The CLT comes with quantitative
          error bounds. If <M>{`\\rho = E|X-\\mu|^3 < \\infty`}</M>, then
          there exists a universal constant <M>C</M> with{" "}
          <M>{`\\sup_z |P(Z_n\\le z)-\\Phi(z)| \\le C\\rho/(\\sigma^3\\sqrt{n})`}</M>.
          The takeaway: convergence is at rate <M>{`1/\\sqrt{n}`}</M>, and
          symmetric distributions with thin tails get there faster than
          skewed ones.
        </p>
        <p>
          <strong>Multivariate CLT and the delta method.</strong> If{" "}
          <M>{`\\sqrt{n}(\\bar X_n - \\mu) \\to \\mathcal{N}(0, \\Sigma)`}</M>{" "}
          and <M>g</M> is differentiable, then{" "}
          <M>{`\\sqrt{n}(g(\\bar X_n) - g(\\mu)) \\to \\mathcal{N}(0, \\nabla g(\\mu)^T \\Sigma \\nabla g(\\mu))`}</M>.
          This is the workhorse for deriving asymptotic distributions of
          everything from log-odds to correlation coefficients.
        </p>
      </>
    ),

    body: (
      <>
        <SectionHeader step={1} title="See it converge" blurb="Pick a wildly non-Normal source. Slide n upward. Watch the histogram of sample means morph into the orange Normal curve." />
        <CLTSimulator />

        <SectionHeader step={2} title="Proof sketch via moment generating functions" blurb="The cleanest classical proof. Lévy's continuity theorem then says convergence of MGFs implies convergence in distribution." />
        <ProofStepper
          title="CLT via MGFs"
          steps={[
            { title: "Centre and rescale.", math: "Y_i = \\frac{X_i - \\mu}{\\sigma}, \\quad Z_n = \\frac{1}{\\sqrt{n}} \\sum_{i=1}^n Y_i.", reason: "The Y_i are i.i.d. with mean 0 and variance 1." },
            { title: "Compute the MGF of Y.", math: "M_Y(t) = 1 + 0\\cdot t + \\tfrac{1}{2}t^2 + o(t^2)", reason: "Taylor expand around 0 using E[Y]=0 and E[Y²]=1." },
            { title: "Use independence to multiply.", math: "M_{Z_n}(t) = \\big(M_Y(t/\\sqrt{n})\\big)^n" },
            { title: "Plug in the expansion.", math: "= \\left(1 + \\frac{t^2}{2n} + o(1/n)\\right)^n" },
            { title: "Take the limit.", math: "\\to e^{t^2/2}", reason: "(1 + a/n)^n → e^a." },
            { title: "Recognise the limit.", reason: "e^{t²/2} is the MGF of a standard Normal. By Lévy's continuity theorem, Z_n → N(0,1) in distribution." },
          ]}
        />

        <TheoremCard
          kind="theorem"
          name="Central Limit Theorem (Lindeberg–Lévy)"
          statement={
            <>
              If <M>{`X_1, X_2, \\dots`}</M> are i.i.d. with{" "}
              <M>{`E[X_i]=\\mu`}</M> and <M>{`\\text{Var}(X_i)=\\sigma^2 \\in (0,\\infty)`}</M>,
              then{" "}
              <M>{`\\sqrt{n}(\\bar X_n - \\mu)/\\sigma \\xrightarrow{d} \\mathcal{N}(0,1)`}</M>.
            </>
          }
        >
          The Lindeberg condition generalises this further to non-identically
          distributed but uniformly small contributions — that&apos;s the
          version you need to handle e.g. residuals in regression.
        </TheoremCard>

        <SectionHeader step={3} title="Practical implication: confidence intervals for free" />
        <p className="text-ink-dim leading-relaxed">
          The CLT gives you an approximate distribution for the sample mean
          regardless of the underlying data. So a 95% interval for the
          population mean is approximately
        </p>
        <FormulaBlock
          formula={`\\bar X_n \\pm 1.96 \\cdot \\frac{s}{\\sqrt{n}}`}
          caption="where s is the sample standard deviation. Replace 1.96 with the appropriate quantile for other confidence levels."
        />
        <p className="text-ink-dim leading-relaxed">
          This is the recipe behind nearly every confidence interval in
          undergraduate statistics. The CLT is what makes it work even when
          your data are far from Normal.
        </p>
      </>
    ),

    misconceptions: [
      {
        wrong: "Data become Normal as you collect more.",
        right:
          "Only the distribution of the sample MEAN tends to Normal. The raw data keep their original shape forever.",
        why: "If you forget this, you'll wrongly conclude that 'big data are Gaussian' and apply Normal-based tests to wildly skewed distributions.",
      },
      {
        wrong: "n = 30 is the magic threshold for the CLT.",
        right:
          "There is no universal threshold. Symmetric, thin-tailed distributions converge fast (n = 10 may suffice). Heavy-skewed or heavy-tailed ones may need n = 1000 or more — or never converge at all.",
      },
      {
        wrong: "The CLT requires the X_i to be independent.",
        right:
          "Independence is sufficient but not necessary. There are CLTs for martingale differences, mixing sequences, and ergodic stationary processes — but each requires its own technical conditions.",
      },
    ],

    takeaways: [
      "Sample means of i.i.d. variables with finite variance are asymptotically Normal, regardless of the source distribution.",
      "The standard error of the mean shrinks like σ/√n; this is the rate at which uncertainty falls.",
      "Berry–Esseen quantifies the error: convergence is at rate 1/√n, slower for skewed distributions.",
      "The CLT fails for infinite-variance distributions; stable laws take over.",
      "Almost every classical confidence interval and z-test is a one-line consequence of the CLT.",
    ],

    quiz: [
      {
        id: "q1",
        prompt:
          "X̄_n is the sample mean of n=100 i.i.d. observations with mean μ=10 and σ=4. The approximate distribution of X̄_n is...",
        choices: [
          { id: "a", label: "N(10, 16)" },
          { id: "b", label: "N(10, 0.16)" },
          { id: "c", label: "N(10, 0.04)" },
          { id: "d", label: "N(10, 4)" },
        ],
        answer: "b",
        explanation:
          "By the CLT, X̄_n ≈ N(μ, σ²/n) = N(10, 16/100) = N(10, 0.16). The standard error is σ/√n = 0.4.",
      },
      {
        id: "q2",
        prompt: "Which of the following can BREAK the CLT?",
        choices: [
          { id: "a", label: "A skewed source distribution" },
          { id: "b", label: "An infinite-variance source distribution" },
          { id: "c", label: "A discrete source distribution" },
          { id: "d", label: "Bimodal source distribution" },
        ],
        answer: "b",
        explanation:
          "The CLT requires finite variance. Skew, discreteness, and multimodality only slow convergence; they don't break it.",
      },
      {
        id: "q3",
        prompt:
          "By the CLT, an approximate 95% interval for the population mean is...",
        choices: [
          { id: "a", label: "X̄ ± 1.96·σ" },
          { id: "b", label: "X̄ ± 1.96·σ/√n" },
          { id: "c", label: "X̄ ± 2·σ²/n" },
          { id: "d", label: "X̄ ± n·σ" },
        ],
        answer: "b",
        explanation:
          "The standard error of the mean is σ/√n; the 95% z-quantile is ≈ 1.96.",
      },
    ],

    furtherReading: [
      { title: "Durrett — Probability: Theory and Examples, ch. 3" },
      { title: "Lehmann — Elements of Large-Sample Theory, ch. 2" },
    ],
  },
};

export default chapter;
