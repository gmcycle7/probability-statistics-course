import { Chapter } from "../types";
import { M, MD } from "@/components/math/Math";
import { FormulaBlock } from "@/components/math/FormulaBlock";
import { TheoremCard } from "@/components/math/TheoremCard";
import { ProofStepper } from "@/components/math/ProofStepper";
import { ConditionalProbabilityGrid } from "@/components/interactive/ConditionalProbabilityGrid";
import { BayesUpdater } from "@/components/interactive/BayesUpdater";
import { SectionHeader } from "@/components/learning/SectionHeader";

const chapter: Chapter = {
  meta: {
    slug: "conditional-probability-and-bayes",
    module: "A_basic_probability",
    number: 1,
    minutes: 35,
    level: 3,
    tags: ["conditional", "bayes", "updating"],
  },
  localized: {
    en: {
      title: "Conditional Probability & Bayes' Theorem",
      subtitle:
        "How new information rewires probabilities — the mechanism behind every inference machine.",
      hook: "From updating beliefs about a coin to interpreting medical tests, this is the engine of probabilistic reasoning.",
      whyItMatters: (
        <>
          Almost every interesting probability question is conditional.{" "}
          <em>Given</em> a positive test, how likely is the disease?{" "}
          <em>Given</em> a customer clicked once, how likely are they to
          convert? <em>Given</em> the data we observed, what should we believe
          about the parameter? Bayes&apos; theorem is the universal &quot;belief
          updater&quot; — and once you can feel it geometrically, the whole
          edifice of statistics, machine learning, and probabilistic reasoning
          becomes one consistent story.
        </>
      ),
      intuition: (
        <>
          <p>
            Probability is a way of carving up <em>possibility</em>. The full
            sample space <M>{`\\Omega`}</M> is everything that could happen. A{" "}
            <em>conditional probability</em> <M>{`P(A\\mid B)`}</M> just means:{" "}
            <em>shrink the universe down to B, and ask how much of B is also A.</em>
          </p>
          <p>
            That&apos;s it. There is no philosophy yet — just &quot;zoom in&quot;.
            When somebody tells you &quot;<M>{`B`}</M> happened&quot;, the rules
            of the game don&apos;t change, but the playing field shrinks.
          </p>
          <p>
            Bayes&apos; theorem then answers a flipped question: instead of{" "}
            <em>given the cause, how likely is the effect</em>, it tells you{" "}
            <em>given the effect, how likely is the cause</em>. The two
            directions are not the same number, and confusing them is the
            most common probability error in the world.
          </p>
        </>
      ),
      formal: (
        <>
          <p>
            Let <M>{`(\\Omega, \\mathcal{F}, P)`}</M> be a probability space and
            let <M>{`A, B \\in \\mathcal{F}`}</M> with <M>{`P(B) > 0`}</M>. The{" "}
            <em>conditional probability of A given B</em> is defined as
          </p>
          <FormulaBlock
            formula={`P(A \\mid B) \\;=\\; \\frac{P(A \\cap B)}{P(B)}`}
            question="Among the worlds where B happens, how often does A also happen?"
          />
          <p>
            Reversing the roles of <M>{`A`}</M> and <M>{`B`}</M> and equating the
            numerators gives Bayes&apos; theorem:
          </p>
          <FormulaBlock
            formula={`P(A \\mid B) \\;=\\; \\frac{P(B \\mid A)\\,P(A)}{P(B)}`}
            question="How should I update my belief in A after observing B?"
          />
          <p>
            The denominator <M>{`P(B)`}</M> is usually expanded by the{" "}
            <em>law of total probability</em> over a partition{" "}
            <M>{`\\{A_i\\}`}</M> of <M>{`\\Omega`}</M>:
          </p>
          <MD>{`P(B) = \\sum_i P(B\\mid A_i)\\,P(A_i).`}</MD>
          <p>
            Two events <M>{`A`}</M> and <M>{`B`}</M> are <em>independent</em>{" "}
            iff <M>{`P(A\\cap B)=P(A)P(B)`}</M>, equivalently{" "}
            <M>{`P(A\\mid B)=P(A)`}</M>. Independence means &quot;observing B
            carries zero information about A&quot;.
          </p>
        </>
      ),
      graduate: (
        <>
          <p>
            <strong>Generalisation to σ-algebras.</strong> The elementary
            definition <M>{`P(A\\mid B)=P(A\\cap B)/P(B)`}</M> only makes sense
            when <M>{`P(B)>0`}</M>. The grown-up version is{" "}
            <em>conditional expectation given a σ-algebra</em>:{" "}
            <M>{`E[X \\mid \\mathcal{G}]`}</M> is defined (uniquely up to{" "}
            <M>{`P`}</M>-null sets) as the <M>{`\\mathcal{G}`}</M>-measurable
            random variable satisfying{" "}
            <M>{`\\int_G E[X\\mid \\mathcal{G}]\\,dP = \\int_G X\\,dP`}</M> for
            every <M>{`G\\in\\mathcal{G}`}</M>. This is the right framework for
            conditioning on continuous events (where pointwise conditioning
            would divide by zero), and it underpins martingales, filtering,
            and modern stochastic analysis.
          </p>
          <p>
            <strong>Bayes is just a normalisation.</strong> Write{" "}
            <M>{`P(\\theta\\mid x) \\propto P(x\\mid \\theta)\\,P(\\theta)`}</M>.
            The prior <M>{`P(\\theta)`}</M> reweights the likelihood{" "}
            <M>{`P(x\\mid\\theta)`}</M>, and the marginal{" "}
            <M>{`P(x)=\\int P(x\\mid\\theta)P(\\theta)\\,d\\theta`}</M> exists
            purely to make things sum to 1. In high-dimensional models the
            marginal is the hard part — that&apos;s why MCMC, variational
            inference, and SMC even exist.
          </p>
          <p>
            <strong>Common misuse: base-rate neglect.</strong> A test with 99%
            sensitivity and 99% specificity for a 1-in-10,000 disease still
            yields <M>{`P(\\text{disease}\\mid+) \\approx 1\\%`}</M>. The
            arithmetic is trivial; the cognitive trap is forgetting{" "}
            <M>{`P(\\theta)`}</M>. Whenever you read &quot;the test is 99%
            accurate&quot;, ask: <em>99% of what?</em>
          </p>
          <p>
            <strong>Connections.</strong> The likelihood ratio{" "}
            <M>{`P(B\\mid A)/P(B\\mid \\neg A)`}</M> shows up as the test
            statistic in Neyman–Pearson, the score in logistic regression,
            and the multiplicative weight in Bayesian sequential updating.
            They are all the same object.
          </p>
        </>
      ),
      body: (
        <>
          <SectionHeader step={1} title="Visual explanation" blurb="Drag the sliders. Each rectangle is a probability." />
          <ConditionalProbabilityGrid />

          <SectionHeader step={2} title="Worked example: the disease test" blurb="The classic application that everyone gets wrong on the first try." />
          <p className="text-ink-dim leading-relaxed">
            A disease has prevalence <M>{`P(D)=0.01`}</M>. The test has
            sensitivity <M>{`P(+\\mid D)=0.99`}</M> and specificity{" "}
            <M>{`P(-\\mid \\neg D)=0.95`}</M> (so the false positive rate is
            5%). You test positive. What is <M>{`P(D\\mid +)`}</M>?
          </p>
          <ProofStepper
            title="Bayes step by step"
            steps={[
              {
                title: "Write down the goal.",
                math: "P(D \\mid +) = \\frac{P(+\\mid D)\\,P(D)}{P(+)}",
                reason: "Bayes' theorem applied to (D, +).",
              },
              {
                title: "Expand the denominator with the law of total probability.",
                math: "P(+) = P(+\\mid D)P(D) + P(+\\mid \\neg D)P(\\neg D)",
                reason: "{D, ¬D} is a partition of Ω, so we just add the two routes that produce a positive.",
              },
              {
                title: "Plug in the numbers.",
                math: "P(+) = (0.99)(0.01) + (0.05)(0.99) = 0.0099 + 0.0495 = 0.0594",
              },
              {
                title: "Now apply Bayes.",
                math: "P(D\\mid +) = \\frac{0.0099}{0.0594} \\approx 0.1667",
                reason: "Even after a positive test, the chance of disease is only ~17%, because most positives come from the much larger healthy population.",
              },
              {
                title: "Sanity check: what if you tested twice and both came back positive?",
                math: "P(D\\mid +,+) = \\frac{0.99^2 \\cdot 0.01}{0.99^2 \\cdot 0.01 + 0.05^2 \\cdot 0.99} \\approx 0.798",
                reason: "Two independent positives shift the posterior dramatically — the likelihood ratio multiplied in twice.",
              },
            ]}
          />

          <SectionHeader step={3} title="From point updates to full Bayesian inference" blurb="Now do it for a continuous parameter — and watch the posterior reshape with each new observation." />
          <p className="text-ink-dim leading-relaxed">
            Below, the parameter is the bias <M>{`\\theta`}</M> of a coin. The
            prior is <M>{`\\text{Beta}(\\alpha_0, \\beta_0)`}</M>. After
            observing <M>{`h`}</M> heads and <M>{`t`}</M> tails, the posterior
            is <M>{`\\text{Beta}(\\alpha_0+h,\\beta_0+t)`}</M>. (The Beta is
            the <em>conjugate prior</em> for the Bernoulli — a fact you should
            later re-derive yourself by writing out the proportionality.)
          </p>
          <BayesUpdater />

          <TheoremCard
            kind="theorem"
            name="Bayes' theorem (general)"
            statement={
              <>
                For any partition <M>{`\\{A_i\\}_{i=1}^k`}</M> of{" "}
                <M>{`\\Omega`}</M> with <M>{`P(A_i)>0`}</M>, and any event{" "}
                <M>{`B`}</M> with <M>{`P(B)>0`}</M>:
              </>
            }
            formula={`P(A_j \\mid B) = \\frac{P(B\\mid A_j)\\,P(A_j)}{\\sum_{i=1}^k P(B\\mid A_i)\\,P(A_i)}.`}
          >
            The denominator simply normalises so the posterior probabilities
            across the partition sum to 1.
          </TheoremCard>
        </>
      ),
      misconceptions: [
        {
          wrong: "P(A | B) and P(B | A) are the same number.",
          right:
            "They are linked by Bayes' theorem and only equal when P(A) = P(B). In the disease test, P(+ | D) = 0.99 but P(D | +) ≈ 0.17.",
          why: "The two conditional probabilities measure different things: one fixes the cause, the other fixes the effect.",
        },
        {
          wrong: "Independent and mutually exclusive mean the same thing.",
          right:
            "They are almost opposites. If A and B are mutually exclusive with positive probabilities, then knowing B happened tells you A did NOT — that is maximum dependence, not independence.",
          why: "Independent means P(A∩B) = P(A)P(B); mutually exclusive means P(A∩B) = 0. They coincide only in degenerate cases.",
        },
        {
          wrong: "If P(A | B) is high, then B caused A.",
          right:
            "Conditional probability measures association, not causation. A common third cause C can drive both A and B without B causing A.",
          why: "Causal inference requires extra assumptions or interventions; pure probabilities never imply causation by themselves.",
        },
      ],
      takeaways: [
        "Conditioning means restricting the sample space to B and re-normalising — geometry first, formula second.",
        "Bayes' theorem is just the symmetric form P(A∩B) = P(A|B)P(B) = P(B|A)P(A) solved for P(A|B).",
        "Always expand P(B) with the law of total probability; that's where base rates enter and where most errors hide.",
        "Independence is P(A∩B) = P(A)P(B); it is a strong assumption, not the default.",
        "Posteriors are priors × likelihood, normalised. Everything in Bayesian statistics is a variation on this theme.",
      ],
      quiz: [
        {
          id: "q1",
          prompt:
            "A test is 99% accurate (sensitivity = specificity = 0.99) for a disease with prevalence 0.5%. You test positive. Roughly P(disease | +) is?",
          choices: [
            { id: "a", label: "≈ 0.99" },
            { id: "b", label: "≈ 0.50" },
            { id: "c", label: "≈ 0.33" },
            { id: "d", label: "≈ 0.05" },
          ],
          answer: "c",
          explanation:
            "P(+) = 0.99·0.005 + 0.01·0.995 ≈ 0.0149, so P(D|+) = 0.00495/0.0149 ≈ 0.33. The base rate dominates.",
        },
        {
          id: "q2",
          prompt:
            "Which equality characterises independence of A and B (assume P(A), P(B) > 0)?",
          choices: [
            { id: "a", label: "P(A∩B) = 0" },
            { id: "b", label: "P(A) + P(B) = 1" },
            { id: "c", label: "P(A | B) = P(A)" },
            { id: "d", label: "P(A∪B) = P(A) + P(B)" },
          ],
          answer: "c",
          explanation:
            "Independence ⇔ P(A∩B) = P(A)P(B) ⇔ P(A|B) = P(A): observing B does not change the probability of A.",
        },
        {
          id: "q3",
          prompt:
            "You toss a Beta(2,2) prior at a coin and see 3 heads, 0 tails. The posterior is...",
          choices: [
            { id: "a", label: "Beta(2,2) (Bayes does not update)" },
            { id: "b", label: "Beta(5,2)" },
            { id: "c", label: "Beta(3,2)" },
            { id: "d", label: "Beta(2,5)" },
          ],
          answer: "b",
          explanation:
            "Beta is conjugate for Bernoulli/Binomial: posterior = Beta(α + heads, β + tails) = Beta(2+3, 2+0) = Beta(5,2).",
        },
        {
          id: "q4",
          type: "numeric",
          prompt:
            "P(D)=0.02, P(+|D)=0.95, P(+|¬D)=0.05. Compute P(D|+) (round to 3 decimals).",
          answer: 0.279,
          tolerance: 0.01,
          hint: "P(+) = 0.95·0.02 + 0.05·0.98. Then P(D|+) = 0.95·0.02 / P(+).",
          explanation: "P(+) = 0.019 + 0.049 = 0.068; P(D|+) = 0.019/0.068 ≈ 0.279.",
        },
        {
          id: "q5",
          type: "ordering",
          prompt: "Re-order the steps of applying Bayes' theorem to a disease test.",
          steps: [
            { id: "s1", label: "Identify P(D), P(+|D), P(+|¬D)" },
            { id: "s2", label: "Expand P(+) = P(+|D)·P(D) + P(+|¬D)·P(¬D)" },
            { id: "s3", label: "Apply P(D|+) = P(+|D)·P(D) / P(+)" },
            { id: "s4", label: "Compare to your intuition (base rates usually dominate)" },
          ],
          explanation: "Identify priors → total probability → Bayes → reality check.",
        },
      ],
      furtherReading: [
        { title: "Casella & Berger — Statistical Inference, ch. 1" },
        { title: "Bertsekas & Tsitsiklis — Introduction to Probability, ch. 1" },
        { title: "Gelman et al. — Bayesian Data Analysis, ch. 1–2" },
      ],
    },

    zh: {
      title: "條件機率與貝氏定理",
      subtitle:
        "新資訊如何重塑機率 — 所有推論機器背後的核心機制。",
      hook: "從更新對一枚硬幣的信念到解讀醫學檢測，這是「機率推理」的引擎。",
      whyItMatters: (
        <>
          幾乎每個有趣的機率問題都是條件式的。<em>已知</em>檢測陽性，得病的機率是多少？
          <em>已知</em>客戶點過一次，他會轉換的機率是多少？
          <em>已知</em>觀察到的資料，我們應該如何相信參數？
          貝氏定理是通用的「信念更新器」 ── 一旦你能用幾何方式感受到它，
          整套統計學、機器學習與機率推理的大廈就會在你眼裡變成一個前後一致的故事。
        </>
      ),
      intuition: (
        <>
          <p>
            機率是切割「可能性」的一種方式。整個樣本空間 <M>{`\\Omega`}</M>{" "}
            就是所有可能發生的事。<em>條件機率 </em>
            <M>{`P(A\\mid B)`}</M> 的意思就是：
            <em>把宇宙縮小成 B，再問 B 中有多少同時也是 A。</em>
          </p>
          <p>
            就這樣 ── 還沒有任何哲學，就只是「縮小視野」。當有人告訴你
            「<M>{`B`}</M> 發生了」，遊戲規則沒有改變，但比賽場地縮小了。
          </p>
          <p>
            貝氏定理回答的是反方向的問題：不是「已知原因，結果有多可能」，
            而是「已知結果，原因有多可能」。這兩個方向的數字並不相等 ──
            混淆它們是世界上最常見的機率錯誤。
          </p>
        </>
      ),
      formal: (
        <>
          <p>
            設 <M>{`(\\Omega, \\mathcal{F}, P)`}</M> 是一個機率空間，
            <M>{`A, B \\in \\mathcal{F}`}</M>，且 <M>{`P(B) > 0`}</M>。
            <em>給定 B 時 A 的條件機率</em>定義為：
          </p>
          <FormulaBlock
            formula={`P(A \\mid B) \\;=\\; \\frac{P(A \\cap B)}{P(B)}`}
            question="在 B 發生的所有世界中，A 同時發生的比例是多少？"
          />
          <p>
            交換 <M>{`A`}</M> 與 <M>{`B`}</M> 的角色，並讓兩個分子相等，
            就得到貝氏定理：
          </p>
          <FormulaBlock
            formula={`P(A \\mid B) \\;=\\; \\frac{P(B \\mid A)\\,P(A)}{P(B)}`}
            question="觀察到 B 之後，我應該如何更新對 A 的信念？"
          />
          <p>
            分母 <M>{`P(B)`}</M> 通常用<em>全機率公式</em>展開，
            其中 <M>{`\\{A_i\\}`}</M> 是 <M>{`\\Omega`}</M> 的一個分割：
          </p>
          <MD>{`P(B) = \\sum_i P(B\\mid A_i)\\,P(A_i).`}</MD>
          <p>
            兩個事件 <M>{`A`}</M> 與 <M>{`B`}</M> <em>獨立</em>，
            若且唯若 <M>{`P(A\\cap B)=P(A)P(B)`}</M>，
            等價地 <M>{`P(A\\mid B)=P(A)`}</M>。
            獨立的意思是「觀察到 B 對 A 不帶任何資訊」。
          </p>
        </>
      ),
      graduate: (
        <>
          <p>
            <strong>推廣到 σ-代數。</strong>初等定義{" "}
            <M>{`P(A\\mid B)=P(A\\cap B)/P(B)`}</M>{" "}
            只在 <M>{`P(B)>0`}</M> 時有意義。
            成熟的版本是<em>給定 σ-代數的條件期望值</em>：
            <M>{`E[X \\mid \\mathcal{G}]`}</M>{" "}
            被定義為（在 <M>P</M>-零測集上唯一的）<M>{`\\mathcal{G}`}</M>-可測隨機變數，
            滿足對所有 <M>{`G\\in\\mathcal{G}`}</M> 都有
            <M>{`\\int_G E[X\\mid \\mathcal{G}]\\,dP = \\int_G X\\,dP`}</M>。
            這才是處理「條件在連續事件上」（逐點條件會除以零）的正確架構，
            也是 martingale、濾波理論與現代隨機分析的基礎。
          </p>
          <p>
            <strong>貝氏其實就是「歸一化」。</strong>把它寫成{" "}
            <M>{`P(\\theta\\mid x) \\propto P(x\\mid \\theta)\\,P(\\theta)`}</M>。
            先驗 <M>{`P(\\theta)`}</M> 對概似 <M>{`P(x\\mid\\theta)`}</M>{" "}
            做加權，而邊際 <M>{`P(x)=\\int P(x\\mid\\theta)P(\\theta)\\,d\\theta`}</M>{" "}
            存在的唯一目的就是讓總和等於 1。在高維模型裡，邊際才是最難的部分 ──
            這就是為什麼 MCMC、變分推論、SMC 等方法存在的理由。
          </p>
          <p>
            <strong>常見誤用：忽略基率（base-rate neglect）。</strong>
            一個對盛行率為 1/10000 的疾病有 99% 敏感度與 99% 特異度的檢測，
            條件機率 <M>{`P(\\text{disease}\\mid+) \\approx 1\\%`}</M>。
            算術是輕鬆的，認知陷阱是忘了 <M>{`P(\\theta)`}</M>。
            每當你看到「這個檢測 99% 準確」，請反問：<em>是 99% 的什麼？</em>
          </p>
          <p>
            <strong>橫向連結。</strong>概似比{" "}
            <M>{`P(B\\mid A)/P(B\\mid \\neg A)`}</M>{" "}
            出現在 Neyman–Pearson 檢定的檢定統計量裡，
            出現在 logistic 迴歸的 score 裡，也出現在貝氏序列更新的乘法權重裡。
            這三個東西其實是同一個物件。
          </p>
        </>
      ),
      body: (
        <>
          <SectionHeader step={1} title="視覺化解釋" blurb="拖動滑桿。每個矩形都代表一個機率。" />
          <ConditionalProbabilityGrid />

          <SectionHeader step={2} title="工作範例：疾病檢測" blurb="這個經典應用，幾乎每個人第一次都會算錯。" />
          <p className="text-ink-dim leading-relaxed">
            某疾病的盛行率為 <M>{`P(D)=0.01`}</M>，檢測的敏感度為{" "}
            <M>{`P(+\\mid D)=0.99`}</M>，特異度為{" "}
            <M>{`P(-\\mid \\neg D)=0.95`}</M>（也就是偽陽性率為 5%）。
            你被檢測出陽性，那麼 <M>{`P(D\\mid +)`}</M> 是多少？
          </p>
          <ProofStepper
            title="一步步算貝氏"
            steps={[
              {
                title: "寫下目標。",
                math: "P(D \\mid +) = \\frac{P(+\\mid D)\\,P(D)}{P(+)}",
                reason: "把貝氏定理套用到 (D, +)。",
              },
              {
                title: "用全機率公式展開分母。",
                math: "P(+) = P(+\\mid D)P(D) + P(+\\mid \\neg D)P(\\neg D)",
                reason: "{D, ¬D} 是 Ω 的一個分割，所以我們把產生陽性的兩條路徑加總。",
              },
              {
                title: "代入數字。",
                math: "P(+) = (0.99)(0.01) + (0.05)(0.99) = 0.0099 + 0.0495 = 0.0594",
              },
              {
                title: "套回貝氏。",
                math: "P(D\\mid +) = \\frac{0.0099}{0.0594} \\approx 0.1667",
                reason: "即使檢測為陽性，得病機率也只有約 17%，因為大多數陽性其實來自人數遠遠更多的健康族群。",
              },
              {
                title: "理智檢查：如果你連續做兩次檢測，都是陽性呢？",
                math: "P(D\\mid +,+) = \\frac{0.99^2 \\cdot 0.01}{0.99^2 \\cdot 0.01 + 0.05^2 \\cdot 0.99} \\approx 0.798",
                reason: "兩次獨立陽性大幅推升了後驗機率 ── 概似比被乘了兩次。",
              },
            ]}
          />

          <SectionHeader step={3} title="從點更新到完整貝氏推論" blurb="現在把參數從離散變成連續 ── 看後驗如何隨每筆新觀察重新塑形。" />
          <p className="text-ink-dim leading-relaxed">
            下面這個範例的參數是一枚硬幣的偏差 <M>{`\\theta`}</M>。
            先驗是 <M>{`\\text{Beta}(\\alpha_0, \\beta_0)`}</M>。
            觀察到 <M>{`h`}</M> 次正面、<M>{`t`}</M> 次反面之後，
            後驗就是 <M>{`\\text{Beta}(\\alpha_0+h,\\beta_0+t)`}</M>。
            （Beta 是 Bernoulli 的<em>共軛先驗</em> ──
            這個事實你之後應該透過寫出比例式自己重新推一次。）
          </p>
          <BayesUpdater />

          <TheoremCard
            kind="theorem"
            name="貝氏定理（一般形式）"
            statement={
              <>
                對於 <M>{`\\Omega`}</M> 的任何分割{" "}
                <M>{`\\{A_i\\}_{i=1}^k`}</M>（其中 <M>{`P(A_i)>0`}</M>）
                與任何事件 <M>{`B`}</M>（其中 <M>{`P(B)>0`}</M>）：
              </>
            }
            formula={`P(A_j \\mid B) = \\frac{P(B\\mid A_j)\\,P(A_j)}{\\sum_{i=1}^k P(B\\mid A_i)\\,P(A_i)}.`}
          >
            分母單純做歸一化，使整個分割上的後驗機率加起來等於 1。
          </TheoremCard>
        </>
      ),
      misconceptions: [
        {
          wrong: "P(A | B) 和 P(B | A) 是同一個數。",
          right:
            "它們由貝氏定理連結，只有當 P(A) = P(B) 時才相等。在疾病檢測例子裡，P(+ | D) = 0.99，但 P(D | +) ≈ 0.17。",
          why: "兩個條件機率衡量的是不同的東西：一個固定原因，另一個固定結果。",
        },
        {
          wrong: "獨立和互斥是同一回事。",
          right:
            "它們其實幾乎是相反的。若 A、B 互斥且各自機率為正，那麼知道 B 發生就告訴你 A 一定沒發生 ── 這是最大依賴，而不是獨立。",
          why: "獨立的意思是 P(A∩B) = P(A)P(B)；互斥的意思是 P(A∩B) = 0。兩者只在退化情形下才一致。",
        },
        {
          wrong: "如果 P(A | B) 很高，那 B 就導致了 A。",
          right:
            "條件機率衡量的是「關聯」，不是「因果」。一個共同的第三個原因 C 可以同時驅動 A 和 B，而 B 並沒有導致 A。",
          why: "因果推論需要額外的假設或介入；純粹的機率永遠無法單獨蘊含因果。",
        },
      ],
      takeaways: [
        "條件就是「把樣本空間限制到 B 並重新歸一化」── 先看幾何，再寫公式。",
        "貝氏定理不過是對稱式 P(A∩B) = P(A|B)P(B) = P(B|A)P(A) 解出 P(A|B)。",
        "永遠用全機率公式展開 P(B)；基率就藏在這一步，大多數錯誤也藏在這一步。",
        "獨立 ⇔ P(A∩B) = P(A)P(B)；它是一個強假設，不是預設。",
        "後驗 = 先驗 × 概似，再歸一化。整個貝氏統計學都只是這個主題的變奏。",
      ],
      quiz: [
        {
          id: "q1",
          prompt:
            "某個檢測 99% 準確（敏感度 = 特異度 = 0.99），疾病盛行率為 0.5%。你檢測為陽性，那麼 P(disease | +) 大約是？",
          choices: [
            { id: "a", label: "≈ 0.99" },
            { id: "b", label: "≈ 0.50" },
            { id: "c", label: "≈ 0.33" },
            { id: "d", label: "≈ 0.05" },
          ],
          answer: "c",
          explanation:
            "P(+) = 0.99·0.005 + 0.01·0.995 ≈ 0.0149，所以 P(D|+) = 0.00495/0.0149 ≈ 0.33。基率主導了一切。",
        },
        {
          id: "q2",
          prompt:
            "下列哪個等式刻畫 A 與 B 的獨立性（假設 P(A)、P(B) > 0）？",
          choices: [
            { id: "a", label: "P(A∩B) = 0" },
            { id: "b", label: "P(A) + P(B) = 1" },
            { id: "c", label: "P(A | B) = P(A)" },
            { id: "d", label: "P(A∪B) = P(A) + P(B)" },
          ],
          answer: "c",
          explanation:
            "獨立 ⇔ P(A∩B) = P(A)P(B) ⇔ P(A|B) = P(A)：觀察 B 不會改變 A 的機率。",
        },
        {
          id: "q3",
          prompt:
            "你拿一個 Beta(2, 2) 先驗去更新一枚硬幣，觀察到 3 次正面、0 次反面。後驗是？",
          choices: [
            { id: "a", label: "Beta(2,2)（貝氏沒有更新）" },
            { id: "b", label: "Beta(5,2)" },
            { id: "c", label: "Beta(3,2)" },
            { id: "d", label: "Beta(2,5)" },
          ],
          answer: "b",
          explanation:
            "Beta 是 Bernoulli/Binomial 的共軛先驗：後驗 = Beta(α + heads, β + tails) = Beta(2+3, 2+0) = Beta(5,2)。",
        },
        {
          id: "q4",
          type: "numeric",
          prompt:
            "P(D)=0.02、P(+|D)=0.95、P(+|¬D)=0.05。計算 P(D|+)（取 3 位小數）。",
          answer: 0.279,
          tolerance: 0.01,
          hint: "P(+) = 0.95·0.02 + 0.05·0.98。然後 P(D|+) = 0.95·0.02 / P(+)。",
          explanation: "P(+) = 0.019 + 0.049 = 0.068；P(D|+) = 0.019/0.068 ≈ 0.279。",
        },
        {
          id: "q5",
          type: "ordering",
          prompt: "把「對疾病檢測套用貝氏定理」的步驟重新排序。",
          steps: [
            { id: "s1", label: "辨認 P(D)、P(+|D)、P(+|¬D)" },
            { id: "s2", label: "展開 P(+) = P(+|D)·P(D) + P(+|¬D)·P(¬D)" },
            { id: "s3", label: "套用 P(D|+) = P(+|D)·P(D) / P(+)" },
            { id: "s4", label: "和直覺對照（基率通常是主導）" },
          ],
          explanation: "辨認先驗 → 全機率 → 貝氏 → 理智檢查。",
        },
      ],
      furtherReading: [
        { title: "Casella & Berger — Statistical Inference, ch. 1" },
        { title: "Bertsekas & Tsitsiklis — Introduction to Probability, ch. 1" },
        { title: "Gelman et al. — Bayesian Data Analysis, ch. 1–2" },
      ],
    },
  },
};

export default chapter;
