"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { IconCheck, IconPlus } from "@/components/icons";
import { ProductArt } from "@/components/product-art";
import { useBasket } from "@/components/basket-provider";
import { Badge, Button, buttonClass, Empty, Panel } from "@/components/ui";
import {
  branches,
  categories,
  categoryLabel,
  gradeLabels,
  totalStock,
  type BranchId,
  type CategoryId,
  type GradeBand,
  type Product,
} from "@/lib/data";
import { currency } from "@/lib/format";

type SortKey = "popular" | "price-asc" | "price-desc" | "title";

function AddButton({
  productId,
  title,
  full = false,
}: {
  productId: string;
  title: string;
  full?: boolean;
}) {
  const { add } = useBasket();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const id = window.setTimeout(() => setAdded(false), 1600);
    return () => window.clearTimeout(id);
  }, [added]);

  if (full) {
    return (
      <Button
        size="lg"
        className="w-full"
        onClick={() => {
          add(productId);
          setAdded(true);
        }}
        aria-live="polite"
      >
        {added ? <IconCheck className="h-4 w-4" /> : <IconPlus className="h-4 w-4" />}
        {added ? "Added to basket" : "Add to basket"}
      </Button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        add(productId);
        setAdded(true);
      }}
      aria-label={added ? `${title} added to basket` : `Add ${title} to basket`}
      className={`tap-target inline-flex h-8 w-8 items-center justify-center rounded-sm transition-colors ${
        added ? "bg-gold text-paper" : "bg-forest text-paper hover:bg-forest-deep"
      }`}
    >
      {added ? <IconCheck className="h-3.5 w-3.5" /> : <IconPlus className="h-3.5 w-3.5" />}
    </button>
  );
}

