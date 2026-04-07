import { Chapter } from "../types";
import { M } from "@/components/math/Math";
import { FormulaBlock } from "@/components/math/FormulaBlock";
import { TheoremCard } from "@/components/math/TheoremCard";
import { ProofStepper } from "@/components/math/ProofStepper";
import { SectionHeader } from "@/components/learning/SectionHeader";

const chapter: Chapter = {
  meta: {
    slug: "method-of-moments",
    module: "E_estimation",
    number: 11,
    minutes: 25,
    level: 3,
    prereqs: ["maximum-likelihood-estimation"],
    tags: ["MoM", "estimation"],
  },
  localized: {
    en: {
      title: "Method of Moments",
      subtitle:
        "The oldest estimator on the planet — match population moments to sample moments and solve. Crude, fast, and surprisingly often the right starting point.",
      hook: "Set theoretical moments equal to sample moments. Solve. Done. Why MoM is the workhorse of preliminary estimation and the warm-up to MLE.",
      whyItMatters: (
        <>
          Before MLE, before Bayesian estimation, there was the method of
          moments (Karl Pearson, 1894). It is dirt-simple: equate the first
          few theoretical moments of your model to the first few sample
          moments and solve. The estimator may be inefficient but it&apos;s
          consistent under mild conditions, gives a closed form when MLE
          requires numerical optimisation, and is the standard initialisation
          for harder methods. Worth knowing for that alone.
        </>
      ),
      intuition: (
        <>
          <p>
            A distribution with <M>k</M> unknown parameters has its first{" "}
            <M>k</M> moments determined by those parameters. Sample moments
            are easy to compute. So set them equal and solve.
          </p>
          <p>
            For a single-parameter family, equate the population mean to{" "}
            <M>{`\\bar X`}</M> and solve for the parameter. For two
            parameters, additionally equate the population variance to the
            sample variance. And so on.
          </p>
          <p>
            That&apos;s the entire method. No optimisation, no Lagrangians,
            no Fisher information. Just &quot;match moments to data&quot;.
            It&apos;s often the first estimator anyone learns and the first
            one anyone tries on a new model.
          </p>
        </>
      ),
      formal: (
        <>
          <p>
            Suppose <M>{`X_1, \\dots, X_n`}</M> are i.i.d. from a parametric
            family with parameter vector <M>{`\\theta = (\\theta_1, \\dots, \\theta_k)`}</M>.
            Define the population moments
          </p>
          <FormulaBlock
            formula={`m_j(\\theta) = E_\\theta[X^j] \\quad \\text{for } j = 1, \\dots, k.`}
          />
          <p>and the sample moments</p>
          <FormulaBlock
            formula={`\\hat m_j = \\frac{1}{n}\\sum_{i=1}^n X_i^j.`}
          />
          <p>
            The <em>method of moments estimator</em>{" "}
            <M>{`\\hat\\theta_{\\text{MoM}}`}</M> is the solution to the
            system
          </p>
          <FormulaBlock
            formula={`m_j(\\hat\\theta_{\\text{MoM}}) = \\hat m_j \\quad \\text{for } j = 1, \\dots, k.`}
            question="Which parameter makes the model's first k moments match the data's?"
          />
          <p>
            For one-parameter families, this is one equation in one unknown.
            Solve algebraically when possible.
          </p>
        </>
      ),
      graduate: (
        <>
          <p>
            <strong>Consistency.</strong> Under mild conditions (continuity
            of <M>{`m_j`}</M> in <M>θ</M>, identifiability), the MoM
            estimator is consistent: as <M>{`n \\to \\infty`}</M>,{" "}
            <M>{`\\hat\\theta_{\\text{MoM}} \\xrightarrow{P} \\theta_0`}</M>.
            The proof is a one-line consequence of the LLN applied to{" "}
            <M>{`\\hat m_j \\to m_j(\\theta_0)`}</M> plus continuous mapping.
          </p>
          <p>
            <strong>Asymptotic normality and inefficiency.</strong> MoM
            estimators are also asymptotically Normal, with covariance
            obtained via the delta method applied to the sample-moment
            vector. They are <em>not</em> in general efficient — that is,
            they typically have variance strictly larger than the
            Cramér–Rao lower bound, which the MLE asymptotically attains.
            For Normal data, MoM and MLE coincide (both give the sample
            mean and sample variance). For more general models, MLE wins
            in efficiency but MoM wins in simplicity.
          </p>
          <p>
            <strong>When MoM saves the day.</strong> MLE for some models
            (mixtures, latent-variable models, distributions with no
            closed-form likelihood) requires expensive numerical
            optimisation. MoM gives a closed-form starting point that you
            then refine with EM or gradient methods. It also works when the
            likelihood is not even available — only the moments are
            (e.g. method of moments for the negative binomial via just the
            mean and variance is the standard pre-registration estimator).
          </p>
          <p>
            <strong>Generalised Method of Moments (GMM).</strong> Hansen
            (1982) extended this idea to the case where you have <em>more</em>{" "}
            moment conditions than parameters. The idea: form a vector of
            moment conditions and minimise its weighted quadratic form.
            GMM is the bedrock of modern econometrics; instrumental
            variable estimation, two-stage least squares, and most
            asset-pricing models are GMM in disguise.
          </p>
        </>
      ),
      body: (
        <>
          <SectionHeader step={1} title="Worked example: MoM for Exponential(λ)" />
          <ProofStepper
            title="Exponential MoM"
            steps={[
              { title: "Compute the population mean.", math: "E_\\lambda[X] = 1/\\lambda" },
              { title: "Compute the sample mean.", math: "\\hat m_1 = \\bar X" },
              { title: "Set them equal.", math: "1/\\hat\\lambda = \\bar X" },
              { title: "Solve.", math: "\\hat\\lambda_{\\text{MoM}} = 1/\\bar X" },
              { title: "Compare to MLE.", reason: "The Exponential MLE is also 1/X̄. For the exponential family, the two methods coincide — but this is a happy accident, not the general rule." },
            ]}
          />

          <SectionHeader step={2} title="Worked example: MoM for Uniform(0, θ)" />
          <ProofStepper
            title="Uniform MoM"
            steps={[
              { title: "Compute the population mean.", math: "E_\\theta[X] = \\theta/2" },
              { title: "Equate to the sample mean.", math: "\\hat\\theta/2 = \\bar X \\Rightarrow \\hat\\theta_{\\text{MoM}} = 2\\bar X" },
              { title: "Compare to MLE.", math: "\\hat\\theta_{\\text{MLE}} = \\max(X_1, \\dots, X_n)", reason: "For Uniform(0, θ), the MLE is the maximum. MoM and MLE disagree dramatically — and the MLE is biased downward while MoM can OVERSHOOT θ." },
              { title: "Insight.", reason: "Both estimators are consistent, but MoM has higher variance for small n while MLE has bias. This is one of the cleanest cases where the choice of estimation method actually matters." },
            ]}
          />

          <TheoremCard
            kind="theorem"
            name="Consistency of MoM"
            statement={
              <>
                Suppose the moment functions <M>{`m_j(\\theta)`}</M> are
                continuous and the system <M>{`m_j(\\theta) = m_j(\\theta_0)`}</M>{" "}
                has a unique solution <M>{`\\theta = \\theta_0`}</M>. Then
              </>
            }
            formula={`\\hat\\theta_{\\text{MoM}} \\xrightarrow{P} \\theta_0 \\quad \\text{as } n \\to \\infty.`}
          >
            Proof: by the LLN, <M>{`\\hat m_j \\xrightarrow{P} m_j(\\theta_0)`}</M>.
            By continuous mapping (continuity of the inverse <M>{`m^{-1}`}</M>),
            <M>{`\\hat\\theta_{\\text{MoM}} = m^{-1}(\\hat m) \\xrightarrow{P} m^{-1}(m(\\theta_0)) = \\theta_0`}</M>.
          </TheoremCard>
        </>
      ),
      misconceptions: [
        {
          wrong: "MoM and MLE are basically the same thing.",
          right:
            "They are entirely different. MoM matches moments; MLE maximises likelihood. They coincide for the exponential family in some cases, but disagree dramatically for many others (e.g. Uniform(0, θ), mixture models).",
        },
        {
          wrong: "MoM is obsolete now that we have MLE.",
          right:
            "MoM is still the standard initialiser for hard MLE problems and the basis of GMM, which dominates econometrics. It's also one of the few methods that works when only moments are available (no closed-form likelihood).",
        },
        {
          wrong: "MoM is always asymptotically efficient.",
          right:
            "MoM is consistent and asymptotically Normal but typically NOT efficient — its asymptotic variance is generally above the Cramér–Rao lower bound. MLE is the efficient one.",
        },
      ],
      takeaways: [
        "Method of moments: equate the first k population moments to the first k sample moments and solve for θ.",
        "MoM is consistent under mild conditions; the proof is one application of the LLN plus continuous mapping.",
        "MoM is generally not efficient — MLE has lower asymptotic variance.",
        "MoM is the natural starting point when MLE has no closed form (mixtures, latent variables, no likelihood).",
        "GMM (Hansen 1982) is the modern generalisation and the foundation of much of econometrics.",
      ],
      quiz: [
        {
          id: "q1",
          prompt:
            "For Poisson(λ) data, the method of moments estimator is...",
          choices: [
            { id: "a", label: "λ̂ = X̄" },
            { id: "b", label: "λ̂ = max(X_i)" },
            { id: "c", label: "λ̂ = 1/X̄" },
            { id: "d", label: "λ̂ = sample variance" },
          ],
          answer: "a",
          explanation: "E[X] = λ for Poisson; equate to X̄ to get λ̂_MoM = X̄. Same as MLE in this case.",
        },
        {
          id: "q2",
          prompt:
            "Which is true about MoM compared to MLE?",
          choices: [
            { id: "a", label: "MoM is always more efficient." },
            { id: "b", label: "MoM is generally consistent but not always efficient." },
            { id: "c", label: "MoM only works for Normal data." },
            { id: "d", label: "MoM uses no information from the data." },
          ],
          answer: "b",
          explanation:
            "MoM is consistent under mild conditions but its asymptotic variance is generally higher than the Cramér–Rao bound that MLE attains.",
        },
        {
          id: "q3",
          type: "numeric",
          prompt:
            "You observe X̄ = 2.5 from an Exponential(λ) sample. What is λ̂_MoM?",
          answer: 0.4,
          tolerance: 0.005,
          hint: "E[X] = 1/λ for Exponential(λ).",
          explanation: "Equate 1/λ̂ = X̄ = 2.5, so λ̂ = 1/2.5 = 0.4.",
        },
        {
          id: "q4",
          type: "ordering",
          prompt: "Re-order the steps of computing the MoM estimator.",
          steps: [
            { id: "s1", label: "Write the population mean E_θ[X] as a function of θ" },
            { id: "s2", label: "Compute the sample mean X̄ from the data" },
            { id: "s3", label: "Set E_θ[X] = X̄" },
            { id: "s4", label: "Solve the equation for θ" },
            { id: "s5", label: "Read off θ̂_MoM" },
          ],
          explanation: "The MoM recipe is mechanical: write moments, compute sample moments, equate, solve.",
        },
      ],
      furtherReading: [
        { title: "Casella & Berger — Statistical Inference, ch. 7" },
        { title: "Hansen — 'Large Sample Properties of Generalized Method of Moments Estimators' (1982)" },
      ],
    },

    zh: {
      title: "動差法",
      subtitle:
        "地球上最古老的估計量 ── 把母體動差等於樣本動差然後解出來。粗糙、快速，而且出乎意料地常常是正確的起點。",
      hook: "把理論動差設為樣本動差。解。完成。為什麼動差法是「初步估計」的工作母機，也是 MLE 的暖身。",
      whyItMatters: (
        <>
          在 MLE 之前，在貝氏估計之前，就有動差法（Karl Pearson, 1894）。
          它簡單到不行：把模型的前幾個理論動差等於前幾個樣本動差，然後解。
          這個估計量可能不是最有效率，但它在溫和條件下是一致的，
          並在 MLE 需要數值最佳化時直接給你封閉解，
          也是更難方法的標準初始化。光是這點就值得學。
        </>
      ),
      intuition: (
        <>
          <p>
            一個有 <M>k</M> 個未知參數的分布，
            它的前 <M>k</M> 個動差會被這些參數決定。
            樣本動差很容易算。所以把它們設為相等然後解。
          </p>
          <p>
            單參數族：把母體平均等於 <M>{`\\bar X`}</M> 然後解出參數。
            兩個參數：再把母體變異數等於樣本變異數。以此類推。
          </p>
          <p>
            這就是整個方法。沒有最佳化、沒有 Lagrangian、沒有 Fisher 訊息。
            只有「把動差和資料對齊」。
            它通常是任何人在新模型上嘗試的第一個估計量。
          </p>
        </>
      ),
      formal: (
        <>
          <p>
            假設 <M>{`X_1, \\dots, X_n`}</M> 為來自參數族的 i.i.d. 樣本，
            參數向量為 <M>{`\\theta = (\\theta_1, \\dots, \\theta_k)`}</M>。
            定義母體動差：
          </p>
          <FormulaBlock
            formula={`m_j(\\theta) = E_\\theta[X^j] \\quad \\text{for } j = 1, \\dots, k.`}
          />
          <p>樣本動差：</p>
          <FormulaBlock
            formula={`\\hat m_j = \\frac{1}{n}\\sum_{i=1}^n X_i^j.`}
          />
          <p>
            <em>動差法估計量</em> <M>{`\\hat\\theta_{\\text{MoM}}`}</M>{" "}
            是下列方程組的解：
          </p>
          <FormulaBlock
            formula={`m_j(\\hat\\theta_{\\text{MoM}}) = \\hat m_j \\quad \\text{for } j = 1, \\dots, k.`}
            question="哪個參數會讓模型的前 k 個動差和資料的前 k 個動差相等？"
          />
          <p>
            單參數族就是「一個方程式、一個未知數」。能解就解。
          </p>
        </>
      ),
      graduate: (
        <>
          <p>
            <strong>一致性。</strong>
            在溫和條件下（<M>{`m_j`}</M> 對 <M>θ</M> 連續、可識別），
            動差法估計量是一致的：當 <M>{`n \\to \\infty`}</M>，
            <M>{`\\hat\\theta_{\\text{MoM}} \\xrightarrow{P} \\theta_0`}</M>。
            證明是「LLN 套用到 <M>{`\\hat m_j \\to m_j(\\theta_0)`}</M> 加上連續映射」的一行推論。
          </p>
          <p>
            <strong>漸近常態性與「沒有效率」。</strong>
            動差法估計量也是漸近常態的，
            其變異數透過對「樣本動差向量」套 delta 方法得到。
            它一般<em>不</em>是有效的 ──
            它的漸近變異數通常嚴格大於 Cramér–Rao 下界
            （而 MLE 漸近上能達成）。
            對於常態資料，動差法和 MLE 一致（兩者都給你樣本平均與樣本變異數）。
            對更一般的模型，MLE 在效率上贏，動差法在簡單性上贏。
          </p>
          <p>
            <strong>動差法救火的情境。</strong>
            某些模型的 MLE（混合模型、潛在變數模型、沒有封閉式概似的分布）
            需要昂貴的數值最佳化。
            動差法給你一個封閉式的起點，
            然後你用 EM 或梯度方法去 refine。
            它也能在「概似根本不存在、只有動差」時運作
            （例如負二項分布的動差法只用平均和變異數，是標準的「先註冊」估計量）。
          </p>
          <p>
            <strong>廣義動差法（GMM）。</strong>
            Hansen（1982）把這個概念推廣到「動差條件比參數多」的情況。
            概念：建一個動差條件向量，
            最小化它的「加權平方型」。
            GMM 是現代計量經濟學的基石；
            instrumental variable 估計、two-stage least squares、
            以及大多數資產定價模型，都是 GMM 換了名字。
          </p>
        </>
      ),
      body: (
        <>
          <SectionHeader step={1} title="工作範例：Exponential(λ) 的 MoM" />
          <ProofStepper
            title="指數分布的動差法"
            steps={[
              { title: "計算母體平均。", math: "E_\\lambda[X] = 1/\\lambda" },
              { title: "計算樣本平均。", math: "\\hat m_1 = \\bar X" },
              { title: "把它們等於。", math: "1/\\hat\\lambda = \\bar X" },
              { title: "解。", math: "\\hat\\lambda_{\\text{MoM}} = 1/\\bar X" },
              { title: "與 MLE 比較。", reason: "指數分布的 MLE 也是 1/X̄。對指數族，這兩種方法一致 ── 但這是個美妙的巧合，不是通則。" },
            ]}
          />

          <SectionHeader step={2} title="工作範例：Uniform(0, θ) 的 MoM" />
          <ProofStepper
            title="均勻分布的動差法"
            steps={[
              { title: "計算母體平均。", math: "E_\\theta[X] = \\theta/2" },
              { title: "等於樣本平均。", math: "\\hat\\theta/2 = \\bar X \\Rightarrow \\hat\\theta_{\\text{MoM}} = 2\\bar X" },
              { title: "與 MLE 比較。", math: "\\hat\\theta_{\\text{MLE}} = \\max(X_1, \\dots, X_n)", reason: "對 Uniform(0, θ)，MLE 是「最大值」。MoM 和 MLE 嚴重不一致 ── MLE 是負偏的，而 MoM 可能會「超出」θ。" },
              { title: "洞見。", reason: "兩個估計量都是一致的，但小 n 時 MoM 變異數較大，MLE 則有偏。這是「估計方法的選擇真的會影響結果」最乾淨的例子之一。" },
            ]}
          />

          <TheoremCard
            kind="theorem"
            name="MoM 的一致性"
            statement={
              <>
                假設動差函數 <M>{`m_j(\\theta)`}</M> 連續，
                且系統 <M>{`m_j(\\theta) = m_j(\\theta_0)`}</M>{" "}
                有唯一解 <M>{`\\theta = \\theta_0`}</M>。則
              </>
            }
            formula={`\\hat\\theta_{\\text{MoM}} \\xrightarrow{P} \\theta_0 \\quad \\text{當 } n \\to \\infty.`}
          >
            證明：由 LLN，<M>{`\\hat m_j \\xrightarrow{P} m_j(\\theta_0)`}</M>。
            由連續映射（<M>{`m^{-1}`}</M> 連續），
            <M>{`\\hat\\theta_{\\text{MoM}} = m^{-1}(\\hat m) \\xrightarrow{P} m^{-1}(m(\\theta_0)) = \\theta_0`}</M>。
          </TheoremCard>
        </>
      ),
      misconceptions: [
        {
          wrong: "MoM 與 MLE 基本上是同一回事。",
          right:
            "它們完全不同。MoM 對齊動差；MLE 最大化概似。對指數族某些情況下會一致，但對許多其他情況（例如 Uniform(0, θ)、混合模型）則嚴重不一致。",
        },
        {
          wrong: "有了 MLE 後 MoM 就過時了。",
          right:
            "MoM 仍然是「困難 MLE 問題」的標準初始化，也是 GMM 的基礎，而 GMM 主導著計量經濟學。它也是少數幾個能在「只有動差、沒有封閉式概似」時運作的方法。",
        },
        {
          wrong: "MoM 永遠是漸近有效的。",
          right:
            "MoM 是一致且漸近常態的，但通常「不是」有效的 ── 它的漸近變異數一般高於 Cramér–Rao 下界。MLE 才是有效的那個。",
        },
      ],
      takeaways: [
        "動差法：把前 k 個母體動差等於前 k 個樣本動差，然後解出 θ。",
        "MoM 在溫和條件下是一致的；證明只需要「LLN + 連續映射」一行。",
        "MoM 一般不是有效的 ── MLE 有更低的漸近變異數。",
        "MLE 沒有封閉解時（混合、潛在變數、沒有概似），MoM 是自然的起點。",
        "GMM（Hansen 1982）是現代推廣，也是計量經濟學大半的基礎。",
      ],
      quiz: [
        {
          id: "q1",
          prompt:
            "對 Poisson(λ) 資料，動差法估計量是？",
          choices: [
            { id: "a", label: "λ̂ = X̄" },
            { id: "b", label: "λ̂ = max(X_i)" },
            { id: "c", label: "λ̂ = 1/X̄" },
            { id: "d", label: "λ̂ = 樣本變異數" },
          ],
          answer: "a",
          explanation: "Poisson 的 E[X] = λ；等於 X̄ 得到 λ̂_MoM = X̄。這個情況下與 MLE 一致。",
        },
        {
          id: "q2",
          prompt:
            "下列關於 MoM 與 MLE 比較的敘述，何者正確？",
          choices: [
            { id: "a", label: "MoM 永遠比較有效。" },
            { id: "b", label: "MoM 一般是一致的，但不一定是有效的。" },
            { id: "c", label: "MoM 只能用在常態資料。" },
            { id: "d", label: "MoM 完全沒用到資料的訊息。" },
          ],
          answer: "b",
          explanation:
            "MoM 在溫和條件下是一致的，但漸近變異數一般高於 MLE 達成的 Cramér–Rao 下界。",
        },
        {
          id: "q3",
          type: "numeric",
          prompt:
            "你從一個 Exponential(λ) 樣本得到 X̄ = 2.5。λ̂_MoM 是多少？",
          answer: 0.4,
          tolerance: 0.005,
          hint: "Exponential(λ) 的 E[X] = 1/λ。",
          explanation: "等式 1/λ̂ = X̄ = 2.5，所以 λ̂ = 1/2.5 = 0.4。",
        },
        {
          id: "q4",
          type: "ordering",
          prompt: "把計算動差法估計量的步驟重新排序。",
          steps: [
            { id: "s1", label: "把母體平均 E_θ[X] 寫成 θ 的函數" },
            { id: "s2", label: "從資料計算樣本平均 X̄" },
            { id: "s3", label: "設 E_θ[X] = X̄" },
            { id: "s4", label: "對 θ 解這個方程式" },
            { id: "s5", label: "讀出 θ̂_MoM" },
          ],
          explanation: "MoM 食譜是機械的：寫動差、算樣本動差、相等、解。",
        },
      ],
      furtherReading: [
        { title: "Casella & Berger — Statistical Inference, ch. 7" },
        { title: "Hansen — 'Large Sample Properties of Generalized Method of Moments Estimators' (1982)" },
      ],
    },
  },
};

export default chapter;
