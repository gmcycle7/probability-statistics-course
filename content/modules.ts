import type { ModuleInfo } from "./types";

export const MODULES: ModuleInfo[] = [
  {
    id: "A_basic_probability",
    letter: "A",
    title: "Foundations of Probability",
    blurb:
      "Sample spaces, axioms, conditional probability, independence, Bayes — the language every other module speaks.",
    color: "accent",
  },
  {
    id: "B_random_variables",
    letter: "B",
    title: "Random Variables & Distributions",
    blurb:
      "PMF/PDF/CDF, expectation, variance, joint and conditional distributions, the catalogue of standard models.",
    color: "violet",
  },
  {
    id: "C_limit_theorems",
    letter: "C",
    title: "Limit Theorems",
    blurb:
      "LLN, CLT, modes of convergence — why averages are predictable and why Normal distributions are everywhere.",
    color: "green",
  },
  {
    id: "D_inference",
    letter: "D",
    title: "Statistical Inference",
    blurb:
      "Estimators, bias/variance/MSE, sufficiency, sampling distributions — the rules of the inference game.",
    color: "amber",
  },
  {
    id: "E_estimation",
    letter: "E",
    title: "Estimation Methods",
    blurb:
      "MLE, method of moments, MAP vs MLE, bootstrap, confidence intervals.",
    color: "accent",
  },
  {
    id: "F_testing",
    letter: "F",
    title: "Hypothesis Testing",
    blurb:
      "p-values, type I / II errors, power, z/t/χ², likelihood-ratio, multiple comparisons.",
    color: "rose",
  },
  {
    id: "G_regression",
    letter: "G",
    title: "Regression & Linear Models",
    blurb:
      "Least squares, statistical interpretation, residual analysis, regularization intuition.",
    color: "violet",
  },
  {
    id: "H_advanced",
    letter: "H",
    title: "Advanced Topics",
    blurb:
      "Bayesian computation, Monte Carlo, Markov chains, PCA, EM, KL divergence.",
    color: "green",
  },
];
