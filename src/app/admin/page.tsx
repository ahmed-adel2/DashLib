import type { Metadata } from "next";
import Link from "next/link";
import { IconArrowRight, IconPlus } from "@/components/icons";
import { ExportButton } from "@/components/admin/export-button";
import { SalesChart } from "@/components/admin/sales-chart";
import {
  Badge,
  ButtonLink,
  DataNote,
  Meter,
  Panel,
  PanelHead,
  PageHeading,
  Stat,
} from "@/components/ui";
import { ScrollShade } from "@/components/ui/scroll-shade";
import {
  branches,
  dailySales,
  getProductById,
  isLowStock,
  monthTotals,
  products,
  recentOrders,
  revenueChange,
  todaySales,
  totalStock,
  transfers,
  yesterdaySales,
  type OrderStatus,
} from "@/lib/data";
import { currency, formatLongDate, formatTime, number, percent } from "@/lib/format";

export const metadata: Metadata = {
  title: "Sales overview",
};

const statusTone: Record<OrderStatus, "forest" | "gold" | "neutral"> = {
  paid: "forest",
  packed: "gold",
  collected: "neutral",
};

const lowStock = products
  .filter(isLowStock)
  .sort((a, b) => totalStock(a) - totalStock(b));

const inTransit = transfers.filter((transfer) => transfer.status === "in-transit");

const branchRows = branches.map((branch) => ({
  id: branch.id,
  name: branch.name,
  revenue: todaySales.branches[branch.id],
  share: (todaySales.branches[branch.id] / todaySales.revenue) * 100,
}));

const revenueDelta = revenueChange(todaySales.revenue, yesterdaySales.revenue);

