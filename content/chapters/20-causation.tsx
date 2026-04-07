import { Chapter } from "../types";
import { M } from "@/components/math/Math";
import { FormulaBlock } from "@/components/math/FormulaBlock";
import { TheoremCard } from "@/components/math/TheoremCard";
import { CausationLab } from "@/components/interactive/CausationLab";
import { SectionHeader } from "@/components/learning/SectionHeader";

const chapter: Chapter = {
  meta: {
    slug: "correlation-vs-causation",
    module: "G_regression",
    number: 20,
    minutes: 35,
    level: 4,
    prereqs: ["linear-regression"],
    tags: ["causation", "confounders", "Simpson's paradox", "do-calculus"],
  },
  localized: {
    en: {
      title: "Correlation vs Causation",
      subtitle:
        "Statistics measures association. Causal inference requires extra structure. Confounders, colliders, Simpson's paradox — and the basic toolkit for distinguishing 'A causes B' from 'A and B happen together'.",
      hook: "Why a positive correlation between ice cream sales and drownings does not mean ice cream causes drowning — and the formal language we use to say this without arm-waving.",
      whyItMatters: (
        <>
          Every statistical method in this course measures association,
          not causation. Knowing where the boundary is — and what extra
          assumptions or interventions you need to cross it — is what
          separates &quot;the data say X&quot; from &quot;X causes Y&quot;.
          Pearl&apos;s do-calculus, randomised experiments, instrumental
          variables, and DAG identification are the tools for the second
          claim. Without them, you have correlation only.
        </>
      ),
      intuition: (
        <>
          <p>
            Two variables can be correlated for at least four reasons:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 mt-2">
            <li><strong>Direct cause</strong>: <M>X → Y</M>. Smoking causes lung cancer.</li>
            <li><strong>Reverse cause</strong>: <M>Y → X</M>. People take medicine because they&apos;re sick — observational data shows the &quot;sicker after taking the medicine&quot; pattern.</li>
            <li><strong>Common cause (confounding)</strong>: <M>{`X \\leftarrow Z \\rightarrow Y`}</M>. Ice cream sales and drowning are both driven by hot weather.</li>
            <li><strong>Selection (collider) bias</strong>: a third variable conditions on a downstream effect of both X and Y. Restaurant restaurants you&apos;ve heard of are good or famous; the &quot;good vs famous&quot; correlation is induced by your sampling.</li>
          </ul>
          <p>
            The point is that <em>only the first one</em> is a causal
            claim, and observational data alone cannot tell you which
            scenario you&apos;re in. Distinguishing them needs either
            (a) a randomised intervention, (b) a known causal graph, or
            (c) clever identification tricks (instrumental variables,
            regression discontinuity, difference-in-differences).
          </p>
        </>
      ),
      formal: (
        <>
          <p>
            Pearl&apos;s framework introduces an <em>intervention operator</em>{" "}
            <M>{`\\text{do}(X = x)`}</M>: instead of <em>observing</em>{" "}
            <M>X = x</M>, we <em>force</em> it. The two are not generally
            the same:
          </p>
          <FormulaBlock
            formula={`P(Y \\mid X = x) \\;\\ne\\; P(Y \\mid \\text{do}(X = x)) \\quad \\text{in general}.`}
            question="What's the difference between observing X = x and forcing X = x?"
          />
          <p>
            They differ whenever there&apos;s a confounder. Conditioning
            on <M>{`X = x`}</M> picks out the subpopulation where{" "}
            <M>X</M> happened to equal <M>x</M> (and confounders likely
            differ); <M>{`\\text{do}(X = x)`}</M> changes <M>X</M>{" "}
            without disturbing anything upstream of it.
          </p>
          <p>
            <strong>Backdoor adjustment.</strong> If <M>Z</M> is a set
            of variables that blocks every &quot;backdoor&quot; path from
            <M>X</M> to <M>Y</M> (intuitively, every common-cause path),
            then
          </p>
          <FormulaBlock
            formula={`P(Y \\mid \\text{do}(X = x)) = \\sum_z P(Y \\mid X = x, Z = z) P(Z = z).`}
          />
          <p>
            This is the do-calculus version of saying &quot;control for
            <M>Z</M>&quot;. It assumes you know the causal graph.
          </p>
          <p>
            <strong>Simpson&apos;s paradox.</strong> A relationship that
            holds in every subgroup can vanish or reverse when subgroups
            are pooled. Algebraically:
          </p>
          <FormulaBlock
            formula={`\\text{Cov}(X, Y) = \\sum_z P(Z = z) \\text{Cov}(X, Y \\mid Z = z) + \\text{Cov}(E[X \\mid Z], E[Y \\mid Z])`}
          />
          <p>
            The second term — variation across confounder groups — can
            dominate the first and flip the apparent direction. The
            within-group covariances are causally meaningful (under
            appropriate assumptions); the marginal one is not.
          </p>
        </>
      ),
      graduate: (
        <>
          <p>
            <strong>Randomisation eliminates confounding.</strong> If you
            randomly assign <M>X</M>, then <M>X</M> is independent of all
            its potential causes (because nothing is). The backdoor
            criterion is automatically satisfied with{" "}
            <M>{`Z = \\emptyset`}</M>, so{" "}
            <M>{`P(Y \\mid X = x) = P(Y \\mid \\text{do}(X = x))`}</M>{" "}
            and observational regression recovers the causal effect.
            This is why randomised controlled trials are the gold
            standard.
          </p>
          <p>
            <strong>Instrumental variables.</strong> When randomisation
            isn&apos;t possible, an <em>instrument</em> <M>Z</M>{" "}
            satisfies: (i) <M>Z</M> affects <M>X</M>, (ii) <M>Z</M>{" "}
            affects <M>Y</M> only through <M>X</M> (the exclusion
            restriction), and (iii) <M>Z</M> is independent of any
            unobserved confounders. Then the IV estimator{" "}
            <M>{`\\hat\\beta_{\\text{IV}} = \\text{Cov}(Y, Z) / \\text{Cov}(X, Z)`}</M>{" "}
            recovers the causal effect of <M>X</M> on <M>Y</M>. The
            classic example: using draft lottery numbers as an instrument
            for military service to estimate its causal effect on lifetime
            earnings.
          </p>
          <p>
            <strong>Colliders are sneaky.</strong> If <M>{`X \\to C \\leftarrow Y`}</M>{" "}
            (i.e. <M>C</M> is a common <em>effect</em> of <M>X</M> and{" "}
            <M>Y</M>), then conditioning on <M>C</M> <em>creates</em>{" "}
            spurious correlation between <M>X</M> and <M>Y</M> even when
            they&apos;re marginally independent. This is the opposite of
            confounding bias and is the most subtle source of error in
            causal analyses. The Berkson selection paradox in medical
            data is a colour-by-numbers case.
          </p>
          <p>
            <strong>Counterfactuals.</strong> The deepest causal
            quantity: &quot;What would <M>Y</M> have been if <M>X</M>{" "}
            had been different?&quot; Counterfactuals are not directly
            observable — they require strong structural assumptions to
            identify. Rubin&apos;s potential-outcomes framework formalises
            them; ideas like Average Treatment Effect (ATE), Average
            Treatment Effect on the Treated (ATT), and the propensity-
            score machinery all live in this space.
          </p>
          <p>
            <strong>Common misuse.</strong> &quot;X is correlated with Y
            in our data, so X probably causes Y.&quot; The chain of
            assumptions you would need to make this leap is enormous:
            no confounders, no reverse causation, no selection bias, no
            measurement error, the right functional form, etc. Most
            failures of causal inference come from skipping over the
            assumptions silently.
          </p>
        </>
      ),
      body: (
        <>
          <SectionHeader step={1} title="Build a confounded dataset and watch the slopes flip" blurb="Crank up confounder strength and watch how the marginal slope (amber) drifts away from the per-group slopes (dashed). With enough confounding, the marginal slope can even flip sign — Simpson's paradox in motion." />
          <CausationLab />

          <SectionHeader step={2} title="Worked example: a Simpson's paradox" />
          <p className="text-ink-dim leading-relaxed">
            Consider a kidney-stone study where two treatments are
            compared on small and large stones:
          </p>
          <div className="my-3 overflow-x-auto rounded-xl border border-bg-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-bg-border bg-bg-soft text-ink-dim">
                  <th className="px-3 py-2 text-left"></th>
                  <th className="px-3 py-2">Small stones</th>
                  <th className="px-3 py-2">Large stones</th>
                  <th className="px-3 py-2">Both combined</th>
                </tr>
              </thead>
              <tbody className="text-ink-dim">
                <tr className="border-b border-bg-border">
                  <td className="px-3 py-2">Treatment A</td>
                  <td className="px-3 py-2 text-accent-green">93% (81/87)</td>
                  <td className="px-3 py-2 text-accent-green">73% (192/263)</td>
                  <td className="px-3 py-2 text-accent-rose">78% (273/350)</td>
                </tr>
                <tr>
                  <td className="px-3 py-2">Treatment B</td>
                  <td className="px-3 py-2">87% (234/270)</td>
                  <td className="px-3 py-2">69% (55/80)</td>
                  <td className="px-3 py-2 text-accent-green">83% (289/350)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-ink-dim leading-relaxed">
            Within each subgroup of stone size, treatment A has a higher
            success rate. When you pool, treatment B looks better. The
            reason: stone size is a confounder, and treatment A was
            preferentially assigned to the harder cases (large stones).
            The within-group estimates are causally meaningful; the
            pooled one is not.
          </p>

          <TheoremCard
            kind="theorem"
            name="Backdoor criterion (Pearl)"
            statement={
              <>
                A set <M>Z</M> satisfies the backdoor criterion relative
                to <M>{`(X, Y)`}</M> if (i) no node in <M>Z</M> is a
                descendant of <M>X</M>, and (ii) <M>Z</M> blocks every
                path between <M>X</M> and <M>Y</M> that contains an
                arrow into <M>X</M>. Then
              </>
            }
            formula={`P(Y \\mid \\text{do}(X = x)) = \\sum_z P(Y \\mid X = x, Z = z) P(Z = z).`}
          >
            This is the formal &quot;control for the right variables&quot;
            recipe. It explicitly tells you what assumptions you need:
            you must know which variables to condition on (and which NOT
            to, e.g. colliders).
          </TheoremCard>
        </>
      ),
      misconceptions: [
        {
          wrong: "Correlation implies causation if the correlation is strong enough.",
          right:
            "No magnitude of correlation is enough. Without an experimental intervention, an instrument, or a known causal graph, all you have is association — full stop. The strength of the correlation has nothing to do with causality.",
        },
        {
          wrong: "If you control for everything, you'll get the causal effect.",
          right:
            "Controlling for too much can be just as bad as too little. Controlling for a collider INDUCES spurious correlations. Controlling for a mediator destroys the very effect you're trying to measure. You need to know which variables to condition on — and which NOT to.",
        },
        {
          wrong: "Randomised trials are not necessary if your sample is large enough.",
          right:
            "Sample size has zero effect on confounding bias. A million observational data points still gives you a biased causal estimate if the confounders aren't accounted for. Only randomisation (or a valid IV) breaks the confounding link.",
        },
        {
          wrong: "Granger causality is causal.",
          right:
            "Granger causality is just a test for predictive precedence: does X help predict Y beyond Y's own past? It captures temporal correlation, not causation. Two variables both driven by a third can show 'Granger causality' in either direction.",
        },
      ],
      takeaways: [
        "Correlation can arise from direct cause, reverse cause, confounding, or collider/selection bias — and observational data can't distinguish them on its own.",
        "Pearl's do-operator distinguishes 'observing X = x' from 'setting X = x'. The two only agree under specific causal-graph conditions.",
        "Backdoor adjustment: control for variables that block all backdoor paths from X to Y. You need a causal DAG to know which.",
        "Simpson's paradox is the discrete-data face of confounding: pooled and within-group statistics can disagree, even reverse.",
        "Randomisation eliminates confounding by construction. When it's not feasible, instruments, RDD, and DiD are the standard substitutes.",
        "Conditioning on a COLLIDER creates spurious correlation — controlling for everything is not safe.",
      ],
      quiz: [
        {
          id: "q1",
          prompt:
            "Ice cream sales and drowning rates are positively correlated. The most likely explanation is...",
          choices: [
            { id: "a", label: "Ice cream causes drowning" },
            { id: "b", label: "Drowning causes ice cream sales" },
            { id: "c", label: "A common cause: hot weather drives both" },
            { id: "d", label: "Selection bias in the sample" },
          ],
          answer: "c",
          explanation:
            "Hot weather is a confounder: it increases both ice cream sales and swimming (and hence drowning). The X→Y correlation is driven by the common cause Z = weather.",
        },
        {
          id: "q2",
          prompt:
            "What is the difference between P(Y | X = x) and P(Y | do(X = x))?",
          choices: [
            { id: "a", label: "They are always equal." },
            { id: "b", label: "Conditioning observes X = x in the data; do() forces X = x and breaks the causal links into X." },
            { id: "c", label: "do() is just notation; it has no operational meaning." },
            { id: "d", label: "They are equal only when n is large." },
          ],
          answer: "b",
          explanation:
            "Conditioning selects the subpopulation where X happened to equal x; do() removes the influence of all confounders by forcing X. They differ exactly when there is confounding.",
        },
        {
          id: "q3",
          type: "numeric",
          prompt:
            "In a Simpson's-paradox table, treatment A has 93% and 73% success rates in subgroups, with 87 and 263 patients. What is treatment A's overall success rate? (rounded to a percent)",
          answer: 78,
          tolerance: 1,
          hint: "Weighted average of 93% and 73% by 87 and 263.",
          explanation: "(0.93·87 + 0.73·263) / (87 + 263) = (80.91 + 191.99) / 350 ≈ 272.9 / 350 ≈ 78%.",
        },
        {
          id: "q4",
          type: "ordering",
          prompt: "Re-order the steps of the backdoor adjustment recipe.",
          steps: [
            { id: "s1", label: "Specify a causal DAG with X, Y, and possible confounders" },
            { id: "s2", label: "Identify a set Z that blocks every backdoor path X ← ... → Y" },
            { id: "s3", label: "Estimate P(Y | X, Z) and P(Z) from data" },
            { id: "s4", label: "Compute P(Y | do(X)) = Σ_z P(Y | X, Z=z) P(Z=z)" },
            { id: "s5", label: "Use this to estimate causal effects (e.g. ATE)" },
          ],
          explanation: "Draw the DAG → find a backdoor-blocking set → estimate the conditional and marginal of Z → adjust → derive causal quantities.",
        },
      ],
      furtherReading: [
        { title: "Pearl — Causality (2nd ed.)" },
        { title: "Pearl, Glymour & Jewell — Causal Inference in Statistics: A Primer" },
        { title: "Hernán & Robins — Causal Inference: What If" },
        { title: "Imbens & Rubin — Causal Inference for Statistics, Social, and Biomedical Sciences" },
      ],
    },

    zh: {
      title: "相關 vs 因果",
      subtitle:
        "統計衡量「關聯」。因果推論需要額外的結構。Confounder、collider、Simpson 悖論 ── 以及區分「A 導致 B」與「A 和 B 一起發生」的基本工具。",
      hook: "為什麼「冰淇淋銷量」和「溺水率」正相關「不」代表冰淇淋導致溺水 ── 以及我們用什麼正式語言來說這件事而不揮手帶過。",
      whyItMatters: (
        <>
          這門課的每一個統計方法都在量化「關聯」，不是因果。
          知道邊界在哪 ── 以及跨越它需要什麼額外的假設或介入 ──
          就是「資料說 X」與「X 導致 Y」之間的差別。
          Pearl 的 do-calculus、隨機實驗、instrumental variables、DAG 識別 ──
          這些是支持第二個陳述的工具。
          沒有它們，你只有關聯。
        </>
      ),
      intuition: (
        <>
          <p>兩個變數可以因為下列至少四個理由而相關：</p>
          <ul className="list-disc pl-6 space-y-1.5 mt-2">
            <li><strong>直接因果</strong>：<M>X → Y</M>。吸菸導致肺癌。</li>
            <li><strong>反向因果</strong>：<M>Y → X</M>。生病的人才吃藥 ── 觀察資料會顯示「吃藥之後比較病」的模式。</li>
            <li><strong>共同原因（confounding）</strong>：<M>{`X \\leftarrow Z \\rightarrow Y`}</M>。冰淇淋銷量和溺水都被「炎熱天氣」驅動。</li>
            <li><strong>選擇（collider）偏誤</strong>：第三個變數在「X 與 Y 共同的下游效應」上條件。你聽過的餐廳要嘛好吃要嘛有名；「好吃 vs 有名」的相關是被你的取樣方式誘導出來的。</li>
          </ul>
          <p>
            重點是：<em>只有第一個</em>是因果陳述，
            而觀察資料本身無法告訴你你在哪一個情境裡。
            區分它們需要：
            (a) 隨機介入、(b) 已知的因果圖、或
            (c) 巧妙的識別技巧
            （instrumental variables、regression discontinuity、difference-in-differences）。
          </p>
        </>
      ),
      formal: (
        <>
          <p>
            Pearl 的框架引入了一個<em>介入運算子</em>{" "}
            <M>{`\\text{do}(X = x)`}</M>：
            不是<em>觀察</em> <M>X = x</M>，而是<em>強迫</em>它。
            兩者一般並不相等：
          </p>
          <FormulaBlock
            formula={`P(Y \\mid X = x) \\;\\ne\\; P(Y \\mid \\text{do}(X = x)) \\quad \\text{一般而言}.`}
            question="「觀察 X = x」與「強迫 X = x」之間的差別是什麼？"
          />
          <p>
            它們在「有 confounder」時就會不同。
            條件在 <M>{`X = x`}</M> 上會挑出「<M>X</M> 剛好等於 <M>x</M> 的子族群」
            （而 confounder 也很可能不同）；
            <M>{`\\text{do}(X = x)`}</M> 改變 <M>X</M>，
            但不擾動它上游的任何東西。
          </p>
          <p>
            <strong>Backdoor 調整。</strong>
            若 <M>Z</M> 是一組變數，它阻擋了每一條從 <M>X</M> 到 <M>Y</M> 的「backdoor 路徑」
            （直覺上，每一條共同原因路徑），則
          </p>
          <FormulaBlock
            formula={`P(Y \\mid \\text{do}(X = x)) = \\sum_z P(Y \\mid X = x, Z = z) P(Z = z).`}
          />
          <p>
            這就是「控制 <M>Z</M>」這句話的 do-calculus 版本。
            它假設你知道因果圖。
          </p>
          <p>
            <strong>Simpson 悖論。</strong>
            一個在每個子群裡都成立的關係，在子群被合併時可能消失或反轉。
            代數上：
          </p>
          <FormulaBlock
            formula={`\\text{Cov}(X, Y) = \\sum_z P(Z = z) \\text{Cov}(X, Y \\mid Z = z) + \\text{Cov}(E[X \\mid Z], E[Y \\mid Z])`}
          />
          <p>
            第二項 ── 跨 confounder 群組的變化 ── 可以主宰第一項，
            並翻轉表面上的方向。
            群組內的協方差在適當假設下是因果上有意義的；
            邊際的那個則不是。
          </p>
        </>
      ),
      graduate: (
        <>
          <p>
            <strong>隨機化消除 confounding。</strong>
            如果你隨機指派 <M>X</M>，那 <M>X</M> 就和「所有它的潛在原因」獨立
            （因為沒有原因）。
            Backdoor 條件在 <M>{`Z = \\emptyset`}</M> 下自動滿足，所以
            <M>{`P(Y \\mid X = x) = P(Y \\mid \\text{do}(X = x))`}</M>，
            觀察迴歸就能回復因果效應。
            這就是隨機對照試驗為什麼是金標準。
          </p>
          <p>
            <strong>Instrumental variables。</strong>
            當隨機化不可行時，一個<em>工具變數</em> <M>Z</M> 滿足：
            (i) <M>Z</M> 影響 <M>X</M>；
            (ii) <M>Z</M> 只透過 <M>X</M> 影響 <M>Y</M>（exclusion restriction）；
            (iii) <M>Z</M> 與任何未觀察的 confounder 獨立。
            那 IV 估計量{" "}
            <M>{`\\hat\\beta_{\\text{IV}} = \\text{Cov}(Y, Z) / \\text{Cov}(X, Z)`}</M>{" "}
            就能回復 <M>X</M> 對 <M>Y</M> 的因果效應。
            經典範例：用「徵兵抽籤號碼」作為「服役」的工具，
            來估計服役對終身收入的因果效應。
          </p>
          <p>
            <strong>Collider 是狡猾的。</strong>
            如果 <M>{`X \\to C \\leftarrow Y`}</M>
            （也就是 <M>C</M> 是 <M>X</M> 與 <M>Y</M> 的共同<em>效應</em>），
            那麼條件在 <M>C</M> 上會在 <M>X</M> 和 <M>Y</M> 之間<em>創造</em>偽相關，
            即使它們邊際上獨立。
            這和 confounding 偏誤剛好相反，
            是因果分析中最隱晦的錯誤來源。
            醫療資料裡的 Berkson 選擇悖論是教科書級的例子。
          </p>
          <p>
            <strong>Counterfactual。</strong>
            最深的因果量：
            「如果 <M>X</M> 不一樣，<M>Y</M> 會是什麼？」
            Counterfactual 不能直接觀察 ──
            要識別它們需要強的結構性假設。
            Rubin 的 potential-outcomes 框架把它們形式化；
            ATE（平均處理效應）、ATT、傾向得分（propensity score）等概念都活在這個空間裡。
          </p>
          <p>
            <strong>常見誤用。</strong>
            「X 在我們的資料裡和 Y 相關，所以 X 大概導致 Y。」
            從這一步跨到下一步所需的假設鏈是巨大的：
            沒有 confounder、沒有反向因果、沒有選擇偏誤、沒有量測誤差、正確的函數形式 …
            因果推論的失敗大多來自於默默地跳過這些假設。
          </p>
        </>
      ),
      body: (
        <>
          <SectionHeader step={1} title="建一個有 confounder 的資料集，看斜率翻轉" blurb="把 confounder 強度拉大，看「邊際斜率」（橘色）如何漂離「組內斜率」（虛線）。confounding 夠強時，邊際斜率甚至會反向 ── Simpson 悖論在運作。" />
          <CausationLab />

          <SectionHeader step={2} title="工作範例：腎結石的 Simpson 悖論" />
          <p className="text-ink-dim leading-relaxed">
            考慮一個腎結石研究，比較兩種治療在小石頭與大石頭上的效果：
          </p>
          <div className="my-3 overflow-x-auto rounded-xl border border-bg-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-bg-border bg-bg-soft text-ink-dim">
                  <th className="px-3 py-2 text-left"></th>
                  <th className="px-3 py-2">小結石</th>
                  <th className="px-3 py-2">大結石</th>
                  <th className="px-3 py-2">合併</th>
                </tr>
              </thead>
              <tbody className="text-ink-dim">
                <tr className="border-b border-bg-border">
                  <td className="px-3 py-2">治療 A</td>
                  <td className="px-3 py-2 text-accent-green">93% (81/87)</td>
                  <td className="px-3 py-2 text-accent-green">73% (192/263)</td>
                  <td className="px-3 py-2 text-accent-rose">78% (273/350)</td>
                </tr>
                <tr>
                  <td className="px-3 py-2">治療 B</td>
                  <td className="px-3 py-2">87% (234/270)</td>
                  <td className="px-3 py-2">69% (55/80)</td>
                  <td className="px-3 py-2 text-accent-green">83% (289/350)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-ink-dim leading-relaxed">
            在每一個結石大小的子群裡，治療 A 的成功率較高。
            一旦合併，看起來治療 B 比較好。
            原因：結石大小是 confounder，
            而治療 A 被優先指派給比較困難的案例（大結石）。
            組內估計在因果上是有意義的；合併的那個則不是。
          </p>

          <TheoremCard
            kind="theorem"
            name="Backdoor 準則（Pearl）"
            statement={
              <>
                一組變數 <M>Z</M> 對 <M>{`(X, Y)`}</M> 滿足 backdoor 準則，
                若 (i) <M>Z</M> 中沒有節點是 <M>X</M> 的後代，
                且 (ii) <M>Z</M> 阻擋了每一條從 <M>X</M> 到 <M>Y</M> 的、
                包含「指向 <M>X</M> 的箭頭」的路徑。則
              </>
            }
            formula={`P(Y \\mid \\text{do}(X = x)) = \\sum_z P(Y \\mid X = x, Z = z) P(Z = z).`}
          >
            這就是「控制對的變數」這句話的形式化食譜。
            它明確告訴你「需要什麼假設」：
            你必須知道哪些變數要條件（以及哪些<em>不要</em>，例如 collider）。
          </TheoremCard>
        </>
      ),
      misconceptions: [
        {
          wrong: "只要相關性夠強，就蘊含因果。",
          right:
            "再強的相關性都不夠。沒有實驗性介入、沒有 instrument、沒有已知因果圖，你擁有的就只有「關聯」── 句點。相關的強度與因果性無關。",
        },
        {
          wrong: "把所有東西都控制住，就能得到因果效應。",
          right:
            "控制太多和控制太少一樣糟。控制 collider 會「誘導」偽相關。控制 mediator 會破壞你想量的效應本身。你必須知道「哪些變數要條件」── 以及哪些不要。",
        },
        {
          wrong: "樣本夠大就不需要隨機試驗。",
          right:
            "樣本大小對 confounding 偏誤完全無效。一百萬筆觀察資料，只要 confounder 沒被處理，因果估計仍然是有偏的。只有隨機化（或有效的 IV）能斷掉 confounding 連結。",
        },
        {
          wrong: "Granger 因果是因果。",
          right:
            "Granger 因果只是「預測先後性」的檢定：X 的過去能不能在 Y 自己的過去之外幫助預測 Y？它抓的是時間相關性，不是因果。兩個都被第三個變數驅動的變數，可以在任一方向上顯示「Granger 因果」。",
        },
      ],
      takeaways: [
        "相關可以來自直接因果、反向因果、confounding 或 collider/選擇偏誤 ── 觀察資料本身無法區分。",
        "Pearl 的 do 運算子區分「觀察 X = x」與「設定 X = x」。兩者只在特定的因果圖條件下一致。",
        "Backdoor 調整：控制所有阻擋 X 到 Y 的 backdoor 路徑的變數。你需要因果 DAG 才能知道是哪些。",
        "Simpson 悖論是 confounding 在離散資料上的面孔：合併與組內統計可以不一致，甚至反向。",
        "隨機化「依建構」消除 confounding。當不可行時，IV、RDD、DiD 是標準的替代品。",
        "條件在 collider 上「會」創造偽相關 ── 控制所有東西並不安全。",
      ],
      quiz: [
        {
          id: "q1",
          prompt:
            "冰淇淋銷量和溺水率正相關。最可能的解釋是？",
          choices: [
            { id: "a", label: "冰淇淋導致溺水" },
            { id: "b", label: "溺水導致冰淇淋銷量" },
            { id: "c", label: "共同原因：炎熱天氣同時驅動兩者" },
            { id: "d", label: "樣本中的選擇偏誤" },
          ],
          answer: "c",
          explanation:
            "炎熱天氣是 confounder：它同時增加冰淇淋銷量和游泳（也因此增加溺水）。X→Y 的相關是由共同原因 Z = 天氣 驅動的。",
        },
        {
          id: "q2",
          prompt:
            "P(Y | X = x) 與 P(Y | do(X = x)) 的差別是？",
          choices: [
            { id: "a", label: "它們永遠相等。" },
            { id: "b", label: "條件是「在資料裡觀察 X = x」；do() 是「強迫 X = x 並切斷指向 X 的因果連結」。" },
            { id: "c", label: "do() 只是符號，沒有運算意義。" },
            { id: "d", label: "它們只在 n 很大時相等。" },
          ],
          answer: "b",
          explanation:
            "條件挑出「X 剛好等於 x」的子族群；do() 透過「強迫 X」移除所有 confounder 的影響。它們在「有 confounding」時就會不同。",
        },
        {
          id: "q3",
          type: "numeric",
          prompt:
            "在 Simpson 悖論的表格中，治療 A 在子群裡的成功率為 93% 與 73%，病人數分別為 87 與 263。治療 A 的整體成功率是多少？（取整數百分比）",
          answer: 78,
          tolerance: 1,
          hint: "用 87 和 263 對 93% 和 73% 做加權平均。",
          explanation: "(0.93·87 + 0.73·263) / (87 + 263) = (80.91 + 191.99) / 350 ≈ 272.9 / 350 ≈ 78%。",
        },
        {
          id: "q4",
          type: "ordering",
          prompt: "把 backdoor 調整食譜的步驟重新排序。",
          steps: [
            { id: "s1", label: "指定一個包含 X、Y、可能 confounder 的因果 DAG" },
            { id: "s2", label: "找出一組 Z 阻擋每一條 backdoor 路徑 X ← ... → Y" },
            { id: "s3", label: "從資料估 P(Y | X, Z) 與 P(Z)" },
            { id: "s4", label: "計算 P(Y | do(X)) = Σ_z P(Y | X, Z=z) P(Z=z)" },
            { id: "s5", label: "用它估計因果效應（例如 ATE）" },
          ],
          explanation: "畫 DAG → 找阻擋 backdoor 的集合 → 估條件與 Z 的邊際 → 調整 → 推導因果量。",
        },
      ],
      furtherReading: [
        { title: "Pearl — Causality (2nd ed.)" },
        { title: "Pearl, Glymour & Jewell — Causal Inference in Statistics: A Primer" },
        { title: "Hernán & Robins — Causal Inference: What If" },
        { title: "Imbens & Rubin — Causal Inference for Statistics, Social, and Biomedical Sciences" },
      ],
    },
  },
};

export default chapter;
