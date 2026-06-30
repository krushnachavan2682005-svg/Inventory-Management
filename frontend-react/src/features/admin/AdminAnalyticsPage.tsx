import { BarChart3, LineChart, PieChart } from "lucide-react";
import { PageHeader } from "../../components/layout/PageHeader";
import { Card } from "../../components/ui/Card";
import { StatCard } from "../../components/cards/StatCard";
import { shops } from "../../data/mock-data";
import { formatCurrency } from "../../utils/formatters";

export function AdminAnalyticsPage() {
  return (
    <>
      <PageHeader title="Admin Analytics" eyebrow="Platform intelligence" />
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Platform sales placeholder" value={formatCurrency(shops.reduce((sum, shop) => sum + shop.monthlySales, 0))} icon={<BarChart3 size={20} />} />
        <StatCard label="Top active shops" value="2" helper="High usage tenants" icon={<LineChart size={20} />} tone="green" />
        <StatCard label="Subscription mix" value="Pro 33%" helper="Mock plan distribution" icon={<PieChart size={20} />} tone="amber" />
      </div>
      <Card className="mt-6">
        <h2 className="text-lg font-bold">Usage overview</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-4">
          {["POS sessions", "Products synced", "Invoices generated", "Low-stock alerts"].map((label, index) => (
            <div key={label} className="rounded-lg border border-line bg-slate-50 p-4">
              <div className="text-sm font-semibold text-slate-500">{label}</div>
              <div className="mt-2 text-2xl font-bold text-ink">{[1480, 9200, 2860, 174][index]}</div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
