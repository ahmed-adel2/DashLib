"use client";

import { IconDownload } from "@/components/icons";
import { Button } from "@/components/ui";
import { downloadWorkbook, type Sheet } from "@/lib/export";

export function ExportButton({
  filename,
  sheets,
  label = "Export to Excel",
  variant = "secondary",
  size = "sm",
}: {
  filename: string;
  sheets: Sheet[];
  label?: string;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}) {
  return (
    <Button variant={variant} size={size} onClick={() => downloadWorkbook(filename, sheets)}>
      <IconDownload className="h-3.5 w-3.5" />
      {label}
    </Button>
  );
}
