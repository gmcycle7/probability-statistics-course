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
    minutes: 45,
    level: 3,
    prereqs: ["random-variables-expectation-variance"],
    tags: ["binomial", "poisson", "normal", "exponential"],
  },
  localized: {
    en: {
      title: "Common Probability Distributions",
      subtitle:
        "A small zoo of distributions explains an enormous fraction of real-world data. Knowing them by feel is half of being a statistician.",
      hook: "Each distribution is the answer to a story problem. Learn the stories and you'll never have to memorise the PMFs again.",
      whyItMatters: (
        <>
          Distributions are not arbitrary formulas — each one is the answer to
          a very specific kind of question. The Bernoulli answers
          &quot;yes/no&quot;. The Binomial answers &quot;how many yeses out of
          n&quot;. The Poisson answers &quot;how many rare events&quot;. The
          Exponential answers &quot;how long until the next event&quot;. The
          Normal answers &quot;what does an average look like&quot;. Once you
          can match a story to a distribution in your head, you have a
          vocabulary to model the world.
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
          <FormulaBlock formula={`\\text{Binomial}(n,p):\\quad p_X(k)=\\binom{n}{k}p^k(1-p)^{n-k},\\ \\ k=0,\\dots,n`} />
          <FormulaBlock formula={`\\text{Poisson}(\\lambda):\\quad p_X(k)=\\frac{e^{-\\lambda}\\lambda^k}{k!},\\ \\ k=0,1,2,\\dots`} />
          <FormulaBlock formula={`\\text{Exponential}(\\lambda):\\quad f_X(x)=\\lambda e^{-\\lambda x},\\ \\ x\\ge 0`} />
          <FormulaBlock formula={`\\text{Normal}(\\mu,\\sigma^2):\\quad f_X(x)=\\frac{1}{\\sqrt{2\\pi}\\,\\sigma}\\exp\\!\\left(-\\frac{(x-\\mu)^2}{2\\sigma^2}\\right)`} />
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
            <strong>Exponential family.</strong> Most named distributions
            belong to a single algebraic structure. A density is in the{" "}
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
            with rate <M>λ</M>, then (a) the number of events in any interval
            of length <M>t</M> is Poisson(<M>λt</M>), and (b) the gaps between
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
          prompt: "X ~ Binomial(100, 0.02). Roughly E[X] and Var(X) are...",
          choices: [
            { id: "a", label: "E=2, Var=2" },
            { id: "b", label: "E=2, Var=1.96" },
            { id: "c", label: "E=0.02, Var=0.02" },
            { id: "d", label: "E=100, Var=0.02" },
          ],
          answer: "b",
          explanation:
            "E[X] = np = 2, Var(X) = np(1-p) = 100·0.02·0.98 = 1.96. Note how close it is to the Poisson(2) variance — the law of rare events at work.",
        },
        {
          id: "q4",
          type: "numeric",
          prompt:
            "X ~ Exponential(λ=2). What is P(X > 1)? (round to 3 decimals)",
          answer: 0.135,
          tolerance: 0.005,
          hint: "P(X > t) = e^{−λt} for Exponential(λ).",
          explanation: "P(X > 1) = e^{−2·1} = e^{−2} ≈ 0.135.",
        },
        {
          id: "q5",
          type: "ordering",
          prompt: "Re-order the steps of deriving the Binomial → Poisson limit.",
          steps: [
            { id: "s1", label: "Write Binomial PMF: C(n,k) p^k (1−p)^{n−k}" },
            { id: "s2", label: "Substitute p = λ/n" },
            { id: "s3", label: "Note that C(n,k)/n^k → 1/k! as n → ∞" },
            { id: "s4", label: "Note that (1 − λ/n)^n → e^{−λ}" },
            { id: "s5", label: "Combine to get e^{−λ} λ^k / k!" },
          ],
          explanation: "Write PMF → substitute → simplify both factors → recognise Poisson.",
        },
      ],
      furtherReading: [
        { title: "Ross — A First Course in Probability, ch. 4 & 5" },
        { title: "Bertsekas & Tsitsiklis — Introduction to Probability, ch. 2 & 3" },
      ],
    },

    zh: {
      title: "常見的機率分布",
      subtitle:
        "一個小小的分布動物園就足以解釋現實世界裡很大比例的資料。能憑直覺認出它們，是「成為統計學家」的一半。",
      hook: "每個分布都是某個故事問題的答案。學會故事，你就再也不用背 PMF 公式。",
      whyItMatters: (
        <>
          分布不是任意的公式 ── 每一個都是某種特定問題的答案。
          Bernoulli 回答「是 / 否」；Binomial 回答「n 次裡有幾次是」；
          Poisson 回答「在固定時段內發生幾次稀有事件」；
          Exponential 回答「下一次事件還要等多久」；
          Normal 回答「平均長什麼樣子」。
          一旦你能在腦中把故事和分布配對，你就有了一套描述世界的詞彙。
        </>
      ),
      intuition: (
        <>
          <p>
            離散分布是「一份可能值的清單，每個值都附一個機率」。
            連續分布是「一條密度曲線，兩點之間的面積就是落在那段的機率」。
            兩種其實都是「散布在數線上的機率質量堆」。
          </p>
          <p>
            內化標準分布的訣竅是學<em>生成故事</em>，而不是公式。
            公式只不過是計數的副產品：
          </p>
          <ul className="list-disc pl-6 space-y-1.5 mt-2">
            <li><strong>Bernoulli(p)</strong> ── 一次「是 / 否」試驗。</li>
            <li><strong>Binomial(n, p)</strong> ── n 個獨立 Bernoulli 的和。</li>
            <li><strong>Geometric(p)</strong> ── 直到第一次成功所需的試驗數。</li>
            <li><strong>Poisson(λ)</strong> ── Binomial 在 n → ∞、p → 0、np = λ 下的極限。</li>
            <li><strong>Exponential(λ)</strong> ── Poisson 事件之間的等待時間。</li>
            <li><strong>Normal(μ, σ²)</strong> ── 任何「許多獨立小東西的和」的極限形狀。</li>
            <li><strong>Uniform(a, b)</strong> ── 「[a, b] 上每個值同樣可能」。</li>
          </ul>
        </>
      ),
      formal: (
        <>
          <p>必須一眼就認出來的 PMF / PDF：</p>
          <FormulaBlock formula={`\\text{Binomial}(n,p):\\quad p_X(k)=\\binom{n}{k}p^k(1-p)^{n-k},\\ \\ k=0,\\dots,n`} />
          <FormulaBlock formula={`\\text{Poisson}(\\lambda):\\quad p_X(k)=\\frac{e^{-\\lambda}\\lambda^k}{k!},\\ \\ k=0,1,2,\\dots`} />
          <FormulaBlock formula={`\\text{Exponential}(\\lambda):\\quad f_X(x)=\\lambda e^{-\\lambda x},\\ \\ x\\ge 0`} />
          <FormulaBlock formula={`\\text{Normal}(\\mu,\\sigma^2):\\quad f_X(x)=\\frac{1}{\\sqrt{2\\pi}\\,\\sigma}\\exp\\!\\left(-\\frac{(x-\\mu)^2}{2\\sigma^2}\\right)`} />
          <p>以及那些你不該再去查的平均與變異數：</p>
          <div className="my-3 overflow-x-auto rounded-xl border border-bg-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-bg-border bg-bg-soft text-ink-dim">
                  <th className="text-left px-3 py-2">分布</th>
                  <th className="text-left px-3 py-2">E[X]</th>
                  <th className="text-left px-3 py-2">Var(X)</th>
                  <th className="text-left px-3 py-2">故事</th>
                </tr>
              </thead>
              <tbody className="text-ink-dim">
                <tr className="border-b border-bg-border"><td className="px-3 py-2">Bernoulli(p)</td><td><M>p</M></td><td><M>{`p(1-p)`}</M></td><td>1 次試驗</td></tr>
                <tr className="border-b border-bg-border"><td className="px-3 py-2">Binomial(n,p)</td><td><M>np</M></td><td><M>{`np(1-p)`}</M></td><td>n 次試驗，數成功次數</td></tr>
                <tr className="border-b border-bg-border"><td className="px-3 py-2">Geometric(p)</td><td><M>{`1/p`}</M></td><td><M>{`(1-p)/p^2`}</M></td><td>直到第一次成功的試驗數</td></tr>
                <tr className="border-b border-bg-border"><td className="px-3 py-2">Poisson(λ)</td><td><M>λ</M></td><td><M>λ</M></td><td>固定時段內的稀有事件</td></tr>
                <tr className="border-b border-bg-border"><td className="px-3 py-2">Exponential(λ)</td><td><M>{`1/\\lambda`}</M></td><td><M>{`1/\\lambda^2`}</M></td><td>下一次事件的等待時間</td></tr>
                <tr className="border-b border-bg-border"><td className="px-3 py-2">Uniform(a,b)</td><td><M>{`(a+b)/2`}</M></td><td><M>{`(b-a)^2/12`}</M></td><td>[a,b] 上均勻</td></tr>
                <tr><td className="px-3 py-2">Normal(μ,σ²)</td><td><M>μ</M></td><td><M>{`\\sigma^2`}</M></td><td>和的極限</td></tr>
              </tbody>
            </table>
          </div>
        </>
      ),
      graduate: (
        <>
          <p>
            <strong>指數族（exponential family）。</strong>
            大部分有名字的分布都屬於同一個代數結構。
            一個密度若能寫成
          </p>
          <FormulaBlock
            formula={`f(x \\mid \\theta) = h(x)\\exp\\!\\left(\\sum_{j=1}^k \\eta_j(\\theta)T_j(x) - A(\\theta)\\right)`}
            question="哪些分布的充分統計量不會隨樣本數成長？"
          />
          <p>
            就屬於 <em>k 參數指數族</em>。屬於指數族解釋了為什麼 binomial 樣本平均對 <M>p</M>{" "}
            是充分的、為什麼 Poisson 樣本和對 <M>λ</M> 是充分的、
            為什麼這些族裡的 MLE 在溫和條件下唯一且一致，
            以及為什麼共軛先驗存在（Beta 對應 Bernoulli、Gamma 對應 Poisson…）。
          </p>
          <p>
            <strong>無記憶性（memorylessness）。</strong>
            指數分布是 [0, ∞) 上唯一滿足{" "}
            <M>{`P(X > s+t \\mid X > s) = P(X > t)`}</M> 的連續分布。
            幾何分布是它的離散對應物。
            無記憶性是 Poisson 過程到達間隔互相獨立的原因 ──
            也是把它套用到「會老化」的元件壽命上會危險地過度樂觀的原因。
          </p>
          <p>
            <strong>橫向連結。</strong>
            Binomial → Poisson 是<em>稀有事件法則</em>。
            獨立的 Exponential(λ) 之和服從 Gamma(n, λ)。
            獨立 Normal 的平方和服從 χ²。
            整張關係網由變換與極限串起來，每個都該至少自己重新推一次。
          </p>
        </>
      ),
      body: (
        <>
          <SectionHeader step={1} title="視覺型錄" blurb="切換分布族、拖動參數，看形狀如何即時改變。" />
          <DistributionExplorer />

          <SectionHeader step={2} title="從 Binomial 到 Poisson ── 稀有事件法則" blurb="為什麼 Poisson 老是換個樣子出現。" />
          <TheoremCard
            kind="proposition"
            name="Binomial → Poisson"
            statement={
              <>
                若 <M>{`n\\to\\infty`}</M>、<M>{`p\\to 0`}</M>，
                且 <M>{`np\\to\\lambda > 0`}</M>，則對任意固定 <M>{`k`}</M>：
              </>
            }
            formula={`\\binom{n}{k}p^k(1-p)^{n-k} \\;\\longrightarrow\\; \\frac{e^{-\\lambda}\\lambda^k}{k!}.`}
          >
            證明梗概：把 PMF 寫成{" "}
            <M>{`\\binom{n}{k}p^k(1-p)^{n-k}=\\frac{n(n-1)\\cdots(n-k+1)}{k!}\\left(\\frac{\\lambda}{n}\\right)^k\\left(1-\\frac{\\lambda}{n}\\right)^{n-k}`}</M>，
            然後取 <M>{`n\\to\\infty`}</M>：除以 <M>{`n^k`}</M> 後的多項式部分趨近 1，
            而 <M>{`(1-\\lambda/n)^n\\to e^{-\\lambda}`}</M>。
          </TheoremCard>

          <SectionHeader step={3} title="工作範例：Exponential 與 Poisson 的關聯" />
          <p className="text-ink-dim leading-relaxed">
            如果事件依參數為 <M>λ</M> 的 Poisson 過程到達，那麼
            (a) 任何長度為 <M>t</M> 的區間內，事件數服從 Poisson(<M>λt</M>)；
            (b) 相鄰事件之間的間隔是 i.i.d. Exponential(<M>λ</M>)。
            這兩種描述互相等價，並且共同解釋了為什麼
            「到達次數」（Poisson）和「下一次到達的等待時間」（Exponential）總是成對出現。
          </p>
        </>
      ),
      misconceptions: [
        {
          wrong: "如果平均每天收到 50 封 email，就代表我每天都會收到大約 50 封。",
          right:
            "如果 email 服從平均為 50 的 Poisson 過程，標準差是 √50 ≈ 7.07。某天收到 35 或 65 封都是正常的。不要把平均值當保證。",
        },
        {
          wrong: "資料量大就可以套常態分布。",
          right:
            "中央極限定理保證的是「平均」的抽樣分布趨近常態，不是「原始資料」是常態。所得、檔案大小、等待時間，不管你收多少筆都還是重尾。",
        },
        {
          wrong: "「無記憶性」就是「過去完全不重要」。",
          right:
            "它只是一個非常具體的東西：P(X > s+t | X > s) = P(X > t)。這是一個強而特別的性質 ── 真實世界裡幾乎沒有任何壽命分布實際擁有它。",
        },
      ],
      takeaways: [
        "每個分布都是某個故事的答案。先學故事，再學公式。",
        "Bernoulli → Binomial → Poisson 與 Exponential ↔ Poisson 過程，是離散與等待時間建模的兩條主軸。",
        "常態是平均值的通用極限形狀，不是「資料的通用形狀」。",
        "指數族結構是 MLE、充分統計量與共軛先驗都行為良好的原因。",
      ],
      quiz: [
        {
          id: "q1",
          prompt:
            "客服中心平均每分鐘收到 4 通電話。下一分鐘剛好收到 2 通電話的機率最接近？",
          choices: [
            { id: "a", label: "0.07" },
            { id: "b", label: "0.15" },
            { id: "c", label: "0.27" },
            { id: "d", label: "0.50" },
          ],
          answer: "b",
          explanation: "Poisson(4)：P(K=2) = e^{-4} 4²/2! = e^{-4}·8 ≈ 0.146。",
        },
        {
          id: "q2",
          prompt:
            "下列哪個性質在 [0, ∞) 上的連續分布裡，唯一刻畫了指數分布？",
          choices: [
            { id: "a", label: "對稱性" },
            { id: "b", label: "無記憶性" },
            { id: "c", label: "變異數有限" },
            { id: "d", label: "鐘形" },
          ],
          answer: "b",
          explanation:
            "指數分布是 [0, ∞) 上唯一滿足 P(X > s+t | X > s) = P(X > t) 的連續分布。",
        },
        {
          id: "q3",
          prompt: "X ~ Binomial(100, 0.02)。E[X] 和 Var(X) 大約為？",
          choices: [
            { id: "a", label: "E=2, Var=2" },
            { id: "b", label: "E=2, Var=1.96" },
            { id: "c", label: "E=0.02, Var=0.02" },
            { id: "d", label: "E=100, Var=0.02" },
          ],
          answer: "b",
          explanation:
            "E[X] = np = 2，Var(X) = np(1-p) = 100·0.02·0.98 = 1.96。注意它與 Poisson(2) 的變異數有多接近 ── 這就是稀有事件法則在運作。",
        },
        {
          id: "q4",
          type: "numeric",
          prompt:
            "X ~ Exponential(λ=2)。P(X > 1) 是多少？（取 3 位小數）",
          answer: 0.135,
          tolerance: 0.005,
          hint: "Exponential(λ) 的 P(X > t) = e^{−λt}。",
          explanation: "P(X > 1) = e^{−2·1} = e^{−2} ≈ 0.135。",
        },
        {
          id: "q5",
          type: "ordering",
          prompt: "把「Binomial → Poisson 極限」的推導重新排序。",
          steps: [
            { id: "s1", label: "寫出 Binomial PMF：C(n,k) p^k (1−p)^{n−k}" },
            { id: "s2", label: "代入 p = λ/n" },
            { id: "s3", label: "注意 C(n,k)/n^k → 1/k!（當 n → ∞）" },
            { id: "s4", label: "注意 (1 − λ/n)^n → e^{−λ}" },
            { id: "s5", label: "組合得到 e^{−λ} λ^k / k!" },
          ],
          explanation: "寫 PMF → 代換 → 化簡兩個因子 → 認出 Poisson。",
        },
      ],
      furtherReading: [
        { title: "Ross — A First Course in Probability, ch. 4 & 5" },
        { title: "Bertsekas & Tsitsiklis — Introduction to Probability, ch. 2 & 3" },
      ],
    },
  },
};

export default chapter;
