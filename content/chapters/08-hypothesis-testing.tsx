import { Chapter } from "../types";
import { M, MD } from "@/components/math/Math";
import { FormulaBlock } from "@/components/math/FormulaBlock";
import { TheoremCard } from "@/components/math/TheoremCard";
import { ProofStepper } from "@/components/math/ProofStepper";
import { HypothesisTestVisualizer } from "@/components/interactive/HypothesisTestVisualizer";
import { SectionHeader } from "@/components/learning/SectionHeader";

const chapter: Chapter = {
  meta: {
    slug: "hypothesis-testing",
    module: "F_testing",
    number: 11,
    minutes: 50,
    level: 4,
    prereqs: ["confidence-intervals"],
    tags: ["testing", "p-value", "power"],
  },
  localized: {
    en: {
      title: "Hypothesis Testing",
      subtitle:
        "Building decision rules under uncertainty: p-values, errors, power, and the Neyman–Pearson framework that makes them rigorous.",
      hook: "p-values are not the probability the null is true. Once you internalise what they actually are, the whole testing apparatus snaps into place.",
      whyItMatters: (
        <>
          Hypothesis testing is the formalised &quot;disprove the boring story&quot;
          ritual that underpins science, A/B tests, clinical trials, and audits.
          Understanding it deeply lets you separate signal from noise{" "}
          <em>and</em> avoid the pervasive misuses that have plagued empirical
          research.
        </>
      ),
      intuition: (
        <>
          <p>
            Suppose someone claims their drug has no effect (the boring story —
            the <em>null hypothesis</em> <M>{`H_0`}</M>). You run a trial,
            observe a difference, and ask: <em>if the drug really had no
            effect, how surprising would the data I saw be?</em>
          </p>
          <p>
            That &quot;how surprising&quot; question is exactly what a{" "}
            <em>p-value</em> measures. Small p-value → the boring story is a
            poor fit → you reject it. Large p-value → the boring story still
            plausibly explains the data → you don&apos;t reject (but you
            don&apos;t prove it true either).
          </p>
          <p>
            The whole machinery is just a disciplined version of this question,
            with carefully drawn lines so you can&apos;t cheat by squinting.
          </p>
        </>
      ),
      formal: (
        <>
          <p>
            Specify a <em>null</em> <M>{`H_0`}</M> and an <em>alternative</em>{" "}
            <M>{`H_1`}</M>. Choose a <em>test statistic</em>{" "}
            <M>{`T(X)`}</M> whose distribution under <M>{`H_0`}</M> is known
            (call it the <em>null distribution</em>). Pick a{" "}
            <em>significance level</em> <M>{`\\alpha`}</M> (usually 0.05) and a{" "}
            <em>rejection region</em> <M>{`R`}</M> with{" "}
            <M>{`P_{H_0}(T \\in R) = \\alpha`}</M>. Reject <M>{`H_0`}</M> when
            your observed <M>{`T(x_{\\text{obs}}) \\in R`}</M>.
          </p>
          <FormulaBlock
            formula={`p\\text{-value} \\;=\\; P_{H_0}\\!\\big(T(X) \\text{ at least as extreme as } T(x_{\\text{obs}})\\big)`}
            question="If H₀ is true, how often would I see data this extreme or more?"
          />
          <p>The four possible outcomes:</p>
          <div className="my-3 overflow-x-auto rounded-xl border border-bg-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-bg-border bg-bg-soft text-ink-dim">
                  <th className="px-3 py-2 text-left"></th>
                  <th className="px-3 py-2 text-left">H₀ true</th>
                  <th className="px-3 py-2 text-left">H₁ true</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-bg-border">
                  <td className="px-3 py-2 text-ink-dim">Reject H₀</td>
                  <td className="px-3 py-2 text-accent-rose">Type I error (α)</td>
                  <td className="px-3 py-2 text-accent-green">Power (1−β)</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 text-ink-dim">Fail to reject</td>
                  <td className="px-3 py-2 text-ink">Correct (1−α)</td>
                  <td className="px-3 py-2 text-accent-amber">Type II error (β)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      ),
      graduate: (
        <>
          <p>
            <strong>Neyman–Pearson lemma.</strong> For testing two simple
            hypotheses <M>{`H_0:\\theta=\\theta_0`}</M> versus{" "}
            <M>{`H_1:\\theta=\\theta_1`}</M>, the most powerful level-α test
            rejects when the likelihood ratio is large:
          </p>
          <FormulaBlock
            formula={`\\Lambda(x) = \\frac{f(x;\\theta_1)}{f(x;\\theta_0)} > k_\\alpha,`}
            question="What rejection region maximises power for a fixed false-positive rate?"
          />
          <p>
            where <M>{`k_\\alpha`}</M> is chosen to give exactly{" "}
            <M>{`P_{H_0}(\\Lambda > k_\\alpha) = \\alpha`}</M>. Many classical
            tests (t-test, chi-square, F-test) are likelihood-ratio tests in
            disguise.
          </p>
          <p>
            <strong>Wilks&apos; theorem.</strong> Under regularity conditions,
            for nested models with d degrees of freedom difference,{" "}
            <M>{`-2\\log \\Lambda \\xrightarrow{d} \\chi^2_d`}</M> as <M>n→∞</M>.
            This gives an asymptotic null distribution for the likelihood ratio
            and is the engine behind generalised LR tests.
          </p>
          <p>
            <strong>Multiple testing.</strong> If you run <M>m</M> independent
            tests at level α, the chance of at least one false rejection is{" "}
            <M>{`1-(1-\\alpha)^m`}</M>, which explodes quickly. The two main
            corrections: (i) Bonferroni — control family-wise error by using
            α/m per test; (ii) Benjamini–Hochberg — control the false discovery
            rate, a more powerful approach for genomics-scale problems.
          </p>
          <p>
            <strong>What a p-value is NOT.</strong> Not the probability that{" "}
            <M>{`H_0`}</M> is true. Not the probability of the observed data.
            Not the probability that the result was &quot;due to chance&quot;
            (this phrase is meaningless). It is purely{" "}
            <M>{`P_{H_0}(T \\ge t_{\\text{obs}})`}</M>.
          </p>
        </>
      ),
      body: (
        <>
          <SectionHeader step={1} title="See α, β, and power as one picture" blurb="Two distributions: blue under H₀, green under H₁. The dashed lines mark the rejection region. Drag them and watch the trade-off." />
          <HypothesisTestVisualizer />

          <SectionHeader step={2} title="Worked example: one-sample z-test" />
          <p className="text-ink-dim leading-relaxed">
            Suppose you suspect a biased coin. Out of 100 flips, you see 60
            heads. Test <M>{`H_0: p=0.5`}</M> against{" "}
            <M>{`H_1: p\\ne 0.5`}</M>.
          </p>
          <ProofStepper
            title="Two-sided z-test for a proportion"
            steps={[
              { title: "Compute the test statistic.", math: "Z = \\frac{\\hat p - p_0}{\\sqrt{p_0(1-p_0)/n}} = \\frac{0.6 - 0.5}{\\sqrt{0.25/100}} = 2.0" },
              { title: "Find the two-sided p-value under H₀.", math: "p\\text{-value} = 2 P(Z \\ge 2.0) \\approx 2(0.0228) = 0.0456" },
              { title: "Compare to α = 0.05.", reason: "0.0456 < 0.05 ⇒ reject H₀ at the 5% level." },
              { title: "Interpret with care.", reason: "We are NOT saying 'P(coin is fair) = 0.0456'. We are saying: if the coin were fair, getting at least this lopsided a result would happen ~4.6% of the time. That's rare enough to make us doubt fairness — at our chosen tolerance." },
            ]}
          />

          <TheoremCard
            kind="theorem"
            name="Neyman–Pearson lemma"
            statement={
              <>
                For testing simple <M>{`H_0`}</M> vs simple <M>{`H_1`}</M>, the
                likelihood-ratio test
                <MD>{`\\phi^*(x) = \\mathbb{1}\\!\\left\\{\\frac{f(x;\\theta_1)}{f(x;\\theta_0)} > k\\right\\}`}</MD>
                is uniformly most powerful at any level α it achieves.
              </>
            }
          >
            Intuition: if you only have a fixed budget of false positives to
            spend, the best place to spend them is on the data points that
            discriminate most strongly between the two hypotheses — and the
            likelihood ratio measures exactly that.
          </TheoremCard>

          <SectionHeader step={3} title="Power and sample size" />
          <p className="text-ink-dim leading-relaxed">
            Power is the probability of detecting a real effect of a given
            size. For a one-sided z-test of <M>{`H_0:\\mu=\\mu_0`}</M> against{" "}
            <M>{`H_1:\\mu=\\mu_1>\\mu_0`}</M> at level α, the power is:
          </p>
          <FormulaBlock
            formula={`\\text{Power} \\;=\\; \\Phi\\!\\left(\\frac{\\mu_1 - \\mu_0}{\\sigma/\\sqrt n} - z_{1-\\alpha}\\right)`}
          />
          <p className="text-ink-dim leading-relaxed">
            Three knobs: (i) effect size{" "}
            <M>{`(\\mu_1 - \\mu_0)/\\sigma`}</M>, (ii) sample size <M>n</M>,
            (iii) significance level α. Power calculations let you choose the
            smallest <M>n</M> that achieves a target power for a meaningful
            effect — and they are how you avoid running underpowered studies
            that can&apos;t learn anything.
          </p>
        </>
      ),
      misconceptions: [
        {
          wrong: "p < 0.05 means there is a 95% chance the effect is real.",
          right:
            "The p-value is P(data this extreme | H₀). It says nothing about P(H₀ | data) without a prior. The two are related by Bayes' theorem, not equal.",
          why: "This is the most common — and most consequential — misuse in published science.",
        },
        {
          wrong: "Failing to reject H₀ means H₀ is true.",
          right:
            "It means you don't have enough evidence to reject H₀. Absence of evidence is not evidence of absence — especially in underpowered studies.",
        },
        {
          wrong: "A small p-value means a large effect.",
          right:
            "It means a small probability of seeing such data under H₀. With huge n, even tiny effects yield tiny p-values. Always report effect sizes alongside p-values.",
        },
      ],
      takeaways: [
        "Tests are decision rules: pick α, choose a test statistic, compute its null distribution, decide.",
        "Type I = false alarm (controlled at α). Type II = miss (β). Power = 1 − β.",
        "Power depends on effect size, sample size, and α — three knobs you can trade off.",
        "Likelihood-ratio tests are optimal for simple-vs-simple hypotheses (Neyman–Pearson) and asymptotically χ² (Wilks).",
        "p-values are NOT P(H₀ | data) and never have been.",
      ],
      quiz: [
        {
          id: "q1",
          prompt: "A test rejects H₀ when p < 0.05. The 0.05 controls...",
          choices: [
            { id: "a", label: "P(H₀ true | reject)" },
            { id: "b", label: "P(reject | H₀ true)" },
            { id: "c", label: "P(reject | H₀ false)" },
            { id: "d", label: "P(H₁ true | reject)" },
          ],
          answer: "b",
          explanation:
            "α = P(reject H₀ | H₀ true) = type I error rate. Posterior probabilities require a prior — they're not what α is.",
        },
        {
          id: "q2",
          prompt:
            "You quadruple your sample size, holding everything else fixed. The standard error of the test statistic and the power change how?",
          choices: [
            { id: "a", label: "SE halves; power increases" },
            { id: "b", label: "SE quarters; power decreases" },
            { id: "c", label: "SE unchanged; power doubles" },
            { id: "d", label: "SE doubles; power decreases" },
          ],
          answer: "a",
          explanation:
            "SE ∝ 1/√n, so 4× n halves the SE. The same effect size becomes more 'visible', which increases power.",
        },
        {
          id: "q3",
          prompt:
            "You run 20 independent tests at α = 0.05. The probability of at least one false positive under all-true nulls is approximately...",
          choices: [
            { id: "a", label: "0.05" },
            { id: "b", label: "0.20" },
            { id: "c", label: "0.36" },
            { id: "d", label: "0.64" },
          ],
          answer: "d",
          explanation:
            "1 − (1 − 0.05)^20 ≈ 1 − 0.358 ≈ 0.642. Without correction, multiple testing makes false positives almost certain.",
        },
      ],
      furtherReading: [
        { title: "Lehmann & Romano — Testing Statistical Hypotheses" },
        { title: "Wasserman — All of Statistics, ch. 10 & 11" },
        { title: "ASA Statement on p-values (Wasserstein & Lazar, 2016)" },
      ],
    },

    zh: {
      title: "假設檢定",
      subtitle:
        "在不確定下建構決策規則：p 值、誤差、檢定力，以及讓這一切變得嚴謹的 Neyman–Pearson 框架。",
      hook: "p 值不是「虛無假設為真的機率」。一旦你內化它「真正是什麼」，整套檢定機器就會瞬間就位。",
      whyItMatters: (
        <>
          假設檢定是「反證掉那個無聊故事」的形式化儀式，
          科學、A/B 測試、臨床試驗與稽核都建立在它之上。
          深入理解它，能讓你把訊號從雜訊中分離出來，
          <em>並且</em>避開長期困擾實證研究的那些誤用。
        </>
      ),
      intuition: (
        <>
          <p>
            假設有人主張他的藥沒有效果（無聊的故事 ──{" "}
            <em>虛無假設</em> <M>{`H_0`}</M>）。
            你跑了一個試驗，看到一個差異，然後問：
            <em>如果這個藥真的沒有效果，我看到的這份資料會有多令人意外？</em>
          </p>
          <p>
            這個「有多意外」的問題，就是 <em>p 值</em>在量化的東西。
            p 值小 → 無聊故事跟資料合不來 → 你拒絕它。
            p 值大 → 無聊故事仍能合理地解釋資料 → 你不拒絕
            （但這也並沒有「證明」它為真）。
          </p>
          <p>
            整套機器只是這個問題的「有紀律版本」，
            把線畫得很仔細，這樣你就不能用瞇眼視之來作弊。
          </p>
        </>
      ),
      formal: (
        <>
          <p>
            指定一個<em>虛無</em> <M>{`H_0`}</M> 與一個<em>對立</em>{" "}
            <M>{`H_1`}</M>。挑一個<em>檢定統計量</em>{" "}
            <M>{`T(X)`}</M>，它在 <M>{`H_0`}</M> 下的分布是已知的
            （稱為<em>虛無分布</em>）。
            選一個<em>顯著水準</em> <M>{`\\alpha`}</M>（通常是 0.05），
            並選一個<em>拒絕區</em> <M>{`R`}</M>，
            滿足 <M>{`P_{H_0}(T \\in R) = \\alpha`}</M>。
            當觀察到的 <M>{`T(x_{\\text{obs}}) \\in R`}</M> 時拒絕 <M>{`H_0`}</M>。
          </p>
          <FormulaBlock
            formula={`p\\text{-value} \\;=\\; P_{H_0}\\!\\big(T(X) \\text{ 至少跟 } T(x_{\\text{obs}}) \\text{ 一樣極端}\\big)`}
            question="若 H₀ 為真，我看到「至少這麼極端」的資料的頻率是多少？"
          />
          <p>四種可能的結果：</p>
          <div className="my-3 overflow-x-auto rounded-xl border border-bg-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-bg-border bg-bg-soft text-ink-dim">
                  <th className="px-3 py-2 text-left"></th>
                  <th className="px-3 py-2 text-left">H₀ 為真</th>
                  <th className="px-3 py-2 text-left">H₁ 為真</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-bg-border">
                  <td className="px-3 py-2 text-ink-dim">拒絕 H₀</td>
                  <td className="px-3 py-2 text-accent-rose">第一型誤差 (α)</td>
                  <td className="px-3 py-2 text-accent-green">檢定力 (1−β)</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 text-ink-dim">不拒絕</td>
                  <td className="px-3 py-2 text-ink">正確 (1−α)</td>
                  <td className="px-3 py-2 text-accent-amber">第二型誤差 (β)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      ),
      graduate: (
        <>
          <p>
            <strong>Neyman–Pearson 引理。</strong>
            對於檢定兩個簡單假設 <M>{`H_0:\\theta=\\theta_0`}</M> 對{" "}
            <M>{`H_1:\\theta=\\theta_1`}</M>，
            水準 α 下檢定力最大的檢定，
            是當概似比夠大時就拒絕：
          </p>
          <FormulaBlock
            formula={`\\Lambda(x) = \\frac{f(x;\\theta_1)}{f(x;\\theta_0)} > k_\\alpha,`}
            question="在固定型一誤差下，哪個拒絕區能最大化檢定力？"
          />
          <p>
            其中 <M>{`k_\\alpha`}</M> 被選擇以使{" "}
            <M>{`P_{H_0}(\\Lambda > k_\\alpha) = \\alpha`}</M>。
            許多古典檢定（t、χ²、F）其實都是換了名字的概似比檢定。
          </p>
          <p>
            <strong>Wilks 定理。</strong>
            在規則條件下，對於自由度差為 d 的巢狀模型，
            <M>{`-2\\log \\Lambda \\xrightarrow{d} \\chi^2_d`}</M> 當 <M>n→∞</M>。
            這給了概似比一個漸近虛無分布，也是廣義 LR 檢定的引擎。
          </p>
          <p>
            <strong>多重檢定。</strong>
            如果你跑 <M>m</M> 個獨立的水準 α 檢定，
            至少出現一次假陽性的機率是{" "}
            <M>{`1-(1-\\alpha)^m`}</M>，這個數字會迅速爆炸。
            兩種主要修正法：(i) Bonferroni ── 用 α/m 控制 family-wise error；
            (ii) Benjamini–Hochberg ── 控制 false discovery rate，
            在基因體規模問題上更有檢定力。
          </p>
          <p>
            <strong>p 值「不是」什麼。</strong>
            不是 <M>{`H_0`}</M> 為真的機率。
            不是觀察資料的機率。
            也不是「結果是隨機造成的」的機率（這個句子根本沒意義）。
            它純粹就是 <M>{`P_{H_0}(T \\ge t_{\\text{obs}})`}</M>。
          </p>
        </>
      ),
      body: (
        <>
          <SectionHeader step={1} title="把 α、β 與檢定力看成同一張圖" blurb="兩個分布：藍色是 H₀ 下的、綠色是 H₁ 下的。虛線標出拒絕區。拖動它們，看權衡如何發生。" />
          <HypothesisTestVisualizer />

          <SectionHeader step={2} title="工作範例：單樣本 z 檢定" />
          <p className="text-ink-dim leading-relaxed">
            假設你懷疑一枚硬幣有偏。100 次拋擲中你看到 60 次正面。
            檢定 <M>{`H_0: p=0.5`}</M> 對 <M>{`H_1: p\\ne 0.5`}</M>。
          </p>
          <ProofStepper
            title="比例的雙尾 z 檢定"
            steps={[
              { title: "計算檢定統計量。", math: "Z = \\frac{\\hat p - p_0}{\\sqrt{p_0(1-p_0)/n}} = \\frac{0.6 - 0.5}{\\sqrt{0.25/100}} = 2.0" },
              { title: "在 H₀ 下計算雙尾 p 值。", math: "p\\text{-value} = 2 P(Z \\ge 2.0) \\approx 2(0.0228) = 0.0456" },
              { title: "與 α = 0.05 比較。", reason: "0.0456 < 0.05 ⇒ 在 5% 水準下拒絕 H₀。" },
              { title: "小心地詮釋。", reason: "我們「不」是在說『P(硬幣公平) = 0.0456』。我們是在說：若硬幣真的公平，看到至少這麼極端的結果的頻率約為 4.6%。這稀有到足以讓我們在自己選的容忍度下開始懷疑公平性。" },
            ]}
          />

          <TheoremCard
            kind="theorem"
            name="Neyman–Pearson 引理"
            statement={
              <>
                對於檢定簡單 <M>{`H_0`}</M> 對簡單 <M>{`H_1`}</M>，
                概似比檢定
                <MD>{`\\phi^*(x) = \\mathbb{1}\\!\\left\\{\\frac{f(x;\\theta_1)}{f(x;\\theta_0)} > k\\right\\}`}</MD>
                在它所達成的任何水準 α 下，都是「均勻最強」的（uniformly most powerful）。
              </>
            }
          >
            直覺：如果你只有固定的「假陽性預算」可以花，
            最好的花法就是把它花在「最能區分兩個假設」的資料點上 ──
            而概似比正好衡量了這件事。
          </TheoremCard>

          <SectionHeader step={3} title="檢定力與樣本數" />
          <p className="text-ink-dim leading-relaxed">
            檢定力是「在效應確實存在且為某個大小時，能偵測到它」的機率。
            對於水準 α 下的單尾 z 檢定 <M>{`H_0:\\mu=\\mu_0`}</M> vs{" "}
            <M>{`H_1:\\mu=\\mu_1>\\mu_0`}</M>，檢定力為：
          </p>
          <FormulaBlock
            formula={`\\text{Power} \\;=\\; \\Phi\\!\\left(\\frac{\\mu_1 - \\mu_0}{\\sigma/\\sqrt n} - z_{1-\\alpha}\\right)`}
          />
          <p className="text-ink-dim leading-relaxed">
            三個旋鈕：(i) 效應大小{" "}
            <M>{`(\\mu_1 - \\mu_0)/\\sigma`}</M>，
            (ii) 樣本數 <M>n</M>，
            (iii) 顯著水準 α。
            檢定力計算讓你能挑出「能偵測到有意義效應的最小 n」 ──
            這是你避免做出「跑了等於沒跑」的低檢定力研究的方式。
          </p>
        </>
      ),
      misconceptions: [
        {
          wrong: "p < 0.05 表示效應是真的有 95% 機率。",
          right:
            "p 值是 P(資料這麼極端 | H₀)。沒有先驗的話，它對 P(H₀ | 資料) 完全沒說。兩者由貝氏定理連結，不是相等。",
          why: "這是已發表科學裡最常見、也是後果最嚴重的誤用。",
        },
        {
          wrong: "未拒絕 H₀ 就代表 H₀ 為真。",
          right:
            "它代表你「沒有足夠證據去拒絕 H₀」。沒看到證據不等於「沒有存在的證據」 ── 特別是在低檢定力的研究中。",
        },
        {
          wrong: "p 值很小代表效應很大。",
          right:
            "它代表「在 H₀ 下看到這種資料的機率很小」。當 n 很大時，即使是極小的效應也會產生很小的 p 值。永遠把效應大小和 p 值一起報告。",
        },
      ],
      takeaways: [
        "檢定是決策規則：選 α、選檢定統計量、算虛無分布、做決定。",
        "第一型 = 假警報（被 α 控制）。第二型 = 漏報（β）。檢定力 = 1 − β。",
        "檢定力取決於效應大小、樣本數與 α ── 三個你可以彼此權衡的旋鈕。",
        "概似比檢定對於簡單對簡單假設是最佳的（Neyman–Pearson），且漸近上服從 χ²（Wilks）。",
        "p 值「不是」P(H₀ | 資料)，從來都不是。",
      ],
      quiz: [
        {
          id: "q1",
          prompt: "一個檢定當 p < 0.05 時拒絕 H₀。這個 0.05 控制的是？",
          choices: [
            { id: "a", label: "P(H₀ 為真 | 拒絕)" },
            { id: "b", label: "P(拒絕 | H₀ 為真)" },
            { id: "c", label: "P(拒絕 | H₀ 為假)" },
            { id: "d", label: "P(H₁ 為真 | 拒絕)" },
          ],
          answer: "b",
          explanation:
            "α = P(拒絕 H₀ | H₀ 為真) = 第一型誤差率。後驗機率需要先驗 ── 那不是 α。",
        },
        {
          id: "q2",
          prompt:
            "其他條件不變，把樣本數變成 4 倍。檢定統計量的標準誤與檢定力如何變化？",
          choices: [
            { id: "a", label: "SE 變一半；檢定力上升" },
            { id: "b", label: "SE 變四分之一；檢定力下降" },
            { id: "c", label: "SE 不變；檢定力變兩倍" },
            { id: "d", label: "SE 變兩倍；檢定力下降" },
          ],
          answer: "a",
          explanation:
            "SE ∝ 1/√n，所以 4 倍 n 會讓 SE 變成一半。同樣的效應大小變得「更明顯」，檢定力上升。",
        },
        {
          id: "q3",
          prompt:
            "你在 α = 0.05 下跑 20 個獨立檢定。在所有虛無都為真時，至少出現一次假陽性的機率約為？",
          choices: [
            { id: "a", label: "0.05" },
            { id: "b", label: "0.20" },
            { id: "c", label: "0.36" },
            { id: "d", label: "0.64" },
          ],
          answer: "d",
          explanation:
            "1 − (1 − 0.05)²⁰ ≈ 1 − 0.358 ≈ 0.642。如果不做修正，多重檢定會讓假陽性幾乎變成必然。",
        },
      ],
      furtherReading: [
        { title: "Lehmann & Romano — Testing Statistical Hypotheses" },
        { title: "Wasserman — All of Statistics, ch. 10 & 11" },
        { title: "ASA Statement on p-values (Wasserstein & Lazar, 2016)" },
      ],
    },
  },
};

export default chapter;
