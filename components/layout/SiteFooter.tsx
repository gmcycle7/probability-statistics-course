"use client";

import { useT } from "@/lib/i18n/useT";

export function SiteFooter() {
  const { t } = useT();
  return (
    <footer className="border-t border-bg-border mt-16">
      <div className="container-wide py-8 text-sm text-ink-muted flex flex-col sm:flex-row gap-3 justify-between">
        <div>{t("footer.tagline")}</div>
        <div>{t("footer.copy")}</div>
      </div>
    </footer>
  );
}
