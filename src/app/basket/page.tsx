"use client";

import Link from "next/link";
import { IconMinus, IconPlus, IconTrash } from "@/components/icons";
import { ProductArt } from "@/components/product-art";
import { ShopShell } from "@/components/shop/shop-shell";
import { useBasket } from "@/components/basket-provider";
import { Badge, ButtonLink, Empty, Panel, StarRule } from "@/components/ui";
import { getProductById, totalStock, type Product } from "@/lib/data";
import { currency } from "@/lib/format";

export default function BasketPage() {
  const { lines, hydrated, count, subtotal, setQty, remove } = useBasket();

  const detailed = lines.reduce<
    { line: { productId: string; qty: number }; product: Product }[]
  >((entries, line) => {
    const product = getProductById(line.productId);
    if (product) entries.push({ line, product });
    return entries;
  }, []);

  return (
    <ShopShell active="store">
      <div className="mx-auto w-full max-w-[1020px] px-5 py-9 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h1 className="text-[30px] leading-none text-ink">Your basket</h1>
          {hydrated && count > 0 ? (
            <p className="num text-[12.5px] text-stone">
              {count} {count === 1 ? "item" : "items"}
            </p>
          ) : null}
        </div>

        {!hydrated ? (
          <p className="mt-6 text-[13px] text-stone">Loading your basket…</p>
        ) : detailed.length === 0 ? (
          <Panel ticks className="mt-6">
            <Empty
              title="Nothing in the basket yet"
              body="Start with the school list — textbooks, stationery and art supplies are all in the catalog."
              action={<ButtonLink href="/">Browse the catalog</ButtonLink>}
            />
          </Panel>
        ) : (
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px] lg:items-start">
            <Panel>
              <ul className="divide-y divide-line">
                {detailed.map(({ line, product }) => {
                  const available = totalStock(product);
                  return (
                    <li key={product.id} className="flex gap-3.5 p-4">
                      <Link
                        href={`/product/${product.slug}`}
                        className="hidden h-[72px] w-[96px] shrink-0 overflow-hidden border border-line sm:block"
                      >
                        <ProductArt
                          category={product.category}
                          tone={product.tone}
                          className="h-full w-full"
                        />
                      </Link>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
                          <div className="min-w-0">
                            <Link
                              href={`/product/${product.slug}`}
                              className="text-[13.5px] font-medium leading-snug text-ink hover:underline hover:underline-offset-2"
                            >
                              {product.title}
                            </Link>
                            <p className="mt-0.5 text-[11.5px] text-stone">
                              {product.publisher} · <span className="num">{product.code}</span>
                            </p>
                          </div>
                          <span className="num font-display text-[17px] text-ink">
                            {currency(product.price * line.qty)}
                          </span>
                        </div>

                        <div className="mt-2.5 flex flex-wrap items-center gap-3">
                          <div className="inline-flex items-center border border-line">
                            <button
                              type="button"
                              onClick={() => setQty(product.id, line.qty - 1)}
                              aria-label={`Remove one ${product.title}`}
                              className="tap-target inline-flex h-8 w-8 items-center justify-center text-ink transition-colors hover:bg-sage"
                            >
                              <IconMinus className="h-3.5 w-3.5" />
                            </button>
                            <span className="num w-7 text-center text-[12.5px]">{line.qty}</span>
                            <button
                              type="button"
                              onClick={() => setQty(product.id, line.qty + 1)}
                              disabled={line.qty >= 99 || (available > 0 && line.qty >= available)}
                              aria-label={`Add one ${product.title}`}
                              className="tap-target inline-flex h-8 w-8 items-center justify-center text-ink transition-colors hover:bg-sage disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              <IconPlus className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => remove(product.id)}
                            className="inline-flex items-center gap-1.5 text-[11.5px] text-stone transition-colors hover:text-brick"
                          >
                            <IconTrash className="h-3.5 w-3.5" />
                            Remove
                          </button>

                          {available > 0 ? (
                            <span className="text-[11px] text-stone">{available} in stock</span>
                          ) : (
                            <Badge tone="brick">Out of stock</Badge>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </Panel>

            <Panel ticks className="p-4 lg:sticky lg:top-[92px]">
              <StarRule label="Order summary" />
              <dl className="mt-4 space-y-2 text-[12.5px]">
                <div className="flex justify-between">
                  <dt className="text-stone">Subtotal</dt>
                  <dd className="num text-ink">{currency(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-stone">Counter pickup</dt>
                  <dd className="text-forest">No charge</dd>
                </div>
              </dl>

              <div className="mt-4 flex items-end justify-between border-t border-line pt-4">
                <span className="text-[13px] font-medium text-ink">Total</span>
                <span className="num font-display text-[26px] leading-none text-brick">
                  {currency(subtotal)}
                </span>
              </div>

              <ButtonLink href="/checkout" size="lg" className="mt-5 w-full">
                Continue to checkout
              </ButtonLink>

              <p className="mt-3 text-[11px] leading-relaxed text-stone">
                Payment is taken at checkout or at the counter. Bring your student card for pickup.
              </p>

              <Link
                href="/"
                className="link-quiet mt-4 block text-center text-[12px] text-forest"
              >
                Keep browsing
              </Link>
            </Panel>
          </div>
        )}
      </div>
    </ShopShell>
  );
}