export default function AdminOverviewPage() {
  return (
    <div>
      <PageHeading
        title="Sales overview"
        meta={
          <>
            <span>{formatLongDate("2026-10-24T00:00:00Z")}</span>
            <span aria-hidden="true" className="text-moss">
              /
            </span>
            <span>{branches.length} branches</span>
            <span aria-hidden="true" className="text-moss">
              /
            </span>
            <span className="num">{number(todaySales.orders)} orders today</span>
          </>
        }
        actions={
          <>
            <ExportButton
              filename="dashlib-sales-2026-10-24"
              label="Export today"
              sheets={[
                {
                  name: "Today by branch",
                  columns: [
                    { header: "Branch" },
                    { header: "Revenue", type: "Number" },
                    { header: "Share %", type: "Number" },
                  ],
                  rows: branchRows.map((row) => [row.name, row.revenue, Math.round(row.share)]),
                },
                {
                  name: "Hourly orders",
                  columns: [
                    { header: "Order" },
                    { header: "Time" },
                    { header: "Branch" },
                    { header: "Items", type: "Number" },
                    { header: "Total", type: "Number" },
                  ],
                  rows: recentOrders.map((order) => [
                    order.id,
                    order.time.slice(11, 16),
                    order.branch,
                    order.items,
                    order.total,
                  ]),
                },
              ]}
            />
            <ButtonLink href="/admin/transfers" size="sm">
              <IconPlus className="h-3.5 w-3.5" />
              Transfer stock
            </ButtonLink>
          </>
        }
      />

      <div className="grid gap-4">
        <Panel ticks>
          <div className="grid divide-y divide-line sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
            <div className="p-5">
              <Stat
                label="Revenue today"
                value={currency(todaySales.revenue)}
                sub={
                  <>
                    <span className={revenueDelta >= 0 ? "text-forest" : "text-brick"}>
                      {percent(revenueDelta, 1)}
                    </span>{" "}
                    against yesterday
                  </>
                }
              />
            </div>
            <div className="p-5">
              <Stat
                label="Orders today"
                value={number(todaySales.orders)}
                sub={`${currency(todaySales.revenue / todaySales.orders)} average basket`}
              />
            </div>
            <div className="p-5">
              <Stat
                label="This month"
                value={currency(monthTotals.revenue)}
                sub={`${number(monthTotals.orders)} orders month to date`}
              />
            </div>
            <div className="p-5">
              <Stat
                label="Low stock lines"
                value={number(lowStock.length)}
                tone={lowStock.length > 0 ? "brick" : "ink"}
                sub="Below 12 units across all branches"
              />
            </div>
          </div>
        </Panel>

        <div className="grid gap-4 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <SalesChart data={dailySales} />
          </div>

          <Panel>
            <PanelHead
              title="Branches today"
              action={
                <Link href="/admin/branches" className="link-quiet text-[11.5px] text-forest">
                  Manage
                </Link>
              }
            />
            <ul className="divide-y divide-line">
              {branchRows.map((branch) => (
                <li key={branch.id} className="px-4 py-3.5">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-[12.5px] font-medium text-ink">{branch.name}</span>
                    <span className="num text-[13px] text-ink">{currency(branch.revenue)}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="num w-9 text-[10.5px] text-stone">
                      {branch.share.toFixed(0)}%
                    </span>
                    <Meter value={branch.share} max={100} />
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-line px-4 py-3">
              <div className="flex items-center justify-between text-[11px] text-stone">
                <span>Total today</span>
                <span className="num text-[12px] text-ink">{currency(todaySales.revenue)}</span>
              </div>
            </div>
          </Panel>

          <Panel className="min-w-0 xl:col-span-2">
            <PanelHead
              title="Recent orders"
              hint="Last 10"
              action={
                <Link href="/admin/reports" className="link-quiet text-[11.5px] text-forest">
                  Reports
                </Link>
              }
            />
            <ScrollShade>
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Time</th>
                    <th>Customer</th>
                    <th className="num">Items</th>
                    <th className="num">Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="num text-[12px] font-medium text-ink">{order.id}</td>
                      <td className="num text-[12px] text-stone" data-label="Time">
                        {formatTime(order.time)}
                      </td>
                      <td className="text-[12px] text-stone" data-label="Customer">
                        {order.customer}
                      </td>
                      <td className="num text-right text-[12px] text-stone" data-label="Items">
                        {order.items}
                      </td>
                      <td className="num text-right text-[12px] text-ink" data-label="Total">
                        {currency(order.total)}
                      </td>
                      <td data-label="Status">
                        <Badge tone={statusTone[order.status]}>{order.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </ScrollShade>
          </Panel>

          <Panel>
            <PanelHead
              title="Needs attention"
              action={
                <Link href="/admin/inventory" className="link-quiet text-[11.5px] text-forest">
                  Inventory
                </Link>
              }
            />
            <div className="px-4 py-3">
              <div className="lbl">Low stock</div>
              <ul className="mt-2 space-y-2.5">
                {lowStock.map((product) => (
                  <li key={product.id}>
                    <div className="flex items-baseline justify-between gap-2">
                      <Link
                        href={`/product/${product.slug}`}
                        className="min-w-0 truncate text-[12px] text-ink hover:underline"
                      >
                        {product.title}
                      </Link>
                      <span className="num shrink-0 text-[11px] text-brick">
                        {totalStock(product)} left
                      </span>
                    </div>
                    <div className="mt-1">
                      <Meter value={totalStock(product)} max={12} tone="brick" />
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-line px-4 py-3">
              <div className="lbl">In transit</div>
              {inTransit.length === 0 ? (
                <p className="mt-2 text-[11.5px] text-stone">No stock is moving between branches.</p>
              ) : (
                <ul className="mt-2 space-y-2">
                  {inTransit.map((transfer) => {
                    const product = getProductById(transfer.productId);
                    return (
                      <li key={transfer.id} className="text-[11.5px] text-ink">
                        <span className="num text-stone">{transfer.id}</span> ·{" "}
                        {product?.title ?? "Item"}
                        <span className="block text-[10.5px] text-stone">
                          {transfer.quantity} units · {transfer.from} → {transfer.to}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
              <Link
                href="/admin/transfers"
                className="link-quiet mt-3 inline-flex items-center gap-1.5 text-[11.5px] text-forest"
              >
                Open transfers
                <IconArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </Panel>
        </div>

        <DataNote>
          Every figure on this screen is sample data shaped like the real tables. Connect Supabase
          and this page reads live orders, stock and transfers; the layout does not change.
        </DataNote>
      </div>
    </div>
  );
}
