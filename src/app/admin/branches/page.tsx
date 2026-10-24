import type { Metadata } from "next";
import Link from "next/link";
import { IconArrowRight, IconBuilding } from "@/components/icons";
import {
  Badge,
  DataNote,
  Meter,
  PageHeading,
  Panel,
  PanelHead,
  Stat,
  StarRule,
} from "@/components/ui";
import { branches, monthTotals, products, staff, todaySales, totalStock } from "@/lib/data";
import { currency, number } from "@/lib/format";

export const metadata: Metadata = {
  title: "Branches",
};

const totalUnits = products.reduce((sum, product) => sum + totalStock(product), 0);
const activeStaff = staff.filter((member) => member.status === "active").length;

export default function BranchesPage() {
  return (
    <div>
      <PageHeading
        title="Branches"
        meta={
          <>
            <span>{branches.length} locations</span>
            <span aria-hidden="true" className="text-moss">
              /
            </span>
            <span className="num">{number(totalUnits)} units in the network</span>
            <span aria-hidden="true" className="text-moss">
              /
            </span>
            <span>{activeStaff} active staff</span>
          </>
        }
        actions={
          <Link
            href="/admin/transfers"
            className="inline-flex h-8 items-center gap-1.5 rounded-sm border border-moss bg-paper px-3 text-[12px] font-medium text-ink transition-colors hover:border-forest"
          >
            Move stock
            <IconArrowRight className="h-3.5 w-3.5" />
          </Link>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        {branches.map((branch) => {
          const revenue = todaySales.branches[branch.id];
          const share = (revenue / todaySales.revenue) * 100;
          const units = products.reduce((sum, product) => sum + product.stock[branch.id], 0);
          const people = staff.filter(
            (member) => member.branch === branch.id && member.status === "active",
          ).length;
          const lowLines = products.filter((product) => product.stock[branch.id] < 4).length;

          return (
            <Panel key={branch.id} ticks className="flex flex-col">
              <div className="flex items-start justify-between gap-3 border-b border-line px-4 py-3.5">
                <div className="min-w-0">
                  <h2 className="text-[17px] leading-tight text-ink">{branch.name}</h2>
                  <p className="mt-0.5 text-[11px] leading-snug text-stone">{branch.address}</p>
                </div>
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center bg-sage text-forest">
                  <IconBuilding className="h-3.5 w-3.5" />
                </span>
              </div>

              <div className="flex-1 p-4">
                <dl className="space-y-2 text-[12px]">
                  <div className="flex justify-between gap-3">
                    <dt className="text-stone">Manager</dt>
                    <dd className="text-right text-ink">{branch.manager}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-stone">Hours</dt>
                    <dd className="num text-right text-ink">{branch.hours}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-stone">Phone</dt>
                    <dd className="num text-right text-ink">{branch.phone}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-stone">Staff</dt>
                    <dd className="text-right text-ink">
                      {people} active · {branch.staffOnSite} on site
                    </dd>
                  </div>
                </dl>

                <div className="mt-4">
                  <StarRule />
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3">
                  <Stat label="Today" value={currency(revenue)} />
                  <Stat label="Stock" value={number(units)} sub={`${lowLines} lines under 4`} />
                </div>

                <div className="mt-4">
                  <div className="mb-1 flex items-center justify-between text-[10.5px] text-stone">
                    <span>Share of today&apos;s sales</span>
                    <span className="num">{share.toFixed(0)}%</span>
                  </div>
                  <Meter value={share} max={100} />
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-line px-4 py-2.5">
                <Link
                  href="/admin/inventory"
                  className="text-[11.5px] font-medium text-forest hover:underline"
                >
                  Check stock →
                </Link>
                <Badge tone="sand">{branch.shortName}</Badge>
              </div>
            </Panel>
          );
        })}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_320px]">
        <Panel>
          <PanelHead title="Network totals" hint="All branches" />
          <div className="grid divide-y divide-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <div className="p-5">
              <Stat label="Revenue today" value={currency(todaySales.revenue)} sub="All channels" />
            </div>
            <div className="p-5">
              <Stat label="Month to date" value={currency(monthTotals.revenue)} sub="Includes today" />
            </div>
            <div className="p-5">
              <Stat label="Units held" value={number(totalUnits)} sub="Across every shelf" />
            </div>
          </div>
        </Panel>

        <Panel className="p-4">
          <StarRule label="Consolidated stock" />
          <p className="mt-3 text-[12px] leading-relaxed text-stone">
            Each branch counts its own shelf. When a title sells out in one location, move stock
            rather than reordering — the transfer list keeps the paper trail.
          </p>
          <Link
            href="/admin/transfers"
            className="link-quiet mt-3 inline-flex items-center gap-1.5 text-[11.5px] text-forest"
          >
            Open transfers
            <IconArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Panel>
      </div>

      <div className="mt-4">
        <DataNote>
          Addresses, managers and hours are sample records. Branch rows drive the stock table, the
          transfer routes and the per-branch columns in every report.
        </DataNote>
      </div>
    </div>
  );
}
