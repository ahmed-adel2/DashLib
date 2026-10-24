import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { IconArrowRight, IconCalendar, IconClock, IconVideo } from "@/components/icons";
import { YearSelect } from "@/components/learn/year-select";
import { LessonThumb } from "@/components/lesson-thumb";
import { ShopShell } from "@/components/shop/shop-shell";
import { Badge, ButtonLink, Empty, Panel, PanelHead, StarRule } from "@/components/ui";
import { gradeLabels, lessons, tasks, type GradeBand, type Lesson } from "@/lib/data";
import { formatDate, formatDuration } from "@/lib/format";
import { filterLessons } from "@/lib/search";

export const metadata: Metadata = {
  title: "Lessons",
  description: "Video lessons and tasks uploaded by your teachers, sorted by grade level.",
};

const dueThisWeek = tasks
  .filter((task) => task.due >= "2026-10-24" && task.due <= "2026-10-31")
  .sort((a, b) => a.due.localeCompare(b.due));

type LearnSearchParams = Promise<{ q?: string | string[]; year?: string | string[] }>;

export default function LearnPage({ searchParams }: { searchParams: LearnSearchParams }) {
  return (
    <ShopShell active="learn">
      <section className="border-b-2 border-line-strong bg-paper relative overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-1/3 opacity-5 pointer-events-none bg-academic-grid" />
        <div className="mx-auto w-full max-w-[1240px] px-5 pb-10 pt-12 sm:px-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 rounded-sm bg-forest px-2.5 py-0.5 text-[10.5px] font-bold uppercase tracking-[0.14em] text-paper shadow-xs">
              Curriculum Video Modules
            </span>
            <span className="text-[12px] font-semibold text-brick">
              Integrated with Homework Assignments
            </span>
          </div>
          <h1 className="max-w-[24ch] text-[38px] font-extrabold leading-[1.05] tracking-tight text-ink sm:text-[48px]">
            Watch educator lessons. Submit syllabus tasks directly.
          </h1>
          <p className="mt-4 max-w-[62ch] text-[15px] font-normal leading-relaxed text-ink/80">
            Every lesson below is curated and recorded by your school's accredited teachers.
            Video modules pair directly with step-by-step tasks, required reading pages, and chapter outlines.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3 text-[12px]">
            <span className="inline-flex items-center gap-2 rounded-sm border border-line-strong bg-cream px-3 py-1 font-bold text-forest">
              <IconVideo className="h-4 w-4 text-forest" />
              {lessons.length} Accredited Lessons
            </span>
            <span className="inline-flex items-center gap-2 rounded-sm border border-brick/40 bg-brick-wash px-3 py-1 font-bold text-brick-ink">
              <IconCalendar className="h-4 w-4 text-brick" />
              {dueThisWeek.length} Tasks Due This Week
            </span>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-[1240px] px-5 py-10 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_330px] lg:items-start">
          <section>
            <div className="mb-5 flex items-end justify-between gap-4 border-b-2 border-line pb-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-forest block">Academic Catalog</span>
                <h2 className="text-[26px] font-bold text-ink">Lesson Curriculum</h2>
              </div>
              <span className="rounded-sm border border-line-strong bg-cream px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-stone">
                Elementary to High School
              </span>
            </div>

            <Suspense fallback={<LessonGrid items={lessons} />}>
              <LessonResults searchParams={searchParams} />
            </Suspense>
          </section>

          <aside className="lg:sticky lg:top-[92px]">
            <Panel ticks className="border-2 border-line-strong shadow-sm bg-paper">
              <div className="border-b-2 border-line bg-cream/70 px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-brick animate-ping" />
                    <span className="text-[14px] font-bold text-ink">Due This Week</span>
                  </div>
                  <span className="rounded-sm bg-brick px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-paper">
                    {dueThisWeek.length} Pending
                  </span>
                </div>
              </div>
              <ul className="divide-y divide-line">
                {dueThisWeek.map((task) => (
                  <li key={task.id} className="p-4 transition-colors hover:bg-cream/50">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/learn/${task.lessonSlug}`}
                        className="text-[13.5px] font-bold leading-snug text-ink hover:text-forest hover:underline"
                      >
                        {task.title}
                      </Link>
                      <span className={`inline-flex items-center rounded-sm px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        task.due <= "2026-10-26" ? "bg-brick text-paper" : "bg-cream border border-line-strong text-ink"
                      }`}>
                        {formatDate(task.due)}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[12px] text-stone">
                      <span className="font-semibold text-forest">{task.subject}</span>
                      <span className="num font-bold text-brick">{task.points} pts</span>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="border-t border-line bg-cream/40 p-4">
                <p className="text-[11.5px] leading-relaxed text-stone">
                  Watch the module recording before starting. Chapter timestamps provide quick review checkpoints.
                </p>
              </div>
            </Panel>

            <div className="mt-6 rounded-xs border-2 border-line bg-cream p-5">
              <div className="flex items-center gap-2 text-forest">
                <StarRule label="Required Syllabus Book?" />
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-ink/80">
                Most lessons reference textbook exercises. Verify live branch stock before heading to class.
              </p>
              <ButtonLink href="/store" variant="primary" size="md" className="mt-4 w-full justify-center font-bold">
                Check Books in Store
                <IconArrowRight className="h-4 w-4" />
              </ButtonLink>
            </div>
          </aside>
        </div>
      </div>
    </ShopShell>
  );
}

async function LessonResults({ searchParams }: { searchParams: LearnSearchParams }) {
  const { q, year } = await searchParams;
  const query = typeof q === "string" ? q : "";
  const selectedYear: GradeBand | "all" =
    year === "elementary" || year === "middle" || year === "high" ? year : "all";
  const matches = filterLessons(query, selectedYear);
  const clearHref = selectedYear === "all" ? "/learn" : `/learn?year=${selectedYear}`;

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[12px] text-stone">
          <span className="num font-medium text-ink">{matches.length}</span>{" "}
          {matches.length === 1 ? "lesson" : "lessons"}
          {query.trim() ? (
            <>
              {" "}for <span className="text-ink">“{query.trim()}”</span>
            </>
          ) : null}
          {query.trim() ? (
            <Link href={clearHref} className="ml-3 font-medium text-forest hover:underline">
              Clear search
            </Link>
          ) : null}
        </p>
        <YearSelect year={selectedYear} query={query} />
      </div>

      {matches.length === 0 ? (
        <Panel>
          <Empty
            title="No lessons match that yet"
            body="Try another year, a subject, a teacher's name, or a word from the lesson title."
            action={
              <ButtonLink href={clearHref} variant="secondary" size="sm">
                Clear search
              </ButtonLink>
            }
          />
        </Panel>
      ) : (
        <LessonGrid items={matches} />
      )}
    </div>
  );
}

function LessonGrid({ items }: { items: Lesson[] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {items.map((lesson) => (
        <article
          key={lesson.id}
          className="group flex flex-col rounded-xs border-2 border-line bg-paper shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-forest hover:shadow-md"
        >
          <Link href={`/learn/${lesson.slug}`} className="block overflow-hidden border-b border-line bg-cream relative">
            <LessonThumb tone={lesson.tone} className="h-[136px] w-full transition-transform duration-500 group-hover:scale-[1.03]" />
            <span className="absolute bottom-2.5 right-2.5 inline-flex items-center gap-1.5 rounded-sm bg-forest-deep/90 px-2 py-0.5 text-[10.5px] font-bold text-gold-light backdrop-blur-xs">
              <IconVideo className="h-3 w-3 text-gold-light" />
              {formatDuration(lesson.durationMin)}
            </span>
          </Link>
          <div className="flex flex-1 flex-col p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center rounded-sm border border-line-strong bg-cream px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-forest">
                {lesson.subject}
              </span>
              <span className="text-[11px] font-semibold text-stone">{gradeLabels[lesson.grade]}</span>
            </div>
            <h3 className="mt-2 text-[16px] font-bold leading-snug text-ink group-hover:text-forest transition-colors">
              <Link
                href={`/learn/${lesson.slug}`}
                className="hover:underline hover:underline-offset-2"
              >
                {lesson.title}
              </Link>
            </h3>
            <p className="mt-1 text-[13px] leading-relaxed text-ink/75 line-clamp-2">{lesson.summary}</p>
            <div className="mt-auto flex items-center justify-between gap-2 border-t border-line/70 pt-3 mt-3 text-[11.5px] text-stone">
              <span className="font-medium text-ink">Curator: {lesson.teacher}</span>
              <span className="font-bold text-forest group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                Open Lesson →
              </span>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
