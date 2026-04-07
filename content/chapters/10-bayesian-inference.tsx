import { Chapter } from "../types";
import { M, MD } from "@/components/math/Math";
import { FormulaBlock } from "@/components/math/FormulaBlock";
import { TheoremCard } from "@/components/math/TheoremCard";
import { ProofStepper } from "@/components/math/ProofStepper";
import { BayesUpdater } from "@/components/interactive/BayesUpdater";
import { SectionHeader } from "@/components/learning/SectionHeader";

const chapter: Chapter = {
  meta: {
    slug: "bayesian-inference",
    module: "H_advanced",
    number: 10,
    title: "Bayesian Inference",
    subtitle:
      "Treat parameters as random and let probability do all the bookkeeping. The most coherent — and most computationally demanding — approach to inference.",
    hook: "Bayesian thinking is just one equation applied relentlessly: posterior ∝ likelihood × prior.",
    minutes: 50,
    level: 5,
    prereqs: ["maximum-likelihood-estimation", "confidence-intervals"],
    tags: ["bayesian", "posterior", "prior", "MAP"],
  },
  content: {
    whyItMatters: (
      <>
        Frequentist statistics treats parameters as fixed unknowns and data
        as random. Bayesian statistics flips this: it treats parameters
        themselves as random variables with a distribution describing your
        beliefs, and updates those beliefs as data arrive. This shift gives
        you (i) probability statements about parameters, (ii) a principled
        way to combine prior knowledge with data, (iii) automatic handling
        of nuisance parameters via marginalisation, and (iv) the foundation
        for almost everything in modern probabilistic ML, from variational
        autoencoders to Bayesian neural networks.
      </>
    ),

    intuition: (
      <>
        <p>
          Imagine you&apos;re trying to estimate the bias of a coin{" "}
          <M>θ ∈ [0,1]</M>. Before seeing any flips, you have some belief
          about <M>θ</M> — maybe you think it&apos;s probably fair, or maybe
          you have no idea. That belief is the <em>prior</em>{" "}
          <M>{`p(\\theta)`}</M>.
        </p>
        <p>
          Now you flip the coin a few times and see <M>k</M> heads in{" "}
          <M>n</M> tries. The <em>likelihood</em>{" "}
          <M>{`p(\\text{data}\\mid\\theta)`}</M> tells you how plausible
          each value of <M>θ</M> is given what you saw. Bayes&apos; theorem
          combines them:
        </p>
        <FormulaBlock
          formula={`\\underbrace{p(\\theta\\mid\\text{data})}_{\\text{posterior}} \\;\\propto\\; \\underbrace{p(\\text{data}\\mid\\theta)}_{\\text{likelihood}} \\cdot \\underbrace{p(\\theta)}_{\\text{prior}}`}
          question="How should I update my belief about θ after seeing the data?"
        />
        <p>
          The posterior is your <em>updated</em> belief — a complete
          probability distribution over the parameter, not a single number.
          Want a point estimate? Take its mean (Bayes estimator under squared
          loss) or its mode (MAP). Want an interval? Take the central 95%
          (a <em>credible</em> interval). Want a prediction for a new data
          point? Marginalise the posterior over <M>θ</M>.
        </p>
        <p>
          Everything in Bayesian statistics is a variation on this single
          theme.
        </p>
      </>
    ),

    formal: (
      <>
        <p>
          A Bayesian model specifies two things: a prior <M>{`p(\\theta)`}</M>{" "}
          and a likelihood <M>{`p(x\\mid\\theta)`}</M>. The posterior is
        </p>
        <FormulaBlock
          formula={`p(\\theta\\mid x) \\;=\\; \\frac{p(x\\mid\\theta)\\,p(\\theta)}{p(x)}, \\quad p(x) = \\int p(x\\mid\\theta)\\,p(\\theta)\\,d\\theta.`}
        />
        <p>
          The denominator <M>{`p(x)`}</M> is the <em>marginal likelihood</em>{" "}
          (a.k.a. <em>evidence</em>). It is constant in <M>θ</M>, which is
          why we usually write the posterior as a proportionality and worry
          about normalisation only at the end.
        </p>
        <p>
          From the posterior, three derived quantities are most important:
        </p>
        <ul className="list-disc pl-6 space-y-1.5 mt-2">
          <li>
            <strong>Posterior mean</strong> (Bayes estimator under squared error):{" "}
            <M>{`\\hat\\theta_{\\text{Bayes}} = E[\\theta\\mid x]`}</M>.
          </li>
          <li>
            <strong>MAP estimate</strong> (mode of the posterior):{" "}
            <M>{`\\hat\\theta_{\\text{MAP}} = \\arg\\max_\\theta p(\\theta\\mid x)`}</M>.
          </li>
          <li>
            <strong>Credible interval</strong>: an interval{" "}
            <M>[L, U]</M> with <M>{`P(\\theta\\in[L,U]\\mid x)=1-\\alpha`}</M>.
          </li>
        </ul>

        <p>
          The simplest non-trivial example: <em>Beta–Bernoulli conjugacy</em>.
          If <M>{`\\theta \\sim \\text{Beta}(\\alpha_0, \\beta_0)`}</M> and{" "}
          <M>{`x_i \\stackrel{iid}{\\sim} \\text{Bernoulli}(\\theta)`}</M>{" "}
          with <M>k</M> successes in <M>n</M> trials, then
        </p>
        <FormulaBlock formula={`\\theta \\mid x \\;\\sim\\; \\text{Beta}(\\alpha_0 + k,\\ \\beta_0 + n - k).`} />
        <p>The posterior stays in the same family — that&apos;s what conjugacy buys you. No integral to compute, just two parameters to update.</p>
      </>
    ),

    graduate: (
      <>
        <p>
          <strong>MAP vs MLE.</strong> Notice that{" "}
          <M>{`\\arg\\max_\\theta p(x\\mid\\theta)p(\\theta) = \\arg\\max_\\theta [\\log p(x\\mid\\theta) + \\log p(\\theta)]`}</M>.
          The MAP estimate is just penalised maximum likelihood — the prior
          plays the role of a regulariser. A Gaussian prior on a regression
          coefficient is exactly L2 (ridge); a Laplace prior is exactly L1
          (lasso). This is why &quot;ridge = Bayesian linear regression with
          Gaussian prior&quot; is not a metaphor — it&apos;s a literal
          identity.
        </p>
        <p>
          <strong>Conjugate priors and exponential families.</strong> A
          prior–likelihood pair is <em>conjugate</em> when the posterior
          stays in the same family as the prior. Conjugacy is not magical:
          it falls out of the algebraic structure of exponential families.
          For every exponential-family likelihood, there is a corresponding
          conjugate prior (Beta for Bernoulli, Gamma for Poisson, Normal for
          Normal mean with known variance, Inverse-Gamma for variance, …),
          and they all update by simple parameter arithmetic.
        </p>
        <p>
          <strong>Posterior consistency and Bernstein–von Mises.</strong>{" "}
          Under regularity conditions, as <M>{`n\\to\\infty`}</M> the
          posterior concentrates around the true parameter and is
          asymptotically Normal:
        </p>
        <FormulaBlock
          formula={`p(\\theta\\mid x_{1:n}) \\;\\approx\\; \\mathcal{N}\\!\\left(\\hat\\theta_{\\text{MLE}},\\ \\frac{1}{n}I(\\theta_0)^{-1}\\right).`}
          question="What does a Bayesian posterior look like with lots of data?"
        />
        <p>
          So in the large-sample limit, Bayesian credible intervals and
          frequentist confidence intervals from the MLE numerically agree —
          even though they answer different questions.
        </p>
        <p>
          <strong>The marginal likelihood is hard.</strong> In all but a
          handful of conjugate cases, computing{" "}
          <M>{`p(x) = \\int p(x\\mid\\theta)p(\\theta)d\\theta`}</M> is
          intractable. This is why modern Bayesian practice is dominated by
          two families of approximate algorithms:
        </p>
        <ul className="list-disc pl-6 space-y-1.5 mt-2">
          <li>
            <strong>Markov Chain Monte Carlo (MCMC)</strong> — construct a
            Markov chain whose stationary distribution is the posterior, then
            sample from it (Metropolis–Hastings, Gibbs, Hamiltonian Monte
            Carlo, NUTS).
          </li>
          <li>
            <strong>Variational inference</strong> — approximate the
            posterior with the closest member of a tractable family
            (mean-field, normalising flows). Faster than MCMC, biased but
            scalable. The basis of VAEs, BERT-style probabilistic NLP, and
            modern Bayesian deep learning.
          </li>
        </ul>
        <p>
          <strong>What can go wrong.</strong> (i) <em>Prior misspecification</em>:
          a wrong-but-confident prior can dominate the data for small n.
          (ii) <em>Improper priors</em>: useful but require care — they may
          yield a proper posterior, or they may not. (iii){" "}
          <em>Marginal likelihood for model comparison</em> is exquisitely
          sensitive to priors, much more so than the posterior itself —
          Lindley&apos;s paradox is the cautionary tale.
        </p>
      </>
    ),

    body: (
      <>
        <SectionHeader step={1} title="Watch a posterior update" blurb="Pick a prior, then click 'heads' or 'tails'. See the posterior reshape and concentrate as evidence accumulates." />
        <BayesUpdater />

        <SectionHeader step={2} title="Derivation: Beta–Bernoulli conjugacy" />
        <ProofStepper
          title="Posterior of Beta(α, β) after k heads in n flips"
          steps={[
            { title: "Write the prior.", math: "p(\\theta) \\propto \\theta^{\\alpha_0 - 1}(1-\\theta)^{\\beta_0 - 1}", reason: "Beta(α₀, β₀), ignoring the normalising constant B(α₀, β₀)." },
            { title: "Write the likelihood.", math: "p(x\\mid\\theta) = \\theta^k (1-\\theta)^{n-k}", reason: "k successes and n − k failures, conditionally independent." },
            { title: "Multiply (Bayes' rule, up to constant in θ).", math: "p(\\theta\\mid x) \\propto \\theta^{\\alpha_0 + k - 1}(1-\\theta)^{\\beta_0 + n - k - 1}" },
            { title: "Recognise the kernel.", reason: "This has the exact form of a Beta density. The normalising constant must therefore be 1/B(α₀+k, β₀+n−k)." },
            { title: "Conclude.", math: "\\theta \\mid x \\sim \\text{Beta}(\\alpha_0 + k,\\ \\beta_0 + n - k)", reason: "No integral computed. The Beta family is closed under Bernoulli updates — conjugacy in action." },
          ]}
        />

        <TheoremCard
          kind="theorem"
          name="Bernstein–von Mises"
          statement={
            <>
              Under regularity conditions, the posterior{" "}
              <M>{`p(\\theta\\mid x_{1:n})`}</M> converges in total variation
              to a Normal distribution centred at the MLE with covariance{" "}
              <M>{`(nI(\\theta_0))^{-1}`}</M>, and frequentist credible
              intervals from this approximation have asymptotic frequentist
              coverage equal to their nominal level.
            </>
          }
        >
          The deep practical consequence: <em>given enough data</em>,
          Bayesian and frequentist analyses produce numerically similar
          intervals, and the prior&apos;s influence vanishes. With small{" "}
          <em>n</em>, the prior matters — and that is exactly when Bayesian
          methods are most useful.
        </TheoremCard>

        <SectionHeader step={3} title="Worked example: Bayesian estimation of a click-through rate" />
        <p className="text-ink-dim leading-relaxed">
          You launch a new banner ad. From historical experience with
          similar banners, you put a Beta(2, 18) prior on the click-through
          rate <M>θ</M> — your prior expectation is{" "}
          <M>{`E[\\theta] = 2/(2+18) = 0.10`}</M>. After 100 impressions you
          observe 8 clicks. The posterior is
        </p>
        <FormulaBlock
          formula={`\\theta \\mid \\text{data} \\sim \\text{Beta}(2 + 8,\\ 18 + 92) = \\text{Beta}(10, 110).`}
        />
        <p className="text-ink-dim leading-relaxed">
          The posterior mean is{" "}
          <M>{`10/120 \\approx 0.083`}</M>, slightly below the maximum
          likelihood estimate <M>{`8/100 = 0.08`}</M> — pulled toward the
          prior mean. A 95% credible interval can be computed as the central
          95% mass of Beta(10, 110), giving roughly <M>{`[0.045, 0.135]`}</M>.
        </p>
        <p className="text-ink-dim leading-relaxed">
          With only 100 impressions, the prior is doing real work — and
          that&apos;s the point of using one. With 100,000 impressions, the
          prior would barely matter and the posterior would concentrate
          tightly around the empirical click rate, just as Bernstein–von
          Mises promised.
        </p>
      </>
    ),

    misconceptions: [
      {
        wrong: "Choosing a prior makes Bayesian analysis subjective and therefore unscientific.",
        right:
          "All inference makes assumptions; Bayesians just write theirs down explicitly. Sensitivity analysis (try several priors and check whether conclusions change) is the principled response to subjectivity.",
      },
      {
        wrong: "MAP and MLE are basically the same thing.",
        right:
          "MAP = MLE only when the prior is uniform (and even then, only on parameter spaces where 'uniform' is invariant under reparameterisation). With non-trivial priors, MAP is regularised MLE, and the regularisation can be huge.",
      },
      {
        wrong: "A Bayesian credible interval is the same thing as a confidence interval.",
        right:
          "They answer different questions. A 95% credible interval is 'P(θ ∈ [L,U] | data) = 0.95'; a 95% CI is 'across hypothetical replications, the random interval covers θ 95% of the time'. They numerically agree in the large-n limit but conceptually do not.",
      },
      {
        wrong: "The posterior tells you the probability that your hypothesis is true.",
        right:
          "It tells you the probability under your model and prior. If either is wrong, the posterior is wrong. 'All models are wrong, some are useful' applies doubly to Bayesian models.",
      },
    ],

    takeaways: [
      "Posterior ∝ likelihood × prior. Everything in Bayesian statistics flows from this one identity.",
      "Conjugate priors keep the posterior in the same family, eliminating integrals — Beta–Bernoulli is the canonical example.",
      "MAP estimation is penalised maximum likelihood; the prior is the regulariser. Ridge ≡ Gaussian prior, lasso ≡ Laplace prior.",
      "Bernstein–von Mises: with enough data, the posterior is approximately Normal centred at the MLE — Bayesian and frequentist agree asymptotically.",
      "The marginal likelihood p(x) is the hard part; modern practice uses MCMC or variational inference to handle it.",
      "Bayesian credible intervals and frequentist CIs answer different questions even when they coincide numerically.",
    ],

    quiz: [
      {
        id: "q1",
        prompt:
          "You start with a Beta(1, 1) prior (uniform on [0,1]) and observe 7 successes in 10 Bernoulli trials. The posterior is...",
        choices: [
          { id: "a", label: "Beta(7, 3)" },
          { id: "b", label: "Beta(8, 4)" },
          { id: "c", label: "Beta(7, 10)" },
          { id: "d", label: "Beta(1, 1)" },
        ],
        answer: "b",
        explanation: "Posterior = Beta(α₀ + k, β₀ + n − k) = Beta(1 + 7, 1 + 3) = Beta(8, 4).",
      },
      {
        id: "q2",
        prompt: "MAP estimation with a Gaussian prior on a regression coefficient is equivalent to which classical method?",
        choices: [
          { id: "a", label: "Ordinary least squares" },
          { id: "b", label: "Lasso (L1 penalty)" },
          { id: "c", label: "Ridge regression (L2 penalty)" },
          { id: "d", label: "Bootstrapping" },
        ],
        answer: "c",
        explanation:
          "log p(β) for a Gaussian prior is −β²/(2τ²) + const, giving an L2 penalty. So MAP = ridge.",
      },
      {
        id: "q3",
        prompt:
          "Which statement about Bernstein–von Mises is correct?",
        choices: [
          { id: "a", label: "It says the prior never matters." },
          { id: "b", label: "It says the posterior is asymptotically Normal centred at the MLE, with covariance (n·I(θ))⁻¹." },
          { id: "c", label: "It only applies when the prior is uniform." },
          { id: "d", label: "It is a finite-sample exact result." },
        ],
        answer: "b",
        explanation:
          "Under regularity conditions, the posterior concentrates and looks Normal around the MLE for large n. The prior matters for small n; in the limit, it washes out.",
      },
    ],

    furtherReading: [
      { title: "Gelman et al. — Bayesian Data Analysis (the 'BDA3' standard)" },
      { title: "McElreath — Statistical Rethinking" },
      { title: "Wasserman — All of Statistics, ch. 11 (frequentist take)" },
      { title: "Robert & Casella — Monte Carlo Statistical Methods" },
    ],
  },
};

export default chapter;
