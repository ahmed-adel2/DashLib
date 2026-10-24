"use client";

import { useEffect, useState } from "react";

/**
 * Returns the current time, null until the component has mounted so the first
 * client render matches the server render.
 */
export function useNow(intervalMs = 1000) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);

  return now;
}
