export function SiteFooter() {
  return (
    <footer className="border-t border-bg-border mt-16">
      <div className="container-wide py-8 text-sm text-ink-muted flex flex-col sm:flex-row gap-3 justify-between">
        <div>
          Built for self-learners. Three layers per topic:{" "}
          <span className="text-ink-dim">Intuition → Formalism → Graduate insight.</span>
        </div>
        <div>© Probability & Statistics — Interactive Course</div>
      </div>
    </footer>
  );
}
