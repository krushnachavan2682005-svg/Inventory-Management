import type { Pool } from "pg";
import type { CreateCustomerInput, UpdateCustomerInput } from "./customers.schema.js";

export class CustomersRepository {
  constructor(private readonly pool: Pool) {}

  list(organizationId: string) {
    return this.pool.query(
      `SELECT id, organization_id, name, phone, email, total_purchases, credit_due, last_visit_at, created_at, updated_at
       FROM customers WHERE organization_id=$1 AND deleted_at IS NULL ORDER BY created_at DESC`,
      [organizationId]
    ).then((result) => result.rows);
  }

  findById(organizationId: string, id: string) {
    return this.pool.query(
      `SELECT id, organization_id, name, phone, email, total_purchases, credit_due, last_visit_at, created_at, updated_at
       FROM customers WHERE organization_id=$1 AND id=$2 AND deleted_at IS NULL`,
      [organizationId, id]
    ).then((result) => result.rows[0] ?? null);
  }

  create(organizationId: string, input: CreateCustomerInput) {
    return this.pool.query(
      `INSERT INTO customers (organization_id, name, phone, email, credit_due)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING id, organization_id, name, phone, email, total_purchases, credit_due, last_visit_at, created_at, updated_at`,
      [organizationId, input.name, input.phone, input.email ?? null, input.credit_due]
    ).then((result) => result.rows[0]);
  }

  async update(organizationId: string, id: string, input: UpdateCustomerInput) {
    const current = await this.findById(organizationId, id);
    if (!current) return null;
    const next = { ...current, ...input };
    return this.pool.query(
      `UPDATE customers SET name=$3, phone=$4, email=$5, credit_due=$6, updated_at=now()
       WHERE organization_id=$1 AND id=$2 AND deleted_at IS NULL
       RETURNING id, organization_id, name, phone, email, total_purchases, credit_due, last_visit_at, created_at, updated_at`,
      [organizationId, id, next.name, next.phone, next.email, next.credit_due]
    ).then((result) => result.rows[0] ?? null);
  }

  remove(organizationId: string, id: string) {
    return this.pool.query(
      `UPDATE customers SET deleted_at=now(), updated_at=now()
       WHERE organization_id=$1 AND id=$2 AND deleted_at IS NULL`,
      [organizationId, id]
    ).then((result) => (result.rowCount ?? 0) > 0);
  }
}

