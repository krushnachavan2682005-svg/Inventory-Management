import type { Pool } from "pg";
import type { CreateSupplierInput, UpdateSupplierInput } from "./suppliers.schema.js";

export class SuppliersRepository {
  constructor(private readonly pool: Pool) {}
  list(org: string) { return this.pool.query("SELECT * FROM suppliers WHERE organization_id=$1 AND deleted_at IS NULL ORDER BY created_at DESC", [org]).then((r) => r.rows); }
  findById(org: string, id: string) { return this.pool.query("SELECT * FROM suppliers WHERE organization_id=$1 AND id=$2 AND deleted_at IS NULL", [org, id]).then((r) => r.rows[0] ?? null); }
  create(org: string, input: CreateSupplierInput) {
    return this.pool.query(
      `INSERT INTO suppliers (organization_id, name, contact_name, phone, email, products_supplied, pending_amount, lead_time_days)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [org, input.name, input.contact_name ?? null, input.phone, input.email ?? null, input.products_supplied, input.pending_amount, input.lead_time_days]
    ).then((r) => r.rows[0]);
  }
  async update(org: string, id: string, input: UpdateSupplierInput) {
    const current = await this.findById(org, id);
    if (!current) return null;
    const next = { ...current, ...input };
    return this.pool.query(
      `UPDATE suppliers SET name=$3, contact_name=$4, phone=$5, email=$6, products_supplied=$7, pending_amount=$8, lead_time_days=$9, updated_at=now()
       WHERE organization_id=$1 AND id=$2 AND deleted_at IS NULL RETURNING *`,
      [org, id, next.name, next.contact_name, next.phone, next.email, next.products_supplied, next.pending_amount, next.lead_time_days]
    ).then((r) => r.rows[0] ?? null);
  }
  remove(org: string, id: string) { return this.pool.query("UPDATE suppliers SET deleted_at=now(), updated_at=now() WHERE organization_id=$1 AND id=$2 AND deleted_at IS NULL", [org, id]).then((r) => (r.rowCount ?? 0) > 0); }
}

