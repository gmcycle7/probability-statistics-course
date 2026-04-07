import { Chapter } from "../types";
import { M } from "@/components/math/Math";
import { FormulaBlock } from "@/components/math/FormulaBlock";
import { TheoremCard } from "@/components/math/TheoremCard";
import { ProofStepper } from "@/components/math/ProofStepper";
import { EstimatorComparisonLab } from "@/components/interactive/EstimatorComparisonLab";
import { SectionHeader } from "@/components/learning/SectionHeader";

const chapter: Chapter = {
  meta: {
    slug: "estimators-bias-variance-mse",
    module: "D_inference",
    number: 7,
    minutes: 35,
    level: 3,
    prereqs: ["central-limit-theorem"],
    tags: ["estimator", "bias", "variance", "MSE"],
  },
  localized: {
    en: {
      title: "Estimators, Bias, Variance & MSE",
      subtitle:
        "An estimator is a recipe for guessing a parameter from data. Three numbers tell you how good it is — and they trade off in a way that drives most of modern statistics.",
      hook: "Why an unbiased estimator can be worse than a biased one — and the bias-variance trade-off behind every regularised model.",
      whyItMatters: (
        <>
          Before you can talk about MLE, MAP, ridge regression, kernel
          smoothing, or neural-network generalisation, you need a precise
          vocabulary for &quot;how good is this estimator?&quot;. The answer
          turns out to be three quantities — <em>bias</em>, <em>variance</em>,
          and their combination <em>MSE</em> — that trade off against each
          other. Almost every modern statistical and ML technique can be
          framed as managing this trade-off.
        </>
      ),
      intuition: (
        <>
          <p>
            An estimator is a function of the data:{" "}
            <M>{`\\hat\\theta = T(X_1, \\dots, X_n)`}</M>. Different choices
            of <M>T</M> give different estimators of the same parameter.
            How do you compare them?
          </p>
          <p>
            Three numbers do the work:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 mt-2">
            <li>
              <strong>Bias</strong> — on average, how far is{" "}
              <M>{`\\hat\\theta`}</M> from the truth?
            </li>
            <li>
              <strong>Variance</strong> — how much does{" "}
              <M>{`\\hat\\theta`}</M> wobble around its own average from
              sample to sample?
            </li>
            <li>
              <strong>MSE</strong> — the average squared distance from the
              truth. Magically, MSE = bias² + variance.
            </li>
          </ul>
          <p>
            The surprise: a slightly biased estimator with much smaller
            variance can have lower MSE than the unbiased one. That single
            insight is the seed of regularisation, shrinkage, ridge, James–Stein,
            and the entire bias-variance trade-off in machine learning.
          </p>
        </>
      ),
      formal: (
        <>
          <p>
            Let <M>{`X_1, \\dots, X_n`}</M> be drawn i.i.d. from a distribution
            with parameter <M>θ</M>. An <em>estimator</em> of <M>θ</M> is any
            function <M>{`\\hat\\theta = T(X_1, \\dots, X_n)`}</M>. Its{" "}
            <em>bias</em>, <em>variance</em>, and <em>mean squared error</em>{" "}
            are
          </p>
          <FormulaBlock
            formula={`\\text{Bias}(\\hat\\theta) = E[\\hat\\theta] - \\theta, \\quad \\text{Var}(\\hat\\theta) = E\\!\\left[(\\hat\\theta - E[\\hat\\theta])^2\\right]`}
          />
          <FormulaBlock
            formula={`\\text{MSE}(\\hat\\theta) = E\\!\\left[(\\hat\\theta - \\theta)^2\\right] = \\text{Var}(\\hat\\theta) + \\text{Bias}(\\hat\\theta)^2`}
            question="On average, how far off is the estimator?"
          />
          <p>
            An estimator is <em>unbiased</em> if{" "}
            <M>{`\\text{Bias}(\\hat\\theta) = 0`}</M> for every <M>θ</M>. It is{" "}
            <em>consistent</em> if{" "}
            <M>{`\\hat\\theta_n \\xrightarrow{P} \\theta`}</M> as{" "}
            <M>n→∞</M>. Note: unbiased and consistent are independent —
            you can have either without the other.
          </p>
        </>
      ),
      graduate: (
        <>
          <p>
            <strong>The MSE decomposition is one line.</strong> Let{" "}
            <M>{`\\bar{\\hat\\theta} = E[\\hat\\theta]`}</M>. Then
          </p>
          <FormulaBlock
            formula={`E[(\\hat\\theta-\\theta)^2] = E[((\\hat\\theta - \\bar{\\hat\\theta}) + (\\bar{\\hat\\theta} - \\theta))^2] = \\text{Var}(\\hat\\theta) + \\text{Bias}(\\hat\\theta)^2`}
          />
          <p>
            because the cross term{" "}
            <M>{`2 E[(\\hat\\theta - \\bar{\\hat\\theta})] (\\bar{\\hat\\theta} - \\theta) = 0`}</M>.
            This identity is the seed of bias-variance decomposition in
            prediction (where <M>θ</M> becomes the noise-free target) — the
            <em> exact same algebra</em> shows up in the test error of a
            regression model.
          </p>
          <p>
            <strong>Admissibility.</strong> An estimator is{" "}
            <em>inadmissible</em> if there exists another estimator with{" "}
            <em>uniformly smaller</em> MSE (no worse for any θ, strictly
            better for some). Stein&apos;s 1956 paradox: in dimension <M>{`p \\ge 3`}</M>,
            the obvious unbiased estimator{" "}
            <M>{`\\bar X`}</M> for the mean of a multivariate Normal is
            inadmissible — the James–Stein shrinkage estimator{" "}
            <M>{`\\hat\\theta_{JS} = (1 - (p-2)\\sigma^2/\\|\\bar X\\|^2)\\bar X`}</M>{" "}
            uniformly dominates it. This is the deepest argument for why
            shrinking matters.
          </p>
          <p>
            <strong>Consistency vs efficiency.</strong> Consistency just says
            you reach the truth in the limit. Efficiency asks how fast.
            For unbiased estimators, the Cramér–Rao lower bound gives the
            minimum possible variance: <M>{`\\text{Var}(\\hat\\theta) \\ge 1/(n I(\\theta))`}</M>.
            An estimator that attains this bound is called{" "}
            <em>efficient</em>. The MLE is asymptotically efficient under
            regularity conditions — that&apos;s the deep result that
            justifies its dominance in practice.
          </p>
          <p>
            <strong>Common misuse.</strong> &quot;The unbiased version is
            always better&quot; is wrong. The classic counter-example is the
            sample variance with denominator <M>n</M> (the MLE) versus
            denominator <M>{`n-1`}</M> (Bessel-corrected, unbiased). For
            <em> mean squared error</em>, the biased denominator-<M>n</M>{" "}
            version actually has slightly lower MSE in most regimes.
          </p>
        </>
      ),
      body: (
        <>
          <SectionHeader step={1} title="Three estimators, one parameter" blurb="Sampling distributions for three competing estimators of μ. Watch how shrinkage trades bias for variance." />
          <EstimatorComparisonLab />

          <SectionHeader step={2} title="Derivation: MSE = bias² + variance" />
          <ProofStepper
            title="Decomposing MSE"
            steps={[
              { title: "Start from the definition.", math: "\\text{MSE}(\\hat\\theta) = E[(\\hat\\theta - \\theta)^2]" },
              { title: "Add and subtract E[θ̂].", math: "= E[((\\hat\\theta - E[\\hat\\theta]) + (E[\\hat\\theta] - \\theta))^2]" },
              { title: "Expand the square.", math: "= E[(\\hat\\theta - E[\\hat\\theta])^2] + 2E[(\\hat\\theta - E[\\hat\\theta])](E[\\hat\\theta] - \\theta) + (E[\\hat\\theta] - \\theta)^2" },
              { title: "Note that the middle term is zero.", math: "E[\\hat\\theta - E[\\hat\\theta]] = 0", reason: "By definition of the mean: deviations from the mean average to zero." },
              { title: "Recognise the surviving terms.", math: "= \\text{Var}(\\hat\\theta) + \\text{Bias}(\\hat\\theta)^2", reason: "Variance is the first term; squared bias is the third. The identity is exact." },
            ]}
          />

          <TheoremCard
            kind="theorem"
            name="Bias-variance trade-off"
            statement={
              <>
                For any estimator <M>{`\\hat\\theta`}</M> of <M>θ</M>:
              </>
            }
            formula={`\\text{MSE}(\\hat\\theta) = \\text{Var}(\\hat\\theta) + \\text{Bias}(\\hat\\theta)^2.`}
          >
            Allowing a small bias in exchange for a much smaller variance can
            decrease MSE. This is the principle behind every regularised
            estimator in modern statistics and machine learning.
          </TheoremCard>

          <SectionHeader step={3} title="Worked example: variance estimators" />
          <p className="text-ink-dim leading-relaxed">
            For <M>{`X_i \\sim \\mathcal{N}(\\mu, \\sigma^2)`}</M>, two
            estimators of <M>{`\\sigma^2`}</M>:
          </p>
          <FormulaBlock formula={`\\hat\\sigma^2_{\\text{MLE}} = \\frac{1}{n}\\sum_i (X_i - \\bar X)^2, \\qquad S^2 = \\frac{1}{n-1}\\sum_i (X_i - \\bar X)^2.`} />
          <p className="text-ink-dim leading-relaxed">
            The MLE has bias <M>{`-\\sigma^2/n`}</M> (it systematically
            underestimates) but variance{" "}
            <M>{`2(n-1)\\sigma^4/n^2`}</M>. The unbiased <M>{`S^2`}</M> has
            zero bias but variance <M>{`2\\sigma^4/(n-1)`}</M>. Plug into the
            MSE formula and you&apos;ll find the biased MLE has lower MSE for
            every finite n — yet textbooks teach <M>{`S^2`}</M> because
            unbiasedness has its own nice properties (like being a UMVUE
            under sufficiency conditions).
          </p>
        </>
      ),
      misconceptions: [
        {
          wrong: "Unbiased always means best.",
          right:
            "Bias is one of three numbers, not the only one. The biased MLE for variance has lower MSE than the unbiased S² for every finite n — yet we still teach S². The trade-off matters.",
        },
        {
          wrong: "Consistency means the estimator is accurate.",
          right:
            "Consistency only says it reaches the truth in the limit. A consistent estimator with huge finite-sample variance is still bad in practice. Always pair consistency with a rate (CLT-style).",
        },
        {
          wrong: "Bias and variance are independent quantities you can fix separately.",
          right:
            "They are linked: estimators that reduce variance almost always introduce bias (e.g. ridge, smoothing, shrinkage). The art is finding the optimum on the trade-off curve.",
        },
      ],
      takeaways: [
        "An estimator is any function of the data; comparing them requires more than one number.",
        "MSE = Var + Bias². This identity is exact and derives the bias-variance trade-off.",
        "Unbiased ≠ best. A biased estimator can have lower MSE.",
        "Consistency is asymptotic (you reach the truth); efficiency is the rate (Cramér–Rao gives the floor).",
        "Stein's paradox: shrinking the obvious unbiased estimator can uniformly improve MSE in dimension ≥ 3.",
      ],
      quiz: [
        {
          id: "q1",
          prompt: "An estimator has bias = 0.5 and variance = 1.0. What is its MSE?",
          choices: [
            { id: "a", label: "1.0" },
            { id: "b", label: "1.25" },
            { id: "c", label: "1.5" },
            { id: "d", label: "0.5" },
          ],
          answer: "b",
          explanation: "MSE = Bias² + Var = 0.25 + 1.0 = 1.25.",
        },
        {
          id: "q2",
          prompt: "Which statement about consistency is correct?",
          choices: [
            { id: "a", label: "Consistent estimators are always unbiased." },
            { id: "b", label: "Consistency implies the estimator reaches the truth in probability as n → ∞." },
            { id: "c", label: "Consistency is the same as low MSE for fixed n." },
            { id: "d", label: "Consistency implies efficiency." },
          ],
          answer: "b",
          explanation:
            "Consistency = θ̂_n → θ in probability. It's an asymptotic statement; finite-sample bias and variance can still be large.",
        },
        {
          id: "q3",
          prompt:
            "You shrink an unbiased estimator X̄ by multiplying by k=0.9. Compared to X̄, the shrunk estimator k·X̄ has...",
          choices: [
            { id: "a", label: "Lower variance, zero bias" },
            { id: "b", label: "Lower variance, non-zero bias" },
            { id: "c", label: "Higher variance, non-zero bias" },
            { id: "d", label: "Same variance, zero bias" },
          ],
          answer: "b",
          explanation:
            "Var(k·X̄) = k²Var(X̄) — strictly smaller for |k| < 1. But E[k·X̄] = kμ ≠ μ unless μ = 0, so it's biased.",
        },
        {
          id: "q4",
          type: "numeric",
          prompt:
            "An estimator has bias = 0.2 and variance = 0.6. Compute its MSE.",
          answer: 0.64,
          tolerance: 0.01,
          hint: "MSE = bias² + variance.",
          explanation: "MSE = 0.04 + 0.6 = 0.64.",
        },
        {
          id: "q5",
          type: "ordering",
          prompt: "Re-order the derivation of MSE = bias² + variance.",
          steps: [
            { id: "s1", label: "Start from MSE(θ̂) = E[(θ̂ − θ)²]" },
            { id: "s2", label: "Add and subtract E[θ̂] inside the square" },
            { id: "s3", label: "Expand the square to get three terms" },
            { id: "s4", label: "Note that the cross term has expectation zero" },
            { id: "s5", label: "Recognise the surviving variance + bias² terms" },
          ],
          explanation: "Definition → add/subtract → expand → cross term vanishes → recognise.",
        },
      ],
      furtherReading: [
        { title: "Casella & Berger — Statistical Inference, ch. 7" },
        { title: "Wasserman — All of Statistics, ch. 6" },
        { title: "Stein, 'Inadmissibility of the usual estimator for the mean of a multivariate normal distribution' (1956)" },
      ],
    },

    zh: {
      title: "估計量、偏誤、變異數與 MSE",
      subtitle:
        "估計量是「從資料猜參數」的食譜。三個數字告訴你它有多好 ── 而它們之間的權衡，正驅動著現代統計學的大半。",
      hook: "為什麼有偏的估計量可能比不偏的更好 ── 以及隱藏在每個正則化模型背後的偏誤–變異數權衡。",
      whyItMatters: (
        <>
          在你能談 MLE、MAP、ridge 迴歸、核平滑、或神經網路的泛化之前，
          你需要對「這個估計量到底有多好？」有一個精確的詞彙。
          答案是三個量 ──<em>偏誤</em>、<em>變異數</em>，
          以及它們的組合<em>均方誤差（MSE）</em>── 它們會互相權衡。
          幾乎所有現代統計與機器學習技術，都可以被框成「在這個權衡上做選擇」。
        </>
      ),
      intuition: (
        <>
          <p>
            估計量就是資料的一個函數：
            <M>{`\\hat\\theta = T(X_1, \\dots, X_n)`}</M>。
            不同的 <M>T</M> 對同一個參數會給出不同的估計量。
            該怎麼比較它們？
          </p>
          <p>三個數字就能搞定：</p>
          <ul className="list-disc pl-6 space-y-1.5 mt-2">
            <li>
              <strong>偏誤（bias）</strong> ── 平均而言，
              <M>{`\\hat\\theta`}</M> 離真值有多遠？
            </li>
            <li>
              <strong>變異數</strong> ── 在一次又一次的取樣下，
              <M>{`\\hat\\theta`}</M> 在它自己的平均附近抖動得有多厲害？
            </li>
            <li>
              <strong>MSE</strong> ── 與真值的平均平方距離。
              神奇地，MSE = bias² + variance。
            </li>
          </ul>
          <p>
            驚喜在這裡：一個略有偏誤、但變異數小很多的估計量，
            可能 MSE 比不偏的還小。
            這個洞見就是正則化、shrinkage、ridge、James–Stein，
            以及機器學習裡整個偏誤–變異數權衡的種子。
          </p>
        </>
      ),
      formal: (
        <>
          <p>
            設 <M>{`X_1, \\dots, X_n`}</M> 為從具有參數 <M>θ</M> 的分布抽出的 i.i.d. 樣本。
            <M>θ</M> 的<em>估計量</em>是任何函數{" "}
            <M>{`\\hat\\theta = T(X_1, \\dots, X_n)`}</M>。
            它的<em>偏誤</em>、<em>變異數</em>、與<em>均方誤差</em>定義為：
          </p>
          <FormulaBlock
            formula={`\\text{Bias}(\\hat\\theta) = E[\\hat\\theta] - \\theta, \\quad \\text{Var}(\\hat\\theta) = E\\!\\left[(\\hat\\theta - E[\\hat\\theta])^2\\right]`}
          />
          <FormulaBlock
            formula={`\\text{MSE}(\\hat\\theta) = E\\!\\left[(\\hat\\theta - \\theta)^2\\right] = \\text{Var}(\\hat\\theta) + \\text{Bias}(\\hat\\theta)^2`}
            question="這個估計量「平均而言」會差多少？"
          />
          <p>
            一個估計量是<em>不偏的</em>，若對所有 <M>θ</M>，
            <M>{`\\text{Bias}(\\hat\\theta) = 0`}</M>。
            它是<em>一致的</em>，若當 <M>n→∞</M>，
            <M>{`\\hat\\theta_n \\xrightarrow{P} \\theta`}</M>。
            注意：「不偏」與「一致」是獨立的兩件事 ── 你可以擁有其中一個而沒有另一個。
          </p>
        </>
      ),
      graduate: (
        <>
          <p>
            <strong>MSE 分解只要一行。</strong>
            設 <M>{`\\bar{\\hat\\theta} = E[\\hat\\theta]`}</M>，那麼
          </p>
          <FormulaBlock
            formula={`E[(\\hat\\theta-\\theta)^2] = E[((\\hat\\theta - \\bar{\\hat\\theta}) + (\\bar{\\hat\\theta} - \\theta))^2] = \\text{Var}(\\hat\\theta) + \\text{Bias}(\\hat\\theta)^2`}
          />
          <p>
            因為交叉項{" "}
            <M>{`2 E[(\\hat\\theta - \\bar{\\hat\\theta})] (\\bar{\\hat\\theta} - \\theta) = 0`}</M>。
            這個恆等式正是「預測中的偏誤–變異數分解」的種子
            （在那裡 <M>θ</M> 變成「無雜訊的目標」）──
            <em>完全相同</em>的代數，會出現在迴歸模型測試誤差的分析裡。
          </p>
          <p>
            <strong>容許性（admissibility）。</strong>
            一個估計量被稱為<em>不可容許的（inadmissible）</em>，
            若存在另一個估計量在<em>所有</em> θ 上 MSE 都不大於它，
            且至少在某個 θ 上嚴格較小。
            Stein 在 1956 年的悖論：
            在維度 <M>{`p \\ge 3`}</M> 下，多元常態的明顯不偏估計量{" "}
            <M>{`\\bar X`}</M> 是不可容許的 ──
            James–Stein 縮減估計量{" "}
            <M>{`\\hat\\theta_{JS} = (1 - (p-2)\\sigma^2/\\|\\bar X\\|^2)\\bar X`}</M>{" "}
            一致地優於它。這是「為什麼縮減重要」最深的論證。
          </p>
          <p>
            <strong>一致性 vs 有效性。</strong>
            一致性只說「在極限下會到達真值」；
            有效性問的是「速度有多快」。
            對於不偏估計量，Cramér–Rao 下界給出最小可能的變異數：
            <M>{`\\text{Var}(\\hat\\theta) \\ge 1/(n I(\\theta))`}</M>。
            達成這個下界的估計量被稱為<em>有效</em>。
            MLE 在規則條件下是漸近有效 ──
            這就是它在實務上佔主導地位的深層理由。
          </p>
          <p>
            <strong>常見誤用。</strong>「不偏的版本永遠比較好」是錯的。
            經典反例是「分母為 <M>n</M> 的樣本變異數（MLE）」對「分母為 <M>{`n-1`}</M> 的版本（Bessel 修正、不偏）」。
            就<em>均方誤差</em>而言，
            分母為 <M>n</M> 的有偏版本，在大多數情況下 MSE 還比較小一點。
          </p>
        </>
      ),
      body: (
        <>
          <SectionHeader step={1} title="三個估計量、一個參數" blurb="三個對 μ 的競爭估計量的抽樣分布。看 shrinkage 如何用偏誤換取變異數。" />
          <EstimatorComparisonLab />

          <SectionHeader step={2} title="推導：MSE = bias² + variance" />
          <ProofStepper
            title="MSE 的分解"
            steps={[
              { title: "從定義出發。", math: "\\text{MSE}(\\hat\\theta) = E[(\\hat\\theta - \\theta)^2]" },
              { title: "加減 E[θ̂]。", math: "= E[((\\hat\\theta - E[\\hat\\theta]) + (E[\\hat\\theta] - \\theta))^2]" },
              { title: "展開平方。", math: "= E[(\\hat\\theta - E[\\hat\\theta])^2] + 2E[(\\hat\\theta - E[\\hat\\theta])](E[\\hat\\theta] - \\theta) + (E[\\hat\\theta] - \\theta)^2" },
              { title: "注意中間項為零。", math: "E[\\hat\\theta - E[\\hat\\theta]] = 0", reason: "由平均值的定義：偏離平均的部分平均起來是零。" },
              { title: "辨認剩下的項。", math: "= \\text{Var}(\\hat\\theta) + \\text{Bias}(\\hat\\theta)^2", reason: "第一項是變異數，第三項是偏誤的平方。這個恆等式是精確的。" },
            ]}
          />

          <TheoremCard
            kind="theorem"
            name="偏誤–變異數權衡"
            statement={
              <>
                對任何 <M>θ</M> 的估計量 <M>{`\\hat\\theta`}</M>：
              </>
            }
            formula={`\\text{MSE}(\\hat\\theta) = \\text{Var}(\\hat\\theta) + \\text{Bias}(\\hat\\theta)^2.`}
          >
            允許一點點偏誤來換取顯著更小的變異數，可以降低 MSE。
            這是現代統計學與機器學習裡每個正則化估計量背後的原則。
          </TheoremCard>

          <SectionHeader step={3} title="工作範例：兩個變異數估計量" />
          <p className="text-ink-dim leading-relaxed">
            對 <M>{`X_i \\sim \\mathcal{N}(\\mu, \\sigma^2)`}</M>，
            <M>{`\\sigma^2`}</M> 的兩個估計量為：
          </p>
          <FormulaBlock formula={`\\hat\\sigma^2_{\\text{MLE}} = \\frac{1}{n}\\sum_i (X_i - \\bar X)^2, \\qquad S^2 = \\frac{1}{n-1}\\sum_i (X_i - \\bar X)^2.`} />
          <p className="text-ink-dim leading-relaxed">
            MLE 的偏誤是 <M>{`-\\sigma^2/n`}</M>（它系統性地低估），
            變異數為 <M>{`2(n-1)\\sigma^4/n^2`}</M>。
            不偏的 <M>{`S^2`}</M> 偏誤為零，但變異數為{" "}
            <M>{`2\\sigma^4/(n-1)`}</M>。
            把兩者代入 MSE 公式，你會發現有偏的 MLE 在每個有限的 n 下 MSE 都比較小 ──
            可是教科書還是教 <M>{`S^2`}</M>，
            因為「不偏」本身有它自己的好性質
            （在充分性條件下它甚至是 UMVUE）。
          </p>
        </>
      ),
      misconceptions: [
        {
          wrong: "「不偏」永遠等於「最好」。",
          right:
            "偏誤是三個數字裡的一個，不是唯一的一個。變異數的有偏 MLE 在每個有限 n 下 MSE 都比不偏的 S² 小 ── 但我們還是教 S²。權衡是真實存在的。",
        },
        {
          wrong: "「一致」就代表估計量很準。",
          right:
            "一致只說「在極限下會到達真值」。一個一致但有限樣本變異數巨大的估計量，在實務上仍然是糟糕的。永遠把一致性和「速率」（CLT 風格）一起看。",
        },
        {
          wrong: "偏誤和變異數是兩個獨立的量，可以分開修。",
          right:
            "它們是連動的：能降低變異數的估計量幾乎一定會引入偏誤（例如 ridge、平滑、shrinkage）。藝術在於找到權衡曲線上的最佳點。",
        },
      ],
      takeaways: [
        "估計量是任何資料的函數；比較它們時不能只看一個數字。",
        "MSE = Var + Bias²。這個恆等式是精確的，並推導出偏誤–變異數權衡。",
        "「不偏」≠「最好」。有偏的估計量可以擁有更低的 MSE。",
        "一致性是漸近的（會到達真值）；有效性是速率（Cramér–Rao 給出下界）。",
        "Stein 悖論：在維度 ≥ 3 下，縮減「明顯不偏」的估計量可以「一致地」改善 MSE。",
      ],
      quiz: [
        {
          id: "q1",
          prompt: "一個估計量的 bias = 0.5、variance = 1.0。它的 MSE 是？",
          choices: [
            { id: "a", label: "1.0" },
            { id: "b", label: "1.25" },
            { id: "c", label: "1.5" },
            { id: "d", label: "0.5" },
          ],
          answer: "b",
          explanation: "MSE = Bias² + Var = 0.25 + 1.0 = 1.25。",
        },
        {
          id: "q2",
          prompt: "下列關於「一致性」的敘述何者正確？",
          choices: [
            { id: "a", label: "一致估計量永遠不偏。" },
            { id: "b", label: "一致代表當 n → ∞ 時，估計量在機率上會到達真值。" },
            { id: "c", label: "一致就等同於「在固定 n 下 MSE 很低」。" },
            { id: "d", label: "一致蘊含有效。" },
          ],
          answer: "b",
          explanation:
            "一致 = θ̂_n → θ 在機率上收斂。這是漸近的陳述；有限樣本下的偏誤與變異數仍可能很大。",
        },
        {
          id: "q3",
          prompt:
            "你把不偏估計量 X̄ 乘上 k=0.9 縮減。相對於 X̄，縮減後的估計量 k·X̄ 是？",
          choices: [
            { id: "a", label: "變異數較低、零偏誤" },
            { id: "b", label: "變異數較低、非零偏誤" },
            { id: "c", label: "變異數較高、非零偏誤" },
            { id: "d", label: "相同變異數、零偏誤" },
          ],
          answer: "b",
          explanation:
            "Var(k·X̄) = k²Var(X̄) ── 對 |k| < 1 嚴格較小。但 E[k·X̄] = kμ ≠ μ（除非 μ = 0），所以是有偏的。",
        },
        {
          id: "q4",
          type: "numeric",
          prompt:
            "一個估計量的 bias = 0.2、variance = 0.6。計算它的 MSE。",
          answer: 0.64,
          tolerance: 0.01,
          hint: "MSE = bias² + variance。",
          explanation: "MSE = 0.04 + 0.6 = 0.64。",
        },
        {
          id: "q5",
          type: "ordering",
          prompt: "把 MSE = bias² + variance 的推導重新排序。",
          steps: [
            { id: "s1", label: "從 MSE(θ̂) = E[(θ̂ − θ)²] 出發" },
            { id: "s2", label: "在平方內加減 E[θ̂]" },
            { id: "s3", label: "展開平方得到三項" },
            { id: "s4", label: "注意交叉項的期望值為零" },
            { id: "s5", label: "辨認剩下的 variance + bias² 兩項" },
          ],
          explanation: "定義 → 加減 → 展開 → 交叉項消失 → 辨認。",
        },
      ],
      furtherReading: [
        { title: "Casella & Berger — Statistical Inference, ch. 7" },
        { title: "Wasserman — All of Statistics, ch. 6" },
        { title: "Stein, 'Inadmissibility of the usual estimator for the mean of a multivariate normal distribution' (1956)" },
      ],
    },
  },
};

export default chapter;
