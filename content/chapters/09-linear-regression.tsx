import { Chapter } from "../types";
import { M, MD } from "@/components/math/Math";
import { FormulaBlock } from "@/components/math/FormulaBlock";
import { TheoremCard } from "@/components/math/TheoremCard";
import { ProofStepper } from "@/components/math/ProofStepper";
import { RegressionPlayground } from "@/components/interactive/RegressionPlayground";
import { SectionHeader } from "@/components/learning/SectionHeader";

const chapter: Chapter = {
  meta: {
    slug: "linear-regression",
    module: "G_regression",
    number: 9,
    title: "Simple Linear Regression",
    subtitle:
      "Fitting a line is geometry, optimisation, and inference rolled into one. Master this chapter and you've already understood half of supervised learning.",
    hook: "Why least squares is the projection of y onto the column space of X — and what that single sentence buys you.",
    minutes: 45,
    level: 4,
    prereqs: ["maximum-likelihood-estimation", "confidence-intervals"],
    tags: ["regression", "OLS", "least squares"],
  },
  content: {
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
          Pick the line that makes the vertical gaps <M>{`y_i - (\\alpha + \\beta x_i)`}</M>{" "}
          — the <em>residuals</em> — as small as possible. Specifically, the
          line that minimises the sum of <em>squared</em> residuals. That
          line is the OLS (ordinary least squares) fit, and it has a clean
          closed form you can compute in a single sweep through the data.
        </p>
        <p>
          Three reframings to keep in your back pocket:
        </p>
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
          <strong>Matrix form.</strong> Stack everything: let <M>{`X \\in \\mathbb{R}^{n\\times 2}`}</M>{" "}
          have a column of 1s and a column of <M>{`x_i`}</M>, and let{" "}
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
          captured by the fitted line. <M>{`R^2 = 1`}</M> means a perfect fit;{" "}
          <M>{`R^2 = 0`}</M> means the line does no better than the mean.
          But: a high <M>{`R^2`}</M> says nothing about whether the linear
          model is appropriate (it just says the line fits the points you
          chose), nothing about causation, and nothing about
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
    ],

    furtherReading: [
      { title: "Wasserman — All of Statistics, ch. 13" },
      { title: "Hastie, Tibshirani & Friedman — Elements of Statistical Learning, ch. 3" },
      { title: "Greene — Econometric Analysis, ch. 2–4" },
    ],
  },
};

export default chapter;
