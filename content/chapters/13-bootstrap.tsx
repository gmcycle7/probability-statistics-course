import { Chapter } from "../types";
import { M } from "@/components/math/Math";
import { FormulaBlock } from "@/components/math/FormulaBlock";
import { TheoremCard } from "@/components/math/TheoremCard";
import { ProofStepper } from "@/components/math/ProofStepper";
import { BootstrapSimulator } from "@/components/interactive/BootstrapSimulator";
import { SectionHeader } from "@/components/learning/SectionHeader";

const chapter: Chapter = {
  meta: {
    slug: "bootstrap",
    module: "E_estimation",
    number: 13,
    minutes: 35,
    level: 4,
    prereqs: ["confidence-intervals"],
    tags: ["bootstrap", "resampling"],
  },
  localized: {
    en: {
      title: "The Bootstrap",
      subtitle:
        "When you can't derive the sampling distribution analytically, just resample. Twenty lines of code, zero analytical work, and a frequentist guarantee at the end.",
      hook: "The single most useful 'practical statistics' algorithm of the last 50 years. Resample with replacement; the empirical distribution stands in for the unknown true distribution.",
      whyItMatters: (
        <>
          For most real-world estimators, the sampling distribution is not
          available in closed form. Bootstrap solves this by replacing
          theory with brute-force resampling: pretend the empirical
          distribution IS the true distribution, sample from it, and
          observe how the estimator varies. With enough resamples this
          gives you a standard error, a confidence interval, or a bias
          correction — for any estimator at all. Efron (1979) is one of
          the most-cited papers in statistics for a reason.
        </>
      ),
      intuition: (
        <>
          <p>
            You have a single sample <M>{`X_1, \\dots, X_n`}</M>. You compute
            an estimator <M>{`\\hat\\theta = T(X_1, \\dots, X_n)`}</M> and
            want to know its standard error, or build a confidence interval
            for the true <M>θ</M>. Normally you would derive the sampling
            distribution of <M>{`\\hat\\theta`}</M> analytically. But for
            most estimators (median, ratio, trimmed mean, kernel density
            estimate at a point, anything ML-related) this is hard or
            impossible.
          </p>
          <p>
            The bootstrap insight: if your sample is the only window into
            the true distribution, then the next-best thing to repeating
            the experiment is to repeatedly resample <em>your sample</em>{" "}
            with replacement. Each &quot;bootstrap sample&quot; is the
            same size as the original; each gives a new <M>{`\\hat\\theta^*`}</M>;
            the histogram of these bootstrap estimates approximates the
            true sampling distribution.
          </p>
          <p>
            This is computationally cheap: typically <M>{`B = 1{,}000`}</M>{" "}
            resamples is plenty. And it requires zero theory.
          </p>
        </>
      ),
      formal: (
        <>
          <p>
            Let <M>{`F_n`}</M> denote the empirical distribution that puts
            mass <M>{`1/n`}</M> at each observed point. The bootstrap
            principle says: <em>treat <M>{`F_n`}</M> as if it were the true
            distribution, and study the estimator&apos;s behaviour by
            sampling from <M>{`F_n`}</M>.</em>
          </p>
          <p>
            Operationally, for <M>{`b = 1, \\dots, B`}</M>:
          </p>
          <ol className="list-decimal pl-6 space-y-1.5 mt-2">
            <li>Draw a bootstrap sample <M>{`X_1^{*(b)}, \\dots, X_n^{*(b)}`}</M> by sampling <M>n</M> values <em>with replacement</em> from the original <M>{`X_1, \\dots, X_n`}</M>.</li>
            <li>Compute <M>{`\\hat\\theta^{*(b)} = T(X_1^{*(b)}, \\dots, X_n^{*(b)})`}</M>.</li>
          </ol>
          <p>
            The empirical distribution of{" "}
            <M>{`\\hat\\theta^{*(1)}, \\dots, \\hat\\theta^{*(B)}`}</M> is
            the bootstrap distribution. From it you can derive:
          </p>
          <FormulaBlock
            formula={`\\hat{\\text{SE}}_{\\text{boot}}(\\hat\\theta) = \\sqrt{\\frac{1}{B-1}\\sum_{b=1}^B (\\hat\\theta^{*(b)} - \\bar{\\hat\\theta^*})^2}`}
            question="What is the standard error of θ̂ when no closed form exists?"
          />
          <p>
            and the <em>percentile bootstrap CI</em>:
          </p>
          <FormulaBlock
            formula={`\\text{CI}_{1-\\alpha} = \\big[\\hat\\theta^*_{(\\alpha/2)},\\ \\hat\\theta^*_{(1-\\alpha/2)}\\big]`}
          />
          <p>
            i.e. the central <M>{`(1-\\alpha)`}</M> quantiles of the
            bootstrap distribution. For 95% confidence: the 2.5th and 97.5th
            percentiles.
          </p>
        </>
      ),
      graduate: (
        <>
          <p>
            <strong>Why it works (heuristic).</strong> The Glivenko–Cantelli
            theorem says <M>{`F_n \\to F`}</M> uniformly as{" "}
            <M>{`n \\to \\infty`}</M>. So plugging in <M>{`F_n`}</M> for{" "}
            <M>F</M> is asymptotically valid. More precisely, under
            regularity, the bootstrap distribution of{" "}
            <M>{`\\hat\\theta_n^* - \\hat\\theta_n`}</M>{" "}
            (centred at the original estimator) is a consistent estimator
            of the true sampling distribution of{" "}
            <M>{`\\hat\\theta_n - \\theta`}</M>. This is the formal
            consistency result of Bickel and Freedman (1981).
          </p>
          <p>
            <strong>Bias correction.</strong> Because{" "}
            <M>{`E^*[\\hat\\theta^*] \\approx \\hat\\theta`}</M>, the bootstrap
            estimate of bias is{" "}
            <M>{`\\hat{\\text{bias}}_{\\text{boot}} = \\bar{\\hat\\theta^*} - \\hat\\theta`}</M>.
            A bias-corrected estimator is{" "}
            <M>{`\\hat\\theta - \\hat{\\text{bias}}_{\\text{boot}} = 2\\hat\\theta - \\bar{\\hat\\theta^*}`}</M>.
            Useful when bias is comparable to variance.
          </p>
          <p>
            <strong>Variants of bootstrap CIs.</strong> The percentile CI
            is the simplest. Others, in increasing sophistication:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 mt-2">
            <li>
              <strong>Basic / pivotal</strong>:{" "}
              <M>{`[2\\hat\\theta - \\hat\\theta^*_{(1-\\alpha/2)},\\ 2\\hat\\theta - \\hat\\theta^*_{(\\alpha/2)}]`}</M>.
              Reflects the bootstrap distribution about the original
              estimate.
            </li>
            <li>
              <strong>Bias-corrected and accelerated (BCa)</strong>: corrects
              for bias and skewness in the bootstrap distribution. The
              standard recommendation when you can spare the computation.
            </li>
            <li>
              <strong>Studentised / bootstrap-t</strong>: computes a
              t-statistic from each resample and uses its bootstrap
              distribution. Highest accuracy but requires nested resampling.
            </li>
          </ul>
          <p>
            <strong>When bootstrap fails.</strong> The bootstrap is not
            magic. It fails for:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 mt-2">
            <li>Estimators of extremes (max, min) — the empirical max never exceeds the original max.</li>
            <li>Heavy-tailed distributions where moments don&apos;t exist.</li>
            <li>Non-i.i.d. data without using the right block bootstrap.</li>
            <li>Estimators that are non-smooth functionals of the empirical distribution.</li>
          </ul>
          <p>
            Knowing when NOT to bootstrap is half the battle.
          </p>
        </>
      ),
      body: (
        <>
          <SectionHeader step={1} title="Watch the bootstrap distribution form" blurb="Pick a source, draw one fresh sample, and B resamples will produce a histogram of bootstrap means. The 2.5/97.5 percentiles give a CI for the true mean." />
          <BootstrapSimulator />

          <SectionHeader step={2} title="Worked example: SE of the median" />
          <p className="text-ink-dim leading-relaxed">
            The sample median <M>{`\\hat M`}</M> has no nice closed-form
            standard error formula (it depends on the unknown density at
            the median). Bootstrap solves this in three lines:
          </p>
          <ProofStepper
            title="Bootstrap SE of the median"
            steps={[
              { title: "Draw B = 1000 bootstrap samples.", math: "X^{*(b)} = (X_{i_1^{(b)}}, \\dots, X_{i_n^{(b)}}) \\text{ with replacement}" },
              { title: "Compute the median of each.", math: "\\hat M^{*(b)} = \\text{median}(X^{*(b)})" },
              { title: "Take the standard deviation across b.", math: "\\hat{\\text{SE}}_{\\text{boot}}(\\hat M) = \\text{sd}(\\hat M^{*(1)}, \\dots, \\hat M^{*(B)})" },
              { title: "Done.", reason: "No theory required. The same recipe works for the trimmed mean, the interquartile range, the regression coefficient under heteroskedasticity, etc." },
            ]}
          />

          <TheoremCard
            kind="theorem"
            name="Bootstrap consistency (Bickel–Freedman 1981)"
            statement={
              <>
                Under regularity conditions on a smooth statistical
                functional <M>T</M>, the conditional distribution of{" "}
                <M>{`\\sqrt{n}(\\hat\\theta_n^* - \\hat\\theta_n)`}</M>{" "}
                given the data converges in probability (in the weak
                topology) to the same Normal limit as{" "}
                <M>{`\\sqrt{n}(\\hat\\theta_n - \\theta)`}</M>.
              </>
            }
          >
            In other words: bootstrap distributions are consistent
            estimates of true sampling distributions for smooth functionals
            of i.i.d. data. Not magic — a precise theorem with precise
            conditions.
          </TheoremCard>
        </>
      ),
      misconceptions: [
        {
          wrong: "Bootstrap creates new data.",
          right:
            "It does not. Each bootstrap sample is just a re-shuffling of the original observations with some duplicated and some omitted. No new information enters the system; the bootstrap only quantifies how much the estimator wobbles under that re-shuffling.",
        },
        {
          wrong: "Bootstrap works for any estimator.",
          right:
            "It fails for max, min, extreme quantiles, heavy-tailed distributions where moments are infinite, and dependent data unless you use a block bootstrap. Knowing when NOT to bootstrap is part of using it correctly.",
        },
        {
          wrong: "Bootstrap is the same as cross-validation.",
          right:
            "Different goals. Bootstrap quantifies sampling variability (SE, CI, bias). Cross-validation estimates out-of-sample prediction error. They share the resampling spirit but serve different purposes.",
        },
      ],
      takeaways: [
        "Bootstrap = resample your sample with replacement, recompute the estimator, build a histogram, read off SE and CI.",
        "B = 1000 to 10000 resamples is typically plenty; the cost is a few hundred milliseconds.",
        "Percentile CI: the 2.5th and 97.5th percentiles of the bootstrap distribution.",
        "Justified by Bickel–Freedman: bootstrap distributions consistently estimate true sampling distributions for smooth functionals.",
        "Fails for extremes, heavy tails, non-iid data without block adaptation.",
      ],
      quiz: [
        {
          id: "q1",
          prompt:
            "A bootstrap sample of size n is drawn by...",
          choices: [
            { id: "a", label: "Drawing n new observations from the population" },
            { id: "b", label: "Drawing n values from the original sample WITHOUT replacement" },
            { id: "c", label: "Drawing n values from the original sample WITH replacement" },
            { id: "d", label: "Drawing n/2 values from each half of the original sample" },
          ],
          answer: "c",
          explanation:
            "Bootstrap = sampling with replacement from the original data. This is the entire idea.",
        },
        {
          id: "q2",
          prompt: "A 95% percentile bootstrap CI uses which two quantiles of the bootstrap distribution?",
          choices: [
            { id: "a", label: "The 5th and 95th" },
            { id: "b", label: "The 2.5th and 97.5th" },
            { id: "c", label: "The 25th and 75th" },
            { id: "d", label: "The min and max" },
          ],
          answer: "b",
          explanation:
            "Two-sided 95% interval = central 95% mass = 2.5% trimmed from each tail.",
        },
        {
          id: "q3",
          type: "numeric",
          prompt:
            "B = 5000 resamples. The bootstrap means have empirical std = 0.42. The bootstrap standard error of x̄ is approximately?",
          answer: 0.42,
          tolerance: 0.01,
          hint: "The bootstrap SE IS the std of the bootstrap distribution.",
          explanation: "By definition, SE_boot = sd(bootstrap estimates) ≈ 0.42.",
        },
        {
          id: "q4",
          type: "ordering",
          prompt: "Re-order the steps of computing a bootstrap CI.",
          steps: [
            { id: "s1", label: "Start with the original sample X_1, ..., X_n" },
            { id: "s2", label: "Resample n values WITH replacement to form X*^(b)" },
            { id: "s3", label: "Compute θ̂*^(b) = T(X*^(b))" },
            { id: "s4", label: "Repeat for b = 1, ..., B" },
            { id: "s5", label: "Sort the B bootstrap estimates" },
            { id: "s6", label: "Read off the 2.5% and 97.5% quantiles as the CI endpoints" },
          ],
          explanation: "Mechanical: resample → recompute → repeat → sort → read percentiles.",
        },
      ],
      furtherReading: [
        { title: "Efron — 'Bootstrap Methods: Another Look at the Jackknife' (1979)" },
        { title: "Efron & Tibshirani — An Introduction to the Bootstrap" },
        { title: "Davison & Hinkley — Bootstrap Methods and their Application" },
      ],
    },

    zh: {
      title: "Bootstrap",
      subtitle:
        "當你無法解析地導出抽樣分布時，就「重抽樣」。20 行程式碼、零解析工作，最後得到一個頻率學派保證。",
      hook: "近 50 年來最有用的「實務統計」演算法。重抽樣有放回；經驗分布替代未知的真實分布。",
      whyItMatters: (
        <>
          對於大多數真實世界的估計量，抽樣分布根本沒有封閉式。
          Bootstrap 用「暴力重抽樣」取代理論：
          假裝經驗分布<em>就是</em>真實分布，從中抽樣，
          觀察估計量怎麼變化。
          重抽樣夠多次之後，
          你就能對任何估計量得到標準誤、信賴區間、或偏誤校正。
          Efron（1979）是統計學被引用最多的論文之一是有原因的。
        </>
      ),
      intuition: (
        <>
          <p>
            你只有一份樣本 <M>{`X_1, \\dots, X_n`}</M>。
            你算了一個估計量 <M>{`\\hat\\theta = T(X_1, \\dots, X_n)`}</M>，
            想知道它的標準誤、或建一個對真實 <M>θ</M> 的信賴區間。
            正常你會解析地導出 <M>{`\\hat\\theta`}</M> 的抽樣分布，
            但對大多數估計量
            （中位數、比率、修剪平均、某點的核密度估計、任何 ML 相關的東西）
            這很難或不可能。
          </p>
          <p>
            Bootstrap 的洞見：
            如果你的樣本是看見真實分布的唯一窗口，
            那麼「重複實驗」的次佳替代品就是「對你自己的樣本反覆有放回地重抽樣」。
            每一個「bootstrap 樣本」與原樣本同樣大小；
            每一個都產生一個新的 <M>{`\\hat\\theta^*`}</M>；
            這些 bootstrap 估計值的直方圖近似了真實的抽樣分布。
          </p>
          <p>
            這在計算上很便宜：
            通常 <M>{`B = 1{,}000`}</M> 次重抽樣就綽綽有餘。
            而且不需要任何理論。
          </p>
        </>
      ),
      formal: (
        <>
          <p>
            設 <M>{`F_n`}</M> 為經驗分布
            （在每個觀察點上放質量 <M>{`1/n`}</M>）。
            Bootstrap 原理是：
            <em>把 <M>{`F_n`}</M> 當成真實分布，
            透過從 <M>{`F_n`}</M> 抽樣來研究估計量的行為。</em>
          </p>
          <p>實際操作上，對 <M>{`b = 1, \\dots, B`}</M>：</p>
          <ol className="list-decimal pl-6 space-y-1.5 mt-2">
            <li>從原樣本 <M>{`X_1, \\dots, X_n`}</M> 中<em>有放回地</em>抽 <M>n</M> 個值，形成 bootstrap 樣本 <M>{`X_1^{*(b)}, \\dots, X_n^{*(b)}`}</M>。</li>
            <li>計算 <M>{`\\hat\\theta^{*(b)} = T(X_1^{*(b)}, \\dots, X_n^{*(b)})`}</M>。</li>
          </ol>
          <p>
            <M>{`\\hat\\theta^{*(1)}, \\dots, \\hat\\theta^{*(B)}`}</M>{" "}
            的經驗分布就是 bootstrap 分布。從它你可以得到：
          </p>
          <FormulaBlock
            formula={`\\hat{\\text{SE}}_{\\text{boot}}(\\hat\\theta) = \\sqrt{\\frac{1}{B-1}\\sum_{b=1}^B (\\hat\\theta^{*(b)} - \\bar{\\hat\\theta^*})^2}`}
            question="當沒有封閉式時，θ̂ 的標準誤是什麼？"
          />
          <p>以及 <em>percentile bootstrap CI</em>：</p>
          <FormulaBlock
            formula={`\\text{CI}_{1-\\alpha} = \\big[\\hat\\theta^*_{(\\alpha/2)},\\ \\hat\\theta^*_{(1-\\alpha/2)}\\big]`}
          />
          <p>
            也就是 bootstrap 分布的中央 <M>{`(1-\\alpha)`}</M> 分位數。
            95% 信心：第 2.5 與第 97.5 百分位。
          </p>
        </>
      ),
      graduate: (
        <>
          <p>
            <strong>為什麼有效（直覺）。</strong>
            Glivenko–Cantelli 定理說當 <M>{`n \\to \\infty`}</M>，
            <M>{`F_n \\to F`}</M> 一致收斂。
            所以「把 <M>{`F_n`}</M> 代入 <M>F</M>」在漸近上是有效的。
            更精確地說，在規則條件下，
            「中心化」過的 bootstrap 分布{" "}
            <M>{`\\hat\\theta_n^* - \\hat\\theta_n`}</M>{" "}
            是真實抽樣分布 <M>{`\\hat\\theta_n - \\theta`}</M> 的一致估計。
            這就是 Bickel 與 Freedman（1981）的形式化一致性結果。
          </p>
          <p>
            <strong>偏誤校正。</strong>
            因為 <M>{`E^*[\\hat\\theta^*] \\approx \\hat\\theta`}</M>，
            bootstrap 對偏誤的估計為{" "}
            <M>{`\\hat{\\text{bias}}_{\\text{boot}} = \\bar{\\hat\\theta^*} - \\hat\\theta`}</M>。
            校正後的估計量為{" "}
            <M>{`\\hat\\theta - \\hat{\\text{bias}}_{\\text{boot}} = 2\\hat\\theta - \\bar{\\hat\\theta^*}`}</M>。
            偏誤與變異數量級相當時很有用。
          </p>
          <p>
            <strong>Bootstrap CI 的變體。</strong>
            Percentile CI 是最簡單的，按複雜度遞增還有：
          </p>
          <ul className="list-disc pl-6 space-y-1.5 mt-2">
            <li>
              <strong>Basic / pivotal</strong>：
              <M>{`[2\\hat\\theta - \\hat\\theta^*_{(1-\\alpha/2)},\\ 2\\hat\\theta - \\hat\\theta^*_{(\\alpha/2)}]`}</M>。
              把 bootstrap 分布以原始估計為中心反射過來。
            </li>
            <li>
              <strong>BCa（bias-corrected and accelerated）</strong>：
              修正 bootstrap 分布的偏誤與偏斜度。
              當你有計算資源時的標準推薦。
            </li>
            <li>
              <strong>Studentised / bootstrap-t</strong>：
              對每個 resample 計算一個 t 統計量並用它的 bootstrap 分布。
              準確度最高但需要巢狀重抽樣。
            </li>
          </ul>
          <p>
            <strong>Bootstrap 失敗的情況。</strong>
            Bootstrap 不是魔法。它對下列情況失敗：
          </p>
          <ul className="list-disc pl-6 space-y-1.5 mt-2">
            <li>極值估計量（max、min）── 經驗最大值永遠不會超過原樣本的最大值。</li>
            <li>動差不存在的重尾分布。</li>
            <li>不是 i.i.d. 的資料（除非你用對的 block bootstrap）。</li>
            <li>對經驗分布來說「不平滑」的泛函。</li>
          </ul>
          <p>知道「什麼時候不該」用 bootstrap，是正確使用它的一半。</p>
        </>
      ),
      body: (
        <>
          <SectionHeader step={1} title="親眼看 bootstrap 分布形成" blurb="挑來源、抽一份新樣本，B 次重抽樣會產生 bootstrap 平均的直方圖。2.5/97.5 百分位給你對真實平均的 CI。" />
          <BootstrapSimulator />

          <SectionHeader step={2} title="工作範例：中位數的 SE" />
          <p className="text-ink-dim leading-relaxed">
            樣本中位數 <M>{`\\hat M`}</M> 沒有漂亮的封閉式標準誤公式
            （它依賴未知的中位數處密度）。Bootstrap 三行解決：
          </p>
          <ProofStepper
            title="中位數的 bootstrap SE"
            steps={[
              { title: "抽 B = 1000 個 bootstrap 樣本。", math: "X^{*(b)} = (X_{i_1^{(b)}}, \\dots, X_{i_n^{(b)}}) \\text{ 有放回}" },
              { title: "計算每個樣本的中位數。", math: "\\hat M^{*(b)} = \\text{median}(X^{*(b)})" },
              { title: "對 b 取標準差。", math: "\\hat{\\text{SE}}_{\\text{boot}}(\\hat M) = \\text{sd}(\\hat M^{*(1)}, \\dots, \\hat M^{*(B)})" },
              { title: "完成。", reason: "不需要任何理論。同樣的食譜對修剪平均、四分位距、異質變異下的迴歸係數等等都管用。" },
            ]}
          />

          <TheoremCard
            kind="theorem"
            name="Bootstrap 一致性（Bickel–Freedman 1981）"
            statement={
              <>
                在對平滑統計泛函 <M>T</M> 的規則條件下，
                給定資料時{" "}
                <M>{`\\sqrt{n}(\\hat\\theta_n^* - \\hat\\theta_n)`}</M>{" "}
                的條件分布以機率收斂（弱拓撲下）到{" "}
                <M>{`\\sqrt{n}(\\hat\\theta_n - \\theta)`}</M> 的同一個常態極限。
              </>
            }
          >
            換言之：對於 i.i.d. 資料的平滑泛函，
            bootstrap 分布是真實抽樣分布的一致估計。
            不是魔法 ── 是有精確假設的精確定理。
          </TheoremCard>
        </>
      ),
      misconceptions: [
        {
          wrong: "Bootstrap 創造了新資料。",
          right:
            "並沒有。每個 bootstrap 樣本只是把原始觀察重新洗牌（有些重複、有些遺漏）。沒有任何新資訊進入系統；bootstrap 只是量化「在那種重新洗牌下，估計量會抖動多少」。",
        },
        {
          wrong: "Bootstrap 對任何估計量都管用。",
          right:
            "它對 max、min、極端分位數、動差無限的重尾分布、以及相依資料（除非用 block bootstrap）都失敗。知道「不該用 bootstrap」也是正確使用的一部分。",
        },
        {
          wrong: "Bootstrap 跟交叉驗證是同一回事。",
          right:
            "目標不同。Bootstrap 量化抽樣變異（SE、CI、偏誤）。交叉驗證估計樣本外預測誤差。它們共享「重抽樣」的精神，但服務不同的目的。",
        },
      ],
      takeaways: [
        "Bootstrap = 對你的樣本有放回地重抽樣、重新計算估計量、建直方圖、讀出 SE 和 CI。",
        "B = 1000 到 10000 次重抽樣通常綽綽有餘；成本是幾百毫秒。",
        "Percentile CI：bootstrap 分布的第 2.5 與第 97.5 百分位。",
        "由 Bickel–Freedman 證明：對平滑泛函，bootstrap 分布是真實抽樣分布的一致估計。",
        "對極值、重尾、非 i.i.d. 資料（沒做 block 適配）會失敗。",
      ],
      quiz: [
        {
          id: "q1",
          prompt:
            "一個大小為 n 的 bootstrap 樣本是怎麼抽出來的？",
          choices: [
            { id: "a", label: "從母體抽 n 個新觀察" },
            { id: "b", label: "從原樣本「無放回」抽 n 個值" },
            { id: "c", label: "從原樣本「有放回」抽 n 個值" },
            { id: "d", label: "從原樣本各半各抽 n/2" },
          ],
          answer: "c",
          explanation:
            "Bootstrap = 有放回地從原資料抽樣。整個概念就是這樣。",
        },
        {
          id: "q2",
          prompt:
            "95% percentile bootstrap CI 用 bootstrap 分布的哪兩個分位數？",
          choices: [
            { id: "a", label: "第 5 與第 95" },
            { id: "b", label: "第 2.5 與第 97.5" },
            { id: "c", label: "第 25 與第 75" },
            { id: "d", label: "最小值與最大值" },
          ],
          answer: "b",
          explanation:
            "雙尾 95% 區間 = 中央 95% 質量 = 兩尾各修剪 2.5%。",
        },
        {
          id: "q3",
          type: "numeric",
          prompt:
            "B = 5000 次重抽樣。bootstrap 平均的經驗標準差 = 0.42。x̄ 的 bootstrap 標準誤大約是？",
          answer: 0.42,
          tolerance: 0.01,
          hint: "Bootstrap SE 「就是」bootstrap 分布的標準差。",
          explanation: "依定義，SE_boot = sd(bootstrap 估計) ≈ 0.42。",
        },
        {
          id: "q4",
          type: "ordering",
          prompt: "把計算 bootstrap CI 的步驟重新排序。",
          steps: [
            { id: "s1", label: "從原樣本 X_1, ..., X_n 開始" },
            { id: "s2", label: "有放回地抽 n 個值，形成 X*^(b)" },
            { id: "s3", label: "計算 θ̂*^(b) = T(X*^(b))" },
            { id: "s4", label: "對 b = 1, ..., B 重複" },
            { id: "s5", label: "把 B 個 bootstrap 估計排序" },
            { id: "s6", label: "讀出 2.5% 與 97.5% 分位數作為 CI 端點" },
          ],
          explanation: "機械式：重抽 → 重算 → 重複 → 排序 → 讀百分位。",
        },
      ],
      furtherReading: [
        { title: "Efron — 'Bootstrap Methods: Another Look at the Jackknife' (1979)" },
        { title: "Efron & Tibshirani — An Introduction to the Bootstrap" },
        { title: "Davison & Hinkley — Bootstrap Methods and their Application" },
      ],
    },
  },
};

export default chapter;
