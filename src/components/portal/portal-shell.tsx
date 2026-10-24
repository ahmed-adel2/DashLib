import Link from "next/link";
import type { ReactNode } from "react";
import { StarMotif } from "@/components/icons";
import { LanguageToggle } from "@/components/language-toggle";
import { PortalNav } from "@/components/portal/portal-nav";
import { LiveClockChip } from "@/components/portal/live-clock-chip";
import { branchLabel, demoAdmin, demoTeacher } from "@/lib/data";
import { initials } from "@/lib/format";

const config = {
  admin: {
    label: "Admin portal",
    root: "/admin",
    person: demoAdmin,
  },
  teacher: {
    label: "Teacher portal",
    root: "/teacher",
    person: demoTeacher,
  },
} as const;

export function PortalShell({
  variant,
  children,
}: {
  variant: "admin" | "teacher";
  children: ReactNode;
}) {
  const { label, root, person } = config[variant];

  return (
    <div className="min-h-dvh bg-plaster">
      <div className="geo-band" />

      <div className="lg:grid lg:grid-cols-[236px_1fr]">
        <aside className="hidden bg-forest lg:sticky lg:top-0 lg:flex lg:h-dvh lg:flex-col">
          <div className="px-5 pb-5 pt-6">
            <Link href={root} className="flex items-center gap-2.5">
              <span className="inline-flex h-8 w-8 items-center justify-center border border-white/15 text-gold-light">
                <StarMotif className="h-4 w-4" />
              </span>
              <span className="font-display text-[21px] leading-none text-paper">DashLib</span>
            </Link>
            <p className="mt-2 pl-[42px] text-[9.5px] uppercase tracking-[0.18em] text-gold-light/85">
              {label}
            </p>
          </div>

          <PortalNav variant={variant} className="px-3" />

          <div className="mt-auto border-t border-white/10 px-4 py-4">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-sm bg-white/10 text-[11px] font-medium text-paper">
                {initials(person.name)}
              </span>
              <div className="min-w-0">
                <p className="truncate text-[12px] font-medium text-paper">{person.name}</p>
                <p className="truncate text-[10.5px] text-paper/55">
                  {person.title} · {branchLabel(person.branch)}
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-[10.5px]">
              <Link href="/store" className="text-paper/60 hover:text-paper">
                Store
              </Link>
              <Link href="/sign-in" className="text-paper/60 hover:text-paper">
                Switch account
              </Link>
            </div>
          </div>
        </aside>

        <div className="min-w-0">
          <header className="sticky top-0 z-30 border-b border-line bg-paper/95 backdrop-blur-sm">
            <div className="relative flex h-14 items-center gap-3 px-4 sm:px-6">
              <Link href={root} className="flex items-center gap-2 lg:hidden">
                <span className="inline-flex h-6 w-6 items-center justify-center bg-forest text-gold-light">
                  <StarMotif className="h-3 w-3" />
                </span>
                <span className="font-display text-[18px] leading-none text-ink">DashLib</span>
              </Link>
              <span className="hidden text-[10px] uppercase tracking-[0.16em] text-stone lg:inline">
                {label}
              </span>

              <div className="ml-auto flex items-center gap-4">
                <LiveClockChip />
                <LanguageToggle iconOnly />
                <Link
                  href="/sign-in"
                  className="link-quiet hidden text-[11.5px] text-forest sm:inline"
                >
                  Switch account
                </Link>
              </div>

              <PortalNav variant={variant} tone="bar" className="lg:hidden" />
            </div>
          </header>

          <main
            id="main"
            className="mx-auto w-full max-w-[1240px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8"
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
