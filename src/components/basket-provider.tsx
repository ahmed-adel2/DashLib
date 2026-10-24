"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getProductById } from "@/lib/data";

export type BasketLine = {
  productId: string;
  qty: number;
};

type BasketValue = {
  lines: BasketLine[];
  hydrated: boolean;
  count: number;
  subtotal: number;
  add: (productId: string, qty?: number) => void;
  setQty: (productId: string, qty: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
};

const STORAGE_KEY = "dashlib.basket.v1";

const BasketContext = createContext<BasketValue | null>(null);

export function BasketProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<BasketLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const safe = parsed.filter((item): item is BasketLine => {
            if (typeof item !== "object" || item === null) return false;
            const candidate = item as { productId?: unknown; qty?: unknown };
            return (
              typeof candidate.productId === "string" &&
              typeof candidate.qty === "number" &&
              candidate.qty > 0 &&
              getProductById(candidate.productId) !== undefined
            );
          });
          setLines(safe);
        }
      }
    } catch {
      setLines([]);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* storage full or blocked: the basket still works for this session */
    }
  }, [lines, hydrated]);

  const add = useCallback((productId: string, qty = 1) => {
    const validQty = Math.max(1, Math.min(99, Math.floor(Number(qty) || 1)));
    setLines((current) => {
      const existing = current.find((line) => line.productId === productId);
      if (existing) {
        const nextQty = Math.min(99, existing.qty + validQty);
        return current.map((line) =>
          line.productId === productId ? { ...line, qty: nextQty } : line,
        );
      }
      return [...current, { productId, qty: validQty }];
    });
  }, []);

  const setQty = useCallback((productId: string, qty: number) => {
    const parsed = Math.floor(Number(qty) || 0);
    setLines((current) =>
      parsed <= 0
        ? current.filter((line) => line.productId !== productId)
        : current.map((line) =>
            line.productId === productId ? { ...line, qty: Math.min(99, parsed) } : line,
          ),
    );
  }, []);

  const remove = useCallback((productId: string) => {
    setLines((current) => current.filter((line) => line.productId !== productId));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const { count, subtotal } = useMemo(() => {
    let items = 0;
    let total = 0;
    for (const line of lines) {
      const product = getProductById(line.productId);
      if (!product) continue;
      items += line.qty;
      total += product.price * line.qty;
    }
    return { count: items, subtotal: Math.round(total * 100) / 100 };
  }, [lines]);

  const value = useMemo<BasketValue>(
    () => ({ lines, hydrated, count, subtotal, add, setQty, remove, clear }),
    [lines, hydrated, count, subtotal, add, setQty, remove, clear],
  );

  return <BasketContext.Provider value={value}>{children}</BasketContext.Provider>;
}

export function useBasket() {
  const value = useContext(BasketContext);
  if (!value) throw new Error("useBasket must be used inside BasketProvider");
  return value;
}
