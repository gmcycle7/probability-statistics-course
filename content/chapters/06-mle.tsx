import { Chapter } from "../types";
import { M } from "@/components/math/Math";
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
    minutes: 45,
    level: 4,
    prereqs: ["common-distributions", "central-limit-theorem"],
    tags: ["MLE", "estimation"],
  },
  localized: {
    en: {
      title: "Maximum Likelihood Estimation",
      subtitle:
        "Pick the parameter that makes your data the least surprising. Understand why this single principle dominates statistical practice.",
      hook: "MLE = the parameter that best 'explains' the data. Behind the simplicity hides a deep optimisation and asymptotic story.",
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
          <p>Two reframings make this feel natural:</p>
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
          <p>For i.i.d. data, the <em>likelihood function</em> is</p>
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
            <M>{`X_i \\sim \\text{Bernoulli}(p)`}</M>. Find the MLE of <M>p</M>.
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
            visualises: the log-likelihood as a function of <M>μ</M> is a
            downward parabola centred at <M>{`\\bar x`}</M>.
          </p>
          <MLEExplorer />

          <TheoremCard
            kind="theorem"
            name="Asymptotic normality of the MLE"
            statement={
              <>
                Under regularity conditions, if <M>{`\\hat\\theta_n`}</M> is
                the MLE based on n i.i.d. observations from{" "}
                <M>{`f(\\cdot;\\theta_0)`}</M>, then{" "}
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

    zh: {
      title: "最大概似估計",
      subtitle:
        "選那個讓你的資料「最不令人意外」的參數。理解為什麼這個單一原理主宰了現代統計實務。",
      hook: "MLE = 「最能解釋資料」的參數。簡單背後藏著深刻的最佳化與漸近故事。",
      whyItMatters: (
        <>
          最大概似估計是現代統計與機器學習的工作母機。
          Logistic 迴歸、樸素貝氏、GLM、隱藏 Markov 模型、
          神經網路的 softmax 分類器、以及大多數時間序列模型，
          其實都是換了名字的 MLE。
          理解它，等於擁有一個能套到幾乎任何參數模型上的單一心智工具。
        </>
      ),
      intuition: (
        <>
          <p>
            你有資料 <M>{`x_1, \\dots, x_n`}</M>，
            並相信它們來自某個由 <M>θ</M> 索引的分布族 <M>{`f(x;\\theta)`}</M>。
            最大概似估計就是讓資料<em>最不令人意外</em>的那個 <M>θ</M>：
            「在哪個參數下，觀察到這份資料的機率最大？」
          </p>
          <p>兩個重新詮釋會讓這件事感覺很自然：</p>
          <ol className="list-decimal pl-6 space-y-1.5 mt-2">
            <li>
              <strong>它是「對樣板比對」。</strong>
              如果你看到 9 次正面、1 次反面，你不會選 <M>{`p=0.5`}</M>，
              而會選 <M>{`p=0.9`}</M> ── 那個「最像資料」的版本。
            </li>
            <li>
              <strong>它是在「最小化驚訝」。</strong>
              負對數概似剛好就是「資料在你的模型下的香農資訊量（驚訝值）」。
              MLE 挑的是「總驚訝最低」的那個模型。
            </li>
          </ol>
        </>
      ),
      formal: (
        <>
          <p>對於 i.i.d. 資料，<em>概似函數</em>為：</p>
          <FormulaBlock
            formula={`L(\\theta) = \\prod_{i=1}^n f(x_i; \\theta)`}
            question="若真值為 θ，我這份資料出現的機率是多少？"
          />
          <p>
            MLE 是 <M>{`\\hat\\theta = \\arg\\max_\\theta L(\\theta)`}</M>。
            我們幾乎都用<em>對數概似</em>{" "}
            <M>{`\\ell(\\theta)=\\log L(\\theta)`}</M>，
            因為它把乘積變成了微積分喜歡的加法：
          </p>
          <FormulaBlock formula={`\\ell(\\theta) = \\sum_{i=1}^n \\log f(x_i; \\theta).`} />
          <p>
            當對數概似可微時，MLE 由解<em>分數方程（score equation）</em>找出：
          </p>
          <FormulaBlock formula={`\\frac{\\partial \\ell(\\theta)}{\\partial \\theta} = 0.`} />
          <p>
            再用二階導數測試（或檢查端點 / 定義域）確認它是極大值。
          </p>
        </>
      ),
      graduate: (
        <>
          <p>
            <strong>MLE 的漸近常態性。</strong>
            在規則條件下（可識別性、概似平滑、內部極大值、Fisher 訊息有限），
            MLE 滿足：
          </p>
          <FormulaBlock
            formula={`\\sqrt{n}(\\hat\\theta_n - \\theta_0) \\xrightarrow{d} \\mathcal{N}\\!\\left(0,\\,I(\\theta_0)^{-1}\\right),`}
            question="MLE 在 n 很大時的抽樣分布長什麼樣子？"
          />
          <p>
            其中{" "}
            <M>{`I(\\theta) = -E\\!\\left[\\partial^2 \\log f(X;\\theta)/\\partial\\theta^2\\right]`}</M>{" "}
            是 Fisher 訊息。
            這就是大樣本理論的基石：它告訴我們 MLE 是一致的（converges in probability to truth）、
            漸近常態，且漸近有效（變異數達到 Cramér–Rao 下界）。
          </p>
          <p>
            <strong>Cramér–Rao 下界。</strong>
            對任何不偏估計量 <M>{`\\hat\\theta`}</M>：
            <M>{`\\text{Var}(\\hat\\theta) \\ge 1/(n I(\\theta))`}</M>。
            MLE 在漸近上達成這個下界 ── 這就是它「有效」的意思。
          </p>
          <p>
            <strong>會出問題的地方。</strong>
            邊界參數（例如 <M>{`\\sigma\\to 0`}</M>）、不可識別的模型、
            模型誤指（misspecified family）、有限樣本下的偏誤。
            常態變異數的 MLE 是 <M>{`\\frac{1}{n}\\sum (x_i - \\bar x)^2`}</M> ──
            這是個有偏的估計量。著名的「不偏版本」要用 <M>{`n-1`}</M>。
            MLE 是一致的，但不一定不偏。
          </p>
          <p>
            <strong>與 KL 散度的連結。</strong>
            最大化對數概似等價於最小化「經驗分布到模型」的 KL 散度{" "}
            <M>{`D_{KL}(\\hat F_n \\,\\|\\, f(\\cdot;\\theta))`}</M>。
            這就是為什麼 MLE 是「資訊論上自然」的選擇，
            也是為什麼它能廣泛延伸到許多 ML 損失（cross-entropy、log-loss）。
          </p>
        </>
      ),
      body: (
        <>
          <SectionHeader step={1} title="工作範例：Bernoulli 的 MLE" blurb="最簡單的非平凡情形。把這個推導背下來 ── 你之後會做的每個 MLE 都遵循同樣的腳本。" />
          <p className="text-ink-dim leading-relaxed">
            你觀察到 <M>n</M> 次拋擲，其中 <M>k</M> 次正面。
            模型是 <M>{`X_i \\sim \\text{Bernoulli}(p)`}</M>。求 <M>p</M> 的 MLE。
          </p>
          <ProofStepper
            title="Bernoulli MLE"
            steps={[
              { title: "寫出概似。", math: "L(p) = \\prod_{i=1}^n p^{x_i}(1-p)^{1-x_i} = p^k (1-p)^{n-k}" },
              { title: "取對數得到對數概似。", math: "\\ell(p) = k \\log p + (n-k)\\log(1-p)" },
              { title: "微分後設為零。", math: "\\frac{d\\ell}{dp} = \\frac{k}{p} - \\frac{n-k}{1-p} = 0" },
              { title: "解。", math: "k(1-p) = (n-k)p \\Rightarrow k = np \\Rightarrow \\hat p = k/n" },
              { title: "確認是極大值。", reason: "二階導數為 -k/p² - (n-k)/(1-p)²，在 ℓ 定義域內恆為負。所以 p̂ = k/n 是 (0,1) 上唯一的全局極大。" },
              { title: "詮釋。", reason: "MLE 就是樣本比例。看似無聊？也許吧 ── 但同樣這台機器產出了你會遇到的每一個參數估計量。" },
            ]}
          />

          <SectionHeader step={2} title="工作範例：常態平均（已知 σ）" />
          <p className="text-ink-dim leading-relaxed">
            對於資料 <M>{`X_i \\sim \\mathcal{N}(\\mu, \\sigma^2)`}</M>（<M>{`\\sigma`}</M> 已知），
            <M>μ</M> 的 MLE 就是樣本平均{" "}
            <M>{`\\hat\\mu = \\bar x`}</M>。
            下方的探索器把這件事視覺化：
            對數概似作為 <M>μ</M> 的函數，是一條中心在 <M>{`\\bar x`}</M> 的開口向下拋物線。
          </p>
          <MLEExplorer />

          <TheoremCard
            kind="theorem"
            name="MLE 的漸近常態性"
            statement={
              <>
                在規則條件下，若 <M>{`\\hat\\theta_n`}</M> 是基於 n 個 i.i.d.
                觀察（來自 <M>{`f(\\cdot;\\theta_0)`}</M>）的 MLE，則
                <M>{`\\sqrt{n}(\\hat\\theta_n - \\theta_0) \\to \\mathcal{N}(0, I(\\theta_0)^{-1})`}</M>。
              </>
            }
          >
            直覺是這樣：平滑的對數概似在頂峰附近被一條開口向下的拋物線很好地逼近。
            樣本擾動會讓頂峰位置抖動，而局部二次形狀決定它能抖多遠。
            尖銳的頂峰（Fisher 訊息高）→ 小變異數。
          </TheoremCard>
        </>
      ),
      misconceptions: [
        {
          wrong: "MLE 永遠不偏。",
          right:
            "MLE 是一致的（在機率上收斂到真值）且漸近有效，但有限樣本下可以是有偏的。常態變異數的 MLE 就是經典反例。",
        },
        {
          wrong: "L(θ) 是 θ 的機率分布。",
          right:
            "不是。把它當作 θ 的函數，概似不會積分到 1。要對 θ 做機率陳述，你需要先驗 ── 那是貝氏的領域。",
        },
        {
          wrong: "如果兩個參數產生同樣的概似值，那模型沒問題。",
          right:
            "這是「可識別性」問題。混合模型、潛在變數模型、過參數化的神經網路常常擁有整條等概似的山脊。MLE 不再唯一，傳統漸近理論也會失效。",
        },
      ],
      takeaways: [
        "MLE 挑選讓觀察資料機率最大的那個參數。",
        "永遠用對數概似；乘積會變成加法，微積分馬上變一步。",
        "在規則條件下，MLE 是一致的，且漸近常態，協方差為 I(θ)⁻¹/n。",
        "最大化概似 = 從經驗分布到模型的 KL 散度最小化。",
        "MLE 不一定不偏，在邊界或不可識別時可能失敗。",
      ],
      quiz: [
        {
          id: "q1",
          prompt:
            "對於 i.i.d. 資料 x₁,…,x_n，Exponential(λ) 的 λ 之 MLE 是？",
          choices: [
            { id: "a", label: "λ̂ = x̄" },
            { id: "b", label: "λ̂ = 1/x̄" },
            { id: "c", label: "λ̂ = 1/n · Σ xᵢ" },
            { id: "d", label: "λ̂ = √(1/n · Σ xᵢ²)" },
          ],
          answer: "b",
          explanation:
            "log-lik = n log λ − λ Σx；微分得 n/λ − Σx = 0，所以 λ̂ = n/Σx = 1/x̄。",
        },
        {
          id: "q2",
          prompt: "下列哪一項是 MLE 在漸近上保證滿足的？",
          choices: [
            { id: "a", label: "不偏" },
            { id: "b", label: "在任何樣本數下變異數最小" },
            { id: "c", label: "一致且漸近常態" },
            { id: "d", label: "與貝氏後驗的眾數相同" },
          ],
          answer: "c",
          explanation:
            "在規則條件下，MLE 是一致的，且分布上收斂到變異數為 I(θ)⁻¹/n 的常態。在有限樣本下通常會有偏。",
        },
        {
          id: "q3",
          prompt: "最大化對數概似等價於最小化哪一個散度？",
          choices: [
            { id: "a", label: "L² 距離" },
            { id: "b", label: "全變差" },
            { id: "c", label: "從經驗分布到模型的 KL 散度" },
            { id: "d", label: "Hellinger 距離" },
          ],
          answer: "c",
          explanation:
            "在 θ 上差一個常數的意義下，ℓ(θ) = -n·D_KL(F̂_n ‖ f(·;θ))。最大化概似 ⇔ 最小化這個 KL 散度。",
        },
      ],
      furtherReading: [
        { title: "Casella & Berger — Statistical Inference, ch. 7" },
        { title: "Wasserman — All of Statistics, ch. 9" },
        { title: "van der Vaart — Asymptotic Statistics, ch. 5" },
      ],
    },
  },
};

export default chapter;
