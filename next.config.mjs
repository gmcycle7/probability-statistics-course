import { PHASE_DEVELOPMENT_SERVER } from "next/constants.js";

/**
 * The site is deployed to GitHub Pages at
 *   https://gmcycle7.github.io/probability-statistics-course/
 * so production builds need basePath/assetPrefix to match.
 *
 * In `next dev` we want a clean http://localhost:3000/ with no prefix —
 * the phase check below makes that happen automatically.
 *
 * To disable the prefix (e.g. deploying to a custom domain or Vercel),
 * set NEXT_PUBLIC_BASE_PATH="" before `npm run build`.
 */
const REPO_BASE_PATH = "/probability-statistics-course";

/** @type {(phase: string) => import('next').NextConfig} */
export default function nextConfig(phase) {
  const isDev = phase === PHASE_DEVELOPMENT_SERVER;

  const basePath =
    process.env.NEXT_PUBLIC_BASE_PATH !== undefined
      ? process.env.NEXT_PUBLIC_BASE_PATH
      : isDev
        ? ""
        : REPO_BASE_PATH;

  return {
    reactStrictMode: true,
    experimental: {
      optimizePackageImports: ["lucide-react", "recharts"],
    },
    // Static export only at build time — `next dev` ignores this.
    output: isDev ? undefined : "export",
    basePath: basePath || undefined,
    assetPrefix: basePath || undefined,
    trailingSlash: true,
    images: { unoptimized: true },
  };
}
