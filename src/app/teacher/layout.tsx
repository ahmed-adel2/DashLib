import { TeacherShell } from "@/components/portal/teacher-shell";

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return <TeacherShell>{children}</TeacherShell>;
}
