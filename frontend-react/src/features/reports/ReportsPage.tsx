import { BarChart3, PieChart, TrendingDown, TrendingUp } from "lucide-react";
import { PageHeader } from "../../components/layout/PageHeader";
import { Card } from "../../components/ui/Card";
import { StatCard } from "../../components/cards/StatCard";
import { products, sales } from "../../data/mock-data";
import { formatCurrency } from "../../utils/formatters";

export function ReportsPage() {
  const totalSales = sales.reduce((sum, sale) => sum + sale.amount, 0);
  return (
    <>
      <PageHeader title="Reports" eyebrow="Business performance" />
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Sales overview" value={formatCurrency(totalSales)} icon={<BarChart3 size={20} />} />
        <StatCard label="Inventory health" value="82%" icon={<PieChart size={20} />} tone="green" />
        <StatCard label="Profit margin" value="34%" helper="Placeholder" icon={<TrendingUp size={20} />} />
        <StatCard label="Slow products" value="2" icon={<TrendingDown size={20} />} tone="amber" />
      </div>
      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        <Card>
          <h2 className="text-lg font-bold">Top products</h2>
          <div className="mt-4 space-y-3">{products.slice(0, 4).map((product) => <div key={product.id} className="flex justify-between rounded-lg border border-line p-3"><span>{product.name}</span><strong>{formatCurrency(product.sellingPrice * Math.max(3, product.lowStockThreshold))}</strong></div>)}</div>
        </Card>
        <Card>
          <h2 className="text-lg font-bold">Payment mode breakdown</h2>
          <div className="mt-4 space-y-3">{["UPI 52%", "Cash 28%", "Card 14%", "Credit 6%"].map((item) => <div key={item} className="rounded-lg border border-line bg-slate-50 p-3 font-semibold text-slate-700">{item}</div>)}</div>
        </Card>
      </div>
    </>
  );
}
