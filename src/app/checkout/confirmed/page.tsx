import type { Metadata } from "next";
import { Suspense } from "react";
import { ShopShell } from "@/components/shop/shop-shell";
import { ConfirmedOrder } from "@/components/shop/confirmed-order";

export const metadata: Metadata = {
  title: "Order placed",
};

export default function ConfirmedPage() {
  return (
    <ShopShell active="store">
      <div className="mx-auto w-full max-w-[820px] px-5 py-12 sm:px-8">
        <Suspense fallback={<p className="text-[13px] text-stone">Loading your order…</p>}>
          <ConfirmedOrder />
        </Suspense>
      </div>
    </ShopShell>
  );
}
