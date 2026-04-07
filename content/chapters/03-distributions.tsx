import { Chapter } from "../types";
import { M } from "@/components/math/Math";
import { FormulaBlock } from "@/components/math/FormulaBlock";
import { TheoremCard } from "@/components/math/TheoremCard";
import { DistributionExplorer } from "@/components/interactive/DistributionExplorer";
import { SectionHeader } from "@/components/learning/SectionHeader";

const chapter: Chapter = {
  meta: {
    slug: "common-distributions",
    module: "B_random_variables",
    number: 3,
    title: "Common Probability Distributions",
    subtitle:
      "A small zoo of distributions explains an enormous fraction of real-world data. Knowing them by feel is half of being a statistician.",
    hook: "Each distribution is the answer to a story problem. Learn the stories and you'll never have to memorise the PMFs again.",
    minutes: 45,
    level: 3,
    prereqs: ["random-variables-expectation-variance"],
    tags: ["binomial", "poisson", "normal", "exponential"],
  },
  content: {
    whyItMatters: (
      <>
        Distributions are not arbitrary formulas — each one is the answer to a
        very specific kind of question. The Bernoulli answers &quot;yes/no&quot;.
        The Binomial answers &quot;how many yeses out of n&quot;. The Poisson
        answers &quot;how many rare events&quot;. The Exponential answers &quot;how
        long until the next event&quot;. The Normal answers &quot;what does an
        average look like&quot;. Once you can match a story to a distribution
        in your head, you have a vocabulary to model the world.
      </>
    ),

    intuition: (
      <>
        <p>
          A discrete distribution is a list of possible values, each with a
          probability. A continuous distribution is a density: a curve whose
          area between two points is the probability of falling there. Both
          are just &quot;piles of probability mass on the number line&quot;.
        </p>
        <p>
          The trick to internalising the standard families is to learn the{" "}
          <em>generative story</em>, not the formula. The formula is whatever
          falls out of counting:
        </p>
        <ul className="list-disc pl-6 space-y-1.5 mt-2">
          <li><strong>Bernoulli(p)</strong> — one yes/no trial.</li>
          <li><strong>Binomial(n, p)</strong> — sum of n independent Bernoullis.</li>
          <li><strong>Geometric(p)</strong> — number of trials until the first success.</li>
          <li><strong>Poisson(λ)</strong> — limit of Binomial when n → ∞ and p → 0 with np = λ.</li>
          <li><strong>Exponential(λ)</strong> — waiting time between Poisson events.</li>
          <li><strong>Normal(μ, σ²)</strong> — limiting shape of any sum of many small independent things.</li>
          <li><strong>Uniform(a, b)</strong> — &quot;all values equally likely in [a, b]&quot;.</li>
        </ul>
      </>
    ),

    formal: (
      <>
        <p>The PMFs/PDFs you should be able to recognise instantly:</p>
        <FormulaBlock
          formula={`\\text{Binomial}(n,p):\\quad p_X(k)=\\binom{n}{k}p^k(1-p)^{n-k},\\ \\ k=0,\\dots,n`}
        />
        <FormulaBlock
          formula={`\\text{Poisson}(\\lambda):\\quad p_X(k)=\\frac{e^{-\\lambda}\\lambda^k}{k!},\\ \\ k=0,1,2,\\dots`}
        />
        <FormulaBlock
          formula={`\\text{Exponential}(\\lambda):\\quad f_X(x)=\\lambda e^{-\\lambda x},\\ \\ x\\ge 0`}
        />
        <FormulaBlock
          formula={`\\text{Normal}(\\mu,\\sigma^2):\\quad f_X(x)=\\frac{1}{\\sqrt{2\\pi}\\,\\sigma}\\exp\\!\\left(-\\frac{(x-\\mu)^2}{2\\sigma^2}\\right)`}
        />
        <p>And the means and variances you should never have to look up:</p>
        <div className="my-3 overflow-x-auto rounded-xl border border-bg-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-bg-border bg-bg-soft text-ink-dim">
                <th className="text-left px-3 py-2">Family</th>
                <th className="text-left px-3 py-2">E[X]</th>
                <th className="text-left px-3 py-2">Var(X)</th>
                <th className="text-left px-3 py-2">Story</th>
              </tr>
            </thead>
            <tbody className="text-ink-dim">
              <tr className="border-b border-bg-border"><td className="px-3 py-2">Bernoulli(p)</td><td><M>p</M></td><td><M>{`p(1-p)`}</M></td><td>1 trial</td></tr>
              <tr className="border-b border-bg-border"><td className="px-3 py-2">Binomial(n,p)</td><td><M>np</M></td><td><M>{`np(1-p)`}</M></td><td>n trials, count successes</td></tr>
              <tr className="border-b border-bg-border"><td className="px-3 py-2">Geometric(p)</td><td><M>{`1/p`}</M></td><td><M>{`(1-p)/p^2`}</M></td><td>trials until first success</td></tr>
              <tr className="border-b border-bg-border"><td className="px-3 py-2">Poisson(λ)</td><td><M>λ</M></td><td><M>λ</M></td><td>rare events in fixed time</td></tr>
              <tr className="border-b border-bg-border"><td className="px-3 py-2">Exponential(λ)</td><td><M>{`1/\\lambda`}</M></td><td><M>{`1/\\lambda^2`}</M></td><td>time until next event</td></tr>
              <tr className="border-b border-bg-border"><td className="px-3 py-2">Uniform(a,b)</td><td><M>{`(a+b)/2`}</M></td><td><M>{`(b-a)^2/12`}</M></td><td>flat on [a,b]</td></tr>
              <tr><td className="px-3 py-2">Normal(μ,σ²)</td><td><M>μ</M></td><td><M>{`\\sigma^2`}</M></td><td>limit of sums</td></tr>
            </tbody>
          </table>
        </div>
      </>
    ),

    graduate: (
      <>
        <p>
          <strong>Exponential family.</strong> Most named distributions belong
          to a single algebraic structure. A density is in the{" "}
          <em>k-parameter exponential family</em> if it can be written as
        </p>
        <FormulaBlock
          formula={`f(x \\mid \\theta) = h(x)\\exp\\!\\left(\\sum_{j=1}^k \\eta_j(\\theta)T_j(x) - A(\\theta)\\right).`}
          question="Which distributions admit sufficient statistics that don't grow with the sample?"
        />
        <p>
          Belonging to an exponential family explains why the binomial sample
          mean is sufficient for <M>p</M>, why the Poisson sample sum is
          sufficient for <M>λ</M>, why MLEs in these families are unique and
          consistent under mild conditions, and why conjugate priors exist
          (Beta for Bernoulli, Gamma for Poisson…).
        </p>
        <p>
          <strong>Memorylessness.</strong> The exponential is the unique
          continuous distribution satisfying{" "}
          <M>{`P(X > s+t \\mid X > s) = P(X > t)`}</M>. The geometric is its
          discrete analogue. Memorylessness is why Poisson processes have
          independent inter-arrival times — and why an exponential model is
          dangerously optimistic for things like component lifetimes that
          actually <em>age</em>.
        </p>
        <p>
          <strong>Connections.</strong> Binomial → Poisson is the <em>law of
          rare events</em>. Sums of independent Exponential(λ)&apos;s give
          Gamma(n, λ). Squares of independent Normals give χ². The whole web
          is held together by transformations and limits, and you should
          re-derive each one at least once.
        </p>
      </>
    ),

    body: (
      <>
        <SectionHeader step={1} title="Visual catalogue" blurb="Switch between families, drag the parameters, and watch the shape morph." />
        <DistributionExplorer />

        <SectionHeader step={2} title="From Binomial to Poisson — the law of rare events" blurb="Why Poisson keeps showing up in disguise." />
        <TheoremCard
          kind="proposition"
          name="Binomial → Poisson"
          statement={
            <>
              If <M>{`n\\to\\infty`}</M> and <M>{`p\\to 0`}</M> with{" "}
              <M>{`np\\to\\lambda > 0`}</M>, then for every fixed{" "}
              <M>{`k`}</M>:
            </>
          }
          formula={`\\binom{n}{k}p^k(1-p)^{n-k} \\;\\longrightarrow\\; \\frac{e^{-\\lambda}\\lambda^k}{k!}.`}
        >
          Proof sketch: write{" "}
          <M>{`\\binom{n}{k}p^k(1-p)^{n-k}=\\frac{n(n-1)\\cdots(n-k+1)}{k!}\\left(\\frac{\\lambda}{n}\\right)^k\\left(1-\\frac{\\lambda}{n}\\right)^{n-k}`}</M>,
          then take <M>{`n\\to\\infty`}</M>: the polynomial in <M>n</M>{" "}
          divided by <M>{`n^k`}</M> tends to 1, and{" "}
          <M>{`(1-\\lambda/n)^n\\to e^{-\\lambda}`}</M>.
        </TheoremCard>

        <SectionHeader step={3} title="Worked example: connection between Exponential and Poisson" />
        <p className="text-ink-dim leading-relaxed">
          If events arrive in continuous time according to a Poisson process
          with rate <M>λ</M>, then (a) the number of events in any interval of
          length <M>t</M> is Poisson(<M>λt</M>), and (b) the gaps between
          consecutive events are i.i.d. Exponential(<M>λ</M>). The two
          descriptions are equivalent: each implies the other, and together
          they explain why &quot;count of arrivals&quot; (Poisson) and &quot;time
          until next arrival&quot; (Exponential) always come paired.
        </p>
      </>
    ),

    misconceptions: [
      {
        wrong: "If average daily emails = 50, then I always get about 50 emails.",
        right:
          "If emails arrive as a Poisson process with mean 50, the standard deviation is √50 ≈ 7.07. A day with 35 or 65 is normal. Don't read mean as a guarantee.",
      },
      {
        wrong: "The Normal distribution applies whenever you have a lot of data.",
        right:
          "The CLT promises Normal-shaped sampling distributions of averages, not Normal-shaped raw data. Income, file sizes, and waiting times stay heavy-tailed no matter how much you collect.",
      },
      {
        wrong: "Memoryless means 'the past doesn't matter at all'.",
        right:
          "It means only one specific thing: P(X > s+t | X > s) = P(X > t). It is a strong, special property — and almost no real lifetime distribution actually has it.",
      },
    ],

    takeaways: [
      "Each distribution is the answer to a story. Learn the story first, the formula second.",
      "Bernoulli → Binomial → Poisson and Exponential ↔ Poisson process are the two backbones of discrete and waiting-time modeling.",
      "Normal is the universal limit shape of averages, not a generic 'data shape'.",
      "Exponential family structure is the reason MLE, sufficient statistics, and conjugate priors all behave nicely.",
    ],

    quiz: [
      {
        id: "q1",
        prompt:
          "A call centre receives 4 calls per minute on average. The probability of receiving exactly 2 calls in the next minute is closest to...",
        choices: [
          { id: "a", label: "0.07" },
          { id: "b", label: "0.15" },
          { id: "c", label: "0.27" },
          { id: "d", label: "0.50" },
        ],
        answer: "b",
        explanation: "Poisson(4): P(K=2) = e^{-4} 4²/2! = e^{-4}·8 ≈ 0.146.",
      },
      {
        id: "q2",
        prompt:
          "Which property uniquely characterises the exponential distribution among continuous distributions on [0, ∞)?",
        choices: [
          { id: "a", label: "Symmetry" },
          { id: "b", label: "Memorylessness" },
          { id: "c", label: "Finite variance" },
          { id: "d", label: "Bell shape" },
        ],
        answer: "b",
        explanation:
          "Exponential is the unique continuous distribution on [0,∞) with P(X > s+t | X > s) = P(X > t).",
      },
      {
        id: "q3",
        prompt:
          "X ~ Binomial(100, 0.02). Roughly E[X] and Var(X) are...",
        choices: [
          { id: "a", label: "E=2, Var=2" },
          { id: "b", label: "E=2, Var=1.96" },
          { id: "c", label: "E=0.02, Var=0.02" },
          { id: "d", label: "E=100, Var=0.02" },
        ],
        answer: "b",
        explanation: "E[X] = np = 2, Var(X) = np(1-p) = 100·0.02·0.98 = 1.96. Note how close it is to the Poisson(2) variance — the law of rare events at work.",
      },
    ],

    furtherReading: [
      { title: "Ross — A First Course in Probability, ch. 4 & 5" },
      { title: "Bertsekas & Tsitsiklis — Introduction to Probability, ch. 2 & 3" },
    ],
  },
};

export default chapter;
