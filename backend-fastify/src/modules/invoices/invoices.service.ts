import type { Pool } from "pg";
import { AppError } from "../../shared/errors/app-error.js";

export class InvoicesService {
  constructor(private readonly pool: Pool) {}

  list(org: string) {
    return this.pool.query(
      `SELECT i.*, s.total_amount, s.status
       FROM invoices i
       JOIN sales s ON s.id = i.sale_id
       WHERE i.organization_id=$1 AND i.deleted_at IS NULL
       ORDER BY i.issued_at DESC`,
      [org]
    ).then((r) => r.rows);
  }

  async get(org: string, id: string) {
    const invoice = await this.pool.query(
      `SELECT i.*, s.total_amount, s.subtotal, s.tax_total, s.discount_total, s.status
       FROM invoices i
       JOIN sales s ON s.id = i.sale_id
       WHERE i.organization_id=$1 AND i.id=$2 AND i.deleted_at IS NULL`,
      [org, id]
    );
    if (!invoice.rows[0]) throw AppError.notFound("Invoice not found");
    const items = await this.pool.query(
      `SELECT si.*, p.name AS product_name FROM sale_items si JOIN products p ON p.id=si.product_id WHERE si.organization_id=$1 AND si.sale_id=$2`,
      [org, invoice.rows[0].sale_id]
    );
    return { ...invoice.rows[0], items: items.rows };
  }
}
