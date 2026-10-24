import type { Metadata } from "next";
import { Suspense } from "react";
import { ShopShell } from "@/components/shop/shop-shell";
import { Catalog } from "@/components/shop/catalog";
import { products } from "@/lib/data";

export const metadata: Metadata = {
  title: "Store",
  description:
    "Browse textbooks, stationery, art supplies and printed material with live stock for the Main, East and West branches.",
};

type StoreSearchParams = Promise<{ q?: string | string[] }>;

export default function StorePage({ searchParams }: { searchParams: StoreSearchParams }) {
  return (
    <ShopShell active="store">
      <section className="border-b-2 border-line-strong bg-paper relative overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-1/3 opacity-5 pointer-events-none bg-academic-grid" />
        <div className="mx-auto w-full max-w-[1240px] px-5 pb-10 pt-12 sm:px-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 rounded-sm bg-brick px-2.5 py-0.5 text-[10.5px] font-bold uppercase tracking-[0.14em] text-paper">
              Unified Academic Supply
            </span>
            <span className="text-[12px] font-semibold text-forest">
              Live Stock Count across 3 Branches
            </span>
          </div>
          <h1 className="max-w-[22ch] text-[38px] font-extrabold leading-[1.05] tracking-tight text-ink sm:text-[48px]">
            Everything on the syllabus list. Verified on shelf.
          </h1>
          <p className="mt-4 max-w-[66ch] text-[15px] font-normal leading-relaxed text-ink/80">
            Browse educator-approved textbooks, curriculum notebooks, fine arts gear, and classroom supplies.
            Every item displays instant per-branch shelf counts for Main, East, and West before you visit.
          </p>
        </div>
      </section>

      <Suspense fallback={<Catalog items={products} />}><CatalogResults searchParams={searchParams} /></Suspense>
    </ShopShell>
  );
}

async function CatalogResults({ searchParams }: { searchParams: StoreSearchParams }) {
  const { q } = await searchParams;
  return <Catalog items={products} initialQuery={typeof q === "string" ? q : ""} />;
}