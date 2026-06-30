import { Plus, SlidersHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHeader } from "../../components/layout/PageHeader";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { DataTable } from "../../components/tables/DataTable";
import { shops } from "../../data/mock-data";
import { formatCurrency, formatDate } from "../../utils/formatters";

export function ShopsPage() {
  return (
    <>
      <PageHeader
        title="Shops Management"
        eyebrow="Tenants"
        actions={<Link to="/admin/shops/create"><Button icon={<Plus size={17} />}>Create shop</Button></Link>}
      />
      <Card>
        <div className="mb-4 flex items-center justify-between gap-3">
          <p className="text-sm text-slate-600">Manage shop activation, owner details, business type, and plan readiness.</p>
          <Button variant="secondary" icon={<SlidersHorizontal size={17} />}>Filters</Button>
        </div>
        <DataTable
          data={shops}
          keyExtractor={(shop) => shop.id}
          columns={[
            { header: "Shop name", cell: (shop) => <strong className="text-ink">{shop.name}</strong> },
            { header: "Owner", cell: (shop) => shop.ownerName },
            { header: "Business", cell: (shop) => shop.businessType },
            { header: "City", cell: (shop) => shop.city },
            { header: "Status", cell: (shop) => <Badge tone={shop.status === "active" ? "success" : shop.status === "trial" ? "warning" : "neutral"}>{shop.status}</Badge> },
            { header: "Created", cell: (shop) => formatDate(shop.createdAt) },
            { header: "Monthly GMV", cell: (shop) => formatCurrency(shop.monthlySales) },
            { header: "Action", cell: () => <Button variant="ghost">Manage</Button> },
          ]}
        />
      </Card>
    </>
  );
}
