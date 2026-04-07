import { Chapter } from "../types";
import { M } from "@/components/math/Math";
import { FormulaBlock } from "@/components/math/FormulaBlock";
import { TheoremCard } from "@/components/math/TheoremCard";
import { ProofStepper } from "@/components/math/ProofStepper";
import { CLTSimulator } from "@/components/interactive/CLTSimulator";
import { SectionHeader } from "@/components/learning/SectionHeader";

const chapter: Chapter = {
  meta: {
    slug: "sampling-distributions",
    module: "D_inference",
    number: 8,
    minutes: 35,
    level: 4,
    prereqs: ["estimators-bias-variance-mse"],
    tags: ["sampling distribution", "t", "chi-square"],
  },
  localized: {
    en: {
      title: "Sampling Distributions",
      subtitle:
        "An estimator is itself a random variable. Its distribution — the sampling distribution — is the entire object behind every standard error, every CI, every test.",
      hook: "Why σ²/n is the most important formula in introductory statistics — and where the t and χ² distributions come from.",
      whyItMatters: (
        <>
          A sampling distribution is the bridge between &quot;a function of
          the data&quot; and &quot;a probability statement we can act on&quot;.
          Without it, you can compute <M>{`\\bar X`}</M> but you have nothing
          to say about how much it could have been off. With it, every CI,
          every test, every statistical guarantee falls out automatically.
        </>
      ),
      intuition: (
        <>
          <p>
            Imagine running your experiment many times. Each repetition gives
            a different dataset, and a different value of your estimator
            <M>{`\\hat\\theta`}</M>. The histogram of all those values is the{" "}
            <em>sampling distribution</em> of <M>{`\\hat\\theta`}</M>.
          </p>
          <p>
            This is the object that every confidence interval and hypothesis
            test reasons about. The estimator&apos;s mean is its centre, the
            estimator&apos;s standard deviation is the <em>standard error</em>{" "}
            (different from the data&apos;s standard deviation!), and its
            shape determines whether you can use a Normal approximation, a
            t distribution, or something else.
          </p>
          <p>
            The good news: for the sample mean, the CLT does most of the
            work. The shape is approximately Normal, the centre is the true
            mean, and the standard deviation is exactly{" "}
            <M>{`\\sigma/\\sqrt{n}`}</M>.
          </p>
        </>
      ),
      formal: (
        <>
          <p>
            The <em>sampling distribution</em> of an estimator{" "}
            <M>{`\\hat\\theta_n = T(X_1, \\dots, X_n)`}</M> is the
            distribution of <M>{`\\hat\\theta_n`}</M> as a random variable,
            induced by the random sample{" "}
            <M>{`X_1, \\dots, X_n \\sim F`}</M>. Three core facts about the
            sample mean and variance under <M>{`X_i \\sim \\mathcal{N}(\\mu, \\sigma^2)`}</M>:
          </p>
          <FormulaBlock formula={`\\bar X_n \\sim \\mathcal{N}\\!\\left(\\mu, \\frac{\\sigma^2}{n}\\right), \\qquad \\frac{(n-1)S^2}{\\sigma^2} \\sim \\chi^2_{n-1}`} />
          <p>
            and the celebrated independence{" "}
            <M>{`\\bar X_n \\perp S^2`}</M> (only under Normality!). Combining
            these gives the t-statistic
          </p>
          <FormulaBlock
            formula={`T = \\frac{\\bar X_n - \\mu}{S/\\sqrt n} \\sim t_{n-1}`}
            question="What's the distribution of the standardised mean when σ is unknown?"
          />
          <p>
            which is what makes the t-test possible without knowing the
            population variance.
          </p>
        </>
      ),
      graduate: (
        <>
          <p>
            <strong>The independence of <M>{`\\bar X`}</M> and <M>{`S^2`}</M> is a peculiarly Gaussian property.</strong>{" "}
            For any other distribution they are correlated. The clean proof
            uses Cochran&apos;s theorem and the fact that{" "}
            <M>{`\\bar X`}</M> projects onto the all-ones direction while{" "}
            <M>{`S^2`}</M> measures the residual in the orthogonal complement.
            In any non-Gaussian model, you cannot separate location and
            scale this cleanly — which is why t-tests are exact only under
            Normality and approximate everywhere else.
          </p>
          <p>
            <strong>χ² and Gamma.</strong> The <M>{`\\chi^2_k`}</M>{" "}
            distribution is{" "}
            <M>{`\\text{Gamma}(k/2, 2)`}</M>. It arises as the sum of squared
            standard Normals: if{" "}
            <M>{`Z_1, \\dots, Z_k \\sim \\mathcal{N}(0,1)`}</M> i.i.d., then{" "}
            <M>{`\\sum Z_i^2 \\sim \\chi^2_k`}</M>. The factor{" "}
            <M>{`(n-1)`}</M> in <M>{`(n-1)S^2/\\sigma^2 \\sim \\chi^2_{n-1}`}</M>{" "}
            is exactly the loss of one degree of freedom from estimating{" "}
            <M>{`\\bar X`}</M>.
          </p>
          <p>
            <strong>Bootstrap as nonparametric sampling distribution.</strong>{" "}
            When you can&apos;t derive the sampling distribution analytically
            and the CLT is too crude, the bootstrap uses resampling from the
            empirical distribution as a stand-in for the unknown true
            distribution. Under regularity, the bootstrap distribution of{" "}
            <M>{`\\hat\\theta_n^* - \\hat\\theta_n`}</M> consistently
            estimates the sampling distribution of{" "}
            <M>{`\\hat\\theta_n - \\theta`}</M>. This is one of the most
            useful 20-line algorithms in statistics.
          </p>
          <p>
            <strong>Common misuse.</strong> Confusing the standard deviation
            of the data with the standard error of the mean. The first is
            <M>{`\\sigma`}</M>; the second is <M>{`\\sigma/\\sqrt n`}</M>.
            They differ by a factor of <M>{`\\sqrt n`}</M>, which is the
            entire reason adding more data helps.
          </p>
        </>
      ),
      body: (
        <>
          <SectionHeader step={1} title="The CLT view of the sampling distribution" blurb="Every histogram on the right IS a sampling distribution. Watch n grow and the limiting Normal lock in." />
          <CLTSimulator />

          <SectionHeader step={2} title="Derivation: variance of the sample mean" />
          <ProofStepper
            title="Var(X̄) = σ²/n"
            steps={[
              { title: "Write the sample mean.", math: "\\bar X_n = \\frac{1}{n}\\sum_{i=1}^n X_i" },
              { title: "Apply variance to a constant times a sum.", math: "\\text{Var}(\\bar X_n) = \\frac{1}{n^2}\\text{Var}\\!\\left(\\sum_{i=1}^n X_i\\right)" },
              { title: "Use independence to add variances.", math: "= \\frac{1}{n^2}\\sum_{i=1}^n \\text{Var}(X_i) = \\frac{1}{n^2} \\cdot n\\sigma^2", reason: "Var(X+Y) = Var(X) + Var(Y) requires Cov(X,Y) = 0; independence is enough." },
              { title: "Simplify.", math: "= \\frac{\\sigma^2}{n}", reason: "The famous '1/n' rule. Standard error is σ/√n." },
            ]}
          />

          <TheoremCard
            kind="theorem"
            name="Joint distribution of X̄ and S² under Normality"
            statement={
              <>
                If <M>{`X_1, \\dots, X_n \\sim \\mathcal{N}(\\mu, \\sigma^2)`}</M>{" "}
                i.i.d., then
              </>
            }
            formula={`\\bar X_n \\sim \\mathcal{N}\\!\\left(\\mu, \\sigma^2/n\\right), \\quad \\frac{(n-1)S^2}{\\sigma^2} \\sim \\chi^2_{n-1}, \\quad \\bar X_n \\perp S^2.`}
          >
            The independence of <M>{`\\bar X`}</M> and <M>{`S^2`}</M> is what
            makes the t-statistic <M>{`(\\bar X - \\mu)/(S/\\sqrt n)`}</M>{" "}
            exactly t-distributed. This is the foundational result behind every
            small-sample t-test.
          </TheoremCard>

          <SectionHeader step={3} title="Worked example: deriving the t distribution" />
          <p className="text-ink-dim leading-relaxed">
            By the theorem above, <M>{`Z = (\\bar X - \\mu)/(\\sigma/\\sqrt n) \\sim \\mathcal{N}(0,1)`}</M>{" "}
            and <M>{`V = (n-1)S^2/\\sigma^2 \\sim \\chi^2_{n-1}`}</M>, with{" "}
            <M>{`Z \\perp V`}</M>. By the definition of a t-distribution as
            the ratio
          </p>
          <FormulaBlock formula={`T = \\frac{Z}{\\sqrt{V/(n-1)}} = \\frac{(\\bar X - \\mu)/(\\sigma/\\sqrt n)}{\\sqrt{S^2/\\sigma^2}} = \\frac{\\bar X - \\mu}{S/\\sqrt n} \\sim t_{n-1}`} />
          <p className="text-ink-dim leading-relaxed">
            σ cancels out — that&apos;s the magic. We can do inference about
            <M>{`\\mu`}</M> without knowing <M>{`\\sigma`}</M>.
          </p>
        </>
      ),
      misconceptions: [
        {
          wrong: "The sampling distribution is the distribution of the data.",
          right:
            "The sampling distribution is the distribution of the ESTIMATOR (a function of the data). The data have one distribution, σ; the sample mean has another, σ/√n.",
        },
        {
          wrong: "X̄ and S² are independent for any distribution.",
          right:
            "They are independent only under the Normal model. For any other distribution they are correlated, which is why exact small-sample tests typically only exist for Normal data.",
        },
        {
          wrong: "Standard deviation and standard error are interchangeable.",
          right:
            "Standard deviation describes the spread of the data; standard error describes the spread of the sampling distribution of an estimator. They differ by √n.",
        },
      ],
      takeaways: [
        "An estimator is a random variable; its sampling distribution is what every CI and test reasons about.",
        "Var(X̄) = σ²/n is exact under independence — the most important formula in intro stats.",
        "Under Normality, X̄ and S² are independent and (n−1)S²/σ² ~ χ²_{n-1}; together they yield the t-statistic.",
        "Standard error ≠ standard deviation. The former describes the estimator; the latter describes the data.",
        "The bootstrap is the all-purpose approximator when no closed-form sampling distribution exists.",
      ],
      quiz: [
        {
          id: "q1",
          prompt:
            "n = 100 i.i.d. observations from N(50, 16). What is the standard error of the sample mean?",
          choices: [
            { id: "a", label: "16" },
            { id: "b", label: "4" },
            { id: "c", label: "0.4" },
            { id: "d", label: "0.16" },
          ],
          answer: "c",
          explanation: "SE = σ/√n = 4/10 = 0.4. The standard deviation of the data is 4; the standard error of the mean is much smaller.",
        },
        {
          id: "q2",
          prompt: "Which is needed to derive the exact t-distribution?",
          choices: [
            { id: "a", label: "n must be large" },
            { id: "b", label: "Data must be Normal AND X̄ ⊥ S²" },
            { id: "c", label: "σ must be known" },
            { id: "d", label: "Bootstrap must be used" },
          ],
          answer: "b",
          explanation:
            "The exact t-distribution arises only under Normality, where X̄ and S² are independent. For other distributions, the t is approximate.",
        },
        {
          id: "q3",
          prompt:
            "If (n−1)S²/σ² ~ χ²_{n−1}, then E[S²] = ?",
          choices: [
            { id: "a", label: "σ²/(n−1)" },
            { id: "b", label: "σ²" },
            { id: "c", label: "σ²/n" },
            { id: "d", label: "(n−1)σ²" },
          ],
          answer: "b",
          explanation:
            "E[χ²_k] = k, so E[(n−1)S²/σ²] = n−1, which gives E[S²] = σ². This is exactly the unbiasedness of S².",
        },
      ],
      furtherReading: [
        { title: "Casella & Berger — Statistical Inference, ch. 5" },
        { title: "Wasserman — All of Statistics, ch. 7" },
        { title: "Efron & Tibshirani — An Introduction to the Bootstrap" },
      ],
    },

    zh: {
      title: "抽樣分布",
      subtitle:
        "估計量本身就是一個隨機變數。它的分布 ── 抽樣分布 ── 才是每個標準誤差、每個 CI、每個檢定背後真正在運算的物件。",
      hook: "為什麼 σ²/n 是初統最重要的公式 ── 以及 t 分布與 χ² 分布從哪裡來。",
      whyItMatters: (
        <>
          抽樣分布是「資料的一個函數」與「我們可以採取行動的機率陳述」之間的橋。
          沒有它，你能算出 <M>{`\\bar X`}</M>，但你說不出它「可能差多少」。
          有了它，每個 CI、每個檢定、每個統計保證都自動掉出來。
        </>
      ),
      intuition: (
        <>
          <p>
            想像你把實驗跑很多次。每次重複都會給你一份不同的資料、
            以及一個不同的估計量值 <M>{`\\hat\\theta`}</M>。
            把所有這些值畫成直方圖 ── 那就是 <M>{`\\hat\\theta`}</M> 的<em>抽樣分布</em>。
          </p>
          <p>
            這正是每個信賴區間與假設檢定在背後推理的物件。
            估計量的平均是它的中心，估計量的標準差是<em>標準誤（standard error）</em>
            ── 注意：和「資料本身的標準差」是兩回事！──
            而它的形狀決定了你可以用常態近似、t 分布、或別的什麼。
          </p>
          <p>
            好消息：對於樣本平均，CLT 替你做了大半工作。
            形狀近似常態、中心是真實平均、標準差正好是{" "}
            <M>{`\\sigma/\\sqrt{n}`}</M>。
          </p>
        </>
      ),
      formal: (
        <>
          <p>
            一個估計量 <M>{`\\hat\\theta_n = T(X_1, \\dots, X_n)`}</M>{" "}
            的<em>抽樣分布</em>，
            就是把 <M>{`\\hat\\theta_n`}</M> 視為隨機變數時的分布
            （由隨機樣本 <M>{`X_1, \\dots, X_n \\sim F`}</M> 所誘發）。
            在 <M>{`X_i \\sim \\mathcal{N}(\\mu, \\sigma^2)`}</M> 下，
            樣本平均與樣本變異數的三個核心事實：
          </p>
          <FormulaBlock formula={`\\bar X_n \\sim \\mathcal{N}\\!\\left(\\mu, \\frac{\\sigma^2}{n}\\right), \\qquad \\frac{(n-1)S^2}{\\sigma^2} \\sim \\chi^2_{n-1}`} />
          <p>
            以及一個有名的獨立性：<M>{`\\bar X_n \\perp S^2`}</M>
            （只在常態下成立！）。把這幾個合起來就得到 t 統計量：
          </p>
          <FormulaBlock
            formula={`T = \\frac{\\bar X_n - \\mu}{S/\\sqrt n} \\sim t_{n-1}`}
            question="當 σ 未知時，標準化後的樣本平均服從什麼分布？"
          />
          <p>
            這就是讓 t 檢定「不需要知道母體變異數也能用」的原因。
          </p>
        </>
      ),
      graduate: (
        <>
          <p>
            <strong><M>{`\\bar X`}</M> 與 <M>{`S^2`}</M> 的獨立性是高斯特有的怪性質。</strong>{" "}
            對任何其他分布它們都是相關的。
            乾淨的證明走 Cochran 定理，
            並用「<M>{`\\bar X`}</M> 是往 all-ones 方向的投影，
            <M>{`S^2`}</M> 衡量的是垂直補集裡的殘差」這個觀點。
            在任何非高斯模型裡，「位置」與「尺度」都無法這麼乾淨地分開 ──
            這就是為什麼 t 檢定只在常態下精確、其他地方都是近似。
          </p>
          <p>
            <strong>χ² 與 Gamma。</strong>
            <M>{`\\chi^2_k`}</M> 分布就是 <M>{`\\text{Gamma}(k/2, 2)`}</M>。
            它出現為「標準常態的平方和」：
            若 <M>{`Z_1, \\dots, Z_k \\sim \\mathcal{N}(0,1)`}</M> 為 i.i.d.，
            則 <M>{`\\sum Z_i^2 \\sim \\chi^2_k`}</M>。
            <M>{`(n-1)S^2/\\sigma^2 \\sim \\chi^2_{n-1}`}</M> 裡的{" "}
            <M>{`(n-1)`}</M>，正是「估計 <M>{`\\bar X`}</M> 損失了一個自由度」。
          </p>
          <p>
            <strong>Bootstrap 作為非參數抽樣分布。</strong>
            當你無法解析地導出抽樣分布、CLT 又太粗糙時，
            bootstrap 用「從經驗分布重抽樣」來代替未知的真實分布。
            在規則條件下，
            <M>{`\\hat\\theta_n^* - \\hat\\theta_n`}</M> 的 bootstrap 分布
            一致地估計了 <M>{`\\hat\\theta_n - \\theta`}</M> 的抽樣分布。
            這是統計學裡最有用的「20 行演算法」之一。
          </p>
          <p>
            <strong>常見誤用。</strong>
            把「資料的標準差」與「平均值的標準誤」搞混。
            前者是 <M>{`\\sigma`}</M>，後者是 <M>{`\\sigma/\\sqrt n`}</M>。
            它們差一個 <M>{`\\sqrt n`}</M> ── 而這正是「多收集資料有用」的全部原因。
          </p>
        </>
      ),
      body: (
        <>
          <SectionHeader step={1} title="從 CLT 看抽樣分布" blurb="右邊那個直方圖「就是」一個抽樣分布。把 n 拉大，看那條極限的常態鎖定下來。" />
          <CLTSimulator />

          <SectionHeader step={2} title="推導：樣本平均的變異數" />
          <ProofStepper
            title="Var(X̄) = σ²/n"
            steps={[
              { title: "寫出樣本平均。", math: "\\bar X_n = \\frac{1}{n}\\sum_{i=1}^n X_i" },
              { title: "把變異數套到「常數乘上一個和」上。", math: "\\text{Var}(\\bar X_n) = \\frac{1}{n^2}\\text{Var}\\!\\left(\\sum_{i=1}^n X_i\\right)" },
              { title: "用獨立性把變異數加起來。", math: "= \\frac{1}{n^2}\\sum_{i=1}^n \\text{Var}(X_i) = \\frac{1}{n^2} \\cdot n\\sigma^2", reason: "Var(X+Y) = Var(X) + Var(Y) 要求 Cov(X,Y) = 0；獨立就足夠。" },
              { title: "化簡。", math: "= \\frac{\\sigma^2}{n}", reason: "有名的「1/n 法則」。標準誤是 σ/√n。" },
            ]}
          />

          <TheoremCard
            kind="theorem"
            name="常態下 X̄ 與 S² 的聯合分布"
            statement={
              <>
                若 <M>{`X_1, \\dots, X_n \\sim \\mathcal{N}(\\mu, \\sigma^2)`}</M>{" "}
                為 i.i.d.，則
              </>
            }
            formula={`\\bar X_n \\sim \\mathcal{N}\\!\\left(\\mu, \\sigma^2/n\\right), \\quad \\frac{(n-1)S^2}{\\sigma^2} \\sim \\chi^2_{n-1}, \\quad \\bar X_n \\perp S^2.`}
          >
            <M>{`\\bar X`}</M> 與 <M>{`S^2`}</M> 的獨立性，
            正是讓 t 統計量 <M>{`(\\bar X - \\mu)/(S/\\sqrt n)`}</M>{" "}
            「精確地」服從 t 分布的原因。
            這是所有小樣本 t 檢定背後的基本結果。
          </TheoremCard>

          <SectionHeader step={3} title="工作範例：t 分布是怎麼來的" />
          <p className="text-ink-dim leading-relaxed">
            由上面的定理，
            <M>{`Z = (\\bar X - \\mu)/(\\sigma/\\sqrt n) \\sim \\mathcal{N}(0,1)`}</M>{" "}
            且 <M>{`V = (n-1)S^2/\\sigma^2 \\sim \\chi^2_{n-1}`}</M>，
            並且 <M>{`Z \\perp V`}</M>。
            根據 t 分布作為「比值」的定義：
          </p>
          <FormulaBlock formula={`T = \\frac{Z}{\\sqrt{V/(n-1)}} = \\frac{(\\bar X - \\mu)/(\\sigma/\\sqrt n)}{\\sqrt{S^2/\\sigma^2}} = \\frac{\\bar X - \\mu}{S/\\sqrt n} \\sim t_{n-1}`} />
          <p className="text-ink-dim leading-relaxed">
            σ 在分子分母上互相消掉了 ── 這就是魔法所在。
            我們可以對 <M>{`\\mu`}</M> 做推論，而不必知道 <M>{`\\sigma`}</M>。
          </p>
        </>
      ),
      misconceptions: [
        {
          wrong: "抽樣分布就是「資料的分布」。",
          right:
            "抽樣分布是「估計量（資料的函數）」的分布。資料的分布是 σ；樣本平均的分布是 σ/√n ── 兩個不同的東西。",
        },
        {
          wrong: "X̄ 與 S² 對任何分布都獨立。",
          right:
            "它們只在「常態模型下」獨立。對於其他任何分布它們都是相關的 ── 這就是為什麼精確的小樣本檢定通常只存在於常態資料上。",
        },
        {
          wrong: "標準差和標準誤可以互換使用。",
          right:
            "標準差描述「資料」的散布；標準誤描述「估計量的抽樣分布」的散布。兩者差一個 √n 倍。",
        },
      ],
      takeaways: [
        "估計量本身是一個隨機變數；它的抽樣分布是每個 CI 與檢定背後在推理的物件。",
        "Var(X̄) = σ²/n 在獨立性下是精確的 ── 初統裡最重要的公式。",
        "在常態下，X̄ 與 S² 獨立、(n−1)S²/σ² ~ χ²_{n-1}，合起來就推出 t 統計量。",
        "標準誤 ≠ 標準差。前者描述估計量、後者描述資料。",
        "Bootstrap 是「沒有封閉式抽樣分布時」的萬用近似器。",
      ],
      quiz: [
        {
          id: "q1",
          prompt:
            "從 N(50, 16) 取 n = 100 個 i.i.d. 觀察。樣本平均的標準誤是？",
          choices: [
            { id: "a", label: "16" },
            { id: "b", label: "4" },
            { id: "c", label: "0.4" },
            { id: "d", label: "0.16" },
          ],
          answer: "c",
          explanation: "SE = σ/√n = 4/10 = 0.4。資料的標準差是 4；平均值的標準誤小很多。",
        },
        {
          id: "q2",
          prompt: "要導出「精確」的 t 分布，需要什麼？",
          choices: [
            { id: "a", label: "n 必須很大" },
            { id: "b", label: "資料必須是常態 而且 X̄ ⊥ S²" },
            { id: "c", label: "σ 必須已知" },
            { id: "d", label: "必須用 bootstrap" },
          ],
          answer: "b",
          explanation:
            "精確的 t 分布只在「常態下」出現，因為這時 X̄ 與 S² 才會獨立。對其他分布只是近似。",
        },
        {
          id: "q3",
          prompt:
            "若 (n−1)S²/σ² ~ χ²_{n−1}，那 E[S²] 是？",
          choices: [
            { id: "a", label: "σ²/(n−1)" },
            { id: "b", label: "σ²" },
            { id: "c", label: "σ²/n" },
            { id: "d", label: "(n−1)σ²" },
          ],
          answer: "b",
          explanation:
            "E[χ²_k] = k，所以 E[(n−1)S²/σ²] = n−1，因此 E[S²] = σ²。這正是 S² 的不偏性。",
        },
      ],
      furtherReading: [
        { title: "Casella & Berger — Statistical Inference, ch. 5" },
        { title: "Wasserman — All of Statistics, ch. 7" },
        { title: "Efron & Tibshirani — An Introduction to the Bootstrap" },
      ],
    },
  },
};

export default chapter;
