import { Chapter } from "../types";
import { M } from "@/components/math/Math";
import { FormulaBlock } from "@/components/math/FormulaBlock";
import { TheoremCard } from "@/components/math/TheoremCard";
import { ProofStepper } from "@/components/math/ProofStepper";
import { BayesUpdater } from "@/components/interactive/BayesUpdater";
import { SectionHeader } from "@/components/learning/SectionHeader";

const chapter: Chapter = {
  meta: {
    slug: "bayesian-inference",
    module: "H_advanced",
    number: 21,
    minutes: 50,
    level: 5,
    prereqs: ["maximum-likelihood-estimation", "confidence-intervals"],
    tags: ["bayesian", "posterior", "prior", "MAP"],
  },
  localized: {
    en: {
      title: "Bayesian Inference",
      subtitle:
        "Treat parameters as random and let probability do all the bookkeeping. The most coherent — and most computationally demanding — approach to inference.",
      hook: "Bayesian thinking is just one equation applied relentlessly: posterior ∝ likelihood × prior.",
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
            Want a point estimate? Take its mean (Bayes estimator under
            squared loss) or its mode (MAP). Want an interval? Take the
            central 95% (a <em>credible</em> interval). Want a prediction for
            a new data point? Marginalise the posterior over <M>θ</M>.
          </p>
          <p>Everything in Bayesian statistics is a variation on this single theme.</p>
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
          <p>From the posterior, three derived quantities are most important:</p>
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
            The posterior mean is <M>{`10/120 \\approx 0.083`}</M>, slightly
            below the maximum likelihood estimate <M>{`8/100 = 0.08`}</M> —
            pulled toward the prior mean. A 95% credible interval can be
            computed as the central 95% mass of Beta(10, 110), giving roughly{" "}
            <M>{`[0.045, 0.135]`}</M>.
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
          prompt: "Which statement about Bernstein–von Mises is correct?",
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
        {
          id: "q4",
          type: "numeric",
          prompt:
            "Beta(3, 5) prior + 2 successes in 4 Bernoulli trials. Compute the posterior mean. (Round to 3 decimals.)",
          answer: 0.417,
          tolerance: 0.005,
          hint: "Posterior = Beta(α + k, β + n − k); mean = α'/(α' + β').",
          explanation: "Posterior = Beta(3+2, 5+(4−2)) = Beta(5, 7); mean = 5/12 ≈ 0.417.",
        },
        {
          id: "q5",
          type: "ordering",
          prompt: "Re-order the steps of deriving the Beta–Bernoulli posterior.",
          steps: [
            { id: "s1", label: "Write the prior: p(θ) ∝ θ^{α₀−1}(1−θ)^{β₀−1}" },
            { id: "s2", label: "Write the likelihood: p(x|θ) = θ^k(1−θ)^{n−k}" },
            { id: "s3", label: "Multiply (Bayes, up to a θ-constant)" },
            { id: "s4", label: "Recognise the result as a Beta kernel" },
            { id: "s5", label: "Conclude: posterior = Beta(α₀ + k, β₀ + n − k)" },
          ],
          explanation: "Prior × likelihood → recognise the conjugate update → write the posterior parameters.",
        },
      ],
      furtherReading: [
        { title: "Gelman et al. — Bayesian Data Analysis (the 'BDA3' standard)" },
        { title: "McElreath — Statistical Rethinking" },
        { title: "Wasserman — All of Statistics, ch. 11 (frequentist take)" },
        { title: "Robert & Casella — Monte Carlo Statistical Methods" },
      ],
    },

    zh: {
      title: "貝氏推論",
      subtitle:
        "把參數本身當成隨機變數，讓機率包辦所有的記帳工作。最一致 ── 也最重計算 ── 的推論觀點。",
      hook: "貝氏思考其實只是「後驗 ∝ 概似 × 先驗」這個方程式的反覆套用。",
      whyItMatters: (
        <>
          頻率學派把參數當成「固定的未知數」、把資料當成「隨機的」。
          貝氏統計學翻轉了這個觀點：它把參數本身視為隨機變數，
          其分布描述你對它的信念，
          並隨著資料到來不斷更新這個信念。
          這個轉變給你 (i) 對參數的機率陳述、
          (ii) 把先驗知識和資料結合的有原則方法、
          (iii) 透過邊際化自動處理討厭參數、
          以及 (iv) 從變分自編碼器到貝氏神經網路，
          幾乎所有現代機率機器學習的基礎。
        </>
      ),
      intuition: (
        <>
          <p>
            想像你想估計一枚硬幣的偏差 <M>θ ∈ [0,1]</M>。
            在你看到任何拋擲之前，你對 <M>θ</M> 已經有某種信念 ──
            可能你覺得它應該大致公平，也可能你完全不知道。
            這個信念就是<em>先驗</em> <M>{`p(\\theta)`}</M>。
          </p>
          <p>
            現在你拋硬幣幾次，看到 <M>n</M> 次裡有 <M>k</M> 次正面。
            <em>概似函數</em> <M>{`p(\\text{data}\\mid\\theta)`}</M>{" "}
            告訴你：給定你看到的東西，每個 <M>θ</M> 值有多合理。
            貝氏定理把它們組合起來：
          </p>
          <FormulaBlock
            formula={`\\underbrace{p(\\theta\\mid\\text{data})}_{\\text{後驗}} \\;\\propto\\; \\underbrace{p(\\text{data}\\mid\\theta)}_{\\text{概似}} \\cdot \\underbrace{p(\\theta)}_{\\text{先驗}}`}
            question="看到資料後，我該如何更新對 θ 的信念？"
          />
          <p>
            後驗就是你<em>更新後的</em>信念 ── 一整個對參數的機率分布，
            而不是單一個數字。
            想要一個點估計？取它的平均（在平方損失下的貝氏估計量），
            或它的眾數（MAP）。
            想要一個區間？取中央 95%（一個<em>可信</em>區間）。
            想要對新資料點做預測？對 <M>θ</M> 做邊際化即可。
          </p>
          <p>整個貝氏統計學都只是這個主題的變奏。</p>
        </>
      ),
      formal: (
        <>
          <p>
            一個貝氏模型指定兩個東西：先驗 <M>{`p(\\theta)`}</M>{" "}
            與概似 <M>{`p(x\\mid\\theta)`}</M>。後驗為：
          </p>
          <FormulaBlock
            formula={`p(\\theta\\mid x) \\;=\\; \\frac{p(x\\mid\\theta)\\,p(\\theta)}{p(x)}, \\quad p(x) = \\int p(x\\mid\\theta)\\,p(\\theta)\\,d\\theta.`}
          />
          <p>
            分母 <M>{`p(x)`}</M> 是<em>邊際概似</em>（亦稱 <em>evidence</em>）。
            它對 <M>θ</M> 是常數，所以我們通常用比例式來寫後驗，
            最後才煩惱歸一化。
          </p>
          <p>從後驗導出的三個重要量：</p>
          <ul className="list-disc pl-6 space-y-1.5 mt-2">
            <li>
              <strong>後驗平均</strong>（平方誤差下的貝氏估計量）：{" "}
              <M>{`\\hat\\theta_{\\text{Bayes}} = E[\\theta\\mid x]`}</M>。
            </li>
            <li>
              <strong>MAP 估計</strong>（後驗的眾數）：{" "}
              <M>{`\\hat\\theta_{\\text{MAP}} = \\arg\\max_\\theta p(\\theta\\mid x)`}</M>。
            </li>
            <li>
              <strong>可信區間</strong>：一個區間 <M>[L, U]</M>，
              滿足 <M>{`P(\\theta\\in[L,U]\\mid x)=1-\\alpha`}</M>。
            </li>
          </ul>
          <p>
            最簡單的非平凡例子：<em>Beta–Bernoulli 共軛</em>。
            若 <M>{`\\theta \\sim \\text{Beta}(\\alpha_0, \\beta_0)`}</M>，
            <M>{`x_i \\stackrel{iid}{\\sim} \\text{Bernoulli}(\\theta)`}</M>，
            <M>n</M> 次中有 <M>k</M> 次成功，則
          </p>
          <FormulaBlock formula={`\\theta \\mid x \\;\\sim\\; \\text{Beta}(\\alpha_0 + k,\\ \\beta_0 + n - k).`} />
          <p>
            後驗仍在同一族 ── 這就是「共軛」帶來的便利。
            不用算積分，只需要更新兩個參數。
          </p>
        </>
      ),
      graduate: (
        <>
          <p>
            <strong>MAP vs MLE。</strong>
            注意到 <M>{`\\arg\\max_\\theta p(x\\mid\\theta)p(\\theta) = \\arg\\max_\\theta [\\log p(x\\mid\\theta) + \\log p(\\theta)]`}</M>。
            MAP 估計就是「加了懲罰項的最大概似」 ── 先驗扮演正則化的角色。
            對迴歸係數加常態先驗，剛好就是 L2（ridge）；
            加 Laplace 先驗，剛好就是 L1（lasso）。
            「ridge = 加了高斯先驗的貝氏線性迴歸」並不是比喻 ── 它是字面上的恆等。
          </p>
          <p>
            <strong>共軛先驗與指數族。</strong>
            一對先驗 – 概似為<em>共軛</em>，
            是指後驗仍與先驗在同一族。
            共軛並不神祕：它從指數族的代數結構直接掉出來。
            對於每個指數族概似，都存在對應的共軛先驗
            （Bernoulli 對應 Beta、Poisson 對應 Gamma、
            常態平均對應常態、變異數對應 Inverse-Gamma…），
            而它們全都透過簡單的參數算術更新。
          </p>
          <p>
            <strong>後驗一致性與 Bernstein–von Mises。</strong>
            在規則條件下，當 <M>{`n\\to\\infty`}</M>，
            後驗會集中在真實參數附近，且漸近上呈常態：
          </p>
          <FormulaBlock
            formula={`p(\\theta\\mid x_{1:n}) \\;\\approx\\; \\mathcal{N}\\!\\left(\\hat\\theta_{\\text{MLE}},\\ \\frac{1}{n}I(\\theta_0)^{-1}\\right).`}
            question="當資料量很大時，貝氏後驗長什麼樣子？"
          />
          <p>
            因此在大樣本極限下，貝氏可信區間與基於 MLE 的頻率學派信賴區間在數值上會一致 ──
            儘管它們在回答不同的問題。
          </p>
          <p>
            <strong>邊際概似很難算。</strong>
            除了少數幾個共軛特例，計算{" "}
            <M>{`p(x) = \\int p(x\\mid\\theta)p(\\theta)d\\theta`}</M>{" "}
            通常是棘手的。這就是為什麼現代貝氏實務由兩類近似演算法主導：
          </p>
          <ul className="list-disc pl-6 space-y-1.5 mt-2">
            <li>
              <strong>馬可夫鏈 Monte Carlo（MCMC）</strong> ──
              建構一條穩態分布為後驗的 Markov 鏈，然後從中取樣
              （Metropolis–Hastings、Gibbs、Hamiltonian Monte Carlo、NUTS）。
            </li>
            <li>
              <strong>變分推論（VI）</strong> ──
              在某個可計算的家族中，找出最接近後驗的成員
              （mean-field、normalising flows）。
              比 MCMC 快，有偏但可擴展。
              VAE、BERT 風格的機率 NLP、現代貝氏深度學習都建立在它之上。
            </li>
          </ul>
          <p>
            <strong>會出問題的地方。</strong>
            (i) <em>先驗誤指（prior misspecification）</em>：
            一個錯誤但過於自信的先驗，在 n 小時可以壓過資料。
            (ii) <em>不正常先驗（improper priors）</em>：
            有用，但需要小心 ── 它們可能產生正常後驗，也可能不行。
            (iii) <em>用邊際概似做模型比較</em>對先驗極為敏感，
            遠比後驗本身敏感 ── Lindley 悖論就是教科書級的警示。
          </p>
        </>
      ),
      body: (
        <>
          <SectionHeader step={1} title="親眼看後驗更新" blurb="挑一個先驗，然後按「正面」或「反面」。看後驗如何隨證據累積而重新塑形與集中。" />
          <BayesUpdater />

          <SectionHeader step={2} title="推導：Beta–Bernoulli 共軛" />
          <ProofStepper
            title="Beta(α, β) 在 n 次拋擲中觀察到 k 次正面後的後驗"
            steps={[
              { title: "寫出先驗。", math: "p(\\theta) \\propto \\theta^{\\alpha_0 - 1}(1-\\theta)^{\\beta_0 - 1}", reason: "Beta(α₀, β₀)，忽略歸一化常數 B(α₀, β₀)。" },
              { title: "寫出概似。", math: "p(x\\mid\\theta) = \\theta^k (1-\\theta)^{n-k}", reason: "k 次成功、n − k 次失敗，條件獨立。" },
              { title: "相乘（貝氏定理，差一個 θ 的常數）。", math: "p(\\theta\\mid x) \\propto \\theta^{\\alpha_0 + k - 1}(1-\\theta)^{\\beta_0 + n - k - 1}" },
              { title: "認出核心。", reason: "這正好是 Beta 密度的形式。所以歸一化常數必為 1/B(α₀+k, β₀+n−k)。" },
              { title: "下結論。", math: "\\theta \\mid x \\sim \\text{Beta}(\\alpha_0 + k,\\ \\beta_0 + n - k)", reason: "完全沒算過任何積分。Beta 族在 Bernoulli 更新下封閉 ── 共軛實際運作。" },
            ]}
          />

          <TheoremCard
            kind="theorem"
            name="Bernstein–von Mises"
            statement={
              <>
                在規則條件下，後驗 <M>{`p(\\theta\\mid x_{1:n})`}</M>{" "}
                以全變差收斂到一個以 MLE 為中心、協方差為{" "}
                <M>{`(nI(\\theta_0))^{-1}`}</M> 的常態分布；
                而從這個近似建構的「頻率學派覆蓋率」與「可信區間」
                的名目水準在漸近上一致。
              </>
            }
          >
            這個定理深刻的實務後果：<em>當資料夠多時</em>，
            貝氏分析與頻率學派分析會產生數值上相似的區間，
            而先驗的影響會消失。
            在 <em>n</em> 小時，先驗才會發揮作用 ──
            那也正是貝氏方法最有用的時候。
          </TheoremCard>

          <SectionHeader step={3} title="工作範例：用貝氏估計點擊率" />
          <p className="text-ink-dim leading-relaxed">
            你上線一個新的橫幅廣告。
            根據對類似廣告的歷史經驗，
            你給點擊率 <M>θ</M> 一個 Beta(2, 18) 的先驗 ──
            你的先驗期望值為 <M>{`E[\\theta] = 2/(2+18) = 0.10`}</M>。
            在 100 次曝光後你看到 8 次點擊，後驗為：
          </p>
          <FormulaBlock
            formula={`\\theta \\mid \\text{data} \\sim \\text{Beta}(2 + 8,\\ 18 + 92) = \\text{Beta}(10, 110).`}
          />
          <p className="text-ink-dim leading-relaxed">
            後驗平均為 <M>{`10/120 \\approx 0.083`}</M>，
            略低於最大概似估計 <M>{`8/100 = 0.08`}</M> ── 被先驗的平均稍微拉了一下。
            一個 95% 的可信區間可由 Beta(10, 110) 的中央 95% 質量算出，
            約為 <M>{`[0.045, 0.135]`}</M>。
          </p>
          <p className="text-ink-dim leading-relaxed">
            在只有 100 次曝光時，先驗確實在發揮作用 ── 這正是用先驗的目的。
            到了 100,000 次曝光時，先驗的影響幾乎可以忽略，
            後驗會緊緊集中在經驗點擊率附近，
            這正如 Bernstein–von Mises 所承諾的。
          </p>
        </>
      ),
      misconceptions: [
        {
          wrong: "選先驗讓貝氏分析變主觀，所以不科學。",
          right:
            "所有推論都會做假設；貝氏只是把它們明確寫下來。對於主觀性，有原則的回應是「敏感度分析」（試幾個先驗看結論會不會變）。",
        },
        {
          wrong: "MAP 與 MLE 基本上是同一回事。",
          right:
            "MAP = MLE 只在「先驗為均勻」時成立（即使這樣，也只在「均勻」對重新參數化不變的參數空間上才成立）。在非平凡先驗下，MAP 是「加了懲罰的 MLE」，而懲罰可能很強。",
        },
        {
          wrong: "貝氏可信區間就是頻率學派的信賴區間。",
          right:
            "它們在回答不同的問題。95% 可信區間是『P(θ ∈ [L,U] | data) = 0.95』；95% CI 是『跨假想重複實驗，隨機區間有 95% 的機率覆蓋 θ』。它們在大樣本下數值上一致，但概念上完全不同。",
        },
        {
          wrong: "後驗告訴你「假設為真」的機率。",
          right:
            "它告訴你「在你的模型與先驗下」的機率。如果其中一個錯，後驗就錯。「所有模型都是錯的，有些有用」對貝氏模型來說更為適用。",
        },
      ],
      takeaways: [
        "後驗 ∝ 概似 × 先驗。整個貝氏統計學都從這個恆等式流出。",
        "共軛先驗讓後驗留在同一族，省下積分 ── Beta–Bernoulli 是經典範例。",
        "MAP 估計是「加了懲罰的最大概似」；先驗扮演正則化。Ridge ≡ 高斯先驗，Lasso ≡ Laplace 先驗。",
        "Bernstein–von Mises：當資料夠多時，後驗近似為以 MLE 為中心的常態 ── 貝氏與頻率學派漸近一致。",
        "邊際概似 p(x) 是難的部分；現代實務用 MCMC 或變分推論處理。",
        "貝氏可信區間與頻率學派 CI 即使數值一致，回答的問題仍然不同。",
      ],
      quiz: [
        {
          id: "q1",
          prompt:
            "從 Beta(1, 1) 先驗（[0,1] 上的均勻）出發，觀察到 10 次 Bernoulli 試驗中有 7 次成功。後驗是？",
          choices: [
            { id: "a", label: "Beta(7, 3)" },
            { id: "b", label: "Beta(8, 4)" },
            { id: "c", label: "Beta(7, 10)" },
            { id: "d", label: "Beta(1, 1)" },
          ],
          answer: "b",
          explanation: "後驗 = Beta(α₀ + k, β₀ + n − k) = Beta(1 + 7, 1 + 3) = Beta(8, 4)。",
        },
        {
          id: "q2",
          prompt: "對迴歸係數加高斯先驗的 MAP 估計，等價於下列哪個古典方法？",
          choices: [
            { id: "a", label: "普通最小平方法" },
            { id: "b", label: "Lasso（L1 懲罰）" },
            { id: "c", label: "Ridge regression（L2 懲罰）" },
            { id: "d", label: "Bootstrap" },
          ],
          answer: "c",
          explanation:
            "高斯先驗的 log p(β) 是 −β²/(2τ²) + 常數，正好給出 L2 懲罰。所以 MAP = ridge。",
        },
        {
          id: "q3",
          prompt: "下列哪個關於 Bernstein–von Mises 的陳述是正確的？",
          choices: [
            { id: "a", label: "它說「先驗永遠不重要」。" },
            { id: "b", label: "它說後驗漸近上是以 MLE 為中心的常態，協方差為 (n·I(θ))⁻¹。" },
            { id: "c", label: "它只在先驗為均勻時成立。" },
            { id: "d", label: "它是有限樣本下的精確結果。" },
          ],
          answer: "b",
          explanation:
            "在規則條件下，當 n 大時，後驗會集中並在 MLE 附近呈常態形狀。先驗在小 n 時重要；在極限下，它會被洗掉。",
        },
        {
          id: "q4",
          type: "numeric",
          prompt:
            "Beta(3, 5) 先驗 + 4 次 Bernoulli 試驗中有 2 次成功。計算後驗平均。（取 3 位小數）",
          answer: 0.417,
          tolerance: 0.005,
          hint: "後驗 = Beta(α + k, β + n − k)；平均 = α'/(α' + β')。",
          explanation: "後驗 = Beta(3+2, 5+(4−2)) = Beta(5, 7)；平均 = 5/12 ≈ 0.417。",
        },
        {
          id: "q5",
          type: "ordering",
          prompt: "把 Beta–Bernoulli 後驗的推導重新排序。",
          steps: [
            { id: "s1", label: "寫出先驗：p(θ) ∝ θ^{α₀−1}(1−θ)^{β₀−1}" },
            { id: "s2", label: "寫出概似：p(x|θ) = θ^k(1−θ)^{n−k}" },
            { id: "s3", label: "相乘（貝氏，差一個 θ 的常數）" },
            { id: "s4", label: "辨認結果為一個 Beta kernel" },
            { id: "s5", label: "結論：後驗 = Beta(α₀ + k, β₀ + n − k)" },
          ],
          explanation: "先驗 × 概似 → 辨認共軛更新 → 寫出後驗參數。",
        },
      ],
      furtherReading: [
        { title: "Gelman et al. — Bayesian Data Analysis（『BDA3』經典）" },
        { title: "McElreath — Statistical Rethinking" },
        { title: "Wasserman — All of Statistics, ch. 11（頻率學派觀點）" },
        { title: "Robert & Casella — Monte Carlo Statistical Methods" },
      ],
    },
  },
};

export default chapter;
