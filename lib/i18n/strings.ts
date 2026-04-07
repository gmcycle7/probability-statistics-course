import type { Locale } from "./locale";

/**
 * Dictionary of all non-chapter UI strings. Each key has both `zh` and `en`
 * forms; missing keys fall back to English so partial translations don't crash.
 */
export const STRINGS = {
  // Navigation
  "nav.home": { zh: "首頁", en: "Home" },
  "nav.roadmap": { zh: "課程地圖", en: "Roadmap" },
  "nav.playground": { zh: "互動練習場", en: "Playground" },
  "nav.quiz": { zh: "測驗中心", en: "Quiz" },
  "nav.notes": { zh: "筆記", en: "Notes" },
  "nav.about": { zh: "關於", en: "About" },
  "brand.tagline": { zh: "互動式課程", en: "interactive course" },
  "footer.tagline": {
    zh: "為自學者而設計。每個主題三層：直覺 → 形式定義 → 研究所層級洞見。",
    en: "Built for self-learners. Three layers per topic: Intuition → Formalism → Graduate insight.",
  },
  "footer.copy": {
    zh: "© 機率與統計 — 互動式課程",
    en: "© Probability & Statistics — Interactive Course",
  },

  // Home
  "home.badge": {
    zh: "互動式 · 研究所程度 · 自由進度",
    en: "Interactive · Graduate-level · Self-paced",
  },
  "home.title.before": { zh: "機率與統計，", en: "Probability & Statistics, " },
  "home.title.gradient": {
    zh: "在玩中學會。",
    en: "learned by playing with it.",
  },
  "home.subtitle": {
    zh: "這是一套完整的研究所程度課程，每個主題用三層教學法──直覺、形式定義、研究所層級洞見──搭配可即時操作的模擬器、可一步步展開的推導，以及會替你計分的小測驗。",
    en: "A complete graduate-level course built around three layers per topic — intuition, formal definitions, and graduate-level insight — with live simulations, derivations you can step through, and quizzes that actually score you.",
  },
  "home.cta.start": { zh: "從第一章開始", en: "Start with Chapter 1" },
  "home.cta.roadmap": { zh: "查看完整課程地圖", en: "View the full roadmap" },
  "home.cta.playground": { zh: "打開互動練習場", en: "Open the playground" },
  "home.pillar.intuition.title": { zh: "直覺優先", en: "Intuition first" },
  "home.pillar.intuition.text": {
    zh: "每個概念都從一張可操作的圖開始，而不是定義。",
    en: "Every concept starts with a picture you can manipulate, not a definition.",
  },
  "home.pillar.formal.title": { zh: "嚴謹的數學", en: "Formal mathematics" },
  "home.pillar.formal.text": {
    zh: "用 KaTeX 排版的定義、定理與一步步推導。",
    en: "Definitions, theorems, and step-by-step derivations rendered in KaTeX.",
  },
  "home.pillar.sim.title": { zh: "即時模擬", en: "Live simulations" },
  "home.pillar.sim.text": {
    zh: "在瀏覽器內看大數法則、中央極限定理、貝氏更新與信賴區間實際運作。",
    en: "See LLN, CLT, Bayes updates and confidence intervals run in your browser.",
  },
  "home.pillar.grad.title": { zh: "研究所層級洞見", en: "Graduate insight" },
  "home.pillar.grad.text": {
    zh: "每章結尾都會給技術細節、常見誤用，以及與其他主題的連結。",
    en: "Each chapter ends with the technical details, common misuses, and connections.",
  },
  "home.featured": { zh: "從這裡開始", en: "Start here" },
  "home.allChapters": { zh: "所有章節", en: "All chapters" },
  "home.modules": { zh: "八大模組", en: "The eight modules" },
  "home.minutes": { zh: "分鐘", en: "min" },
  "home.level": { zh: "難度", en: "level" },

  // Roadmap
  "roadmap.eyebrow": { zh: "課程地圖", en: "Course roadmap" },
  "roadmap.title": {
    zh: "從樣本空間到研究所層級的統計推論",
    en: "From sample spaces to graduate-level inference",
  },
  "roadmap.intro": {
    zh: "整個課程分成八個模組。每章可獨立閱讀，遵循同一個「直覺 → 形式 → 研究所層級洞見」的結構，並附上即時模擬器與小測驗。下方數字反映你的章節完成度與測驗成績。",
    en: "The course is organised into eight modules. Each chapter is self-contained and follows the same intuition → formalism → graduate insight structure, with live simulations and a quiz at the end. Numbers below show your progress on chapters and quizzes.",
  },
  "roadmap.module": { zh: "模組", en: "Module" },
  "roadmap.empty": {
    zh: "本模組的章節尚未上線。在 content/chapters/ 內新增檔案並到 content/registry.ts 註冊即可。",
    en: "Chapters in this module are coming soon. Add them by dropping a new file into content/chapters/ and registering it in content/registry.ts.",
  },
  "roadmap.quizScore": { zh: "測驗成績", en: "quiz score" },

  // Chapter renderer (section labels)
  "chapter.badge": { zh: "第", en: "Chapter " },
  "chapter.badgeSuffix": { zh: " 章", en: "" },
  "chapter.minRead": { zh: "分鐘閱讀", en: "min read" },
  "chapter.markComplete": { zh: "標記為完成", en: "Mark complete" },
  "chapter.markedComplete": { zh: "已完成", en: "Marked complete" },
  "chapter.bookmark": { zh: "加入書籤", en: "Bookmark" },
  "chapter.bookmarked": { zh: "已加入書籤", en: "Bookmarked" },
  "chapter.section.why": { zh: "為什麼要學這個", en: "Why this matters" },
  "chapter.section.layers": { zh: "三層視角", en: "Three layers" },
  "chapter.section.layers.blurb": {
    zh: "依自己的節奏，從直覺一路走到研究所層級洞見。",
    en: "Move through Intuition → Formalism → Graduate insight at your own pace.",
  },
  "chapter.section.body": { zh: "視覺與例題探索", en: "Visual & worked exploration" },
  "chapter.section.body.blurb": {
    zh: "即時模擬、可逐步展開的推導，以及完整工作範例。",
    en: "Live simulations, derivations you can step through, and worked examples.",
  },
  "chapter.section.misconceptions": { zh: "常見誤解", en: "Common misconceptions" },
  "chapter.section.quiz": { zh: "小測驗", en: "Quick quiz" },
  "chapter.section.quiz.blurb": {
    zh: "在進入下一章之前，鞏固你剛學到的概念。",
    en: "Lock in your understanding before moving on.",
  },
  "chapter.section.takeaways": { zh: "重點整理", en: "Key takeaways" },
  "chapter.section.further": { zh: "延伸閱讀", en: "Further reading" },
  "chapter.prev": { zh: "上一章", en: "Previous" },
  "chapter.next": { zh: "下一章", en: "Next" },

  // Three-layer view tabs
  "layer.l1": { zh: "Level 1 · 直覺", en: "Level 1 · Intuition" },
  "layer.l2": { zh: "Level 2 · 形式定義", en: "Level 2 · Formalism" },
  "layer.l3": { zh: "Level 3 · 研究所層級", en: "Level 3 · Graduate insight" },
  "layer.l1.label": { zh: "從直覺開始", en: "Intuition first" },
  "layer.l2.label": { zh: "數學定義", en: "Mathematical definition" },
  "layer.l3.label": { zh: "研究所層級洞見", en: "Graduate-level insight" },

  // Common UI
  "common.takeaways": { zh: "重點整理", en: "Key takeaways" },
  "common.misconceptions": { zh: "常見誤解", en: "Common misconceptions" },
  "common.myth": { zh: "迷思", en: "myth" },
  "common.truth": { zh: "事實", en: "truth" },
  "common.theorem": { zh: "定理", en: "Theorem" },
  "common.definition": { zh: "定義", en: "Definition" },
  "common.lemma": { zh: "引理", en: "Lemma" },
  "common.corollary": { zh: "推論", en: "Corollary" },
  "common.proposition": { zh: "命題", en: "Proposition" },
  "common.derivation": { zh: "推導", en: "Derivation" },
  "common.step": { zh: "步驟", en: "step" },
  "common.back": { zh: "上一步", en: "Back" },
  "common.next": { zh: "下一步", en: "Next" },
  "common.restart": { zh: "重來", en: "Restart" },
  "common.complete": { zh: "推導完成", en: "Derivation complete" },
  "common.quiz": { zh: "小測驗", en: "Quick quiz" },
  "common.submit": { zh: "送出答案", en: "Submit answers" },
  "common.tryAgain": { zh: "再試一次", en: "Try again" },
  "common.scored": { zh: "你答對了", en: "You scored" },
  "common.why": { zh: "原因：", en: "Why:" },
  "common.whatThisAnswers": { zh: "這個公式回答的問題", en: "What this answers" },

  // Formula questions (Chinese versions of "what does this answer?")
  // (chapter content provides its own — this is just the label)

  // Playground
  "playground.eyebrow": { zh: "互動練習場", en: "Playground" },
  "playground.title": {
    zh: "所有互動模擬器集中在這裡",
    en: "Every interactive in one place",
  },
  "playground.intro": {
    zh: "把這頁當沙盒：挑一個模擬器，玩一陣子，培養直覺，再回到對應章節讀數學形式。",
    en: "Use this page like a sandbox: pick any simulator, play with it for a while, develop your intuition, then go back to the chapter for the formalism.",
  },
  "playground.note": {
    zh: "所有模擬都用 JavaScript 在你的瀏覽器內執行。沒有伺服器、沒有遙測 — 你拖的每一個滑桿都是你自己的。",
    en: "All simulations run locally in your browser using JavaScript. No server, no telemetry — your sliders stay yours.",
  },

  // Quiz hub
  "quiz.eyebrow": { zh: "測驗中心", en: "Quiz hub" },
  "quiz.title": { zh: "檢驗你真正記住的", en: "Test what stuck" },
  "quiz.intro": {
    zh: "每章結尾都有一個小測驗。這頁追蹤所有章節的成績，方便你回頭加強。所有進度透過 localStorage 存在你的瀏覽器內。",
    en: "Every chapter ends with a quick concept-check quiz. This page tracks your scores across all chapters so you can see where to revisit. All progress stays in your browser via localStorage.",
  },
  "quiz.overall": { zh: "總分", en: "Overall" },
  "quiz.questions": { zh: "題", en: "questions" },
  "quiz.notAttempted": { zh: "尚未作答", en: "not attempted" },

  // Notes
  "notes.eyebrow": { zh: "筆記與書籤", en: "Notes & bookmarks" },
  "notes.title": { zh: "你的學習日誌", en: "Your study journal" },
  "notes.intro": {
    zh: "每章寫一則筆記 — 卡關的點、自己的重新推導、終於想通的心智模型。書籤會列在最上面。",
    en: "Jot one note per chapter — a confusing point, a re-derivation, the mental model that finally clicked. Bookmarks are listed at the top.",
  },
  "notes.bookmarks": { zh: "書籤", en: "Bookmarks" },
  "notes.placeholder": { zh: "在這裡寫筆記…", en: "Type your notes here…" },
  "notes.chars": { zh: "字", en: "chars" },
  "notes.reset": { zh: "清除所有進度", en: "reset all progress" },
  "notes.confirmReset": {
    zh: "這會清除所有章節完成度、測驗成績、筆記與書籤。確定要繼續嗎？",
    en: "This wipes all chapter completion, quiz scores, notes, and bookmarks. Continue?",
  },

  // About
  "about.eyebrow": { zh: "關於本課程", en: "About this course" },
  "about.title": { zh: "教學方法", en: "Methodology" },
  "about.subtitle": {
    zh: "一套研究所程度的機率與統計課程，目標是「願意動腦但不想死背」的自學者，能真的學到會。",
    en: "A graduate-level probability and statistics course designed to be actually learnable by a self-studying engineer who is willing to think but not to memorise.",
  },
  "about.threelayers": { zh: "每章都有三層", en: "Three layers, every chapter" },
  "about.l1.title": { zh: "Level 1 · 直覺", en: "Level 1 · Intuition" },
  "about.l1.text": {
    zh: "用一張圖、一個故事、一個比喻先讓你「感覺到」概念在做什麼，然後才上式子。",
    en: "A picture, a story, and an analogy. No equations until you have a feel for what's happening.",
  },
  "about.l2.title": { zh: "Level 2 · 形式定義", en: "Level 2 · Formalism" },
  "about.l2.text": {
    zh: "用 KaTeX 排版的定義、定理與一步步的推導。",
    en: "Definitions, theorems, and step-by-step derivations rendered in KaTeX.",
  },
  "about.l3.title": { zh: "Level 3 · 研究所層級洞見", en: "Level 3 · Graduate insight" },
  "about.l3.text": {
    zh: "更嚴謹的條件、常見誤用，以及和其他領域的連結。一個「真正統計學家」的味道。",
    en: "Stricter conditions, common misuses, and connections to other areas. The 'taste' of a real statistician.",
  },
  "about.template": { zh: "每章都遵循同一份模板", en: "Every chapter follows the same template" },
  "about.template.steps": {
    zh: [
      "為什麼要學 — 一句話的價值主張。",
      "三層視角（直覺 → 形式 → 研究所）。",
      "用即時模擬器做視覺探索。",
      "可一步步展開的推導。",
      "工作範例（用乾淨的數字）。",
      "常見誤解，把錯的版本和正確的版本對照。",
      "計分小測驗，會記下你的成績。",
      "重點整理。",
      "延伸閱讀。",
    ],
    en: [
      "Why this matters — the elevator pitch.",
      "Three-layer view (intuition → formal → graduate).",
      "Visual exploration with a live simulator.",
      "Step-by-step derivation you can advance one move at a time.",
      "Worked example with clean numbers.",
      "Common misconceptions, paired with the corrected version.",
      "Quick quiz that scores you and remembers your result.",
      "Key takeaways, distilled.",
      "Further reading.",
    ],
  },
  "about.interactive": { zh: "為什麼互動很重要", en: "Why interactive matters" },
  "about.interactive.text": {
    zh: "機率本質上是「視覺」的學科。大部分初學者卡關，是被一些其實在描述「圖上一塊區域、面積、重心」的記號搞混。這裡的模擬器讓你能直接拖動公式描述的旋鈕，看著它即時回應 — 那才是真正培養「感覺」、不只是「知識」的方式。",
    en: "Probability is fundamentally a visual subject. Most beginners get derailed by notation that's really just describing an operation on a picture: a region, an area, a balance point. The simulators here let you turn the knobs that the formulas describe and see them respond — which is what builds feel, not just knowledge.",
  },
  "about.stack": { zh: "技術棧", en: "Stack" },
  "about.stack.text": {
    zh: "用 Next.js（App Router）、TypeScript、Tailwind CSS、KaTeX、Recharts 與 Zustand 建構。所有模擬都在瀏覽器內執行，沒有伺服器。課程內容是純 TypeScript 模組，新增章節只要把一個檔案丟進 content/chapters/ 並到 registry 註冊一行即可。",
    en: "Built with Next.js (App Router), TypeScript, Tailwind CSS, KaTeX, Recharts, and Zustand for local progress storage. All simulators run in the browser with no server. The course content lives in plain TypeScript modules, which means adding a new chapter is just dropping a file into content/chapters/ and registering it.",
  },

  // Slider / simulator labels
  "sim.mu": { zh: "μ（平均）", en: "μ (mean)" },
  "sim.sigma": { zh: "σ（標準差）", en: "σ (std)" },
  "sim.rate": { zh: "λ（rate）", en: "λ (rate)" },
  "sim.lambda": { zh: "λ", en: "λ" },
  "sim.n": { zh: "n（樣本數）", en: "n (sample size)" },
  "sim.nTrials": { zh: "n（試驗次數）", en: "n (trials)" },
  "sim.p": { zh: "p", en: "p" },
  "sim.a": { zh: "a", en: "a" },
  "sim.b": { zh: "b", en: "b" },
  "sim.seed": { zh: "亂數種子", en: "random seed" },
  "sim.seedShort": { zh: "種子", en: "seed" },
  "sim.reroll": { zh: "重新抽種子", en: "Re-roll seed" },
  "sim.newSamples": { zh: "重新抽樣", en: "New samples" },
  "sim.numMeans": { zh: "樣本平均的個數", en: "number of sample means" },
  "sim.expectedValue": { zh: "E[X] =", en: "E[X] =" },
  "sim.variance": { zh: "Var(X) =", en: "Var(X) =" },
  "sim.observedVsTheory": { zh: "觀察值 vs 理論值", en: "Observed vs theory" },
  "sim.muTrue": { zh: "μ（真實）", en: "μ (true)" },
  "sim.meanOfMeans": { zh: "樣本平均的平均", en: "mean of sample means" },
  "sim.stdOfMeans": { zh: "樣本平均的標準差", en: "std of sample means" },
  "sim.theory": { zh: "（理論）", en: "(theory)" },
  "sim.bernoulliP": { zh: "p（Bernoulli）", en: "p (Bernoulli)" },
  "sim.trialsPerRun": { zh: "每次模擬的試驗數", en: "trials per run" },
  "sim.priorLabel": { zh: "先驗 · Beta(α₀, β₀)", en: "Prior · Beta(α₀, β₀)" },
  "sim.evidence": { zh: "已觀察的拋擲", en: "Coin tosses observed" },
  "sim.heads": { zh: "正面", en: "heads" },
  "sim.tails": { zh: "反面", en: "tails" },
  "sim.resetEvidence": { zh: "清除證據", en: "reset evidence" },
  "sim.posterior": { zh: "後驗", en: "posterior" },
  "sim.mean": { zh: "mean", en: "mean" },
  "sim.mode": { zh: "mode", en: "mode" },
  "sim.muTrueLabel": { zh: "真實 μ", en: "true μ" },
  "sim.sigmaKnown": { zh: "σ（已知）", en: "σ (known)" },
  "sim.yourGuess": { zh: "你猜的 μ", en: "your guess for μ" },
  "sim.snapMLE": { zh: "對齊到 MLE", en: "Snap to MLE" },
  "sim.logLikelihood": { zh: "對數概似函數", en: "log-likelihood" },
  "sim.atMLE": { zh: "在 MLE 處 =", en: "at MLE =" },
  "sim.atGuess": { zh: "在你的猜測處 =", en: "at your guess =" },
  "sim.pointEstimates": { zh: "點估計", en: "point estimates" },
  "sim.confidence": { zh: "信心水準", en: "confidence" },
  "sim.numCIs": { zh: "區間數", en: "# intervals" },
  "sim.empCoverage": { zh: "經驗覆蓋率", en: "empirical coverage" },
  "sim.target": { zh: "目標", en: "target" },
  "sim.eachBar": { zh: "每條 = 一個由獨立樣本算出的 95% CI。", en: "Each bar = one 95% CI from a fresh sample." },
  "sim.mu0": { zh: "μ₀（虛無）", en: "μ₀ (null)" },
  "sim.mu1": { zh: "μ₁（真實）", en: "μ₁ (true)" },
  "sim.alpha": { zh: "α", en: "α" },
  "sim.se": { zh: "se = σ/√n", en: "se = σ/√n" },
  "sim.rejectIf": { zh: "拒絕條件 x̄ <", en: "reject if x̄ <" },
  "sim.orXBar": { zh: "  或 x̄ >", en: "     or x̄ >" },
  "sim.alphaLevel": { zh: "α（顯著水準）", en: "α (level)" },
  "sim.beta": { zh: "β（漏掉）", en: "β (miss)" },
  "sim.power": { zh: "檢定力 1−β", en: "power 1−β" },
  "sim.trueAlpha": { zh: "真實截距 α", en: "true intercept α" },
  "sim.trueBeta": { zh: "真實斜率 β", en: "true slope β" },
  "sim.noise": { zh: "雜訊 σ", en: "noise σ" },
  "sim.nPoints": { zh: "n（點數）", en: "n (points)" },
  "sim.olsEstimates": { zh: "OLS 估計", en: "OLS estimates" },
  "sim.alphaHat": { zh: "α̂ =", en: "α̂ =" },
  "sim.betaHat": { zh: "β̂ =", en: "β̂ =" },
  "sim.weightHint": {
    zh: "拖動權重重新塑造分布。橘色線是平均 — 分布的重心。",
    en: "Drag the weights to reshape the distribution. The amber line is the mean — the balance point of the distribution.",
  },
  "sim.lln.hint": {
    zh: "三組獨立的 run。當 n → ∞，每條跑動平均都會被吸到 p。注意小 n 時變動很大，且按 1/√n 縮小。",
    en: "Three independent runs. As n → ∞, every running average should funnel toward p. Notice how variability is huge for small n and shrinks like 1/√n.",
  },
  "sim.cond.hint": {
    zh: "寬度 = P(A)；每一直欄內的深色帶子是 P(B|A)（或 P(B|¬A)）。深色總面積等於 P(A∩B) + P(¬A∩B) = P(B)。貝氏定理可以直接讀成：A 內的深色面積 ÷ 整體深色面積。",
    en: "Width = P(A); inside each column, the dark band is P(B | A) (or P(B | ¬A)). The dark area equals P(A∩B) + P(¬A∩B) = P(B). Bayes' rule reads off as the dark area inside A divided by the total dark area.",
  },
  "sim.binLabel": { zh: "個 bin", en: "bins" },

  // Section step badges
  "section.step": { zh: "STEP", en: "STEP" },

  // Misc
  "deploy.live": { zh: "切換語言", en: "Switch language" },
} as const;

export type StringKey = keyof typeof STRINGS;

export function tString(key: StringKey, locale: Locale): string {
  const entry = STRINGS[key] as unknown as { zh: string; en: string };
  if (!entry) return key;
  return entry[locale] ?? entry.en;
}

export function tArray(key: StringKey, locale: Locale): string[] {
  const entry = STRINGS[key] as unknown as { zh: string[]; en: string[] };
  return entry[locale] ?? entry.en ?? [];
}
