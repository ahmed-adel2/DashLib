"use client";

import { useEffect, useState } from "react";
import { IconClock } from "@/components/icons";
import { formatClock, formatElapsed } from "@/lib/format";
import { useNow } from "@/lib/use-now";

const STORAGE_KEY = "dashlib.shift.v1";

type ClosedShift = { startedAt: string; endedAt: string };
type ShiftState = { startedAt: string | null; closed: ClosedShift[] };

const emptyState: ShiftState = { startedAt: null, closed: [] };

const isClosed = (value: unknown): value is ClosedShift => {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as { startedAt?: unknown; endedAt?: unknown };
  return typeof candidate.startedAt === "string" && typeof candidate.endedAt === "string";
};

const readState = (): ShiftState => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState;
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return emptyState;
    const candidate = parsed as { startedAt?: unknown; closed?: unknown };
    return {
      startedAt: typeof candidate.startedAt === "string" ? candidate.startedAt : null,
      closed: Array.isArray(candidate.closed) ? candidate.closed.filter(isClosed) : [],
    };
  } catch {
    return emptyState;
  }
};

const writeState = (next: ShiftState) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* private mode: keep the session state in memory only */
  }
};

export function ShiftClock({ branchName }: { branchName: string }) {
  const now = useNow(1000);
  const [state, setState] = useState<ShiftState>(emptyState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(readState());
    setHydrated(true);
  }, []);

  const clockIn = () => {
    const next: ShiftState = { ...state, startedAt: new Date().toISOString() };
    setState(next);
    writeState(next);
  };

  const clockOut = () => {
    if (!state.startedAt) return;
    const next: ShiftState = {
      startedAt: null,
      closed: [...state.closed, { startedAt: state.startedAt, endedAt: new Date().toISOString() }],
    };
    setState(next);
    writeState(next);
  };

  const elapsed =
    now && state.startedAt
      ? formatElapsed(now.getTime() - new Date(state.startedAt).getTime())
      : "00:00:00";

  const onShift = Boolean(state.startedAt);
  const dayLabel = now
    ? now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
    : "Today";

  return (
    <div className="grid sm:grid-cols-[1.05fr_1fr]">
      <div className="bg-forest px-5 py-5 text-paper">
        <div className="flex items-center justify-between gap-3">
          <span className="lbl text-gold-light">Shift clock</span>
          <span className="text-[10.5px] text-paper/55">{branchName}</span>
        </div>

        <div className="num mt-4 font-display text-[44px] leading-none sm:text-[50px]">
          {now ? formatClock(now) : "--:--"}
        </div>
        <p className="mt-1.5 text-[11.5px] text-paper/60">{dayLabel}</p>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          {onShift ? (
            <button
              type="button"
              onClick={clockOut}
              className="inline-flex h-10 items-center gap-2 rounded-sm border border-paper/30 px-4 text-[13px] font-medium text-paper transition-colors hover:bg-white/10"
            >
              <IconClock className="h-4 w-4" />
              Clock out
            </button>
          ) : (
            <button
              type="button"
              onClick={clockIn}
              className="inline-flex h-10 items-center gap-2 rounded-sm bg-gold-light px-4 text-[13px] font-medium text-forest-deep transition-colors hover:bg-gold-lift"
            >
              <IconClock className="h-4 w-4" />
              Clock in
            </button>
          )}

          <span className="num text-[12px] text-gold-light">
            {onShift ? elapsed : "No open shift"}
          </span>
        </div>
      </div>

      <div className="px-5 py-5">
        <span className="lbl">Today at a glance</span>

        <dl className="mt-3 space-y-2.5 text-[12px]">
          <div className="flex items-center justify-between gap-3">
            <dt className="text-stone">Status</dt>
            <dd className="inline-flex items-center gap-1.5 text-ink">
              <span
                aria-hidden="true"
                className={`h-1.5 w-1.5 rounded-full ${onShift ? "bg-forest" : "bg-moss"}`}
              />
              <span role="status">{onShift ? "On shift" : "Not on shift"}</span>
            </dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-stone">Started</dt>
            <dd className="num text-ink">
              {state.startedAt
                ? formatClock(new Date(state.startedAt))
                : hydrated
                  ? "—"
                  : "…"}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-stone">Closed shifts on this device</dt>
            <dd className="num text-ink">{state.closed.length}</dd>
          </div>
        </dl>

        <p className="mt-4 border-t border-line pt-3 text-[10.5px] leading-relaxed text-stone">
          Entry and departure times record on this device. The office reads them from the shifts
          table once Supabase is connected.
        </p>
      </div>
    </div>
  );
}
