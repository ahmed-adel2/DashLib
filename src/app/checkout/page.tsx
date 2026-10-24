"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IconCheck } from "@/components/icons";
import { ShopShell } from "@/components/shop/shop-shell";
import { useBasket } from "@/components/basket-provider";
import { Button, ButtonLink, Empty, Field, Panel, StarRule } from "@/components/ui";
import { branches, getProductById, type BranchId } from "@/lib/data";
import { currency } from "@/lib/format";
import { createPaymentIntent, newOrderRef, type PaymentMethod } from "@/lib/payments";
import { LAST_ORDER_KEY, type PlacedOrder } from "@/lib/order";

const steps = ["Details", "Payment", "Review"] as const;
type Step = 1 | 2 | 3;

export default function CheckoutPage() {
  const router = useRouter();
  const { lines, subtotal, clear } = useBasket();

  const [step, setStep] = useState<Step>(1);
  const [details, setDetails] = useState({
    name: "",
    email: "",
    phone: "",
    branch: "main" as BranchId,
  });
  const [method, setMethod] = useState<PaymentMethod>("card");
  const [card, setCard] = useState({ number: "", holder: "", expiry: "", cvc: "" });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const items = lines.reduce<{ title: string; qty: number; price: number }[]>((result, line) => {
    const product = getProductById(line.productId);
    if (product) result.push({ title: product.title, qty: line.qty, price: product.price });
    return result;
  }, []);

  const selectedBranch = branches.find((branch) => branch.id === details.branch) ?? branches[0];

  const validateDetails = () => {
    if (details.name.trim().length < 2) return "Enter the name the order should be held under.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email))
      return "Enter an email we can send the receipt to.";
    if (details.phone.replace(/\D/g, "").length < 7)
      return "Enter a phone number so the branch can reach you.";
    return null;
  };

  const validatePayment = () => {
    if (method === "cash") return null;
    if (card.number.replace(/\s/g, "").length < 12) return "Enter a card number with at least 12 digits.";
    if (!/^\d{2}\s?\/\s?\d{2}$/.test(card.expiry)) return "Enter the expiry date as MM/YY.";
    if (!/^\d{3,4}$/.test(card.cvc)) return "Enter the 3 or 4 digit security code.";
    return null;
  };

  const goNext = () => {
    setError(null);
    if (step === 1) {
      const message = validateDetails();
      if (message) {
        setError(message);
        return;
      }
      setStep(2);
      return;
    }
    if (step === 2) {
      const message = validatePayment();
      if (message) {
        setError(message);
        return;
      }
      setStep(3);
    }
  };

  const goBack = () => {
    setError(null);
    setStep((current) => (current === 3 ? 2 : 1));
  };

  const placeOrder = () => {
    if (items.length === 0) {
      setError("Your basket is empty, so there is nothing to order.");
      return;
    }

    setError(null);
    setSubmitting(true);

    const ref = newOrderRef();
    const result = createPaymentIntent({
      orderRef: ref,
      amount: subtotal,
      method,
      branch: details.branch,
    });

    if (!result.ok) {
      setSubmitting(false);
      setError(result.error);
      return;
    }

    const order: PlacedOrder = {
      ref,
      placedAt: new Date().toISOString(),
      method,
      branch: details.branch,
      customer: details.name.trim(),
      email: details.email.trim(),
      phone: details.phone.trim(),
      items,
      subtotal,
    };

    try {
      window.sessionStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order));
    } catch {
      /* private mode: the confirmation screen falls back to its empty state */
    }

    clear();
    router.push(`/checkout/confirmed?ref=${encodeURIComponent(ref)}`);
  };

  if (items.length === 0 && !submitting) {
    return (
      <ShopShell active="store">
        <div className="mx-auto w-full max-w-[720px] px-5 py-12 sm:px-8">
          <Panel ticks>
            <Empty
              title="Your basket is empty"
              body="Add the items from your school list first, then come back to check out."
              action={<ButtonLink href="/">Browse the catalog</ButtonLink>}
            />
          </Panel>
        </div>
      </ShopShell>
    );
  }

  return (
    <ShopShell active="store">
      <div className="mx-auto w-full max-w-[1020px] px-5 py-9 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-[30px] leading-none text-ink">Checkout</h1>
          <p className="text-[11.5px] text-stone">
            Demonstration checkout — no card is charged and no order is sent.
          </p>
        </div>

        <ol className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
          {steps.map((label, index) => {
            const value = (index + 1) as Step;
            const done = step > value;
            const current = step === value;
            return (
              <li key={label} className="flex items-center gap-2">
                <span
                  className={`num inline-flex h-6 w-6 items-center justify-center rounded-sm border text-[11px] ${
                    current
                      ? "border-forest bg-forest text-paper"
                      : done
                        ? "border-gold bg-gold-tint text-gold-ink"
                        : "border-line bg-paper text-stone"
                  }`}
                >
                  {done ? <IconCheck className="h-3 w-3" /> : value}
                </span>
                <span className={`text-[12px] ${current ? "text-ink" : "text-stone"}`}>{label}</span>
                {index < steps.length - 1 ? <span className="mx-1 h-px w-6 bg-line" /> : null}
              </li>
            );
          })}
        </ol>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px] lg:items-start">
          <Panel ticks className="p-5">
            {step === 1 ? (
              <div>
                <StarRule label="Pickup details" />
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Field label="Full name" htmlFor="co-name">
                      <input
                        id="co-name"
                        className="field"
                        maxLength={80}
                        required
                        value={details.name}
                        onChange={(event) =>
                          setDetails((current) => ({ ...current, name: event.target.value }))
                        }
                        autoComplete="name"
                        placeholder="Layla Haddad"
                      />
                    </Field>
                  </div>
                  <Field label="Email" htmlFor="co-email">
                    <input
                      id="co-email"
                      type="email"
                      className="field"
                      maxLength={120}
                      required
                      value={details.email}
                      onChange={(event) =>
                        setDetails((current) => ({ ...current, email: event.target.value }))
                      }
                      autoComplete="email"
                      placeholder="you@school.edu"
                    />
                  </Field>
                  <Field label="Phone" htmlFor="co-phone">
                    <input
                      id="co-phone"
                      type="tel"
                      className="field"
                      maxLength={24}
                      required
                      value={details.phone}
                      onChange={(event) =>
                        setDetails((current) => ({ ...current, phone: event.target.value }))
                      }
                      autoComplete="tel"
                      placeholder="+1 555 0142"
                    />
                  </Field>
                  <div className="sm:col-span-2">
                    <Field
                      label="Collect from"
                      htmlFor="co-branch"
                      hint={`${selectedBranch.address} · ${selectedBranch.hours}`}
                    >
                      <select
                        id="co-branch"
                        className="field"
                        value={details.branch}
                        onChange={(event) =>
                          setDetails((current) => ({
                            ...current,
                            branch: event.target.value as BranchId,
                          }))
                        }
                      >
                        {branches.map((branch) => (
                          <option key={branch.id} value={branch.id}>
                            {branch.name}
                          </option>
                        ))}
                      </select>
                    </Field>
                  </div>
                </div>
              </div>
            ) : null}

            {step === 2 ? (
              <div>
                <StarRule label="Payment" />
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <label
                    className={`flex cursor-pointer items-start gap-2.5 border p-3 ${
                      method === "card" ? "border-forest bg-forest-tint" : "border-line bg-paper"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment-method"
                      className="mt-0.5 h-3.5 w-3.5 accent-forest"
                      checked={method === "card"}
                      onChange={() => setMethod("card")}
                    />
                    <span>
                      <span className="block text-[13px] font-medium text-ink">Card</span>
                      <span className="block text-[11.5px] leading-snug text-stone">
                        Visa, Mastercard or debit
                      </span>
                    </span>
                  </label>
                  <label
                    className={`flex cursor-pointer items-start gap-2.5 border p-3 ${
                      method === "cash" ? "border-forest bg-forest-tint" : "border-line bg-paper"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment-method"
                      className="mt-0.5 h-3.5 w-3.5 accent-forest"
                      checked={method === "cash"}
                      onChange={() => setMethod("cash")}
                    />
                    <span>
                      <span className="block text-[13px] font-medium text-ink">Pay at pickup</span>
                      <span className="block text-[11.5px] leading-snug text-stone">
                        Cash or card at the counter
                      </span>
                    </span>
                  </label>
                </div>

                {method === "card" ? (
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <Field label="Card number" htmlFor="co-card" hint="Sample checkout — any digits work.">
                        <input
                          id="co-card"
                          className="field num"
                          inputMode="numeric"
                          maxLength={23}
                          value={card.number}
                          onChange={(event) =>
                            setCard((current) => ({ ...current, number: event.target.value }))
                          }
                          autoComplete="cc-number"
                          placeholder="4242 4242 4242 4242"
                        />
                      </Field>
                    </div>
                    <div className="sm:col-span-2">
                      <Field label="Name on card" htmlFor="co-card-name">
                        <input
                          id="co-card-name"
                          className="field"
                          maxLength={80}
                          value={card.holder}
                          onChange={(event) =>
                            setCard((current) => ({ ...current, holder: event.target.value }))
                          }
                          autoComplete="cc-name"
                          placeholder="Layla Haddad"
                        />
                      </Field>
                    </div>
                    <Field label="Expiry" htmlFor="co-expiry">
                      <input
                        id="co-expiry"
                        className="field num"
                        inputMode="numeric"
                        maxLength={7}
                        value={card.expiry}
                        onChange={(event) =>
                          setCard((current) => ({ ...current, expiry: event.target.value }))
                        }
                        autoComplete="cc-exp"
                        placeholder="09/28"
                      />
                    </Field>
                    <Field label="Security code" htmlFor="co-cvc">
                      <input
                        id="co-cvc"
                        className="field num"
                        inputMode="numeric"
                        maxLength={4}
                        value={card.cvc}
                        onChange={(event) =>
                          setCard((current) => ({ ...current, cvc: event.target.value }))
                        }
                        autoComplete="cc-csc"
                        placeholder="123"
                      />
                    </Field>
                  </div>
                ) : (
                  <p className="mt-5 border border-line bg-cream p-3 text-[12px] leading-relaxed text-stone">
                    Reserve now and pay at the counter when you collect. The branch holds your items
                    for 48 hours.
                  </p>
                )}
              </div>
            ) : null}

            {step === 3 ? (
              <div>
                <StarRule label="Review" />
                <dl className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
                  <div>
                    <dt className="lbl">Name</dt>
                    <dd className="mt-1 text-[13px] text-ink">{details.name}</dd>
                  </div>
                  <div>
                    <dt className="lbl">Contact</dt>
                    <dd className="mt-1 text-[13px] text-ink">
                      {details.email}
                      <span className="block text-[11.5px] text-stone">{details.phone}</span>
                    </dd>
                  </div>
                  <div>
                    <dt className="lbl">Pickup</dt>
                    <dd className="mt-1 text-[13px] text-ink">
                      {selectedBranch.name}
                      <span className="block text-[11.5px] text-stone">{selectedBranch.address}</span>
                    </dd>
                  </div>
                  <div>
                    <dt className="lbl">Payment</dt>
                    <dd className="mt-1 text-[13px] text-ink">
                      {method === "card" ? "Card" : "Pay at pickup"}
                    </dd>
                  </div>
                </dl>

                <div className="mt-5 border-t border-line pt-3">
                  <ul className="divide-y divide-line">
                    {items.map((item) => (
                      <li key={item.title} className="flex items-start justify-between gap-4 py-2">
                        <span className="text-[12.5px] text-ink">
                          {item.title}
                          <span className="num ml-2 text-stone">×{item.qty}</span>
                        </span>
                        <span className="num text-[12.5px] text-ink">
                          {currency(item.price * item.qty)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <Button variant="secondary" size="sm" onClick={() => setStep(1)}>
                    Edit details
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => setStep(2)}>
                    Edit payment
                  </Button>
                </div>
              </div>
            ) : null}

            {error ? (
              <p role="alert" className="mt-4 border border-brick/30 bg-brick-wash px-3 py-2 text-[12px] text-brick">
                {error}
              </p>
            ) : null}

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
              {step > 1 ? (
                <Button variant="secondary" onClick={goBack} disabled={submitting}>
                  Back
                </Button>
              ) : (
                <Link href="/basket" className="link-quiet text-[12.5px] text-forest">
                  Back to basket
                </Link>
              )}

              {step < 3 ? (
                <Button onClick={goNext}>Continue</Button>
              ) : (
                <Button onClick={placeOrder} disabled={submitting} size="lg">
                  {submitting ? "Placing order…" : `Place order · ${currency(subtotal)}`}
                </Button>
              )}
            </div>
          </Panel>

          <Panel className="p-4 lg:sticky lg:top-[92px]">
            <StarRule label="Order summary" />
            <ul className="mt-3 space-y-2">
              {items.map((item) => (
                <li key={item.title} className="flex items-start justify-between gap-3 text-[12px]">
                  <span className="min-w-0 text-ink">
                    {item.title}
                    <span className="num ml-1 text-stone">×{item.qty}</span>
                  </span>
                  <span className="num shrink-0 text-ink">{currency(item.price * item.qty)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
              <span className="text-[12.5px] text-stone">Total</span>
              <span className="num font-display text-[24px] leading-none text-brick">
                {currency(subtotal)}
              </span>
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-stone">
              Pickup is free at every branch. Payment provider wiring is the only unfinished
              integration in this flow.
            </p>
          </Panel>
        </div>
      </div>
    </ShopShell>
  );
}
