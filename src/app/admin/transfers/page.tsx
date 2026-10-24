import type { Metadata } from "next";
import { TransferBoard } from "@/components/admin/transfer-board";
import { DataNote, PageHeading } from "@/components/ui";
import { demoAdmin, products, transfers } from "@/lib/data";

export const metadata: Metadata = {
  title: "Branch transfers",
};

export default function TransfersPage() {
  const inTransit = transfers.filter((transfer) => transfer.status === "in-transit").length;

  return (
    <div>
      <PageHeading
        title="Branch transfers"
        meta={
          <>
            <span>{transfers.length} records</span>
            <span aria-hidden="true" className="text-moss">
              /
            </span>
            <span className={inTransit > 0 ? "text-brick" : undefined}>
              {inTransit} in transit
            </span>
            <span aria-hidden="true" className="text-moss">
              /
            </span>
            <span>Main, East and West</span>
          </>
        }
      />

      <TransferBoard initial={transfers} catalog={products} requestedBy={demoAdmin.name} />

      <div className="mt-4">
        <DataNote>
          A transfer is one row with an origin, a destination, a quantity and a status. Sending and
          receiving both write to the same record, which is what keeps the branches agreeing on
          their counts.
        </DataNote>
      </div>
    </div>
  );
}
