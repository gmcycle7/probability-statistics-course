"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { useT } from "@/lib/i18n/useT";
import { LanguageSwitcher } from "./LanguageSwitcher";
import type { StringKey } from "@/lib/i18n/strings";

const nav: { href: string; key: StringKey }[] = [
  { href: "/", key: "nav.home" },
  { href: "/roadmap", key: "nav.roadmap" },
  { href: "/playground", key: "nav.playground" },
  { href: "/quiz", key: "nav.quiz" },
  { href: "/notes", key: "nav.notes" },
  { href: "/about", key: "nav.about" },
];

export function SiteHeader() {
  const path = usePathname();
  const { t } = useT();
  return (
    <header className="sticky top-0 z-40 border-b border-bg-border bg-bg/80 backdrop-blur">
      <div className="container-wide flex h-14 items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-accent to-accent-violet shadow-card grid place-items-center text-bg font-bold">
            P
          </div>
          <span className="font-semibold text-ink group-hover:text-accent transition-colors">
            Prob<span className="text-accent">·</span>Stat
          </span>
          <span className="hidden sm:inline text-xs text-ink-muted">
            {t("brand.tagline")}
          </span>
        </Link>
        <nav className="flex items-center gap-1 flex-wrap">
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
                {t(n.key)}
              </Link>
            );
          })}
          <div className="ml-2">
            <LanguageSwitcher />
          </div>
        </nav>
      </div>
    </header>
  );
}