function ProductCard({ product, branch }: { product: Product; branch: BranchId | "all" }) {
  const available = branch === "all" ? totalStock(product) : product.stock[branch];

  const categoryBg: Record<CategoryId, string> = {
    books: "bg-[#fcfaf5]",
    stationery: "bg-[#fbf8f2]",
    art: "bg-[#faf5ee]",
    bags: "bg-[#f8f6f0]",
    prints: "bg-[#fbf9f4]",
  };

  return (
    <article className={`group flex flex-col rounded-xs border-2 border-line bg-paper shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-forest hover:shadow-md`}>
      <Link href={`/product/${product.slug}`} className="relative block overflow-hidden bg-cream/70 border-b border-line">
        <ProductArt category={product.category} tone={product.tone} className="aspect-[4/3] w-full transition-transform duration-500 group-hover:scale-[1.03]" />
        {product.badge || available === 0 ? (
          <span className="absolute right-2.5 top-2.5">
            {available === 0 ? (
              <span className="inline-flex items-center rounded-sm border border-stone/30 bg-paper/95 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-stone shadow-xs">
                Out of stock
              </span>
            ) : product.badge === "new" ? (
              <span className="inline-flex items-center rounded-sm bg-brick px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-paper shadow-xs">
                New
              </span>
            ) : (
              <span className="inline-flex items-center rounded-sm bg-forest px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-paper shadow-xs">
                Popular
              </span>
            )}
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col p-4 bg-paper">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center rounded-sm border border-line-strong bg-cream px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink">
            {categoryLabel(product.category)}
          </span>
          <span className="num text-[11px] font-semibold tracking-wider text-stone">{product.code}</span>
        </div>

        <h3 className="mt-2 text-[15px] font-bold leading-snug text-ink group-hover:text-forest transition-colors">
          <Link href={`/product/${product.slug}`} className="hover:underline hover:underline-offset-2">
            {product.title}
          </Link>
        </h3>
        <p className="mt-1 text-[12px] font-medium text-stone">{product.publisher}</p>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-line/70 pt-3.5 mt-3">
          <div>
            <div className="num font-display text-[22px] font-extrabold leading-none text-brick">
              {currency(product.price)}
            </div>
            <div className="mt-1 text-[11px] font-medium text-stone">
              {available === 0
                ? branch === "all"
                  ? "Not in stock"
                  : "None at this branch"
                : branch === "all"
                  ? `${available} in stock`
                  : `${available} at ${branches.find((b) => b.id === branch)?.shortName}`}
            </div>
          </div>
          <AddButton productId={product.id} title={product.title} />
        </div>
      </div>
    </article>
  );
}

export function Catalog({
  items,
  initialQuery = "",
}: {
  items: Product[];
  initialQuery?: string;
}) {
  const router = useRouter();
  const query = initialQuery;
  const [selectedCategories, setSelectedCategories] = useState<CategoryId[]>([]);
  const [selectedGrades, setSelectedGrades] = useState<GradeBand[]>([]);
  const [branch, setBranch] = useState<BranchId | "all">("all");
  const [sort, setSort] = useState<SortKey>("popular");

  const toggleCategory = (id: CategoryId) =>
    setSelectedCategories((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id],
    );

  const toggleGrade = (id: GradeBand) =>
    setSelectedGrades((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id],
    );

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();

    const matches = items.filter((product) => {
      if (needle) {
        const haystack = `${product.title} ${product.publisher} ${product.code} ${categoryLabel(
          product.category,
        )}`.toLowerCase();
        if (!haystack.includes(needle)) return false;
      }
      if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) return false;
      if (selectedGrades.length > 0 && !product.grades.some((grade) => selectedGrades.includes(grade))) {
        return false;
      }
      if (branch !== "all" && product.stock[branch] <= 0) return false;
      return true;
    });

    return matches.sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "title") return a.title.localeCompare(b.title);
      const aBadge = a.badge === "popular" ? 0 : 1;
      const bBadge = b.badge === "popular" ? 0 : 1;
      return aBadge - bBadge || a.title.localeCompare(b.title);
    });
  }, [items, query, selectedCategories, selectedGrades, branch, sort]);

  const hasFilters =
    query.trim().length > 0 || selectedCategories.length > 0 || selectedGrades.length > 0 || branch !== "all";

  const reset = () => {
    setSelectedCategories([]);
    setSelectedGrades([]);
    setBranch("all");
    if (query) router.replace("/");
  };

  return (
    <div className="mx-auto w-full max-w-[1240px] px-5 py-7 sm:px-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[12.5px] text-stone">
          <span className="num font-medium text-ink">{filtered.length}</span> of {items.length} products
          {query.trim() ? (
            <>
              {" "}for <span className="text-ink">“{query.trim()}”</span>
            </>
          ) : null}
          {branch !== "all" ? (
            <>
              {" "}· stock at{" "}
              <span className="text-ink">
                {branches.find((item) => item.id === branch)?.name}
              </span>
            </>
          ) : null}
        </p>

        <label className="flex items-center gap-2 text-[12px] text-stone">
          Sort
          <select
            className="field h-9 w-auto py-0 text-[12px]"
            value={sort}
            onChange={(event) => setSort(event.target.value as SortKey)}
          >
            <option value="popular">Most popular</option>
            <option value="price-asc">Price, low to high</option>
            <option value="price-desc">Price, high to low</option>
            <option value="title">Title A–Z</option>
          </select>
        </label>
      </div>

      <div className="grid gap-6 lg:grid-cols-[236px_1fr]">
        <aside className="lg:sticky lg:top-[92px] lg:self-start">
          <Panel ticks className="p-4">
            <fieldset>
              <legend className="lbl mb-2">Category</legend>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1 lg:grid-cols-1">
                {categories.map((category) => {
                  const isChecked = selectedCategories.includes(category.id);
                  return (
                    <label
                      key={category.id}
                      className={`tap-target flex cursor-pointer items-center gap-2.5 rounded-sm px-2 py-1.5 text-[12.5px] transition-colors ${
                        isChecked ? "bg-sage/70 font-medium text-forest" : "text-ink hover:bg-cream"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleCategory(category.id)}
                        className="h-4 w-4 accent-forest"
                      />
                      {category.label}
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <fieldset className="mt-4 border-t border-line pt-4">
              <legend className="lbl mb-2">Grade level</legend>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1 lg:grid-cols-1">
                {(Object.keys(gradeLabels) as GradeBand[]).map((grade) => {
                  const isChecked = selectedGrades.includes(grade);
                  return (
                    <label
                      key={grade}
                      className={`tap-target flex cursor-pointer items-center gap-2.5 rounded-sm px-2 py-1.5 text-[12.5px] transition-colors ${
                        isChecked ? "bg-sage/70 font-medium text-forest" : "text-ink hover:bg-cream"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleGrade(grade)}
                        className="h-4 w-4 accent-forest"
                      />
                      {gradeLabels[grade]}
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <div className="mt-4 border-t border-line pt-4">
              <label htmlFor="branch-filter" className="lbl mb-2 block">
                Branch stock
              </label>
              <select
                id="branch-filter"
                className="field"
                value={branch}
                onChange={(event) => setBranch(event.target.value as BranchId | "all")}
              >
                <option value="all">All branches</option>
                {branches.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-[11px] leading-snug text-stone">
                Shows only what is on the shelf at that location today.
              </p>
            </div>

            {hasFilters ? (
              <button
                type="button"
                onClick={reset}
                className={`${buttonClass("secondary", "sm", "mt-4 w-full")}`}
              >
                Clear filters
              </button>
            ) : null}
          </Panel>
        </aside>

        <div>
          {filtered.length === 0 ? (
            <Panel>
              <Empty
                title="Nothing matches that yet"
                body="Try clearing the grade filter, switching branch, or searching by title — some titles are only stocked at one location."
                action={
                  <Button variant="secondary" onClick={reset}>
                    Clear filters
                  </Button>
                }
              />
            </Panel>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} branch={branch} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export { AddButton };
