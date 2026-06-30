import { PageHeader } from "../../components/layout/PageHeader";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { DataTable } from "../../components/tables/DataTable";
import { customers } from "../../data/mock-data";
import { formatCurrency, formatDate } from "../../utils/formatters";

export function CustomersPage() {
  return (
    <>
      <PageHeader title="Customers" eyebrow="CRM and credit" actions={<Button>Add customer</Button>} />
      <Card>
        <DataTable
          data={customers}
          keyExtractor={(customer) => customer.id}
          columns={[
            { header: "Name", cell: (customer) => <strong className="text-ink">{customer.name}</strong> },
            { header: "Phone", cell: (customer) => customer.phone },
            { header: "Total purchases", cell: (customer) => formatCurrency(customer.totalPurchases) },
            { header: "Credit due", cell: (customer) => <Badge tone={customer.creditDue > 0 ? "warning" : "success"}>{formatCurrency(customer.creditDue)}</Badge> },
            { header: "Last visit", cell: (customer) => formatDate(customer.lastVisit) },
            { header: "Detail", cell: () => <Button variant="secondary">Open</Button> },
          ]}
        />
      </Card>
    </>
  );
}
