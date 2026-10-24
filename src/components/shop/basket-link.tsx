"use client";

import Link from "next/link";
import { IconBasket } from "@/components/icons";
import { useBasket } from "@/components/basket-provider";

export function BasketLink() {
  const { count, hydrated } = useBasket();

  return (
    <Link
      href="/basket"
      className="inline-flex h-10 items-center gap-2 rounded-sm border border-moss bg-paper px-3 text-[13px] font-medium text-ink transition-colors hover:border-forest"
    >
      <IconBasket className="h-4 w-4" />
      <span className="hidden sm:inline">Basket</span>
      {hydrated && count > 0 ? (
        <span className="num inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-sm bg-brick px-1 text-[10px] font-semibold text-paper">
          {count}
        </span>
      ) : null}
    </Link>
  );
}
