import Link from "next/link";
import type { ReactNode } from "react";
import { StarMotif } from "@/components/icons";
import { ShopHeader, type ShopSection } from "@/components/shop/shop-header";

export function ShopShell({
  children,
  active,
}: {
  children: ReactNode;
  active: ShopSection;
}) {
  return (
    <div className="flex min-h-dvh flex-col">
      <div className="geo-band" />

      <ShopHeader />

      <main id="main" className="flex-1">
        {children}
      </main>

      <footer className="mt-16 border-t border-line bg-paper">
        <div className="mx-auto grid w-full max-w-[1240px] gap-8 px-5 py-10 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2">
              <StarMotif className="h-3 w-3 text-gold" />
              <span className="font-display text-[19px] text-ink">DashLib</span>
            </div>
            <p className="mt-3 max-w-[38ch] text-[12.5px] leading-relaxed text-stone">
              Books, school supplies and lesson material for three branches — one catalog, one
              basket, one pickup.
            </p>
          </div>
          <div>
            <div className="lbl">Branches</div>
            <ul className="mt-3 space-y-1.5 text-[12.5px] text-stone">
              <li>Main · 18 Al Andalus St.</li>
              <li>East · Al Noor Plaza</li>
              <li>West · 7 Al Wasl Rd.</li>
            </ul>
          </div>
          <div>
            <div className="lbl">Staff portals</div>
            <ul className="mt-3 space-y-1.5 text-[12.5px]">
              <li>
                <Link href="/admin" className="link-quiet text-ink">
                  Admin dashboard
                </Link>
              </li>
              <li>
                <Link href="/teacher" className="link-quiet text-ink">
                  Teacher portal
                </Link>
              </li>
              <li>
                <Link href="/sign-in" className="link-quiet text-ink">
                  Sign in
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-line">
          <div className="mx-auto flex w-full max-w-[1240px] flex-wrap items-center justify-between gap-2 px-5 py-4 text-[11px] text-stone sm:px-8">
            <span>© 2026 DashLib. Catalog and sales figures on this build are sample data.</span>
            <span className="num">v0.1 · front-end preview</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
