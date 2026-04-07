import { Chapter } from "../types";
import { M } from "@/components/math/Math";
import { FormulaBlock } from "@/components/math/FormulaBlock";
import { TheoremCard } from "@/components/math/TheoremCard";
import { ProofStepper } from "@/components/math/ProofStepper";
import { CISimulator } from "@/components/interactive/CISimulator";
import { SectionHeader } from "@/components/learning/SectionHeader";

const chapter: Chapter = {
  meta: {
    slug: "confidence-intervals",
    module: "E_estimation",
    number: 10,
    minutes: 35,
    level: 4,
    prereqs: ["central-limit-theorem", "maximum-likelihood-estimation"],
    tags: ["CI", "inference"],
  },
  localized: {
    en: {
      title: "Confidence Intervals",
      subtitle:
        "What a 95% interval really means — and the careful frequentist semantics that almost everyone gets wrong on the first try.",
      hook: "Confidence is a property of the procedure, not the interval. This subtle shift unlocks the whole frequentist worldview.",
      whyItMatters: (
        <>
          Point estimates are useful, but they hide their uncertainty. A
          confidence interval is the simplest tool that quantifies how much
          your estimate could be off, in a way that&apos;s frequency-calibrated.
          Used right, it&apos;s the bridge between &quot;the data say…&quot;
          and &quot;…and we should believe it to within ±X.&quot;
        </>
      ),
      intuition: (
        <>
          <p>
            You estimate a population mean from a sample and get{" "}
            <M>{`\\bar x = 7.3`}</M>. How much should you trust that number?
            The CLT says the sample mean is jiggling around the truth with
            standard deviation <M>{`\\sigma/\\sqrt{n}`}</M>. So an interval of
            roughly two standard errors on each side captures the truth most
            of the time.
          </p>
          <p>
            The subtle bit is what &quot;most of the time&quot; means. A 95%
            confidence interval is a <em>procedure</em> with the property that{" "}
            <em>before you see the data</em>, the random interval it produces
            will contain the true parameter 95% of the time. <em>After</em> you
            compute it, it&apos;s just a fixed pair of numbers — the truth is
            either in it or it isn&apos;t. There is no probability statement
            about that single interval.
          </p>
        </>
      ),
      formal: (
        <>
          <p>
            A <em>confidence interval at level <M>{`1-\\alpha`}</M></em> for a
            parameter <M>θ</M> is a pair of statistics{" "}
            <M>{`L(X), U(X)`}</M> with
          </p>
          <FormulaBlock
            formula={`P_\\theta\\!\\big(L(X) \\le \\theta \\le U(X)\\big) \\;\\ge\\; 1 - \\alpha \\quad \\forall\\, \\theta.`}
            question="Across hypothetical replications, how often does the random interval cover the true θ?"
          />
          <p>
            The probability is over the data <M>X</M>; <M>θ</M> is fixed. For
            the standard z-interval on a Normal mean with known <M>σ</M>:
          </p>
          <FormulaBlock formula={`\\bar X_n \\pm z_{1-\\alpha/2} \\cdot \\frac{\\sigma}{\\sqrt{n}}.`} />
          <p>
            When <M>σ</M> is unknown, we replace it with the sample standard
            deviation <M>s</M> and the z-quantile with the corresponding{" "}
            <M>{`t_{n-1}`}</M> quantile, giving the celebrated <em>t-interval</em>.
          </p>
        </>
      ),
      graduate: (
        <>
          <p>
            <strong>Pivotal method.</strong> Most CIs come from finding a{" "}
            <em>pivot</em>: a function of the data and parameter whose
            distribution does not depend on θ. For the Normal mean (σ known),{" "}
            <M>{`Z = (\\bar X - \\mu)/(\\sigma/\\sqrt n)`}</M> is{" "}
            <M>{`\\mathcal{N}(0,1)`}</M> regardless of μ — that&apos;s the
            pivot. Solving{" "}
            <M>{`-z_{1-\\alpha/2} \\le Z \\le z_{1-\\alpha/2}`}</M> for μ gives
            the CI.
          </p>
          <p>
            <strong>Approximate vs exact.</strong> The CLT-based interval is
            asymptotic: coverage approaches <M>{`1-\\alpha`}</M> as <M>n→∞</M>{" "}
            but is wrong for small <M>n</M>. The Wilson and Clopper–Pearson
            intervals are exact (or near-exact) finite-sample alternatives for
            binomial proportions; they outperform the naive Wald interval
            dramatically near 0 or 1.
          </p>
          <p>
            <strong>Inversion of tests ↔ duality with hypothesis testing.</strong>{" "}
            A <M>{`(1-\\alpha)`}</M> CI is exactly the set of parameter values{" "}
            <M>{`\\theta_0`}</M> that would <em>not</em> be rejected by a level-α
            test of <M>{`H_0:\\theta=\\theta_0`}</M>. Every test gives you a CI
            and vice versa — a fact that the frequentist edifice is built on.
          </p>
          <p>
            <strong>Frequentist vs Bayesian credible intervals.</strong> A 95%
            credible interval is a different beast: it&apos;s a posterior
            probability statement{" "}
            <M>{`P(\\theta \\in [L,U] \\mid \\text{data}) = 0.95`}</M>. They
            numerically coincide for many large-sample problems but conceptually
            differ — credible intervals talk about θ given the data; CIs talk
            about the procedure across hypothetical data.
          </p>
        </>
      ),
      body: (
        <>
          <SectionHeader step={1} title="Watch coverage in action" blurb="Each blue bar is a 95% interval that captured μ. Each rose bar missed. Empirical coverage approaches 95% as the number of intervals grows." />
          <CISimulator />

          <SectionHeader step={2} title="Construct one from scratch — the pivot trick" />
          <ProofStepper
            title="Z-interval for a Normal mean (σ known)"
            steps={[
              { title: "Identify the pivot.", math: "Z = \\frac{\\bar X_n - \\mu}{\\sigma/\\sqrt{n}} \\sim \\mathcal{N}(0,1)", reason: "Its distribution does not depend on μ — that is exactly what makes it a pivot." },
              { title: "Bound the pivot at level 1−α.", math: "P\\!\\left(-z_{1-\\alpha/2} \\le Z \\le z_{1-\\alpha/2}\\right) = 1-\\alpha" },
              { title: "Solve for μ inside the inequality.", math: "P\\!\\left(\\bar X_n - z_{1-\\alpha/2}\\frac{\\sigma}{\\sqrt n} \\le \\mu \\le \\bar X_n + z_{1-\\alpha/2}\\frac{\\sigma}{\\sqrt n}\\right) = 1-\\alpha" },
              { title: "Read off the interval.", math: "\\text{CI}_{1-\\alpha}(\\mu) = \\bar X_n \\pm z_{1-\\alpha/2}\\,\\frac{\\sigma}{\\sqrt n}" },
              { title: "Interpret carefully.", reason: "The probability statement is about Z (random), not about μ (fixed). After computing, the interval is just two numbers — μ is either in it or not." },
            ]}
          />

          <TheoremCard
            kind="proposition"
            name="Test–CI duality"
            statement={
              <>A two-sided level-α test of <M>{`H_0:\\theta=\\theta_0`}</M> rejects iff <M>{`\\theta_0`}</M> lies outside a corresponding (1−α) confidence interval, and vice versa.</>
            }
          >
            So every CI in this course is, secretly, a family of hypothesis
            tests. We exploit this in the next chapter.
          </TheoremCard>
        </>
      ),
      misconceptions: [
        {
          wrong: "There is a 95% probability the true mean lies in this specific interval.",
          right:
            "Not in the frequentist framework. Once computed, the interval is fixed; θ is fixed. Either it's in or it isn't. The 95% is a property of the procedure across hypothetical samples.",
        },
        {
          wrong: "Bigger CI is always more reliable.",
          right:
            "A wider interval has higher confidence at the cost of precision. A 100% CI is (-∞, ∞) — useless. The art is balancing width against confidence.",
        },
        {
          wrong: "If two CIs overlap, the means aren't significantly different.",
          right:
            "Overlapping CIs do NOT imply non-significance. A direct two-sample test or a CI for the difference is the right tool.",
        },
      ],
      takeaways: [
        "A CI is a frequency-calibrated random interval; the parameter is fixed.",
        "Construct CIs by finding a pivot, bounding it, and inverting back to the parameter.",
        "Test–CI duality: a CI is the set of parameter values that wouldn't be rejected by a level-α test.",
        "For proportions near 0 or 1, prefer Wilson or Clopper–Pearson over the Wald interval.",
        "Bayesian credible intervals are not the same object — they're answering a different question.",
      ],
      quiz: [
        {
          id: "q1",
          prompt: "Which statement is the correct frequentist interpretation of a 95% CI?",
          choices: [
            { id: "a", label: "There's a 95% chance μ lies in this interval." },
            { id: "b", label: "If we repeated the experiment, 95% of the produced intervals would cover μ." },
            { id: "c", label: "95% of the population lies in this interval." },
            { id: "d", label: "The point estimate is correct with 95% probability." },
          ],
          answer: "b",
          explanation:
            "Confidence is a property of the random procedure across many hypothetical replications.",
        },
        {
          id: "q2",
          prompt:
            "You quadruple your sample size. The width of a CLT-based CI for the mean changes by what factor?",
          choices: [
            { id: "a", label: "÷4" },
            { id: "b", label: "÷2" },
            { id: "c", label: "÷√4 = ÷2" },
            { id: "d", label: "Both (b) and (c)" },
          ],
          answer: "d",
          explanation:
            "Width is proportional to σ/√n, so 4× the sample size halves the width. (b) and (c) say the same thing.",
        },
        {
          id: "q3",
          prompt: "A 95% CI for μ excludes 0. What can you conclude about a two-sided test of H₀: μ = 0 at α = 0.05?",
          choices: [
            { id: "a", label: "Reject H₀." },
            { id: "b", label: "Fail to reject H₀." },
            { id: "c", label: "Need a separate p-value to decide." },
            { id: "d", label: "Cannot say without σ." },
          ],
          answer: "a",
          explanation:
            "By test–CI duality, the test rejects iff the corresponding CI excludes the null value.",
        },
      ],
      furtherReading: [
        { title: "Wasserman — All of Statistics, ch. 6 & 7" },
        { title: "Brown, Cai & DasGupta — 'Interval Estimation for a Binomial Proportion' (2001)" },
      ],
    },

    zh: {
      title: "信賴區間",
      subtitle:
        "「95% 信賴區間」到底是什麼意思 ── 以及那套大多數人第一次都搞錯的細膩頻率學派語意。",
      hook: "「信心」是程序的性質，不是區間的性質。理解這個微妙轉變，整個頻率學派的世界觀就會瞬間打開。",
      whyItMatters: (
        <>
          點估計很有用，但它隱藏了不確定性。信賴區間是用「頻率校準」的方式
          量化估計可能有多偏的最簡單工具。用得對，它就是「資料這樣說…」
          與「…我們應該相信到 ±X 的範圍」之間的橋。
        </>
      ),
      intuition: (
        <>
          <p>
            你從樣本估計母體平均，得到 <M>{`\\bar x = 7.3`}</M>。
            這個數字該信多少？CLT 告訴我們樣本平均在真值附近抖動，
            標準差為 <M>{`\\sigma/\\sqrt{n}`}</M>。
            所以「兩倍標準誤的兩側區間」大多時候會抓到真值。
          </p>
          <p>
            微妙的地方是「大多時候」是什麼意思。
            一個 95% 信賴區間是一個<em>程序</em>，
            這個程序的性質是：<em>在你還沒看資料之前</em>，
            它會產生一個隨機的區間，這個隨機區間有 95% 的機率包含真實的參數。
            一旦你<em>已經</em>把它算出來，它就只是兩個固定的數字 ──
            真值要麼在裡面、要麼不在。
            對「這個特定區間」我們沒有任何機率陳述。
          </p>
        </>
      ),
      formal: (
        <>
          <p>
            參數 <M>θ</M> 的<em>水準為 <M>{`1-\\alpha`}</M> 的信賴區間</em>，
            是一對統計量 <M>{`L(X), U(X)`}</M>，滿足：
          </p>
          <FormulaBlock
            formula={`P_\\theta\\!\\big(L(X) \\le \\theta \\le U(X)\\big) \\;\\ge\\; 1 - \\alpha \\quad \\forall\\, \\theta.`}
            question="在假想的重複實驗中，這個隨機區間覆蓋真實 θ 的頻率是多少？"
          />
          <p>
            機率是對資料 <M>X</M> 取的；<M>θ</M> 是固定的。
            對於已知 σ 的常態平均，標準的 z 區間為：
          </p>
          <FormulaBlock formula={`\\bar X_n \\pm z_{1-\\alpha/2} \\cdot \\frac{\\sigma}{\\sqrt{n}}.`} />
          <p>
            當 σ 未知時，我們用樣本標準差 <M>s</M> 取代它，
            並把 z 分位數換成對應的 <M>{`t_{n-1}`}</M> 分位數，
            就得到著名的 <em>t 區間</em>。
          </p>
        </>
      ),
      graduate: (
        <>
          <p>
            <strong>樞軸量法（pivotal method）。</strong>
            大部分 CI 都是先找一個<em>樞軸量</em>：
            一個由資料與參數構成、但分布不依賴 θ 的函數。
            對於已知 σ 的常態平均，
            <M>{`Z = (\\bar X - \\mu)/(\\sigma/\\sqrt n)`}</M>{" "}
            無論 μ 為何都是 <M>{`\\mathcal{N}(0,1)`}</M> ── 它就是樞軸量。
            把不等式 <M>{`-z_{1-\\alpha/2} \\le Z \\le z_{1-\\alpha/2}`}</M>{" "}
            對 μ 解出來，就得到 CI。
          </p>
          <p>
            <strong>近似 vs 精確。</strong>
            CLT-based 區間是「漸近的」：當 <M>n→∞</M> 時覆蓋率會趨近 <M>{`1-\\alpha`}</M>，
            但對小 <M>n</M> 並不正確。
            對於二項比例，Wilson 與 Clopper–Pearson 區間是有限樣本下精確（或近似精確）的替代方案；
            在 0 或 1 附近，它們大幅優於樸素的 Wald 區間。
          </p>
          <p>
            <strong>檢定 ↔ CI 的對偶性。</strong>
            一個 <M>{`(1-\\alpha)`}</M> CI 正好就是「不會被水準 α 的{" "}
            <M>{`H_0:\\theta=\\theta_0`}</M> 檢定拒絕的所有 <M>{`\\theta_0`}</M>」的集合。
            每一個檢定都對應一個 CI，反之亦然 ── 整個頻率學派的大廈就建在這個事實上。
          </p>
          <p>
            <strong>頻率學派 vs 貝氏可信區間。</strong>
            95% 可信區間是另一種東西：它是後驗機率的陳述{" "}
            <M>{`P(\\theta \\in [L,U] \\mid \\text{data}) = 0.95`}</M>。
            兩者在許多大樣本問題上數值會一致，但概念上不同 ──
            可信區間談的是「給定資料的 θ」；CI 談的是「跨假想資料的程序」。
          </p>
        </>
      ),
      body: (
        <>
          <SectionHeader step={1} title="親眼看覆蓋率運作" blurb="每條藍色橫條是一個成功覆蓋 μ 的 95% 區間；每條玫紅色橫條沒蓋到。當區間數量增加，經驗覆蓋率會逼近 95%。" />
          <CISimulator />

          <SectionHeader step={2} title="從零開始建一個 ── 樞軸量技巧" />
          <ProofStepper
            title="常態平均（σ 已知）的 Z 區間"
            steps={[
              { title: "辨認樞軸量。", math: "Z = \\frac{\\bar X_n - \\mu}{\\sigma/\\sqrt{n}} \\sim \\mathcal{N}(0,1)", reason: "它的分布不依賴 μ ── 這正是讓它成為樞軸量的原因。" },
              { title: "在水準 1−α 下界定樞軸量。", math: "P\\!\\left(-z_{1-\\alpha/2} \\le Z \\le z_{1-\\alpha/2}\\right) = 1-\\alpha" },
              { title: "在不等式內解出 μ。", math: "P\\!\\left(\\bar X_n - z_{1-\\alpha/2}\\frac{\\sigma}{\\sqrt n} \\le \\mu \\le \\bar X_n + z_{1-\\alpha/2}\\frac{\\sigma}{\\sqrt n}\\right) = 1-\\alpha" },
              { title: "讀出區間。", math: "\\text{CI}_{1-\\alpha}(\\mu) = \\bar X_n \\pm z_{1-\\alpha/2}\\,\\frac{\\sigma}{\\sqrt n}" },
              { title: "小心地詮釋。", reason: "這個機率陳述是對 Z（隨機）的，不是對 μ（固定）的。一旦算出來，區間就只是兩個數字 ── μ 要麼在裡面要麼不在。" },
            ]}
          />

          <TheoremCard
            kind="proposition"
            name="檢定 – CI 對偶性"
            statement={
              <>
                雙尾水準 α 的 <M>{`H_0:\\theta=\\theta_0`}</M> 檢定會拒絕，
                若且唯若 <M>{`\\theta_0`}</M> 不在對應的 (1−α) 信賴區間中；反之亦然。
              </>
            }
          >
            因此本課程裡的每個 CI 暗地裡都是一族假設檢定。下一章我們會利用這點。
          </TheoremCard>
        </>
      ),
      misconceptions: [
        {
          wrong: "這個特定區間有 95% 機率包含真實平均。",
          right:
            "在頻率學派下不是這樣。一旦算出來，區間是固定的、θ 也是固定的。它要麼在、要麼不在。95% 是「程序在假想樣本上的性質」。",
        },
        {
          wrong: "CI 越寬越可靠。",
          right:
            "更寬的區間有更高的信心水準，但精確度更差。100% CI 是 (-∞, ∞)，毫無用處。藝術在於平衡寬度與信心。",
        },
        {
          wrong: "兩個 CI 重疊，就代表平均沒有顯著差異。",
          right:
            "重疊的 CI 並不蘊含「不顯著」。要直接做雙樣本檢定，或對「差異」建一個 CI。",
        },
      ],
      takeaways: [
        "CI 是頻率校準的隨機區間；參數本身是固定的。",
        "用樞軸量、限制它、再反推出參數，就能建構 CI。",
        "檢定 – CI 對偶性：CI 就是「水準 α 檢定不會拒絕的所有參數值」的集合。",
        "對於接近 0 或 1 的比例，優先用 Wilson 或 Clopper–Pearson，而不是 Wald。",
        "貝氏可信區間不是同一個東西 ── 它們在回答不同的問題。",
      ],
      quiz: [
        {
          id: "q1",
          prompt: "下列哪一個是 95% CI 在頻率學派下的正確詮釋？",
          choices: [
            { id: "a", label: "μ 有 95% 機率落在這個區間。" },
            { id: "b", label: "若我們重複實驗，95% 的產生區間會包含 μ。" },
            { id: "c", label: "母體 95% 的人落在這個區間。" },
            { id: "d", label: "點估計有 95% 機率正確。" },
          ],
          answer: "b",
          explanation:
            "信心水準是「跨許多假想重複實驗的隨機程序」的性質。",
        },
        {
          id: "q2",
          prompt:
            "把樣本數變成 4 倍。CLT-based 平均 CI 的寬度變成原本的多少？",
          choices: [
            { id: "a", label: "÷4" },
            { id: "b", label: "÷2" },
            { id: "c", label: "÷√4 = ÷2" },
            { id: "d", label: "(b) 和 (c) 都對" },
          ],
          answer: "d",
          explanation:
            "寬度與 σ/√n 成正比，所以 4 倍樣本會讓寬度減半。(b) 和 (c) 在說同一件事。",
        },
        {
          id: "q3",
          prompt: "對 μ 的 95% CI 不包含 0。對 α = 0.05 下的雙尾 H₀: μ = 0 檢定可以做出什麼結論？",
          choices: [
            { id: "a", label: "拒絕 H₀。" },
            { id: "b", label: "未拒絕 H₀。" },
            { id: "c", label: "需要另外算一個 p 值才能決定。" },
            { id: "d", label: "沒有 σ 無法判斷。" },
          ],
          answer: "a",
          explanation:
            "由檢定 – CI 對偶性，檢定拒絕當且僅當對應的 CI 不包含虛無值。",
        },
      ],
      furtherReading: [
        { title: "Wasserman — All of Statistics, ch. 6 & 7" },
        { title: "Brown, Cai & DasGupta — 'Interval Estimation for a Binomial Proportion' (2001)" },
      ],
    },
  },
};

export default chapter;
