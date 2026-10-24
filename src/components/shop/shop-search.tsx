"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { IconBook, IconCheck, IconChevronDown, IconSearch, IconVideo } from "@/components/icons";
import { searchSuggestions, type SearchScope, type SearchSuggestion } from "@/lib/search";

const placeholders: Record<SearchScope, string> = {
  store: "Search products…",
  lessons: "Search lessons…",
};

const scopeLabels: Record<SearchScope, string> = {
  store: "Store",
  lessons: "Lessons",
};

/**
 * One search bar for both catalogs: the scope control on the left picks which
 * index is searched, typing lists matching items, and picking one opens that
 * item's own page — products under `/product`, lessons under `/learn`.
 * Submitting without picking shows the filtered listing for the chosen scope.
 */
export function ShopSearch({
  id,
  className = "",
  onSubmitted,
}: {
  id: string;
  className?: string;
  onSubmitted?: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get("q") ?? "";
  const pageScope: SearchScope = pathname.startsWith("/learn") ? "lessons" : "store";

  const [scope, setScope] = useState<SearchScope>(pageScope);
  const [value, setValue] = useState(current);
  const [open, setOpen] = useState(false);
  const [scopeOpen, setScopeOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const form = useRef<HTMLFormElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const scopeButton = useRef<HTMLButtonElement>(null);
  const scopeMenu = useRef<HTMLDivElement>(null);

  // The field mirrors `?q=` so a reload, back navigation or shared link shows
  // the term that is actually filtering the page.
  useEffect(() => {
    setValue(current);
  }, [current]);

  useEffect(() => {
    setScope(pageScope);
  }, [pageScope]);

  const suggestions = useMemo(() => searchSuggestions(scope, value), [scope, value]);
  const query = value.trim();
  const showPanel = open && query.length > 0;
  const activeId =
    activeIndex >= 0 && suggestions[activeIndex] ? `${id}-${suggestions[activeIndex].id}` : undefined;

  useEffect(() => {
    if (!open && !scopeOpen) return;

    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && form.current?.contains(event.target)) return;
      setOpen(false);
      setScopeOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open, scopeOpen]);

  // The category menu is a page-styled list rather than a native select, so it
  // always opens directly under its trigger and can be keyboard-driven.
  useEffect(() => {
    if (!scopeOpen) return;
    scopeMenu.current
      ?.querySelector<HTMLButtonElement>('[role="menuitemradio"][aria-checked="true"]')
      ?.focus();
  }, [scopeOpen]);

  const choose = (suggestion: SearchSuggestion) => {
    setOpen(false);
    setScopeOpen(false);
    setActiveIndex(-1);
    onSubmitted?.();
    router.push(suggestion.href);
  };

  const submit = () => {
    const target = scope === "store" ? "/" : "/learn";
    setOpen(false);
    setScopeOpen(false);
    setActiveIndex(-1);
    onSubmitted?.();
    router.push(query ? `${target}?q=${encodeURIComponent(query)}` : target);
  };

  const onScopeMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const options = Array.from(
      scopeMenu.current?.querySelectorAll<HTMLButtonElement>("[data-scope-option]") ?? [],
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
      event.stopPropagation();
      setScopeOpen(false);
      scopeButton.current?.focus();
      return;
    }

    if (event.key === "Tab") {
      event.preventDefault();
      setScopeOpen(false);
      if (event.shiftKey) scopeButton.current?.focus();
      else input.current?.focus();
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      if (suggestions.length === 0) return;
      event.preventDefault();
      setOpen(true);
      setActiveIndex((index) => (index + 1) % suggestions.length);
      return;
    }

    if (event.key === "ArrowUp") {
      if (suggestions.length === 0) return;
      event.preventDefault();
      setOpen(true);
      setActiveIndex((index) => (index <= 0 ? suggestions.length - 1 : index - 1));
      return;
    }

    if (event.key === "Escape") {
      if (showPanel) event.stopPropagation();
      setOpen(false);
      setActiveIndex(-1);
      return;
    }

    if (event.key === "Enter" && showPanel && activeIndex >= 0 && suggestions[activeIndex]) {
      event.preventDefault();
      choose(suggestions[activeIndex]);
    }
  };

  return (
    <form
      ref={form}
      role="search"
      className={`relative ${className}`}
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
    >
      <div className="flex h-10 items-stretch rounded-sm border border-line-field bg-paper transition-colors focus-within:border-forest focus-within:ring-2 focus-within:ring-forest/25">
        <div className="relative flex shrink-0 items-center">
          <button
            ref={scopeButton}
            type="button"
            aria-haspopup="menu"
            aria-expanded={scopeOpen}
            aria-controls={scopeOpen ? `${id}-scope-menu` : undefined}
            onClick={() => {
              setOpen(false);
              setActiveIndex(-1);
              setScopeOpen((current) => !current);
            }}
            onKeyDown={(event) => {
              if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
              event.preventDefault();
              setOpen(false);
              setScopeOpen(true);
            }}
            className="flex h-full w-[112px] cursor-pointer items-center justify-between gap-1.5 bg-transparent pl-2.5 pr-2 text-left text-[16px] font-medium text-ink transition-colors hover:bg-cream focus-visible:outline-none sm:w-[96px] sm:text-[12px]"
          >
            <span className="truncate">
              <span className="sr-only">Search in </span>
              {scopeLabels[scope]}
            </span>
            <IconChevronDown
              className={`h-3 w-3 shrink-0 text-stone transition-transform ${
                scopeOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {scopeOpen ? (
            <div
              ref={scopeMenu}
              id={`${id}-scope-menu`}
              role="menu"
              aria-label="Search in"
              onKeyDown={onScopeMenuKeyDown}
              className="absolute left-0 top-full z-50 mt-1 w-[188px] overflow-hidden rounded-sm border border-line bg-paper py-1 shadow-[0_18px_40px_-24px_rgba(22,36,28,0.55)]"
            >
              <div role="presentation" className="lbl px-2.5 pb-1.5 pt-1">
                Search in
              </div>
              {(["store", "lessons"] as SearchScope[]).map((option) => {
                const selected = scope === option;
                return (
                  <button
                    key={option}
                    type="button"
                    role="menuitemradio"
                    aria-checked={selected}
                    data-scope-option
                    onClick={() => {
                      setScope(option);
                      setActiveIndex(-1);
                      setScopeOpen(false);
                      input.current?.focus();
                    }}
                    className={`flex w-full items-center justify-between gap-2 px-2.5 py-2 text-left text-[12.5px] transition-colors ${
                      selected ? "bg-sage font-medium text-forest" : "text-ink hover:bg-cream"
                    }`}
                  >
                    {scopeLabels[option]}
                    {selected ? <IconCheck className="h-3.5 w-3.5" /> : null}
                  </button>
                );
              })}
              <p
                role="presentation"
                className="border-t border-line px-2.5 pb-0.5 pt-2 text-[10.5px] leading-snug text-stone"
              >
                Products or lesson videos
              </p>
            </div>
          ) : null}
        </div>

        <span className="my-2 w-px shrink-0 bg-line" aria-hidden="true" />

        <div className="relative min-w-0 flex-1">
          <IconSearch className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-stone" />
          <input
            ref={input}
            id={id}
            type="search"
            name="q"
            role="combobox"
            aria-expanded={showPanel}
            aria-controls={showPanel ? `${id}-suggestions` : undefined}
            aria-autocomplete="list"
            aria-activedescendant={activeId}
            aria-label={scope === "store" ? "Search the store" : "Search lessons"}
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
              setOpen(true);
              setActiveIndex(-1);
            }}
            onFocus={() => {
              setScopeOpen(false);
              setOpen(true);
            }}
            onKeyDown={onKeyDown}
            placeholder={placeholders[scope]}
            maxLength={100}
            spellCheck={false}
            autoComplete="off"
            className="h-full w-full bg-transparent pl-7 pr-2 text-[16px] text-ink focus:outline-none sm:text-[12.5px]"
          />
        </div>
      </div>

      {showPanel ? (
        <div className="absolute left-0 right-0 top-full z-40 mt-1 overflow-hidden rounded-sm border border-line bg-paper shadow-[0_18px_40px_-24px_rgba(22,36,28,0.55)]">
          <div className="flex items-center justify-between gap-2 border-b border-line bg-cream px-3 py-1.5">
            <span className="lbl">{scope === "store" ? "Products" : "Lessons"}</span>
            <span className="num text-[10.5px] text-stone">
              {suggestions.length === 6
                ? "Top 6"
                : `${suggestions.length} ${suggestions.length === 1 ? "match" : "matches"}`}
            </span>
          </div>

          <ul
            id={`${id}-suggestions`}
            role="listbox"
            aria-label="Search suggestions"
            className="max-h-[min(300px,55dvh)] divide-y divide-line overflow-y-auto"
          >
            {suggestions.map((suggestion, index) => (
              <li
                key={suggestion.id}
                id={`${id}-${suggestion.id}`}
                role="option"
                aria-selected={index === activeIndex}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => choose(suggestion)}
                className={`flex cursor-pointer items-start gap-2.5 px-3 py-2 transition-colors ${
                  index === activeIndex ? "bg-sage" : ""
                }`}
              >
                <span
                  className={`mt-[3px] shrink-0 ${
                    index === activeIndex ? "text-forest" : "text-stone"
                  }`}
                >
                  {suggestion.scope === "store" ? (
                    <IconBook className="h-4 w-4" />
                  ) : (
                    <IconVideo className="h-4 w-4" />
                  )}
                </span>
                <span className="min-w-0">
                  <span
                    className={`block truncate text-[12.5px] font-medium leading-snug ${
                      index === activeIndex ? "text-forest" : "text-ink"
                    }`}
                  >
                    {suggestion.title}
                  </span>
                  <span className="block truncate text-[11px] leading-snug text-stone">
                    {suggestion.meta}
                  </span>
                </span>
              </li>
            ))}

            {suggestions.length === 0 ? (
              <li role="presentation" className="px-3 py-3 text-[11.5px] leading-snug text-stone">
                No {scope === "store" ? "products" : "lessons"} match “{query}”.
              </li>
            ) : null}
          </ul>
        </div>
      ) : null}
    </form>
  );
}

/** Prerendered stand-in for the field while `?q=` is unavailable on the server. */
export function ShopSearchFallback({ id, className = "" }: { id: string; className?: string }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="sr-only">
        Search
      </label>
      <div className="flex h-10 items-stretch rounded-sm border border-line-field bg-paper">
        <span className="flex w-[112px] shrink-0 items-center pl-2.5 sm:w-[96px]" aria-hidden="true">
          <span className="h-2 w-10 rounded-sm bg-sage" />
        </span>
        <span className="my-2 w-px shrink-0 bg-line" aria-hidden="true" />
        <div className="relative min-w-0 flex-1">
          <IconSearch className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-stone" />
          <input
            id={id}
            type="search"
            placeholder="Search…"
            autoComplete="off"
            disabled
            className="h-full w-full bg-transparent pl-7 pr-2 text-[12.5px] text-ink"
          />
        </div>
      </div>
    </div>
  );
}
