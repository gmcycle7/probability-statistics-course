import { Chapter } from "../types";
import { M } from "@/components/math/Math";
import { FormulaBlock } from "@/components/math/FormulaBlock";
import { TheoremCard } from "@/components/math/TheoremCard";
import { ProofStepper } from "@/components/math/ProofStepper";
import { SectionHeader } from "@/components/learning/SectionHeader";

const chapter: Chapter = {
  meta: {
    slug: "sufficiency-and-efficiency",
    module: "D_inference",
    number: 8,
    minutes: 35,
    level: 5,
    prereqs: ["sampling-distributions"],
    tags: ["sufficiency", "Fisher information", "Cramér–Rao"],
  },
  localized: {
    en: {
      title: "Sufficiency, Fisher Information & Efficiency",
      subtitle:
        "Two deep questions: how much of the data do you really need, and how good can any estimator possibly be?",
      hook: "Sufficiency tells you what to throw away. Cramér–Rao tells you how good you're allowed to be.",
      whyItMatters: (
        <>
          Two of the most beautiful results in classical statistics. Sufficient
          statistics tell you exactly what compression of the data preserves
          all the information about a parameter — letting you replace n
          numbers with one or two without losing anything. The Cramér–Rao
          lower bound tells you the best variance any unbiased estimator can
          achieve, which is what makes &quot;efficient&quot; a precise word.
          Together they explain why MLE works.
        </>
      ),
      intuition: (
        <>
          <p>
            Imagine you collect 1,000 coin flips and want to estimate the
            bias <M>p</M>. Do you really need all 1,000 outcomes? No — you
            only need the count of heads. The count is <em>sufficient</em>:
            given the count, the actual ordering of heads and tails carries
            zero additional information about <M>p</M>.
          </p>
          <p>
            That&apos;s sufficiency in one sentence: a function of the data
            is sufficient if conditioning on it makes the data&apos;s
            distribution independent of the parameter.
          </p>
          <p>
            Now flip the question: how good can any estimator possibly be?
            The answer is the Cramér–Rao lower bound: variance{" "}
            <M>{`\\ge 1/(n I(\\theta))`}</M>, where <M>{`I(\\theta)`}</M> is
            the Fisher information — a measure of how much each observation
            tells you about <M>θ</M>. An estimator that hits this bound is
            <em> efficient</em>; nothing can do better.
          </p>
        </>
      ),
      formal: (
        <>
          <p>
            A statistic <M>{`T(X)`}</M> is <em>sufficient</em> for{" "}
            <M>θ</M> if the conditional distribution of the data given{" "}
            <M>{`T(X)`}</M> does not depend on <M>θ</M>:
          </p>
          <FormulaBlock
            formula={`P(X = x \\mid T(X) = t,\\, \\theta) = P(X = x \\mid T(X) = t).`}
            question="Does T(X) carry all the information about θ?"
          />
          <p>
            The practical way to identify sufficient statistics is the{" "}
            <em>Fisher–Neyman factorisation theorem</em>:
          </p>
          <FormulaBlock
            formula={`f(x;\\theta) = g(T(x);\\theta) \\cdot h(x).`}
          />
          <p>
            If you can split the joint density into a piece that depends on{" "}
            <M>θ</M> and the data only through <M>T(x)</M>, times a piece
            that doesn&apos;t depend on <M>θ</M> at all, then <M>T</M> is
            sufficient. The <em>Fisher information</em> is
          </p>
          <FormulaBlock
            formula={`I(\\theta) = E\\!\\left[\\left(\\frac{\\partial \\log f(X;\\theta)}{\\partial \\theta}\\right)^2\\right] = -E\\!\\left[\\frac{\\partial^2 \\log f(X;\\theta)}{\\partial \\theta^2}\\right].`}
          />
          <p>And the <em>Cramér–Rao lower bound</em>:</p>
          <FormulaBlock
            formula={`\\text{Var}(\\hat\\theta) \\;\\ge\\; \\frac{1}{n I(\\theta)} \\quad \\text{for any unbiased estimator } \\hat\\theta.`}
          />
        </>
      ),
      graduate: (
        <>
          <p>
            <strong>Minimal vs complete sufficiency.</strong> A statistic is{" "}
            <em>minimal sufficient</em> if it&apos;s a function of every
            other sufficient statistic — the maximal compression. It&apos;s{" "}
            <em>complete</em> if{" "}
            <M>{`E_\\theta[g(T)] = 0 \\,\\forall \\theta \\Rightarrow g \\equiv 0`}</M>.
            Completeness is the technical ingredient in the Lehmann–Scheffé
            theorem: any unbiased function of a complete sufficient statistic
            is the unique UMVUE (uniformly minimum variance unbiased
            estimator).
          </p>
          <p>
            <strong>The Rao–Blackwell theorem.</strong> If{" "}
            <M>{`\\hat\\theta`}</M> is any unbiased estimator and <M>T</M> is
            sufficient, then{" "}
            <M>{`\\tilde\\theta = E[\\hat\\theta \\mid T]`}</M> is also
            unbiased and has variance no larger:{" "}
            <M>{`\\text{Var}(\\tilde\\theta) \\le \\text{Var}(\\hat\\theta)`}</M>.
            This is the formal recipe for &quot;improving&quot; any estimator
            by conditioning on a sufficient statistic — one of the deepest
            results in classical theory.
          </p>
          <p>
            <strong>Why MLE attains the bound asymptotically.</strong> Under
            regularity, <M>{`\\sqrt n (\\hat\\theta_{\\text{MLE}} - \\theta) \\to \\mathcal{N}(0, I(\\theta)^{-1})`}</M>.
            So the asymptotic variance of the MLE is{" "}
            <M>{`I(\\theta)^{-1}/n`}</M> — exactly the Cramér–Rao bound. MLE
            is asymptotically efficient. This is why MLE dominates: not
            because it&apos;s magical, but because it asymptotically saturates
            the lower bound that bounds <em>every</em> unbiased estimator.
          </p>
          <p>
            <strong>Common misuse.</strong> Cramér–Rao only bounds{" "}
            <em>unbiased</em> estimators. Biased estimators can have variance
            below the CRLB — the bound says nothing about them. Ridge
            regression and other shrinkage estimators routinely violate the
            unbiased CRLB while remaining excellent estimators (because their
            bias is small relative to their variance reduction).
          </p>
        </>
      ),
      body: (
        <>
          <SectionHeader step={1} title="Worked example: Bernoulli sufficiency" blurb="Why the count of heads is sufficient for p, derived in three lines via factorisation." />
          <ProofStepper
            title="Bernoulli — count of successes is sufficient"
            steps={[
              { title: "Write the joint PMF.", math: "f(x_1, \\dots, x_n; p) = \\prod_{i=1}^n p^{x_i}(1-p)^{1-x_i}" },
              { title: "Collect powers.", math: "= p^{\\sum x_i} (1-p)^{n - \\sum x_i}" },
              { title: "Identify T(x).", math: "T(x) = \\sum_{i=1}^n x_i", reason: "The joint depends on the data only through this sum." },
              { title: "Apply Fisher–Neyman.", math: "f(x; p) = \\underbrace{p^{T(x)}(1-p)^{n - T(x)}}_{g(T(x); p)} \\cdot \\underbrace{1}_{h(x)}", reason: "The factorisation works with h(x) ≡ 1, so T is sufficient." },
              { title: "Conclude.", reason: "The total number of heads is sufficient for p. Throwing away the order of the flips loses zero information about p." },
            ]}
          />

          <SectionHeader step={2} title="Worked example: Fisher information for Bernoulli" />
          <ProofStepper
            title="I(p) for Bernoulli(p)"
            steps={[
              { title: "Log-density of one observation.", math: "\\log f(x; p) = x \\log p + (1-x)\\log(1-p)" },
              { title: "Score: first derivative.", math: "\\frac{\\partial}{\\partial p}\\log f = \\frac{x}{p} - \\frac{1-x}{1-p}" },
              { title: "Second derivative.", math: "\\frac{\\partial^2}{\\partial p^2}\\log f = -\\frac{x}{p^2} - \\frac{1-x}{(1-p)^2}" },
              { title: "Take expectation under p.", math: "-E\\!\\left[\\frac{\\partial^2 \\log f}{\\partial p^2}\\right] = \\frac{p}{p^2} + \\frac{1-p}{(1-p)^2} = \\frac{1}{p(1-p)}", reason: "Use E[X] = p." },
              { title: "Read off the Fisher information.", math: "I(p) = \\frac{1}{p(1-p)}" },
              { title: "Apply Cramér–Rao.", math: "\\text{Var}(\\hat p) \\ge \\frac{1}{n I(p)} = \\frac{p(1-p)}{n}", reason: "And the sample mean p̂ = X̄ achieves this exactly — it's efficient even in finite samples." },
            ]}
          />

          <TheoremCard
            kind="theorem"
            name="Cramér–Rao lower bound"
            statement={
              <>
                Let <M>{`X_1, \\dots, X_n`}</M> be i.i.d. with density{" "}
                <M>{`f(x;\\theta)`}</M> satisfying mild regularity conditions.
                For any unbiased estimator <M>{`\\hat\\theta`}</M> of{" "}
                <M>θ</M>:
              </>
            }
            formula={`\\text{Var}_\\theta(\\hat\\theta) \\;\\ge\\; \\frac{1}{n I(\\theta)}.`}
          >
            An unbiased estimator that attains this bound is called{" "}
            <em>efficient</em>. The MLE is asymptotically efficient under
            regularity — this is the deep reason it dominates statistical
            practice.
          </TheoremCard>
        </>
      ),
      misconceptions: [
        {
          wrong: "Sufficient statistics are unique.",
          right:
            "There are many sufficient statistics (the entire data is trivially sufficient!). 'Minimal sufficient' is what we usually want — the maximally compressed one.",
        },
        {
          wrong: "Cramér–Rao bounds the variance of every estimator.",
          right:
            "Only unbiased ones. Biased estimators can have variance well below the CRLB. This is the mathematical reason regularised methods work.",
        },
        {
          wrong: "If two statistics give the same likelihood, they're the same estimator.",
          right:
            "They might be the same in the data, but their finite-sample properties (bias, variance) can still differ. Sufficiency is about information; estimators are about the way you USE that information.",
        },
      ],
      takeaways: [
        "T(X) is sufficient for θ if the data's distribution conditional on T doesn't depend on θ.",
        "Fisher–Neyman factorisation: f(x;θ) = g(T(x);θ)·h(x) is sufficient and necessary.",
        "Fisher information I(θ) measures how much each observation 'tells you' about θ.",
        "Cramér–Rao: any unbiased estimator has variance ≥ 1/(n·I(θ)). MLE attains this bound asymptotically.",
        "Rao–Blackwell: conditioning any unbiased estimator on a sufficient statistic only improves its variance.",
      ],
      quiz: [
        {
          id: "q1",
          prompt:
            "For Poisson(λ) data, which is a sufficient statistic for λ?",
          choices: [
            { id: "a", label: "max(X_i)" },
            { id: "b", label: "Σ X_i" },
            { id: "c", label: "X_1" },
            { id: "d", label: "X̄ - 1" },
          ],
          answer: "b",
          explanation:
            "Poisson likelihood factorises as (e^{-nλ} λ^{Σx}) / (Π x!), so Σ X_i is sufficient for λ.",
        },
        {
          id: "q2",
          prompt: "The Cramér–Rao lower bound applies to:",
          choices: [
            { id: "a", label: "All estimators" },
            { id: "b", label: "Unbiased estimators only" },
            { id: "c", label: "Maximum likelihood estimators only" },
            { id: "d", label: "Bayesian estimators" },
          ],
          answer: "b",
          explanation:
            "The classical CRLB is a lower bound on the variance of unbiased estimators. Biased estimators can have lower variance.",
        },
        {
          id: "q3",
          prompt:
            "Bernoulli(p) Fisher information is I(p) = 1/(p(1-p)). At p = 0.5, this equals...",
          choices: [
            { id: "a", label: "0.25" },
            { id: "b", label: "1" },
            { id: "c", label: "2" },
            { id: "d", label: "4" },
          ],
          answer: "d",
          explanation:
            "I(0.5) = 1/(0.5 · 0.5) = 4. The Fisher information is highest at p = 0.5 — that's where each flip carries the most information about p.",
        },
      ],
      furtherReading: [
        { title: "Casella & Berger — Statistical Inference, ch. 6" },
        { title: "Lehmann & Casella — Theory of Point Estimation" },
        { title: "Cover & Thomas — Elements of Information Theory, ch. 11" },
      ],
    },

    zh: {
      title: "充分性、Fisher 訊息與有效性",
      subtitle:
        "兩個深刻的問題：你「真的」需要多少資料？以及任何估計量「最好」可以好到什麼程度？",
      hook: "充分性告訴你「什麼可以丟掉」。Cramér–Rao 告訴你「最好可以好到哪裡」。",
      whyItMatters: (
        <>
          這是古典統計學裡最美的兩個結果。
          充分統計量精確地告訴你：哪一種資料壓縮會「不損失任何關於參數的訊息」──
          讓你能把 n 個數字換成一兩個而完全不損失資訊。
          Cramér–Rao 下界告訴你：任何不偏估計量的變異數最佳能達到多少 ──
          這就是「有效」這個詞變得精確的原因。兩者合起來解釋了為什麼 MLE 行得通。
        </>
      ),
      intuition: (
        <>
          <p>
            想像你收集了 1,000 次拋硬幣，要估計偏差 <M>p</M>。
            你真的需要所有 1,000 個結果嗎？不需要 ── 你只需要正面的次數。
            次數就是<em>充分</em>的：給定次數，
            正反面實際的順序對 <M>p</M> 不再帶來任何額外的訊息。
          </p>
          <p>
            這就是充分性的一句話定義：
            「資料的一個函數是充分的，若以它為條件後，
            資料的分布變得不再依賴於參數。」
          </p>
          <p>
            現在反過來問：任何估計量「最好」可以好到什麼程度？
            答案是 Cramér–Rao 下界：
            變異數 <M>{`\\ge 1/(n I(\\theta))`}</M>，
            其中 <M>{`I(\\theta)`}</M> 是 Fisher 訊息 ──
            衡量每筆觀察「告訴你多少關於 <M>θ</M> 的訊息」。
            一個達成這個下界的估計量被稱為<em>有效（efficient）</em>，
            沒有東西可以做得比它更好。
          </p>
        </>
      ),
      formal: (
        <>
          <p>
            一個統計量 <M>{`T(X)`}</M> 對 <M>θ</M> 是<em>充分的</em>，
            若給定 <M>{`T(X)`}</M> 後，資料的條件分布不依賴於 <M>θ</M>：
          </p>
          <FormulaBlock
            formula={`P(X = x \\mid T(X) = t,\\, \\theta) = P(X = x \\mid T(X) = t).`}
            question="T(X) 帶有所有關於 θ 的訊息嗎？"
          />
          <p>
            判別充分統計量的實用方法是 <em>Fisher–Neyman 因式分解定理</em>：
          </p>
          <FormulaBlock
            formula={`f(x;\\theta) = g(T(x);\\theta) \\cdot h(x).`}
          />
          <p>
            如果你能把聯合密度拆成「依賴 <M>θ</M> 並且只透過 <M>T(x)</M> 接觸資料的部分」
            乘上「完全不依賴 <M>θ</M> 的部分」，那 <M>T</M> 就是充分的。
            <em>Fisher 訊息</em>定義為：
          </p>
          <FormulaBlock
            formula={`I(\\theta) = E\\!\\left[\\left(\\frac{\\partial \\log f(X;\\theta)}{\\partial \\theta}\\right)^2\\right] = -E\\!\\left[\\frac{\\partial^2 \\log f(X;\\theta)}{\\partial \\theta^2}\\right].`}
          />
          <p>而 <em>Cramér–Rao 下界</em>為：</p>
          <FormulaBlock
            formula={`\\text{Var}(\\hat\\theta) \\;\\ge\\; \\frac{1}{n I(\\theta)} \\quad \\text{對任何不偏估計量 } \\hat\\theta.`}
          />
        </>
      ),
      graduate: (
        <>
          <p>
            <strong>極小（minimal）vs 完備（complete）充分性。</strong>
            一個統計量是<em>極小充分</em>的，若它是「所有其他充分統計量」的函數 ──
            也就是「最大壓縮」。
            它是<em>完備</em>的，若{" "}
            <M>{`E_\\theta[g(T)] = 0 \\,\\forall \\theta \\Rightarrow g \\equiv 0`}</M>。
            完備性是 Lehmann–Scheffé 定理裡的技術成分：
            「完備充分統計量的任何不偏函數」就是唯一的 UMVUE
            （uniformly minimum variance unbiased estimator）。
          </p>
          <p>
            <strong>Rao–Blackwell 定理。</strong>
            若 <M>{`\\hat\\theta`}</M> 是任何不偏估計量、<M>T</M> 是充分的，
            那 <M>{`\\tilde\\theta = E[\\hat\\theta \\mid T]`}</M>{" "}
            也是不偏的，且變異數不會更大：
            <M>{`\\text{Var}(\\tilde\\theta) \\le \\text{Var}(\\hat\\theta)`}</M>。
            這是「用條件在充分統計量上來改善任何估計量」的形式化食譜 ──
            古典理論裡最深的結果之一。
          </p>
          <p>
            <strong>為什麼 MLE 漸近上達成下界。</strong>
            在規則條件下，
            <M>{`\\sqrt n (\\hat\\theta_{\\text{MLE}} - \\theta) \\to \\mathcal{N}(0, I(\\theta)^{-1})`}</M>。
            所以 MLE 的漸近變異數是 <M>{`I(\\theta)^{-1}/n`}</M> ──
            正好就是 Cramér–Rao 下界。MLE 漸近上是有效的。
            這就是為什麼 MLE 主導了整個統計實務 ──
            不是因為它有什麼魔法，
            而是因為它漸近上飽和了「綁住每個不偏估計量」的下界。
          </p>
          <p>
            <strong>常見誤用。</strong>
            Cramér–Rao 只綁住<em>不偏</em>估計量。
            有偏的估計量可以擁有低於 CRLB 的變異數 ── 下界對它們什麼也沒說。
            ridge 迴歸和其他 shrinkage 估計量例行性地違反不偏 CRLB，
            而仍然是優秀的估計量
            （因為它們的偏誤相對於變異數的縮減而言很小）。
          </p>
        </>
      ),
      body: (
        <>
          <SectionHeader step={1} title="工作範例：Bernoulli 的充分性" blurb="為什麼「正面次數」對 p 是充分的 ── 用因式分解三行就能推出來。" />
          <ProofStepper
            title="Bernoulli ── 成功次數是充分的"
            steps={[
              { title: "寫出聯合 PMF。", math: "f(x_1, \\dots, x_n; p) = \\prod_{i=1}^n p^{x_i}(1-p)^{1-x_i}" },
              { title: "把次方收集起來。", math: "= p^{\\sum x_i} (1-p)^{n - \\sum x_i}" },
              { title: "辨認出 T(x)。", math: "T(x) = \\sum_{i=1}^n x_i", reason: "聯合分布只透過這個和接觸資料。" },
              { title: "套用 Fisher–Neyman。", math: "f(x; p) = \\underbrace{p^{T(x)}(1-p)^{n - T(x)}}_{g(T(x); p)} \\cdot \\underbrace{1}_{h(x)}", reason: "因式分解可以用 h(x) ≡ 1 完成，所以 T 是充分的。" },
              { title: "下結論。", reason: "正面總次數對 p 是充分的。丟掉「拋擲的順序」對 p 不損失任何訊息。" },
            ]}
          />

          <SectionHeader step={2} title="工作範例：Bernoulli 的 Fisher 訊息" />
          <ProofStepper
            title="Bernoulli(p) 的 I(p)"
            steps={[
              { title: "單一觀察的對數密度。", math: "\\log f(x; p) = x \\log p + (1-x)\\log(1-p)" },
              { title: "Score：一階導數。", math: "\\frac{\\partial}{\\partial p}\\log f = \\frac{x}{p} - \\frac{1-x}{1-p}" },
              { title: "二階導數。", math: "\\frac{\\partial^2}{\\partial p^2}\\log f = -\\frac{x}{p^2} - \\frac{1-x}{(1-p)^2}" },
              { title: "在 p 下取期望值。", math: "-E\\!\\left[\\frac{\\partial^2 \\log f}{\\partial p^2}\\right] = \\frac{p}{p^2} + \\frac{1-p}{(1-p)^2} = \\frac{1}{p(1-p)}", reason: "用 E[X] = p。" },
              { title: "讀出 Fisher 訊息。", math: "I(p) = \\frac{1}{p(1-p)}" },
              { title: "套用 Cramér–Rao。", math: "\\text{Var}(\\hat p) \\ge \\frac{1}{n I(p)} = \\frac{p(1-p)}{n}", reason: "而樣本平均 p̂ = X̄ 精確地達成這個下界 ── 它在有限樣本下就是有效的。" },
            ]}
          />

          <TheoremCard
            kind="theorem"
            name="Cramér–Rao 下界"
            statement={
              <>
                設 <M>{`X_1, \\dots, X_n`}</M> 為 i.i.d.，
                密度為 <M>{`f(x;\\theta)`}</M>，滿足溫和的規則條件。
                則對 <M>θ</M> 的任何不偏估計量 <M>{`\\hat\\theta`}</M>：
              </>
            }
            formula={`\\text{Var}_\\theta(\\hat\\theta) \\;\\ge\\; \\frac{1}{n I(\\theta)}.`}
          >
            一個達成這個下界的不偏估計量被稱為<em>有效</em>。
            MLE 在規則條件下漸近上是有效的 ── 這就是它主導統計實務的深層原因。
          </TheoremCard>
        </>
      ),
      misconceptions: [
        {
          wrong: "充分統計量是唯一的。",
          right:
            "充分統計量有很多個（整份資料本身就 trivially 充分！）。我們通常想要的是「極小充分」── 最大壓縮的那個。",
        },
        {
          wrong: "Cramér–Rao 綁住每個估計量的變異數。",
          right:
            "只綁住不偏的。有偏的估計量可以擁有遠低於 CRLB 的變異數。這就是「正則化方法為什麼行得通」的數學原因。",
        },
        {
          wrong: "如果兩個統計量產生同樣的概似，它們就是同一個估計量。",
          right:
            "它們在資料上可能相同，但它們在有限樣本下的性質（偏誤、變異數）仍可能不同。充分性談的是「資訊」；估計量談的是「你怎麼用那份資訊」。",
        },
      ],
      takeaways: [
        "T(X) 對 θ 是充分的，若資料在 T 條件下的分布不依賴於 θ。",
        "Fisher–Neyman 因式分解：f(x;θ) = g(T(x);θ)·h(x) 是充分性的充要條件。",
        "Fisher 訊息 I(θ) 衡量每筆觀察「告訴你多少關於 θ 的訊息」。",
        "Cramér–Rao：任何不偏估計量的變異數 ≥ 1/(n·I(θ))。MLE 漸近上達成這個下界。",
        "Rao–Blackwell：把任何不偏估計量條件在充分統計量上，只會改善它的變異數。",
      ],
      quiz: [
        {
          id: "q1",
          prompt: "對 Poisson(λ) 資料，下列哪一個是 λ 的充分統計量？",
          choices: [
            { id: "a", label: "max(X_i)" },
            { id: "b", label: "Σ X_i" },
            { id: "c", label: "X_1" },
            { id: "d", label: "X̄ - 1" },
          ],
          answer: "b",
          explanation:
            "Poisson 概似可以因式分解成 (e^{-nλ} λ^{Σx}) / (Π x!)，所以 Σ X_i 對 λ 是充分的。",
        },
        {
          id: "q2",
          prompt: "Cramér–Rao 下界適用於：",
          choices: [
            { id: "a", label: "所有估計量" },
            { id: "b", label: "只適用於不偏估計量" },
            { id: "c", label: "只適用於最大概似估計量" },
            { id: "d", label: "貝氏估計量" },
          ],
          answer: "b",
          explanation:
            "古典 CRLB 是「不偏估計量」變異數的下界。有偏的估計量可以擁有更低的變異數。",
        },
        {
          id: "q3",
          prompt:
            "Bernoulli(p) 的 Fisher 訊息為 I(p) = 1/(p(1-p))。在 p = 0.5 時，它等於？",
          choices: [
            { id: "a", label: "0.25" },
            { id: "b", label: "1" },
            { id: "c", label: "2" },
            { id: "d", label: "4" },
          ],
          answer: "d",
          explanation:
            "I(0.5) = 1/(0.5 · 0.5) = 4。Fisher 訊息在 p = 0.5 時最高 ── 那是每次拋擲帶有最多關於 p 的訊息的地方。",
        },
      ],
      furtherReading: [
        { title: "Casella & Berger — Statistical Inference, ch. 6" },
        { title: "Lehmann & Casella — Theory of Point Estimation" },
        { title: "Cover & Thomas — Elements of Information Theory, ch. 11" },
      ],
    },
  },
};

export default chapter;
