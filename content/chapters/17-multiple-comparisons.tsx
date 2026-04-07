import { Chapter } from "../types";
import { M } from "@/components/math/Math";
import { FormulaBlock } from "@/components/math/FormulaBlock";
import { TheoremCard } from "@/components/math/TheoremCard";
import { ProofStepper } from "@/components/math/ProofStepper";
import { MultipleTestingExplorer } from "@/components/interactive/MultipleTestingExplorer";
import { SectionHeader } from "@/components/learning/SectionHeader";

const chapter: Chapter = {
  meta: {
    slug: "multiple-comparisons",
    module: "F_testing",
    number: 17,
    minutes: 35,
    level: 4,
    prereqs: ["hypothesis-testing"],
    tags: ["multiple testing", "Bonferroni", "FDR", "BH"],
  },
  localized: {
    en: {
      title: "Multiple Comparisons",
      subtitle:
        "Run enough tests and false positives become inevitable. Bonferroni and Benjamini–Hochberg are the two principled answers — and they target very different things.",
      hook: "20 independent tests at α = 0.05 give a 64% chance of at least one false positive. Multiple-testing correction is not optional.",
      whyItMatters: (
        <>
          The reproducibility crisis is to a large extent a multiple-testing
          crisis. Genome-wide association studies, A/B test dashboards,
          subgroup analyses, and feature selection all run thousands of
          tests at once. Without correction, false positives flood the
          results. Knowing FWER vs FDR — and which to control when — is
          the difference between &quot;principled science&quot; and
          &quot;data dredging&quot;.
        </>
      ),
      intuition: (
        <>
          <p>
            Run a single test at α = 0.05: 5% chance of a false positive
            under the null. Run 20 independent tests: chance of <em>at
            least one</em> false positive is{" "}
            <M>{`1 - (0.95)^{20} \\approx 64\\%`}</M>. Run 1000 tests
            (genomics): essentially guaranteed.
          </p>
          <p>
            Two ways to fix this:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 mt-2">
            <li>
              <strong>Bonferroni</strong>: control the <em>family-wise error
              rate (FWER)</em> — the probability of even one false positive.
              Use <M>{`\\alpha/m`}</M> per test. Conservative but bullet-proof.
            </li>
            <li>
              <strong>Benjamini–Hochberg (BH)</strong>: control the{" "}
              <em>false discovery rate (FDR)</em> — the expected fraction
              of false positives <em>among the rejections</em>. Vastly more
              powerful for large <M>m</M>.
            </li>
          </ul>
          <p>
            Pick FWER when one false positive is catastrophic (drug
            approval, criminal evidence). Pick FDR when many false
            positives are tolerable as long as a controlled fraction (gene
            screening, candidate generation, exploratory data mining).
          </p>
        </>
      ),
      formal: (
        <>
          <p>
            Suppose we run <M>m</M> tests with <M>{`m_0`}</M> true nulls
            and <M>{`m_1 = m - m_0`}</M> true alternatives. The 2×2
            outcome table:
          </p>
          <div className="my-3 overflow-x-auto rounded-xl border border-bg-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-bg-border bg-bg-soft text-ink-dim">
                  <th className="px-3 py-2 text-left"></th>
                  <th className="px-3 py-2 text-left">declared null</th>
                  <th className="px-3 py-2 text-left">declared alt</th>
                  <th className="px-3 py-2 text-left">total</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-bg-border"><td className="px-3 py-2 text-ink-dim">true null</td><td className="text-ink">U</td><td className="text-accent-rose">V</td><td>m₀</td></tr>
                <tr className="border-b border-bg-border"><td className="px-3 py-2 text-ink-dim">true alt</td><td className="text-accent-amber">T</td><td className="text-accent-green">S</td><td>m₁</td></tr>
                <tr><td className="px-3 py-2"></td><td>m − R</td><td>R</td><td>m</td></tr>
              </tbody>
            </table>
          </div>
          <p>
            <em>R</em> is the total number of rejections, <em>V</em> is
            the number of false rejections.
          </p>
          <FormulaBlock
            formula={`\\text{FWER} = P(V \\ge 1), \\quad \\text{FDR} = E\\!\\left[\\frac{V}{\\max(R, 1)}\\right].`}
            question="Among my rejected tests, what fraction are wrong?"
          />
          <p>
            <strong>Bonferroni procedure</strong>: reject test <M>i</M>{" "}
            iff <M>{`p_i < \\alpha/m`}</M>. Then{" "}
            <M>{`\\text{FWER} \\le \\alpha`}</M> regardless of dependence.
          </p>
          <p>
            <strong>Benjamini–Hochberg (BH) procedure</strong>: sort
            p-values <M>{`p_{(1)} \\le \\dots \\le p_{(m)}`}</M>. Find the
            largest <M>k</M> such that
          </p>
          <FormulaBlock
            formula={`p_{(k)} \\le \\frac{k}{m}\\alpha.`}
          />
          <p>
            Reject the tests corresponding to{" "}
            <M>{`p_{(1)}, \\dots, p_{(k)}`}</M>. Then{" "}
            <M>{`\\text{FDR} \\le \\frac{m_0}{m}\\alpha \\le \\alpha`}</M>{" "}
            under independence (or positive regression dependence).
          </p>
        </>
      ),
      graduate: (
        <>
          <p>
            <strong>Bonferroni&apos;s proof is one line.</strong> By the
            union bound:
          </p>
          <FormulaBlock
            formula={`P(V \\ge 1) = P\\!\\left(\\bigcup_{i \\in \\mathcal{N}_0} \\{p_i < \\alpha/m\\}\\right) \\le \\sum_{i \\in \\mathcal{N}_0} \\frac{\\alpha}{m} = \\frac{m_0 \\alpha}{m} \\le \\alpha.`}
          />
          <p>
            Note that this bound is tight only when the tests are
            independent and all nulls are true. Otherwise it&apos;s
            conservative — sometimes severely. That&apos;s why Bonferroni
            is unattractive for very large <M>m</M>.
          </p>
          <p>
            <strong>BH controls FDR but not FWER.</strong> A subtlety:
            BH-controlled FDR allows the number of false positives to
            grow with the number of true alternatives, as long as the
            <em> proportion</em> stays bounded. So BH on a million tests
            with 10000 true effects might allow 500 false positives
            (FDR ≈ 5%) — completely correct. If you need P(any false
            positive) ≤ α, you need Bonferroni or Holm.
          </p>
          <p>
            <strong>Holm&apos;s improvement.</strong> Bonferroni is uniform.
            Holm&apos;s step-down procedure improves on it by sorting p-values
            and using thresholds <M>{`\\alpha/(m - k + 1)`}</M> for the
            k-th smallest p-value. Holm controls FWER strictly tighter
            than Bonferroni and is uniformly more powerful — there is no
            reason to use plain Bonferroni when Holm exists.
          </p>
          <p>
            <strong>q-values.</strong> Storey&apos;s q-value is the FDR
            analogue of a p-value: the smallest FDR level at which a
            given test would be declared significant. Useful for ranking
            and reporting in genomics-scale problems.
          </p>
          <p>
            <strong>Common misuse.</strong> Reporting only the &quot;most
            significant&quot; p-value out of many tests as if it were a
            single-test result. This is the canonical p-hacking move.
            Always disclose the total number of tests run and apply a
            correction.
          </p>
        </>
      ),
      body: (
        <>
          <SectionHeader step={1} title="See multiple-testing correction in action" blurb="Tweak m, the true effect count, the effect size, and α. Watch how no-correction floods you with false positives, Bonferroni hides real effects, and BH balances both." />
          <MultipleTestingExplorer />

          <SectionHeader step={2} title="Worked example: Bonferroni vs BH on 100 tests" />
          <p className="text-ink-dim leading-relaxed">
            Out of <M>m = 100</M> tests, 10 have a real effect, 90 are
            null. Suppose at α = 0.05 our raw p-values are such that 8
            of the 10 alternatives have <M>{`p < 0.001`}</M>, and 5 of the
            90 nulls land at <M>{`p < 0.05`}</M> just by chance.
          </p>
          <ProofStepper
            title="Bonferroni vs BH"
            steps={[
              { title: "Raw α = 0.05.", reason: "8 true positives + 5 false positives = 13 rejections. FDP = 5/13 ≈ 38%." },
              { title: "Bonferroni: α/m = 0.0005.", reason: "All 8 true positives still pass (since their p < 0.001 < 0.0005? No — only those with p < 0.0005 pass). Most of the original true positives are now LOST. 0 false positives, but recall drops sharply." },
              { title: "BH at FDR = 0.05.", reason: "Sort p-values and find the largest k with p_(k) ≤ k·0.05/100. Typically captures most of the 8 true positives plus ~0–1 false positive, achieving the target FDR." },
              { title: "Read the lesson.", reason: "Bonferroni protects against ANY false positive but kills power. BH allows a controlled fraction of false positives in exchange for far better recall. Pick based on what you can tolerate." },
            ]}
          />

          <TheoremCard
            kind="theorem"
            name="Benjamini–Hochberg control of FDR"
            statement={
              <>
                Suppose the <M>m</M> p-values are independent, the BH
                procedure is applied at level <M>α</M>, and the number
                of true nulls is <M>{`m_0`}</M>. Then
              </>
            }
            formula={`\\text{FDR} \\le \\frac{m_0}{m} \\alpha \\le \\alpha.`}
          >
            The proof (Benjamini–Hochberg 1995) is a pretty exchange-of-sums
            argument. The result extends to &quot;positive regression
            dependent&quot; p-values; for arbitrary dependence, use the
            Benjamini–Yekutieli variant which costs an extra factor of{" "}
            <M>{`\\sum_{i=1}^m 1/i \\approx \\log m`}</M>.
          </TheoremCard>
        </>
      ),
      misconceptions: [
        {
          wrong: "FDR and FWER are the same thing.",
          right:
            "They are not. FWER = P(any false positive). FDR = E[fraction of false positives among rejections]. FWER bounds rare events; FDR bounds proportions. They diverge dramatically for large m.",
        },
        {
          wrong: "Bonferroni is universally too conservative.",
          right:
            "Bonferroni is the right tool when even one false positive is unacceptable (drug approval, fraud detection, criminal evidence). Use it deliberately, not by default.",
        },
        {
          wrong: "If I cherry-pick the smallest p-value from my 50 tests, I can use it directly.",
          right:
            "That's selection bias. The minimum of m p-values under the null is approximately Beta(1, m), not Uniform(0,1). You must correct or report all m tests.",
        },
      ],
      takeaways: [
        "Multiple testing inflates false positives — at α = 0.05 across 20 tests, the chance of any false positive is ~64%.",
        "Bonferroni: divide α by m. Controls FWER; conservative but bullet-proof.",
        "Benjamini–Hochberg: sort p-values and reject the largest k with p_(k) ≤ k·α/m. Controls FDR; vastly more powerful for large m.",
        "Holm's procedure is uniformly better than Bonferroni — there's no reason to use plain Bonferroni anymore.",
        "Pick FWER for catastrophic-cost settings; pick FDR for screening / discovery settings.",
      ],
      quiz: [
        {
          id: "q1",
          prompt:
            "100 independent tests are run at α = 0.05 with NO correction. The expected number of false positives under all-true nulls is...",
          choices: [
            { id: "a", label: "0" },
            { id: "b", label: "1" },
            { id: "c", label: "5" },
            { id: "d", label: "100" },
          ],
          answer: "c",
          explanation: "E[V] = m₀·α = 100·0.05 = 5. Without correction, on average 5 of the 100 tests will be false positives.",
        },
        {
          id: "q2",
          prompt: "Which procedure controls the false discovery rate (FDR)?",
          choices: [
            { id: "a", label: "Bonferroni" },
            { id: "b", label: "Holm" },
            { id: "c", label: "Benjamini–Hochberg" },
            { id: "d", label: "Tukey HSD" },
          ],
          answer: "c",
          explanation:
            "Benjamini–Hochberg (1995) controls the FDR; Bonferroni and Holm control the FWER.",
        },
        {
          id: "q3",
          type: "numeric",
          prompt:
            "30 independent tests at α = 0.01. The probability of at least one false positive under all-true nulls is approximately... (round to 2 decimals)",
          answer: 0.26,
          tolerance: 0.02,
          hint: "1 − (1 − α)^m.",
          explanation: "1 − (0.99)^30 ≈ 1 − 0.74 = 0.26.",
        },
        {
          id: "q4",
          type: "ordering",
          prompt: "Re-order the steps of the Benjamini–Hochberg procedure.",
          steps: [
            { id: "s1", label: "Sort p-values: p_(1) ≤ p_(2) ≤ ... ≤ p_(m)" },
            { id: "s2", label: "For each k, compare p_(k) to (k/m)·α" },
            { id: "s3", label: "Find the largest k where p_(k) ≤ (k/m)·α" },
            { id: "s4", label: "Reject the tests corresponding to p_(1), ..., p_(k)" },
            { id: "s5", label: "Conclude FDR ≤ α (under independence)" },
          ],
          explanation: "Sort → compare each rank to k·α/m → find the largest rank that passes → reject everything up to that rank.",
        },
      ],
      furtherReading: [
        { title: "Benjamini & Hochberg — 'Controlling the False Discovery Rate' (1995)" },
        { title: "Efron — Large-Scale Inference" },
        { title: "Holm — 'A Simple Sequentially Rejective Multiple Test Procedure' (1979)" },
      ],
    },

    zh: {
      title: "多重比較",
      subtitle:
        "跑夠多檢定，假陽性就變成必然。Bonferroni 與 Benjamini–Hochberg 是兩個有原則的解答 ── 而它們鎖定的目標非常不同。",
      hook: "α = 0.05 下做 20 個獨立檢定，至少一個假陽性的機率是 64%。多重檢定校正不是可選的。",
      whyItMatters: (
        <>
          再現性危機很大程度上就是「多重檢定危機」。
          全基因組關聯分析、A/B 測試儀表板、子群分析、特徵選擇 ──
          這些都同時跑成千上萬個檢定。
          沒有校正，假陽性會淹沒結果。
          知道 FWER vs FDR 的差別、以及何時控制哪一個 ──
          就是「有原則的科學」與「資料挖掘」之間的差別。
        </>
      ),
      intuition: (
        <>
          <p>
            單一檢定在 α = 0.05 下：在虛無下有 5% 的假陽性機率。
            跑 20 個獨立檢定：<em>至少一個</em>假陽性的機率是{" "}
            <M>{`1 - (0.95)^{20} \\approx 64\\%`}</M>。
            跑 1000 個檢定（基因體學）：基本上是必然的。
          </p>
          <p>兩種修正方法：</p>
          <ul className="list-disc pl-6 space-y-1.5 mt-2">
            <li>
              <strong>Bonferroni</strong>：控制<em>家族錯誤率（FWER）</em>──
              「至少有一個假陽性」的機率。
              每個檢定用 <M>{`\\alpha/m`}</M>。保守但無懈可擊。
            </li>
            <li>
              <strong>Benjamini–Hochberg（BH）</strong>：
              控制 <em>false discovery rate（FDR）</em>──
              「拒絕中假陽性的期望比例」。
              對大 <M>m</M> 強大很多。
            </li>
          </ul>
          <p>
            「即使一個假陽性也是災難」時選 FWER（藥品核准、刑事證據）。
            「許多假陽性可以容忍，只要比例受控」時選 FDR
            （基因篩選、候選生成、探索性資料探勘）。
          </p>
        </>
      ),
      formal: (
        <>
          <p>
            假設我們跑 <M>m</M> 個檢定，
            其中 <M>{`m_0`}</M> 個是真實虛無，
            <M>{`m_1 = m - m_0`}</M> 個是真實對立。
            2×2 結果表：
          </p>
          <div className="my-3 overflow-x-auto rounded-xl border border-bg-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-bg-border bg-bg-soft text-ink-dim">
                  <th className="px-3 py-2 text-left"></th>
                  <th className="px-3 py-2 text-left">宣告為虛無</th>
                  <th className="px-3 py-2 text-left">宣告為對立</th>
                  <th className="px-3 py-2 text-left">總和</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-bg-border"><td className="px-3 py-2 text-ink-dim">真實虛無</td><td className="text-ink">U</td><td className="text-accent-rose">V</td><td>m₀</td></tr>
                <tr className="border-b border-bg-border"><td className="px-3 py-2 text-ink-dim">真實對立</td><td className="text-accent-amber">T</td><td className="text-accent-green">S</td><td>m₁</td></tr>
                <tr><td className="px-3 py-2"></td><td>m − R</td><td>R</td><td>m</td></tr>
              </tbody>
            </table>
          </div>
          <p>
            <em>R</em> 是「拒絕的總數」，<em>V</em> 是「假拒絕的數量」。
          </p>
          <FormulaBlock
            formula={`\\text{FWER} = P(V \\ge 1), \\quad \\text{FDR} = E\\!\\left[\\frac{V}{\\max(R, 1)}\\right].`}
            question="在我拒絕的檢定中，有多少比例是錯的？"
          />
          <p>
            <strong>Bonferroni 程序</strong>：當{" "}
            <M>{`p_i < \\alpha/m`}</M> 時拒絕檢定 <M>i</M>。
            則無論依賴關係如何，
            <M>{`\\text{FWER} \\le \\alpha`}</M>。
          </p>
          <p>
            <strong>Benjamini–Hochberg（BH）程序</strong>：
            把 p 值排序 <M>{`p_{(1)} \\le \\dots \\le p_{(m)}`}</M>。
            找最大的 <M>k</M>，使得：
          </p>
          <FormulaBlock
            formula={`p_{(k)} \\le \\frac{k}{m}\\alpha.`}
          />
          <p>
            拒絕對應於 <M>{`p_{(1)}, \\dots, p_{(k)}`}</M> 的檢定。
            在獨立性（或正向迴歸依賴）下，
            <M>{`\\text{FDR} \\le \\frac{m_0}{m}\\alpha \\le \\alpha`}</M>。
          </p>
        </>
      ),
      graduate: (
        <>
          <p>
            <strong>Bonferroni 的證明只要一行。</strong>由聯集界：
          </p>
          <FormulaBlock
            formula={`P(V \\ge 1) = P\\!\\left(\\bigcup_{i \\in \\mathcal{N}_0} \\{p_i < \\alpha/m\\}\\right) \\le \\sum_{i \\in \\mathcal{N}_0} \\frac{\\alpha}{m} = \\frac{m_0 \\alpha}{m} \\le \\alpha.`}
          />
          <p>
            注意這個界只在「檢定獨立且全部虛無都為真」時才緊。
            否則它會偏保守 ── 有時嚴重保守。
            這就是為什麼 Bonferroni 對非常大的 <M>m</M> 不吸引人。
          </p>
          <p>
            <strong>BH 控制 FDR 但「不」控制 FWER。</strong>
            一個微妙的點：BH 控制的 FDR 允許「假陽性的數量」隨「真實對立的數量」成長，
            只要<em>比例</em>仍受控。
            所以對一百萬個檢定、其中 10000 個有真實效應的情境，
            BH 可能允許 500 個假陽性（FDR ≈ 5%）── 完全正確。
            如果你需要 P(任何假陽性) ≤ α，
            你需要 Bonferroni 或 Holm。
          </p>
          <p>
            <strong>Holm 的改進。</strong>
            Bonferroni 是均勻的。
            Holm 的「step-down」程序透過排序 p 值並對第 k 小的 p 值用門檻{" "}
            <M>{`\\alpha/(m - k + 1)`}</M> 來改進。
            Holm 嚴格地比 Bonferroni 緊地控制 FWER，且均勻地更有檢定力 ──
            既然有 Holm，就沒有理由再用普通的 Bonferroni。
          </p>
          <p>
            <strong>q 值。</strong>
            Storey 的 q 值是 p 值的 FDR 對應物：
            「該檢定會在哪個最低的 FDR 水準下被宣告為顯著」。
            在基因體規模問題的排序與報告上很有用。
          </p>
          <p>
            <strong>常見誤用。</strong>
            從許多檢定中只報告「最顯著」的 p 值，當它是單一檢定的結果。
            這是經典的 p-hacking。
            永遠揭露跑了多少檢定，並做校正。
          </p>
        </>
      ),
      body: (
        <>
          <SectionHeader step={1} title="親眼看多重檢定校正運作" blurb="調整 m、真實效應數、效應大小、α。看「未校正」如何被假陽性淹沒、Bonferroni 如何隱藏真效應、BH 如何在兩者間取得平衡。" />
          <MultipleTestingExplorer />

          <SectionHeader step={2} title="工作範例：100 個檢定的 Bonferroni vs BH" />
          <p className="text-ink-dim leading-relaxed">
            <M>m = 100</M> 個檢定中，10 個有真實效應、90 個是虛無。
            假設在 α = 0.05 下，10 個對立中有 8 個的{" "}
            <M>{`p < 0.001`}</M>，
            而 90 個虛無中剛好有 5 個碰巧落在 <M>{`p < 0.05`}</M>。
          </p>
          <ProofStepper
            title="Bonferroni vs BH"
            steps={[
              { title: "原始 α = 0.05。", reason: "8 個真陽性 + 5 個假陽性 = 13 個拒絕。FDP = 5/13 ≈ 38%。" },
              { title: "Bonferroni：α/m = 0.0005。", reason: "原本 8 個真陽性中只有「p < 0.0005 的」會通過。原本的真陽性大多被「丟掉」了。0 個假陽性，但 recall 急速下降。" },
              { title: "BH 在 FDR = 0.05。", reason: "把 p 值排序、找最大的 k 使得 p_(k) ≤ k·0.05/100。通常會抓到 8 個真陽性的大部分加上約 0–1 個假陽性，達成目標 FDR。" },
              { title: "讀出教訓。", reason: "Bonferroni 防止「任何」假陽性但殺死檢定力。BH 容許受控比例的假陽性以換取好太多的 recall。要看你能容忍什麼。" },
            ]}
          />

          <TheoremCard
            kind="theorem"
            name="Benjamini–Hochberg 對 FDR 的控制"
            statement={
              <>
                假設 <M>m</M> 個 p 值獨立，
                BH 程序在水準 <M>α</M> 下執行，
                真實虛無數為 <M>{`m_0`}</M>。則
              </>
            }
            formula={`\\text{FDR} \\le \\frac{m_0}{m} \\alpha \\le \\alpha.`}
          >
            證明（Benjamini–Hochberg 1995）是一個漂亮的「交換求和」論證。
            這個結果延伸到「正向迴歸依賴」的 p 值；
            對任意依賴，要用 Benjamini–Yekutieli 變體，
            它額外付出 <M>{`\\sum_{i=1}^m 1/i \\approx \\log m`}</M> 的因子。
          </TheoremCard>
        </>
      ),
      misconceptions: [
        {
          wrong: "FDR 和 FWER 是同一件事。",
          right:
            "它們不一樣。FWER = P(任何假陽性)。FDR = E[拒絕中假陽性的比例]。FWER 綁定罕見事件；FDR 綁定比例。對大 m，它們嚴重發散。",
        },
        {
          wrong: "Bonferroni 永遠太保守。",
          right:
            "在「即使一個假陽性都不可接受」的情境下（藥品核准、詐欺偵測、刑事證據），Bonferroni 才是正確的工具。要刻意使用，不要當作預設。",
        },
        {
          wrong: "從 50 個檢定中挑「最小的 p 值」，可以直接拿來用。",
          right:
            "那是選擇偏誤。在虛無下，m 個 p 值的最小值近似 Beta(1, m) 分布，不是 Uniform(0,1)。一定要校正或同時報告所有 m 個檢定。",
        },
      ],
      takeaways: [
        "多重檢定會把假陽性放大 ── 在 α = 0.05 下做 20 個檢定，「任何假陽性」的機率約為 64%。",
        "Bonferroni：把 α 除以 m。控制 FWER；保守但無懈可擊。",
        "Benjamini–Hochberg：把 p 值排序，拒絕最大的 k 個其中 p_(k) ≤ k·α/m。控制 FDR；對大 m 強大很多。",
        "Holm 程序均勻地優於 Bonferroni ── 既然有 Holm，就沒理由再用普通的 Bonferroni。",
        "「災難性成本」情境選 FWER；「篩選 / 發現」情境選 FDR。",
      ],
      quiz: [
        {
          id: "q1",
          prompt:
            "100 個獨立檢定在 α = 0.05 下且「未校正」執行。在所有虛無都為真時，假陽性的期望數為？",
          choices: [
            { id: "a", label: "0" },
            { id: "b", label: "1" },
            { id: "c", label: "5" },
            { id: "d", label: "100" },
          ],
          answer: "c",
          explanation: "E[V] = m₀·α = 100·0.05 = 5。沒校正時，平均 100 個檢定中有 5 個是假陽性。",
        },
        {
          id: "q2",
          prompt: "下列哪個程序控制 false discovery rate（FDR）？",
          choices: [
            { id: "a", label: "Bonferroni" },
            { id: "b", label: "Holm" },
            { id: "c", label: "Benjamini–Hochberg" },
            { id: "d", label: "Tukey HSD" },
          ],
          answer: "c",
          explanation:
            "Benjamini–Hochberg（1995）控制 FDR；Bonferroni 和 Holm 控制 FWER。",
        },
        {
          id: "q3",
          type: "numeric",
          prompt:
            "30 個獨立檢定在 α = 0.01 下執行。在所有虛無都為真時，至少一個假陽性的機率約為？（取 2 位小數）",
          answer: 0.26,
          tolerance: 0.02,
          hint: "1 − (1 − α)^m。",
          explanation: "1 − (0.99)^30 ≈ 1 − 0.74 = 0.26。",
        },
        {
          id: "q4",
          type: "ordering",
          prompt: "把 Benjamini–Hochberg 程序的步驟重新排序。",
          steps: [
            { id: "s1", label: "把 p 值排序：p_(1) ≤ p_(2) ≤ ... ≤ p_(m)" },
            { id: "s2", label: "對每個 k，比較 p_(k) 與 (k/m)·α" },
            { id: "s3", label: "找最大的 k 使得 p_(k) ≤ (k/m)·α" },
            { id: "s4", label: "拒絕對應於 p_(1), ..., p_(k) 的檢定" },
            { id: "s5", label: "結論：FDR ≤ α（在獨立性下）" },
          ],
          explanation: "排序 → 比較每個 rank 與 k·α/m → 找最大通過的 rank → 拒絕所有到該 rank 為止的。",
        },
      ],
      furtherReading: [
        { title: "Benjamini & Hochberg — 'Controlling the False Discovery Rate' (1995)" },
        { title: "Efron — Large-Scale Inference" },
        { title: "Holm — 'A Simple Sequentially Rejective Multiple Test Procedure' (1979)" },
      ],
    },
  },
};

export default chapter;
