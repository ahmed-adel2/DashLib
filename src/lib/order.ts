import type { BranchId } from "@/lib/data";
import type { PaymentMethod } from "@/lib/payments";

export type PlacedOrder = {
  ref: string;
  placedAt: string;
  method: PaymentMethod;
  branch: BranchId;
  customer: string;
  email: string;
  phone: string;
  items: { title: string; qty: number; price: number }[];
  subtotal: number;
};

export const LAST_ORDER_KEY = "dashlib.lastOrder.v1";

export const readLastOrder = (): PlacedOrder | null => {
  try {
    const raw = window.sessionStorage.getItem(LAST_ORDER_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return null;
    const candidate = parsed as Partial<PlacedOrder>;
    if (typeof candidate.ref !== "string" || !Array.isArray(candidate.items)) return null;
    return candidate as PlacedOrder;
  } catch {
    return null;
  }
};
