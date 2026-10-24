import type { Metadata } from "next";
import { ReportTabs } from "@/components/admin/report-tabs";
import { DataNote, PageHeading } from "@/components/ui";
import { dailySales, monthTotals, monthlySales } from "@/lib/data";
import { currency } from "@/lib/format";

export const metadata: Metadata = {
  title: "Reports & export",
};

export default function ReportsPage() {
  return (
    <div>
      <PageHeading
        title="Reports & export"
        meta={
          <>
            <span className="num">{currency(monthTotals.revenue)} this month</span>
            <span aria-hidden="true" className="text-moss">
              /
            </span>
            <span>Daily and monthly</span>
            <span aria-hidden="true" className="text-moss">
              /
            </span>
            <span>Excel-ready workbook</span>
          </>
        }
      />

      <ReportTabs daily={dailySales} monthly={monthlySales} />

      <div className="mt-4">
        <DataNote>
          Monthly totals are the closed figures the office reviews; daily rows come from the orders
          table. Exports contain the same numbers shown on screen — no separate calculation path.
        </DataNote>
      </div>
    </div>
  );
}
