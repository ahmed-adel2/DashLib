"use client";

import Link from "next/link";
import { useState } from "react";
import { IconCheck } from "@/components/icons";
import { Badge, Button, Field, Meter, Panel, PanelHead, StarRule } from "@/components/ui";
import { ScrollShade } from "@/components/ui/scroll-shade";
import type { Lesson, Task } from "@/lib/data";
import { formatDate } from "@/lib/format";

export function TaskBoard({ initial, lessonOptions }: { initial: Task[]; lessonOptions: Lesson[] }) {
  const [tasks, setTasks] = useState<Task[]>(initial);
  const [title, setTitle] = useState("");
  const [lessonSlug, setLessonSlug] = useState(lessonOptions[0]?.slug ?? "");
  const [due, setDue] = useState("2026-11-06");
  const [points, setPoints] = useState("10");
  const [instructions, setInstructions] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const addTask = () => {
    const lesson = lessonOptions.find((item) => item.slug === lessonSlug);
    if (!lesson) {
      setError("Choose the lesson this task belongs to.");
      return;
    }
    if (title.trim().length < 3) {
      setError("Give the task a title students will recognise.");
      return;
    }
    const score = Number.parseInt(points, 10);
    if (!Number.isFinite(score) || score < 1 || score > 100) {
      setError("Points should be between 1 and 100.");
      return;
    }
    if (instructions.trim().length < 10) {
      setError("Write the instructions students should follow.");
      return;
    }

    const newTask: Task = {
      id: `local-${Date.now()}`,
      title: title.trim(),
      lessonSlug: lesson.slug,
      subject: lesson.subject,
      grade: lesson.grade,
      due,
      submitted: 0,
      assigned: 24,
      points: score,
      instructions: instructions.trim(),
    };

    setTasks((current) => [newTask, ...current]);
    setNotice(`“${newTask.title}” is open for 24 students.`);
    setError(null);
    setTitle("");
    setInstructions("");
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_360px] xl:items-start">
      <Panel className="min-w-0">
        <PanelHead title="Open tasks" hint={`${tasks.length} tasks`} />
        <ScrollShade>
          <table className="tbl tbl-stack">
            <thead>
              <tr>
                <th>Task</th>
                <th>Due</th>
                <th>Handed in</th>
                <th className="num">Points</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td>
                    <span className="block text-[13px] font-medium text-ink">{task.title}</span>
                    <span className="block text-[11px] text-stone">
                      {task.subject} · {task.grade === "high" ? "High school" : task.grade === "middle" ? "Middle school" : "Elementary"}
                    </span>
                  </td>
                  <td className="text-[12px] text-stone" data-label="Due">
                    {formatDate(task.due)}
                  </td>                    <td className="min-w-[140px]" data-label="Handed in">
                    <div className="flex items-center gap-2">
                      <span className="num text-[11.5px] text-ink">
                        {task.submitted}/{task.assigned}
                      </span>
                      <Meter
                        value={task.submitted}
                        max={task.assigned}
                        tone={task.submitted / task.assigned < 0.5 ? "gold" : "forest"}
                      />
                    </div>
                  </td>
                  <td className="num text-right text-[12px] text-stone" data-label="Points">
                    {task.points}
                  </td>
                  <td className="text-right">
                    <Link
                      href={`/learn/${task.lessonSlug}`}
                      className="text-[11.5px] text-forest hover:underline"
                    >
                      Lesson
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollShade>
        <div className="border-t border-line px-4 py-3">
          <p className="text-[11px] leading-relaxed text-stone">
            Submission counts are sample data. Once students have accounts, this column reads from
            the submissions table.
          </p>
        </div>
      </Panel>

      <Panel ticks className="p-4">
        <StarRule label="New task" />
        <div className="mt-4 space-y-3.5">
          <Field label="Task title" htmlFor="task-title">
            <input
              id="task-title"
              className="field"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Fractions practice set"
            />
          </Field>

          <Field label="Attach to lesson" htmlFor="task-lesson">
            <select
              id="task-lesson"
              className="field"
              value={lessonSlug}
              onChange={(event) => setLessonSlug(event.target.value)}
            >
              {lessonOptions.map((lesson) => (
                <option key={lesson.id} value={lesson.slug}>
                  {lesson.title}
                </option>
              ))}
            </select>
          </Field>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Due date" htmlFor="task-due">
              <input
                id="task-due"
                type="date"
                className="field num"
                value={due}
                onChange={(event) => setDue(event.target.value)}
              />
            </Field>
            <Field label="Points" htmlFor="task-points">
              <input
                id="task-points"
                type="number"
                min={1}
                max={100}
                className="field num"
                value={points}
                onChange={(event) => setPoints(event.target.value)}
              />
            </Field>
          </div>

          <Field label="Instructions" htmlFor="task-instructions">
            <textarea
              id="task-instructions"
              className="field min-h-[88px] resize-y"
              value={instructions}
              onChange={(event) => setInstructions(event.target.value)}
              placeholder="What should students do, and what should they hand in?"
            />
          </Field>

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

          <div className="flex items-center justify-between gap-2">
            <Button size="sm" onClick={addTask}>
              Create task
            </Button>
            <Badge tone="outline">Assigns to 24 students</Badge>
          </div>
        </div>
      </Panel>
    </div>
  );
}
