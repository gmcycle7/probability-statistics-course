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
    number: 5,
    minutes: 30,
    level: 3,
    prereqs: ["random-variables-expectation-variance"],
    tags: ["LLN", "convergence", "limits"],
  },
  localized: {
    en: {
      title: "The Law of Large Numbers",
      subtitle: "Why averages are predictable even when individual outcomes are not.",
      hook: "The hidden machinery behind A/B tests, Monte Carlo, and 'enough data fixes it'.",
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
            Flip a coin once: you get heads or tails. Flip it ten times: maybe
            7 heads, maybe 3. Flip it a million times: the proportion of heads
            will sit incredibly close to 0.5. The LLN says this is not luck —
            it&apos;s mathematically forced. As the sample size grows, the
            sample mean&apos;s distribution becomes a needle pinned to the
            true mean.
          </p>
          <p>
            Crucially, the LLN does <em>not</em> say &quot;heads has to come
            back to balance tails&quot; (the gambler&apos;s fallacy). It says
            the ratio approaches 0.5 because the absolute deviation grows
            slowly (like <M>{`\\sqrt{n}`}</M>) while the denominator grows
            like <M>n</M>. The fraction is squeezed toward the mean by
            arithmetic, not by self-correction.
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
          <FormulaBlock formula={`P(|\\bar X_n - \\mu| > \\varepsilon) \\;\\longrightarrow\\; 0 \\text{ as } n\\to\\infty.`} />
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
            <M>{`\\alpha\\le 1`}</M> — sample means do not converge at all.
            This is not a pathology: many financial and network datasets live
            in this regime, and using the LLN there is dangerous.
          </p>
          <p>
            <strong>Connection to ergodic theory.</strong> The LLN is the
            baseline result of ergodic theory: time averages equal space
            averages. Birkhoff&apos;s ergodic theorem generalises the SLLN to
            dependent sequences (e.g. ergodic Markov chains), and is the
            formal backbone of MCMC.
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

    zh: {
      title: "大數法則",
      subtitle: "為什麼即使單一結果無法預測，平均值卻是可預測的。",
      hook: "A/B 測試、Monte Carlo，以及「資料夠多就解決了」背後的隱形機械。",
      whyItMatters: (
        <>
          幾乎每個對系統的量化主張 ──「平均點擊率是 3%」、
          「這個估計量是不偏的」、「Monte Carlo 跑久就會收斂」 ──
          都隱含地用到了大數法則。
          它正是「樣本夠大時隨機性會被平均掉」這個日常直覺的形式化證據。
        </>
      ),
      intuition: (
        <>
          <p>
            擲一次硬幣：得到正面或反面。擲十次：可能 7 次正面，可能 3 次。
            擲一百萬次：正面比例會非常接近 0.5。
            大數法則說這不是運氣 ── 它是被數學強迫的結果。
            隨著樣本數成長，樣本平均的分布會變成一根釘在真實平均上的針。
          </p>
          <p>
            重要的是，大數法則<em>不</em>是說「正反面要回來互相平衡」
            （這是賭徒謬誤）。它說的是：比例會趨近 0.5 是因為絕對偏差的成長很慢
            （像 <M>{`\\sqrt{n}`}</M>），而分母卻像 <M>n</M> 一樣成長。
            分數被「算術」擠向平均，而不是被「自我修正」拉回。
          </p>
        </>
      ),
      formal: (
        <>
          <p>
            設 <M>{`X_1, X_2, \\dots`}</M> 為 i.i.d. 隨機變數，
            平均為 <M>{`\\mu = E[X_i]`}</M>。
            定義樣本平均{" "}
            <M>{`\\bar X_n = \\frac{1}{n}\\sum_{i=1}^n X_i`}</M>。
          </p>
          <FormulaBlock
            formula={`\\textbf{弱大數法則: } \\bar X_n \\xrightarrow{P} \\mu \\quad\\text{當 } n\\to\\infty.`}
            question="樣本平均「在哪種意義下」逼近真實平均？"
          />
          <p>具體來說，這代表對任何 <M>{`\\varepsilon > 0`}</M>：</p>
          <FormulaBlock formula={`P(|\\bar X_n - \\mu| > \\varepsilon) \\;\\longrightarrow\\; 0 \\text{ 當 } n\\to\\infty.`} />
          <p>
            <em>強</em>大數法則說的更多：以機率 1，整條樣本平均的軌跡都收斂到 <M>μ</M>。
            我們會把強大數法則當黑盒子用，自己證弱版本即可，
            因為一行 Chebyshev 就解決了。
          </p>
        </>
      ),
      graduate: (
        <>
          <p>
            <strong>弱、強與幾乎必然。</strong>
            弱大數法則是在說每個 n 的<M>{`\\bar X_n`}</M>{" "}
            的「邊際分布」如何變化；
            強大數法則則是針對整條樣本路徑的陳述：
            <M>{`P(\\lim_n \\bar X_n = \\mu) = 1`}</M>。
            兩者概念上不同 ──
            弱版本只要變異數有限就可由 Chebyshev 推得；
            強版本通常用 Borel–Cantelli 配合截斷法（Etemadi 的證明）。
          </p>
          <p>
            <strong>條件確實會關鍵。</strong>
            古典版的大數法則假設「i.i.d. 且平均有限」（Kolmogorov 的 SLLN），
            或「變異數有限」（我們下方要證的版本）。
            當底層分布有重尾 ── 如 Cauchy、或 <M>{`\\alpha\\le 1`}</M> 的 Pareto ──
            樣本平均根本不會收斂。
            這不是病態案例：許多金融與網路資料就活在這個區域，
            在那裡盲目套用大數法則是危險的。
          </p>
          <p>
            <strong>與遍歷理論的連結。</strong>
            大數法則是遍歷理論的基本結果：
            時間平均等於空間平均。
            Birkhoff 的遍歷定理把 SLLN 推廣到相依序列（例如遍歷 Markov chain），
            正是 MCMC 的形式化骨幹。
          </p>
        </>
      ),
      body: (
        <>
          <SectionHeader step={1} title="親眼看它發生" blurb="三組獨立的跑動平均。注意它們都被吸到 p，但互相之間並沒有任何「有規律的對稱性」。" />
          <LLNSimulator />

          <SectionHeader step={2} title="弱大數法則的乾淨證明（變異數有限版本）" />
          <ProofStepper
            title="用 Chebyshev 證弱大數法則"
            steps={[
              { title: "計算樣本平均的平均與變異數。", math: "E[\\bar X_n] = \\mu, \\quad \\text{Var}(\\bar X_n) = \\frac{\\sigma^2}{n}.", reason: "由期望值的線性性與 X_i 的獨立性。" },
              { title: "套用 Chebyshev 不等式。", math: "P(|\\bar X_n - \\mu| > \\varepsilon) \\le \\frac{\\text{Var}(\\bar X_n)}{\\varepsilon^2} = \\frac{\\sigma^2}{n \\varepsilon^2}." },
              { title: "取 n → ∞。", math: "\\frac{\\sigma^2}{n\\varepsilon^2} \\to 0.", reason: "對任何固定的 ε > 0，右邊都會消失 ── 這正是「機率收斂」的定義。" },
              { title: "下結論。", reason: "因此 X̄_n → μ 在機率意義下成立 ── 這就是弱大數法則。注意我們用到的條件：只有「變異數有限」與「獨立」，沒有任何關於分布形狀的假設。" },
            ]}
          />

          <TheoremCard
            kind="theorem"
            name="強大數法則（Kolmogorov）"
            statement={
              <>
                若 <M>{`X_1, X_2, \\dots`}</M> 是 i.i.d. 且平均{" "}
                <M>{`\\mu`}</M> 有限，
                則當 <M>n→∞</M>，<M>{`P(\\bar X_n \\to \\mu) = 1`}</M>。
              </>
            }
          >
            證明比較細緻（Etemadi 的論證是現代最乾淨的版本），
            但實用結論很直接：以機率 1，你的跑動平均最終會無限接近真實平均並停在那裡。
          </TheoremCard>
        </>
      ),
      misconceptions: [
        {
          wrong: "連續出現很多反面之後，正面「該出現了」。",
          right:
            "硬幣沒有記憶。過去的拋擲不會改變未來的機率。大數法則之所以把比例推向 0.5，是因為分母長得比偏差快，不是因為硬幣會自我修正。",
          why: "這就是賭徒謬誤。絕對失衡 |H - T| 可以一直成長 ── 真正穩定下來的是「比例」。",
        },
        {
          wrong: "大數法則代表只要資料夠多，估計量就總是準確的。",
          right:
            "它說的是估計量會收斂到真實平均。收斂的「速度」由 CLT 決定，而且只在變異數有限時成立。對 Cauchy 取樣，再多資料也救不了你。",
        },
        {
          wrong: "大數法則對任何隨機變數序列都成立。",
          right:
            "它至少需要獨立（或遍歷性）與平均有限。強相關的過程可能徹底壞掉 ── 這就是時間序列分析存在的理由。",
        },
      ],
      takeaways: [
        "樣本平均會收斂到母體平均：弱版本是「機率收斂」，強版本是「以機率 1 收斂」。",
        "證明可化約到 Chebyshev：樣本平均的變異數是 σ²/n，趨近於 0。",
        "大數法則沒有告訴你「速度有多快」── 那是 CLT 的工作。",
        "需要獨立 + 平均有限（或變異數有限）。重尾或強相關都可能讓它失效。",
      ],
      quiz: [
        {
          id: "q1",
          prompt:
            "下列哪個假設「不」被弱大數法則用 Chebyshev 證明時用到？",
          choices: [
            { id: "a", label: "變異數有限" },
            { id: "b", label: "獨立" },
            { id: "c", label: "同分布" },
            { id: "d", label: "對稱分布" },
          ],
          answer: "d",
          explanation:
            "對稱性無關緊要。我們需要 i.i.d. 與變異數有限 ── 分布形狀任意。",
        },
        {
          id: "q2",
          prompt:
            "一個賭徒連續輸了 9 次公平硬幣的拋擲。第 10 次出現正面的機率是？",
          choices: [
            { id: "a", label: "大於 0.5（向均值回歸）" },
            { id: "b", label: "正好 0.5" },
            { id: "c", label: "小於 0.5" },
            { id: "d", label: "沒有大數法則無法判斷" },
          ],
          answer: "b",
          explanation:
            "獨立的拋擲沒有記憶。大數法則談的是長期頻率，不是「下一次」的機率。",
        },
        {
          id: "q3",
          prompt:
            "n 個 i.i.d.、變異數為 σ² 的隨機變數，其樣本平均的標準差是？",
          choices: [
            { id: "a", label: "σ²/n" },
            { id: "b", label: "σ²" },
            { id: "c", label: "σ/√n" },
            { id: "d", label: "σ·√n" },
          ],
          answer: "c",
          explanation:
            "Var(X̄_n) = σ²/n，因此 SD(X̄_n) = σ/√n。這就是樣本數規劃的「√n 法則」。",
        },
      ],
      furtherReading: [
        { title: "Durrett — Probability: Theory and Examples, ch. 2" },
        { title: "Williams — Probability with Martingales, ch. 12" },
      ],
    },
  },
};

export default chapter;
