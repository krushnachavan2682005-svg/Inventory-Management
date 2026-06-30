import type { Pool } from "pg";

export class AdminService {
  constructor(private readonly pool: Pool) {}

  async dashboard() {
    const shops = await this.pool.query(`
      SELECT
        count(*)::int AS total_shops,
        count(*) FILTER (WHERE status = 'ACTIVE')::int AS active_shops,
        count(*) FILTER (WHERE status = 'TRIAL')::int AS trial_shops
      FROM organizations
      WHERE deleted_at IS NULL
    `);
    const users = await this.pool.query("SELECT count(*)::int AS total_users FROM users WHERE deleted_at IS NULL");
    return { ...shops.rows[0], total_users: users.rows[0].total_users, monthly_revenue_placeholder: 0 };
  }

  async analytics() {
    const topShops = await this.pool.query(`
      SELECT o.id, o.shop_name, o.city, coalesce(sum(s.total_amount), 0)::numeric AS sales_total
      FROM organizations o
      LEFT JOIN sales s ON s.organization_id = o.id
      WHERE o.deleted_at IS NULL
      GROUP BY o.id
      ORDER BY sales_total DESC
      LIMIT 10
    `);
    return {
      platform_sales_placeholder: topShops.rows.reduce((sum, row) => sum + Number(row.sales_total), 0),
      top_active_shops: topShops.rows,
      usage_overview: {
        invoices_generated: 0,
        inventory_movements: 0,
        ai_modules_ready: 0
      },
      subscription_placeholder: {
        mrr: 0,
        plans: ["STARTER", "GROWTH", "PRO"]
      }
    };
  }
}
