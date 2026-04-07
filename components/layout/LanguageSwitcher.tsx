"use client";

import { Languages } from "lucide-react";
import { useLocale } from "@/lib/i18n/locale";
import { cn } from "@/lib/cn";

export function LanguageSwitcher() {
  const locale = useLocale((s) => s.locale);
  const setLocale = useLocale((s) => s.setLocale);

  return (
    <div className="flex items-center gap-1 rounded-lg border border-bg-border bg-bg-card/60 p-0.5">
      <Languages className="h-3.5 w-3.5 text-ink-muted ml-1.5 mr-0.5" />
      <button
        onClick={() => setLocale("zh")}
        className={cn(
          "px-2 py-1 text-xs font-medium rounded-md transition-colors",
          locale === "zh"
            ? "bg-accent/15 text-accent"
            : "text-ink-muted hover:text-ink",
        )}
        aria-label="切換到中文"
      >
        中文
      </button>
      <button
        onClick={() => setLocale("en")}
        className={cn(
          "px-2 py-1 text-xs font-medium rounded-md transition-colors",
          locale === "en"
            ? "bg-accent/15 text-accent"
            : "text-ink-muted hover:text-ink",
        )}
        aria-label="Switch to English"
      >
        EN
      </button>
    </div>
  );
}
