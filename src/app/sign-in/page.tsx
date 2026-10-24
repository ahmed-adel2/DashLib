import type { Metadata } from "next";
import Link from "next/link";
import { IconBook, IconChart, IconChevronRight, IconStore, StarMotif } from "@/components/icons";
import { LanguageToggle } from "@/components/language-toggle";

export const metadata: Metadata = {
  title: "Sign in",
};

const roles = [
  {
    href: "/",
    label: "Student",
    description: "Catalog, basket, checkout and lessons",
    icon: <IconStore className="h-4 w-4" />,
  },
  {
    href: "/teacher",
    label: "Teacher",
    description: "Clock in, upload lessons, set tasks",
    icon: <IconBook className="h-4 w-4" />,
  },
  {
    href: "/admin",
    label: "Admin",
    description: "Sales, stock, transfers, people and reports",
    icon: <IconChart className="h-4 w-4" />,
  },
];

export default function SignInPage() {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[1.05fr_1fr]">
      <div className="relative flex flex-col justify-between overflow-hidden bg-forest px-7 py-8 text-paper sm:px-10 sm:py-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 opacity-[0.12]"
        >
          <svg viewBox="0 0 100 100" className="h-full w-full" fill="none" stroke="#e4c58a" strokeWidth="0.6">
            <path d="M50 6 94 50 50 94 6 50Z" />
            <path d="M28 28h44v44H28z" />
            <path d="M50 20 80 50 50 80 20 50Z" />
            <path d="M34 34h32v32H34z" />
          </svg>
        </div>

        <Link href="/" className="relative flex items-center gap-2.5">
          <span className="inline-flex h-8 w-8 items-center justify-center border border-white/20 text-gold-light">
            <StarMotif className="h-4 w-4" />
          </span>
          <span className="font-display text-[22px] leading-none text-paper">DashLib</span>
        </Link>

        <div className="relative my-10 max-w-[34ch]">
          <h1 className="text-[32px] leading-[1.08] text-paper sm:text-[38px]">
            Books, lessons and shifts in one place.
          </h1>
          <p className="mt-4 text-[13px] leading-relaxed text-paper/70">
            One system for the storefront, the lesson library and the daily running of three
            branches — with each role seeing exactly its own work.
          </p>
        </div>

        <div className="relative flex items-center gap-2.5 text-[10.5px] uppercase tracking-[0.16em] text-paper/45">
          <StarMotif className="h-2.5 w-2.5 text-gold" />
          Main · East · West
        </div>
      </div>

      <div className="flex items-center justify-center bg-plaster px-6 py-10 sm:px-10">
        <div className="w-full max-w-[420px]">
          <div className="mb-6 flex justify-end">
            <LanguageToggle />
          </div>

          <h2 className="text-[25px] leading-tight text-ink">Choose a demo account</h2>
          <p className="mt-1.5 text-[12.5px] text-stone">
            Each entry opens the portal that role uses. No password in this preview.
          </p>

          <div className="mt-5 space-y-2.5">
            {roles.map((role) => (
              <Link
                key={role.label}
                href={role.href}
                className="group flex items-center gap-3 border border-line bg-paper px-3.5 py-3 transition-colors hover:border-forest"
              >
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center bg-sage text-forest">
                  {role.icon}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13.5px] font-medium text-ink">{role.label}</span>
                  <span className="block text-[11.5px] leading-snug text-stone">
                    {role.description}
                  </span>
                </span>
                <IconChevronRight className="h-4 w-4 shrink-0 text-moss transition-colors group-hover:text-forest" />
              </Link>
            ))}
          </div>

          <div className="mt-6 border-t border-line pt-4">
            <p className="text-[11px] leading-relaxed text-stone">
              Authentication is the last integration to switch on: Clerk holds the accounts and
              roles, and every portal route reads the same role claim. This screen exists so each
              surface can be reviewed before that is wired.
            </p>
            <Link href="/store" className="link-quiet mt-3 inline-block text-[12px] text-forest">
              Back to the store
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
