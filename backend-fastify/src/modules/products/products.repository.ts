import type { Pool } from "pg";
import type { CreateProductInput, UpdateProductInput } from "./products.schema.js";

export class ProductsRepository {
  constructor(private readonly pool: Pool) {}

  async list(organizationId: string) {
    const result = await this.pool.query(
      `SELECT p.*, c.name AS category_name, coalesce(ib.available_quantity,0) AS available_quantity
       FROM products p
       LEFT JOIN product_categories c ON c.id = p.category_id
       LEFT JOIN inventory_balances ib ON ib.product_id = p.id AND ib.organization_id = p.organization_id
       WHERE p.organization_id = $1 AND p.deleted_at IS NULL
       ORDER BY p.created_at DESC`,
      [organizationId]
    );
    return result.rows;
  }

  async findById(organizationId: string, id: string) {
    const result = await this.pool.query(
      `SELECT p.*, c.name AS category_name, coalesce(ib.available_quantity,0) AS available_quantity
       FROM products p
       LEFT JOIN product_categories c ON c.id = p.category_id
       LEFT JOIN inventory_balances ib ON ib.product_id = p.id AND ib.organization_id = p.organization_id
       WHERE p.organization_id = $1 AND p.id = $2 AND p.deleted_at IS NULL`,
      [organizationId, id]
    );
    return result.rows[0] ?? null;
  }

  async create(organizationId: string, input: CreateProductInput, userId: string) {
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      const product = await client.query(
        `INSERT INTO products (organization_id, name, sku, barcode, category_id, purchase_price, selling_price, mrp, tax_rate, low_stock_threshold, unit, status)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
         RETURNING *`,
        [organizationId, input.name, input.sku, input.barcode ?? null, input.category_id ?? null, input.purchase_price, input.selling_price, input.mrp, input.tax_rate, input.low_stock_threshold, input.unit, input.status]
      );
      const productId = product.rows[0].id;
      await client.query(
        `INSERT INTO inventory_balances (organization_id, product_id, available_quantity)
         VALUES ($1,$2,$3)`,
        [organizationId, productId, input.opening_stock]
      );
      if (input.opening_stock > 0) {
        await client.query(
          `INSERT INTO inventory_movements (organization_id, product_id, movement_type, quantity, previous_quantity, new_quantity, reference_type, reason, created_by)
           VALUES ($1,$2,'PURCHASE',$3,0,$3,'PRODUCT_OPENING_STOCK','Opening stock while creating product',$4)`,
          [organizationId, productId, input.opening_stock, userId]
        );
      }
      await client.query("COMMIT");
      return product.rows[0];
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async update(organizationId: string, id: string, input: UpdateProductInput) {
    const current = await this.findById(organizationId, id);
    if (!current) return null;
    const next = { ...current, ...input };
    const result = await this.pool.query(
      `UPDATE products
       SET name=$3, sku=$4, barcode=$5, category_id=$6, purchase_price=$7, selling_price=$8, mrp=$9, tax_rate=$10,
           low_stock_threshold=$11, unit=$12, status=$13, updated_at=now()
       WHERE organization_id=$1 AND id=$2 AND deleted_at IS NULL
       RETURNING *`,
      [organizationId, id, next.name, next.sku, next.barcode, next.category_id, next.purchase_price, next.selling_price, next.mrp, next.tax_rate, next.low_stock_threshold, next.unit, next.status]
    );
    return result.rows[0] ?? null;
  }

  async softDelete(organizationId: string, id: string) {
    const result = await this.pool.query(
      `UPDATE products SET deleted_at = now(), updated_at = now()
       WHERE organization_id = $1 AND id = $2 AND deleted_at IS NULL
       RETURNING id`,
      [organizationId, id]
    );
    return (result.rowCount ?? 0) > 0;
  }
}

