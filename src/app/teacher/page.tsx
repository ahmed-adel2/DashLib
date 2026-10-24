import type { Metadata } from "next";
import Link from "next/link";
import { IconArrowRight, IconPlus, IconUpload } from "@/components/icons";
import { ShiftClock } from "@/components/teacher/shift-clock";
import {
  Badge,
  ButtonLink,
  DataNote,
  Meter,
  Panel,
  PanelHead,
  PageHeading,
  StarRule,
} from "@/components/ui";
import { branches, demoTeacher, lessonsByTeacher, shifts, tasks } from "@/lib/data";
import { formatDate, formatDuration } from "@/lib/format";

export const metadata: Metadata = {
  title: "My day",
};

const myLessons = lessonsByTeacher(demoTeacher.id);
const mySlugs = new Set(myLessons.map((lesson) => lesson.slug));
const myTasks = tasks.filter((task) => mySlugs.has(task.lessonSlug));
const branch = branches.find((item) => item.id === demoTeacher.branch);
const weeklyHours = Math.round(shifts.reduce((total, shift) => total + shift.hours, 0) * 10) / 10;
const toMark = myTasks.reduce((total, task) => total + (task.assigned - task.submitted), 0);

export default function TeacherOverviewPage() {
  return (
    <div>
      <PageHeading
        title="My day"
        meta={
          <>
            <span>{demoTeacher.name}</span>
            <span aria-hidden="true" className="text-moss">
              /
            </span>
            <span>{demoTeacher.title}</span>
            <span aria-hidden="true" className="text-moss">
              /
            </span>
            <span>{branch?.name ?? "Main Branch"}</span>
          </>
        }
        actions={
          <>
            <ButtonLink href="/teacher/lessons" size="sm">
              <IconUpload className="h-3.5 w-3.5" />
              Upload lesson
            </ButtonLink>
            <ButtonLink href="/teacher/tasks" variant="secondary" size="sm">
              <IconPlus className="h-3.5 w-3.5" />
              Create task
            </ButtonLink>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel ticks className="overflow-hidden lg:col-span-2">
          <ShiftClock branchName={branch?.name ?? "Main Branch"} />
        </Panel>

        <Panel>
          <PanelHead title="Recent shifts" hint={`Last ${shifts.length} records`} />
          <div className="space-y-4 p-4">
            <div>
              <div className="lbl">Hours logged</div>
              <div className="num mt-1.5 font-display text-[30px] leading-none text-ink">
                {weeklyHours.toFixed(1)}
              </div>
              <p className="mt-1 text-[11px] text-stone">
                Across {shifts.length} recorded shifts · average {(weeklyHours / shifts.length).toFixed(1)} h
              </p>
            </div>

            <StarRule />

            <dl className="space-y-2 text-[12px]">
              <div className="flex items-center justify-between">
                <dt className="text-stone">Lessons published</dt>
                <dd className="num text-ink">{myLessons.length}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-stone">Open tasks</dt>
                <dd className="num text-ink">{myTasks.length}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-stone">Answers to mark</dt>
                <dd className="num text-ink">{toMark}</dd>
              </div>
            </dl>

            <Link
              href="/teacher/hours"
              className="link-quiet inline-flex items-center gap-1.5 text-[11.5px] text-forest"
            >
              Shift history
              <IconArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </Panel>

        <Panel className="lg:col-span-2">
          <PanelHead
            title="Your lessons"
            hint={`${myLessons.length} published`}
            action={
              <Link href="/teacher/lessons" className="link-quiet text-[11.5px] text-forest">
                Manage
              </Link>
            }
          />
          <ul className="divide-y divide-line">
            {myLessons.map((lesson) => (
              <li key={lesson.id} className="flex flex-wrap items-center gap-3 px-4 py-3.5">
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/learn/${lesson.slug}`}
                    className="text-[13.5px] font-medium leading-snug text-ink hover:underline hover:underline-offset-2"
                  >
                    {lesson.title}
                  </Link>
                  <p className="mt-0.5 text-[11.5px] text-stone">
                    {lesson.subject} · {formatDuration(lesson.durationMin)} ·{" "}
                    {lesson.chapters.length} chapters
                  </p>
                </div>
                <span className="num text-[11px] text-stone">{formatDate(lesson.publishedAt)}</span>
                <Badge tone="neutral">Published</Badge>
              </li>
            ))}
          </ul>
          <div className="border-t border-line px-4 py-3">
            <DataNote>
              Lessons and tasks here are sample rows. Uploaded recordings will replace them once
              storage is connected.
            </DataNote>
          </div>
        </Panel>

        <Panel>
          <PanelHead title="Tasks to mark" hint={`${toMark} answers`} />
          <ul className="divide-y divide-line">
            {myTasks.map((task) => (
              <li key={task.id} className="px-4 py-3.5">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[12.5px] font-medium leading-snug text-ink">{task.title}</span>
                  <span className="num shrink-0 text-[11px] text-stone">
                    {task.submitted}/{task.assigned}
                  </span>
                </div>
                <div className="mt-2">
                  <Meter value={task.submitted} max={task.assigned} />
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px] text-stone">
                  <span>Due {formatDate(task.due)}</span>
                  <Link href="/teacher/tasks" className="text-forest hover:underline">
                    Open
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
