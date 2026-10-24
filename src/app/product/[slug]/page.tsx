import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { IconArrowLeft, IconChevronRight } from "@/components/icons";
import { ProductArt } from "@/components/product-art";
import { ShopShell } from "@/components/shop/shop-shell";
import { AddButton } from "@/components/shop/catalog";
import { Badge, Panel, StarRule } from "@/components/ui";
import {
  branches,
  categoryLabel,
  getProduct,
  gradeLabels,
  isLowStock,
  products,
  totalStock,
} from "@/lib/data";
import { currency } from "@/lib/format";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Product not found" };
  return { title: product.title, description: product.blurb };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) notFound();

  const related = products
    .filter((item) => item.category === product.category && item.id !== product.id)
    .slice(0, 3);

  return (
    <ShopShell active="store">
      <div className="mx-auto w-full max-w-[1240px] px-5 py-6 sm:px-8">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-[12px] text-stone">
          <Link href="/store" className="hover:text-ink">
            Store
          </Link>
          <IconChevronRight className="h-3 w-3" />
          <span>{categoryLabel(product.category)}</span>
          <IconChevronRight className="h-3 w-3" />
          <span className="text-ink">{product.title}</span>
        </nav>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-12">
          <div>
            <Panel ticks className="overflow-hidden">
              <ProductArt
                category={product.category}
                tone={product.tone}
                className="aspect-[4/3] w-full"
              />
            </Panel>
            <div className="mt-3 flex items-center justify-between text-[11.5px] text-stone">
              <span className="num">Item code {product.code}</span>
              <span>Artwork is a catalog placeholder</span>
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="lbl">{categoryLabel(product.category)}</span>
              {product.badge === "new" ? <Badge tone="brick">New</Badge> : null}
              {product.badge === "popular" ? <Badge tone="forest">Popular</Badge> : null}
              {isLowStock(product) ? <Badge tone="gold">Low stock</Badge> : null}
            </div>

            <h1 className="mt-2.5 text-[30px] leading-[1.1] text-ink sm:text-[34px]">
              {product.title}
            </h1>
            <p className="mt-1.5 text-[13px] text-stone">{product.publisher}</p>

            <div className="mt-5 flex flex-wrap items-end gap-3">
              <span className="num font-display text-[32px] leading-none text-brick">
                {currency(product.price)}
              </span>
              <span className="pb-1 text-[11.5px] text-stone">per item</span>
            </div>

            <p className="mt-4 max-w-[54ch] text-[13.5px] leading-relaxed text-ink/85">
              {product.blurb}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {product.grades.map((grade) => (
                <span
                  key={grade}
                  className="border border-line px-2.5 py-1 text-[11.5px] text-stone"
                >
                  {gradeLabels[grade]}
                </span>
              ))}
            </div>

            <div className="mt-6">
              <AddButton full productId={product.id} title={product.title} />
              <p className="mt-2.5 text-[11.5px] text-stone">
                {totalStock(product) > 0
                  ? `${totalStock(product)} across all branches · collect at the counter today, or pay in store.`
                  : "Not in stock right now — ask the counter to order it for you."}
              </p>
            </div>

            <div className="mt-7">
              <StarRule label="Stock by branch" />
              <table className="tbl mt-2">
                <tbody>
                  {branches.map((branch) => {
                    const stock = product.stock[branch.id];
                    return (
                      <tr key={branch.id}>
                        <td className="font-medium text-ink">{branch.name}</td>
                        <td className="text-[11.5px] text-stone">{branch.hours}</td>
                        <td className="num text-right">
                          {stock > 0 ? (
                            <span className="text-ink">{stock} on shelf</span>
                          ) : (
                            <span className="text-stone">None</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-7">
              <StarRule label="Details" />
              <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-3">
                {product.specs.map((spec) => (
                  <div key={spec.label}>
                    <dt className="lbl">{spec.label}</dt>
                    <dd className="mt-1 text-[13px] text-ink">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>

        {related.length > 0 ? (
          <section className="mt-14">
            <div className="mb-4 flex items-end justify-between gap-4">
              <h2 className="text-[21px] text-ink">More {categoryLabel(product.category).toLowerCase()}</h2>
              <Link
                href="/store"
                className="link-quiet inline-flex items-center gap-1.5 text-[12.5px] text-forest"
              >
                <IconArrowLeft className="h-3.5 w-3.5" />
                Back to the catalog
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {related.map((item) => (
                <Link
                  key={item.id}
                  href={`/product/${item.slug}`}
                  className="group border border-line bg-paper transition-colors hover:border-line-strong"
                >
                  <ProductArt
                    category={item.category}
                    tone={item.tone}
                    className="aspect-[4/3] w-full"
                  />
                  <div className="p-3.5">
                    <h3 className="text-[13px] font-medium leading-snug text-ink group-hover:underline group-hover:underline-offset-2">
                      {item.title}
                    </h3>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="num font-display text-[16px] text-brick">
                        {currency(item.price)}
                      </span>
                      <span className="text-[10.5px] text-stone">{totalStock(item)} in stock</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </ShopShell>
  );
}
