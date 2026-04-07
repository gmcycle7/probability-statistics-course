"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const nav = [
  { href: "/", label: "Home" },
  { href: "/roadmap", label: "Roadmap" },
  { href: "/playground", label: "Playground" },
  { href: "/quiz", label: "Quiz" },
  { href: "/notes", label: "Notes" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  const path = usePathname();
  return (
    <header className="sticky top-0 z-40 border-b border-bg-border bg-bg/80 backdrop-blur">
      <div className="container-wide flex h-14 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-accent to-accent-violet shadow-card grid place-items-center text-bg font-bold">
            P
          </div>
          <span className="font-semibold text-ink group-hover:text-accent transition-colors">
            Prob<span className="text-accent">·</span>Stat
          </span>
          <span className="hidden sm:inline text-xs text-ink-muted">
            interactive course
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          {nav.map((n) => {
            const active =
              n.href === "/" ? path === "/" : path?.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                className={cn(
                  "px-3 py-1.5 text-sm rounded-lg transition-colors",
                  active
                    ? "text-accent bg-accent/10"
                    : "text-ink-dim hover:text-ink hover:bg-bg-soft",
                )}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
