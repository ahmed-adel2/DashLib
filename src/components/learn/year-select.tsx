"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { IconCheck, IconChevronDown } from "@/components/icons";
import type { GradeBand } from "@/lib/data";

const years: { value: GradeBand | "all"; label: string }[] = [
  { value: "all", label: "All years" },
  { value: "elementary", label: "Elementary" },
  { value: "middle", label: "Middle school" },
  { value: "high", label: "High school" },
];

/** Roughly the height of the menu: caption plus four rows. */
const menuHeight = 200;

/**
 * Picks the grade band shown in the lesson list. The choice lives in `?year=`
 * so it survives a reload and can be combined with the `?q=` search term.
 * A native select renders its own unstyled popup that drifts away from the
 * control, so the menu here is ours and anchored to the trigger.
 */
export function YearSelect({ year, query }: { year: GradeBand | "all"; query: string }) {
  const router = useRouter();
  const menuId = useId();
  // Mirrored in state so the control responds immediately, then follows the
  // URL again once the filtered list has rendered (or on back/forward).
  const [value, setValue] = useState<GradeBand | "all">(year);
  const [open, setOpen] = useState(false);
  const [dropUp, setDropUp] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setValue(year);
  }, [year]);

  // Focus the current choice so the keyboard lands inside the menu.
  useEffect(() => {
    if (!open) return;
    menu.current
      ?.querySelector<HTMLButtonElement>('[role="menuitemradio"][aria-checked="true"]')
      ?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && root.current?.contains(event.target)) return;
      setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const openMenu = () => {
    const rect = trigger.current?.getBoundingClientRect();
    // Flip above the button instead of running off the bottom of the viewport.
    setDropUp(rect ? window.innerHeight - rect.bottom < menuHeight : false);
    setOpen(true);
  };

  const select = (option: GradeBand | "all") => {
    setValue(option);
    setOpen(false);
    trigger.current?.focus();

    const params = new URLSearchParams();
    const term = query.trim();
    if (term) params.set("q", term);
    if (option !== "all") params.set("year", option);

    const search = params.toString();
    router.push(search ? `/learn?${search}` : "/learn");
  };

  const onMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const options = Array.from(
      menu.current?.querySelectorAll<HTMLButtonElement>("[data-year-option]") ?? [],
    );
    if (options.length === 0) return;

    const index = options.indexOf(document.activeElement as HTMLButtonElement);

    if (event.key === "ArrowDown") {
      event.preventDefault();
      options[(index + 1) % options.length]?.focus();
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      options[(index - 1 + options.length) % options.length]?.focus();
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      trigger.current?.focus();
      return;
    }

    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
      trigger.current?.focus();
    }
  };

  return (
    <div ref={root} className="relative">
      <button
        ref={trigger}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={(event) => {
          if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
          event.preventDefault();
          if (!open) openMenu();
        }}
        className="inline-flex h-9 items-center gap-2 rounded-sm border border-line-field bg-paper px-2.5 text-[12px] text-ink transition-colors hover:border-line-strong"
      >
        <span className="text-stone">Year</span>
        <span className="font-medium">{years.find((option) => option.value === value)?.label}</span>
        <IconChevronDown
          className={`h-3 w-3 text-stone transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open ? (
        <div
          ref={menu}
          id={menuId}
          role="menu"
          aria-label="Lesson year"
          onKeyDown={onMenuKeyDown}
          className={`absolute right-0 z-40 w-[184px] overflow-hidden rounded-sm border border-line bg-paper py-1 shadow-[0_18px_40px_-24px_rgba(22,36,28,0.55)] ${
            dropUp ? "bottom-full mb-1" : "top-full mt-1"
          }`}
        >
          <div role="presentation" className="lbl px-2.5 pb-1.5 pt-1">
            Show year
          </div>

          {years.map((option) => {
            const selected = value === option.value;
            return (
              <button
                key={option.value}
                type="button"
                role="menuitemradio"
                aria-checked={selected}
                data-year-option
                onClick={() => select(option.value)}
                className={`flex w-full items-center justify-between gap-2 px-2.5 py-2 text-left text-[12.5px] transition-colors ${
                  selected ? "bg-sage font-medium text-forest" : "text-ink hover:bg-cream"
                }`}
              >
                {option.label}
                {selected ? <IconCheck className="h-3.5 w-3.5" /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
