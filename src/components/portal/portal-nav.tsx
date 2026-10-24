"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  IconBox,
  IconBuilding,
  IconChart,
  IconClipboard,
  IconClock,
  IconClose,
  IconMenu,
  IconReport,
  IconTransfer,
  IconUser,
  IconVideo,
} from "@/components/icons";

type Variant = "admin" | "teacher";

type Item = {
  href: string;
  label: string;
  icon: ReactNode;
};

const navItems: Record<Variant, Item[]> = {
  admin: [
    { href: "/admin", label: "Sales overview", icon: <IconChart /> },
    { href: "/admin/inventory", label: "Inventory", icon: <IconBox /> },
    { href: "/admin/transfers", label: "Branch transfers", icon: <IconTransfer /> },
    { href: "/admin/reports", label: "Reports & export", icon: <IconReport /> },
    { href: "/admin/staff", label: "People", icon: <IconUser /> },
    { href: "/admin/branches", label: "Branches", icon: <IconBuilding /> },
  ],
  teacher: [
    { href: "/teacher", label: "My day", icon: <IconClock /> },
    { href: "/teacher/lessons", label: "Lessons", icon: <IconVideo /> },
    { href: "/teacher/tasks", label: "Tasks", icon: <IconClipboard /> },
    { href: "/teacher/hours", label: "Shift hours", icon: <IconReport /> },
  ],
};

const rootFor = (variant: Variant) => (variant === "admin" ? "/admin" : "/teacher");

const isCurrent = (pathname: string, href: string, root: string) =>
  pathname === href || (href !== root && pathname.startsWith(`${href}/`));

export function PortalNav({
  variant,
  tone = "rail",
  className = "",
}: {
  variant: Variant;
  tone?: "rail" | "bar";
  className?: string;
}) {
  const pathname = usePathname();
  const root = rootFor(variant);

  // Below `lg` the sections live behind a button rather than a scrolling row.
  if (tone === "bar") return <PortalNavMenu variant={variant} className={className} />;

  return (
    <nav
      aria-label={variant === "admin" ? "Admin sections" : "Teacher sections"}
      className={className}
    >
      <ul className="space-y-0.5">
        {navItems[variant].map((item) => {
          const active = isCurrent(pathname, item.href, root);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 rounded-sm px-3 py-2 text-[12.5px] transition-colors ${
                  active
                    ? "bg-white/[0.08] font-medium text-gold-light"
                    : "text-paper/70 hover:bg-white/[0.04] hover:text-paper"
                }`}
              >
                <span className={active ? "text-gold-light" : "text-paper/45"}>{item.icon}</span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function PortalNavMenu({ variant, className = "" }: { variant: Variant; className?: string }) {
  const pathname = usePathname();
  const root = rootFor(variant);
  const [open, setOpen] = useState(false);
  const wrapper = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);

  // Any navigation closes the panel, however it was triggered.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && wrapper.current?.contains(event.target)) return;
      setOpen(false);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      button.current?.focus();
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={wrapper} className={className}>
      <button
        ref={button}
        type="button"
        aria-expanded={open}
        aria-controls="portal-sections"
        aria-label={open ? "Close sections" : "Open sections"}
        onClick={() => setOpen((current) => !current)}
        className="tap-target inline-flex h-9 w-9 items-center justify-center rounded-sm border border-moss bg-paper text-ink transition-colors hover:border-forest"
      >
        {open ? <IconClose className="h-4 w-4" /> : <IconMenu className="h-4 w-4" />}
      </button>

      {open ? (
        <nav
          id="portal-sections"
          aria-label={variant === "admin" ? "Admin sections menu" : "Teacher sections menu"}
          className="absolute left-0 right-0 top-full z-40 max-h-[70dvh] overflow-y-auto border-b border-line bg-paper p-2 shadow-[0_16px_32px_-24px_rgba(22,36,28,0.6)]"
        >
          <ul className="grid gap-0.5">
            {navItems[variant].map((item) => {
              const active = isCurrent(pathname, item.href, root);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 rounded-sm px-3 py-2.5 text-[13px] transition-colors ${
                      active
                        ? "bg-sage font-medium text-forest"
                        : "text-ink hover:bg-cream"
                    }`}
                  >
                    <span className={active ? "text-forest" : "text-stone"}>{item.icon}</span>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-1 flex items-center justify-between gap-3 border-t border-line px-3 pb-1 pt-2.5 text-[11.5px]">
            <Link href="/store" className="text-stone hover:text-ink">
              Store
            </Link>
            <Link href="/sign-in" className="text-stone hover:text-ink">
              Switch account
            </Link>
          </div>
        </nav>
      ) : null}
    </div>
  );
}
