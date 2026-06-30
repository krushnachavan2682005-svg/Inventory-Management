import { AlertTriangle, CreditCard, PackageSearch, Receipt, TrendingUp } from "lucide-react";
import { PageHeader } from "../../components/layout/PageHeader";
import { StatCard } from "../../components/cards/StatCard";
import { AlertCard } from "../../components/cards/AlertCard";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { products, customers, sales } from "../../data/mock-data";
import { formatCurrency } from "../../utils/formatters";

export function ShopDashboard() {
  const lowStock = products.filter((product) => product.stock <= product.lowStockThreshold);
  const todaySales = sales.filter((sale) => sale.date === "2026-06-21").reduce((sum, sale) => sum + sale.amount, 0);
  const creditDue = customers.reduce((sum, customer) => sum + customer.creditDue, 0);

  return (
    <>
      <PageHeader title="Today at Krushna Smart Mart" eyebrow="Shopkeeper dashboard" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Today sales" value={formatCurrency(todaySales)} icon={<TrendingUp size={20} />} tone="green" />
        <StatCard label="Total orders" value="28" icon={<Receipt size={20} />} />
        <StatCard label="Low stock items" value={String(lowStock.length)} icon={<AlertTriangle size={20} />} tone="amber" />
        <StatCard label="Profit estimate" value={formatCurrency(18450)} icon={<PackageSearch size={20} />} />
        <StatCard label="Customer credit" value={formatCurrency(creditDue)} icon={<CreditCard size={20} />} tone="rose" />
      </div>
      <div className="mt-6 grid gap-4 xl:grid-cols-[1fr_0.8fr]">
        <Card>
          <h2 className="text-lg font-bold">Fast moving products</h2>
          <div className="mt-4 space-y-3">
            {products.slice(0, 3).map((product, index) => (
              <div key={product.id} className="flex items-center justify-between rounded-lg border border-line p-3">
                <div>
                  <div className="font-bold text-ink">{index + 1}. {product.name}</div>
                  <div className="text-sm text-slate-500">Stock {product.stock} units</div>
                </div>
                <Badge tone={product.stock <= product.lowStockThreshold ? "warning" : "success"}>{product.stock <= product.lowStockThreshold ? "Reorder" : "Healthy"}</Badge>
              </div>
            ))}
          </div>
        </Card>
        <div className="space-y-4">
          <AlertCard title="AI-ready action list" tone="info">Reorder suggestions, demand spikes, dead stock warnings, and customer intelligence will connect here once backend and AI modules are added.</AlertCard>
          <AlertCard title="Low stock alerts" tone="warning">{lowStock.map((product) => product.name).join(", ")} need attention before the next sales rush.</AlertCard>
        </div>
      </div>
    </>
  );
}
