import type { ReactNode } from "react";
import { PortalShell } from "@/components/portal/portal-shell";

export function AdminShell({ children }: { children: ReactNode }) {
  return <PortalShell variant="admin">{children}</PortalShell>;
}
