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
    number: 6,
    minutes: 40,
    level: 4,
    prereqs: ["law-of-large-numbers"],
    tags: ["CLT", "normal", "convergence"],
  },
  localized: {
    en: {
      title: "The Central Limit Theorem",
      subtitle:
        "Why averages of almost anything are approximately Normal — and why that single fact powers nearly every confidence interval and z-test.",
      hook: "Pick any distribution. Average enough samples. Get a Normal. The depth of this miracle is hard to overstate.",
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
            probability — the random variables themselves do not have to
            settle down to a single value, only the <em>distributions</em>.
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

    zh: {
      title: "中央極限定理",
      subtitle:
        "為什麼幾乎任何東西的平均都近似常態 ── 以及這個事實為何驅動了幾乎所有信賴區間與 z 檢定。",
      hook: "挑任何一個分布，把樣本平均化，得到常態。這個奇蹟的深度怎麼形容都不為過。",
      whyItMatters: (
        <>
          中央極限定理（CLT）是常態分布坐落於統計學中央的根本原因：
          它是（幾乎）任何樣本平均的極限形狀。
          這個事實讓你在不知道底層分布的情況下，也能建構信賴區間；
          它正當化了大部分的 z 檢定與 t 檢定；
          也讓機器學習的損失景觀漸近呈高斯分布。
          如果說大數法則回答「平均會收斂」，那 CLT 回答的是
          <em>有多快</em>以及<em>長什麼形狀</em>。
        </>
      ),
      intuition: (
        <>
          <p>
            選任何一個行為良好的分布 ── Uniform、Exponential、Bernoulli、
            奇怪的雙峰混合。獨立地從中抽 <M>n</M> 個樣本並取平均。
            把這個實驗重複一千次，畫出這些「樣本平均」的直方圖。
          </p>
          <p>
            奇蹟是：不管你從哪裡開始，這個直方圖都長得像高斯。
            原始的形狀被「平均」成一條平滑的鐘形。
            鐘形的中心是來源的真實平均；
            標準差以 <M>{`\\sigma/\\sqrt{n}`}</M> 的速率縮小。
          </p>
          <p>
            這就是為什麼常態分布在自然界無所不在的最深層原因：
            任何「很多獨立小貢獻之和」的量，都會自動繼承到一個常態形狀。
          </p>
        </>
      ),
      formal: (
        <>
          <p>
            設 <M>{`X_1, X_2, \\dots`}</M> 為 i.i.d.，平均為 <M>{`\\mu`}</M>，
            變異數 <M>{`\\sigma^2`}</M> 有限。則標準化後的樣本平均
          </p>
          <FormulaBlock
            formula={`Z_n \\;=\\; \\frac{\\bar X_n - \\mu}{\\sigma / \\sqrt{n}}`}
            question="把樣本平均放在「正確的尺度」上時，它的偏差長什麼樣子？"
          />
          <p>會在分布上收斂到標準常態：</p>
          <FormulaBlock formula={`Z_n \\xrightarrow{d} \\mathcal{N}(0, 1) \\quad \\text{當 } n\\to\\infty.`} />
          <p>
            等價地，當 <M>n</M> 很大時：
            <M>{`\\bar X_n \\;\\dot\\sim\\; \\mathcal{N}\\!\\big(\\mu,\\,\\sigma^2/n\\big)`}</M>。
            這才是你實務上會用的形式。
          </p>
        </>
      ),
      graduate: (
        <>
          <p>
            <strong>分布收斂。</strong>CLT 是關於 CDF 的陳述：
            在極限的所有連續點處，<M>{`P(Z_n \\le z) \\to \\Phi(z)`}</M>。
            這比「機率收斂」弱 ── 隨機變數本身不必收斂到單一個值，
            只要<em>分布</em>收斂就好。
          </p>
          <p>
            <strong>變異數有限是必要的。</strong>沒有它，CLT 就會失效。
            對於指數 <M>{`\\alpha < 2`}</M> 的對稱穩定分布（例如 Cauchy），
            樣本平均的分布和單一觀察的分布<em>完全一樣</em> ── 平均化什麼也沒做。
            重尾的世界由「廣義 CLT」與「穩定律」掌管。
          </p>
          <p>
            <strong>Berry–Esseen 不等式。</strong>CLT 也帶有定量的誤差界。
            若 <M>{`\\rho = E|X-\\mu|^3 < \\infty`}</M>，
            則存在通用常數 <M>C</M> 使得{" "}
            <M>{`\\sup_z |P(Z_n\\le z)-\\Phi(z)| \\le C\\rho/(\\sigma^3\\sqrt{n})`}</M>。
            重點是：收斂速度為 <M>{`1/\\sqrt{n}`}</M>，
            對稱、輕尾的分布比偏斜的分布收斂得更快。
          </p>
          <p>
            <strong>多元 CLT 與 delta 方法。</strong>若{" "}
            <M>{`\\sqrt{n}(\\bar X_n - \\mu) \\to \\mathcal{N}(0, \\Sigma)`}</M>{" "}
            且 <M>g</M> 可微，則{" "}
            <M>{`\\sqrt{n}(g(\\bar X_n) - g(\\mu)) \\to \\mathcal{N}(0, \\nabla g(\\mu)^T \\Sigma \\nabla g(\\mu))`}</M>。
            這是推導對數勝率、相關係數等漸近分布的最常用工具。
          </p>
        </>
      ),
      body: (
        <>
          <SectionHeader step={1} title="親眼看它收斂" blurb="挑一個極不像常態的來源分布。把 n 拉大。看樣本平均的直方圖如何變成那條橘色的常態曲線。" />
          <CLTSimulator />

          <SectionHeader step={2} title="用動差母函數證明的草稿" blurb="最乾淨的古典證法。Lévy 的連續性定理告訴我們 MGF 收斂蘊含分布收斂。" />
          <ProofStepper
            title="用 MGF 證明 CLT"
            steps={[
              { title: "中心化並重新縮放。", math: "Y_i = \\frac{X_i - \\mu}{\\sigma}, \\quad Z_n = \\frac{1}{\\sqrt{n}} \\sum_{i=1}^n Y_i.", reason: "Y_i 是 i.i.d.，平均 0、變異數 1。" },
              { title: "計算 Y 的 MGF。", math: "M_Y(t) = 1 + 0\\cdot t + \\tfrac{1}{2}t^2 + o(t^2)", reason: "在 0 附近做 Taylor 展開，並利用 E[Y]=0、E[Y²]=1。" },
              { title: "用獨立性把 MGF 相乘。", math: "M_{Z_n}(t) = \\big(M_Y(t/\\sqrt{n})\\big)^n" },
              { title: "代入展開式。", math: "= \\left(1 + \\frac{t^2}{2n} + o(1/n)\\right)^n" },
              { title: "取極限。", math: "\\to e^{t^2/2}", reason: "(1 + a/n)^n → e^a。" },
              { title: "認出極限。", reason: "e^{t²/2} 正好是標準常態的 MGF。由 Lévy 連續性定理，Z_n → N(0,1) 在分布上成立。" },
            ]}
          />

          <TheoremCard
            kind="theorem"
            name="中央極限定理（Lindeberg–Lévy）"
            statement={
              <>
                若 <M>{`X_1, X_2, \\dots`}</M> 為 i.i.d.，
                <M>{`E[X_i]=\\mu`}</M>，<M>{`\\text{Var}(X_i)=\\sigma^2 \\in (0,\\infty)`}</M>，
                則{" "}
                <M>{`\\sqrt{n}(\\bar X_n - \\mu)/\\sigma \\xrightarrow{d} \\mathcal{N}(0,1)`}</M>。
              </>
            }
          >
            Lindeberg 條件把這個結果進一步推廣到「不同分布但每一項都均勻地小」的情況 ──
            這是處理迴歸殘差等情境所需要的版本。
          </TheoremCard>

          <SectionHeader step={3} title="實務後果：免費的信賴區間" />
          <p className="text-ink-dim leading-relaxed">
            CLT 給你一個對「樣本平均」的近似分布，無論底層資料長什麼樣。
            因此一個對母體平均的近似 95% 區間是：
          </p>
          <FormulaBlock
            formula={`\\bar X_n \\pm 1.96 \\cdot \\frac{s}{\\sqrt{n}}`}
            caption="其中 s 是樣本標準差。要其他信心水準時，把 1.96 換成對應的常態分位數即可。"
          />
          <p className="text-ink-dim leading-relaxed">
            這就是大學統計裡幾乎所有信賴區間的食譜。
            CLT 是讓它「即使資料離常態很遠也能用」的關鍵。
          </p>
        </>
      ),
      misconceptions: [
        {
          wrong: "資料量越大，資料就越像常態。",
          right:
            "只有「樣本平均」的分布才會趨近常態。原始資料永遠保持自己原本的形狀。",
          why: "忘了這一點，你就會錯誤地下結論「大資料是高斯的」，並把基於常態的檢定套到極度偏斜的分布上。",
        },
        {
          wrong: "n = 30 是 CLT 的魔法門檻。",
          right:
            "並沒有所謂的通用門檻。對稱、輕尾的分布收斂很快（n = 10 可能就夠）；極度偏斜或重尾的分布可能需要 n = 1000 以上 ── 或根本永遠不會收斂。",
        },
        {
          wrong: "CLT 必須要 X_i 互相獨立。",
          right:
            "獨立是充分條件，不是必要條件。也有適用於 martingale difference、mixing 序列、遍歷穩態過程的 CLT ── 但每個都各有自己的技術條件。",
        },
      ],
      takeaways: [
        "變異數有限的 i.i.d. 樣本平均，無論來源分布為何，漸近上都是常態。",
        "平均的標準誤以 σ/√n 縮小；這就是不確定性下降的速率。",
        "Berry–Esseen 把誤差量化：收斂速度為 1/√n，偏斜越大越慢。",
        "對於變異數無限的分布，CLT 失效，由「穩定律」接手。",
        "幾乎所有古典的信賴區間與 z 檢定，都是 CLT 的一行推論。",
      ],
      quiz: [
        {
          id: "q1",
          prompt:
            "X̄_n 是 n=100 個 i.i.d. 觀察的樣本平均，平均 μ=10、σ=4。X̄_n 的近似分布是？",
          choices: [
            { id: "a", label: "N(10, 16)" },
            { id: "b", label: "N(10, 0.16)" },
            { id: "c", label: "N(10, 0.04)" },
            { id: "d", label: "N(10, 4)" },
          ],
          answer: "b",
          explanation:
            "由 CLT，X̄_n ≈ N(μ, σ²/n) = N(10, 16/100) = N(10, 0.16)。標準誤 σ/√n = 0.4。",
        },
        {
          id: "q2",
          prompt: "下列哪一個會「破壞」CLT？",
          choices: [
            { id: "a", label: "偏斜的來源分布" },
            { id: "b", label: "變異數無限的來源分布" },
            { id: "c", label: "離散的來源分布" },
            { id: "d", label: "雙峰的來源分布" },
          ],
          answer: "b",
          explanation:
            "CLT 需要變異數有限。偏斜、離散、多峰只會讓收斂變慢，不會把它打破。",
        },
        {
          id: "q3",
          prompt:
            "由 CLT，對母體平均的近似 95% 區間是？",
          choices: [
            { id: "a", label: "X̄ ± 1.96·σ" },
            { id: "b", label: "X̄ ± 1.96·σ/√n" },
            { id: "c", label: "X̄ ± 2·σ²/n" },
            { id: "d", label: "X̄ ± n·σ" },
          ],
          answer: "b",
          explanation:
            "平均的標準誤是 σ/√n；95% 的 z 分位數約為 1.96。",
        },
      ],
      furtherReading: [
        { title: "Durrett — Probability: Theory and Examples, ch. 3" },
        { title: "Lehmann — Elements of Large-Sample Theory, ch. 2" },
      ],
    },
  },
};

export default chapter;
