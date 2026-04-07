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
    title: "Conditional Probability & Bayes' Theorem",
    subtitle:
      "How new information rewires probabilities — the mechanism behind every inference machine.",
    hook: "From updating beliefs about a coin to interpreting medical tests, this is the engine of probabilistic reasoning.",
    minutes: 35,
    level: 3,
    tags: ["conditional", "bayes", "updating"],
  },
  content: {
    whyItMatters: (
      <>
        Almost every interesting probability question is conditional. <em>Given</em>{" "}
        a positive test, how likely is the disease? <em>Given</em> a customer
        clicked once, how likely are they to convert? <em>Given</em> the data
        we observed, what should we believe about the parameter? Bayes&apos;
        theorem is the universal &quot;belief updater&quot; — and once you can
        feel it geometrically, the whole edifice of statistics, machine
        learning, and probabilistic reasoning becomes one consistent story.
      </>
    ),

    intuition: (
      <>
        <p>
          Probability is a way of carving up <em>possibility</em>. The full
          sample space <M>{`\\Omega`}</M> is everything that could happen. A
          <em> conditional probability </em>
          <M>{`P(A\\mid B)`}</M> just means: <em>shrink the universe down to B,
          and ask how much of B is also A.</em>
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
          directions are not the same number, and confusing them is the most
          common probability error in the world.
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
          would divide by zero), and it underpins martingales, filtering, and
          modern stochastic analysis.
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
          statistic in Neyman–Pearson, the score in logistic regression, and
          the multiplicative weight in Bayesian sequential updating. They are
          all the same object.
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
          <M>{`P(-\\mid \\neg D)=0.95`}</M> (so the false positive rate is 5%).
          You test positive. What is <M>{`P(D\\mid +)`}</M>?
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
          observing <M>{`h`}</M> heads and <M>{`t`}</M> tails, the posterior is{" "}
          <M>{`\\text{Beta}(\\alpha_0+h,\\beta_0+t)`}</M>. (The Beta is the{" "}
          <em>conjugate prior</em> for the Bernoulli — a fact you should later
          re-derive yourself by writing out the proportionality.)
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
    ],

    furtherReading: [
      { title: "Casella & Berger — Statistical Inference, ch. 1" },
      { title: "Bertsekas & Tsitsiklis — Introduction to Probability, ch. 1" },
      { title: "Gelman et al. — Bayesian Data Analysis, ch. 1–2" },
    ],
  },
};

export default chapter;
