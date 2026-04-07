import { Chapter } from "../types";
import { M, MD } from "@/components/math/Math";
import { FormulaBlock } from "@/components/math/FormulaBlock";
import { TheoremCard } from "@/components/math/TheoremCard";
import { ProofStepper } from "@/components/math/ProofStepper";
import { ExpectationVarianceLab } from "@/components/interactive/ExpectationVarianceLab";
import { SectionHeader } from "@/components/learning/SectionHeader";

const chapter: Chapter = {
  meta: {
    slug: "random-variables-expectation-variance",
    module: "B_random_variables",
    number: 2,
    minutes: 40,
    level: 3,
    prereqs: ["conditional-probability-and-bayes"],
    tags: ["expectation", "variance", "moments"],
  },
  localized: {
    en: {
      title: "Random Variables, Expectation & Variance",
      subtitle:
        "From outcomes to numbers. From numbers to summaries that compress an entire distribution into a few moments.",
      hook: "Why E[X] is a balance point and Var(X) is the spread of mass around it — and why both shape every estimator you'll ever build.",
      whyItMatters: (
        <>
          Outcomes are messy; numbers are tractable. A <em>random variable</em>{" "}
          is a function that turns outcomes into numbers, so we can finally talk
          about means, spreads, correlations, and limits. Every statistic you
          ever compute — sample averages, regression coefficients, neural-network
          losses — is ultimately a function of random variables, and almost all
          of the magic flows from two summaries: <em>expectation</em> and{" "}
          <em>variance</em>.
        </>
      ),
      intuition: (
        <>
          <p>
            Imagine the distribution of a random variable as a pile of mass
            spread along the number line. <strong>Expectation</strong> is its{" "}
            <em>balance point</em>: the place where the pile balances on a
            knife-edge. <strong>Variance</strong> is the average squared
            distance from that balance point — a measure of how stretched-out
            the pile is.
          </p>
          <p>
            Why squared and not absolute distance? Two reasons. (1) Squares are
            smooth and additive: <M>{`\\text{Var}(X+Y)=\\text{Var}(X)+\\text{Var}(Y)`}</M>{" "}
            when independent — a magical fact that breaks under absolute
            values. (2) Squared distance is the unique loss whose minimiser is
            the mean (try the proof below). The whole edifice of least-squares
            regression, ANOVA, and Kalman filtering rests on this choice.
          </p>
        </>
      ),
      formal: (
        <>
          <p>
            Let <M>{`(\\Omega, \\mathcal{F}, P)`}</M> be a probability space. A{" "}
            <em>random variable</em> is a measurable function{" "}
            <M>{`X:\\Omega\\to\\mathbb{R}`}</M>. Its <em>distribution</em> is
            described by either a probability mass function{" "}
            <M>{`p_X(x)=P(X=x)`}</M> in the discrete case, or a density{" "}
            <M>{`f_X(x)`}</M> with{" "}
            <M>{`P(a\\le X\\le b)=\\int_a^b f_X(x)\\,dx`}</M> in the continuous
            case. The cumulative distribution function{" "}
            <M>{`F_X(x)=P(X\\le x)`}</M> is the universal description that
            works for both.
          </p>
          <p>The <em>expectation</em> of <M>{`X`}</M> is</p>
          <FormulaBlock
            formula={`E[X] \\;=\\; \\sum_x x\\, p_X(x) \\quad \\text{or} \\quad \\int_{-\\infty}^{\\infty} x\\, f_X(x)\\, dx`}
            question="Where is the centre of mass of the distribution?"
          />
          <p>The <em>variance</em> is</p>
          <FormulaBlock
            formula={`\\text{Var}(X) \\;=\\; E\\big[(X-E[X])^2\\big] \\;=\\; E[X^2] - (E[X])^2`}
            question="How spread out is the mass around its centre?"
          />
          <p>Useful linearity facts that you must internalise:</p>
          <MD>{`E[aX + bY + c] = aE[X] + bE[Y] + c \\quad \\text{(always)},`}</MD>
          <MD>{`\\text{Var}(aX + b) = a^2 \\text{Var}(X), \\qquad \\text{Var}(X+Y) = \\text{Var}(X) + \\text{Var}(Y) + 2\\,\\text{Cov}(X,Y).`}</MD>
        </>
      ),
      graduate: (
        <>
          <p>
            <strong>Measure-theoretic definition.</strong> Properly,{" "}
            <M>{`E[X]=\\int_\\Omega X\\,dP`}</M>, a Lebesgue integral with
            respect to the underlying measure. The integral exists in the
            extended sense iff <M>{`E[X^+]<\\infty`}</M> or{" "}
            <M>{`E[X^-]<\\infty`}</M>, and <M>{`X`}</M> is &quot;integrable&quot;
            iff <M>{`E[|X|]<\\infty`}</M>. This unifies the discrete and
            continuous formulas under a single object.
          </p>
          <p>
            <strong>Why squared loss is special: a one-line theorem.</strong>{" "}
            The minimiser of <M>{`g(c)=E[(X-c)^2]`}</M> over{" "}
            <M>{`c\\in\\mathbb{R}`}</M> is <M>{`c^*=E[X]`}</M>. (Differentiate,
            set to zero.) More generally, conditional expectation{" "}
            <M>{`E[X\\mid \\mathcal{G}]`}</M> is the <em>orthogonal projection</em>{" "}
            of <M>{`X`}</M> onto the subspace of <M>{`\\mathcal{G}`}</M>-measurable
            square-integrable functions. That is the deep reason why best
            linear predictors and conditional expectations look so similar.
          </p>
          <p>
            <strong>Moments and moment generating functions.</strong> The{" "}
            <M>{`k`}</M>-th moment is <M>{`m_k=E[X^k]`}</M>. The MGF{" "}
            <M>{`M_X(t)=E[e^{tX}]`}</M> packages all moments into a single
            analytic function: <M>{`m_k=M_X^{(k)}(0)`}</M>. When the MGF exists
            in a neighbourhood of 0, it determines the distribution uniquely.
            Many CLT-style proofs go via MGFs because convergence of MGFs
            implies convergence in distribution under mild conditions.
          </p>
          <p>
            <strong>A common misuse.</strong> &quot;The expectation of a ratio
            is the ratio of expectations.&quot; <em>Wrong.</em> In general{" "}
            <M>{`E[X/Y]\\ne E[X]/E[Y]`}</M>. This trips up A/B-test analysts,
            ratio estimators, and anyone who computes &quot;average of
            percentages&quot;. Use the delta method or simulation to get the
            right answer.
          </p>
        </>
      ),
      body: (
        <>
          <SectionHeader step={1} title="Build a distribution by hand" blurb="Drag the weights. Feel how E[X] follows the bulk of the mass and how Var(X) explodes when the tails get heavy." />
          <ExpectationVarianceLab />

          <SectionHeader step={2} title="Derivation: variance shortcut" blurb="The identity Var(X) = E[X²] − (E[X])² is the most-used algebraic move in probability." />
          <ProofStepper
            title="Var(X) = E[X²] − (E[X])²"
            steps={[
              { title: "Start from the definition.", math: "\\text{Var}(X) = E[(X-E[X])^2]" },
              { title: "Expand the square inside the expectation.", math: "= E[X^2 - 2X\\,E[X] + (E[X])^2]" },
              { title: "Apply linearity of expectation.", math: "= E[X^2] - 2E[X]\\cdot E[X] + (E[X])^2", reason: "E[X] is a constant, so E[2X·E[X]] = 2E[X]·E[X]." },
              { title: "Simplify.", math: "= E[X^2] - (E[X])^2" },
            ]}
          />

          <TheoremCard
            kind="theorem"
            name="Linearity of expectation"
            statement={
              <>For any random variables <M>{`X, Y`}</M> with finite means and constants <M>{`a, b\\in\\mathbb{R}`}</M>:</>
            }
            formula={`E[aX + bY] = aE[X] + bE[Y].`}
          >
            Linearity holds <em>even when X and Y are dependent</em>. This is
            why &quot;total expected revenue across products&quot; can be split
            into a sum of per-product expectations no matter how correlated
            their sales are.
          </TheoremCard>

          <SectionHeader step={3} title="Worked example: variance of a sum of indicators" />
          <p className="text-ink-dim leading-relaxed">
            Roll <M>{`n`}</M> fair dice. Let <M>{`X`}</M> be the number of
            sixes. Write <M>{`X = \\sum_i \\mathbb{1}\\{D_i = 6\\}`}</M>.
            Then <M>{`E[X] = n/6`}</M> by linearity. For the variance, since
            the dice are independent,{" "}
            <M>{`\\text{Var}(X) = \\sum_i \\text{Var}(\\mathbb{1}_i) = n \\cdot (1/6)(5/6) = 5n/36`}</M>.
            The same trick (decompose into indicators, sum) is the engine
            behind almost every elementary expectation calculation.
          </p>
        </>
      ),
      misconceptions: [
        {
          wrong: "If two random variables have the same mean, they have the same distribution.",
          right:
            "Wildly different distributions can share a mean. The mean is one number; a distribution is an entire shape.",
          why: "Always pair the mean with at least the variance — and ideally a histogram — before reasoning about a distribution.",
        },
        {
          wrong: "E[g(X)] = g(E[X]).",
          right:
            "This is Jensen's gap. For convex g, E[g(X)] ≥ g(E[X]); for concave g, the inequality flips. Equality only holds for affine g or degenerate X.",
          why: "Ignoring this is why naive 'plug in the mean' calculations underestimate volatility, option prices, and entropy.",
        },
        {
          wrong: "Variance is always finite.",
          right:
            "Cauchy and many heavy-tailed distributions have undefined variance (and even undefined mean). The CLT and standard error formulas silently assume finite variance — when that fails, classical statistics breaks.",
        },
      ],
      takeaways: [
        "A random variable is a function from outcomes to numbers; its distribution is a pile of probability mass.",
        "E[X] is the centre of mass; Var(X) measures the average squared distance from it.",
        "Linearity of expectation always holds, independence or not. Use it relentlessly via indicator decomposition.",
        "The variance shortcut Var(X) = E[X²] − (E[X])² is the algebraic workhorse.",
        "Independence makes variances add; covariance is the correction term when it does not.",
      ],
      quiz: [
        {
          id: "q1",
          prompt: "Let X be the number of heads in 10 fair coin flips. What is Var(X)?",
          choices: [
            { id: "a", label: "5" },
            { id: "b", label: "2.5" },
            { id: "c", label: "10" },
            { id: "d", label: "0.25" },
          ],
          answer: "b",
          explanation: "X ~ Binomial(10, 0.5), so Var(X) = np(1-p) = 10·0.5·0.5 = 2.5.",
        },
        {
          id: "q2",
          prompt: "Which of these is always true for any X, Y?",
          choices: [
            { id: "a", label: "E[XY] = E[X]E[Y]" },
            { id: "b", label: "Var(X+Y) = Var(X) + Var(Y)" },
            { id: "c", label: "E[X+Y] = E[X] + E[Y]" },
            { id: "d", label: "E[1/X] = 1/E[X]" },
          ],
          answer: "c",
          explanation:
            "Linearity of expectation always holds. The other three require independence, identical distributions, or Jensen's inequality.",
        },
        {
          id: "q3",
          prompt: "If Var(X) = 4 and Y = 3X − 5, what is Var(Y)?",
          choices: [
            { id: "a", label: "12" },
            { id: "b", label: "31" },
            { id: "c", label: "36" },
            { id: "d", label: "9" },
          ],
          answer: "c",
          explanation: "Var(aX + b) = a² Var(X), so Var(Y) = 9·4 = 36.",
        },
        {
          id: "q4",
          type: "numeric",
          prompt:
            "X is a fair die (1..6). Compute Var(X). (Round to 2 decimals.)",
          answer: 2.92,
          tolerance: 0.05,
          hint: "E[X] = 3.5; E[X²] = (1+4+9+16+25+36)/6.",
          explanation: "E[X²] = 91/6 ≈ 15.17, E[X]² = 12.25, so Var = 15.17 − 12.25 ≈ 2.92.",
        },
        {
          id: "q5",
          type: "ordering",
          prompt: "Re-order the derivation of Var(X) = E[X²] − (E[X])².",
          steps: [
            { id: "s1", label: "Start from Var(X) = E[(X − E[X])²]" },
            { id: "s2", label: "Expand the square: E[X² − 2X·E[X] + (E[X])²]" },
            { id: "s3", label: "Apply linearity: E[X²] − 2E[X]·E[X] + (E[X])²" },
            { id: "s4", label: "Combine like terms: E[X²] − (E[X])²" },
          ],
          explanation: "Definition → expand → linearity → simplify.",
        },
      ],
      furtherReading: [
        { title: "Ross — A First Course in Probability, ch. 4–5" },
        { title: "Wasserman — All of Statistics, ch. 2–3" },
      ],
    },

    zh: {
      title: "隨機變數、期望值與變異數",
      subtitle:
        "從結果到數字。從數字到能把整個分布壓縮成幾個動差的摘要。",
      hook: "為什麼 E[X] 是「重心」、Var(X) 是「質量分散程度」 ── 以及它們為什麼形塑了你之後寫的每個估計量。",
      whyItMatters: (
        <>
          結果是雜亂的，數字才容易處理。<em>隨機變數</em>是一個把結果轉成數字的函數，
          這樣我們才能正式談論平均、分散、相關與極限。
          你計算過的每一個統計量 ── 樣本平均、迴歸係數、神經網路的損失 ──
          歸根究柢都是隨機變數的函數，
          而幾乎所有的魔法都從兩個摘要流出：<em>期望值</em>與<em>變異數</em>。
        </>
      ),
      intuition: (
        <>
          <p>
            把一個隨機變數的分布想像成一堆攤在數線上的質量。
            <strong>期望值</strong>是它的<em>重心</em>，
            就是整堆質量在刀口上能保持平衡的那個位置。
            <strong>變異數</strong>則是離這個重心的「平均平方距離」 ──
            一種衡量質量被拉開多遠的指標。
          </p>
          <p>
            為什麼用平方距離而不是絕對距離？兩個原因。
            (1) 平方平滑且具有可加性：當變數獨立時，
            <M>{`\\text{Var}(X+Y)=\\text{Var}(X)+\\text{Var}(Y)`}</M> ──
            這個美妙的性質在絕對值底下會壞掉。
            (2) 平方距離是「以期望值為極小化解」的唯一損失函數
            （下面有證明）。整個最小平方迴歸、ANOVA 與 Kalman 濾波的大廈，
            都建立在這個選擇上。
          </p>
        </>
      ),
      formal: (
        <>
          <p>
            設 <M>{`(\\Omega, \\mathcal{F}, P)`}</M> 是機率空間。
            <em>隨機變數</em>是一個可測函數{" "}
            <M>{`X:\\Omega\\to\\mathbb{R}`}</M>。
            它的<em>分布</em>由機率質量函數{" "}
            <M>{`p_X(x)=P(X=x)`}</M>（離散情形）
            或機率密度函數 <M>{`f_X(x)`}</M>（連續情形，
            滿足 <M>{`P(a\\le X\\le b)=\\int_a^b f_X(x)\\,dx`}</M>）描述。
            累積分布函數 <M>{`F_X(x)=P(X\\le x)`}</M>{" "}
            是同時適用兩種情形的通用描述。
          </p>
          <p><em>期望值</em>定義為：</p>
          <FormulaBlock
            formula={`E[X] \\;=\\; \\sum_x x\\, p_X(x) \\quad \\text{or} \\quad \\int_{-\\infty}^{\\infty} x\\, f_X(x)\\, dx`}
            question="這個分布的重心在哪裡？"
          />
          <p><em>變異數</em>為：</p>
          <FormulaBlock
            formula={`\\text{Var}(X) \\;=\\; E\\big[(X-E[X])^2\\big] \\;=\\; E[X^2] - (E[X])^2`}
            question="質量在重心周圍分散得多開？"
          />
          <p>必須內化的兩個線性性質：</p>
          <MD>{`E[aX + bY + c] = aE[X] + bE[Y] + c \\quad \\text{(永遠成立)},`}</MD>
          <MD>{`\\text{Var}(aX + b) = a^2 \\text{Var}(X), \\qquad \\text{Var}(X+Y) = \\text{Var}(X) + \\text{Var}(Y) + 2\\,\\text{Cov}(X,Y).`}</MD>
        </>
      ),
      graduate: (
        <>
          <p>
            <strong>測度論定義。</strong>嚴格來說，
            <M>{`E[X]=\\int_\\Omega X\\,dP`}</M>{" "}
            是相對於底層機率測度的 Lebesgue 積分。
            這個積分在延伸意義下存在，當且僅當{" "}
            <M>{`E[X^+]<\\infty`}</M> 或 <M>{`E[X^-]<\\infty`}</M>；
            而 <M>{`X`}</M> 是「可積」的，當且僅當{" "}
            <M>{`E[|X|]<\\infty`}</M>。這個觀點把離散與連續公式統一在同一個物件下。
          </p>
          <p>
            <strong>為什麼平方損失特別：一行定理。</strong>
            函數 <M>{`g(c)=E[(X-c)^2]`}</M>{" "}
            在 <M>{`c\\in\\mathbb{R}`}</M> 上的極小化解是{" "}
            <M>{`c^*=E[X]`}</M>（微分後設為零即可）。
            更一般地，條件期望值 <M>{`E[X\\mid \\mathcal{G}]`}</M>{" "}
            就是把 <M>{`X`}</M> 在 <M>{`\\mathcal{G}`}</M>-可測平方可積函數子空間上的
            <em>正交投影</em>。這就是為什麼最佳線性預測器與條件期望值看起來這麼像的深層原因。
          </p>
          <p>
            <strong>動差與動差母函數。</strong>第 <M>{`k`}</M> 階動差為{" "}
            <M>{`m_k=E[X^k]`}</M>。動差母函數{" "}
            <M>{`M_X(t)=E[e^{tX}]`}</M>{" "}
            把所有動差打包進一個解析函數：
            <M>{`m_k=M_X^{(k)}(0)`}</M>。
            當 MGF 在 0 的某鄰域上存在，它就唯一決定了分布。
            許多 CLT 的證明走 MGF 路線，因為在溫和條件下「MGF 收斂蘊含分布收斂」。
          </p>
          <p>
            <strong>常見誤用。</strong>「比值的期望值就是期望值的比值。」
            <em>錯。</em>一般而言{" "}
            <M>{`E[X/Y]\\ne E[X]/E[Y]`}</M>。
            這個錯誤絆倒了無數做 A/B 測試、計算比率估計量，
            或者「對百分比取平均」的人。正確的做法是用 delta 方法或模擬。
          </p>
        </>
      ),
      body: (
        <>
          <SectionHeader step={1} title="親手堆出一個分布" blurb="拖動權重。感受 E[X] 如何跟著質量重心移動，以及尾巴變重時 Var(X) 如何爆炸。" />
          <ExpectationVarianceLab />

          <SectionHeader step={2} title="推導：變異數的快捷公式" blurb="恆等式 Var(X) = E[X²] − (E[X])² 是機率論裡最常用的代數操作。" />
          <ProofStepper
            title="Var(X) = E[X²] − (E[X])²"
            steps={[
              { title: "從定義出發。", math: "\\text{Var}(X) = E[(X-E[X])^2]" },
              { title: "在期望值內展開平方項。", math: "= E[X^2 - 2X\\,E[X] + (E[X])^2]" },
              { title: "套用期望值的線性性。", math: "= E[X^2] - 2E[X]\\cdot E[X] + (E[X])^2", reason: "E[X] 是常數，所以 E[2X·E[X]] = 2E[X]·E[X]。" },
              { title: "化簡。", math: "= E[X^2] - (E[X])^2" },
            ]}
          />

          <TheoremCard
            kind="theorem"
            name="期望值的線性性"
            statement={
              <>對任何具有有限平均的隨機變數 <M>{`X, Y`}</M> 與常數 <M>{`a, b\\in\\mathbb{R}`}</M>：</>
            }
            formula={`E[aX + bY] = aE[X] + bE[Y].`}
          >
            線性性即使在 X 與 Y <em>不獨立</em>時也成立。
            這就是為什麼「所有產品的總期望營收」可以拆成各產品期望營收之和，
            無論這些銷售之間多麼相關。
          </TheoremCard>

          <SectionHeader step={3} title="工作範例：指示變數和的變異數" />
          <p className="text-ink-dim leading-relaxed">
            擲 <M>{`n`}</M> 顆公平骰子。設 <M>{`X`}</M> 為點數是 6 的骰子數。
            把 <M>{`X = \\sum_i \\mathbb{1}\\{D_i = 6\\}`}</M> 寫出來，
            由線性性 <M>{`E[X] = n/6`}</M>。
            因為各骰子獨立，
            <M>{`\\text{Var}(X) = \\sum_i \\text{Var}(\\mathbb{1}_i) = n \\cdot (1/6)(5/6) = 5n/36`}</M>。
            「拆成指示變數，再加總」這個小技巧，
            是幾乎所有初等期望值計算背後的引擎。
          </p>
        </>
      ),
      misconceptions: [
        {
          wrong: "兩個隨機變數平均一樣，分布就一樣。",
          right:
            "完全不同的分布可以共享同一個平均。平均是一個數，分布是一整個形狀。",
          why: "在推論一個分布之前，至少要把平均和變異數一起看 ── 如果可以的話，最好還有直方圖。",
        },
        {
          wrong: "E[g(X)] = g(E[X])。",
          right:
            "這是 Jensen 落差。對於凸的 g，E[g(X)] ≥ g(E[X])；對於凹的 g 不等號方向反過來。只有當 g 是仿射函數或 X 退化時才會相等。",
          why: "忽略這一點，正是「直接套平均值」的計算為什麼會低估波動率、選擇權價格與熵的原因。",
        },
        {
          wrong: "變異數總是有限的。",
          right:
            "Cauchy 與許多重尾分布的變異數沒有定義（甚至連平均都沒有）。CLT 和標準誤差公式都隱含著「變異數有限」的假設 ── 一旦這個假設破掉，傳統統計學就會崩潰。",
        },
      ],
      takeaways: [
        "隨機變數是一個把結果映成數字的函數；它的分布是一堆機率質量。",
        "E[X] 是質量的重心；Var(X) 衡量質量到重心的平均平方距離。",
        "期望值的線性性永遠成立，無論獨不獨立。要學會把目標拆成指示變數的和。",
        "Var(X) = E[X²] − (E[X])² 是代數上的萬能工具。",
        "獨立性讓變異數可以相加；不獨立時要加上協方差作為修正項。",
      ],
      quiz: [
        {
          id: "q1",
          prompt: "X 是 10 次公平拋擲硬幣中正面的次數，那 Var(X) 是多少？",
          choices: [
            { id: "a", label: "5" },
            { id: "b", label: "2.5" },
            { id: "c", label: "10" },
            { id: "d", label: "0.25" },
          ],
          answer: "b",
          explanation: "X ~ Binomial(10, 0.5)，所以 Var(X) = np(1-p) = 10·0.5·0.5 = 2.5。",
        },
        {
          id: "q2",
          prompt: "下列哪一個對任何 X、Y 都成立？",
          choices: [
            { id: "a", label: "E[XY] = E[X]E[Y]" },
            { id: "b", label: "Var(X+Y) = Var(X) + Var(Y)" },
            { id: "c", label: "E[X+Y] = E[X] + E[Y]" },
            { id: "d", label: "E[1/X] = 1/E[X]" },
          ],
          answer: "c",
          explanation:
            "期望值的線性性永遠成立。其他三個分別需要獨立、同分布或 Jensen 不等式。",
        },
        {
          id: "q3",
          prompt: "若 Var(X) = 4 且 Y = 3X − 5，那 Var(Y) 為多少？",
          choices: [
            { id: "a", label: "12" },
            { id: "b", label: "31" },
            { id: "c", label: "36" },
            { id: "d", label: "9" },
          ],
          answer: "c",
          explanation: "Var(aX + b) = a² Var(X)，所以 Var(Y) = 9·4 = 36。",
        },
        {
          id: "q4",
          type: "numeric",
          prompt:
            "X 是一顆公平的骰子（1..6）。計算 Var(X)。（取 2 位小數）",
          answer: 2.92,
          tolerance: 0.05,
          hint: "E[X] = 3.5；E[X²] = (1+4+9+16+25+36)/6。",
          explanation: "E[X²] = 91/6 ≈ 15.17，E[X]² = 12.25，所以 Var ≈ 2.92。",
        },
        {
          id: "q5",
          type: "ordering",
          prompt: "把 Var(X) = E[X²] − (E[X])² 的推導重新排序。",
          steps: [
            { id: "s1", label: "從 Var(X) = E[(X − E[X])²] 出發" },
            { id: "s2", label: "展開平方：E[X² − 2X·E[X] + (E[X])²]" },
            { id: "s3", label: "套用線性性：E[X²] − 2E[X]·E[X] + (E[X])²" },
            { id: "s4", label: "合併同類項：E[X²] − (E[X])²" },
          ],
          explanation: "定義 → 展開 → 線性性 → 化簡。",
        },
      ],
      furtherReading: [
        { title: "Ross — A First Course in Probability, ch. 4–5" },
        { title: "Wasserman — All of Statistics, ch. 2–3" },
      ],
    },
  },
};

export default chapter;
