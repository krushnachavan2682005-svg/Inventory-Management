import type { Pool } from "pg";

export class ReportsService {
  constructor(private readonly pool: Pool) {}

  async dashboard(org: string) {
    const sales = await this.pool.query("SELECT coalesce(sum(total_amount),0)::numeric AS total_sales, count(*)::int AS total_orders FROM sales WHERE organization_id=$1 AND deleted_at IS NULL", [org]);
    const low = await this.pool.query(`SELECT count(*)::int AS low_stock FROM products p JOIN inventory_balances ib ON ib.product_id=p.id WHERE p.organization_id=$1 AND ib.available_quantity <= p.low_stock_threshold AND p.deleted_at IS NULL`, [org]);
    const credit = await this.pool.query("SELECT coalesce(sum(credit_due),0)::numeric AS credit_due FROM customers WHERE organization_id=$1 AND deleted_at IS NULL", [org]);
    return { ...sales.rows[0], ...low.rows[0], ...credit.rows[0] };
  }

  salesSummary(org: string) {
    return this.pool.query(
      `SELECT date_trunc('day', created_at)::date AS day, count(*)::int AS orders, coalesce(sum(total_amount),0)::numeric AS sales
       FROM sales WHERE organization_id=$1 AND deleted_at IS NULL
       GROUP BY 1 ORDER BY 1 DESC LIMIT 30`,
      [org]
    ).then((r) => r.rows);
  }

  inventoryHealth(org: string) {
    return this.pool.query(
      `SELECT
        count(*)::int AS total_products,
        count(*) FILTER (WHERE ib.available_quantity <= p.low_stock_threshold)::int AS low_stock,
        count(*) FILTER (WHERE ib.available_quantity = 0)::int AS out_of_stock
       FROM products p JOIN inventory_balances ib ON ib.product_id=p.id
       WHERE p.organization_id=$1 AND p.deleted_at IS NULL`,
      [org]
    ).then((r) => r.rows[0]);
  }

  topProducts(org: string) {
    return this.pool.query(
      `SELECT p.id, p.name, sum(si.quantity)::int AS units_sold, sum(si.line_total)::numeric AS revenue
       FROM sale_items si JOIN products p ON p.id=si.product_id
       WHERE si.organization_id=$1
       GROUP BY p.id, p.name
       ORDER BY revenue DESC
       LIMIT 10`,
      [org]
    ).then((r) => r.rows);
  }

  paymentBreakdown(org: string) {
    return this.pool.query(
      `SELECT payment_mode, count(*)::int AS count, coalesce(sum(amount_paid),0)::numeric AS amount
       FROM payments WHERE organization_id=$1 AND deleted_at IS NULL
       GROUP BY payment_mode ORDER BY amount DESC`,
      [org]
    ).then((r) => r.rows);
  }
}
