"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useT } from "@/lib/i18n/useT";

export function ChapterNavigator({
  prev,
  next,
}: {
  prev?: { slug: string; title: string };
  next?: { slug: string; title: string };
}) {
  const { t } = useT();
  return (
    <div className="my-10 grid gap-3 sm:grid-cols-2">
      {prev ? (
        <Link
          href={`/chapters/${prev.slug}`}
          className="group rounded-2xl border border-bg-border bg-bg-card/70 p-4 hover:border-accent/60 transition-colors"
        >
          <div className="text-xs uppercase tracking-wider text-ink-muted flex items-center gap-1">
            <ArrowLeft className="h-3 w-3" /> {t("chapter.prev")}
          </div>
          <div className="mt-1 text-ink group-hover:text-accent transition-colors font-medium">
            {prev.title}
          </div>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          href={`/chapters/${next.slug}`}
          className="group rounded-2xl border border-bg-border bg-bg-card/70 p-4 text-right hover:border-accent/60 transition-colors"
        >
          <div className="text-xs uppercase tracking-wider text-ink-muted flex items-center gap-1 justify-end">
            {t("chapter.next")} <ArrowRight className="h-3 w-3" />
          </div>
          <div className="mt-1 text-ink group-hover:text-accent transition-colors font-medium">
            {next.title}
          </div>
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}
