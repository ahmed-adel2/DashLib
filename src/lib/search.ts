import {
  categoryLabel,
  gradeLabels,
  lessons,
  products,
  type GradeBand,
  type Lesson,
} from "@/lib/data";
import { currency } from "@/lib/format";

/** The two catalogs the header search can look through. */
export type SearchScope = "store" | "lessons";

export type SearchSuggestion = {
  id: string;
  href: string;
  title: string;
  meta: string;
  scope: SearchScope;
};

type IndexEntry = SearchSuggestion & { haystack: string };

const lessonHaystack = (lesson: Lesson) =>
  [lesson.title, lesson.subject, lesson.summary, lesson.teacher, gradeLabels[lesson.grade]]
    .join(" ")
    .toLowerCase();

const storeIndex: IndexEntry[] = products.map((product) => ({
  id: product.id,
  href: `/product/${product.slug}`,
  title: product.title,
  meta: `${categoryLabel(product.category)} · ${currency(product.price)}`,
  scope: "store",
  haystack: [product.title, product.publisher, product.code, categoryLabel(product.category)]
    .join(" ")
    .toLowerCase(),
}));

const lessonIndex: IndexEntry[] = lessons.map((lesson) => ({
  id: lesson.id,
  href: `/learn/${lesson.slug}`,
  title: lesson.title,
  meta: `${lesson.subject} · ${gradeLabels[lesson.grade]}`,
  scope: "lessons",
  haystack: lessonHaystack(lesson),
}));

const rank = (entry: IndexEntry, needle: string) => {
  const title = entry.title.toLowerCase();
  if (title.startsWith(needle)) return 0;
  if (title.includes(needle)) return 1;
  return 2;
};

/** Matching entries for one scope, best title hits first. */
export function searchSuggestions(
  scope: SearchScope,
  query: string,
  limit = 6,
): SearchSuggestion[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return [];

  const entries = scope === "store" ? storeIndex : lessonIndex;

  return entries
    .filter((entry) => entry.haystack.includes(needle))
    .sort((a, b) => rank(a, needle) - rank(b, needle) || a.title.localeCompare(b.title))
    .slice(0, limit)
    .map((entry) => ({
      id: entry.id,
      href: entry.href,
      title: entry.title,
      meta: entry.meta,
      scope: entry.scope,
    }));
}

/**
 * Lessons matching the query (title, subject, summary, teacher or grade) and,
 * when a year is chosen, only lessons for that grade band.
 */
export function filterLessons(query: string, year: GradeBand | "all" = "all"): Lesson[] {
  const needle = query.trim().toLowerCase();

  return lessons.filter((lesson) => {
    if (year !== "all" && lesson.grade !== year) return false;
    return !needle || lessonHaystack(lesson).includes(needle);
  });
}
