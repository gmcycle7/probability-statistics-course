# Probability & Statistics — Interactive Course

🌐 **Live site:** https://gmcycle7.github.io/probability-statistics-course/

A graduate-level course in probability and statistics, built around live
simulations, step-by-step derivations, and a three-layer teaching model:
**Intuition → Formalism → Graduate insight**.

Built with Next.js 14 (App Router), TypeScript, Tailwind, KaTeX, Recharts and
Zustand. Everything runs in the browser — no backend, no telemetry.

## Deployment

The site is exported as a fully static bundle (`output: 'export'`) and
deployed to GitHub Pages on every push to `main` via the workflow at
`.github/workflows/deploy.yml`. The base path
`/probability-statistics-course` is wired into `next.config.mjs` so all
internal links and asset URLs are correctly prefixed for the project-site
URL.

To preview the static export locally:

```bash
npm run build      # produces ./out
npx serve out      # or any static file server
```

`npm run dev` automatically uses no basePath, so local development works at
plain `http://localhost:3000/`. The basePath is only applied during
`next build`.

## Quick start

```bash
cd web
npm install
npm run dev
# open http://localhost:3000
```

To build a production bundle:

```bash
npm run build
npm start
```

All chapter routes are statically generated, so this will deploy as a fully
static site (Vercel, Netlify, GitHub Pages with `next export`, etc.).

## What's in here

### Pages

| Route | Purpose |
| --- | --- |
| `/` | Home: hero, pillars, featured chapters, eight-module overview |
| `/roadmap` | Full course map grouped by module, with progress badges and quiz scores |
| `/chapters/[slug]` | Chapter renderer (8 chapters in MVP, dynamic via the registry) |
| `/playground` | Sandbox: every interactive simulator on one page |
| `/quiz` | Quiz hub showing scores per chapter |
| `/notes` | Per-chapter note-taking + bookmarks (localStorage) |
| `/about` | Methodology, three-layer model, stack |

### Chapters in the MVP

1. **Conditional Probability & Bayes' Theorem** — `conditional-probability-and-bayes`
2. **Random Variables, Expectation & Variance** — `random-variables-expectation-variance`
3. **Common Probability Distributions** — `common-distributions`
4. **The Law of Large Numbers** — `law-of-large-numbers`
5. **The Central Limit Theorem** — `central-limit-theorem`
6. **Maximum Likelihood Estimation** — `maximum-likelihood-estimation`
7. **Confidence Intervals** — `confidence-intervals`
8. **Hypothesis Testing** — `hypothesis-testing`

Every chapter follows the same template:

1. Why this matters
2. Three-layer view (Intuition / Formalism / Graduate insight)
3. Visual + worked exploration with live simulators
4. Common misconceptions
5. Quick quiz (scored, persisted)
6. Key takeaways
7. Further reading

### Interactive simulators (10)

| Component | Used in chapter | What it shows |
| --- | --- | --- |
| `DistributionExplorer` | Distributions | Switch among 6 families and watch shapes morph |
| `ExpectationVarianceLab` | Random variables | Drag a discrete distribution and read off E[X], Var(X) |
| `ConditionalProbabilityGrid` | Bayes | A 2-event joint as a rectangle, with P(A∩B), P(B), P(A\|B) |
| `BayesUpdater` | Bayes | Beta prior + Bernoulli evidence → posterior in real time |
| `LLNSimulator` | LLN | Three running averages converging to p |
| `CLTSimulator` | CLT | Histogram of sample means against the limiting Normal |
| `MLEExplorer` | MLE | Log-likelihood curve with snapping to the MLE |
| `CISimulator` | Confidence intervals | 50–200 fresh CIs visualised with empirical coverage |
| `HypothesisTestVisualizer` | Hypothesis testing | α, β and power as a single picture |
| `RegressionPlayground` | (next module) | OLS fit with adjustable noise, slope, sample size |

## Project structure

