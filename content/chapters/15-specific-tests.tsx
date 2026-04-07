import { Chapter } from "../types";
import { M } from "@/components/math/Math";
import { FormulaBlock } from "@/components/math/FormulaBlock";
import { TheoremCard } from "@/components/math/TheoremCard";
import { ProofStepper } from "@/components/math/ProofStepper";
import { SectionHeader } from "@/components/learning/SectionHeader";

const chapter: Chapter = {
  meta: {
    slug: "z-t-chi-square-tests",
    module: "F_testing",
    number: 15,
    minutes: 40,
    level: 3,
    prereqs: ["hypothesis-testing"],
    tags: ["z-test", "t-test", "chi-square"],
  },
  localized: {
    en: {
      title: "Specific Tests: z, t, and χ²",
      subtitle:
        "The three workhorses of classical testing. Each one is a Neyman–Pearson special case dressed up for a different question, and the three together cover most introductory practice.",
      hook: "When σ is known you use z. When σ is unknown you use t. When you're testing variances or counts you use χ². That's it.",
      whyItMatters: (
        <>
          90% of classical tests in undergraduate textbooks, in clinical
          trials, in A/B tests, and in social-science papers are one of
          three procedures: z, t, or χ². Each is a worked example of the
          general framework you saw in the hypothesis-testing chapter, and
          knowing them by heart turns &quot;which test do I use?&quot; into
          a 5-second decision instead of a 30-minute panic.
        </>
      ),
      intuition: (
        <>
          <p>
            Three questions, three statistics:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 mt-2">
            <li>
              <strong>z-test</strong>: &quot;Is the mean of my Normal data
              equal to <M>{`\\mu_0`}</M>?&quot; — when <M>{`\\sigma`}</M>{" "}
              is known. Standardise the sample mean by{" "}
              <M>{`\\sigma/\\sqrt n`}</M>; under <M>{`H_0`}</M> it&apos;s a
              standard Normal.
            </li>
            <li>
              <strong>t-test</strong>: same question, but{" "}
              <M>{`\\sigma`}</M> is unknown. Standardise by{" "}
              <M>{`s/\\sqrt n`}</M>; under <M>{`H_0`}</M> the resulting
              ratio is a Student t with <M>{`n-1`}</M> degrees of freedom.
            </li>
            <li>
              <strong>χ²-test</strong>: &quot;Do my count data fit the
              expected proportions?&quot; (goodness-of-fit) or &quot;Is the
              variance equal to <M>{`\\sigma_0^2`}</M>?&quot;. Test
              statistic is a sum of squared standardised deviations; under{" "}
              <M>{`H_0`}</M> it&apos;s χ² with appropriate degrees of
              freedom.
            </li>
          </ul>
          <p>
            All three are special cases of likelihood-ratio testing. They
            just look different because each one solves for the test
            statistic in closed form.
          </p>
        </>
      ),
      formal: (
        <>
          <p>
            <strong>One-sample z-test</strong> (mean of Normal, σ known).
            Test <M>{`H_0: \\mu = \\mu_0`}</M>:
          </p>
          <FormulaBlock
            formula={`Z = \\frac{\\bar X - \\mu_0}{\\sigma/\\sqrt n} \\sim \\mathcal{N}(0, 1) \\text{ under } H_0.`}
          />
          <p>
            <strong>One-sample t-test</strong> (mean of Normal, σ unknown).
            Replace σ with the sample standard deviation:
          </p>
          <FormulaBlock
            formula={`T = \\frac{\\bar X - \\mu_0}{s/\\sqrt n} \\sim t_{n-1} \\text{ under } H_0.`}
          />
          <p>
            <strong>Two-sample t-test</strong> (equal variances). For
            independent samples <M>{`\\bar X_1, \\bar X_2`}</M> with sizes{" "}
            <M>{`n_1, n_2`}</M>:
          </p>
          <FormulaBlock
            formula={`T = \\frac{\\bar X_1 - \\bar X_2}{s_p \\sqrt{\\frac{1}{n_1} + \\frac{1}{n_2}}}, \\quad s_p^2 = \\frac{(n_1-1)s_1^2 + (n_2-1)s_2^2}{n_1 + n_2 - 2}`}
          />
          <p>
            with <M>{`n_1 + n_2 - 2`}</M> degrees of freedom under{" "}
            <M>{`H_0: \\mu_1 = \\mu_2`}</M>.
          </p>
          <p>
            <strong>χ² goodness-of-fit test</strong>. Observed counts{" "}
            <M>{`O_1, \\dots, O_k`}</M> in <M>k</M> categories, expected
            counts <M>{`E_1, \\dots, E_k`}</M> under the null:
          </p>
          <FormulaBlock
            formula={`\\chi^2 = \\sum_{i=1}^k \\frac{(O_i - E_i)^2}{E_i} \\sim \\chi^2_{k - 1 - p} \\text{ under } H_0,`}
            question="How well does the data fit the model's expected counts?"
          />
          <p>
            where <M>p</M> is the number of parameters estimated from the
            data. Reject for large <M>{`\\chi^2`}</M> values.
          </p>
        </>
      ),
      graduate: (
        <>
          <p>
            <strong>The χ² statistic is a Pearson approximation to the
            multinomial likelihood ratio.</strong> For multinomial data with
            true probabilities <M>{`p_i`}</M>, the log-likelihood ratio is
          </p>
          <FormulaBlock
            formula={`-2 \\log \\Lambda = 2 \\sum_i O_i \\log\\!\\left(\\frac{O_i}{E_i}\\right)`}
          />
          <p>
            (the &quot;G-test&quot; statistic, also called{" "}
            <M>{`G^2`}</M>). A second-order Taylor expansion around{" "}
            <M>{`O_i = E_i`}</M> gives Pearson&apos;s{" "}
            <M>{`\\chi^2`}</M>. Both converge to the same{" "}
            <M>{`\\chi^2_{k-1-p}`}</M> distribution by Wilks&apos; theorem,
            but G has slightly better small-sample behaviour.
          </p>
          <p>
            <strong>Welch&apos;s correction.</strong> The two-sample t-test
            with pooled variance assumes equal population variances. When
            this is suspect, use <em>Welch&apos;s t-test</em>: same
            statistic but with separate variance estimates and the
            Satterthwaite degrees of freedom
          </p>
          <FormulaBlock
            formula={`\\nu = \\frac{(s_1^2/n_1 + s_2^2/n_2)^2}{(s_1^2/n_1)^2/(n_1-1) + (s_2^2/n_2)^2/(n_2-1)}`}
          />
          <p>
            which is generally non-integer but treated as a continuous
            df parameter. Welch is the safer default — most modern
            software (R, scipy) uses Welch by default for two-sample t.
          </p>
          <p>
            <strong>Why χ² needs E ≥ 5.</strong> The χ² approximation
            relies on the multinomial counts being approximately Normal,
            which fails when expected cell counts are too small. The
            classical rule is <M>{`E_i \\ge 5`}</M> for every cell.
            Alternatives: collapse rare cells, use a Fisher exact test,
            or use the G-test which is slightly more robust for sparse
            tables.
          </p>
          <p>
            <strong>Common misuse.</strong> Running a one-sample t-test on
            highly skewed data with small n. The CLT-based asymptotic
            argument needs <em>much</em> larger n for skewed distributions.
            For small skewed samples, use a sign test, a permutation
            test, or a transform.
          </p>
        </>
      ),
      body: (
        <>
          <SectionHeader step={1} title="Worked example: one-sample t-test" />
          <p className="text-ink-dim leading-relaxed">
            A company claims their batteries last 100 hours on average. You
            sample 16 batteries and observe a sample mean of 96 hours with
            sample standard deviation 8 hours. Test{" "}
            <M>{`H_0: \\mu = 100`}</M> against{" "}
            <M>{`H_1: \\mu \\ne 100`}</M> at <M>α = 0.05</M>.
          </p>
          <ProofStepper
            title="Battery example"
            steps={[
              { title: "Compute the test statistic.", math: "T = \\frac{\\bar x - \\mu_0}{s/\\sqrt n} = \\frac{96 - 100}{8/\\sqrt{16}} = -2.0" },
              { title: "Find the critical value.", math: "t_{0.025, 15} \\approx 2.131", reason: "Two-sided 95% CI for t with 15 df." },
              { title: "Compare.", reason: "|T| = 2.0 < 2.131, so we fail to reject H₀ at the 5% level. The data are consistent with the company's claim — but barely." },
              { title: "Compute the two-sided p-value.", math: "p = 2 P(T_{15} > 2.0) \\approx 0.064", reason: "Just above 0.05; with a slightly larger n, you'd reject. This is a powerful argument for reporting effect sizes and CIs alongside p-values." },
            ]}
          />

          <SectionHeader step={2} title="Worked example: χ² goodness-of-fit" />
          <p className="text-ink-dim leading-relaxed">
            A 4-sided die (k = 4) is rolled 100 times. Observed counts:
            22, 28, 19, 31. If the die is fair, expected counts are 25
            each. Test fairness.
          </p>
          <ProofStepper
            title="Fair die test"
            steps={[
              { title: "Compute the χ² statistic.", math: "\\chi^2 = \\sum \\frac{(O_i - E_i)^2}{E_i} = \\frac{9 + 9 + 36 + 36}{25} = \\frac{90}{25} = 3.6" },
              { title: "Degrees of freedom.", math: "k - 1 - p = 4 - 1 - 0 = 3", reason: "k=4 categories, no parameters estimated from the data." },
              { title: "Critical value.", math: "\\chi^2_{0.05, 3} \\approx 7.815", reason: "Upper 5% quantile of χ² with 3 df." },
              { title: "Compare.", reason: "3.6 < 7.815, fail to reject. The deviations from 25 are within what we'd expect from a fair die in 100 rolls." },
            ]}
          />

          <TheoremCard
            kind="theorem"
            name="t-statistic distribution"
            statement={
              <>
                If <M>{`X_1, \\dots, X_n \\sim \\mathcal{N}(\\mu, \\sigma^2)`}</M>{" "}
                are i.i.d., then
              </>
            }
            formula={`T = \\frac{\\bar X - \\mu}{S/\\sqrt n} \\sim t_{n-1},`}
          >
            where <M>{`t_{n-1}`}</M> denotes Student&apos;s t with{" "}
            <M>{`n-1`}</M> degrees of freedom. The independence of{" "}
            <M>{`\\bar X`}</M> and <M>{`S^2`}</M> under Normality is what
            makes this exact.
          </TheoremCard>
        </>
      ),
      misconceptions: [
        {
          wrong: "z and t are interchangeable for large n.",
          right:
            "They are asymptotically equivalent, but using z when σ is unknown systematically understates uncertainty for small n. Use t whenever you estimate σ from the data, regardless of n.",
        },
        {
          wrong: "χ² works for any cell counts.",
          right:
            "The χ² approximation requires expected counts of at least ~5 per cell. For sparser tables, use Fisher's exact test or pool cells.",
        },
        {
          wrong: "Equal variance is a safe default for two-sample t.",
          right:
            "Welch's t-test (separate variances) is almost always safer and is the modern default. The pooled-variance version is a historical artifact.",
        },
      ],
      takeaways: [
        "z-test: σ known, normal data. Test statistic ~ N(0,1) under H₀.",
        "t-test: σ unknown, normal data. Test statistic ~ t_{n-1} under H₀. Use Welch's correction for two samples by default.",
        "χ² goodness-of-fit: count data, expected vs observed. Test statistic ~ χ²_{k-1-p} under H₀, with E ≥ 5 per cell.",
        "All three are special cases of the general likelihood-ratio framework.",
        "p-value just below 0.05 is not evidence of effect; report effect sizes and CIs.",
      ],
      quiz: [
        {
          id: "q1",
          prompt:
            "When σ is unknown and you estimate it from the data, which distribution does the standardised mean follow?",
          choices: [
            { id: "a", label: "Standard Normal" },
            { id: "b", label: "Student t with n−1 df" },
            { id: "c", label: "χ² with n−1 df" },
            { id: "d", label: "F-distribution" },
          ],
          answer: "b",
          explanation:
            "Replacing σ with s introduces extra uncertainty; the resulting ratio has heavier tails — Student's t with n−1 df.",
        },
        {
          id: "q2",
          prompt:
            "A χ² goodness-of-fit test has 5 categories and uses 0 parameters estimated from the data. The degrees of freedom are...",
          choices: [
            { id: "a", label: "5" },
            { id: "b", label: "4" },
            { id: "c", label: "3" },
            { id: "d", label: "1" },
          ],
          answer: "b",
          explanation: "df = k − 1 − p = 5 − 1 − 0 = 4.",
        },
        {
          id: "q3",
          type: "numeric",
          prompt:
            "n=25, x̄=12, s=4, μ₀=10. Compute the t-statistic.",
          answer: 2.5,
          tolerance: 0.05,
          hint: "T = (x̄ − μ₀) / (s/√n).",
          explanation: "T = (12 − 10) / (4/5) = 2 / 0.8 = 2.5.",
        },
        {
          id: "q4",
          type: "ordering",
          prompt: "Re-order the steps of running a one-sample t-test.",
          steps: [
            { id: "s1", label: "Compute sample mean x̄ and sample sd s" },
            { id: "s2", label: "Form the t-statistic T = (x̄ − μ₀)/(s/√n)" },
            { id: "s3", label: "Find the critical value t_{α/2, n−1} or compute the p-value" },
            { id: "s4", label: "Compare |T| to the critical value or p to α" },
            { id: "s5", label: "Reject or fail to reject H₀, then report the effect size" },
          ],
          explanation: "Sample stat → standardise → look up null distribution → decide → report.",
        },
      ],
      furtherReading: [
        { title: "Casella & Berger — Statistical Inference, ch. 8" },
        { title: "Wasserman — All of Statistics, ch. 10" },
      ],
    },

    zh: {
      title: "具體檢定：z、t 與 χ²",
      subtitle:
        "古典檢定的三大主力。每一個都是 Neyman–Pearson 特例為不同問題量身打扮的版本，三者合起來涵蓋初學實務的大部分。",
      hook: "σ 已知用 z；σ 未知用 t；檢定變異數或計數用 χ²。就這樣。",
      whyItMatters: (
        <>
          大學教科書、臨床試驗、A/B 測試與社會科學論文裡 90% 的古典檢定，
          都是這三種程序之一：z、t 或 χ²。
          每一個都是「假設檢定」那一章框架的工作範例，
          把它們背熟之後，「該用哪個檢定？」就變成 5 秒的決定，
          而不是 30 分鐘的恐慌。
        </>
      ),
      intuition: (
        <>
          <p>三個問題，三個統計量：</p>
          <ul className="list-disc pl-6 space-y-1.5 mt-2">
            <li>
              <strong>z 檢定</strong>：「我的常態資料的平均等於 <M>{`\\mu_0`}</M> 嗎？」
              ── 當 <M>{`\\sigma`}</M> 已知時。
              用 <M>{`\\sigma/\\sqrt n`}</M> 把樣本平均標準化；
              在 <M>{`H_0`}</M> 下它是標準常態。
            </li>
            <li>
              <strong>t 檢定</strong>：同樣的問題，但 <M>{`\\sigma`}</M> 未知。
              改用 <M>{`s/\\sqrt n`}</M> 標準化；
              在 <M>{`H_0`}</M> 下這個比值是 Student t，
              自由度為 <M>{`n-1`}</M>。
            </li>
            <li>
              <strong>χ² 檢定</strong>：「我的計數資料符合預期比例嗎？」
              （goodness-of-fit），或「變異數等於 <M>{`\\sigma_0^2`}</M> 嗎？」
              檢定統計量是「標準化偏差平方和」；
              在 <M>{`H_0`}</M> 下是 χ²，自由度視情況而定。
            </li>
          </ul>
          <p>
            這三個都是概似比檢定的特例。
            它們長得不一樣，是因為每一個都把檢定統計量解出了封閉式。
          </p>
        </>
      ),
      formal: (
        <>
          <p>
            <strong>單樣本 z 檢定</strong>（常態平均，σ 已知）。
            檢定 <M>{`H_0: \\mu = \\mu_0`}</M>：
          </p>
          <FormulaBlock
            formula={`Z = \\frac{\\bar X - \\mu_0}{\\sigma/\\sqrt n} \\sim \\mathcal{N}(0, 1) \\text{ 在 } H_0 \\text{ 下}.`}
          />
          <p>
            <strong>單樣本 t 檢定</strong>（常態平均，σ 未知）。
            把 σ 換成樣本標準差：
          </p>
          <FormulaBlock
            formula={`T = \\frac{\\bar X - \\mu_0}{s/\\sqrt n} \\sim t_{n-1} \\text{ 在 } H_0 \\text{ 下}.`}
          />
          <p>
            <strong>雙樣本 t 檢定</strong>（變異數相等）。
            對於樣本大小 <M>{`n_1, n_2`}</M> 的獨立樣本：
          </p>
          <FormulaBlock
            formula={`T = \\frac{\\bar X_1 - \\bar X_2}{s_p \\sqrt{\\frac{1}{n_1} + \\frac{1}{n_2}}}, \\quad s_p^2 = \\frac{(n_1-1)s_1^2 + (n_2-1)s_2^2}{n_1 + n_2 - 2}`}
          />
          <p>
            自由度為 <M>{`n_1 + n_2 - 2`}</M>，
            檢定 <M>{`H_0: \\mu_1 = \\mu_2`}</M>。
          </p>
          <p>
            <strong>χ² goodness-of-fit 檢定</strong>。
            <M>k</M> 個類別的觀察次數 <M>{`O_1, \\dots, O_k`}</M>，
            在虛無下的期望次數 <M>{`E_1, \\dots, E_k`}</M>：
          </p>
          <FormulaBlock
            formula={`\\chi^2 = \\sum_{i=1}^k \\frac{(O_i - E_i)^2}{E_i} \\sim \\chi^2_{k - 1 - p} \\text{ 在 } H_0 \\text{ 下},`}
            question="資料和模型的期望次數對得多齊？"
          />
          <p>
            其中 <M>p</M> 是「從資料估計出的參數個數」。
            <M>{`\\chi^2`}</M> 大時拒絕。
          </p>
        </>
      ),
      graduate: (
        <>
          <p>
            <strong>χ² 統計量是「多項式概似比」的 Pearson 近似。</strong>
            對於真實機率為 <M>{`p_i`}</M> 的多項式資料，對數概似比為：
          </p>
          <FormulaBlock
            formula={`-2 \\log \\Lambda = 2 \\sum_i O_i \\log\\!\\left(\\frac{O_i}{E_i}\\right)`}
          />
          <p>
            （即「G 檢定」的統計量，也記為 <M>{`G^2`}</M>）。
            在 <M>{`O_i = E_i`}</M> 附近做二階 Taylor 展開，
            就得到 Pearson 的 <M>{`\\chi^2`}</M>。
            兩者由 Wilks 定理收斂到同一個{" "}
            <M>{`\\chi^2_{k-1-p}`}</M> 分布，
            但 G 在小樣本下行為稍好。
          </p>
          <p>
            <strong>Welch 修正。</strong>
            合併變異數版本的雙樣本 t 檢定假設母體變異數相等。
            如果這個假設可疑，改用 <em>Welch 的 t 檢定</em>：
            同樣的統計量但用各自的變異數估計，
            並用 Satterthwaite 自由度：
          </p>
          <FormulaBlock
            formula={`\\nu = \\frac{(s_1^2/n_1 + s_2^2/n_2)^2}{(s_1^2/n_1)^2/(n_1-1) + (s_2^2/n_2)^2/(n_2-1)}`}
          />
          <p>
            這通常不是整數，但被當作連續的自由度參數處理。
            Welch 是更安全的預設 ──
            大多數現代軟體（R、scipy）的雙樣本 t 都預設用 Welch。
          </p>
          <p>
            <strong>為什麼 χ² 需要 E ≥ 5。</strong>
            χ² 近似依賴於「多項式計數近似為常態」，
            當期望格次數太小時這會失敗。
            古典規則是每格 <M>{`E_i \\ge 5`}</M>。
            替代方案：合併稀疏的格、用 Fisher 精確檢定，
            或用 G 檢定（對稀疏表稍為穩健）。
          </p>
          <p>
            <strong>常見誤用。</strong>
            對極度偏斜的小樣本資料跑單樣本 t 檢定。
            CLT 基於漸近的論證對偏斜分布需要<em>大很多</em>的 n。
            小的偏斜樣本應該用符號檢定、置換檢定，或先做變換。
          </p>
        </>
      ),
      body: (
        <>
          <SectionHeader step={1} title="工作範例：單樣本 t 檢定" />
          <p className="text-ink-dim leading-relaxed">
            一家公司宣稱他們的電池平均壽命為 100 小時。
            你抽了 16 顆，得到樣本平均 96 小時、樣本標準差 8 小時。
            在 α = 0.05 下檢定 <M>{`H_0: \\mu = 100`}</M> vs{" "}
            <M>{`H_1: \\mu \\ne 100`}</M>。
          </p>
          <ProofStepper
            title="電池範例"
            steps={[
              { title: "計算檢定統計量。", math: "T = \\frac{\\bar x - \\mu_0}{s/\\sqrt n} = \\frac{96 - 100}{8/\\sqrt{16}} = -2.0" },
              { title: "找出臨界值。", math: "t_{0.025, 15} \\approx 2.131", reason: "自由度 15 的 t 分布雙尾 95% 區間。" },
              { title: "比較。", reason: "|T| = 2.0 < 2.131，所以在 5% 水準下未拒絕 H₀。資料與公司的宣稱「勉強」一致。" },
              { title: "計算雙尾 p 值。", math: "p = 2 P(T_{15} > 2.0) \\approx 0.064", reason: "略高於 0.05；如果 n 稍微大一點就會拒絕。這是「同時報告效應大小與 CI」的有力論點。" },
            ]}
          />

          <SectionHeader step={2} title="工作範例：χ² goodness-of-fit" />
          <p className="text-ink-dim leading-relaxed">
            一個 4 面骰子（k = 4）擲了 100 次。
            觀察次數：22、28、19、31。
            如果骰子公平，每個期望次數為 25。檢定公平性。
          </p>
          <ProofStepper
            title="公平骰子檢定"
            steps={[
              { title: "計算 χ² 統計量。", math: "\\chi^2 = \\sum \\frac{(O_i - E_i)^2}{E_i} = \\frac{9 + 9 + 36 + 36}{25} = \\frac{90}{25} = 3.6" },
              { title: "自由度。", math: "k - 1 - p = 4 - 1 - 0 = 3", reason: "k=4 個類別，沒有從資料估計的參數。" },
              { title: "臨界值。", math: "\\chi^2_{0.05, 3} \\approx 7.815", reason: "自由度 3 的 χ² 上 5% 分位數。" },
              { title: "比較。", reason: "3.6 < 7.815，未拒絕。100 次擲骰下，這些偏差仍在公平骰子的合理範圍內。" },
            ]}
          />

          <TheoremCard
            kind="theorem"
            name="t 統計量的分布"
            statement={
              <>
                若 <M>{`X_1, \\dots, X_n \\sim \\mathcal{N}(\\mu, \\sigma^2)`}</M>{" "}
                為 i.i.d.，則
              </>
            }
            formula={`T = \\frac{\\bar X - \\mu}{S/\\sqrt n} \\sim t_{n-1},`}
          >
            其中 <M>{`t_{n-1}`}</M> 表示自由度 <M>{`n-1`}</M> 的 Student t。
            常態下 <M>{`\\bar X`}</M> 與 <M>{`S^2`}</M> 的獨立性是讓這個成為「精確」的關鍵。
          </TheoremCard>
        </>
      ),
      misconceptions: [
        {
          wrong: "n 大時 z 和 t 可以互換。",
          right:
            "它們漸近上等價，但在 σ 未知時用 z 會「系統性低估」小 n 下的不確定性。任何時候只要 σ 是從資料估的，就用 t，無論 n 多大。",
        },
        {
          wrong: "χ² 對任何格次數都管用。",
          right:
            "χ² 近似要求每格期望次數至少約 5。對更稀疏的表，用 Fisher 精確檢定或合併格子。",
        },
        {
          wrong: "等變異數是雙樣本 t 的安全預設。",
          right:
            "Welch 的 t 檢定（各自變異數）幾乎永遠更安全，也是現代預設。合併變異數的版本是歷史遺物。",
        },
      ],
      takeaways: [
        "z 檢定：σ 已知、常態資料。檢定統計量在 H₀ 下 ~ N(0,1)。",
        "t 檢定：σ 未知、常態資料。檢定統計量在 H₀ 下 ~ t_{n-1}。雙樣本預設用 Welch 修正。",
        "χ² goodness-of-fit：計數資料、期望 vs 觀察。檢定統計量在 H₀ 下 ~ χ²_{k-1-p}，每格 E ≥ 5。",
        "三者都是「概似比檢定」的特例。",
        "p 值剛好低於 0.05 不是「有效應」的證據；要同時報告效應大小與 CI。",
      ],
      quiz: [
        {
          id: "q1",
          prompt:
            "當 σ 未知、需要從資料估出來時，標準化後的樣本平均服從什麼分布？",
          choices: [
            { id: "a", label: "標準常態" },
            { id: "b", label: "自由度 n−1 的 Student t" },
            { id: "c", label: "自由度 n−1 的 χ²" },
            { id: "d", label: "F 分布" },
          ],
          answer: "b",
          explanation:
            "用 s 取代 σ 引入了額外的不確定性；得到的比值有比較重的尾巴 ── 自由度 n−1 的 Student t。",
        },
        {
          id: "q2",
          prompt:
            "一個 χ² goodness-of-fit 檢定有 5 個類別，從資料估了 0 個參數。自由度為？",
          choices: [
            { id: "a", label: "5" },
            { id: "b", label: "4" },
            { id: "c", label: "3" },
            { id: "d", label: "1" },
          ],
          answer: "b",
          explanation: "df = k − 1 − p = 5 − 1 − 0 = 4。",
        },
        {
          id: "q3",
          type: "numeric",
          prompt:
            "n=25、x̄=12、s=4、μ₀=10。計算 t 統計量。",
          answer: 2.5,
          tolerance: 0.05,
          hint: "T = (x̄ − μ₀) / (s/√n)。",
          explanation: "T = (12 − 10) / (4/5) = 2 / 0.8 = 2.5。",
        },
        {
          id: "q4",
          type: "ordering",
          prompt: "把跑單樣本 t 檢定的步驟重新排序。",
          steps: [
            { id: "s1", label: "計算樣本平均 x̄ 與樣本標準差 s" },
            { id: "s2", label: "建構 t 統計量 T = (x̄ − μ₀)/(s/√n)" },
            { id: "s3", label: "找臨界值 t_{α/2, n−1} 或計算 p 值" },
            { id: "s4", label: "比較 |T| 與臨界值（或 p 與 α）" },
            { id: "s5", label: "拒絕或未拒絕 H₀，並報告效應大小" },
          ],
          explanation: "樣本統計 → 標準化 → 查虛無分布 → 決定 → 報告。",
        },
      ],
      furtherReading: [
        { title: "Casella & Berger — Statistical Inference, ch. 8" },
        { title: "Wasserman — All of Statistics, ch. 10" },
      ],
    },
  },
};

export default chapter;
