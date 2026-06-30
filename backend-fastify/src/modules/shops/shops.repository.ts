import type { Pool } from "pg";
import type { CreateShopInput, UpdateShopInput } from "./shops.schema.js";

export class ShopsRepository {
  constructor(private readonly pool: Pool) {}

  async list() {
    const result = await this.pool.query(`
      SELECT id, shop_name, owner_name, email, phone, business_type, city, gstin, status, plan, created_at, updated_at
      FROM organizations
      WHERE deleted_at IS NULL
      ORDER BY created_at DESC
    `);
    return result.rows;
  }

  async findById(id: string) {
    const result = await this.pool.query(
      `SELECT id, shop_name, owner_name, email, phone, business_type, city, gstin, status, plan, created_at, updated_at
       FROM organizations
       WHERE id = $1 AND deleted_at IS NULL`,
      [id]
    );
    return result.rows[0] ?? null;
  }

  async create(input: CreateShopInput) {
    const result = await this.pool.query(
      `INSERT INTO organizations (shop_name, owner_name, email, phone, business_type, city, gstin, status, plan)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING id, shop_name, owner_name, email, phone, business_type, city, gstin, status, plan, created_at, updated_at`,
      [input.shop_name, input.owner_name, input.email, input.phone, input.business_type, input.city, input.gstin ?? null, input.status, input.plan]
    );
    return result.rows[0];
  }

  async update(id: string, input: UpdateShopInput) {
    const current = await this.findById(id);
    if (!current) return null;
    const next = { ...current, ...input };
    const result = await this.pool.query(
      `UPDATE organizations
       SET shop_name=$2, owner_name=$3, email=$4, phone=$5, business_type=$6, city=$7, gstin=$8, status=$9, plan=$10, updated_at=now()
       WHERE id=$1 AND deleted_at IS NULL
       RETURNING id, shop_name, owner_name, email, phone, business_type, city, gstin, status, plan, created_at, updated_at`,
      [id, next.shop_name, next.owner_name, next.email, next.phone, next.business_type, next.city, next.gstin, next.status, next.plan]
    );
    return result.rows[0] ?? null;
  }

  async updateStatus(id: string, status: string) {
    const result = await this.pool.query(
      `UPDATE organizations SET status=$2, updated_at=now()
       WHERE id=$1 AND deleted_at IS NULL
       RETURNING id, shop_name, owner_name, email, phone, business_type, city, gstin, status, plan, created_at, updated_at`,
      [id, status]
    );
    return result.rows[0] ?? null;
  }
}
