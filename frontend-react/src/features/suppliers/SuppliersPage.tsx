import { PageHeader } from "../../components/layout/PageHeader";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { DataTable } from "../../components/tables/DataTable";
import { suppliers } from "../../data/mock-data";
import { formatCurrency } from "../../utils/formatters";

export function SuppliersPage() {
  return (
    <>
      <PageHeader title="Suppliers" eyebrow="Purchase network" actions={<Button>Add supplier</Button>} />
      <Card>
        <DataTable
          data={suppliers}
          keyExtractor={(supplier) => supplier.id}
          columns={[
            { header: "Supplier", cell: (supplier) => <strong className="text-ink">{supplier.name}</strong> },
            { header: "Contact", cell: (supplier) => supplier.contact },
            { header: "Products supplied", cell: (supplier) => supplier.productsSupplied },
            { header: "Pending amount", cell: (supplier) => <Badge tone={supplier.pendingAmount > 0 ? "warning" : "success"}>{formatCurrency(supplier.pendingAmount)}</Badge> },
            { header: "Lead time", cell: (supplier) => `${supplier.leadTimeDays} days` },
            { header: "Action", cell: () => <Button variant="secondary">View</Button> },
          ]}
        />
      </Card>
    </>
  );
}
