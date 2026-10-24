"use client";

import { useEffect } from "react";
import Link from "next/link";
import { StarMotif } from "@/components/icons";
import { Button } from "@/components/ui";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log unexpected client-side crash
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-plaster px-5 py-12">
      <div className="w-full max-w-[500px] border border-line bg-paper p-8 text-center shadow-xs">
        <StarMotif className="mx-auto h-4 w-4 text-brick" />
        <h1 className="mt-4 font-display text-[26px] leading-tight text-ink sm:text-[30px]">
          Something interrupted the shelf
        </h1>
        <p className="mx-auto mt-2 max-w-[42ch] text-[13px] leading-relaxed text-stone">
          We encountered an unexpected error while loading this page. Your saved items and orders
          remain safe.
        </p>

        {error.digest ? (
          <p className="num mt-3 text-[11px] text-stone/80">Reference ID: {error.digest}</p>
        ) : null}

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button variant="primary" size="md" onClick={() => reset()}>
            Try again
          </Button>
          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center rounded-sm border border-moss bg-paper px-4 text-[13px] font-medium text-ink transition-colors hover:border-forest hover:bg-cream"
          >
            Return to store
          </Link>
        </div>
      </div>
    </div>
  );
}
