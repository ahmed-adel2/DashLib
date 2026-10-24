/**
 * INTEGRATION POINT — payment provider.
 *
 * The brief leaves the provider open, so the checkout calls this one function
 * and nothing else. To go live:
 *   1. Add the provider's server SDK (Stripe, Tap, PayTabs, Adyen …).
 *   2. Move the intent creation into a route handler, e.g.
 *      `src/app/api/payments/intent/route.ts`, and keep the secret key server-side.
 *   3. Replace the body of `createPaymentIntent` with a fetch to that route and
 *      return the provider's client secret so the checkout can confirm it.
 * Never put a secret key in this file.
 */

import type { BranchId } from "@/lib/data";

export type PaymentMethod = "card" | "cash";

export type PaymentRequest = {
  orderRef: string;
  amount: number;
  method: PaymentMethod;
  branch: BranchId;
};

export type PaymentResult =
  | { ok: true; reference: string }
  | { ok: false; error: string };

export function createPaymentIntent(request: PaymentRequest): PaymentResult {
  if (!Number.isFinite(request.amount) || request.amount <= 0) {
    return { ok: false, error: "The basket total is empty, so there is nothing to pay." };
  }

  if (request.method === "cash") {
    return { ok: true, reference: `CASH-${request.orderRef}` };
  }

  return { ok: true, reference: `DEMO-${request.orderRef}` };
}

export function newOrderRef() {
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `DL-${suffix}`;
}
