import type { Metadata } from "next";
import "./globals.css";
import "katex/dist/katex.min.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

export const metadata: Metadata = {
  title: "Probability & Statistics — Interactive Graduate Course",
  description:
    "An interactive, graduate-level course in probability and statistics, built around intuition, formal definitions, derivations, and live simulations.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
