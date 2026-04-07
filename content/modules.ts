import type { ModuleInfo } from "./types";

export const MODULES: ModuleInfo[] = [
  {
    id: "A_basic_probability",
    letter: "A",
    title: {
      en: "Foundations of Probability",
      zh: "機率基礎",
    },
    blurb: {
      en: "Sample spaces, axioms, conditional probability, independence, Bayes — the language every other module speaks.",
      zh: "樣本空間、公理、條件機率、獨立、貝氏 — 後面所有模組都用得到的共同語言。",
    },
    color: "accent",
  },
  {
    id: "B_random_variables",
    letter: "B",
    title: {
      en: "Random Variables & Distributions",
      zh: "隨機變數與分布",
    },
    blurb: {
      en: "PMF/PDF/CDF, expectation, variance, joint and conditional distributions, the catalogue of standard models.",
      zh: "PMF / PDF / CDF、期望值、變異數、聯合與條件分布，以及常見分布的小型動物園。",
    },
    color: "violet",
  },
  {
    id: "C_limit_theorems",
    letter: "C",
    title: { en: "Limit Theorems", zh: "極限定理" },
    blurb: {
      en: "LLN, CLT, modes of convergence — why averages are predictable and why Normal distributions are everywhere.",
      zh: "大數法則、中央極限定理、各種收斂模式 — 為什麼平均可預測、為什麼常態分布無所不在。",
    },
    color: "green",
  },
  {
    id: "D_inference",
    letter: "D",
    title: { en: "Statistical Inference", zh: "統計推論基礎" },
    blurb: {
      en: "Estimators, bias/variance/MSE, sufficiency, sampling distributions — the rules of the inference game.",
      zh: "估計量、偏誤 / 變異 / 均方誤差、充分統計量、抽樣分布 — 推論這場遊戲的規則。",
    },
    color: "amber",
  },
  {
    id: "E_estimation",
    letter: "E",
    title: { en: "Estimation Methods", zh: "估計方法" },
    blurb: {
      en: "MLE, method of moments, MAP vs MLE, bootstrap, confidence intervals.",
      zh: "最大概似估計、動差法、MAP 與 MLE 比較、Bootstrap、信賴區間。",
    },
    color: "accent",
  },
  {
    id: "F_testing",
    letter: "F",
    title: { en: "Hypothesis Testing", zh: "假設檢定" },
    blurb: {
      en: "p-values, type I / II errors, power, z/t/χ², likelihood-ratio, multiple comparisons.",
      zh: "p 值、第一 / 第二型誤差、檢定力、z/t/χ²、概似比、多重比較。",
    },
    color: "rose",
  },
  {
    id: "G_regression",
    letter: "G",
    title: { en: "Regression & Linear Models", zh: "迴歸與線性模型" },
    blurb: {
      en: "Least squares, statistical interpretation, residual analysis, regularization intuition.",
      zh: "最小平方法、統計解讀、殘差分析、正則化的直覺。",
    },
    color: "violet",
  },
  {
    id: "H_advanced",
    letter: "H",
    title: { en: "Advanced Topics", zh: "進階主題" },
    blurb: {
      en: "Bayesian computation, Monte Carlo, Markov chains, PCA, EM, KL divergence.",
      zh: "貝氏計算、Monte Carlo、Markov chain、PCA、EM、KL divergence。",
    },
    color: "green",
  },
];
