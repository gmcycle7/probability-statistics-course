import { Chapter } from "../types";
import { M, MD } from "@/components/math/Math";
import { FormulaBlock } from "@/components/math/FormulaBlock";
import { TheoremCard } from "@/components/math/TheoremCard";
import { ProofStepper } from "@/components/math/ProofStepper";
import { ExpectationVarianceLab } from "@/components/interactive/ExpectationVarianceLab";
import { SectionHeader } from "@/components/learning/SectionHeader";

const chapter: Chapter = {
  meta: {
    slug: "random-variables-expectation-variance",
    module: "B_random_variables",
    number: 2,
    title: "Random Variables, Expectation & Variance",
    subtitle:
      "From outcomes to numbers. From numbers to summaries that compress an entire distribution into a few moments.",
    hook: "Why E[X] is a balance point and Var(X) is the spread of mass around it — and why both shape every estimator you'll ever build.",
    minutes: 40,
    level: 3,
    prereqs: ["conditional-probability-and-bayes"],
    tags: ["expectation", "variance", "moments"],
  },
  content: {
    whyItMatters: (
      <>
        Outcomes are messy; numbers are tractable. A <em>random variable</em>{" "}
        is a function that turns outcomes into numbers, so we can finally talk
        about means, spreads, correlations, and limits. Every statistic you
        ever compute — sample averages, regression coefficients, neural-network
        losses — is ultimately a function of random variables, and almost all
        of the magic flows from two summaries: <em>expectation</em> and{" "}
        <em>variance</em>.
      </>
    ),

    intuition: (
      <>
        <p>
          Imagine the distribution of a random variable as a pile of mass
          spread along the number line. <strong>Expectation</strong> is its{" "}
          <em>balance point</em>: the place where the pile balances on a
          knife-edge. <strong>Variance</strong> is the average squared distance
          from that balance point — a measure of how stretched-out the pile
          is.
        </p>
        <p>
          Why squared and not absolute distance? Two reasons. (1) Squares are
          smooth and additive: <M>{`\\text{Var}(X+Y)=\\text{Var}(X)+\\text{Var}(Y)`}</M>{" "}
          when independent — a magical fact that breaks under absolute values.
          (2) Squared distance is the unique loss whose minimiser is the mean
          (try the proof below). The whole edifice of least-squares
          regression, ANOVA, and Kalman filtering rests on this choice.
        </p>
      </>
    ),

    formal: (
      <>
        <p>
          Let <M>{`(\\Omega, \\mathcal{F}, P)`}</M> be a probability space. A{" "}
          <em>random variable</em> is a measurable function{" "}
          <M>{`X:\\Omega\\to\\mathbb{R}`}</M>. Its <em>distribution</em> is
          described by either a probability mass function{" "}
          <M>{`p_X(x)=P(X=x)`}</M> in the discrete case, or a density{" "}
          <M>{`f_X(x)`}</M> with{" "}
          <M>{`P(a\\le X\\le b)=\\int_a^b f_X(x)\\,dx`}</M> in the continuous
          case. The cumulative distribution function{" "}
          <M>{`F_X(x)=P(X\\le x)`}</M> is the universal description that works
          for both.
        </p>
        <p>
          The <em>expectation</em> of <M>{`X`}</M> is
        </p>
        <FormulaBlock
          formula={`E[X] \\;=\\; \\sum_x x\\, p_X(x) \\quad \\text{or} \\quad \\int_{-\\infty}^{\\infty} x\\, f_X(x)\\, dx`}
          question="Where is the centre of mass of the distribution?"
        />
        <p>The <em>variance</em> is</p>
        <FormulaBlock
          formula={`\\text{Var}(X) \\;=\\; E\\big[(X-E[X])^2\\big] \\;=\\; E[X^2] - (E[X])^2`}
          question="How spread out is the mass around its centre?"
        />
        <p>Useful linearity facts that you must internalise:</p>
        <MD>{`E[aX + bY + c] = aE[X] + bE[Y] + c \\quad \\text{(always)},`}</MD>
        <MD>{`\\text{Var}(aX + b) = a^2 \\text{Var}(X), \\qquad \\text{Var}(X+Y) = \\text{Var}(X) + \\text{Var}(Y) + 2\\,\\text{Cov}(X,Y).`}</MD>
      </>
    ),

    graduate: (
      <>
        <p>
          <strong>Measure-theoretic definition.</strong> Properly,{" "}
          <M>{`E[X]=\\int_\\Omega X\\,dP`}</M>, a Lebesgue integral with
          respect to the underlying measure. The integral exists in the
          extended sense iff{" "}
          <M>{`E[X^+]<\\infty`}</M> or <M>{`E[X^-]<\\infty`}</M>, and{" "}
          <M>{`X`}</M> is &quot;integrable&quot; iff{" "}
          <M>{`E[|X|]<\\infty`}</M>. This unifies the discrete and continuous
          formulas under a single object.
        </p>
        <p>
          <strong>Why squared loss is special: a one-line theorem.</strong>{" "}
          The minimiser of <M>{`g(c)=E[(X-c)^2]`}</M> over{" "}
          <M>{`c\\in\\mathbb{R}`}</M> is{" "}
          <M>{`c^*=E[X]`}</M>. (Differentiate, set to zero.) More generally,
          conditional expectation <M>{`E[X\\mid \\mathcal{G}]`}</M> is the{" "}
          <em>orthogonal projection</em> of <M>{`X`}</M> onto the subspace of{" "}
          <M>{`\\mathcal{G}`}</M>-measurable square-integrable functions. That
          is the deep reason why best linear predictors and conditional
          expectations look so similar.
        </p>
        <p>
          <strong>Moments and moment generating functions.</strong> The{" "}
          <M>{`k`}</M>-th moment is <M>{`m_k=E[X^k]`}</M>. The MGF{" "}
          <M>{`M_X(t)=E[e^{tX}]`}</M> packages all moments into a single
          analytic function: <M>{`m_k=M_X^{(k)}(0)`}</M>. When the MGF exists
          in a neighbourhood of 0, it determines the distribution uniquely.
          Many CLT-style proofs go via MGFs because convergence of MGFs
          implies convergence in distribution under mild conditions.
        </p>
        <p>
          <strong>A common misuse.</strong> &quot;The expectation of a ratio is the
          ratio of expectations.&quot; <em>Wrong.</em> In general{" "}
          <M>{`E[X/Y]\\ne E[X]/E[Y]`}</M>. This trips up A/B-test analysts,
          ratio estimators, and anyone who computes &quot;average of percentages&quot;.
          Use the delta method or simulation to get the right answer.
        </p>
      </>
    ),

    body: (
      <>
        <SectionHeader step={1} title="Build a distribution by hand" blurb="Drag the weights. Feel how E[X] follows the bulk of the mass and how Var(X) explodes when the tails get heavy." />
        <ExpectationVarianceLab />

        <SectionHeader step={2} title="Derivation: variance shortcut" blurb="The identity Var(X) = E[X²] − (E[X])² is the most-used algebraic move in probability." />
        <ProofStepper
          title="Var(X) = E[X²] − (E[X])²"
          steps={[
            { title: "Start from the definition.", math: "\\text{Var}(X) = E[(X-E[X])^2]" },
            { title: "Expand the square inside the expectation.", math: "= E[X^2 - 2X\\,E[X] + (E[X])^2]" },
            { title: "Apply linearity of expectation.", math: "= E[X^2] - 2E[X]\\cdot E[X] + (E[X])^2", reason: "E[X] is a constant, so E[2X·E[X]] = 2E[X]·E[X]." },
            { title: "Simplify.", math: "= E[X^2] - (E[X])^2" },
          ]}
        />

        <TheoremCard
          kind="theorem"
          name="Linearity of expectation"
          statement={
            <>For any random variables <M>{`X, Y`}</M> with finite means and constants <M>{`a, b\\in\\mathbb{R}`}</M>:</>
          }
          formula={`E[aX + bY] = aE[X] + bE[Y].`}
        >
          Linearity holds <em>even when X and Y are dependent</em>. This is
          why &quot;total expected revenue across products&quot; can be split
          into a sum of per-product expectations no matter how correlated
          their sales are.
        </TheoremCard>

        <SectionHeader step={3} title="Worked example: variance of a sum of indicators" />
        <p className="text-ink-dim leading-relaxed">
          Roll <M>{`n`}</M> fair dice. Let <M>{`X`}</M> be the number of sixes.
          Write <M>{`X = \\sum_i \\mathbb{1}\\{D_i = 6\\}`}</M>. Then{" "}
          <M>{`E[X] = n/6`}</M> by linearity. For the variance, since the dice
          are independent,{" "}
          <M>{`\\text{Var}(X) = \\sum_i \\text{Var}(\\mathbb{1}_i) = n \\cdot (1/6)(5/6) = 5n/36`}</M>.
          The same trick (decompose into indicators, sum) is the engine
          behind almost every elementary expectation calculation.
        </p>
      </>
    ),

    misconceptions: [
      {
        wrong: "If two random variables have the same mean, they have the same distribution.",
        right:
          "Wildly different distributions can share a mean. The mean is one number; a distribution is an entire shape.",
        why: "Always pair the mean with at least the variance — and ideally a histogram — before reasoning about a distribution.",
      },
      {
        wrong: "E[g(X)] = g(E[X]).",
        right:
          "This is Jensen's gap. For convex g, E[g(X)] ≥ g(E[X]); for concave g, the inequality flips. Equality only holds for affine g or degenerate X.",
        why: "Ignoring this is why naive 'plug in the mean' calculations underestimate volatility, option prices, and entropy.",
      },
      {
        wrong: "Variance is always finite.",
        right:
          "Cauchy and many heavy-tailed distributions have undefined variance (and even undefined mean). The CLT and standard error formulas silently assume finite variance — when that fails, classical statistics breaks.",
      },
    ],

    takeaways: [
      "A random variable is a function from outcomes to numbers; its distribution is a pile of probability mass.",
      "E[X] is the centre of mass; Var(X) measures the average squared distance from it.",
      "Linearity of expectation always holds, independence or not. Use it relentlessly via indicator decomposition.",
      "The variance shortcut Var(X) = E[X²] − (E[X])² is the algebraic workhorse.",
      "Independence makes variances add; covariance is the correction term when it does not.",
    ],

    quiz: [
      {
        id: "q1",
        prompt: "Let X be the number of heads in 10 fair coin flips. What is Var(X)?",
        choices: [
          { id: "a", label: "5" },
          { id: "b", label: "2.5" },
          { id: "c", label: "10" },
          { id: "d", label: "0.25" },
        ],
        answer: "b",
        explanation: "X ~ Binomial(10, 0.5), so Var(X) = np(1-p) = 10·0.5·0.5 = 2.5.",
      },
      {
        id: "q2",
        prompt: "Which of these is always true for any X, Y?",
        choices: [
          { id: "a", label: "E[XY] = E[X]E[Y]" },
          { id: "b", label: "Var(X+Y) = Var(X) + Var(Y)" },
          { id: "c", label: "E[X+Y] = E[X] + E[Y]" },
          { id: "d", label: "E[1/X] = 1/E[X]" },
        ],
        answer: "c",
        explanation:
          "Linearity of expectation always holds. The other three require independence, identical distributions, or Jensen's inequality.",
      },
      {
        id: "q3",
        prompt:
          "If Var(X) = 4 and Y = 3X − 5, what is Var(Y)?",
        choices: [
          { id: "a", label: "12" },
          { id: "b", label: "31" },
          { id: "c", label: "36" },
          { id: "d", label: "9" },
        ],
        answer: "c",
        explanation: "Var(aX + b) = a² Var(X), so Var(Y) = 9·4 = 36.",
      },
    ],

    furtherReading: [
      { title: "Ross — A First Course in Probability, ch. 4–5" },
      { title: "Wasserman — All of Statistics, ch. 2–3" },
    ],
  },
};

export default chapter;
