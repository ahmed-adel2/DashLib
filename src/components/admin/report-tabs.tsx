"use client";

import { useMemo, useState } from "react";
import { ExportButton } from "@/components/admin/export-button";
import { Panel, PanelHead, Stat } from "@/components/ui";
import { ScrollShade } from "@/components/ui/scroll-shade";
import type { DaySales, MonthSales } from "@/lib/data";
import { branches } from "@/lib/data";
import { currency, number } from "@/lib/format";

type Tab = "daily" | "monthly";

export function ReportTabs({ daily, monthly }: { daily: DaySales[]; monthly: MonthSales[] }) {
  const [tab, setTab] = useState<Tab>("daily");

  const dailyRows = useMemo(() => [...daily].reverse(), [daily]);
  const dailyTotals = useMemo(() => {
    const revenue = daily.reduce((sum, day) => sum + day.revenue, 0);
    const orders = daily.reduce((sum, day) => sum + day.orders, 0);
    return {
      revenue,
      orders,
      average: revenue / orders,
      best: daily.reduce((top, day) => (day.revenue > top.revenue ? day : top), daily[0]),
    };
  }, [daily]);

  const monthlyTotals = useMemo(() => {
    const revenue = monthly.reduce((sum, month) => sum + month.revenue, 0);
    const orders = monthly.reduce((sum, month) => sum + month.orders, 0);
    return {
      revenue,
      orders,
      average: revenue / monthly.length,
      best: monthly.reduce((top, month) => (month.revenue > top.revenue ? month : top), monthly[0]),
    };
  }, [monthly]);

  const sheets = [
    {
      name: "Daily sales",
      columns: [
        { header: "Date" },
        { header: "Orders", type: "Number" as const },
        { header: "Revenue", type: "Number" as const },
        { header: "Main", type: "Number" as const },
        { header: "East", type: "Number" as const },
        { header: "West", type: "Number" as const },
      ],
      rows: daily.map((day) => [
        day.date,
        day.orders,
        day.revenue,
        day.branches.main,
        day.branches.east,
        day.branches.west,
      ]),
    },
    {
      name: "Monthly sales",
      columns: [
        { header: "Month" },
        { header: "Orders", type: "Number" as const },
        { header: "Revenue", type: "Number" as const },
        { header: "Average order", type: "Number" as const },
      ],
      rows: monthly.map((month) => [
        month.label,
        month.orders,
        month.revenue,
        Math.round((month.revenue / month.orders) * 100) / 100,
      ]),
    },
  ];

  return (
    <div className="grid gap-4">
      <Panel ticks>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
          <div className="flex items-center gap-1" role="group" aria-label="Report period">
            {(["daily", "monthly"] as Tab[]).map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={tab === option}
                onClick={() => setTab(option)}
                className={`rounded-sm px-3 py-1.5 text-[12px] capitalize transition-colors ${
                  tab === option
                    ? "bg-forest text-paper"
                    : "text-stone hover:bg-cream hover:text-ink"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-stone">
              {tab === "daily" ? `Last ${daily.length} days` : `Last ${monthly.length} months`}
            </span>
            <ExportButton filename="dashlib-sales-report" label="Export both sheets" sheets={sheets} />
          </div>
        </div>

        <div className="grid divide-y divide-line sm:grid-cols-4 sm:divide-x sm:divide-y-0">
          <div className="p-5">
            <Stat
              label={tab === "daily" ? "Revenue in period" : "Revenue, 12 months"}
              value={currency(tab === "daily" ? dailyTotals.revenue : monthlyTotals.revenue)}
              sub={tab === "daily" ? `${daily.length} trading days` : `${monthly.length} months`}
            />
          </div>
          <div className="p-5">
            <Stat
              label="Orders"
              value={number(tab === "daily" ? dailyTotals.orders : monthlyTotals.orders)}
              sub="Completed and collected"
            />
          </div>
          <div className="p-5">
            <Stat
              label={tab === "daily" ? "Average basket" : "Average month"}
              value={currency(tab === "daily" ? dailyTotals.average : monthlyTotals.average)}
              sub={tab === "daily" ? "Revenue ÷ orders" : "Revenue ÷ months"}
            />
          </div>
          <div className="p-5">
            <Stat
              label="Best period"
              value={currency(tab === "daily" ? dailyTotals.best.revenue : monthlyTotals.best.revenue)}
              sub={tab === "daily" ? dailyTotals.best.label : monthlyTotals.best.label}
            />
          </div>
        </div>
      </Panel>

      <Panel className="min-w-0">
        <PanelHead
          title={tab === "daily" ? "Daily sales" : "Monthly sales"}
          hint={tab === "daily" ? "Most recent first" : "Fixed monthly totals"}
        />

        {tab === "daily" ? (
          <ScrollShade className="max-h-[440px] overflow-y-auto">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Date</th>
                  <th className="num">Orders</th>
                  <th className="num">Revenue</th>
                  {branches.map((branch) => (
                    <th key={branch.id} className="num">
                      {branch.shortName}
                    </th>
                  ))}
                  <th className="num">Avg basket</th>
                </tr>
              </thead>
              <tbody>
                {dailyRows.map((day) => (
                  <tr key={day.date}>
                    <td className="num text-[12px] text-ink">{day.label}</td>
                    <td className="num text-right text-[12px] text-stone" data-label="Orders">
                      {day.orders}
                    </td>
                    <td className="num text-right text-[12px] text-ink" data-label="Revenue">
                      {currency(day.revenue)}
                    </td>
                    {branches.map((branch) => (
                      <td
                        key={branch.id}
                        className="num text-right text-[12px] text-stone"
                        data-label={branch.shortName}
                      >
                        {currency(day.branches[branch.id])}
                      </td>
                    ))}
                    <td
                      className="num text-right text-[12px] text-stone"
                      data-label="Avg basket"
                    >
                      {currency(day.revenue / day.orders)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ScrollShade>
        ) : (
          <ScrollShade>
            <table className="tbl">
              <thead>
                <tr>
                  <th>Month</th>
                  <th className="num">Orders</th>
                  <th className="num">Revenue</th>
                  <th className="num">Avg order</th>
                </tr>
              </thead>
              <tbody>
                {[...monthly].reverse().map((month) => (
                  <tr key={month.month}>
                    <td className="text-[12px] text-ink">{month.label}</td>
                    <td className="num text-right text-[12px] text-stone" data-label="Orders">
                      {month.orders}
                    </td>
                    <td className="num text-right text-[12px] text-ink" data-label="Revenue">
                      {currency(month.revenue)}
                    </td>
                    <td className="num text-right text-[12px] text-stone" data-label="Avg order">
                      {currency(month.revenue / month.orders)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ScrollShade>
        )}

        <div className="border-t border-line px-4 py-3">
          <p className="text-[11px] leading-relaxed text-stone">
            The export writes an Excel workbook with both sheets: daily rows per branch and monthly
            totals. It opens in Excel, Numbers and LibreOffice.
          </p>
        </div>
      </Panel>
    </div>
  );
}
