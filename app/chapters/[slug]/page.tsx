import { notFound } from "next/navigation";
import { CHAPTERS, getChapterBySlug, getNeighbors } from "@/content/registry";
import { ChapterRenderer } from "./ChapterRenderer";

export function generateStaticParams() {
  return CHAPTERS.map((c) => ({ slug: c.meta.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const chapter = getChapterBySlug(params.slug);
  if (!chapter) return {};
  return {
    title: `${chapter.meta.title} · Prob·Stat`,
    description: chapter.meta.subtitle,
  };
}

export default function ChapterPage({ params }: { params: { slug: string } }) {
  const chapter = getChapterBySlug(params.slug);
  if (!chapter) notFound();
  const neighbors = getNeighbors(params.slug);
  return <ChapterRenderer chapter={chapter} neighbors={neighbors} />;
}
