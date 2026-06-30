import { PageHeader } from "../../components/layout/PageHeader";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { DataTable } from "../../components/tables/DataTable";
import { sales } from "../../data/mock-data";
import { formatCurrency, formatDate } from "../../utils/formatters";

export function SalesPage() {
  return (
    <>
      <PageHeader title="Sales & Invoices" eyebrow="Billing history" />
      <Card>
        <DataTable
          data={sales}
          keyExtractor={(sale) => sale.id}
          columns={[
            { header: "Invoice", cell: (sale) => <strong className="text-ink">{sale.invoiceNo}</strong> },
            { header: "Customer", cell: (sale) => sale.customerName },
            { header: "Amount", cell: (sale) => formatCurrency(sale.amount) },
            { header: "Payment", cell: (sale) => sale.paymentMode },
            { header: "Status", cell: (sale) => <Badge tone={sale.status === "Paid" ? "success" : "warning"}>{sale.status}</Badge> },
            { header: "Date", cell: (sale) => formatDate(sale.date) },
            { header: "Bill", cell: () => <Button variant="secondary">View bill</Button> },
          ]}
        />
      </Card>
    </>
  );
}
