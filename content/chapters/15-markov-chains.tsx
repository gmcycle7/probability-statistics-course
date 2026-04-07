import { Chapter } from "../types";
import { M, MD } from "@/components/math/Math";
import { FormulaBlock } from "@/components/math/FormulaBlock";
import { TheoremCard } from "@/components/math/TheoremCard";
import { ProofStepper } from "@/components/math/ProofStepper";
import { MarkovChainSimulator } from "@/components/interactive/MarkovChainSimulator";
import { SectionHeader } from "@/components/learning/SectionHeader";

const chapter: Chapter = {
  meta: {
    slug: "markov-chains",
    module: "H_advanced",
    number: 22,
    minutes: 45,
    level: 4,
    prereqs: ["joint-distributions-and-covariance"],
    tags: ["markov", "stationary", "ergodic"],
  },
  localized: {
    en: {
      title: "Markov Chains & Stationary Distributions",
      subtitle:
        "When the future depends on the present but not the past, you have a Markov chain — and almost all of probabilistic computation lives downstream of this one assumption.",
      hook: "Why πP = π is the most quietly important equation in stochastic modelling — and why MCMC is built on top of it.",
      whyItMatters: (
        <>
          Markov chains are the simplest non-trivial random processes that
          aren&apos;t i.i.d. Once you understand them, the entire world of
          stochastic processes (queueing, finance, MCMC, random walks,
          PageRank, hidden Markov models, reinforcement learning) becomes
          accessible. The single most important fact: <em>under mild
          conditions, a Markov chain forgets its starting point and converges
          to a unique stationary distribution.</em>
        </>
      ),
      intuition: (
        <>
          <p>
            A Markov chain is a sequence of random states{" "}
            <M>{`X_0, X_1, X_2, \\dots`}</M> where the next state depends
            only on the current state, not the entire history:
          </p>
          <FormulaBlock
            formula={`P(X_{n+1} = j \\mid X_n = i, X_{n-1}, \\dots, X_0) = P(X_{n+1} = j \\mid X_n = i).`}
            question="What does it mean for a process to be 'memoryless'?"
          />
          <p>
            That&apos;s the <em>Markov property</em>: knowing the present
            screens off the past from the future. The transition probabilities
            <M>{`p_{ij} = P(X_{n+1} = j \\mid X_n = i)`}</M>{" "}
            collected into a matrix <M>P</M> describe the entire dynamics.
          </p>
          <p>
            Now imagine running the chain for a million steps. Where does it
            spend its time? The answer is the <em>stationary distribution</em>{" "}
            <M>π</M>: the unique probability vector satisfying{" "}
            <M>{`\\pi P = \\pi`}</M>. Under irreducibility and aperiodicity,
            no matter where you started, the long-run fraction of time in
            each state converges to <M>π</M>. This is the deepest result in
            elementary Markov chain theory.
          </p>
        </>
      ),
      formal: (
        <>
          <p>
            A finite-state <em>Markov chain</em> is a stochastic process{" "}
            <M>{`(X_n)_{n \\ge 0}`}</M> on a state space{" "}
            <M>{`S = \\{1, 2, \\dots, k\\}`}</M> with transition matrix{" "}
            <M>{`P \\in \\mathbb{R}^{k \\times k}`}</M> where{" "}
            <M>{`P_{ij} = P(X_{n+1} = j \\mid X_n = i)`}</M>. <M>P</M> is{" "}
            <em>row-stochastic</em>: each row is a probability distribution.
          </p>
          <p>
            The <em>n-step transition probabilities</em> are entries of{" "}
            <M>{`P^n`}</M>:
          </p>
          <FormulaBlock formula={`P(X_{n+m} = j \\mid X_m = i) = (P^n)_{ij}.`} />
          <p>
            A distribution <M>π</M> is <em>stationary</em> if{" "}
            <M>{`\\pi P = \\pi`}</M> — i.e. running one step preserves it.
            Equivalently, <M>π</M> is a left eigenvector of <M>P</M> with
            eigenvalue 1.
          </p>
          <p>
            Two important properties for limiting behaviour:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 mt-2">
            <li>
              <strong>Irreducible</strong>: every state can reach every other
              state in finitely many steps. (The chain is &quot;connected&quot;.)
            </li>
            <li>
              <strong>Aperiodic</strong>: the gcd of return times to any
              state is 1. (No deterministic cycle.)
            </li>
          </ul>
          <p>Under both, the chain has a unique stationary distribution and</p>
          <FormulaBlock
            formula={`\\lim_{n \\to \\infty} (P^n)_{ij} = \\pi_j \\quad \\text{for every starting state } i.`}
            question="When does the chain forget where it started?"
          />
        </>
      ),
      graduate: (
        <>
          <p>
            <strong>The ergodic theorem.</strong> For a positive recurrent,
            irreducible chain with stationary distribution <M>π</M>, and
            any function <M>f</M>:
          </p>
          <FormulaBlock
            formula={`\\frac{1}{n}\\sum_{i=1}^n f(X_i) \\xrightarrow{\\text{a.s.}} E_\\pi[f(X)] = \\sum_j f(j)\\pi_j.`}
          />
          <p>
            Time averages equal space averages — the deepest generalisation
            of the law of large numbers. This is the formal foundation of{" "}
            <em>Markov chain Monte Carlo (MCMC)</em>: we cannot sample from{" "}
            <M>π</M> directly, but we can construct a chain whose stationary
            distribution is <M>π</M>, run it for a long time, and average.
            Metropolis–Hastings, Gibbs sampling, and HMC are all instances
            of this single idea.
          </p>
          <p>
            <strong>Detailed balance.</strong> A sufficient (but not
            necessary) condition for <M>π</M> to be stationary is{" "}
            <em>detailed balance</em>:
          </p>
          <FormulaBlock formula={`\\pi_i P_{ij} = \\pi_j P_{ji} \\quad \\forall i, j.`} />
          <p>
            A chain satisfying detailed balance is called <em>reversible</em>{" "}
            — the chain looks the same forward and backward in time. This
            is the property Metropolis–Hastings exploits: it constructs a
            proposal/accept rule that automatically satisfies detailed balance
            for the target distribution.
          </p>
          <p>
            <strong>Mixing time.</strong> Convergence to stationarity is not
            instant. The <em>mixing time</em>{" "}
            <M>{`\\tau_\\text{mix}`}</M> is the smallest <M>n</M> for which{" "}
            <M>{`\\|P^n(i, \\cdot) - \\pi\\|_{TV} \\le 1/4`}</M> for all
            starting states <M>i</M>. The mixing time is governed by the
            spectral gap <M>{`1 - |\\lambda_2|`}</M>, where{" "}
            <M>{`\\lambda_2`}</M> is the second-largest eigenvalue of <M>P</M>.
            Slow mixing (small spectral gap) is the bottleneck of practical
            MCMC.
          </p>
          <p>
            <strong>Common misuse.</strong> Treating any time series as
            Markovian. Real processes often have long-memory effects (think:
            economic regimes, mood states, language). Use a hidden Markov
            model or autoregressive structure when memory matters; the
            Markov assumption simplifies the math but at the cost of
            potentially misrepresenting the dynamics.
          </p>
        </>
      ),
      body: (
        <>
          <SectionHeader step={1} title="Watch convergence happen" blurb="Edit the 3×3 transition matrix and watch how the empirical occupancy converges to the stationary distribution." />
          <MarkovChainSimulator />

          <SectionHeader step={2} title="Derivation: where the stationary distribution comes from" />
          <ProofStepper
            title="πP = π by definition"
            steps={[
              { title: "Suppose at step n, the distribution over states is π_n.", math: "P(X_n = j) = (\\pi_n)_j" },
              { title: "Apply the transition rule to get π_{n+1}.", math: "(\\pi_{n+1})_j = \\sum_i P(X_n = i) P(X_{n+1} = j \\mid X_n = i) = \\sum_i (\\pi_n)_i P_{ij}" },
              { title: "Recognise the matrix product.", math: "\\pi_{n+1} = \\pi_n P" },
              { title: "A stationary distribution is a fixed point.", math: "\\pi P = \\pi", reason: "If π is stationary, applying P doesn't change it. Algebraically, π is a left eigenvector of P with eigenvalue 1." },
              { title: "How to compute it.", reason: "Solve the linear system πP = π subject to Σπ_i = 1, or use power iteration: pick any π₀ and repeatedly apply π_{n+1} = π_n P. For irreducible aperiodic chains, this converges to the unique stationary distribution." },
            ]}
          />

          <TheoremCard
            kind="theorem"
            name="Convergence to stationarity"
            statement={
              <>
                For a finite-state, irreducible, aperiodic Markov chain with
                transition matrix <M>P</M>, there exists a unique stationary
                distribution <M>π</M> with{" "}
                <M>{`\\pi P = \\pi`}</M>, and for every starting state{" "}
                <M>i</M>:
              </>
            }
            formula={`\\lim_{n\\to\\infty} (P^n)_{ij} = \\pi_j.`}
          >
            The chain forgets its starting point. This is what makes MCMC
            possible: regardless of the initial sample, after enough steps,
            the marginal distribution is approximately the target.
          </TheoremCard>

          <SectionHeader step={3} title="Worked example: a 2-state weather chain" />
          <p className="text-ink-dim leading-relaxed">
            States: Sunny (S), Rainy (R). Transition matrix:
          </p>
          <FormulaBlock formula={`P = \\begin{pmatrix} 0.8 & 0.2 \\\\ 0.4 & 0.6 \\end{pmatrix}`} />
          <p className="text-ink-dim leading-relaxed">
            Stationary distribution? Solve <M>{`(\\pi_S, \\pi_R) P = (\\pi_S, \\pi_R)`}</M>{" "}
            with <M>{`\\pi_S + \\pi_R = 1`}</M>:
          </p>
          <MD>{`0.8\\pi_S + 0.4\\pi_R = \\pi_S \\Rightarrow 0.4\\pi_R = 0.2\\pi_S \\Rightarrow \\pi_R = 0.5 \\pi_S.`}</MD>
          <p className="text-ink-dim leading-relaxed">
            Combined with normalisation:{" "}
            <M>{`\\pi_S + 0.5\\pi_S = 1 \\Rightarrow \\pi_S = 2/3,\\ \\pi_R = 1/3`}</M>.
            In the long run, two-thirds of days are sunny — completely
            independent of whether today is sunny or rainy.
          </p>
        </>
      ),
      misconceptions: [
        {
          wrong: "The Markov property means the past is irrelevant.",
          right:
            "It means the past is irrelevant GIVEN THE PRESENT. The current state can encode arbitrarily much information about history; what's ruled out is needing to know the trajectory beyond the present state.",
        },
        {
          wrong: "Every Markov chain has a stationary distribution.",
          right:
            "Yes, but it might not be unique, and the chain might not converge to it. You need irreducibility for uniqueness and aperiodicity for convergence. Periodic chains oscillate forever.",
        },
        {
          wrong: "Stationary distribution = uniform over states.",
          right:
            "Almost never. The stationary distribution depends on the transition matrix. States that are easier to reach get higher probability mass.",
        },
      ],
      takeaways: [
        "Markov property: the future depends on the present but not the past beyond that.",
        "Transition matrix P is row-stochastic; n-step transitions are P^n.",
        "Stationary distribution π satisfies πP = π — a left eigenvector with eigenvalue 1.",
        "Irreducibility + aperiodicity guarantee convergence to a unique π from any starting state.",
        "Detailed balance (πᵢPᵢⱼ = πⱼPⱼᵢ) is a sufficient condition for stationarity, and is what MCMC algorithms exploit.",
        "Time averages equal space averages — the ergodic theorem is the LLN for Markov chains.",
      ],
      quiz: [
        {
          id: "q1",
          prompt:
            "A 2-state chain has P = [[0.7, 0.3], [0.4, 0.6]]. What is its stationary distribution?",
          choices: [
            { id: "a", label: "(0.5, 0.5)" },
            { id: "b", label: "(4/7, 3/7)" },
            { id: "c", label: "(0.7, 0.3)" },
            { id: "d", label: "(0.6, 0.4)" },
          ],
          answer: "b",
          explanation:
            "Solve 0.7π₁ + 0.4π₂ = π₁ and π₁ + π₂ = 1. This gives π₁ = 4/7, π₂ = 3/7.",
        },
        {
          id: "q2",
          prompt: "Which condition guarantees the chain converges to a unique stationary distribution from any starting state?",
          choices: [
            { id: "a", label: "Irreducible only" },
            { id: "b", label: "Aperiodic only" },
            { id: "c", label: "Irreducible and aperiodic" },
            { id: "d", label: "Reversible only" },
          ],
          answer: "c",
          explanation:
            "Irreducibility gives uniqueness (every state reachable from every other), and aperiodicity prevents the chain from oscillating in cycles.",
        },
        {
          id: "q3",
          prompt: "Detailed balance πᵢPᵢⱼ = πⱼPⱼᵢ is...",
          choices: [
            { id: "a", label: "Necessary and sufficient for stationarity" },
            { id: "b", label: "Sufficient but not necessary for stationarity" },
            { id: "c", label: "Necessary but not sufficient for stationarity" },
            { id: "d", label: "Neither necessary nor sufficient" },
          ],
          answer: "b",
          explanation:
            "Detailed balance ⇒ stationary, but stationary chains need not be reversible. Reversible chains are easier to design (Metropolis–Hastings) but not the only ones with stationary distributions.",
        },
      ],
      furtherReading: [
        { title: "Norris — Markov Chains" },
        { title: "Levin, Peres & Wilmer — Markov Chains and Mixing Times" },
        { title: "Brooks et al. — Handbook of Markov Chain Monte Carlo" },
      ],
    },

    zh: {
      title: "Markov 鏈與穩態分布",
      subtitle:
        "當未來只依賴現在、不依賴過去，你就有一條 Markov 鏈 ── 而幾乎所有機率計算都活在這個假設的下游。",
      hook: "為什麼 πP = π 是隨機建模裡「最低調但最重要」的方程式 ── 以及 MCMC 為什麼建立在它之上。",
      whyItMatters: (
        <>
          Markov 鏈是「不是 i.i.d. 但又夠簡單的」最重要的隨機過程。
          一旦你理解它，整個隨機過程的世界
          （排隊、金融、MCMC、隨機漫步、PageRank、隱藏 Markov 模型、強化學習）
          就對你打開。
          最重要的單一事實：
          <em>在溫和條件下，Markov 鏈會忘記起點，並收斂到唯一的穩態分布。</em>
        </>
      ),
      intuition: (
        <>
          <p>
            Markov 鏈是一串隨機狀態{" "}
            <M>{`X_0, X_1, X_2, \\dots`}</M>，
            其中下一個狀態只依賴現在的狀態，不依賴整段歷史：
          </p>
          <FormulaBlock
            formula={`P(X_{n+1} = j \\mid X_n = i, X_{n-1}, \\dots, X_0) = P(X_{n+1} = j \\mid X_n = i).`}
            question="一個過程「無記憶」是什麼意思？"
          />
          <p>
            這就是 <em>Markov 性質</em>：知道現在就能屏蔽過去對未來的影響。
            把轉移機率{" "}
            <M>{`p_{ij} = P(X_{n+1} = j \\mid X_n = i)`}</M>{" "}
            收進一個矩陣 <M>P</M>，整個動態就完全被描述了。
          </p>
          <p>
            現在想像把這條鏈跑個一百萬步。它平均會花多少時間在每個狀態？
            答案是<em>穩態分布</em> <M>π</M>：唯一滿足{" "}
            <M>{`\\pi P = \\pi`}</M> 的機率向量。
            在不可約性與非週期性下，無論你從哪裡開始，
            「在每個狀態的長期時間佔比」都會收斂到 <M>π</M>。
            這是初等 Markov 鏈理論裡最深的結果。
          </p>
        </>
      ),
      formal: (
        <>
          <p>
            一個有限狀態的 <em>Markov 鏈</em>是一個隨機過程{" "}
            <M>{`(X_n)_{n \\ge 0}`}</M>，
            活在狀態空間 <M>{`S = \\{1, 2, \\dots, k\\}`}</M> 上，
            並有一個轉移矩陣 <M>{`P \\in \\mathbb{R}^{k \\times k}`}</M>，
            其中 <M>{`P_{ij} = P(X_{n+1} = j \\mid X_n = i)`}</M>。
            <M>P</M> 是<em>列隨機（row-stochastic）</em>的：每一列都是一個機率分布。
          </p>
          <p>
            <em>n 步轉移機率</em>是 <M>{`P^n`}</M> 的元素：
          </p>
          <FormulaBlock formula={`P(X_{n+m} = j \\mid X_m = i) = (P^n)_{ij}.`} />
          <p>
            一個分布 <M>π</M> 是<em>穩態</em>的，若 <M>{`\\pi P = \\pi`}</M> ──
            也就是說，跑一步不會改變它。
            等價地，<M>π</M> 是 <M>P</M> 的特徵值為 1 的左特徵向量。
          </p>
          <p>對於極限行為，兩個重要性質：</p>
          <ul className="list-disc pl-6 space-y-1.5 mt-2">
            <li>
              <strong>不可約（irreducible）</strong>：
              每個狀態都可以在有限步內到達其他每個狀態。（鏈是「連通的」。）
            </li>
            <li>
              <strong>非週期（aperiodic）</strong>：
              回到任何狀態的時間之 gcd 為 1。（沒有確定性循環。）
            </li>
          </ul>
          <p>在兩者都成立時，鏈有唯一的穩態分布，而且</p>
          <FormulaBlock
            formula={`\\lim_{n \\to \\infty} (P^n)_{ij} = \\pi_j \\quad \\text{對每個起始狀態 } i.`}
            question="鏈什麼時候會「忘記起點」？"
          />
        </>
      ),
      graduate: (
        <>
          <p>
            <strong>遍歷定理（ergodic theorem）。</strong>
            對於一個正常返、不可約的鏈，
            穩態分布為 <M>π</M>，對任何函數 <M>f</M>：
          </p>
          <FormulaBlock
            formula={`\\frac{1}{n}\\sum_{i=1}^n f(X_i) \\xrightarrow{\\text{a.s.}} E_\\pi[f(X)] = \\sum_j f(j)\\pi_j.`}
          />
          <p>
            時間平均等於空間平均 ── 大數法則最深的推廣。
            這是 <em>馬可夫鏈 Monte Carlo（MCMC）</em>的形式化基礎：
            我們無法直接從 <M>π</M> 抽樣，
            但我們可以建構一條穩態分布為 <M>π</M> 的鏈，
            把它跑很長很長，然後做平均。
            Metropolis–Hastings、Gibbs sampling、HMC 都是這個單一概念的實例。
          </p>
          <p>
            <strong>細緻均衡（detailed balance）。</strong>
            <M>π</M> 為穩態的一個充分（但非必要）條件是<em>細緻均衡</em>：
          </p>
          <FormulaBlock formula={`\\pi_i P_{ij} = \\pi_j P_{ji} \\quad \\forall i, j.`} />
          <p>
            滿足細緻均衡的鏈被稱為<em>可逆（reversible）</em>──
            這條鏈往前走和往後走看起來一樣。
            這正是 Metropolis–Hastings 利用的性質：
            它建構一個 proposal / accept 規則，
            自動讓目標分布滿足細緻均衡。
          </p>
          <p>
            <strong>混合時間（mixing time）。</strong>
            收斂到穩態並不是瞬間的。
            <em>混合時間</em> <M>{`\\tau_\\text{mix}`}</M>{" "}
            是讓所有起始狀態 <M>i</M> 都滿足{" "}
            <M>{`\\|P^n(i, \\cdot) - \\pi\\|_{TV} \\le 1/4`}</M>{" "}
            的最小 <M>n</M>。
            混合時間由「譜間隙」<M>{`1 - |\\lambda_2|`}</M> 控制，
            其中 <M>{`\\lambda_2`}</M> 是 <M>P</M> 的第二大特徵值。
            慢混合（譜間隙小）是實務 MCMC 的瓶頸。
          </p>
          <p>
            <strong>常見誤用。</strong>
            把任何時間序列都當成 Markov 的。
            真實過程經常有長記憶效應（想想：經濟區制、情緒狀態、語言）。
            記憶重要時要用隱藏 Markov 模型或自迴歸結構；
            Markov 假設讓數學變簡單，
            但代價可能是錯誤呈現了動態。
          </p>
        </>
      ),
      body: (
        <>
          <SectionHeader step={1} title="親眼看收斂發生" blurb="編輯 3×3 轉移矩陣，看「經驗占比」如何收斂到「穩態分布」。" />
          <MarkovChainSimulator />

          <SectionHeader step={2} title="推導：穩態分布從哪裡來" />
          <ProofStepper
            title="πP = π 的定義"
            steps={[
              { title: "假設在第 n 步，狀態的分布是 π_n。", math: "P(X_n = j) = (\\pi_n)_j" },
              { title: "套用轉移規則得到 π_{n+1}。", math: "(\\pi_{n+1})_j = \\sum_i P(X_n = i) P(X_{n+1} = j \\mid X_n = i) = \\sum_i (\\pi_n)_i P_{ij}" },
              { title: "辨認矩陣乘法。", math: "\\pi_{n+1} = \\pi_n P" },
              { title: "穩態分布就是不動點。", math: "\\pi P = \\pi", reason: "若 π 為穩態，套用 P 不會改變它。代數上，π 是 P 的特徵值為 1 的左特徵向量。" },
              { title: "如何計算它。", reason: "解線性系統 πP = π 並滿足 Σπ_i = 1，或用 power iteration：選任何 π₀，重複套用 π_{n+1} = π_n P。對於不可約且非週期的鏈，這會收斂到唯一的穩態分布。" },
            ]}
          />

          <TheoremCard
            kind="theorem"
            name="收斂到穩態"
            statement={
              <>
                對於有限狀態、不可約、非週期的 Markov 鏈，
                轉移矩陣為 <M>P</M>，
                則存在唯一的穩態分布 <M>π</M> 滿足 <M>{`\\pi P = \\pi`}</M>，
                且對任何起始狀態 <M>i</M>：
              </>
            }
            formula={`\\lim_{n\\to\\infty} (P^n)_{ij} = \\pi_j.`}
          >
            鏈會忘記起點。這就是 MCMC 之所以可行的原因：
            無論初始樣本是什麼，跑了夠多步之後，
            邊際分布就近似目標分布。
          </TheoremCard>

          <SectionHeader step={3} title="工作範例：兩狀態天氣鏈" />
          <p className="text-ink-dim leading-relaxed">
            狀態：晴（S）、雨（R）。轉移矩陣：
          </p>
          <FormulaBlock formula={`P = \\begin{pmatrix} 0.8 & 0.2 \\\\ 0.4 & 0.6 \\end{pmatrix}`} />
          <p className="text-ink-dim leading-relaxed">
            穩態分布為何？解 <M>{`(\\pi_S, \\pi_R) P = (\\pi_S, \\pi_R)`}</M>{" "}
            並滿足 <M>{`\\pi_S + \\pi_R = 1`}</M>：
          </p>
          <MD>{`0.8\\pi_S + 0.4\\pi_R = \\pi_S \\Rightarrow 0.4\\pi_R = 0.2\\pi_S \\Rightarrow \\pi_R = 0.5 \\pi_S.`}</MD>
          <p className="text-ink-dim leading-relaxed">
            搭配歸一化：
            <M>{`\\pi_S + 0.5\\pi_S = 1 \\Rightarrow \\pi_S = 2/3,\\ \\pi_R = 1/3`}</M>。
            長期下來，三分之二的日子是晴天 ──
            完全與「今天是晴是雨」無關。
          </p>
        </>
      ),
      misconceptions: [
        {
          wrong: "Markov 性質代表「過去完全無關」。",
          right:
            "它代表「在現在條件下，過去無關」。當前狀態可以編碼任意多的歷史資訊；它排除的是「需要知道現在以外的軌跡」。",
        },
        {
          wrong: "每條 Markov 鏈都有穩態分布。",
          right:
            "有，但可能不唯一，也可能不會收斂到它。要唯一性需要不可約，要收斂需要非週期。週期性鏈會永遠震盪。",
        },
        {
          wrong: "穩態分布 = 在所有狀態上均勻。",
          right:
            "幾乎從來不是。穩態分布取決於轉移矩陣。比較容易到達的狀態會有比較高的機率質量。",
        },
      ],
      takeaways: [
        "Markov 性質：未來只依賴現在，不依賴更早的過去。",
        "轉移矩陣 P 是列隨機的；n 步轉移為 P^n。",
        "穩態分布 π 滿足 πP = π ── 即特徵值為 1 的左特徵向量。",
        "不可約 + 非週期 ⇒ 從任何起點都會收斂到唯一的 π。",
        "細緻均衡（πᵢPᵢⱼ = πⱼPⱼᵢ）是穩態的充分條件，也是 MCMC 演算法所利用的性質。",
        "時間平均 = 空間平均 ── 遍歷定理是 Markov 鏈的大數法則。",
      ],
      quiz: [
        {
          id: "q1",
          prompt:
            "兩狀態鏈的 P = [[0.7, 0.3], [0.4, 0.6]]。穩態分布是？",
          choices: [
            { id: "a", label: "(0.5, 0.5)" },
            { id: "b", label: "(4/7, 3/7)" },
            { id: "c", label: "(0.7, 0.3)" },
            { id: "d", label: "(0.6, 0.4)" },
          ],
          answer: "b",
          explanation:
            "解 0.7π₁ + 0.4π₂ = π₁、π₁ + π₂ = 1，得 π₁ = 4/7、π₂ = 3/7。",
        },
        {
          id: "q2",
          prompt: "哪個條件保證鏈會從任何起點收斂到唯一的穩態分布？",
          choices: [
            { id: "a", label: "只要不可約" },
            { id: "b", label: "只要非週期" },
            { id: "c", label: "不可約 且 非週期" },
            { id: "d", label: "只要可逆" },
          ],
          answer: "c",
          explanation:
            "不可約給出唯一性（每個狀態都能到達其他狀態），非週期防止鏈在循環裡震盪。",
        },
        {
          id: "q3",
          prompt: "細緻均衡 πᵢPᵢⱼ = πⱼPⱼᵢ 是？",
          choices: [
            { id: "a", label: "穩態的充要條件" },
            { id: "b", label: "穩態的充分但非必要條件" },
            { id: "c", label: "穩態的必要但非充分條件" },
            { id: "d", label: "既不必要也不充分" },
          ],
          answer: "b",
          explanation:
            "細緻均衡 ⇒ 穩態，但穩態的鏈不一定可逆。可逆鏈比較容易設計（Metropolis–Hastings），但不是唯一有穩態的鏈。",
        },
      ],
      furtherReading: [
        { title: "Norris — Markov Chains" },
        { title: "Levin, Peres & Wilmer — Markov Chains and Mixing Times" },
        { title: "Brooks et al. — Handbook of Markov Chain Monte Carlo" },
      ],
    },
  },
};

export default chapter;
