import { Chapter } from "../types";
import { M } from "@/components/math/Math";
import { FormulaBlock } from "@/components/math/FormulaBlock";
import { TheoremCard } from "@/components/math/TheoremCard";
import { ProofStepper } from "@/components/math/ProofStepper";
import { SectionHeader } from "@/components/learning/SectionHeader";

const chapter: Chapter = {
  meta: {
    slug: "likelihood-ratio-test",
    module: "F_testing",
    number: 16,
    minutes: 35,
    level: 4,
    prereqs: ["maximum-likelihood-estimation", "z-t-chi-square-tests"],
    tags: ["LRT", "Wilks", "Neyman-Pearson"],
  },
  localized: {
    en: {
      title: "Likelihood Ratio Tests",
      subtitle:
        "The universal recipe for building a test from a model. Optimal in the simple-vs-simple case (Neyman–Pearson) and asymptotically chi-square in the general case (Wilks).",
      hook: "Take the ratio of the maximum likelihood under H₁ to the maximum under H₀. The bigger the ratio, the more the data prefer H₁. That's it.",
      whyItMatters: (
        <>
          The LRT is the single most general way to construct a hypothesis
          test for any parametric model. Every classical test (z, t, χ²,
          F, Pearson&apos;s χ², G-test, deviance test) is either an LRT or
          asymptotically equivalent to one. Wilks&apos; theorem guarantees
          that <M>{`-2 \\log \\Lambda \\to \\chi^2_d`}</M> under regularity
          — so once you know your model has <M>d</M> extra free parameters
          under <M>{`H_1`}</M>, you immediately know the asymptotic null
          distribution. No bespoke math required per test.
        </>
      ),
      intuition: (
        <>
          <p>
            You have two nested models: a simpler null model{" "}
            <M>{`H_0`}</M> and a richer alternative <M>{`H_1`}</M>. Fit
            both via MLE. Compare their maximum likelihoods. If the more
            flexible model fits dramatically better, reject the null.
          </p>
          <p>
            That comparison is captured by the <em>likelihood ratio
            statistic</em>:
          </p>
          <FormulaBlock
            formula={`\\Lambda = \\frac{\\sup_{\\theta \\in \\Theta_0} L(\\theta)}{\\sup_{\\theta \\in \\Theta} L(\\theta)} \\in (0, 1].`}
          />
          <p>
            <M>{`\\Lambda`}</M> close to 1: the constrained model fits
            almost as well as the unconstrained one — no reason to reject{" "}
            <M>{`H_0`}</M>. <M>{`\\Lambda`}</M> close to 0: the
            unconstrained model fits much better — reject{" "}
            <M>{`H_0`}</M>.
          </p>
          <p>
            For inference, we usually work with{" "}
            <M>{`-2 \\log \\Lambda`}</M> instead, because under
            regularity it converges in distribution to a clean χ².
          </p>
        </>
      ),
      formal: (
        <>
          <p>
            Let <M>{`\\Theta_0 \\subset \\Theta`}</M> be the null parameter
            space and let{" "}
            <M>{`\\hat\\theta_0 = \\arg\\max_{\\theta \\in \\Theta_0} L(\\theta)`}</M>{" "}
            be the MLE under the null,{" "}
            <M>{`\\hat\\theta = \\arg\\max_{\\theta \\in \\Theta} L(\\theta)`}</M>{" "}
            the unrestricted MLE. The <em>likelihood ratio statistic</em> is
          </p>
          <FormulaBlock
            formula={`\\Lambda = \\frac{L(\\hat\\theta_0)}{L(\\hat\\theta)}, \\quad -2 \\log \\Lambda = 2[\\ell(\\hat\\theta) - \\ell(\\hat\\theta_0)].`}
            question="By how much does relaxing the null improve the log-likelihood?"
          />
          <p>
            Under <M>{`H_0`}</M> and standard regularity, <em>Wilks&apos;
            theorem</em> states:
          </p>
          <FormulaBlock
            formula={`-2 \\log \\Lambda \\xrightarrow{d} \\chi^2_d \\quad \\text{as } n \\to \\infty,`}
          />
          <p>
            where <M>d</M> is the difference in dimensionality between{" "}
            <M>{`\\Theta`}</M> and <M>{`\\Theta_0`}</M> (i.e. the number
            of constraints removed). Reject <M>{`H_0`}</M> if{" "}
            <M>{`-2 \\log \\Lambda > \\chi^2_{d, 1-\\alpha}`}</M>.
          </p>
        </>
      ),
      graduate: (
        <>
          <p>
            <strong>Neyman–Pearson and the LRT.</strong> When both{" "}
            <M>{`H_0`}</M> and <M>{`H_1`}</M> are simple
            (single-point), the Neyman–Pearson lemma says the likelihood
            ratio test is uniformly most powerful at any level α. For
            composite hypotheses, the LRT is no longer guaranteed to be
            UMP — but it remains a very good general-purpose construction.
          </p>
          <p>
            <strong>Wilks&apos; theorem proof sketch.</strong> Taylor-expand{" "}
            <M>{`\\ell(\\theta)`}</M> around the unrestricted MLE{" "}
            <M>{`\\hat\\theta`}</M>:
          </p>
          <FormulaBlock
            formula={`\\ell(\\theta) \\approx \\ell(\\hat\\theta) - \\frac{1}{2}(\\theta - \\hat\\theta)^T I_n(\\hat\\theta) (\\theta - \\hat\\theta)`}
          />
          <p>
            so{" "}
            <M>{`-2 \\log \\Lambda \\approx (\\hat\\theta - \\hat\\theta_0)^T I_n (\\hat\\theta - \\hat\\theta_0)`}</M>.
            Under <M>{`H_0`}</M>, the difference{" "}
            <M>{`\\hat\\theta - \\hat\\theta_0`}</M> is asymptotically
            Normal with covariance{" "}
            <M>{`I_n^{-1}`}</M>, restricted to a <M>d</M>-dimensional
            subspace, and the resulting quadratic form is{" "}
            <M>{`\\chi^2_d`}</M>. The whole proof is a one-page corollary
            of MLE asymptotics.
          </p>
          <p>
            <strong>Score and Wald tests.</strong> Three asymptotically
            equivalent tests for the same null:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 mt-2">
            <li>
              <strong>LRT</strong>:{" "}
              <M>{`-2 [\\ell(\\hat\\theta_0) - \\ell(\\hat\\theta)]`}</M>{" "}
              — uses the difference in log-likelihoods.
            </li>
            <li>
              <strong>Score test</strong>: based on the score function{" "}
              <M>{`U(\\theta) = \\partial \\ell / \\partial \\theta`}</M>{" "}
              evaluated at the null MLE. Doesn&apos;t require fitting the
              alternative model — useful when that&apos;s expensive.
            </li>
            <li>
              <strong>Wald test</strong>: based on the standardised
              distance{" "}
              <M>{`(\\hat\\theta - \\theta_0)^T I_n (\\hat\\theta - \\theta_0)`}</M>{" "}
              of the unrestricted MLE from the null value. Doesn&apos;t
              require fitting the null model.
            </li>
          </ul>
          <p>
            All three converge to the same <M>{`\\chi^2_d`}</M>. They can
            disagree noticeably in finite samples — LRT is generally the
            most reliable.
          </p>
          <p>
            <strong>Common misuse.</strong> Wilks&apos; theorem requires
            the null parameter to be in the <em>interior</em> of the
            parameter space. If your null sits on the boundary (e.g.
            testing <M>{`\\sigma^2 = 0`}</M> in a variance components
            model), the asymptotic distribution is a mixture of chi-squares,
            not a plain <M>{`\\chi^2`}</M>. Using the standard table here
            gives wrong p-values.
          </p>
        </>
      ),
      body: (
        <>
          <SectionHeader step={1} title="Worked example: testing the mean of a Normal" />
          <p className="text-ink-dim leading-relaxed">
            <M>{`X_1, \\dots, X_n \\sim \\mathcal{N}(\\mu, 1)`}</M>, test{" "}
            <M>{`H_0: \\mu = 0`}</M> against{" "}
            <M>{`H_1: \\mu \\ne 0`}</M>.
          </p>
          <ProofStepper
            title="LRT for the Normal mean"
            steps={[
              { title: "Log-likelihood (σ² = 1).", math: "\\ell(\\mu) = -\\frac{1}{2}\\sum (x_i - \\mu)^2 + \\text{const}" },
              { title: "Unrestricted MLE.", math: "\\hat\\mu = \\bar x \\Rightarrow \\ell(\\hat\\mu) = -\\frac{1}{2}\\sum (x_i - \\bar x)^2 + \\text{const}" },
              { title: "Restricted MLE under H₀.", math: "\\hat\\mu_0 = 0 \\Rightarrow \\ell(0) = -\\frac{1}{2}\\sum x_i^2 + \\text{const}" },
              { title: "Compute −2 log Λ.", math: "-2 \\log \\Lambda = 2[\\ell(\\hat\\mu) - \\ell(0)] = \\sum x_i^2 - \\sum (x_i - \\bar x)^2 = n \\bar x^2", reason: "Algebra: Σx² − Σ(x − x̄)² = n·x̄²." },
              { title: "Recognise the distribution under H₀.", math: "\\sqrt n \\bar x \\sim \\mathcal{N}(0, 1) \\Rightarrow n \\bar x^2 \\sim \\chi^2_1", reason: "The square of a standard Normal is χ²₁ — this is exactly the d = 1 case of Wilks' theorem (and exact, not asymptotic)." },
            ]}
          />

          <TheoremCard
            kind="theorem"
            name="Wilks' theorem"
            statement={
              <>
                Let <M>{`\\Theta_0 \\subset \\Theta`}</M> be a smooth lower-dimensional
                submanifold of dimension <M>{`\\dim \\Theta - d`}</M>.
                Under standard MLE regularity conditions, if{" "}
                <M>{`H_0: \\theta \\in \\Theta_0`}</M> is true:
              </>
            }
            formula={`-2 \\log \\Lambda(X_1, \\dots, X_n) \\xrightarrow{d} \\chi^2_d \\quad \\text{as } n \\to \\infty.`}
          >
            This is the engine behind generalised LR tests, deviance tests
            in GLMs, and almost every model-comparison procedure in
            practice. It is asymptotic — for small <M>n</M>, simulation or
            exact distributions are safer.
          </TheoremCard>
        </>
      ),
      misconceptions: [
        {
          wrong: "Wilks' theorem applies to any null hypothesis.",
          right:
            "It requires the null to be a smooth submanifold in the interior of the parameter space. Boundary nulls (variance components, mixture proportions = 0) follow non-standard distributions — usually a mixture of chi-squares.",
        },
        {
          wrong: "LRT, score test, and Wald test always agree.",
          right:
            "They are asymptotically equivalent and converge to the same χ². In finite samples they can disagree, sometimes noticeably. LRT is generally the most reliable — score and Wald are computational shortcuts.",
        },
        {
          wrong: "−2 log Λ is always non-negative.",
          right:
            "Yes — because Λ ≤ 1 always. The log is non-positive; multiplying by −2 makes it non-negative. This is a useful sanity check for code.",
        },
      ],
      takeaways: [
        "The LRT compares the maximum likelihood under H₀ to the maximum under the unrestricted model.",
        "−2 log Λ is the standard test statistic; under regularity it converges to χ²_d, where d is the number of constraints.",
        "Wilks' theorem makes LRT a one-line recipe for testing nested models.",
        "Score and Wald tests are asymptotically equivalent alternatives — useful when fitting one of the two models is hard.",
        "Boundary nulls break Wilks; use the boundary-aware mixture distribution instead.",
      ],
      quiz: [
        {
          id: "q1",
          prompt:
            "Wilks' theorem says −2 log Λ is asymptotically distributed as...",
          choices: [
            { id: "a", label: "Standard Normal" },
            { id: "b", label: "Student t" },
            { id: "c", label: "χ² with d degrees of freedom (d = constraints removed)" },
            { id: "d", label: "F-distribution" },
          ],
          answer: "c",
          explanation:
            "Under regularity, −2 log Λ → χ²_d, where d is the difference in dimensions of the parameter spaces.",
        },
        {
          id: "q2",
          prompt: "Which test does NOT require fitting the alternative model?",
          choices: [
            { id: "a", label: "LRT" },
            { id: "b", label: "Wald test" },
            { id: "c", label: "Score test" },
            { id: "d", label: "All of them" },
          ],
          answer: "c",
          explanation:
            "The score test only needs the null fit (it evaluates the score function at θ₀). LRT needs both fits; Wald only needs the unrestricted fit.",
        },
        {
          id: "q3",
          type: "numeric",
          prompt:
            "An LRT removes 3 constraints. The test statistic is −2 log Λ = 8.5. The asymptotic p-value (compared to χ²₃) is approximately... (round to 3 decimals; χ²₃ critical value at 0.05 is 7.815).",
          answer: 0.037,
          tolerance: 0.01,
          hint: "P(χ²₃ > 8.5) is between 0.025 and 0.05.",
          explanation: "P(χ²₃ > 8.5) ≈ 0.037, just below 0.05 — reject H₀ at the 5% level.",
        },
        {
          id: "q4",
          type: "ordering",
          prompt: "Re-order the steps of running a likelihood-ratio test.",
          steps: [
            { id: "s1", label: "Specify H₀: θ ∈ Θ₀ ⊂ Θ" },
            { id: "s2", label: "Compute the unrestricted MLE θ̂" },
            { id: "s3", label: "Compute the constrained MLE θ̂₀ over Θ₀" },
            { id: "s4", label: "Form −2 log Λ = 2[ℓ(θ̂) − ℓ(θ̂₀)]" },
            { id: "s5", label: "Compare to χ²_{d, 1−α} or compute the p-value" },
            { id: "s6", label: "Reject or fail to reject H₀" },
          ],
          explanation: "Specify nesting → fit both → compute the LR statistic → compare to χ²_d → decide.",
        },
      ],
      furtherReading: [
        { title: "Casella & Berger — Statistical Inference, ch. 8" },
        { title: "Wilks — 'The Large-Sample Distribution of the Likelihood Ratio for Testing Composite Hypotheses' (1938)" },
        { title: "van der Vaart — Asymptotic Statistics, ch. 16" },
      ],
    },

    zh: {
      title: "概似比檢定",
      subtitle:
        "從模型建檢定的「萬用食譜」。在簡單對簡單的情形下是最佳的（Neyman–Pearson），在一般情形下漸近上是 χ²（Wilks）。",
      hook: "把 H₁ 下的最大概似除以 H₀ 下的最大概似。比值越大，資料越偏好 H₁。就這樣。",
      whyItMatters: (
        <>
          LRT 是「對任何參數模型建構假設檢定」最一般的方式。
          每一個古典檢定（z、t、χ²、F、Pearson 的 χ²、G 檢定、deviance 檢定）
          要嘛是 LRT，要嘛漸近上等價於 LRT。
          Wilks 定理保證在規則條件下{" "}
          <M>{`-2 \\log \\Lambda \\to \\chi^2_d`}</M> ──
          所以只要你知道 <M>{`H_1`}</M> 下模型多了 <M>d</M> 個自由參數，
          你就立刻知道漸近虛無分布。
          每個檢定不必再做客製化的數學。
        </>
      ),
      intuition: (
        <>
          <p>
            你有兩個巢狀模型：
            較簡單的虛無模型 <M>{`H_0`}</M> 與較豐富的對立模型 <M>{`H_1`}</M>。
            兩個都用 MLE 擬合，比較它們的最大概似。
            如果更靈活的模型擬合得明顯更好，就拒絕虛無。
          </p>
          <p>那個比較被<em>概似比統計量</em>抓住：</p>
          <FormulaBlock
            formula={`\\Lambda = \\frac{\\sup_{\\theta \\in \\Theta_0} L(\\theta)}{\\sup_{\\theta \\in \\Theta} L(\\theta)} \\in (0, 1].`}
          />
          <p>
            <M>{`\\Lambda`}</M> 接近 1：
            受約束模型擬合得幾乎和不受約束的一樣好 ── 沒理由拒絕 <M>{`H_0`}</M>。
            <M>{`\\Lambda`}</M> 接近 0：
            不受約束模型擬合得好很多 ── 拒絕 <M>{`H_0`}</M>。
          </p>
          <p>
            做推論時我們通常用 <M>{`-2 \\log \\Lambda`}</M>，
            因為在規則條件下它在分布上收斂到一個乾淨的 χ²。
          </p>
        </>
      ),
      formal: (
        <>
          <p>
            設 <M>{`\\Theta_0 \\subset \\Theta`}</M> 為虛無參數空間，
            <M>{`\\hat\\theta_0 = \\arg\\max_{\\theta \\in \\Theta_0} L(\\theta)`}</M>{" "}
            為虛無下的 MLE，
            <M>{`\\hat\\theta = \\arg\\max_{\\theta \\in \\Theta} L(\\theta)`}</M>{" "}
            為不受約束的 MLE。
            <em>概似比統計量</em>為：
          </p>
          <FormulaBlock
            formula={`\\Lambda = \\frac{L(\\hat\\theta_0)}{L(\\hat\\theta)}, \\quad -2 \\log \\Lambda = 2[\\ell(\\hat\\theta) - \\ell(\\hat\\theta_0)].`}
            question="鬆綁虛無能讓對數概似改善多少？"
          />
          <p>
            在 <M>{`H_0`}</M> 與標準規則條件下，
            <em>Wilks 定理</em>說：
          </p>
          <FormulaBlock
            formula={`-2 \\log \\Lambda \\xrightarrow{d} \\chi^2_d \\quad \\text{當 } n \\to \\infty,`}
          />
          <p>
            其中 <M>d</M> 是 <M>{`\\Theta`}</M> 與 <M>{`\\Theta_0`}</M>{" "}
            的維度差（也就是被移除的限制數）。
            當 <M>{`-2 \\log \\Lambda > \\chi^2_{d, 1-\\alpha}`}</M> 時拒絕 <M>{`H_0`}</M>。
          </p>
        </>
      ),
      graduate: (
        <>
          <p>
            <strong>Neyman–Pearson 與 LRT。</strong>
            當 <M>{`H_0`}</M> 與 <M>{`H_1`}</M> 都是簡單的（單點）假設，
            Neyman–Pearson 引理說 LRT 在任何水準 α 下是均勻最強的。
            對於複合假設，LRT 不再保證 UMP，
            但仍然是「萬用」的良好建構方式。
          </p>
          <p>
            <strong>Wilks 定理證明梗概。</strong>
            把 <M>{`\\ell(\\theta)`}</M> 在不受約束 MLE <M>{`\\hat\\theta`}</M> 附近做 Taylor 展開：
          </p>
          <FormulaBlock
            formula={`\\ell(\\theta) \\approx \\ell(\\hat\\theta) - \\frac{1}{2}(\\theta - \\hat\\theta)^T I_n(\\hat\\theta) (\\theta - \\hat\\theta)`}
          />
          <p>
            所以{" "}
            <M>{`-2 \\log \\Lambda \\approx (\\hat\\theta - \\hat\\theta_0)^T I_n (\\hat\\theta - \\hat\\theta_0)`}</M>。
            在 <M>{`H_0`}</M> 下，差值{" "}
            <M>{`\\hat\\theta - \\hat\\theta_0`}</M>{" "}
            漸近上為常態，協方差為 <M>{`I_n^{-1}`}</M>，
            限制在 <M>d</M> 維子空間上，
            最終的二次型就是 <M>{`\\chi^2_d`}</M>。
            整個證明是「MLE 漸近性」的一頁推論。
          </p>
          <p>
            <strong>Score 與 Wald 檢定。</strong>
            對同一個虛無有三個漸近等價的檢定：
          </p>
          <ul className="list-disc pl-6 space-y-1.5 mt-2">
            <li>
              <strong>LRT</strong>：
              <M>{`-2 [\\ell(\\hat\\theta_0) - \\ell(\\hat\\theta)]`}</M>{" "}
              ── 用對數概似差。
            </li>
            <li>
              <strong>Score 檢定</strong>：
              基於在虛無 MLE 處取值的 score 函數{" "}
              <M>{`U(\\theta) = \\partial \\ell / \\partial \\theta`}</M>。
              不需要擬合對立模型 ── 對立模型擬合很貴時很有用。
            </li>
            <li>
              <strong>Wald 檢定</strong>：
              基於不受約束 MLE 與虛無值的標準化距離{" "}
              <M>{`(\\hat\\theta - \\theta_0)^T I_n (\\hat\\theta - \\theta_0)`}</M>。
              不需要擬合虛無模型。
            </li>
          </ul>
          <p>
            三者收斂到同一個 <M>{`\\chi^2_d`}</M>。
            但在有限樣本下可能出現明顯不一致 ──
            LRT 一般是最可靠的。
          </p>
          <p>
            <strong>常見誤用。</strong>
            Wilks 定理要求虛無參數在參數空間的<em>內部</em>。
            如果你的虛無位於邊界
            （例如在 variance components 模型裡檢定 <M>{`\\sigma^2 = 0`}</M>），
            漸近分布是「多個 χ² 的混合」，不是普通的 <M>{`\\chi^2`}</M>。
            這時用標準表會給錯誤的 p 值。
          </p>
        </>
      ),
      body: (
        <>
          <SectionHeader step={1} title="工作範例：檢定常態的平均" />
          <p className="text-ink-dim leading-relaxed">
            <M>{`X_1, \\dots, X_n \\sim \\mathcal{N}(\\mu, 1)`}</M>，
            檢定 <M>{`H_0: \\mu = 0`}</M> vs <M>{`H_1: \\mu \\ne 0`}</M>。
          </p>
          <ProofStepper
            title="常態平均的 LRT"
            steps={[
              { title: "對數概似（σ² = 1）。", math: "\\ell(\\mu) = -\\frac{1}{2}\\sum (x_i - \\mu)^2 + \\text{const}" },
              { title: "不受約束的 MLE。", math: "\\hat\\mu = \\bar x \\Rightarrow \\ell(\\hat\\mu) = -\\frac{1}{2}\\sum (x_i - \\bar x)^2 + \\text{const}" },
              { title: "H₀ 下的受約束 MLE。", math: "\\hat\\mu_0 = 0 \\Rightarrow \\ell(0) = -\\frac{1}{2}\\sum x_i^2 + \\text{const}" },
              { title: "計算 −2 log Λ。", math: "-2 \\log \\Lambda = 2[\\ell(\\hat\\mu) - \\ell(0)] = \\sum x_i^2 - \\sum (x_i - \\bar x)^2 = n \\bar x^2", reason: "代數：Σx² − Σ(x − x̄)² = n·x̄²。" },
              { title: "辨認 H₀ 下的分布。", math: "\\sqrt n \\bar x \\sim \\mathcal{N}(0, 1) \\Rightarrow n \\bar x^2 \\sim \\chi^2_1", reason: "標準常態的平方就是 χ²₁ ── 這正是 Wilks 定理在 d = 1 的情形（而且是精確的，不只是漸近）。" },
            ]}
          />

          <TheoremCard
            kind="theorem"
            name="Wilks 定理"
            statement={
              <>
                設 <M>{`\\Theta_0 \\subset \\Theta`}</M> 為光滑、低一維的子流形，
                維度為 <M>{`\\dim \\Theta - d`}</M>。
                在標準 MLE 規則條件下，若 <M>{`H_0: \\theta \\in \\Theta_0`}</M> 為真：
              </>
            }
            formula={`-2 \\log \\Lambda(X_1, \\dots, X_n) \\xrightarrow{d} \\chi^2_d \\quad \\text{當 } n \\to \\infty.`}
          >
            這是廣義 LR 檢定、GLM 裡 deviance 檢定、以及實務上幾乎每個「模型比較」程序背後的引擎。
            它是「漸近的」── 對小 <M>n</M>，模擬或精確分布更安全。
          </TheoremCard>
        </>
      ),
      misconceptions: [
        {
          wrong: "Wilks 定理對任何虛無假設都適用。",
          right:
            "它要求虛無是「參數空間內部的光滑子流形」。邊界虛無（variance components、混合比例 = 0）會跑到非標準分布 ── 通常是 χ² 的混合。",
        },
        {
          wrong: "LRT、score、Wald 永遠一致。",
          right:
            "它們漸近上等價，收斂到同一個 χ²。但在有限樣本下可能明顯不一致，LRT 一般最可靠 ── score 與 Wald 是計算上的捷徑。",
        },
        {
          wrong: "−2 log Λ 永遠是非負的。",
          right:
            "對 ── 因為 Λ ≤ 1。對數是非正的，乘上 −2 變成非負。這是寫程式時的好理智檢查。",
        },
      ],
      takeaways: [
        "LRT 比較 H₀ 下的最大概似與不受約束模型下的最大概似。",
        "−2 log Λ 是標準檢定統計量；在規則條件下漸近收斂到 χ²_d，d = 被移除的限制數。",
        "Wilks 定理讓 LRT 變成檢定巢狀模型的「一行食譜」。",
        "Score 與 Wald 檢定是漸近等價的替代品 ── 在「擬合其中一個模型很難」時很有用。",
        "邊界虛無會破壞 Wilks；要改用「邊界感知」的混合分布。",
      ],
      quiz: [
        {
          id: "q1",
          prompt:
            "Wilks 定理說 −2 log Λ 漸近上服從什麼分布？",
          choices: [
            { id: "a", label: "標準常態" },
            { id: "b", label: "Student t" },
            { id: "c", label: "自由度 d 的 χ²（d = 被移除的限制數）" },
            { id: "d", label: "F 分布" },
          ],
          answer: "c",
          explanation:
            "在規則條件下，−2 log Λ → χ²_d，其中 d 是兩個參數空間的維度差。",
        },
        {
          id: "q2",
          prompt: "下列哪個檢定「不需要」擬合對立模型？",
          choices: [
            { id: "a", label: "LRT" },
            { id: "b", label: "Wald 檢定" },
            { id: "c", label: "Score 檢定" },
            { id: "d", label: "全部都需要" },
          ],
          answer: "c",
          explanation:
            "Score 檢定只需要擬合虛無（在 θ₀ 處評估 score 函數）。LRT 需要兩個都擬合；Wald 只需要不受約束的擬合。",
        },
        {
          id: "q3",
          type: "numeric",
          prompt:
            "一個 LRT 移除了 3 個限制。檢定統計量為 −2 log Λ = 8.5。漸近 p 值（對照 χ²₃）約為？（取 3 位小數；χ²₃ 在 0.05 的臨界值是 7.815）",
          answer: 0.037,
          tolerance: 0.01,
          hint: "P(χ²₃ > 8.5) 在 0.025 與 0.05 之間。",
          explanation: "P(χ²₃ > 8.5) ≈ 0.037，剛低於 0.05 ── 在 5% 水準下拒絕 H₀。",
        },
        {
          id: "q4",
          type: "ordering",
          prompt: "把跑概似比檢定的步驟重新排序。",
          steps: [
            { id: "s1", label: "指定 H₀：θ ∈ Θ₀ ⊂ Θ" },
            { id: "s2", label: "計算不受約束的 MLE θ̂" },
            { id: "s3", label: "在 Θ₀ 上計算受約束的 MLE θ̂₀" },
            { id: "s4", label: "建構 −2 log Λ = 2[ℓ(θ̂) − ℓ(θ̂₀)]" },
            { id: "s5", label: "與 χ²_{d, 1−α} 比較或計算 p 值" },
            { id: "s6", label: "拒絕或未拒絕 H₀" },
          ],
          explanation: "指定巢狀關係 → 兩個都擬合 → 算 LR 統計量 → 對照 χ²_d → 決定。",
        },
      ],
      furtherReading: [
        { title: "Casella & Berger — Statistical Inference, ch. 8" },
        { title: "Wilks — 'The Large-Sample Distribution of the Likelihood Ratio for Testing Composite Hypotheses' (1938)" },
        { title: "van der Vaart — Asymptotic Statistics, ch. 16" },
      ],
    },
  },
};

export default chapter;
