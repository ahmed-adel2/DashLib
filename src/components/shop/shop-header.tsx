"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { IconClose, IconMenu, StarMotif } from "@/components/icons";
import { LanguageToggle } from "@/components/language-toggle";
import { BasketLink } from "@/components/shop/basket-link";
import { ShopSearch, ShopSearchFallback } from "@/components/shop/shop-search";

export type ShopSection = "store" | "learn";

const navItems: { href: string; label: string; key: ShopSection }[] = [
  { href: "/store", label: "Store", key: "store" },
  { href: "/learn", label: "Lessons", key: "learn" },
];

const searchWidth = "w-[300px] xl:w-[380px]";

export function ShopHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const active = pathname === "/store" ? "store" : pathname.startsWith("/learn") ? "learn" : null;
  const [scrolled, setScrolled] = useState(false);
  const header = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);

  // Any navigation closes the panel, however it was triggered.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      menuButton.current?.focus();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // A press anywhere outside the header dismisses the panel; presses on the
  // menu button itself are left to its own toggle handler.
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && header.current?.contains(event.target)) return;
      setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  // Move focus into the panel so Tab continues through its own controls instead
  // of walking the rest of the bar first. Escape hands focus back to the button.
  useEffect(() => {
    if (!open) return;
    panel.current?.focus({ preventScroll: true });
  }, [open]);

  return (
    <header
      ref={header}
      className={`sticky top-0 z-30 border-b bg-paper/95 backdrop-blur-sm transition-shadow ${
        scrolled ? "border-line-strong shadow-[0_10px_22px_-20px_rgba(22,36,28,0.6)]" : "border-line"
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1240px] items-center gap-3 px-5 sm:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <span className="inline-flex h-8 w-8 items-center justify-center bg-forest text-gold-light">
            <StarMotif className="h-4 w-4" />
          </span>
          <span className="font-display text-[23px] leading-none text-ink">DashLib</span>
        </Link>

        <nav className="ml-2 hidden items-center gap-1 sm:flex" aria-label="Store">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              aria-current={active === item.key ? "page" : undefined}
              className={`rounded-sm px-3 py-2 text-[13px] font-medium transition-colors ${
                active === item.key
                  ? "bg-sage text-forest"
                  : "text-stone hover:bg-cream hover:text-ink"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Laptop and up: search, basket and sign-in sit in the bar itself. */}
        <div className="ml-auto hidden items-center gap-2 lg:flex">
          <Suspense
            fallback={<ShopSearchFallback id="shop-search-bar" className={searchWidth} />}
          >
            <ShopSearch id="shop-search-bar" className={searchWidth} />
          </Suspense>
          <LanguageToggle />
          <BasketLink />
          <Link
            href="/sign-in"
            className="inline-flex h-10 items-center rounded-sm bg-forest px-3.5 text-[13px] font-medium text-paper transition-colors hover:bg-forest-deep"
          >
            Sign in
          </Link>
        </div>

        {/* Phone: the bar keeps the basket and rolls everything else into a button. Tablet: the
            section links stay in the bar, the button still holds search and sign-in. */}
        <div className="ml-auto flex items-center gap-2 lg:hidden">
          <LanguageToggle iconOnly />
          <BasketLink />
          <button
            ref={menuButton}
            type="button"
            aria-expanded={open}
            aria-controls="shop-mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((current) => !current)}
            className="tap-target inline-flex h-10 w-10 items-center justify-center rounded-sm border border-moss bg-paper text-ink transition-colors hover:border-forest"
          >
            {open ? <IconClose className="h-5 w-5" /> : <IconMenu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div
          ref={panel}
          id="shop-mobile-menu"
          tabIndex={-1}
          className="border-t border-line bg-paper focus:outline-none lg:hidden"
        >
          <div className="mx-auto w-full max-w-[1240px] space-y-4 px-5 py-4 sm:px-8">
            <Suspense fallback={<ShopSearchFallback id="shop-search-menu" />}>
              <ShopSearch id="shop-search-menu" onSubmitted={() => setOpen(false)} />
            </Suspense>

            <nav aria-label="Store menu" className="sm:hidden">
              <ul className="space-y-1">
                {navItems.map((item) => (
                  <li key={item.key}>
                    <Link
                      href={item.href}
                      aria-current={active === item.key ? "page" : undefined}
                      className={`flex items-center rounded-sm px-3 py-2.5 text-[13.5px] font-medium transition-colors ${
                        active === item.key
                          ? "bg-sage text-forest"
                          : "text-ink hover:bg-cream"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <Link
              href="/sign-in"
              className="inline-flex h-10 w-full items-center justify-center rounded-sm bg-forest px-3.5 text-[13px] font-medium text-paper transition-colors hover:bg-forest-deep"
            >
              Sign in
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
