import { Chapter } from "../types";
import { M, MD } from "@/components/math/Math";
import { FormulaBlock } from "@/components/math/FormulaBlock";
import { TheoremCard } from "@/components/math/TheoremCard";
import { ProofStepper } from "@/components/math/ProofStepper";
import { JointDistributionExplorer } from "@/components/interactive/JointDistributionExplorer";
import { SectionHeader } from "@/components/learning/SectionHeader";

const chapter: Chapter = {
  meta: {
    slug: "joint-distributions-and-covariance",
    module: "B_random_variables",
    number: 4,
    minutes: 40,
    level: 4,
    prereqs: ["common-distributions"],
    tags: ["joint", "marginal", "conditional", "covariance", "correlation"],
  },
  localized: {
    en: {
      title: "Joint Distributions, Covariance & Correlation",
      subtitle:
        "Two random variables make a joint distribution. Three numbers (μ₁, μ₂, ρ) plus two scales fully describe its Gaussian special case — and the geometry behind correlation is finally just a tilt.",
      hook: "Why correlation is a tilt of an ellipse, why marginals lose information, and the difference between joint, marginal, and conditional that everyone gets confused once.",
      whyItMatters: (
        <>
          The world is rarely one-dimensional. Risk = portfolio of correlated
          stocks. ML training data = inputs and labels with hidden joint
          structure. Causal inference = treatment and outcome with possibly
          correlated confounders. The first step in saying anything sharp
          about a multi-variable system is to have a clean grip on joint,
          marginal, and conditional distributions — and on the one number
          that summarises linear association: correlation.
        </>
      ),
      intuition: (
        <>
          <p>
            Take two random variables <M>X</M> and <M>Y</M> at once. Their{" "}
            <em>joint distribution</em> is the rule that assigns probability
            to <em>pairs</em>: how often does <M>X</M> land here{" "}
            <em>at the same time as</em> <M>Y</M> lands there?
          </p>
          <p>
            From the joint you can derive two simpler objects:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 mt-2">
            <li>
              The <em>marginal</em> of <M>X</M>: forget about <M>Y</M>{" "}
              entirely. (Sum or integrate over <M>Y</M>.)
            </li>
            <li>
              The <em>conditional</em> of <M>X</M> given <M>Y = y</M>: the
              re-normalised slice of the joint at the line <M>{`Y = y`}</M>.
            </li>
          </ul>
          <p>
            One number summarises whether <M>X</M> and <M>Y</M> tend to move
            together: <em>correlation</em>{" "}
            <M>{`\\rho = \\text{Cov}(X,Y)/(\\sigma_X \\sigma_Y) \\in [-1, 1]`}</M>.
            Geometrically, for the bivariate Normal, <M>ρ</M> is the{" "}
            <em>tilt of the ellipse</em> of constant density. <M>{`ρ = 0`}</M>{" "}
            gives axis-aligned ellipses; <M>{`ρ = ±1`}</M> collapses to a line.
          </p>
        </>
      ),
      formal: (
        <>
          <p>For two discrete random variables, the joint PMF is</p>
          <FormulaBlock formula={`p_{X,Y}(x, y) = P(X = x, Y = y)`} />
          <p>and the marginals are</p>
          <FormulaBlock formula={`p_X(x) = \\sum_y p_{X,Y}(x, y), \\qquad p_Y(y) = \\sum_x p_{X,Y}(x, y).`} />
          <p>
            The conditional is the joint divided by the relevant marginal:
          </p>
          <FormulaBlock
            formula={`p_{X \\mid Y}(x \\mid y) = \\frac{p_{X,Y}(x, y)}{p_Y(y)}, \\quad p_Y(y) > 0.`}
            question="Given Y took value y, how likely is X to take value x?"
          />
          <p>
            Continuous case: replace sums by integrals. Independence is
          </p>
          <FormulaBlock formula={`X \\perp Y \\iff f_{X,Y}(x,y) = f_X(x) f_Y(y).`} />
          <p>
            <em>Covariance</em> and <em>correlation</em>:
          </p>
          <FormulaBlock
            formula={`\\text{Cov}(X, Y) = E[(X - E[X])(Y - E[Y])] = E[XY] - E[X]E[Y]`}
          />
          <FormulaBlock
            formula={`\\rho_{X,Y} = \\frac{\\text{Cov}(X, Y)}{\\sigma_X \\sigma_Y} \\in [-1, 1].`}
            question="On a unit-free scale, how strongly do X and Y move together linearly?"
          />
          <p>
            And the variance of a sum:
          </p>
          <FormulaBlock
            formula={`\\text{Var}(X + Y) = \\text{Var}(X) + \\text{Var}(Y) + 2\\,\\text{Cov}(X, Y).`}
          />
        </>
      ),
      graduate: (
        <>
          <p>
            <strong>The bivariate Normal is the Rosetta stone.</strong> Its
            density is
          </p>
          <FormulaBlock
            formula={`f(x, y) = \\frac{1}{2\\pi\\sigma_X\\sigma_Y\\sqrt{1-\\rho^2}} \\exp\\!\\left(-\\frac{1}{2(1-\\rho^2)}\\left[\\frac{(x-\\mu_X)^2}{\\sigma_X^2} - \\frac{2\\rho(x-\\mu_X)(y-\\mu_Y)}{\\sigma_X\\sigma_Y} + \\frac{(y-\\mu_Y)^2}{\\sigma_Y^2}\\right]\\right).`}
          />
          <p>
            All conditionals and marginals are Normals with closed forms.
            Most strikingly, the conditional mean is a linear function:
          </p>
          <FormulaBlock
            formula={`E[Y \\mid X = x] = \\mu_Y + \\rho \\frac{\\sigma_Y}{\\sigma_X}(x - \\mu_X).`}
            question="Why is regression to the mean called 'regression'?"
          />
          <p>
            That slope <M>{`\\rho \\sigma_Y/\\sigma_X`}</M> is exactly the
            slope you&apos;d get from OLS regression of <M>Y</M> on <M>X</M> —
            the connection is exact, not analogy. It also explains{" "}
            <em>regression to the mean</em>: because <M>{`|\\rho| < 1`}</M>,
            the conditional mean of <M>Y</M> moves <em>less than</em>{" "}
            proportionally with <M>X</M>. Tall fathers have tall but
            slightly-shorter sons, on average.
          </p>
          <p>
            <strong>Independent vs uncorrelated.</strong> Independence
            implies zero correlation, but not the other way around. The
            standard counter-example: let{" "}
            <M>{`X \\sim \\mathcal{N}(0,1)`}</M> and{" "}
            <M>{`Y = X^2`}</M>. Then{" "}
            <M>{`\\text{Cov}(X, Y) = E[X \\cdot X^2] - E[X]E[X^2] = 0`}</M>,
            so <M>{`\\rho = 0`}</M>, but <M>X</M> and <M>Y</M> are
            <em> deterministically related</em>. Correlation only sees
            linear dependence. The exception: under jointly Normal data,{" "}
            <M>{`\\rho = 0 \\iff X \\perp Y`}</M>.
          </p>
          <p>
            <strong>Copulas.</strong> Sklar&apos;s theorem says any joint
            distribution can be decomposed into its marginals plus a{" "}
            <em>copula</em> describing the dependence structure separately.
            This is the foundation of risk modelling — and the source of the
            2008 financial crisis when Gaussian copulas were assumed for
            CDOs whose true dependence was much heavier in the tails.
          </p>
        </>
      ),
      body: (
        <>
          <SectionHeader step={1} title="The bivariate Normal up close" blurb="Drag ρ from -1 to +1 and watch the contours tilt. The marginals (top + right) are still 1-D Normals — they don't change when you change the correlation alone." />
          <JointDistributionExplorer />

          <SectionHeader step={2} title="Derivation: variance of a sum" />
          <ProofStepper
            title="Var(X+Y) = Var(X) + Var(Y) + 2 Cov(X,Y)"
            steps={[
              { title: "Start from the definition.", math: "\\text{Var}(X+Y) = E[((X+Y) - E[X+Y])^2]" },
              { title: "Expand using linearity of E.", math: "= E[((X - E[X]) + (Y - E[Y]))^2]" },
              { title: "Square the binomial.", math: "= E[(X - E[X])^2] + E[(Y - E[Y])^2] + 2E[(X - E[X])(Y - E[Y])]" },
              { title: "Recognise the three terms.", math: "= \\text{Var}(X) + \\text{Var}(Y) + 2\\,\\text{Cov}(X, Y)" },
              { title: "Special case: independence.", math: "X \\perp Y \\Rightarrow \\text{Cov}(X,Y) = 0 \\Rightarrow \\text{Var}(X+Y) = \\text{Var}(X) + \\text{Var}(Y)", reason: "Variances add for independent variables. Always remember the covariance correction otherwise." },
            ]}
          />

          <TheoremCard
            kind="theorem"
            name="Conditional mean of a bivariate Normal"
            statement={
              <>
                If <M>{`(X, Y) \\sim \\mathcal{N}(\\mu_X, \\mu_Y, \\sigma_X^2, \\sigma_Y^2, \\rho)`}</M>{" "}
                then
              </>
            }
            formula={`E[Y \\mid X = x] = \\mu_Y + \\rho \\frac{\\sigma_Y}{\\sigma_X}(x - \\mu_X), \\quad \\text{Var}(Y \\mid X = x) = \\sigma_Y^2 (1 - \\rho^2).`}
          >
            The conditional mean is linear in <M>x</M> with slope{" "}
            <M>{`\\rho \\sigma_Y/\\sigma_X`}</M>. The conditional variance is
            <em> smaller</em> than the marginal variance by a factor of{" "}
            <M>{`1 - \\rho^2`}</M> — knowing <M>X</M> reduces uncertainty
            about <M>Y</M> exactly when they are correlated.
          </TheoremCard>

          <SectionHeader step={3} title="Worked example: zero correlation does not imply independence" />
          <p className="text-ink-dim leading-relaxed">
            Let <M>{`X \\sim \\mathcal{N}(0, 1)`}</M> and{" "}
            <M>{`Y = X^2`}</M>.
          </p>
          <FormulaBlock formula={`\\text{Cov}(X, Y) = E[X \\cdot X^2] - E[X] E[X^2] = E[X^3] - 0 \\cdot 1 = 0`} />
          <p className="text-ink-dim leading-relaxed">
            (Because <M>X</M> is symmetric, <M>{`E[X^3] = 0`}</M>.) So{" "}
            <M>{`\\rho = 0`}</M>, yet <M>Y</M> is <em>completely determined</em>{" "}
            by <M>X</M>. The lesson: correlation measures only linear
            association. For the full story you need the joint distribution
            or an independence test.
          </p>
        </>
      ),
      misconceptions: [
        {
          wrong: "Independent and uncorrelated mean the same thing.",
          right:
            "Independence implies uncorrelated, but not vice versa. Y = X² has zero correlation with X but is fully determined by it. The two coincide for jointly Normal variables.",
        },
        {
          wrong: "If X and Y both have Normal marginals, (X, Y) is jointly Normal.",
          right:
            "False. You can construct two random variables that each look Normal one-dimensionally but whose joint is not Normal at all (e.g. via copulas). Marginals do not determine the joint.",
        },
        {
          wrong: "Correlation measures any kind of association.",
          right:
            "Only linear association. A perfect quadratic, sinusoid, or piecewise relationship can have ρ = 0. Use mutual information or scatterplots for non-linear structure.",
        },
        {
          wrong: "Var(X − Y) = Var(X) − Var(Y).",
          right:
            "Wrong. Var(aX + bY) = a²Var(X) + b²Var(Y) + 2ab·Cov(X,Y). For (X − Y), this gives Var(X) + Var(Y) − 2 Cov(X,Y). Variances are nonnegative; subtraction would be absurd.",
        },
      ],
      takeaways: [
        "The joint distribution is the full description of (X, Y); marginals and conditionals are both derived from it.",
        "Cov(X, Y) = E[XY] − E[X]E[Y]; correlation is the unit-free version, ρ ∈ [−1, 1].",
        "For jointly Normal variables, the conditional mean is exactly a linear function of x — that's where 'linear regression' comes from.",
        "Independence ⇒ ρ = 0, but ρ = 0 does NOT imply independence (except under joint Normality).",
        "Variances do not add unless the variables are uncorrelated. Always include the 2·Cov term.",
      ],
      quiz: [
        {
          id: "q1",
          prompt:
            "Var(X) = 4, Var(Y) = 9, Cov(X, Y) = 2. What is Var(X + Y)?",
          choices: [
            { id: "a", label: "13" },
            { id: "b", label: "17" },
            { id: "c", label: "11" },
            { id: "d", label: "15" },
          ],
          answer: "b",
          explanation: "Var(X+Y) = 4 + 9 + 2·2 = 17. Don't forget the covariance term.",
        },
        {
          id: "q2",
          prompt:
            "X ~ N(0,1) and Y = X². Which is true?",
          choices: [
            { id: "a", label: "X ⊥ Y" },
            { id: "b", label: "Cor(X,Y) = 1" },
            { id: "c", label: "Cor(X,Y) = 0 but X and Y are not independent" },
            { id: "d", label: "Cor(X,Y) = -1" },
          ],
          answer: "c",
          explanation:
            "Cov(X, X²) = E[X³] − E[X]E[X²] = 0 − 0 = 0, so ρ = 0. But Y is fully determined by X — they are not independent.",
        },
        {
          id: "q3",
          prompt:
            "For a bivariate Normal with σ_X = σ_Y = 1 and ρ = 0.5, the conditional E[Y | X = 2] equals (assuming μ_X = μ_Y = 0)...",
          choices: [
            { id: "a", label: "0" },
            { id: "b", label: "0.5" },
            { id: "c", label: "1.0" },
            { id: "d", label: "2.0" },
          ],
          answer: "c",
          explanation:
            "E[Y|X=x] = μ_Y + ρ(σ_Y/σ_X)(x − μ_X) = 0 + 0.5·1·(2 − 0) = 1.0. Less than X itself — that's regression to the mean.",
        },
      ],
      furtherReading: [
        { title: "Casella & Berger — Statistical Inference, ch. 4" },
        { title: "Bertsekas & Tsitsiklis — Introduction to Probability, ch. 4" },
        { title: "Nelsen — An Introduction to Copulas" },
      ],
    },

    zh: {
      title: "聯合分布、共變異數與相關係數",
      subtitle:
        "兩個隨機變數構成一個聯合分布。對於它的高斯特例，三個數字（μ₁, μ₂, ρ）加上兩個尺度就完全描述它 ── 而相關係數背後的幾何，最終就只是「橢圓的傾斜」。",
      hook: "為什麼相關係數是橢圓的傾斜、為什麼邊際會丟失資訊，以及聯合 / 邊際 / 條件這三個東西每個人第一次都會搞混的差別。",
      whyItMatters: (
        <>
          這個世界很少是一維的。
          風險 = 一籃子相關股票；
          ML 訓練資料 = 帶有隱藏聯合結構的輸入與標籤；
          因果推論 = 帶有可能相關 confounder 的處理與結果。
          要對任何「多變數系統」做出尖銳的陳述，
          第一步就是對「聯合、邊際、條件」分布有乾淨的掌握 ──
          以及「線性關聯的單一摘要」：相關係數。
        </>
      ),
      intuition: (
        <>
          <p>
            同時看兩個隨機變數 <M>X</M> 和 <M>Y</M>。
            它們的<em>聯合分布</em>是「替每對 <M>(x, y)</M> 指派機率」的規則：
            <M>X</M> 落在這裡<em>同時</em> <M>Y</M> 落在那裡的頻率是多少？
          </p>
          <p>從聯合可以推出兩個更簡單的物件：</p>
          <ul className="list-disc pl-6 space-y-1.5 mt-2">
            <li>
              <M>X</M> 的<em>邊際</em>：完全忽略 <M>Y</M>。
              （對 <M>Y</M> 加總或積分。）
            </li>
            <li>
              <M>{`X | Y = y`}</M> 的<em>條件</em>：
              聯合分布在直線 <M>{`Y = y`}</M> 上那一片切片，
              重新歸一化之後。
            </li>
          </ul>
          <p>
            一個數字摘要了「<M>X</M> 與 <M>Y</M> 是否傾向一起動」：
            <em>相關係數</em>{" "}
            <M>{`\\rho = \\text{Cov}(X,Y)/(\\sigma_X \\sigma_Y) \\in [-1, 1]`}</M>。
            幾何上，對於雙變量常態，
            <M>ρ</M> 就是「等密度橢圓的傾斜」。
            <M>{`ρ = 0`}</M> 給軸對齊的橢圓；<M>{`ρ = ±1`}</M> 退化成一條線。
          </p>
        </>
      ),
      formal: (
        <>
          <p>對兩個離散隨機變數，聯合 PMF 為：</p>
          <FormulaBlock formula={`p_{X,Y}(x, y) = P(X = x, Y = y)`} />
          <p>邊際分布為：</p>
          <FormulaBlock formula={`p_X(x) = \\sum_y p_{X,Y}(x, y), \\qquad p_Y(y) = \\sum_x p_{X,Y}(x, y).`} />
          <p>條件就是「聯合除以對應的邊際」：</p>
          <FormulaBlock
            formula={`p_{X \\mid Y}(x \\mid y) = \\frac{p_{X,Y}(x, y)}{p_Y(y)}, \\quad p_Y(y) > 0.`}
            question="給定 Y = y，X 取值 x 的機率是多少？"
          />
          <p>連續情形把加總換成積分。獨立的定義為：</p>
          <FormulaBlock formula={`X \\perp Y \\iff f_{X,Y}(x,y) = f_X(x) f_Y(y).`} />
          <p><em>共變異數</em>與<em>相關係數</em>：</p>
          <FormulaBlock
            formula={`\\text{Cov}(X, Y) = E[(X - E[X])(Y - E[Y])] = E[XY] - E[X]E[Y]`}
          />
          <FormulaBlock
            formula={`\\rho_{X,Y} = \\frac{\\text{Cov}(X, Y)}{\\sigma_X \\sigma_Y} \\in [-1, 1].`}
            question="在無單位的尺度下，X 與 Y 線性地一起動的程度有多強？"
          />
          <p>以及和的變異數：</p>
          <FormulaBlock
            formula={`\\text{Var}(X + Y) = \\text{Var}(X) + \\text{Var}(Y) + 2\\,\\text{Cov}(X, Y).`}
          />
        </>
      ),
      graduate: (
        <>
          <p>
            <strong>雙變量常態是「Rosetta 石」。</strong>它的密度為：
          </p>
          <FormulaBlock
            formula={`f(x, y) = \\frac{1}{2\\pi\\sigma_X\\sigma_Y\\sqrt{1-\\rho^2}} \\exp\\!\\left(-\\frac{1}{2(1-\\rho^2)}\\left[\\frac{(x-\\mu_X)^2}{\\sigma_X^2} - \\frac{2\\rho(x-\\mu_X)(y-\\mu_Y)}{\\sigma_X\\sigma_Y} + \\frac{(y-\\mu_Y)^2}{\\sigma_Y^2}\\right]\\right).`}
          />
          <p>
            所有條件與邊際都是有封閉式的常態。最驚人的：條件平均是一個線性函數。
          </p>
          <FormulaBlock
            formula={`E[Y \\mid X = x] = \\mu_Y + \\rho \\frac{\\sigma_Y}{\\sigma_X}(x - \\mu_X).`}
            question="為什麼「向均值回歸」叫做「迴歸」？"
          />
          <p>
            那個斜率 <M>{`\\rho \\sigma_Y/\\sigma_X`}</M>{" "}
            正好就是「對 <M>X</M> 做 OLS 迴歸 <M>Y</M>」會得到的斜率 ──
            兩者是<em>恆等</em>關係，不是比喻。
            這也解釋了<em>向均值回歸</em>：
            因為 <M>{`|\\rho| < 1`}</M>，
            <M>Y</M> 的條件平均隨 <M>X</M> 移動的<em>幅度小於正比</em>。
            高個子父親的兒子平均也高，但會稍微矮一點。
          </p>
          <p>
            <strong>獨立 vs 不相關。</strong>
            獨立蘊含相關係數為零，但反之不成立。
            標準反例：設 <M>{`X \\sim \\mathcal{N}(0,1)`}</M>、<M>{`Y = X^2`}</M>，
            則 <M>{`\\text{Cov}(X, Y) = E[X \\cdot X^2] - E[X]E[X^2] = 0`}</M>，
            所以 <M>{`\\rho = 0`}</M>，
            但 <M>Y</M> 與 <M>X</M> 是<em>確定性相關</em>的。
            相關係數只看得到「線性依賴」。
            例外：在「聯合常態」下，<M>{`\\rho = 0 \\iff X \\perp Y`}</M>。
          </p>
          <p>
            <strong>Copula。</strong>
            Sklar 定理說：任何聯合分布都可以拆成「邊際」加上一個{" "}
            <em>copula</em> 來描述依賴結構。
            這是風險建模的基礎 ──
            也是 2008 年金融危機的源頭：
            CDO 被假設成高斯 copula，但它們真實的依賴在尾巴上重得多。
          </p>
        </>
      ),
      body: (
        <>
          <SectionHeader step={1} title="近距離觀察雙變量常態" blurb="把 ρ 從 -1 拖到 +1，看等高線傾斜。上方與右方的邊際仍然是一維常態 ── 你只動相關係數時，它們不會改變。" />
          <JointDistributionExplorer />

          <SectionHeader step={2} title="推導：和的變異數" />
          <ProofStepper
            title="Var(X+Y) = Var(X) + Var(Y) + 2 Cov(X,Y)"
            steps={[
              { title: "從定義出發。", math: "\\text{Var}(X+Y) = E[((X+Y) - E[X+Y])^2]" },
              { title: "用 E 的線性性展開。", math: "= E[((X - E[X]) + (Y - E[Y]))^2]" },
              { title: "把二項式平方展開。", math: "= E[(X - E[X])^2] + E[(Y - E[Y])^2] + 2E[(X - E[X])(Y - E[Y])]" },
              { title: "辨認三項。", math: "= \\text{Var}(X) + \\text{Var}(Y) + 2\\,\\text{Cov}(X, Y)" },
              { title: "特例：獨立。", math: "X \\perp Y \\Rightarrow \\text{Cov}(X,Y) = 0 \\Rightarrow \\text{Var}(X+Y) = \\text{Var}(X) + \\text{Var}(Y)", reason: "獨立的變數變異數可以相加。其他情況下，永遠記得加上共變異數的修正項。" },
            ]}
          />

          <TheoremCard
            kind="theorem"
            name="雙變量常態的條件平均"
            statement={
              <>
                若 <M>{`(X, Y) \\sim \\mathcal{N}(\\mu_X, \\mu_Y, \\sigma_X^2, \\sigma_Y^2, \\rho)`}</M>，
                則
              </>
            }
            formula={`E[Y \\mid X = x] = \\mu_Y + \\rho \\frac{\\sigma_Y}{\\sigma_X}(x - \\mu_X), \\quad \\text{Var}(Y \\mid X = x) = \\sigma_Y^2 (1 - \\rho^2).`}
          >
            條件平均是 <M>x</M> 的線性函數，斜率為{" "}
            <M>{`\\rho \\sigma_Y/\\sigma_X`}</M>。
            條件變異數比邊際變異數<em>小</em>了 <M>{`1 - \\rho^2`}</M> 倍 ──
            知道 <M>X</M> 會減少對 <M>Y</M> 的不確定性，
            而且減少的幅度正比於它們的相關程度。
          </TheoremCard>

          <SectionHeader step={3} title="工作範例：零相關不蘊含獨立" />
          <p className="text-ink-dim leading-relaxed">
            設 <M>{`X \\sim \\mathcal{N}(0, 1)`}</M>、
            <M>{`Y = X^2`}</M>。
          </p>
          <FormulaBlock formula={`\\text{Cov}(X, Y) = E[X \\cdot X^2] - E[X] E[X^2] = E[X^3] - 0 \\cdot 1 = 0`} />
          <p className="text-ink-dim leading-relaxed">
            （因為 <M>X</M> 對稱，<M>{`E[X^3] = 0`}</M>。）
            所以 <M>{`\\rho = 0`}</M>，
            但 <M>Y</M> 完全由 <M>X</M> <em>決定</em>。
            教訓：相關係數只衡量線性關聯。
            要看完整的故事，你需要聯合分布或獨立性檢定。
          </p>
        </>
      ),
      misconceptions: [
        {
          wrong: "獨立和不相關是同一件事。",
          right:
            "獨立蘊含不相關，但反之不成立。Y = X² 與 X 的相關係數是零，卻完全由 X 決定。在聯合常態下兩者才一致。",
        },
        {
          wrong: "X 和 Y 各自的邊際都是常態，那 (X, Y) 就是聯合常態。",
          right:
            "錯。你可以構造兩個一維各自看起來都是常態，但聯合分布完全不是常態的隨機變數（例如透過 copula）。邊際不決定聯合。",
        },
        {
          wrong: "相關係數衡量「任何種類」的關聯。",
          right:
            "只衡量「線性」關聯。一個完美的二次、正弦、或分段關係都可以有 ρ = 0。對非線性結構要用 mutual information 或散布圖。",
        },
        {
          wrong: "Var(X − Y) = Var(X) − Var(Y)。",
          right:
            "錯。Var(aX + bY) = a²Var(X) + b²Var(Y) + 2ab·Cov(X,Y)。對 (X − Y) 算下來是 Var(X) + Var(Y) − 2 Cov(X,Y)。變異數恆為非負，相減根本荒謬。",
        },
      ],
      takeaways: [
        "聯合分布是 (X, Y) 的完整描述；邊際與條件都是從它推出來的。",
        "Cov(X, Y) = E[XY] − E[X]E[Y]；相關係數是它的「無單位版本」，ρ ∈ [−1, 1]。",
        "對聯合常態變數，條件平均是 x 的精確線性函數 ── 「線性迴歸」這個名字就是從這裡來的。",
        "獨立 ⇒ ρ = 0，但 ρ = 0「不」蘊含獨立（除非聯合常態）。",
        "變數不相關時變異數才相加。其他情況下，永遠記得 2·Cov 這一項。",
      ],
      quiz: [
        {
          id: "q1",
          prompt:
            "Var(X) = 4、Var(Y) = 9、Cov(X, Y) = 2。Var(X + Y) 是多少？",
          choices: [
            { id: "a", label: "13" },
            { id: "b", label: "17" },
            { id: "c", label: "11" },
            { id: "d", label: "15" },
          ],
          answer: "b",
          explanation: "Var(X+Y) = 4 + 9 + 2·2 = 17。不要忘記共變異數那一項。",
        },
        {
          id: "q2",
          prompt:
            "X ~ N(0,1)、Y = X²。下列何者為真？",
          choices: [
            { id: "a", label: "X ⊥ Y" },
            { id: "b", label: "Cor(X,Y) = 1" },
            { id: "c", label: "Cor(X,Y) = 0 但 X 與 Y 不獨立" },
            { id: "d", label: "Cor(X,Y) = -1" },
          ],
          answer: "c",
          explanation:
            "Cov(X, X²) = E[X³] − E[X]E[X²] = 0 − 0 = 0，所以 ρ = 0。但 Y 完全由 X 決定 ── 它們並不獨立。",
        },
        {
          id: "q3",
          prompt:
            "雙變量常態，σ_X = σ_Y = 1、ρ = 0.5（且 μ_X = μ_Y = 0）。E[Y | X = 2] 等於？",
          choices: [
            { id: "a", label: "0" },
            { id: "b", label: "0.5" },
            { id: "c", label: "1.0" },
            { id: "d", label: "2.0" },
          ],
          answer: "c",
          explanation:
            "E[Y|X=x] = μ_Y + ρ(σ_Y/σ_X)(x − μ_X) = 0 + 0.5·1·(2 − 0) = 1.0。比 X 本身小 ── 這就是向均值回歸。",
        },
      ],
      furtherReading: [
        { title: "Casella & Berger — Statistical Inference, ch. 4" },
        { title: "Bertsekas & Tsitsiklis — Introduction to Probability, ch. 4" },
        { title: "Nelsen — An Introduction to Copulas" },
      ],
    },
  },
};

export default chapter;
