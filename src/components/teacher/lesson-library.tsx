"use client";

import Link from "next/link";
import { useState } from "react";
import { IconCheck, IconUpload } from "@/components/icons";
import { Badge, Button, Field, Panel, PanelHead, StarRule } from "@/components/ui";
import { ScrollShade } from "@/components/ui/scroll-shade";
import { gradeLabels, type GradeBand, type Lesson, type LessonStatus } from "@/lib/data";
import { formatDate, formatDuration } from "@/lib/format";

const subjects = ["Mathematics", "Science", "Arabic", "English"];

const statusTone: Record<LessonStatus, "forest" | "gold" | "neutral"> = {
  published: "forest",
  draft: "gold",
  processing: "neutral",
};

const statusLabel: Record<LessonStatus, string> = {
  published: "Published",
  draft: "Draft",
  processing: "Processing",
};

export function LessonLibrary({
  initial,
  teacherName,
  teacherId,
}: {
  initial: Lesson[];
  teacherName: string;
  teacherId: string;
}) {
  const [lessons, setLessons] = useState<Lesson[]>(initial);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState(subjects[0]);
  const [grade, setGrade] = useState<GradeBand>("middle");
  const [duration, setDuration] = useState("20");
  const [summary, setSummary] = useState("");
  const [file, setFile] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const addLesson = (status: LessonStatus) => {
    if (title.trim().length < 3) {
      setError("Give the lesson a title of at least three characters.");
      return;
    }
    const minutes = Number.parseInt(duration, 10);
    if (!Number.isFinite(minutes) || minutes < 1 || minutes > 180) {
      setError("Length should be between 1 and 180 minutes.");
      return;
    }
    if (summary.trim().length < 10) {
      setError("Add a one-line summary so students know what the lesson covers.");
      return;
    }

    const newLesson: Lesson = {
      id: `local-${Date.now()}`,
      slug: `local-${Date.now()}`,
      title: title.trim(),
      subject,
      grade,
      teacherId,
      teacher: teacherName,
      durationMin: minutes,
      publishedAt: new Date().toISOString().slice(0, 10),
      summary: summary.trim(),
      chapters: [],
      materials: [],
      status,
      tone: 1,
    };

    setLessons((current) => [newLesson, ...current]);
    setNotice(
      status === "published"
        ? `“${newLesson.title}” added and published to your class.`
        : `“${newLesson.title}” saved as a draft.`,
    );
    setError(null);
    setTitle("");
    setSummary("");
    setFile(null);
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_360px] xl:items-start">
      <Panel className="min-w-0">
        <PanelHead title="Your lesson library" hint={`${lessons.length} lessons`} />
        <ScrollShade>
          <table className="tbl">
            <thead>
              <tr>
                <th>Lesson</th>
                <th>Grade</th>
                <th className="num">Length</th>
                <th>Status</th>
                <th className="num">Added</th>
              </tr>
            </thead>
            <tbody>
              {lessons.map((lesson) => (
                <tr key={lesson.id}>
                  <td>
                    <span className="block text-[13px] font-medium text-ink">{lesson.title}</span>
                    <span className="block text-[11px] text-stone">
                      {lesson.subject} · {lesson.chapters.length} chapters
                    </span>
                  </td>
                  <td className="text-[12px] text-stone" data-label="Grade">
                    {gradeLabels[lesson.grade]}
                  </td>
                  <td className="num text-[12px] text-stone" data-label="Length">
                    {formatDuration(lesson.durationMin)}
                  </td>
                  <td data-label="Status">
                    <Badge tone={statusTone[lesson.status]}>{statusLabel[lesson.status]}</Badge>
                  </td>
                  <td className="num text-right text-[11.5px] text-stone" data-label="Added">
                    {lesson.slug.startsWith("local-") ? (
                      "Just now"
                    ) : (
                      <Link
                        href={`/learn/${lesson.slug}`}
                        className="text-forest hover:underline"
                      >
                        {formatDate(lesson.publishedAt)}
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollShade>
        <div className="border-t border-line px-4 py-3">
          <p className="text-[11px] leading-relaxed text-stone">
            New lessons stay in this browser for the demo. Recording storage and the published
            lesson row are the Supabase pieces still to connect.
          </p>
        </div>
      </Panel>

      <Panel ticks className="p-4">
        <StarRule label="Upload a lesson" />
        <div className="mt-4 space-y-3.5">
          <Field label="Lesson title" htmlFor="lesson-title">
            <input
              id="lesson-title"
              className="field"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Fractions that stick"
            />
          </Field>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Subject" htmlFor="lesson-subject">
              <select
                id="lesson-subject"
                className="field"
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
              >
                {subjects.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Grade" htmlFor="lesson-grade">
              <select
                id="lesson-grade"
                className="field"
                value={grade}
                onChange={(event) => setGrade(event.target.value as GradeBand)}
              >
                {(Object.keys(gradeLabels) as GradeBand[]).map((item) => (
                  <option key={item} value={item}>
                    {gradeLabels[item]}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Length (minutes)" htmlFor="lesson-duration">
            <input
              id="lesson-duration"
              className="field num"
              type="number"
              min={1}
              max={180}
              value={duration}
              onChange={(event) => setDuration(event.target.value)}
            />
          </Field>

          <Field label="Summary" htmlFor="lesson-summary">
            <textarea
              id="lesson-summary"
              className="field min-h-[72px] resize-y"
              value={summary}
              onChange={(event) => setSummary(event.target.value)}
              placeholder="What does this lesson cover in one sentence?"
            />
          </Field>

          <div>
            <span className="lbl mb-1.5 block">Video file</span>
            <label
              htmlFor="lesson-file"
              className="flex cursor-pointer flex-col items-center gap-2 border border-dashed border-moss bg-cream px-3 py-5 text-center transition-colors hover:border-forest"
            >
              <IconUpload className="h-4 w-4 text-forest" />
              <span className="text-[12px] font-medium text-ink">
                {file ?? "Choose a recording"}
              </span>
              <span className="text-[10.5px] text-stone">MP4 or MOV, up to 2 GB</span>
            </label>
            <input
              id="lesson-file"
              type="file"
              accept="video/*"
              onChange={(event) => setFile(event.target.files?.[0]?.name ?? null)}
              className="sr-only"
            />
          </div>

          {error ? (
            <p role="alert" className="border border-brick/30 bg-brick-wash px-3 py-2 text-[11.5px] text-brick">
              {error}
            </p>
          ) : null}

          {notice ? (
            <p className="flex items-start gap-2 border border-line bg-forest-tint px-3 py-2 text-[11.5px] text-forest">
              <IconCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              {notice}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={() => addLesson("published")}>
              Publish lesson
            </Button>
            <Button variant="secondary" size="sm" onClick={() => addLesson("draft")}>
              Save as draft
            </Button>
          </div>
        </div>
      </Panel>
    </div>
  );
}
