import { Chapter } from "../types";
import { M } from "@/components/math/Math";
import { FormulaBlock } from "@/components/math/FormulaBlock";
import { TheoremCard } from "@/components/math/TheoremCard";
import { ProofStepper } from "@/components/math/ProofStepper";
import { PCAVisualizer } from "@/components/interactive/PCAVisualizer";
import { SectionHeader } from "@/components/learning/SectionHeader";

const chapter: Chapter = {
  meta: {
    slug: "principal-component-analysis",
    module: "H_advanced",
    number: 16,
    minutes: 40,
    level: 4,
    prereqs: ["joint-distributions-and-covariance"],
    tags: ["PCA", "eigendecomposition", "dimensionality reduction"],
  },
  localized: {
    en: {
      title: "Principal Component Analysis",
      subtitle:
        "PCA is the eigendecomposition of the covariance matrix, dressed up in geometric clothing. Once you see that, every PCA mystery dissolves.",
      hook: "Why finding 'the direction of maximum variance' becomes 'find the largest eigenvector of Σ' — and why that's two ways of saying the same thing.",
      whyItMatters: (
        <>
          PCA is the most-used dimensionality reduction technique on Earth.
          It compresses high-dimensional data into a few axes that capture
          most of the variation, lets you visualise clusters and patterns,
          decorrelates features for downstream models, and provides the
          mathematical backbone of factor analysis, latent semantic analysis,
          and the &quot;denoising&quot; step in many ML pipelines. The
          machinery is just one linear algebra fact applied carefully.
        </>
      ),
      intuition: (
        <>
          <p>
            You have a cloud of points in <M>{`\\mathbb{R}^p`}</M>. Most of
            the action — the variation, the structure — usually lives in a
            small number of directions. PCA asks:{" "}
            <em>which direction has the most variance? After projecting away
            from it, which direction has the second-most? And so on?</em>
          </p>
          <p>
            For 2D data, you can almost always see this with your eyes: the
            elongated ellipse of the point cloud has a long axis and a short
            axis. The long axis is PC1; the short axis is PC2; and they are
            perpendicular.
          </p>
          <p>
            The miracle is that this geometric intuition has a one-line
            algebraic answer: the principal components are the eigenvectors
            of the covariance matrix, sorted by eigenvalue. The eigenvalues
            <em> are</em> the variances along those directions. There is
            nothing else going on.
          </p>
        </>
      ),
      formal: (
        <>
          <p>
            Let <M>{`X \\in \\mathbb{R}^{n \\times p}`}</M> be a centred data
            matrix (each column has mean 0). The sample covariance is
          </p>
          <FormulaBlock
            formula={`\\hat\\Sigma = \\frac{1}{n} X^T X \\in \\mathbb{R}^{p \\times p}.`}
          />
          <p>
            PCA finds the unit vector <M>{`u \\in \\mathbb{R}^p`}</M>{" "}
            maximising the variance of the projection{" "}
            <M>{`u^T x`}</M>:
          </p>
          <FormulaBlock
            formula={`u_1 = \\arg\\max_{\\|u\\|=1} \\text{Var}(u^T X) = \\arg\\max_{\\|u\\|=1} u^T \\hat\\Sigma\\, u.`}
            question="Which direction has the most variance?"
          />
          <p>
            The Lagrangian solution: <M>{`u_1`}</M> is the eigenvector of{" "}
            <M>{`\\hat\\Sigma`}</M> corresponding to the largest eigenvalue{" "}
            <M>{`\\lambda_1`}</M>, and <M>{`\\lambda_1`}</M>{" "}
            <em>is</em> the variance of the projection. <M>{`u_2`}</M> is
            the eigenvector for the second-largest eigenvalue, and is
            automatically orthogonal to <M>{`u_1`}</M>. Continuing gives an
            orthonormal basis <M>{`u_1, u_2, \\dots, u_p`}</M> with{" "}
            <M>{`\\lambda_1 \\ge \\lambda_2 \\ge \\dots \\ge \\lambda_p \\ge 0`}</M>.
          </p>
          <p>
            The fraction of total variance explained by the first <M>k</M>{" "}
            components is
          </p>
          <FormulaBlock
            formula={`\\frac{\\lambda_1 + \\lambda_2 + \\dots + \\lambda_k}{\\lambda_1 + \\lambda_2 + \\dots + \\lambda_p}.`}
          />
          <p>
            Equivalently — and computationally more stable — PCA is the SVD
            of <M>{`X = U \\Sigma V^T`}</M>: the columns of <M>V</M> are the
            principal components and{" "}
            <M>{`\\hat\\Sigma = V (\\Sigma^T \\Sigma / n) V^T`}</M> diagonalises
            the sample covariance.
          </p>
        </>
      ),
      graduate: (
        <>
          <p>
            <strong>The Lagrangian derivation in three lines.</strong>{" "}
            Maximising <M>{`u^T \\hat\\Sigma u`}</M> subject to{" "}
            <M>{`u^T u = 1`}</M> gives the Lagrangian{" "}
            <M>{`L = u^T \\hat\\Sigma u - \\lambda(u^T u - 1)`}</M>. Setting{" "}
            <M>{`\\nabla_u L = 0`}</M> yields{" "}
            <M>{`\\hat\\Sigma u = \\lambda u`}</M> — exactly the eigenvalue
            equation. Among all eigenvectors, the optimum is the one with
            the largest <M>λ</M>, and that <M>λ</M> equals the maximised
            variance. Three lines, no magic.
          </p>
          <p>
            <strong>PCA = best rank-k approximation.</strong> A second
            characterisation: among all rank-<M>k</M> approximations to{" "}
            <M>X</M> in Frobenius norm, the best is the truncated SVD{" "}
            <M>{`\\tilde X_k = U_k \\Sigma_k V_k^T`}</M>. (Eckart–Young.) PCA
            is therefore the unique optimal linear compression in the
            least-squares sense — which is why it&apos;s the workhorse of
            data compression and denoising.
          </p>
          <p>
            <strong>Centering matters; scaling matters more.</strong> PCA is
            done on the covariance matrix of centred data. If features have
            different units (kg vs km), the larger-scale feature dominates
            the variance and PCA tells you only about that one feature. The
            standard fix is to standardise (subtract mean, divide by sd)
            before PCA — this is equivalent to PCA on the correlation
            matrix instead of the covariance matrix. Forgetting to scale
            is the most common PCA mistake in practice.
          </p>
          <p>
            <strong>What PCA is NOT.</strong> PCA is unsupervised: it knows
            nothing about labels or downstream tasks. The first PC may not
            be the most useful direction for classification — that&apos;s
            what LDA, logistic regression, and supervised projections are
            for. PCA is also linear; if your data lie on a curved manifold,
            PCA will fold them flat and lose the structure. Use kernel PCA,
            UMAP, or t-SNE for nonlinear cases.
          </p>
          <p>
            <strong>Connection to Mahalanobis distance.</strong> If you
            project data onto its principal axes and divide each coordinate
            by <M>{`\\sqrt{\\lambda_i}`}</M>, the resulting representation
            is the &quot;whitened&quot; version where Euclidean distance
            equals Mahalanobis distance{" "}
            <M>{`d_M(x, y) = \\sqrt{(x-y)^T \\hat\\Sigma^{-1} (x-y)}`}</M>.
            This is the data-aware metric used in QDA, anomaly detection,
            and Gaussian classification.
          </p>
        </>
      ),
      body: (
        <>
          <SectionHeader step={1} title="See PCA happen on a 2D cloud" blurb="Slide ρ. Watch how PC1 (amber) snaps to whatever direction has the most variance, and PC2 (violet) is always exactly perpendicular to it." />
          <PCAVisualizer />

          <SectionHeader step={2} title="Derivation: the first principal component" />
          <ProofStepper
            title="u₁ = top eigenvector of Σ̂"
            steps={[
              { title: "State the optimisation.", math: "\\max_{\\|u\\| = 1} u^T \\hat\\Sigma u" },
              { title: "Form the Lagrangian.", math: "L(u, \\lambda) = u^T \\hat\\Sigma u - \\lambda(u^T u - 1)" },
              { title: "Set the gradient to zero.", math: "\\nabla_u L = 2 \\hat\\Sigma u - 2 \\lambda u = 0" },
              { title: "Recognise the eigenvalue equation.", math: "\\hat\\Sigma u = \\lambda u", reason: "Critical points of the constrained problem are exactly eigenvectors of Σ̂." },
              { title: "Plug back to evaluate.", math: "u^T \\hat\\Sigma u = \\lambda u^T u = \\lambda", reason: "The objective at an eigenvector simply equals the eigenvalue." },
              { title: "Take the maximum.", reason: "Among all eigenvectors, the optimum corresponds to the largest eigenvalue λ₁. Subsequent PCs are obtained by maximising over directions orthogonal to the previous ones — and the answer is just the next eigenvector." },
            ]}
          />

          <TheoremCard
            kind="theorem"
            name="Spectral characterisation of PCA"
            statement={
              <>
                For a centred sample covariance{" "}
                <M>{`\\hat\\Sigma`}</M> with eigenvalues{" "}
                <M>{`\\lambda_1 \\ge \\dots \\ge \\lambda_p \\ge 0`}</M> and
                orthonormal eigenvectors <M>{`u_1, \\dots, u_p`}</M>:
              </>
            }
            formula={`\\hat\\Sigma = \\sum_{i=1}^p \\lambda_i u_i u_i^T, \\quad \\text{Var}(u_i^T X) = \\lambda_i.`}
          >
            The principal components are the eigenvectors; the variances
            along each PC are the eigenvalues. Truncating to the first{" "}
            <M>k</M> gives the best rank-<M>k</M> linear approximation by
            Eckart–Young.
          </TheoremCard>

          <SectionHeader step={3} title="Worked example: a tilted bivariate Normal" />
          <p className="text-ink-dim leading-relaxed">
            Let{" "}
            <M>{`X \\sim \\mathcal{N}(0, \\hat\\Sigma)`}</M> with{" "}
            <M>{`\\hat\\Sigma = \\begin{pmatrix} 4 & 2 \\\\ 2 & 1 \\end{pmatrix}`}</M>.
            Eigenvalues are roots of{" "}
            <M>{`(4 - \\lambda)(1 - \\lambda) - 4 = 0`}</M>, i.e.{" "}
            <M>{`\\lambda^2 - 5\\lambda = 0`}</M>, giving{" "}
            <M>{`\\lambda_1 = 5,\\ \\lambda_2 = 0`}</M>. So PC1 explains{" "}
            <M>{`100\\%`}</M> of the variance — the data lie on a line. The
            corresponding eigenvector is{" "}
            <M>{`u_1 \\propto (2, 1)^T`}</M> (the slope-1/2 direction). PCA
            has correctly discovered that the data are 1-dimensional even
            though they live in 2D.
          </p>
        </>
      ),
      misconceptions: [
        {
          wrong: "PCA reduces dimensionality without loss of information.",
          right:
            "It loses information by definition — you discard the components with smaller variance. The hope is that those discarded directions are 'noise'. They sometimes aren't.",
        },
        {
          wrong: "The first PC is the most useful direction for any task.",
          right:
            "The first PC is the direction of maximum VARIANCE, not the direction most useful for classification or prediction. Unsupervised PCA can throw away the very signal you care about. Use LDA or supervised methods when labels are available.",
        },
        {
          wrong: "You don't need to scale features before PCA.",
          right:
            "If features have different units, the high-variance feature will dominate. Always standardise first (or use the correlation matrix instead of the covariance matrix).",
        },
        {
          wrong: "PCA assumes the data are Gaussian.",
          right:
            "PCA itself is just an eigendecomposition — no Gaussianity needed. It's optimal in the least-squares sense for any data. The connection to Gaussian distributions arises only when you want to interpret PCs as a probabilistic model (e.g. probabilistic PCA, factor analysis).",
        },
      ],
      takeaways: [
        "PCA = eigendecomposition of the (sample) covariance matrix.",
        "Principal components are unit vectors maximising variance, and they end up being eigenvectors of Σ.",
        "Eigenvalues are exactly the variances along the corresponding PCs.",
        "The truncated SVD is the best rank-k linear approximation in Frobenius norm (Eckart–Young).",
        "Always centre, and almost always scale, your data before PCA.",
        "PCA is unsupervised and linear — when those assumptions break, switch to LDA, kernel PCA, or t-SNE/UMAP.",
      ],
      quiz: [
        {
          id: "q1",
          prompt:
            "PCA finds directions that maximise...",
          choices: [
            { id: "a", label: "Class separation" },
            { id: "b", label: "Variance of the projected data" },
            { id: "c", label: "Mutual information with the labels" },
            { id: "d", label: "L1 norm" },
          ],
          answer: "b",
          explanation:
            "PCA is the unsupervised maximisation of projected variance. It does not use labels, which is why LDA can outperform it for classification tasks.",
        },
        {
          id: "q2",
          prompt:
            "If Σ̂ has eigenvalues 6, 3, 1, the fraction of variance explained by the first two PCs is...",
          choices: [
            { id: "a", label: "60%" },
            { id: "b", label: "75%" },
            { id: "c", label: "90%" },
            { id: "d", label: "100%" },
          ],
          answer: "c",
          explanation:
            "(6 + 3) / (6 + 3 + 1) = 9/10 = 90%. The third component explains the remaining 10%.",
        },
        {
          id: "q3",
          prompt:
            "Which is NOT a reason to standardise data before PCA?",
          choices: [
            { id: "a", label: "Features have different units (kg vs km)" },
            { id: "b", label: "You want to use the correlation matrix instead of the covariance matrix" },
            { id: "c", label: "You want PCA to be invariant to feature scaling" },
            { id: "d", label: "PCA requires Gaussian data" },
          ],
          answer: "d",
          explanation:
            "PCA does not require Gaussianity. The other three are all reasons standardisation matters in practice.",
        },
      ],
      furtherReading: [
        { title: "Hastie, Tibshirani & Friedman — Elements of Statistical Learning, ch. 14" },
        { title: "Jolliffe — Principal Component Analysis" },
        { title: "Bishop — Pattern Recognition and Machine Learning, ch. 12" },
      ],
    },

    zh: {
      title: "主成分分析（PCA）",
      subtitle:
        "PCA 就是「共變異矩陣的特徵分解」，只是穿了一套幾何服裝。一旦你看穿這點，所有的 PCA 神秘感都會消失。",
      hook: "為什麼「找最大變異方向」會變成「找 Σ 的最大特徵向量」── 它們其實是同一件事的兩種說法。",
      whyItMatters: (
        <>
          PCA 是地球上最常用的降維技術。
          它把高維資料壓縮成幾個能抓住大部分變化的軸，
          讓你能視覺化群集與模式、
          替下游模型把特徵去相關，
          並提供 factor analysis、latent semantic analysis、
          以及許多 ML 流程裡「去雜訊」步驟的數學骨幹。
          整套機器其實只是「一個線性代數事實」被仔細地套用而已。
        </>
      ),
      intuition: (
        <>
          <p>
            你有一團 <M>{`\\mathbb{R}^p`}</M> 裡的點。
            大部分的「動作」── 變化、結構 ──
            通常活在一小撮方向上。
            PCA 問的是：
            <em>哪一個方向變異最大？把它投影掉之後，
            剩下的哪一個方向變異第二大？以此類推。</em>
          </p>
          <p>
            對 2D 資料，你幾乎可以用眼睛看出來：
            點雲拉長成的橢圓有一條長軸與一條短軸。
            長軸就是 PC1，短軸就是 PC2，而且它們互相垂直。
          </p>
          <p>
            奇蹟是這個幾何直覺有一行的代數答案：
            主成分就是「共變異矩陣的特徵向量，
            按特徵值大小排序」。
            而特徵值<em>就是</em>那個方向上的變異數。
            就這樣，沒有別的東西。
          </p>
        </>
      ),
      formal: (
        <>
          <p>
            設 <M>{`X \\in \\mathbb{R}^{n \\times p}`}</M> 為已中心化的資料矩陣
            （每一行平均為 0）。樣本共變異為：
          </p>
          <FormulaBlock
            formula={`\\hat\\Sigma = \\frac{1}{n} X^T X \\in \\mathbb{R}^{p \\times p}.`}
          />
          <p>
            PCA 找的是讓投影 <M>{`u^T x`}</M> 變異數最大的單位向量{" "}
            <M>{`u \\in \\mathbb{R}^p`}</M>：
          </p>
          <FormulaBlock
            formula={`u_1 = \\arg\\max_{\\|u\\|=1} \\text{Var}(u^T X) = \\arg\\max_{\\|u\\|=1} u^T \\hat\\Sigma\\, u.`}
            question="哪個方向變異最大？"
          />
          <p>
            Lagrangian 解：<M>{`u_1`}</M> 是 <M>{`\\hat\\Sigma`}</M>{" "}
            對應於最大特徵值 <M>{`\\lambda_1`}</M> 的特徵向量，
            而 <M>{`\\lambda_1`}</M> <em>就是</em>該投影的變異數。
            <M>{`u_2`}</M> 是第二大特徵值對應的特徵向量，
            並自動與 <M>{`u_1`}</M> 正交。
            繼續下去就得到一組正交基{" "}
            <M>{`u_1, u_2, \\dots, u_p`}</M>，
            滿足 <M>{`\\lambda_1 \\ge \\lambda_2 \\ge \\dots \\ge \\lambda_p \\ge 0`}</M>。
          </p>
          <p>前 <M>k</M> 個成分解釋的總變異比例為：</p>
          <FormulaBlock
            formula={`\\frac{\\lambda_1 + \\lambda_2 + \\dots + \\lambda_k}{\\lambda_1 + \\lambda_2 + \\dots + \\lambda_p}.`}
          />
          <p>
            等價地（且在計算上更穩定），
            PCA 就是 <M>X = U \Sigma V^T</M> 的 SVD：
            <M>V</M> 的各行就是主成分，
            而 <M>{`\\hat\\Sigma = V (\\Sigma^T \\Sigma / n) V^T`}</M>{" "}
            正好對角化了樣本共變異矩陣。
          </p>
        </>
      ),
      graduate: (
        <>
          <p>
            <strong>三行的 Lagrangian 推導。</strong>
            最大化 <M>{`u^T \\hat\\Sigma u`}</M> 在約束 <M>{`u^T u = 1`}</M>{" "}
            下，得到 Lagrangian{" "}
            <M>{`L = u^T \\hat\\Sigma u - \\lambda(u^T u - 1)`}</M>。
            令 <M>{`\\nabla_u L = 0`}</M>，得到{" "}
            <M>{`\\hat\\Sigma u = \\lambda u`}</M> ── 正是特徵值方程式。
            在所有特徵向量中，最佳解對應到最大的 <M>λ</M>，
            而那個 <M>λ</M> 等於最大化後的變異數。三行，沒有魔法。
          </p>
          <p>
            <strong>PCA = 最佳的 rank-k 近似。</strong>
            另一個刻畫：在所有對 <M>X</M> 的 rank-<M>k</M> 近似中，
            就 Frobenius 範數而言最好的是截斷 SVD{" "}
            <M>{`\\tilde X_k = U_k \\Sigma_k V_k^T`}</M>（Eckart–Young 定理）。
            因此 PCA 是最小平方意義下「唯一的最佳線性壓縮」──
            這就是它成為資料壓縮與去雜訊主力的原因。
          </p>
          <p>
            <strong>中心化重要，標準化更重要。</strong>
            PCA 是在「中心化資料」的共變異矩陣上做的。
            如果特徵的單位不同（公斤 vs 公里），
            尺度大的特徵會主宰變異，
            PCA 就只會告訴你那一個特徵的事。
            標準的修正是先標準化（減平均、除以標準差）──
            這等價於對「相關矩陣」做 PCA 而不是共變異矩陣。
            忘記做標準化是實務上最常見的 PCA 錯誤。
          </p>
          <p>
            <strong>PCA「不」是什麼。</strong>
            PCA 是無監督的：它對標籤或下游任務一無所知。
            第一主成分可能不是分類最有用的方向 ──
            那就是 LDA、logistic 迴歸、與監督式投影存在的原因。
            PCA 也是線性的；
            如果你的資料活在一個彎曲的流形上，
            PCA 會把它折平、丟失結構。
            非線性情境要用 kernel PCA、UMAP、或 t-SNE。
          </p>
          <p>
            <strong>與 Mahalanobis 距離的連結。</strong>
            如果你把資料投影到主軸上，並把每個座標除以{" "}
            <M>{`\\sqrt{\\lambda_i}`}</M>，
            得到的表示就是「白化（whitened）」的版本，
            其中歐氏距離等於 Mahalanobis 距離{" "}
            <M>{`d_M(x, y) = \\sqrt{(x-y)^T \\hat\\Sigma^{-1} (x-y)}`}</M>。
            這是 QDA、異常檢測、與高斯分類所用的「資料感知」度量。
          </p>
        </>
      ),
      body: (
        <>
          <SectionHeader step={1} title="親眼看 PCA 在 2D 點雲上發生" blurb="拖動 ρ。看 PC1（琥珀）如何瞬間鎖定變異最大的方向，而 PC2（紫）永遠精確地與它垂直。" />
          <PCAVisualizer />

          <SectionHeader step={2} title="推導：第一主成分" />
          <ProofStepper
            title="u₁ = Σ̂ 的最大特徵向量"
            steps={[
              { title: "寫出最佳化問題。", math: "\\max_{\\|u\\| = 1} u^T \\hat\\Sigma u" },
              { title: "建構 Lagrangian。", math: "L(u, \\lambda) = u^T \\hat\\Sigma u - \\lambda(u^T u - 1)" },
              { title: "把梯度設為零。", math: "\\nabla_u L = 2 \\hat\\Sigma u - 2 \\lambda u = 0" },
              { title: "辨認特徵值方程式。", math: "\\hat\\Sigma u = \\lambda u", reason: "受約束最佳化問題的臨界點，正好就是 Σ̂ 的特徵向量。" },
              { title: "代回去求值。", math: "u^T \\hat\\Sigma u = \\lambda u^T u = \\lambda", reason: "在特徵向量上，目標函數的值就直接等於對應的特徵值。" },
              { title: "取最大者。", reason: "在所有特徵向量中，最佳解對應於最大特徵值 λ₁。後續主成分由「在與前面正交的方向上做最大化」得到 ── 答案就是下一個特徵向量。" },
            ]}
          />

          <TheoremCard
            kind="theorem"
            name="PCA 的譜刻畫"
            statement={
              <>
                對中心化的樣本共變異 <M>{`\\hat\\Sigma`}</M>，
                特徵值為 <M>{`\\lambda_1 \\ge \\dots \\ge \\lambda_p \\ge 0`}</M>，
                正交特徵向量為 <M>{`u_1, \\dots, u_p`}</M>：
              </>
            }
            formula={`\\hat\\Sigma = \\sum_{i=1}^p \\lambda_i u_i u_i^T, \\quad \\text{Var}(u_i^T X) = \\lambda_i.`}
          >
            主成分就是特徵向量；
            每個 PC 上的變異就是特徵值。
            截斷到前 <M>k</M> 個就得到「最佳的 rank-<M>k</M> 線性近似」（Eckart–Young）。
          </TheoremCard>

          <SectionHeader step={3} title="工作範例：傾斜的雙變量常態" />
          <p className="text-ink-dim leading-relaxed">
            設 <M>{`X \\sim \\mathcal{N}(0, \\hat\\Sigma)`}</M>，
            其中 <M>{`\\hat\\Sigma = \\begin{pmatrix} 4 & 2 \\\\ 2 & 1 \\end{pmatrix}`}</M>。
            特徵值是 <M>{`(4 - \\lambda)(1 - \\lambda) - 4 = 0`}</M> 的根，
            也就是 <M>{`\\lambda^2 - 5\\lambda = 0`}</M>，
            得到 <M>{`\\lambda_1 = 5,\\ \\lambda_2 = 0`}</M>。
            所以 PC1 解釋了 <M>{`100\\%`}</M> 的變異 ── 資料躺在一條線上。
            對應的特徵向量是 <M>{`u_1 \\propto (2, 1)^T`}</M>（斜率 1/2 的方向）。
            PCA 正確地發現：雖然資料活在 2D，它其實是 1 維的。
          </p>
        </>
      ),
      misconceptions: [
        {
          wrong: "PCA 不會損失任何資訊地降維。",
          right:
            "依定義它一定會損失資訊 ── 你丟掉了變異較小的成分。希望那些被丟掉的方向是「雜訊」。有時候它們不是。",
        },
        {
          wrong: "第一主成分對任何任務都是最有用的方向。",
          right:
            "第一主成分是「變異最大」的方向，不是「對分類或預測最有用」的方向。無監督的 PCA 可能會丟掉你最在乎的訊號。有標籤時要用 LDA 或監督式方法。",
        },
        {
          wrong: "PCA 之前不需要做特徵縮放。",
          right:
            "如果特徵的單位不同，變異大的那個會主宰一切。永遠先標準化（或對相關矩陣做 PCA 而不是共變異矩陣）。",
        },
        {
          wrong: "PCA 假設資料服從常態。",
          right:
            "PCA 本身只是一個特徵分解 ── 不需要常態性。它在最小平方意義下對任何資料都是最佳的。與常態的連結，只在你想把 PC 詮釋成「機率模型」（例如 probabilistic PCA、factor analysis）時才出現。",
        },
      ],
      takeaways: [
        "PCA = （樣本）共變異矩陣的特徵分解。",
        "主成分是「最大化變異的單位向量」，而它們最後都是 Σ 的特徵向量。",
        "特徵值正好就是對應 PC 上的變異數。",
        "截斷 SVD 是 Frobenius 範數下的最佳 rank-k 線性近似（Eckart–Young）。",
        "PCA 之前永遠要中心化、幾乎永遠也要標準化。",
        "PCA 是無監督的、也是線性的 ── 當這些假設破掉時，改用 LDA、kernel PCA、或 t-SNE / UMAP。",
      ],
      quiz: [
        {
          id: "q1",
          prompt: "PCA 找的是最大化什麼的方向？",
          choices: [
            { id: "a", label: "類別分離度" },
            { id: "b", label: "投影後資料的變異數" },
            { id: "c", label: "與標籤的互資訊" },
            { id: "d", label: "L1 範數" },
          ],
          answer: "b",
          explanation:
            "PCA 是無監督的「投影變異最大化」。它不使用標籤 ── 這也是為什麼 LDA 在分類任務上可能更好。",
        },
        {
          id: "q2",
          prompt:
            "若 Σ̂ 的特徵值為 6、3、1，前兩個 PC 解釋的變異比例為？",
          choices: [
            { id: "a", label: "60%" },
            { id: "b", label: "75%" },
            { id: "c", label: "90%" },
            { id: "d", label: "100%" },
          ],
          answer: "c",
          explanation:
            "(6 + 3) / (6 + 3 + 1) = 9/10 = 90%。第三個成分解釋剩下的 10%。",
        },
        {
          id: "q3",
          prompt:
            "下列哪一個「不是」PCA 之前要標準化的理由？",
          choices: [
            { id: "a", label: "特徵的單位不同（公斤 vs 公里）" },
            { id: "b", label: "你想用相關矩陣而不是共變異矩陣" },
            { id: "c", label: "你想讓 PCA 對特徵縮放不敏感" },
            { id: "d", label: "PCA 要求資料是常態的" },
          ],
          answer: "d",
          explanation:
            "PCA 不要求常態性。其他三個都是實務上「為什麼要標準化」的合理理由。",
        },
      ],
      furtherReading: [
        { title: "Hastie, Tibshirani & Friedman — Elements of Statistical Learning, ch. 14" },
        { title: "Jolliffe — Principal Component Analysis" },
        { title: "Bishop — Pattern Recognition and Machine Learning, ch. 12" },
      ],
    },
  },
};

export default chapter;
