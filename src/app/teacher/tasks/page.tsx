import type { Metadata } from "next";
import { TaskBoard } from "@/components/teacher/task-board";
import { PageHeading } from "@/components/ui";
import { demoTeacher, lessonsByTeacher, tasks } from "@/lib/data";

export const metadata: Metadata = {
  title: "Tasks",
};

export default function TeacherTasksPage() {
  const myLessons = lessonsByTeacher(demoTeacher.id);
  const slugs = new Set(myLessons.map((lesson) => lesson.slug));
  const myTasks = tasks.filter((task) => slugs.has(task.lessonSlug));
  const toMark = myTasks.reduce((total, task) => total + (task.assigned - task.submitted), 0);

  return (
    <div>
      <PageHeading
        title="Tasks"
        meta={
          <>
            <span>{myTasks.length} open</span>
            <span aria-hidden="true" className="text-moss">
              /
            </span>
            <span>{toMark} answers waiting to be marked</span>
          </>
        }
      />

      <TaskBoard initial={myTasks} lessonOptions={myLessons} />
    </div>
  );
}
