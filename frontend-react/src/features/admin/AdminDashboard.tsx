import { Activity, Building2, CircleDollarSign, Sparkles } from "lucide-react";
import { StatCard } from "../../components/cards/StatCard";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { PageHeader } from "../../components/layout/PageHeader";
import { DataTable } from "../../components/tables/DataTable";
import { shops } from "../../data/mock-data";
import { formatCurrency, formatDate } from "../../utils/formatters";

export function AdminDashboard() {
  const active = shops.filter((shop) => shop.status === "active").length;
  const trial = shops.filter((shop) => shop.status === "trial").length;
  const revenue = shops.reduce((sum, shop) => sum + shop.monthlySales * 0.02, 0);

  return (
    <>
      <PageHeader title="Platform Dashboard" eyebrow="Admin" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total shops" value={String(shops.length)} helper="Across all tenants" icon={<Building2 size={20} />} />
        <StatCard label="Active shops" value={String(active)} helper="Billing-ready stores" icon={<Activity size={20} />} tone="green" />
        <StatCard label="Trial shops" value={String(trial)} helper="Onboarding pipeline" icon={<Sparkles size={20} />} tone="amber" />
        <StatCard label="MRR placeholder" value={formatCurrency(revenue)} helper="Mock subscription model" icon={<CircleDollarSign size={20} />} />
      </div>
      <div className="mt-6 grid gap-4 xl:grid-cols-[1.4fr_0.8fr]">
        <Card>
          <h2 className="mb-4 text-lg font-bold">Recent shops</h2>
          <DataTable
            data={shops}
            keyExtractor={(shop) => shop.id}
            columns={[
              { header: "Shop", cell: (shop) => <div><div className="font-bold text-ink">{shop.name}</div><div className="text-xs text-slate-500">{shop.ownerName}</div></div> },
              { header: "City", cell: (shop) => shop.city },
              { header: "Status", cell: (shop) => <Badge tone={shop.status === "active" ? "success" : shop.status === "trial" ? "warning" : "neutral"}>{shop.status}</Badge> },
              { header: "Created", cell: (shop) => formatDate(shop.createdAt) },
            ]}
          />
        </Card>
        <Card>
          <h2 className="text-lg font-bold">Platform health</h2>
          <div className="mt-4 space-y-3">
            {["API uptime placeholder", "Billing jobs healthy", "No blocked tenants", "AI modules staged"].map((item) => (
              <div key={item} className="flex items-center justify-between rounded-lg border border-line p-3 text-sm">
                <span className="font-semibold text-slate-700">{item}</span>
                <Badge tone="success">OK</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
