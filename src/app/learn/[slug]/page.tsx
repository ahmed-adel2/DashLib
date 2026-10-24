import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { IconArrowLeft, IconArrowRight, IconClock, IconVideo } from "@/components/icons";
import { LessonThumb } from "@/components/lesson-thumb";
import { ShopShell } from "@/components/shop/shop-shell";
import { TaskSubmission } from "@/components/task-submission";
import { Badge, Panel, PanelHead, StarRule } from "@/components/ui";
import { getLesson, gradeLabels, lessons, tasksByLesson } from "@/lib/data";
import { formatDate, formatDuration } from "@/lib/format";

export function generateStaticParams() {
  return lessons.map((lesson) => ({ slug: lesson.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) return { title: "Lesson not found" };
  return { title: lesson.title, description: lesson.summary };
}

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lesson = getLesson(slug);

  if (!lesson) notFound();

  const index = lessons.findIndex((item) => item.id === lesson.id);
  const previous = index > 0 ? lessons[index - 1] : null;
  const next = index < lessons.length - 1 ? lessons[index + 1] : null;
  const lessonTasks = tasksByLesson(lesson.slug);

  return (
    <ShopShell active="learn">
      <div className="mx-auto w-full max-w-[1180px] px-5 py-6 sm:px-8">
        <Link
          href="/learn"
          className="inline-flex items-center gap-1.5 text-[12px] text-stone transition-colors hover:text-ink"
        >
          <IconArrowLeft className="h-3.5 w-3.5" />
          All lessons
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:items-start">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center rounded-sm bg-forest px-2.5 py-0.5 text-[10.5px] font-bold uppercase tracking-wider text-paper">
                {lesson.subject}
              </span>
              <span className="rounded-sm border border-line-strong bg-cream px-2 py-0.5 text-[11px] font-semibold text-stone">
                {gradeLabels[lesson.grade]}
              </span>
              <span className="num inline-flex items-center gap-1.5 rounded-sm bg-cream px-2 py-0.5 text-[11px] font-bold text-forest">
                <IconClock className="h-3.5 w-3.5 text-forest" />
                {formatDuration(lesson.durationMin)}
              </span>
            </div>

            <h1 className="mt-3.5 text-[34px] font-extrabold leading-[1.08] text-ink sm:text-[42px]">
              {lesson.title}
            </h1>
            <p className="mt-2 text-[13px] font-medium text-stone">
              Curated by <span className="text-ink font-semibold">{lesson.teacher}</span> · Published {formatDate(lesson.publishedAt)}
            </p>
            <p className="mt-4 max-w-[62ch] text-[15px] font-normal leading-relaxed text-ink/85">
              {lesson.summary}
            </p>

            <div className="mt-6">
              <div className="relative overflow-hidden rounded-xs border-2 border-line-strong shadow-sm">
                <LessonThumb tone={lesson.tone} className="aspect-[16/7] w-full" />
                <div className="absolute inset-0 flex items-center justify-center bg-forest-deep/20 backdrop-blur-[1px]">
                  <span className="inline-flex items-center gap-2.5 border-2 border-paper/80 bg-forest px-4 py-2 text-[12px] font-bold uppercase tracking-[0.14em] text-paper shadow-md">
                    <IconVideo className="h-4 w-4 text-gold-light" />
                    Official Syllabus Video Attached
                  </span>
                </div>
              </div>
              <p className="mt-2.5 text-[12px] leading-relaxed text-stone">
                Lesson video stream is active. Follow the timestamps below to cross-reference specific chapter discussions.
              </p>
            </div>

            <div className="mt-8 rounded-xs border-2 border-line bg-paper p-5">
              <div className="flex items-center justify-between border-b border-line pb-2.5">
                <span className="text-[12px] font-bold uppercase tracking-wider text-forest">Study Guide Outline</span>
                <span className="text-[11px] font-semibold text-stone">{lesson.chapters.length} Chapters</span>
              </div>
              <ol className="mt-3 divide-y divide-line">
                {lesson.chapters.map((chapter) => (
                  <li key={chapter.at} className="flex items-baseline gap-4 py-3">
                    <span className="num w-14 shrink-0 font-bold text-[13px] text-brick">{chapter.at}</span>
                    <span className="text-[14px] font-medium text-ink">{chapter.label}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-6 rounded-xs border-2 border-line bg-cream/70 p-5">
              <div className="flex items-center gap-2 text-forest">
                <StarRule label="Required Materials &amp; Desk Tools" />
              </div>
              <ul className="mt-3 flex flex-wrap gap-2.5">
                {lesson.materials.map((material) => (
                  <li
                    key={material}
                    className="rounded-sm border border-line-strong bg-paper px-3 py-1 text-[12px] font-semibold text-ink shadow-2xs"
                  >
                    {material}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:sticky lg:top-[92px]">
            {lessonTasks.length > 0 ? (
              <div className="space-y-4">
                {lessonTasks.map((task) => (
                  <TaskSubmission
                    key={task.id}
                    taskId={task.id}
                    title={task.title}
                    instructions={task.instructions}
                    due={task.due}
                    points={task.points}
                  />
                ))}
              </div>
            ) : (
              <Panel>
                <PanelHead title="No task attached" />
                <p className="px-4 py-4 text-[12.5px] leading-relaxed text-stone">
                  This lesson is a reference recording. Nothing to hand in.
                </p>
              </Panel>
            )}

            <div className="mt-4 flex items-center justify-between gap-3 border border-line bg-paper px-4 py-3">
              {previous ? (
                <Link
                  href={`/learn/${previous.slug}`}
                  className="inline-flex min-w-0 items-center gap-1.5 text-[11.5px] text-stone hover:text-ink"
                >
                  <IconArrowLeft className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{previous.title}</span>
                </Link>
              ) : (
                <span />
              )}
              {next ? (
                <Link
                  href={`/learn/${next.slug}`}
                  className="inline-flex min-w-0 items-center gap-1.5 text-right text-[11.5px] text-stone hover:text-ink"
                >
                  <span className="truncate">{next.title}</span>
                  <IconArrowRight className="h-3.5 w-3.5 shrink-0" />
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </ShopShell>
  );
}
