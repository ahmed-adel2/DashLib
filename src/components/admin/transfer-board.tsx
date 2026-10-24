"use client";

import { useState } from "react";
import { IconCheck, IconTransfer } from "@/components/icons";
import { Badge, Button, Field, Panel, PanelHead, StarRule } from "@/components/ui";
import { ScrollShade } from "@/components/ui/scroll-shade";
import {
  branches,
  getProductById,
  type BranchId,
  type Product,
  type Transfer,
  type TransferStatus,
} from "@/lib/data";
import { formatDate, number } from "@/lib/format";

const statusTone: Record<TransferStatus, "outline" | "gold" | "forest" | "brick"> = {
  draft: "outline",
  "in-transit": "gold",
  received: "forest",
  cancelled: "brick",
};

const statusLabel: Record<TransferStatus, string> = {
  draft: "Draft",
  "in-transit": "In transit",
  received: "Received",
  cancelled: "Cancelled",
};

export function TransferBoard({
  initial,
  catalog,
  requestedBy,
}: {
  initial: Transfer[];
  catalog: Product[];
  requestedBy: string;
}) {
  const [items, setItems] = useState<Transfer[]>(initial);
  const [nextNumber, setNextNumber] = useState(1053);
  const [from, setFrom] = useState<BranchId>("main");
  const [to, setTo] = useState<BranchId>("east");
  const [productId, setProductId] = useState(catalog[0]?.id ?? "");
  const [quantity, setQuantity] = useState("10");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const create = () => {
    if (from === to) {
      setError("Choose two different branches — stock has to move somewhere.");
      return;
    }
    const amount = Number.parseInt(quantity, 10);
    if (!Number.isFinite(amount) || amount < 1) {
      setError("Enter how many units are moving.");
      return;
    }
    const product = getProductById(productId);
    if (!product) {
      setError("Choose the item being transferred.");
      return;
    }
    if (product.stock[from] < amount) {
      setError(`Only ${product.stock[from]} units of that item are recorded at the origin branch.`);
      return;
    }

    const transfer: Transfer = {
      id: `TR-${nextNumber}`,
      from,
      to,
      productId,
      quantity: amount,
      status: "in-transit",
      created: new Date().toISOString().slice(0, 10),
      requestedBy,
    };

    setItems((current) => [transfer, ...current]);
    setNextNumber((value) => value + 1);
    setError(null);
    setNotice(`${transfer.id} is on its way to ${branches.find((b) => b.id === to)?.name}.`);
  };

  const receive = (id: string) => {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, status: "received" } : item)),
    );
    setNotice(`${id} marked as received at the destination branch.`);
  };

  const inTransit = items.filter((item) => item.status === "in-transit").length;

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_340px] xl:items-start">
      <Panel className="min-w-0">
        <PanelHead
          title="Transfers"
          hint={`${items.length} records · ${inTransit} in transit`}
        />
        <ScrollShade>
          <table className="tbl">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Item</th>
                <th>Route</th>
                <th className="num">Units</th>
                <th>Created</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map((transfer) => {
                const product = getProductById(transfer.productId);
                return (
                  <tr key={transfer.id}>
                    <td className="num text-[12px] font-medium text-ink">{transfer.id}</td>
                    <td className="min-w-[180px] text-[12.5px] text-ink" data-label="Item">
                      {product?.title ?? "Unknown item"}
                      <span className="block text-[10.5px] text-stone">
                        {transfer.requestedBy}
                      </span>
                    </td>
                    <td className="text-[11.5px] text-stone" data-label="Route">
                      {branches.find((branch) => branch.id === transfer.from)?.shortName}
                      <span className="mx-1.5 text-moss">→</span>
                      {branches.find((branch) => branch.id === transfer.to)?.shortName}
                    </td>
                    <td className="num text-right text-[12px] text-ink" data-label="Units">
                      {number(transfer.quantity)}
                    </td>
                    <td className="num text-[11.5px] text-stone" data-label="Created">
                      {formatDate(transfer.created)}
                    </td>
                    <td data-label="Status">
                      <Badge tone={statusTone[transfer.status]}>
                        {statusLabel[transfer.status]}
                      </Badge>
                    </td>
                    <td className="text-right">
                      {transfer.status === "in-transit" ? (
                        <button
                          type="button"
                          onClick={() => receive(transfer.id)}
                          className="inline-flex items-center gap-1 text-[11px] text-forest hover:underline"
                        >
                          <IconCheck className="h-3 w-3" />
                          Receive
                        </button>
                      ) : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </ScrollShade>
        <div className="border-t border-line px-4 py-3">
          <p className="text-[11px] leading-relaxed text-stone">
            Receiving a transfer here updates this list only. In production it writes the stock
            movement and credits the destination branch.
          </p>
        </div>
      </Panel>

      <Panel ticks className="p-4">
        <StarRule label="Move stock" />

        <div className="mt-4 space-y-3.5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="From" htmlFor="tr-from">
              <select
                id="tr-from"
                className="field"
                value={from}
                onChange={(event) => setFrom(event.target.value as BranchId)}
              >
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.shortName}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="To" htmlFor="tr-to">
              <select
                id="tr-to"
                className="field"
                value={to}
                onChange={(event) => setTo(event.target.value as BranchId)}
              >
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.shortName}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Item" htmlFor="tr-item">
            <select
              id="tr-item"
              className="field"
              value={productId}
              onChange={(event) => setProductId(event.target.value)}
            >
              {catalog.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.title}
                </option>
              ))}
            </select>
          </Field>

          <Field
            label="Units"
            htmlFor="tr-qty"
            hint={`Recorded at origin: ${getProductById(productId)?.stock[from] ?? 0} units`}
          >
            <input
              id="tr-qty"
              type="number"
              min={1}
              className="field num"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
            />
          </Field>

          {error ? (
            <p role="alert" className="border border-brick/30 bg-brick-wash px-3 py-2 text-[11.5px] text-brick">
              {error}
            </p>
          ) : null}

          {notice ? (
            <p className="flex items-start gap-2 border border-line bg-forest-tint px-3 py-2 text-[11.5px] text-forest">
              <IconTransfer className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              {notice}
            </p>
          ) : null}

          <Button size="sm" className="w-full" onClick={create}>
            Send transfer
          </Button>
          <p className="text-[10.5px] leading-relaxed text-stone">
            Requested by {requestedBy}. The destination branch receives the record and confirms the
            count at the counter.
          </p>
        </div>
      </Panel>
    </div>
  );
}
