import { Boxes, Clock, PackageMinus, PackagePlus } from "lucide-react";
import { PageHeader } from "../../components/layout/PageHeader";
import { StatCard } from "../../components/cards/StatCard";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { products, inventoryMovements } from "../../data/mock-data";
import { formatDate } from "../../utils/formatters";

export function InventoryPage() {
  const lowStock = products.filter((product) => product.stock <= product.lowStockThreshold && product.stock > 0);
  const outStock = products.filter((product) => product.stock === 0);
  const overStock = products.filter((product) => product.stock > product.lowStockThreshold * 5);

  return (
    <>
      <PageHeader title="Inventory Control" eyebrow="Stock health" actions={<Button>Stock adjustment</Button>} />
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Current stock" value={String(products.reduce((sum, product) => sum + product.stock, 0))} icon={<Boxes size={20} />} />
        <StatCard label="Low stock" value={String(lowStock.length)} icon={<PackageMinus size={20} />} tone="amber" />
        <StatCard label="Overstock" value={String(overStock.length)} icon={<PackagePlus size={20} />} tone="green" />
        <StatCard label="Dead stock" value="Coming soon" icon={<Clock size={20} />} tone="rose" />
      </div>
      <div className="mt-6 grid gap-4 xl:grid-cols-[1fr_0.8fr]">
        <Card>
          <h2 className="text-lg font-bold">Low stock and reorder suggestions</h2>
          <div className="mt-4 space-y-3">
            {[...lowStock, ...outStock].map((product) => (
              <div key={product.id} className="flex items-center justify-between rounded-lg border border-line p-3">
                <div><div className="font-bold text-ink">{product.name}</div><div className="text-sm text-slate-500">Threshold {product.lowStockThreshold}, current {product.stock}</div></div>
                <Badge tone={product.stock === 0 ? "danger" : "warning"}>{product.stock === 0 ? "Create PO" : "Reorder"}</Badge>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="text-lg font-bold">Inventory movement timeline</h2>
          <div className="mt-4 space-y-4">
            {inventoryMovements.map((movement) => (
              <div key={movement.id} className="border-l-2 border-brand pl-4">
                <div className="text-sm font-bold text-ink">{movement.note}</div>
                <div className="mt-1 text-xs text-slate-500">{movement.type} · {movement.qty} units · {formatDate(movement.date)}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
