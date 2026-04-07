import { notFound } from "next/navigation";
import { CHAPTERS, getChapterBySlug } from "@/content/registry";
import { ChapterRenderer } from "./ChapterRenderer";

export function generateStaticParams() {
  return CHAPTERS.map((c) => ({ slug: c.meta.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const chapter = getChapterBySlug(params.slug);
  if (!chapter) return {};
  // Use English title for metadata; the page itself is locale-aware client-side.
  return {
    title: `${chapter.localized.en.title} · Prob·Stat`,
    description: chapter.localized.en.subtitle,
  };
}

export default function ChapterPage({ params }: { params: { slug: string } }) {
  const chapter = getChapterBySlug(params.slug);
  if (!chapter) notFound();
  return <ChapterRenderer chapter={chapter} />;
}
