"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { IconMinus, IconPlus, IconSearch } from "@/components/icons";
import { Badge, Panel, PanelHead } from "@/components/ui";
import { ScrollShade } from "@/components/ui/scroll-shade";
import {
  branches,
  categoryLabel,
  isLowStock,
  type BranchId,
  type Product,
} from "@/lib/data";
import { currency, number } from "@/lib/format";

export function InventoryTable({ initial }: { initial: Product[] }) {
  const [items, setItems] = useState<Product[]>(initial);
  const [query, setQuery] = useState("");
  const [lowOnly, setLowOnly] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  const adjust = (id: string, branch: BranchId, delta: number) => {
    const item = items.find((entry) => entry.id === id);
    if (!item) return;

    const next = Math.max(0, item.stock[branch] + delta);
    setItems((current) =>
      current.map((entry) =>
        entry.id === id ? { ...entry, stock: { ...entry.stock, [branch]: next } } : entry,
      ),
    );

    const branchName = branches.find((entry) => entry.id === branch)?.name ?? branch;
    setAnnouncement(`${item.title}: ${next} at ${branchName}.`);
  };

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return items.filter((item) => {
      if (lowOnly && !isLowStock(item)) return false;
      if (!needle) return true;
      return `${item.title} ${item.code} ${categoryLabel(item.category)}`
        .toLowerCase()
        .includes(needle);
    });
  }, [items, query, lowOnly]);

  const totalUnits = items.reduce(
    (sum, item) => sum + item.stock.main + item.stock.east + item.stock.west,
    0,
  );

  return (
    <Panel>
      <p role="status" className="sr-only">
        {announcement}
      </p>

      <PanelHead
        title="Stock by branch"
        hint={`${number(totalUnits)} units on shelves`}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <label className="relative">
              <span className="sr-only">Search inventory</span>
              <IconSearch className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-stone" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search stock…"
                className="field h-8 w-[168px] py-0 pl-8 text-[12px]"
              />
            </label>
            <label className="flex cursor-pointer items-center gap-1.5 text-[11.5px] text-stone">
              <input
                type="checkbox"
                checked={lowOnly}
                onChange={(event) => setLowOnly(event.target.checked)}
                className="h-3.5 w-3.5 accent-forest"
              />
              Low stock
            </label>
          </div>
        }
      />

      <ScrollShade>
        <table className="tbl">
          <thead>
            <tr>
              <th>Product</th>
              <th className="num">Price</th>
              {branches.map((branch) => (
                <th key={branch.id} className="num">
                  {branch.shortName}
                </th>
              ))}
              <th className="num">Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => {
              const total = item.stock.main + item.stock.east + item.stock.west;
              return (
                <tr key={item.id}>
                  <td className="min-w-[220px]">
                    <Link
                      href={`/product/${item.slug}`}
                      className="block text-[12.5px] font-medium leading-snug text-ink hover:underline"
                    >
                      {item.title}
                    </Link>
                    <span className="block text-[10.5px] text-stone">
                      <span className="num">{item.code}</span> · {categoryLabel(item.category)}
                    </span>
                  </td>
                  <td className="num text-right text-[12px] text-stone" data-label="Price">
                    {currency(item.price)}
                  </td>
                  {branches.map((branch) => (
                    <td
                      key={branch.id}
                      className="num text-right"
                      data-label={branch.shortName}
                    >
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => adjust(item.id, branch.id, -1)}
                          aria-label={`Remove one ${item.title} from ${branch.name}`}
                          disabled={item.stock[branch.id] === 0}
                          className="tap-target inline-flex h-6 w-6 items-center justify-center border border-line text-stone transition-colors hover:border-forest hover:text-forest disabled:opacity-30"
                        >
                          <IconMinus className="h-3 w-3" />
                        </button>
                        <span
                          className={`w-8 text-center text-[12px] ${
                            item.stock[branch.id] === 0 ? "text-stone" : "text-ink"
                          }`}
                        >
                          {item.stock[branch.id]}
                        </span>
                        <button
                          type="button"
                          onClick={() => adjust(item.id, branch.id, 1)}
                          aria-label={`Add one ${item.title} to ${branch.name}`}
                          className="tap-target inline-flex h-6 w-6 items-center justify-center border border-line text-stone transition-colors hover:border-forest hover:text-forest"
                        >
                          <IconPlus className="h-3 w-3" />
                        </button>
                      </div>
                    </td>
                  ))}
                  <td className="num text-right text-[12.5px] font-medium text-ink" data-label="Total">
                    {total}
                  </td>
                  <td data-label="Status">
                    {total === 0 ? (
                      <Badge tone="brick">Out</Badge>
                    ) : isLowStock(item) ? (
                      <Badge tone="gold">Low</Badge>
                    ) : (
                      <Badge tone="neutral">In stock</Badge>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </ScrollShade>

      {filtered.length === 0 ? (
        <p className="px-4 py-8 text-center text-[12.5px] text-stone">
          No product matches that search. Clear the filters to see the full shelf.
        </p>
      ) : null}

      <div className="border-t border-line px-4 py-3">
        <p className="text-[11px] leading-relaxed text-stone">
          Adjustments are local to this screen in the preview build. In production each change
          writes a stock movement row and the customer catalog updates in real time.
        </p>
      </div>
    </Panel>
  );
}
