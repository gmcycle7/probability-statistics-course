import { Chapter } from "../types";
import { M, MD } from "@/components/math/Math";
import { FormulaBlock } from "@/components/math/FormulaBlock";
import { TheoremCard } from "@/components/math/TheoremCard";
import { ProofStepper } from "@/components/math/ProofStepper";
import { MLEExplorer } from "@/components/interactive/MLEExplorer";
import { SectionHeader } from "@/components/learning/SectionHeader";

const chapter: Chapter = {
  meta: {
    slug: "maximum-likelihood-estimation",
    module: "E_estimation",
    number: 6,
    title: "Maximum Likelihood Estimation",
    subtitle:
      "Pick the parameter that makes your data the least surprising. Understand why this single principle dominates statistical practice.",
    hook: "MLE = the parameter that best 'explains' the data. Behind the simplicity hides a deep optimisation and asymptotic story.",
    minutes: 45,
    level: 4,
    prereqs: ["common-distributions", "central-limit-theorem"],
    tags: ["MLE", "estimation"],
  },
  content: {
    whyItMatters: (
      <>
        Maximum likelihood is the workhorse estimator of modern statistics
        and machine learning. Logistic regression, Naive Bayes, GLMs, hidden
        Markov models, neural-network softmax classifiers, and most fitted
        time-series models are all MLEs in disguise. Understanding it gives
        you a single mental tool for fitting almost any parametric model.
      </>
    ),

    intuition: (
      <>
        <p>
          You have data <M>{`x_1, \\dots, x_n`}</M>. You believe they came
          from some family of distributions <M>{`f(x;\\theta)`}</M> indexed
          by <M>θ</M>. The maximum-likelihood estimate is the value of <M>θ</M>{" "}
          that makes the data <em>least surprising</em>: the parameter under
          which the observed data are most probable.
        </p>
        <p>
          Two reframings make this feel natural:
        </p>
        <ol className="list-decimal pl-6 space-y-1.5 mt-2">
          <li>
            <strong>It&apos;s pattern matching.</strong> If you saw nine heads
            and one tail, you don&apos;t pick <M>{`p=0.5`}</M> — you pick{" "}
            <M>{`p=0.9`}</M>, the one that &quot;looks like&quot; the data.
          </li>
          <li>
            <strong>It&apos;s minimising surprise.</strong> The negative
            log-likelihood is exactly the &quot;surprise&quot; (Shannon
            information) of the data under your model. MLE picks the model
            with the lowest total surprise.
          </li>
        </ol>
      </>
    ),

    formal: (
      <>
        <p>
          For i.i.d. data, the <em>likelihood function</em> is
        </p>
        <FormulaBlock
          formula={`L(\\theta) = \\prod_{i=1}^n f(x_i; \\theta)`}
          question="If the truth were θ, how probable would my data be?"
        />
        <p>
          The MLE is <M>{`\\hat\\theta = \\arg\\max_\\theta L(\\theta)`}</M>.
          We almost always work with the <em>log-likelihood</em>{" "}
          <M>{`\\ell(\\theta)=\\log L(\\theta)`}</M> because it turns the
          product into a sum that calculus loves:
        </p>
        <FormulaBlock formula={`\\ell(\\theta) = \\sum_{i=1}^n \\log f(x_i; \\theta).`} />
        <p>
          The MLE is found (when the log-likelihood is differentiable) by
          solving the <em>score equation</em>:
        </p>
        <FormulaBlock formula={`\\frac{\\partial \\ell(\\theta)}{\\partial \\theta} = 0.`} />
        <p>
          The second-derivative test (or evaluation at endpoints, or domain
          arguments) confirms it&apos;s a maximum.
        </p>
      </>
    ),

    graduate: (
      <>
        <p>
          <strong>Asymptotic normality of the MLE.</strong> Under regularity
          conditions (identifiability, smooth likelihood, interior maximum,
          finite Fisher information), the MLE satisfies
        </p>
        <FormulaBlock
          formula={`\\sqrt{n}(\\hat\\theta_n - \\theta_0) \\xrightarrow{d} \\mathcal{N}\\!\\left(0,\\,I(\\theta_0)^{-1}\\right),`}
          question="What does the sampling distribution of an MLE look like for large n?"
        />
        <p>
          where <M>{`I(\\theta) = -E\\!\\left[\\partial^2 \\log f(X;\\theta)/\\partial\\theta^2\\right]`}</M>{" "}
          is the Fisher information. This is the foundation of large-sample
          theory: it tells us MLE is consistent, asymptotically normal, and
          asymptotically efficient (its variance attains the Cramér–Rao lower
          bound).
        </p>
        <p>
          <strong>Cramér–Rao lower bound.</strong> For any unbiased estimator{" "}
          <M>{`\\hat\\theta`}</M> of <M>θ</M>:{" "}
          <M>{`\\text{Var}(\\hat\\theta) \\ge 1/(n I(\\theta))`}</M>. The MLE
          asymptotically attains this bound — that&apos;s what makes it
          &quot;efficient&quot;.
        </p>
        <p>
          <strong>What can go wrong.</strong> Boundary parameters (e.g.{" "}
          <M>{`\\sigma\\to 0`}</M>), unidentified models, mis-specified
          families, finite-sample bias. The MLE for{" "}
          <M>{`\\sigma^2`}</M> in a Normal model is{" "}
          <M>{`\\frac{1}{n}\\sum (x_i - \\bar x)^2`}</M> — a biased estimator.
          The famous unbiased version uses <M>{`n-1`}</M>. MLE is consistent,
          but not always unbiased.
        </p>
        <p>
          <strong>Connection to KL divergence.</strong> Maximising the
          log-likelihood is equivalent to minimising the empirical KL
          divergence{" "}
          <M>{`D_{KL}(\\hat F_n \\,\\|\\, f(\\cdot;\\theta))`}</M> from the
          empirical distribution to the model. This is why MLE is the
          &quot;information-theoretically natural&quot; choice and why it
          generalises to so many ML losses (cross-entropy, log-loss).
        </p>
      </>
    ),

    body: (
      <>
        <SectionHeader step={1} title="Worked example: Bernoulli MLE" blurb="The simplest non-trivial case. Memorise this derivation — every MLE you'll ever do follows the same script." />
        <p className="text-ink-dim leading-relaxed">
          You observe <M>n</M> coin flips with <M>k</M> heads. The model is{" "}
          <M>{`X_i \\sim \\text{Bernoulli}(p)`}</M>. Find the MLE of{" "}
          <M>p</M>.
        </p>
        <ProofStepper
          title="Bernoulli MLE"
          steps={[
            { title: "Write the likelihood.", math: "L(p) = \\prod_{i=1}^n p^{x_i}(1-p)^{1-x_i} = p^k (1-p)^{n-k}" },
            { title: "Take logs to get the log-likelihood.", math: "\\ell(p) = k \\log p + (n-k)\\log(1-p)" },
            { title: "Differentiate and set to zero.", math: "\\frac{d\\ell}{dp} = \\frac{k}{p} - \\frac{n-k}{1-p} = 0" },
            { title: "Solve.", math: "k(1-p) = (n-k)p \\Rightarrow k = np \\Rightarrow \\hat p = k/n" },
            { title: "Check it's a maximum.", reason: "Second derivative is -k/p² - (n-k)/(1-p)², which is negative wherever ℓ is defined. So p̂ = k/n is the unique global maximum on (0,1)." },
            { title: "Interpret.", reason: "The MLE is the sample proportion. Boring? Maybe — but the same machine produces every parametric estimator you'll meet." },
          ]}
        />

        <SectionHeader step={2} title="Worked example: Normal mean (σ known)" />
        <p className="text-ink-dim leading-relaxed">
          For data <M>{`X_i \\sim \\mathcal{N}(\\mu, \\sigma^2)`}</M> with{" "}
          <M>{`\\sigma`}</M> known, the MLE for <M>μ</M> is the sample mean{" "}
          <M>{`\\hat\\mu = \\bar x`}</M>. This is what the explorer below
          visualises: the log-likelihood as a function of <M>μ</M> is a downward
          parabola centred at <M>{`\\bar x`}</M>.
        </p>
        <MLEExplorer />

        <TheoremCard
          kind="theorem"
          name="Asymptotic normality of the MLE"
          statement={
            <>
              Under regularity conditions, if <M>{`\\hat\\theta_n`}</M> is the
              MLE based on n i.i.d. observations from <M>{`f(\\cdot;\\theta_0)`}</M>,
              then{" "}
              <M>{`\\sqrt{n}(\\hat\\theta_n - \\theta_0) \\to \\mathcal{N}(0, I(\\theta_0)^{-1})`}</M>.
            </>
          }
        >
          The intuition: a smooth log-likelihood near its peak is well
          approximated by a downward parabola. Sample fluctuation jiggles
          where the peak sits, and the local quadratic shape determines how
          much it can move. Sharp peaks (high Fisher information) → small
          variance.
        </TheoremCard>
      </>
    ),

    misconceptions: [
      {
        wrong: "The MLE is always unbiased.",
        right:
          "It is consistent (converges in probability to the truth) and asymptotically efficient, but it can be biased in finite samples. The Normal-variance MLE is the canonical example.",
      },
      {
        wrong: "L(θ) is a probability distribution over θ.",
        right:
          "It is not. Treated as a function of θ, the likelihood does not integrate to 1. Probability statements about θ require a prior — that's Bayesian territory.",
      },
      {
        wrong: "If two parameters give the same likelihood, the model is fine.",
        right:
          "It's an identifiability problem. Mixture models, latent-variable models, and overparameterised neural nets routinely have entire ridges of equally good likelihoods. The MLE is then not unique, and standard asymptotics break down.",
      },
    ],

    takeaways: [
      "MLE picks the parameter that maximises the probability of the observed data.",
      "Always work with the log-likelihood; products become sums and calculus is one step.",
      "Under regularity, MLE is consistent and asymptotically Normal with covariance I(θ)^{-1}/n.",
      "Maximising likelihood = minimising KL divergence from the empirical distribution to the model.",
      "MLE is not always unbiased and can fail at boundaries or under unidentifiability.",
    ],

    quiz: [
      {
        id: "q1",
        prompt:
          "The MLE for the rate parameter λ of an Exponential(λ) distribution given i.i.d. data x₁,…,x_n is...",
        choices: [
          { id: "a", label: "λ̂ = x̄" },
          { id: "b", label: "λ̂ = 1/x̄" },
          { id: "c", label: "λ̂ = 1/n · Σ xᵢ" },
          { id: "d", label: "λ̂ = √(1/n · Σ xᵢ²)" },
        ],
        answer: "b",
        explanation:
          "log-lik = n log λ − λ Σx; differentiating gives n/λ − Σx = 0, so λ̂ = n/Σx = 1/x̄.",
      },
      {
        id: "q2",
        prompt: "Which of the following is the MLE asymptotically guaranteed to be?",
        choices: [
          { id: "a", label: "Unbiased" },
          { id: "b", label: "Minimum variance for any sample size" },
          { id: "c", label: "Consistent and asymptotically Normal" },
          { id: "d", label: "The same as the Bayesian posterior mode" },
        ],
        answer: "c",
        explanation:
          "Under regularity, MLE is consistent and converges in distribution to a Normal with variance I(θ)^{-1}/n. It is generally biased in finite samples.",
      },
      {
        id: "q3",
        prompt:
          "Maximising log-likelihood is equivalent to minimising which divergence?",
        choices: [
          { id: "a", label: "L² distance" },
          { id: "b", label: "Total variation" },
          { id: "c", label: "KL divergence from empirical to model" },
          { id: "d", label: "Hellinger distance" },
        ],
        answer: "c",
        explanation:
          "Up to a constant in θ, ℓ(θ) = -n·D_KL(F̂_n ‖ f(·;θ)). Maximising likelihood ⇔ minimising this KL divergence.",
      },
    ],

    furtherReading: [
      { title: "Casella & Berger — Statistical Inference, ch. 7" },
      { title: "Wasserman — All of Statistics, ch. 9" },
      { title: "van der Vaart — Asymptotic Statistics, ch. 5" },
    ],
  },
};

export default chapter;
