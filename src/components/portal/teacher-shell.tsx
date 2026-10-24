import type { ReactNode } from "react";
import { PortalShell } from "@/components/portal/portal-shell";

export function TeacherShell({ children }: { children: ReactNode }) {
  return <PortalShell variant="teacher">{children}</PortalShell>;
}
