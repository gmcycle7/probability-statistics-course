import { Chapter } from "../types";
import { M } from "@/components/math/Math";
import { FormulaBlock } from "@/components/math/FormulaBlock";
import { TheoremCard } from "@/components/math/TheoremCard";
import { ProofStepper } from "@/components/math/ProofStepper";
import { RegressionPlayground } from "@/components/interactive/RegressionPlayground";
import { SectionHeader } from "@/components/learning/SectionHeader";

const chapter: Chapter = {
  meta: {
    slug: "linear-regression",
    module: "G_regression",
    number: 18,
    minutes: 45,
    level: 4,
    prereqs: ["maximum-likelihood-estimation", "confidence-intervals"],
    tags: ["regression", "OLS", "least squares"],
  },
  localized: {
    en: {
      title: "Simple Linear Regression",
      subtitle:
        "Fitting a line is geometry, optimisation, and inference rolled into one. Master this chapter and you've already understood half of supervised learning.",
      hook: "Why least squares is the projection of y onto the column space of X — and what that single sentence buys you.",
      whyItMatters: (
        <>
          Linear regression is the workhorse of applied statistics. Every
          generalised linear model, every time-series autoregression, every
          deep network&apos;s last layer, every economist&apos;s causal
          identification strategy — all of them assume you understand the
          simple line-fitting problem at a deep level. Understand{" "}
          <em>why</em> ordinary least squares is what it is, and the rest is
          machinery.
        </>
      ),
      intuition: (
        <>
          <p>
            You have a cloud of <M>{`(x_i, y_i)`}</M> points and you want to
            summarise them with one line <M>{`y = \\alpha + \\beta x`}</M>.
            Which line is &quot;best&quot;?
          </p>
          <p>
            Pick the line that makes the vertical gaps{" "}
            <M>{`y_i - (\\alpha + \\beta x_i)`}</M> — the <em>residuals</em> —
            as small as possible. Specifically, the line that minimises the
            sum of <em>squared</em> residuals. That line is the OLS (ordinary
            least squares) fit, and it has a clean closed form you can compute
            in a single sweep through the data.
          </p>
          <p>Three reframings to keep in your back pocket:</p>
          <ul className="list-disc pl-6 space-y-1.5 mt-2">
            <li><strong>Geometry.</strong> ŷ is the orthogonal projection of y onto the line spanned by [1, x].</li>
            <li><strong>Probability.</strong> If <M>{`y = \\alpha + \\beta x + \\varepsilon`}</M> with <M>{`\\varepsilon\\sim\\mathcal{N}(0,\\sigma^2)`}</M>, then OLS is the MLE.</li>
            <li><strong>Calibration.</strong> The slope estimate is the sample covariance of x and y, divided by the sample variance of x — a ratio you can interpret directly.</li>
          </ul>
        </>
      ),
      formal: (
        <>
          <p>
            Given data <M>{`(x_1, y_1), \\dots, (x_n, y_n)`}</M>, the OLS
            problem is
          </p>
          <FormulaBlock
            formula={`(\\hat\\alpha, \\hat\\beta) \\;=\\; \\arg\\min_{\\alpha, \\beta} \\sum_{i=1}^n \\big(y_i - \\alpha - \\beta x_i\\big)^2.`}
            question="Which line minimises the total squared vertical error?"
          />
          <p>
            Setting partial derivatives to zero gives the <em>normal equations</em>,
            whose closed-form solution is
          </p>
          <FormulaBlock formula={`\\hat\\beta = \\frac{\\sum_i (x_i - \\bar x)(y_i - \\bar y)}{\\sum_i (x_i - \\bar x)^2}, \\qquad \\hat\\alpha = \\bar y - \\hat\\beta \\bar x.`} />
          <p>
            The fitted values are <M>{`\\hat y_i = \\hat\\alpha + \\hat\\beta x_i`}</M>{" "}
            and the residuals are <M>{`e_i = y_i - \\hat y_i`}</M>. The two
            sum-of-squares decomposition that drives ANOVA is
          </p>
          <FormulaBlock formula={`\\underbrace{\\sum_i (y_i - \\bar y)^2}_{\\text{SST}} \\;=\\; \\underbrace{\\sum_i (\\hat y_i - \\bar y)^2}_{\\text{SSR (explained)}} \\;+\\; \\underbrace{\\sum_i (y_i - \\hat y_i)^2}_{\\text{SSE (residual)}}.`} />
          <p>The <em>coefficient of determination</em> is <M>{`R^2 = 1 - \\text{SSE}/\\text{SST}`}</M>, the fraction of variation in y explained by the fitted line.</p>
        </>
      ),
      graduate: (
        <>
          <p>
            <strong>Matrix form.</strong> Stack everything: let{" "}
            <M>{`X \\in \\mathbb{R}^{n\\times 2}`}</M> have a column of 1s and
            a column of <M>{`x_i`}</M>, and let{" "}
            <M>{`\\beta = (\\alpha, \\beta)^T`}</M>. Then OLS becomes{" "}
            <M>{`\\min_\\beta \\|y - X\\beta\\|^2`}</M>, with solution
          </p>
          <FormulaBlock
            formula={`\\hat\\beta = (X^T X)^{-1} X^T y.`}
            question="What is the coefficient vector for any number of predictors?"
          />
          <p>
            This generalises immediately to multiple regression. Geometrically,{" "}
            <M>{`\\hat y = X\\hat\\beta`}</M> is the orthogonal projection of{" "}
            <M>y</M> onto <M>{`\\text{col}(X)`}</M>; the projection matrix{" "}
            <M>{`H = X(X^T X)^{-1}X^T`}</M> is the famous <em>hat matrix</em>.
          </p>
          <p>
            <strong>Gauss–Markov theorem.</strong> Under the linear model{" "}
            <M>{`y = X\\beta + \\varepsilon`}</M> with{" "}
            <M>{`E[\\varepsilon]=0`}</M> and{" "}
            <M>{`\\text{Cov}(\\varepsilon)=\\sigma^2 I`}</M> (no Normality
            required!), OLS is the <em>BLUE</em> — best linear unbiased
            estimator. Among all linear unbiased estimators of{" "}
            <M>{`\\beta`}</M>, the OLS estimator has the smallest variance.
            Adding the Normality assumption upgrades &quot;BLUE&quot; to
            &quot;UMVUE&quot; (uniformly minimum variance among all unbiased
            estimators).
          </p>
          <p>
            <strong>Sampling distribution of</strong>{" "}
            <M>{`\\hat\\beta`}</M>. Under Normal errors,
          </p>
          <FormulaBlock formula={`\\hat\\beta \\sim \\mathcal{N}\\!\\left(\\beta, \\sigma^2 (X^T X)^{-1}\\right).`} />
          <p>
            This gives standard errors, t-tests for individual coefficients,
            and confidence/prediction intervals — all for free, all from one
            identity.
          </p>
          <p>
            <strong>What can break.</strong> (i) <em>Multicollinearity</em>:
            when columns of <M>X</M> are nearly linearly dependent,{" "}
            <M>{`(X^T X)^{-1}`}</M> blows up, individual coefficients become
            wildly unstable, but predictions can still be fine. (ii){" "}
            <em>Heteroskedasticity</em>: <M>{`\\text{Var}(\\varepsilon_i)`}</M>{" "}
            varying with x makes OLS standard errors wrong (use White / HC0
            robust SEs). (iii) <em>Endogeneity</em>: when{" "}
            <M>{`E[\\varepsilon \\mid x] \\ne 0`}</M>, OLS is biased — this is
            where instrumental variables, RDD, and DiD enter the causal
            inference toolkit.
          </p>
          <p>
            <strong>Connection to regularisation.</strong> Ridge regression
            replaces <M>{`(X^T X)^{-1} X^T y`}</M> with{" "}
            <M>{`(X^T X + \\lambda I)^{-1} X^T y`}</M>, trading a small bias
            for a large variance reduction. This is the simplest place to feel
            the bias-variance trade-off in action: as <M>λ</M> grows, the
            fitted slopes shrink toward 0, residuals get larger, but
            out-of-sample prediction often improves.
          </p>
        </>
      ),
      body: (
        <>
          <SectionHeader step={1} title="Play with it" blurb="Adjust the true line, the noise level, and the sample size. Watch how OLS recovers the true slope on average and how its uncertainty shrinks with n." />
          <RegressionPlayground />

          <SectionHeader step={2} title="Derivation: the slope formula" blurb="A clean derivation by setting partial derivatives to zero." />
          <ProofStepper
            title="OLS slope from first principles"
            steps={[
              { title: "Write the loss.", math: "L(\\alpha,\\beta) = \\sum_{i=1}^n (y_i - \\alpha - \\beta x_i)^2" },
              { title: "Differentiate with respect to α and set to zero.", math: "\\frac{\\partial L}{\\partial \\alpha} = -2\\sum_i (y_i - \\alpha - \\beta x_i) = 0", reason: "This says the residuals must sum to zero." },
              { title: "Solve for α in terms of β.", math: "\\hat\\alpha = \\bar y - \\hat\\beta \\bar x", reason: "Dividing by n collapses to sample means." },
              { title: "Differentiate with respect to β and set to zero.", math: "\\frac{\\partial L}{\\partial \\beta} = -2\\sum_i x_i(y_i - \\alpha - \\beta x_i) = 0" },
              { title: "Substitute α = ȳ − β x̄ and rearrange.", math: "\\sum_i x_i(y_i - \\bar y) = \\hat\\beta \\sum_i x_i(x_i - \\bar x)", reason: "After expanding and cancelling the constant term." },
              { title: "Use Σx(y − ȳ) = Σ(x − x̄)(y − ȳ) (because Σ(y − ȳ) = 0).", math: "\\hat\\beta = \\frac{\\sum_i (x_i - \\bar x)(y_i - \\bar y)}{\\sum_i (x_i - \\bar x)^2}", reason: "There it is — the slope is the sample covariance of x and y divided by the sample variance of x." },
            ]}
          />

          <TheoremCard
            kind="theorem"
            name="Gauss–Markov"
            statement={
              <>
                For the linear model <M>{`y = X\\beta + \\varepsilon`}</M> with{" "}
                <M>{`E[\\varepsilon]=0`}</M> and{" "}
                <M>{`\\text{Cov}(\\varepsilon)=\\sigma^2 I`}</M>, the OLS
                estimator <M>{`\\hat\\beta = (X^TX)^{-1}X^Ty`}</M> is the
                best (smallest variance) linear unbiased estimator of{" "}
                <M>{`\\beta`}</M>.
              </>
            }
          >
            Notice what we did <em>not</em> assume: no Normality. Gauss–Markov
            is a second-moment statement, which is why OLS is robust to
            non-Normal noise as long as the noise is uncorrelated with constant
            variance.
          </TheoremCard>

          <SectionHeader step={3} title="What R² tells you (and what it doesn't)" />
          <p className="text-ink-dim leading-relaxed">
            <M>{`R^2`}</M> is the fraction of total variation in y that is
            captured by the fitted line. <M>{`R^2 = 1`}</M> means a perfect
            fit; <M>{`R^2 = 0`}</M> means the line does no better than the
            mean. But: a high <M>{`R^2`}</M> says nothing about whether the
            linear model is appropriate (it just says the line fits the points
            you chose), nothing about causation, and nothing about
            generalisability. Always pair it with residual plots and an
            out-of-sample check.
          </p>
        </>
      ),
      misconceptions: [
        {
          wrong: "OLS requires Normal errors.",
          right:
            "Gauss–Markov only needs zero-mean, uncorrelated, constant-variance errors. Normality is needed for exact t/F inference, not for OLS itself to be unbiased and efficient.",
        },
        {
          wrong: "A high R² means the model is good.",
          right:
            "A high R² means the line fits the in-sample y. The model can still be wrong (non-linear truth), causally misleading (omitted variables), or overfit (too many predictors).",
          why: "R² is monotone in flexibility — adding any predictor never decreases it. Adjusted R² and out-of-sample MSE are better diagnostics.",
        },
        {
          wrong: "If two predictors are correlated, drop one.",
          right:
            "Multicollinearity inflates standard errors of individual coefficients but doesn't bias predictions. Drop only if the goal is interpretation; keep both if the goal is prediction.",
        },
        {
          wrong: "Regression measures causation.",
          right:
            "Regression measures statistical association conditional on the included covariates. Causal interpretation requires extra structure (random assignment, instruments, DAG identification).",
        },
      ],
      takeaways: [
        "OLS minimises Σ(y − ŷ)² and has a closed form: β̂ = (XᵀX)⁻¹Xᵀy.",
        "Geometrically, ŷ is the orthogonal projection of y onto the column space of X.",
        "Under uncorrelated, constant-variance errors, Gauss–Markov makes OLS the BLUE.",
        "Under Normal errors, β̂ is itself Normal, giving exact t-tests and confidence intervals.",
        "R² is in-sample fit, not model quality. Always inspect residuals and out-of-sample performance.",
        "Multicollinearity hurts coefficient interpretation but not prediction; regularisation trades bias for variance.",
      ],
      quiz: [
        {
          id: "q1",
          prompt:
            "Which of the following is the OLS estimate of the slope in simple linear regression?",
          choices: [
            { id: "a", label: "Sum of (yᵢ − ȳ) divided by Sum of (xᵢ − x̄)" },
            { id: "b", label: "Cov̂(x,y) / Var̂(x)" },
            { id: "c", label: "ȳ / x̄" },
            { id: "d", label: "Cor̂(x,y)" },
          ],
          answer: "b",
          explanation:
            "β̂ = Σ(x − x̄)(y − ȳ) / Σ(x − x̄)² = sample covariance over sample variance of x.",
        },
        {
          id: "q2",
          prompt: "Gauss–Markov says OLS is the best unbiased estimator under which conditions?",
          choices: [
            { id: "a", label: "Errors are i.i.d. Normal" },
            { id: "b", label: "Errors have zero mean and constant variance and are uncorrelated" },
            { id: "c", label: "Errors are bounded" },
            { id: "d", label: "Sample size is at least 30" },
          ],
          answer: "b",
          explanation:
            "BLUE requires only second-moment assumptions: E[ε]=0, Var(ε)=σ²I. Normality is needed for exact t/F inference, not for Gauss–Markov.",
        },
        {
          id: "q3",
          prompt:
            "You quadruple the noise variance σ² but keep n fixed. The standard error of β̂ changes by what factor?",
          choices: [
            { id: "a", label: "×1 (unchanged)" },
            { id: "b", label: "×2" },
            { id: "c", label: "×4" },
            { id: "d", label: "÷2" },
          ],
          answer: "b",
          explanation:
            "Var(β̂) = σ²/Σ(x − x̄)², so SE = σ/√Σ(x − x̄)². Quadrupling σ² doubles σ, hence doubles the SE.",
        },
        {
          id: "q4",
          type: "numeric",
          prompt:
            "Σ(x − x̄)(y − ȳ) = 24 and Σ(x − x̄)² = 12. Compute β̂.",
          answer: 2,
          tolerance: 0.05,
          hint: "β̂ = Σ(x − x̄)(y − ȳ) / Σ(x − x̄)².",
          explanation: "β̂ = 24/12 = 2.",
        },
        {
          id: "q5",
          type: "ordering",
          prompt: "Re-order the derivation of the OLS slope.",
          steps: [
            { id: "s1", label: "Write the loss L(α, β) = Σ(y − α − βx)²" },
            { id: "s2", label: "Differentiate L with respect to α and set to 0 → α̂ = ȳ − β̂ x̄" },
            { id: "s3", label: "Differentiate L with respect to β and set to 0" },
            { id: "s4", label: "Substitute α̂ into the β-equation and simplify" },
            { id: "s5", label: "Read off β̂ = Σ(x − x̄)(y − ȳ)/Σ(x − x̄)²" },
          ],
          explanation: "Loss → ∂α → ∂β → substitute → solve.",
        },
      ],
      furtherReading: [
        { title: "Wasserman — All of Statistics, ch. 13" },
        { title: "Hastie, Tibshirani & Friedman — Elements of Statistical Learning, ch. 3" },
        { title: "Greene — Econometric Analysis, ch. 2–4" },
      ],
    },

    zh: {
      title: "簡單線性迴歸",
      subtitle:
        "「擬合一條線」其實同時是幾何、最佳化與推論。掌握這一章，你就已經理解了監督式學習的一半。",
      hook: "為什麼最小平方法等於把 y 投影到 X 的行空間 ── 以及這一句話能換到什麼。",
      whyItMatters: (
        <>
          線性迴歸是應用統計的工作母機。
          每一個 GLM、每一個時間序列自迴歸、每一個深層神經網路的最後一層、
          每一個經濟學家的因果辨識策略 ──
          都假設你已經深入理解「擬合一條線」這個基本問題。
          搞懂<em>為什麼</em>普通最小平方法（OLS）長這個樣子，
          剩下的全部都只是機器。
        </>
      ),
      intuition: (
        <>
          <p>
            你有一團 <M>{`(x_i, y_i)`}</M> 點，
            想用一條直線 <M>{`y = \\alpha + \\beta x`}</M> 來摘要它們。
            哪一條才是「最好」的？
          </p>
          <p>
            選那條讓垂直間隙{" "}
            <M>{`y_i - (\\alpha + \\beta x_i)`}</M>
            （也就是<em>殘差</em>）盡可能小的線。
            具體地說，是讓「殘差<em>平方</em>之和」最小的線。
            這條線就是 OLS（普通最小平方）擬合，
            而它有一個乾淨的封閉解，只需要掃過資料一次就能算出。
          </p>
          <p>三個值得放在口袋裡的重新詮釋：</p>
          <ul className="list-disc pl-6 space-y-1.5 mt-2">
            <li><strong>幾何。</strong>ŷ 就是把 y 正交投影到 [1, x] 所張的直線上。</li>
            <li><strong>機率。</strong>如果 <M>{`y = \\alpha + \\beta x + \\varepsilon`}</M> 且 <M>{`\\varepsilon\\sim\\mathcal{N}(0,\\sigma^2)`}</M>，那 OLS 就是 MLE。</li>
            <li><strong>校準。</strong>斜率估計就是 x 與 y 的樣本協方差除以 x 的樣本變異數 ── 一個你可以直接解讀的比例。</li>
          </ul>
        </>
      ),
      formal: (
        <>
          <p>
            給定資料 <M>{`(x_1, y_1), \\dots, (x_n, y_n)`}</M>，
            OLS 問題是：
          </p>
          <FormulaBlock
            formula={`(\\hat\\alpha, \\hat\\beta) \\;=\\; \\arg\\min_{\\alpha, \\beta} \\sum_{i=1}^n \\big(y_i - \\alpha - \\beta x_i\\big)^2.`}
            question="哪條線讓「總垂直平方誤差」最小？"
          />
          <p>
            把偏導數設為零，就得到<em>正規方程組</em>，
            其封閉解為：
          </p>
          <FormulaBlock formula={`\\hat\\beta = \\frac{\\sum_i (x_i - \\bar x)(y_i - \\bar y)}{\\sum_i (x_i - \\bar x)^2}, \\qquad \\hat\\alpha = \\bar y - \\hat\\beta \\bar x.`} />
          <p>
            擬合值為 <M>{`\\hat y_i = \\hat\\alpha + \\hat\\beta x_i`}</M>，
            殘差為 <M>{`e_i = y_i - \\hat y_i`}</M>。
            驅動 ANOVA 的兩個平方和分解為：
          </p>
          <FormulaBlock formula={`\\underbrace{\\sum_i (y_i - \\bar y)^2}_{\\text{SST}} \\;=\\; \\underbrace{\\sum_i (\\hat y_i - \\bar y)^2}_{\\text{SSR (已解釋)}} \\;+\\; \\underbrace{\\sum_i (y_i - \\hat y_i)^2}_{\\text{SSE (殘差)}}.`} />
          <p>
            <em>決定係數</em>是 <M>{`R^2 = 1 - \\text{SSE}/\\text{SST}`}</M>，
            也就是 y 的變動中被擬合線解釋的比例。
          </p>
        </>
      ),
      graduate: (
        <>
          <p>
            <strong>矩陣形式。</strong>把所有東西堆起來：
            設 <M>{`X \\in \\mathbb{R}^{n\\times 2}`}</M>{" "}
            有一行 1 和一行 <M>{`x_i`}</M>，
            並令 <M>{`\\beta = (\\alpha, \\beta)^T`}</M>。
            那 OLS 變成 <M>{`\\min_\\beta \\|y - X\\beta\\|^2`}</M>，
            解為：
          </p>
          <FormulaBlock
            formula={`\\hat\\beta = (X^T X)^{-1} X^T y.`}
            question="任意數量的預測變數下，係數向量是什麼？"
          />
          <p>
            這個式子立刻推廣到多元迴歸。
            幾何上，<M>{`\\hat y = X\\hat\\beta`}</M>{" "}
            就是把 <M>y</M> 正交投影到 <M>{`\\text{col}(X)`}</M>；
            投影矩陣 <M>{`H = X(X^T X)^{-1}X^T`}</M>{" "}
            就是有名的 <em>hat matrix</em>。
          </p>
          <p>
            <strong>Gauss–Markov 定理。</strong>
            在線性模型 <M>{`y = X\\beta + \\varepsilon`}</M> 下，
            假設 <M>{`E[\\varepsilon]=0`}</M> 且{" "}
            <M>{`\\text{Cov}(\\varepsilon)=\\sigma^2 I`}</M>
            （注意：<em>不需要</em>常態性！），
            OLS 是 <em>BLUE</em> ── 最佳線性不偏估計量。
            在所有 <M>{`\\beta`}</M> 的線性不偏估計量中，OLS 變異數最小。
            加上常態性假設，就把 BLUE 升級成 UMVUE
            （在所有不偏估計量中變異數均勻最小）。
          </p>
          <p>
            <strong><M>{`\\hat\\beta`}</M> 的抽樣分布。</strong>
            在常態誤差下：
          </p>
          <FormulaBlock formula={`\\hat\\beta \\sim \\mathcal{N}\\!\\left(\\beta, \\sigma^2 (X^T X)^{-1}\\right).`} />
          <p>
            這一個式子直接給你標準誤、單一係數的 t 檢定、信賴與預測區間 ──
            全部免費，全部來自同一個恆等式。
          </p>
          <p>
            <strong>會出問題的地方。</strong>
            (i) <em>共線性（multicollinearity）</em>：
            當 <M>X</M> 的行幾乎線性相依，
            <M>{`(X^T X)^{-1}`}</M> 會爆炸，
            個別係數變得極不穩定，但預測仍可能不錯。
            (ii) <em>異質變異（heteroskedasticity）</em>：
            <M>{`\\text{Var}(\\varepsilon_i)`}</M> 隨 x 變化會讓 OLS 標準誤錯誤
            （改用 White / HC0 穩健標準誤）。
            (iii) <em>內生性（endogeneity）</em>：
            當 <M>{`E[\\varepsilon \\mid x] \\ne 0`}</M>，
            OLS 是有偏的 ── 這是 instrumental variables、RDD、DiD 等
            因果推論工具進場的地方。
          </p>
          <p>
            <strong>與正則化的連結。</strong>
            Ridge regression 把 <M>{`(X^T X)^{-1} X^T y`}</M> 換成{" "}
            <M>{`(X^T X + \\lambda I)^{-1} X^T y`}</M>，
            用一點點偏差換取大幅度的變異數縮減。
            這是感受 bias-variance trade-off 的最簡單地方：
            當 <M>λ</M> 增大，擬合斜率往 0 縮，
            殘差變大，但樣本外預測往往變好。
          </p>
        </>
      ),
      body: (
        <>
          <SectionHeader step={1} title="動手玩玩看" blurb="調整真實線、雜訊水準、樣本數。看 OLS 在平均上如何回復真實斜率，以及它的不確定性如何隨 n 縮小。" />
          <RegressionPlayground />

          <SectionHeader step={2} title="推導：斜率公式" blurb="把偏導數設為零的乾淨推導。" />
          <ProofStepper
            title="從第一原理推 OLS 斜率"
            steps={[
              { title: "寫出損失函數。", math: "L(\\alpha,\\beta) = \\sum_{i=1}^n (y_i - \\alpha - \\beta x_i)^2" },
              { title: "對 α 偏微分並設為零。", math: "\\frac{\\partial L}{\\partial \\alpha} = -2\\sum_i (y_i - \\alpha - \\beta x_i) = 0", reason: "這代表殘差和必須為零。" },
              { title: "用 β 解出 α。", math: "\\hat\\alpha = \\bar y - \\hat\\beta \\bar x", reason: "除以 n 後就剩樣本平均。" },
              { title: "對 β 偏微分並設為零。", math: "\\frac{\\partial L}{\\partial \\beta} = -2\\sum_i x_i(y_i - \\alpha - \\beta x_i) = 0" },
              { title: "代入 α = ȳ − β x̄ 並重排。", math: "\\sum_i x_i(y_i - \\bar y) = \\hat\\beta \\sum_i x_i(x_i - \\bar x)", reason: "展開並消去常數項之後。" },
              { title: "利用 Σx(y − ȳ) = Σ(x − x̄)(y − ȳ)（因為 Σ(y − ȳ) = 0）。", math: "\\hat\\beta = \\frac{\\sum_i (x_i - \\bar x)(y_i - \\bar y)}{\\sum_i (x_i - \\bar x)^2}", reason: "斜率就是 x 與 y 的樣本協方差除以 x 的樣本變異數。" },
            ]}
          />

          <TheoremCard
            kind="theorem"
            name="Gauss–Markov"
            statement={
              <>
                對於線性模型 <M>{`y = X\\beta + \\varepsilon`}</M>，
                若 <M>{`E[\\varepsilon]=0`}</M> 且{" "}
                <M>{`\\text{Cov}(\\varepsilon)=\\sigma^2 I`}</M>，
                則 OLS 估計量 <M>{`\\hat\\beta = (X^TX)^{-1}X^Ty`}</M>{" "}
                是 <M>{`\\beta`}</M> 的最佳（變異數最小）線性不偏估計量。
              </>
            }
          >
            注意我們<em>沒</em>假設什麼：完全沒提到常態性。
            Gauss–Markov 是「二階動差」的陳述，
            這就是為什麼只要雜訊不相關、變異數恆定，
            OLS 對非常態雜訊也很穩健。
          </TheoremCard>

          <SectionHeader step={3} title="R² 告訴你什麼（與沒告訴你什麼）" />
          <p className="text-ink-dim leading-relaxed">
            <M>{`R^2`}</M> 是 y 的總變動中，被擬合線抓住的比例。
            <M>{`R^2 = 1`}</M> 代表完美擬合；
            <M>{`R^2 = 0`}</M> 代表這條線沒比直接用平均更好。
            但是：高 <M>{`R^2`}</M> 並不告訴你「線性模型是不是合適」
            （它只說這條線在你選的點上擬合得好），
            也不告訴你因果關係，也不告訴你樣本外的表現。
            永遠把它和殘差圖、樣本外檢查一起看。
          </p>
        </>
      ),
      misconceptions: [
        {
          wrong: "OLS 要求誤差是常態的。",
          right:
            "Gauss–Markov 只需要「平均零、不相關、變異數恆定」的誤差。常態性是「精確 t/F 推論」需要的，不是 OLS 本身不偏與有效率所需要的。",
        },
        {
          wrong: "高 R² 代表模型很好。",
          right:
            "高 R² 代表「線在樣本內擬合 y 擬合得好」。模型仍可能是錯的（真實是非線性）、因果上會誤導（漏掉變數），或是過擬合（變數太多）。",
          why: "R² 在「模型靈活度」上是單調的 ── 加任何一個變數都不會讓它變小。Adjusted R² 和樣本外 MSE 是更好的診斷指標。",
        },
        {
          wrong: "兩個預測變數相關，就要丟掉其中一個。",
          right:
            "共線性會讓「個別係數」的標準誤膨脹，但不會讓預測有偏。如果目標是「解讀」就丟一個；如果目標是「預測」，兩個都留著。",
        },
        {
          wrong: "迴歸量化的是因果。",
          right:
            "迴歸量化的是「在納入的協變量條件下的統計關聯」。要做因果解讀，需要額外的結構（隨機分派、工具變數、DAG 識別）。",
        },
      ],
      takeaways: [
        "OLS 最小化 Σ(y − ŷ)² 並有封閉解：β̂ = (XᵀX)⁻¹Xᵀy。",
        "幾何上，ŷ 是把 y 正交投影到 X 的行空間。",
        "在「不相關、變異數恆定」的誤差下，Gauss–Markov 讓 OLS 成為 BLUE。",
        "在常態誤差下，β̂ 本身為常態，直接給你精確的 t 檢定與信賴區間。",
        "R² 衡量的是樣本內擬合，不是模型品質。永遠檢查殘差與樣本外表現。",
        "共線性傷害係數的解讀，但不傷害預測；正則化用偏差換取變異數。",
      ],
      quiz: [
        {
          id: "q1",
          prompt:
            "下列哪一個是簡單線性迴歸中 OLS 斜率的估計？",
          choices: [
            { id: "a", label: "Σ(yᵢ − ȳ) ÷ Σ(xᵢ − x̄)" },
            { id: "b", label: "Cov̂(x,y) / Var̂(x)" },
            { id: "c", label: "ȳ / x̄" },
            { id: "d", label: "Cor̂(x,y)" },
          ],
          answer: "b",
          explanation:
            "β̂ = Σ(x − x̄)(y − ȳ) / Σ(x − x̄)² = 樣本協方差除以 x 的樣本變異數。",
        },
        {
          id: "q2",
          prompt: "Gauss–Markov 說 OLS 是最佳不偏估計，需要什麼條件？",
          choices: [
            { id: "a", label: "誤差是 i.i.d. 常態" },
            { id: "b", label: "誤差有零平均、變異數恆定且不相關" },
            { id: "c", label: "誤差有界" },
            { id: "d", label: "樣本數至少 30" },
          ],
          answer: "b",
          explanation:
            "BLUE 只需要二階動差假設：E[ε]=0、Var(ε)=σ²I。常態性是「精確 t/F 推論」要的，不是 Gauss–Markov 要的。",
        },
        {
          id: "q3",
          prompt:
            "把雜訊變異數 σ² 變成 4 倍，n 不變。β̂ 的標準誤變成原本的多少？",
          choices: [
            { id: "a", label: "×1（不變）" },
            { id: "b", label: "×2" },
            { id: "c", label: "×4" },
            { id: "d", label: "÷2" },
          ],
          answer: "b",
          explanation:
            "Var(β̂) = σ²/Σ(x − x̄)²，所以 SE = σ/√Σ(x − x̄)²。σ² 變 4 倍 ⇒ σ 變 2 倍 ⇒ SE 變 2 倍。",
        },
        {
          id: "q4",
          type: "numeric",
          prompt:
            "Σ(x − x̄)(y − ȳ) = 24、Σ(x − x̄)² = 12。計算 β̂。",
          answer: 2,
          tolerance: 0.05,
          hint: "β̂ = Σ(x − x̄)(y − ȳ) / Σ(x − x̄)²。",
          explanation: "β̂ = 24/12 = 2。",
        },
        {
          id: "q5",
          type: "ordering",
          prompt: "把 OLS 斜率的推導重新排序。",
          steps: [
            { id: "s1", label: "寫出損失函數 L(α, β) = Σ(y − α − βx)²" },
            { id: "s2", label: "對 α 偏微分後設為 0 → α̂ = ȳ − β̂ x̄" },
            { id: "s3", label: "對 β 偏微分後設為 0" },
            { id: "s4", label: "把 α̂ 代入 β 的方程式並化簡" },
            { id: "s5", label: "讀出 β̂ = Σ(x − x̄)(y − ȳ)/Σ(x − x̄)²" },
          ],
          explanation: "損失 → ∂α → ∂β → 代入 → 解。",
        },
      ],
      furtherReading: [
        { title: "Wasserman — All of Statistics, ch. 13" },
        { title: "Hastie, Tibshirani & Friedman — Elements of Statistical Learning, ch. 3" },
        { title: "Greene — Econometric Analysis, ch. 2–4" },
      ],
    },
  },
};

export default chapter;