```
web/
├── app/                            # Next.js App Router
│   ├── layout.tsx, page.tsx, globals.css
│   ├── roadmap/page.tsx
│   ├── chapters/[slug]/page.tsx + ChapterRenderer.tsx
│   ├── playground/page.tsx
│   ├── quiz/page.tsx
│   ├── notes/page.tsx
│   └── about/page.tsx
├── components/
│   ├── ui/                         # Card, Button, Slider, Tabs, Badge
│   ├── layout/                     # SiteHeader, SiteFooter
│   ├── math/                       # FormulaBlock, TheoremCard, ProofStepper, Math (KaTeX wrappers)
│   ├── learning/                   # ThreeLayerView, KeyTakeaways, MisconceptionBox, QuizCard, ChapterNavigator, SectionHeader
│   └── interactive/                # 10 simulators listed above
├── content/
│   ├── types.ts                    # Chapter / ChapterMeta / ModuleInfo types
│   ├── modules.ts                  # 8-module taxonomy
│   ├── registry.ts                 # Chapter registry + neighbour lookup
│   └── chapters/                   # 01..08 chapter content modules
├── lib/
│   ├── cn.ts                       # Tailwind classname merger
│   ├── math/                       # erf, gamma, random samplers (Box-Muller, mulberry32)
│   ├── stats/                      # PDFs/CDFs, summary stats, histogram
│   └── store/progress.ts           # Zustand + localStorage progress tracking
├── types/react-katex.d.ts          # ambient module typing for react-katex
├── next.config.mjs / tailwind.config.ts / postcss.config.mjs / tsconfig.json
└── README.md
```

## Adding a new chapter

1. Create a new file in `content/chapters/`, e.g. `09-bootstrap.tsx`. Copy
   the structure from any existing chapter — every chapter exports a
   default `Chapter` object with `meta` and `content`.
2. Register it in `content/registry.ts`:

   ```ts
   import ch9 from "./chapters/09-bootstrap";
   export const CHAPTERS: Chapter[] = [ch1, ..., ch8, ch9];
   ```

3. Optionally add a brand-new interactive component under
   `components/interactive/` and import it from your chapter content.
4. Done. The new chapter automatically appears on the home page, in the
   roadmap, in the quiz hub, in the notes page, and as a static route at
   `/chapters/<slug>`.

The project intentionally uses **TypeScript modules instead of MDX** for
chapter content, because chapters need to embed React components (like the
interactive simulators) freely and benefit from full type-checking on every
quiz answer, theorem, and formula.

## Adding a new interactive simulator

1. Drop a new component into `components/interactive/`.
2. Use the existing simulators as templates — they all share the same
   layout pattern: chart on the left, sliders + summary on the right.
3. Pull math/stats helpers from `lib/stats/distributions.ts` and
   `lib/math/random.ts`. Both files are pure, dependency-free, and well
   documented.
4. Import the component anywhere — inside a chapter (`content/chapters/...`)
   or in the playground (`app/playground/page.tsx`).

## How progress works

All progress (chapters completed, quiz scores, bookmarks, notes) lives in
`localStorage` via a small Zustand store at `lib/store/progress.ts`. There
is no account, no server, no sync. Reset everything from the Notes page if
you want a clean slate.

## Design choices, briefly

- **Three layers per topic.** Each chapter exposes the same idea at three
  levels of formality. This is the single biggest learning lever in the
  app.
- **Picture before formula.** Every chapter opens with intuition and a
  manipulable picture before any equations.
- **Stepwise derivations.** Long derivations live inside `ProofStepper`, so
  you can advance one move at a time and read each step's reasoning.
- **No memorisation.** Every distribution gets a "story". Every formula
  gets a "what does this answer?" caption. Every theorem gets a sketch.
- **Misconceptions are first-class.** Each chapter explicitly contrasts the
  myth with the truth — because the wrong intuitions are the ones that
  actually need to be uprooted.

## Roadmap

The MVP covers Modules A–F at chapter granularity. Modules G (regression,
already has a working interactive) and H (Bayesian, MCMC, PCA, EM, KL) have
their playground simulators built but the chapter pages are stubs in the
roadmap waiting to be filled in. Adding them is just dropping new files
into `content/chapters/`.
