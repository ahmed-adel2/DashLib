import type { Metadata } from "next";
import { LessonLibrary } from "@/components/teacher/lesson-library";
import { PageHeading } from "@/components/ui";
import { demoTeacher, lessonsByTeacher } from "@/lib/data";

export const metadata: Metadata = {
  title: "Lessons",
};

export default function TeacherLessonsPage() {
  const myLessons = lessonsByTeacher(demoTeacher.id);

  return (
    <div>
      <PageHeading
        title="Lessons"
        meta={
          <>
            <span>{myLessons.length} published</span>
            <span aria-hidden="true" className="text-moss">
              /
            </span>
            <span>Upload a recording and outline, then attach a task</span>
          </>
        }
      />

      <LessonLibrary
        initial={myLessons}
        teacherName={demoTeacher.name}
        teacherId={demoTeacher.id}
      />
    </div>
  );
}
