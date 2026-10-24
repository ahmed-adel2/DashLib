"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IconCheck, StarMotif } from "@/components/icons";
import { ButtonLink, Empty, Panel, StarRule } from "@/components/ui";
import { branches } from "@/lib/data";
import { currency, formatTime } from "@/lib/format";
import { readLastOrder, type PlacedOrder } from "@/lib/order";

export function ConfirmedOrder() {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");
  const [order, setOrder] = useState<PlacedOrder | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setOrder(readLastOrder());
    setLoaded(true);
  }, []);

  if (!loaded) {
    return <p className="text-[13px] text-stone">Loading your order…</p>;
  }

  if (!order || (ref && order.ref !== ref)) {
    return (
      <Panel ticks>
        <Empty
          title="No recent order to show"
          body="Orders are kept for this browser session. Start a new basket to place one."
          action={<ButtonLink href="/store">Back to the store</ButtonLink>}
        />
      </Panel>
    );
  }

  const branch = branches.find((item) => item.id === order.branch) ?? branches[0];

  return (
    <div>
      <div className="flex items-start gap-4">
        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center bg-forest text-paper">
          <IconCheck className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-[30px] leading-tight text-ink">Order placed</h1>
          <p className="mt-1.5 text-[13px] text-stone">
            Thank you, {order.customer.split(" ")[0]}. We have your order and the branch will have it
            ready at the counter.
          </p>
        </div>
      </div>

      <Panel ticks className="mt-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <StarMotif className="h-2.5 w-2.5 text-gold" />
            <span className="num text-[13px] font-medium text-ink">{order.ref}</span>
            <span className="text-[11.5px] text-stone">placed at {formatTime(order.placedAt)}</span>
          </div>
          <span className="text-[11.5px] text-stone">
            {order.method === "card" ? "Paid by card" : "Pay at pickup"}
          </span>
        </div>

        <div className="grid gap-5 p-5 sm:grid-cols-2">
          <div>
            <div className="lbl">Collect from</div>
            <p className="mt-1.5 text-[13px] text-ink">{branch.name}</p>
            <p className="text-[11.5px] text-stone">{branch.address}</p>
            <p className="mt-1 text-[11.5px] text-stone">{branch.hours}</p>
          </div>
          <div>
            <div className="lbl">Contact</div>
            <p className="mt-1.5 text-[13px] text-ink">{order.email}</p>
            <p className="text-[11.5px] text-stone">{order.phone}</p>
          </div>
        </div>

        <div className="border-t border-line">
          <table className="tbl">
            <thead>
              <tr>
                <th>Item</th>
                <th className="num">Qty</th>
                <th className="num">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.title}>
                  <td className="text-ink">{item.title}</td>
                  <td className="num text-stone">{item.qty}</td>
                  <td className="num text-ink">{currency(item.price * item.qty)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-line px-5 py-4">
          <span className="text-[12.5px] text-stone">Total</span>
          <span className="num font-display text-[26px] leading-none text-brick">
            {currency(order.subtotal)}
          </span>
        </div>
      </Panel>

      <div className="mt-6">
        <StarRule label="What happens next" />
        <ol className="mt-4 space-y-3">
          {[
            "The branch checks the stock on the order and packs it the same working day.",
            "Bring your student card to the counter and give the order number above.",
            "Orders are held for 48 hours, then the stock goes back on the shelf.",
          ].map((line, index) => (
            <li key={line} className="flex gap-3 text-[12.5px] leading-relaxed text-ink">
              <span className="num inline-flex h-5 w-5 shrink-0 items-center justify-center border border-line text-[10px] text-stone">
                {index + 1}
              </span>
              {line}
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-7 flex flex-wrap gap-2">
        <ButtonLink href="/store">Continue shopping</ButtonLink>
        <ButtonLink href="/learn" variant="secondary">
          Go to my lessons
        </ButtonLink>
      </div>

      <p className="mt-5 text-[11px] leading-relaxed text-stone">
        This build runs a sample checkout: no payment was taken and the order lives only in this
        browser session until Supabase is connected.
      </p>
    </div>
  );
}
