import { Chapter } from "../types";
import { M } from "@/components/math/Math";
import { FormulaBlock } from "@/components/math/FormulaBlock";
import { TheoremCard } from "@/components/math/TheoremCard";
import { OverfittingExplorer } from "@/components/interactive/OverfittingExplorer";
import { SectionHeader } from "@/components/learning/SectionHeader";

const chapter: Chapter = {
  meta: {
    slug: "overfitting-and-cross-validation",
    module: "G_regression",
    number: 19,
    minutes: 35,
    level: 4,
    prereqs: ["linear-regression"],
    tags: ["overfitting", "cross-validation", "bias-variance"],
  },
  localized: {
    en: {
      title: "Overfitting & Cross-Validation",
      subtitle:
        "Train MSE always falls when you make the model more flexible. Test MSE doesn't. The gap between them is overfitting, and cross-validation is how you measure it without a held-out set.",
      hook: "Why a polynomial of degree n − 1 fits n points perfectly but generalises terribly. The bias-variance trade-off in prediction, not estimation.",
      whyItMatters: (
        <>
          The bias-variance trade-off you saw for estimators reappears,
          identically, for predictors. Train error is monotone decreasing
          in model flexibility. Test error is U-shaped: too simple →
          underfit, too complex → overfit. Cross-validation is the
          standard tool for finding the bottom of the U without a separate
          held-out test set. Every modern ML pipeline either does CV or
          should be doing CV.
        </>
      ),
      intuition: (
        <>
          <p>
            Model flexibility is a knob: simple linear fit on one end,
            high-degree polynomial / deep neural network on the other.
            Train the model. Compute the error on the training data
            (train MSE) and on a held-out test set (test MSE).
          </p>
          <p>
            What you see, every time:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 mt-2">
            <li><strong>Too simple</strong> (low flexibility): train and test MSE are both high. The model can&apos;t capture the structure. <em>Underfitting / high bias.</em></li>
            <li><strong>Just right</strong>: both MSE values are low and close to each other. The model is learning the signal without chasing the noise.</li>
            <li><strong>Too complex</strong> (too flexible): train MSE keeps falling, but test MSE rises. The model is memorising training noise. <em>Overfitting / high variance.</em></li>
          </ul>
          <p>
            Cross-validation (CV) approximates the test MSE using only
            your training data: split into folds, fit on most, evaluate
            on the rest, average. Find the flexibility that minimises CV
            error and you&apos;ve found the U-shape&apos;s minimum.
          </p>
        </>
      ),
      formal: (
        <>
          <p>
            For a regression model <M>{`\\hat f`}</M> trained on data{" "}
            <M>{`(x_1, y_1), \\dots, (x_n, y_n)`}</M>, define
          </p>
          <FormulaBlock
            formula={`\\text{MSE}_{\\text{train}} = \\frac{1}{n}\\sum_{i=1}^n (y_i - \\hat f(x_i))^2,`}
          />
          <p>and the (true) test MSE on a fresh point <M>{`(X_*, Y_*)`}</M>:</p>
          <FormulaBlock
            formula={`\\text{MSE}_{\\text{test}} = E\\!\\left[(Y_* - \\hat f(X_*))^2\\right].`}
            question="How well does the fitted model predict on data it has never seen?"
          />
          <p>The bias-variance decomposition for prediction at a point <M>{`x_0`}</M>:</p>
          <FormulaBlock
            formula={`E[(Y_0 - \\hat f(x_0))^2] = \\underbrace{\\sigma^2}_{\\text{irreducible}} + \\underbrace{(\\text{bias}(\\hat f(x_0)))^2}_{\\text{model bias}} + \\underbrace{\\text{Var}(\\hat f(x_0))}_{\\text{model variance}}.`}
          />
          <p>
            <strong>K-fold cross-validation</strong>: partition the
            training data into <M>K</M> folds. For each <M>k = 1, \dots, K</M>:
            train on the remaining <M>{`K - 1`}</M> folds, evaluate on
            fold <M>k</M>. Average:
          </p>
          <FormulaBlock
            formula={`\\text{CV}_K = \\frac{1}{K}\\sum_{k=1}^K \\text{MSE}^{(k)}.`}
          />
          <p>
            For <M>{`K = n`}</M>, this is <em>leave-one-out cross
            validation (LOOCV)</em>. Common choices: <M>{`K = 5`}</M> or{" "}
            <M>{`K = 10`}</M>.
          </p>
        </>
      ),
      graduate: (
        <>
          <p>
            <strong>Why train MSE is monotone in flexibility.</strong> A
            more flexible model contains every less-flexible model as a
            special case (a polynomial of degree 5 contains every
            polynomial of degree ≤ 5). So the optimal training fit at
            higher degree is at least as good as the optimal at lower
            degree. The minimum can only decrease.
          </p>
          <p>
            <strong>Why test MSE is U-shaped.</strong> Bias decreases as
            you can represent the truth more precisely (high flexibility).
            Variance increases as small changes in the training data
            produce wildly different fits. The sum bias² + variance has
            a unique interior minimum for &quot;most&quot; models — that&apos;s
            the optimal flexibility level.
          </p>
          <p>
            <strong>LOOCV has a beautiful identity for linear models.</strong>{" "}
            For OLS and other linear smoothers,
          </p>
          <FormulaBlock
            formula={`\\text{LOOCV} = \\frac{1}{n}\\sum_{i=1}^n \\left(\\frac{y_i - \\hat y_i}{1 - h_{ii}}\\right)^2,`}
          />
          <p>
            where <M>{`h_{ii}`}</M> is the i-th diagonal element of the
            hat matrix <M>{`H = X(X^TX)^{-1}X^T`}</M>. So you can compute
            LOOCV in <em>one</em> fit, not <M>n</M>. This is the basis of
            generalised cross-validation (GCV) and a key efficiency trick
            for ridge regression hyperparameter tuning.
          </p>
          <p>
            <strong>The double descent phenomenon.</strong> Modern
            high-capacity models (especially deep networks) sometimes
            display a <em>second descent</em>: as flexibility grows past
            the interpolation threshold (where train MSE → 0), test MSE
            actually starts decreasing again. This is not a contradiction
            of bias-variance but a consequence of implicit regularisation
            in the training algorithm — gradient descent in
            overparameterised models prefers low-norm solutions.
          </p>
          <p>
            <strong>Common misuses of CV.</strong>
          </p>
          <ul className="list-disc pl-6 space-y-1.5 mt-2">
            <li>
              Doing feature selection on the full dataset, then running
              CV on the selected features. Information leaks from test
              folds into the feature-selection step. Always do feature
              selection inside the CV loop.
            </li>
            <li>
              Reporting CV error of the best-performing hyperparameter
              setting. This is biased downward — the model is the winner
              of a multiple comparison. Use nested CV for honest model-
              selection error.
            </li>
            <li>
              Using CV with strongly time-dependent or grouped data
              (financial returns, repeated subjects). Standard random
              folds break the dependence structure. Use time-series
              splits or group-aware folds.
            </li>
          </ul>
        </>
      ),
      body: (
        <>
          <SectionHeader step={1} title="Watch overfitting happen in real time" blurb="Slide the polynomial degree from 0 to 20. Train MSE falls monotonically; test MSE has a sweet spot in the middle." />
          <OverfittingExplorer />

          <SectionHeader step={2} title="The bias-variance decomposition for prediction" />
          <p className="text-ink-dim leading-relaxed">
            For a fixed test point <M>{`x_0`}</M> and model{" "}
            <M>{`\\hat f`}</M> trained on a random sample, the expected
            squared prediction error decomposes:
          </p>
          <FormulaBlock
            formula={`E[(Y_0 - \\hat f(x_0))^2] = \\sigma^2 + [E(\\hat f(x_0)) - f(x_0)]^2 + E[(\\hat f(x_0) - E\\hat f(x_0))^2]`}
          />
          <p className="text-ink-dim leading-relaxed">
            The three pieces:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 mt-2 text-ink-dim">
            <li><strong>Irreducible noise</strong> <M>{`\\sigma^2`}</M>: even the true function plus noise has this error. You cannot beat it.</li>
            <li><strong>Bias²</strong>: how far the average fit is from the truth. Low for flexible models, high for simple models.</li>
            <li><strong>Variance</strong>: how much the fit jiggles around its mean across different training sets. High for flexible models, low for simple models.</li>
          </ul>
          <p className="text-ink-dim leading-relaxed">
            Same identity as the estimator MSE decomposition — the model
            <M>{`\\hat f`}</M> is just an estimator of the function{" "}
            <M>f</M>.
          </p>

          <TheoremCard
            kind="theorem"
            name="LOOCV for linear smoothers"
            statement={
              <>
                For OLS and any other linear smoother{" "}
                <M>{`\\hat y = Hy`}</M>:
              </>
            }
            formula={`\\text{LOOCV} = \\frac{1}{n}\\sum_{i=1}^n \\left(\\frac{y_i - \\hat y_i}{1 - h_{ii}}\\right)^2.`}
          >
            One closed-form expression in terms of residuals and hat-matrix
            diagonals — no n separate refits required. This is one of the
            niceties of linear models that gets lost when you move to
            non-linear models or neural networks.
          </TheoremCard>
        </>
      ),
      misconceptions: [
        {
          wrong: "More flexible models are always better.",
          right:
            "Train error always falls with flexibility, but test error has a U-shape. More flexibility ⇒ lower bias and higher variance; you want the minimum of the sum, not the minimum of bias.",
        },
        {
          wrong: "Cross-validation gives an unbiased estimate of test error.",
          right:
            "CV is approximately unbiased for the EXPECTED test error of a model trained on n − n/K examples — slightly pessimistic compared to a model trained on the full n. The bias is small for K = 5 or 10 and noticeable for LOOCV in some cases.",
        },
        {
          wrong: "If you tune hyperparameters using CV, the CV error of the chosen model is its true test error.",
          right:
            "It's biased downward — you picked the model that minimised CV error among many, so winner's curse applies. For an unbiased estimate of generalisation, use NESTED cross-validation or a separate held-out test set.",
        },
      ],
      takeaways: [
        "Train error is monotone decreasing in model flexibility; test error is U-shaped.",
        "Bias-variance decomposition for prediction: MSE = irreducible noise + bias² + variance.",
        "K-fold CV (typically K = 5 or 10) is the standard way to estimate test error from training data alone.",
        "LOOCV has a closed form for linear smoothers — no n refits needed.",
        "Always do feature selection INSIDE the CV loop, and use nested CV for honest hyperparameter tuning.",
      ],
      quiz: [
        {
          id: "q1",
          prompt:
            "As you increase model flexibility, what happens to train MSE?",
          choices: [
            { id: "a", label: "Increases" },
            { id: "b", label: "Decreases monotonically" },
            { id: "c", label: "U-shaped (decreases then increases)" },
            { id: "d", label: "Constant" },
          ],
          answer: "b",
          explanation:
            "Train MSE always falls (or stays the same) as the model class grows. The U-shape is in TEST MSE, not train MSE.",
        },
        {
          id: "q2",
          prompt:
            "10-fold cross-validation on n = 100 samples uses how many examples to train each fold?",
          choices: [
            { id: "a", label: "10" },
            { id: "b", label: "50" },
            { id: "c", label: "90" },
            { id: "d", label: "100" },
          ],
          answer: "c",
          explanation: "Each fold leaves out n/K = 10 examples, so the model trains on 100 − 10 = 90.",
        },
        {
          id: "q3",
          type: "numeric",
          prompt:
            "An OLS fit has irreducible noise variance σ² = 1, model bias² = 0.5, model variance = 0.3 at a test point. The expected squared prediction error is...",
          answer: 1.8,
          tolerance: 0.05,
          hint: "Add the three components.",
          explanation: "MSE_test = σ² + bias² + var = 1 + 0.5 + 0.3 = 1.8.",
        },
        {
          id: "q4",
          type: "ordering",
          prompt: "Re-order the steps of K-fold cross-validation.",
          steps: [
            { id: "s1", label: "Split the training data into K equally-sized folds" },
            { id: "s2", label: "For each fold k, hold it out as the validation set" },
            { id: "s3", label: "Fit the model on the remaining K − 1 folds" },
            { id: "s4", label: "Compute the validation error on fold k" },
            { id: "s5", label: "After all K folds, average the validation errors" },
            { id: "s6", label: "Use the averaged CV error as the model's expected test error estimate" },
          ],
          explanation: "Split → for each fold (hold out → train → evaluate) → average → report.",
        },
      ],
      furtherReading: [
        { title: "Hastie, Tibshirani & Friedman — Elements of Statistical Learning, ch. 7" },
        { title: "James, Witten, Hastie & Tibshirani — An Introduction to Statistical Learning, ch. 5" },
        { title: "Stone — 'Cross-Validatory Choice and Assessment of Statistical Predictions' (1974)" },
      ],
    },

    zh: {
      title: "過擬合與交叉驗證",
      subtitle:
        "把模型變得更靈活，訓練 MSE 永遠下降。但測試 MSE 不會。兩者的差距就是過擬合，交叉驗證是「不需要 held-out set 也能量化它」的方法。",
      hook: "為什麼 n−1 次的多項式可以完美穿過 n 個點，卻在新資料上表現糟糕。預測（不是估計）的偏誤–變異權衡。",
      whyItMatters: (
        <>
          你在「估計量」那裡看到的偏誤–變異權衡，
          一模一樣地在「預測器」上重新出現。
          訓練誤差對模型靈活度單調遞減；
          測試誤差是 U 形：太簡單 → underfit，太複雜 → overfit。
          交叉驗證是「不用單獨的 held-out 測試集」也能找到 U 形最低點的標準工具。
          每個現代 ML 流程要嘛在做 CV，要嘛應該做 CV。
        </>
      ),
      intuition: (
        <>
          <p>
            模型靈活度是個旋鈕：
            一端是簡單的線性擬合，
            另一端是高次多項式 / 深度神經網路。
            訓練模型，計算訓練資料上的誤差（train MSE）與 held-out 測試集上的誤差（test MSE）。
          </p>
          <p>每次都會看到的：</p>
          <ul className="list-disc pl-6 space-y-1.5 mt-2">
            <li><strong>太簡單</strong>（低靈活度）：train 和 test MSE 都高。模型抓不到結構。<em>underfit / 高偏誤。</em></li>
            <li><strong>剛好</strong>：兩個 MSE 都低且相近。模型在學訊號而不是追雜訊。</li>
            <li><strong>太複雜</strong>（過於靈活）：train MSE 持續下降但 test MSE 上升。模型在背訓練雜訊。<em>overfit / 高變異。</em></li>
          </ul>
          <p>
            交叉驗證（CV）只用訓練資料就近似測試 MSE：
            把資料切成 fold、用大部分擬合、用剩下的評估、取平均。
            找出讓 CV 誤差最低的靈活度，就找到了 U 形的底。
          </p>
        </>
      ),
      formal: (
        <>
          <p>
            對於在資料 <M>{`(x_1, y_1), \\dots, (x_n, y_n)`}</M> 上訓練的迴歸模型 <M>{`\\hat f`}</M>，定義：
          </p>
          <FormulaBlock
            formula={`\\text{MSE}_{\\text{train}} = \\frac{1}{n}\\sum_{i=1}^n (y_i - \\hat f(x_i))^2,`}
          />
          <p>以及在新點 <M>{`(X_*, Y_*)`}</M> 上的（真實）測試 MSE：</p>
          <FormulaBlock
            formula={`\\text{MSE}_{\\text{test}} = E\\!\\left[(Y_* - \\hat f(X_*))^2\\right].`}
            question="擬合好的模型在「沒看過的資料」上預測得多好？"
          />
          <p>在點 <M>{`x_0`}</M> 處的預測 bias-variance 分解：</p>
          <FormulaBlock
            formula={`E[(Y_0 - \\hat f(x_0))^2] = \\underbrace{\\sigma^2}_{\\text{不可約}} + \\underbrace{(\\text{bias}(\\hat f(x_0)))^2}_{\\text{模型偏誤}} + \\underbrace{\\text{Var}(\\hat f(x_0))}_{\\text{模型變異}}.`}
          />
          <p>
            <strong>K-fold 交叉驗證</strong>：把訓練資料切成 <M>K</M> 個 fold。對每個 <M>k = 1, \dots, K</M>：在剩下 <M>{`K - 1`}</M> 個 fold 上訓練，在第 <M>k</M> 個 fold 上評估。取平均：
          </p>
          <FormulaBlock
            formula={`\\text{CV}_K = \\frac{1}{K}\\sum_{k=1}^K \\text{MSE}^{(k)}.`}
          />
          <p>
            當 <M>{`K = n`}</M>，這就是 <em>leave-one-out cross validation（LOOCV）</em>。
            常用選擇：<M>{`K = 5`}</M> 或 <M>{`K = 10`}</M>。
          </p>
        </>
      ),
      graduate: (
        <>
          <p>
            <strong>為什麼 train MSE 對靈活度單調。</strong>
            一個更靈活的模型包含每個較不靈活的模型作為特例
            （5 次多項式包含每個次數 ≤ 5 的多項式）。
            所以更高次的「最佳訓練擬合」至少和較低次的一樣好。最小值只能下降。
          </p>
          <p>
            <strong>為什麼 test MSE 是 U 形。</strong>
            隨著模型能精確表示真實函數的能力上升，偏誤下降（高靈活度）。
            而訓練資料的小變動會造成擬合大幅變化，所以變異上升。
            bias² + variance 的和對「大多數」模型有唯一的內部極小 ──
            那就是最佳靈活度。
          </p>
          <p>
            <strong>LOOCV 對線性模型有漂亮的恆等式。</strong>
            對於 OLS 與其他線性平滑器：
          </p>
          <FormulaBlock
            formula={`\\text{LOOCV} = \\frac{1}{n}\\sum_{i=1}^n \\left(\\frac{y_i - \\hat y_i}{1 - h_{ii}}\\right)^2,`}
          />
          <p>
            其中 <M>{`h_{ii}`}</M> 是 hat matrix{" "}
            <M>{`H = X(X^TX)^{-1}X^T`}</M> 的第 i 個對角元素。
            所以你可以「一次擬合」就算出 LOOCV，不需要 <M>n</M> 次。
            這是廣義交叉驗證（GCV）的基礎，也是 ridge 迴歸超參數調整的關鍵效率技巧。
          </p>
          <p>
            <strong>Double descent 現象。</strong>
            現代的高容量模型（特別是深度網路）有時會出現<em>第二次下降</em>：
            當靈活度超過 interpolation 門檻（train MSE → 0）時，
            test MSE 反而開始再次下降。
            這不是對偏誤–變異的反例，
            而是訓練演算法「隱式正則化」的結果 ──
            梯度下降在過參數化模型裡偏好「低範數的解」。
          </p>
          <p>
            <strong>CV 的常見誤用。</strong>
          </p>
          <ul className="list-disc pl-6 space-y-1.5 mt-2">
            <li>
              在「整份資料」上做特徵選擇，再對選出的特徵跑 CV。
              訊息從測試 fold 漏到特徵選擇步驟。
              永遠在 CV 迴圈內做特徵選擇。
            </li>
            <li>
              報告「最佳超參數設定」的 CV 誤差。
              這是負偏的 ── 那個模型是「多重比較的贏家」。
              要用巢狀 CV 才能誠實估計模型選擇的誤差。
            </li>
            <li>
              對強烈時間相依或群組資料用 CV
              （金融報酬、重複量測）。
              標準的隨機 fold 會破壞依賴結構。
              要用時間序列分割或 group-aware 的 fold。
            </li>
          </ul>
        </>
      ),
      body: (
        <>
          <SectionHeader step={1} title="親眼看過擬合即時發生" blurb="把多項式次數從 0 拖到 20。Train MSE 單調下降；test MSE 在中間有甜蜜點。" />
          <OverfittingExplorer />

          <SectionHeader step={2} title="預測的 bias-variance 分解" />
          <p className="text-ink-dim leading-relaxed">
            對固定測試點 <M>{`x_0`}</M> 與在隨機樣本上訓練的模型 <M>{`\\hat f`}</M>，
            預測平方誤差的期望分解為：
          </p>
          <FormulaBlock
            formula={`E[(Y_0 - \\hat f(x_0))^2] = \\sigma^2 + [E(\\hat f(x_0)) - f(x_0)]^2 + E[(\\hat f(x_0) - E\\hat f(x_0))^2]`}
          />
          <p className="text-ink-dim leading-relaxed">三個部分：</p>
          <ul className="list-disc pl-6 space-y-1.5 mt-2 text-ink-dim">
            <li><strong>不可約雜訊</strong> <M>{`\\sigma^2`}</M>：即使用真實函數 + 雜訊也會有這個誤差。你打不過它。</li>
            <li><strong>Bias²</strong>：「平均擬合」離真實有多遠。靈活模型低，簡單模型高。</li>
            <li><strong>變異</strong>：擬合在不同訓練集間相對於自己平均的抖動程度。靈活模型高，簡單模型低。</li>
          </ul>
          <p className="text-ink-dim leading-relaxed">
            和估計量 MSE 分解是同一個恆等式 ──
            模型 <M>{`\\hat f`}</M> 就是函數 <M>f</M> 的一個估計量。
          </p>

          <TheoremCard
            kind="theorem"
            name="線性平滑器的 LOOCV"
            statement={
              <>
                對於 OLS 與任何其他線性平滑器 <M>{`\\hat y = Hy`}</M>：
              </>
            }
            formula={`\\text{LOOCV} = \\frac{1}{n}\\sum_{i=1}^n \\left(\\frac{y_i - \\hat y_i}{1 - h_{ii}}\\right)^2.`}
          >
            一個由「殘差」與「hat matrix 對角元素」表示的封閉式 ──
            不需要 n 次重新擬合。
            這是線性模型的好性質之一，
            移到非線性模型或神經網路後就會消失。
          </TheoremCard>
        </>
      ),
      misconceptions: [
        {
          wrong: "更靈活的模型永遠比較好。",
          right:
            "訓練誤差永遠隨靈活度下降，但測試誤差是 U 形。更靈活 ⇒ 偏誤更低、變異更高；你要的是「兩者和」的最小，不是「偏誤」的最小。",
        },
        {
          wrong: "交叉驗證給你「測試誤差的不偏估計」。",
          right:
            "CV 對「在 n − n/K 樣本上訓練的模型」的期望測試誤差是近似不偏的 ── 與「在完整 n 樣本上訓練的模型」相比稍偏悲觀。對 K = 5 或 10 偏誤很小，對 LOOCV 在某些情況下會明顯。",
        },
        {
          wrong: "用 CV 調超參數時，「被選中的模型」的 CV 誤差就是它的真實測試誤差。",
          right:
            "這是負偏的 ── 你選的是 CV 誤差最低的那個，所以「贏家詛咒」適用。要對泛化誤差做不偏估計，請用「巢狀 CV」或單獨的 held-out 測試集。",
        },
      ],
      takeaways: [
        "訓練誤差對模型靈活度單調下降；測試誤差是 U 形。",
        "預測的 bias-variance 分解：MSE = 不可約雜訊 + bias² + variance。",
        "K-fold CV（通常 K = 5 或 10）是「只用訓練資料估計測試誤差」的標準方法。",
        "LOOCV 對線性平滑器有封閉式 ── 不需要 n 次重新擬合。",
        "永遠在 CV 迴圈「內」做特徵選擇，並用巢狀 CV 才能誠實調超參數。",
      ],
      quiz: [
        {
          id: "q1",
          prompt:
            "當你增加模型靈活度時，train MSE 會怎樣？",
          choices: [
            { id: "a", label: "上升" },
            { id: "b", label: "單調下降" },
            { id: "c", label: "U 形（先降後升）" },
            { id: "d", label: "保持不變" },
          ],
          answer: "b",
          explanation:
            "Train MSE 在模型類別變大時永遠下降（或不變）。U 形是 TEST MSE，不是 train MSE。",
        },
        {
          id: "q2",
          prompt:
            "對 n = 100 個樣本做 10-fold CV，每個 fold 用多少樣本訓練？",
          choices: [
            { id: "a", label: "10" },
            { id: "b", label: "50" },
            { id: "c", label: "90" },
            { id: "d", label: "100" },
          ],
          answer: "c",
          explanation: "每個 fold 留出 n/K = 10 個樣本，所以模型在 100 − 10 = 90 個樣本上訓練。",
        },
        {
          id: "q3",
          type: "numeric",
          prompt:
            "一個 OLS 擬合在某測試點有不可約雜訊變異 σ² = 1、模型 bias² = 0.5、模型變異 = 0.3。預測平方誤差的期望是？",
          answer: 1.8,
          tolerance: 0.05,
          hint: "把三項加起來。",
          explanation: "MSE_test = σ² + bias² + var = 1 + 0.5 + 0.3 = 1.8。",
        },
        {
          id: "q4",
          type: "ordering",
          prompt: "把 K-fold 交叉驗證的步驟重新排序。",
          steps: [
            { id: "s1", label: "把訓練資料切成 K 個等大小的 fold" },
            { id: "s2", label: "對每個 fold k，把它當作驗證集留下" },
            { id: "s3", label: "在剩下的 K − 1 個 fold 上擬合模型" },
            { id: "s4", label: "在 fold k 上計算驗證誤差" },
            { id: "s5", label: "K 個 fold 都跑完後取平均" },
            { id: "s6", label: "用這個平均 CV 誤差作為模型期望測試誤差的估計" },
          ],
          explanation: "切 → 對每個 fold（留出 → 訓練 → 評估）→ 取平均 → 報告。",
        },
      ],
      furtherReading: [
        { title: "Hastie, Tibshirani & Friedman — Elements of Statistical Learning, ch. 7" },
        { title: "James, Witten, Hastie & Tibshirani — An Introduction to Statistical Learning, ch. 5" },
        { title: "Stone — 'Cross-Validatory Choice and Assessment of Statistical Predictions' (1974)" },
      ],
    },
  },
};

export default chapter;
