import { Edit, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { PageHeader } from "../../components/layout/PageHeader";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Badge } from "../../components/ui/Badge";
import { DataTable } from "../../components/tables/DataTable";
import { products } from "../../data/mock-data";
import { formatCurrency, marginPercent } from "../../utils/formatters";

export function ProductsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const filtered = useMemo(() => products.filter((product) =>
    (category === "All" || product.category === category) &&
    `${product.name} ${product.sku} ${product.barcode}`.toLowerCase().includes(search.toLowerCase())
  ), [category, search]);

  return (
    <>
      <PageHeader title="Products" eyebrow="Catalog" actions={<Button icon={<Plus size={17} />}>Add product</Button>} />
      <Card>
        <div className="mb-4 grid gap-3 md:grid-cols-[1fr_220px_180px]">
          <Input placeholder="Search product, SKU, barcode..." value={search} onChange={(event) => setSearch(event.target.value)} />
          <Select value={category} onChange={(event) => setCategory(event.target.value)}><option>All</option><option>Electronics</option><option>Stationery</option><option>Home</option></Select>
          <Select><option>All statuses</option><option>In stock</option><option>Low stock</option><option>Out of stock</option></Select>
        </div>
        <DataTable
          data={filtered}
          keyExtractor={(product) => product.id}
          columns={[
            { header: "Product", cell: (product) => <div><strong className="text-ink">{product.name}</strong><div className="text-xs text-slate-500">{product.barcode}</div></div> },
            { header: "SKU", cell: (product) => product.sku },
            { header: "Category", cell: (product) => product.category },
            { header: "Selling", cell: (product) => formatCurrency(product.sellingPrice) },
            { header: "Purchase", cell: (product) => formatCurrency(product.purchasePrice) },
            { header: "Margin", cell: (product) => `${marginPercent(product.sellingPrice, product.purchasePrice)}%` },
            { header: "Stock", cell: (product) => product.stock },
            { header: "Status", cell: (product) => <Badge tone={product.stock === 0 ? "danger" : product.stock <= product.lowStockThreshold ? "warning" : "success"}>{product.stock === 0 ? "Out" : product.stock <= product.lowStockThreshold ? "Low" : "In stock"}</Badge> },
            { header: "Actions", cell: () => <div className="flex gap-2"><Button variant="secondary" icon={<Edit size={15} />} /><Button variant="ghost" icon={<Trash2 size={15} />} /></div> },
          ]}
        />
      </Card>
    </>
  );
}
