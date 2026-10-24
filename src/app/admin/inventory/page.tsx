import type { Metadata } from "next";
import { ExportButton } from "@/components/admin/export-button";
import { InventoryTable } from "@/components/admin/inventory-table";
import { DataNote, PageHeading } from "@/components/ui";
import { branches, isLowStock, products, totalStock } from "@/lib/data";
import { number } from "@/lib/format";

export const metadata: Metadata = {
  title: "Inventory",
};

export default function InventoryPage() {
  const lowCount = products.filter(isLowStock).length;
  const units = products.reduce((sum, product) => sum + totalStock(product), 0);

  return (
    <div>
      <PageHeading
        title="Inventory"
        meta={
          <>
            <span>{products.length} products</span>
            <span aria-hidden="true" className="text-moss">
              /
            </span>
            <span className="num">{number(units)} units on shelves</span>
            <span aria-hidden="true" className="text-moss">
              /
            </span>
            <span className={lowCount > 0 ? "text-brick" : undefined}>{lowCount} low-stock lines</span>
          </>
        }
        actions={
          <ExportButton
            filename="dashlib-inventory"
            label="Export stock"
            sheets={[
              {
                name: "Stock by branch",
                columns: [
                  { header: "Product", width: 220 },
                  { header: "Code" },
                  { header: "Category" },
                  { header: "Main", type: "Number" },
                  { header: "East", type: "Number" },
                  { header: "West", type: "Number" },
                  { header: "Total", type: "Number" },
                ],
                rows: products.map((product) => [
                  product.title,
                  product.code,
                  product.category,
                  product.stock.main,
                  product.stock.east,
                  product.stock.west,
                  totalStock(product),
                ]),
              },
            ]}
          />
        }
      />

      <InventoryTable initial={products} />

      <div className="mt-4">
        <DataNote>
          Stock is counted per branch. Adjustments here are a preview of the write path; the catalog
          you see in the store reads the same numbers once Supabase is connected.
        </DataNote>
      </div>
    </div>
  );
}
