import type { Pool } from "pg";
import { AppError } from "../../shared/errors/app-error.js";
import { ErrorCodes } from "../../shared/errors/error-codes.js";
import type { StockAdjustmentInput } from "./inventory.schema.js";

export class InventoryService {
  constructor(private readonly pool: Pool) {}

  balances(org: string) {
    return this.pool.query(
      `SELECT ib.*, p.name AS product_name, p.sku, p.low_stock_threshold
       FROM inventory_balances ib
       JOIN products p ON p.id = ib.product_id
       WHERE ib.organization_id=$1 AND ib.deleted_at IS NULL AND p.deleted_at IS NULL
       ORDER BY p.name`,
      [org]
    ).then((r) => r.rows);
  }

  movements(org: string) {
    return this.pool.query(
      `SELECT im.*, p.name AS product_name, p.sku
       FROM inventory_movements im
       JOIN products p ON p.id = im.product_id
       WHERE im.organization_id=$1
       ORDER BY im.created_at DESC
       LIMIT 200`,
      [org]
    ).then((r) => r.rows);
  }

  lowStock(org: string) {
    return this.pool.query(
      `SELECT p.id, p.name, p.sku, p.low_stock_threshold, ib.available_quantity
       FROM products p
       JOIN inventory_balances ib ON ib.product_id = p.id AND ib.organization_id = p.organization_id
       WHERE p.organization_id=$1 AND p.deleted_at IS NULL AND ib.available_quantity <= p.low_stock_threshold
       ORDER BY ib.available_quantity ASC`,
      [org]
    ).then((r) => r.rows);
  }

  deadStockPlaceholder() {
    return {
      status: "COMING_SOON",
      summary: "Dead stock detection will use sales velocity, age of inventory, and category benchmarks."
    };
  }

  async adjust(org: string, userId: string, input: StockAdjustmentInput) {
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      const balance = await client.query(
        `SELECT ib.available_quantity
         FROM inventory_balances ib
         JOIN products p ON p.id = ib.product_id
         WHERE ib.organization_id=$1 AND ib.product_id=$2 AND p.deleted_at IS NULL
         FOR UPDATE`,
        [org, input.product_id]
      );
      if (!balance.rows[0]) throw AppError.notFound("Inventory balance not found");
      const previous = Number(balance.rows[0].available_quantity);
      const next = previous + input.quantity_delta;
      if (next < 0) throw new AppError(ErrorCodes.INSUFFICIENT_STOCK, "Adjustment would make stock negative", 409);

      const adjustment = await client.query(
        `INSERT INTO stock_adjustments (organization_id, product_id, quantity_delta, reason, created_by)
         VALUES ($1,$2,$3,$4,$5) RETURNING *`,
        [org, input.product_id, input.quantity_delta, input.reason, userId]
      );
      await client.query(
        "UPDATE inventory_balances SET available_quantity=$3, updated_at=now() WHERE organization_id=$1 AND product_id=$2",
        [org, input.product_id, next]
      );
      await client.query(
        `INSERT INTO inventory_movements (organization_id, product_id, movement_type, quantity, previous_quantity, new_quantity, reference_type, reference_id, reason, created_by)
         VALUES ($1,$2,'ADJUSTMENT',$3,$4,$5,'STOCK_ADJUSTMENT',$6,$7,$8)`,
        [org, input.product_id, input.quantity_delta, previous, next, adjustment.rows[0].id, input.reason, userId]
      );
      await client.query("COMMIT");
      return adjustment.rows[0];
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}
