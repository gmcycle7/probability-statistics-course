import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#0b1020",
          soft: "#11172b",
          card: "#151c33",
          border: "#222b46",
        },
        ink: {
          DEFAULT: "#e6eaf2",
          dim: "#9aa4bf",
          muted: "#6b7591",
        },
        accent: {
          DEFAULT: "#7c9cff",
          soft: "#3b4a7a",
          green: "#5fd0a4",
          amber: "#ffc46b",
          rose: "#ff7a9a",
          violet: "#b08bff",
        },
      },
      fontFamily: {
        sans: [
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Inter",
          "sans-serif",
        ],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "JetBrains Mono",
          "Menlo",
          "monospace",
        ],
      },
      boxShadow: {
        card: "0 1px 0 0 rgba(255,255,255,0.04), 0 8px 30px rgba(0,0,0,0.35)",
      },
      typography: {
        DEFAULT: {
          css: {
            color: "#e6eaf2",
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
