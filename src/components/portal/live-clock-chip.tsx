"use client";

import { formatClock } from "@/lib/format";
import { useNow } from "@/lib/use-now";

export function LiveClockChip() {
  const now = useNow(20000);

  return (
    <span className="num inline-flex items-center gap-1.5 text-[11.5px] text-stone">
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-forest" />
      {now ? formatClock(now) : "--:--"}
    </span>
  );
}
