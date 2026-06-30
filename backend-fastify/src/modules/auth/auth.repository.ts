import type { Pool } from "pg";
import type { RegisterInput } from "./auth.schema.js";

export class AuthRepository {
  constructor(private readonly pool: Pool) {}

  async findUserByEmail(email: string) {
    const result = await this.pool.query(
      `SELECT id, organization_id, name, email, password_hash, role, is_active, created_at, updated_at
       FROM users
       WHERE email = $1 AND deleted_at IS NULL`,
      [email]
    );
    return result.rows[0] ?? null;
  }

  async findUserById(id: string) {
    const result = await this.pool.query(
      `SELECT id, organization_id, name, email, role, is_active, created_at, updated_at
       FROM users
       WHERE id = $1 AND deleted_at IS NULL`,
      [id]
    );
    return result.rows[0] ?? null;
  }

  async createUser(input: RegisterInput, passwordHash: string) {
    const result = await this.pool.query(
      `INSERT INTO users (name, email, password_hash, role, organization_id)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING id, organization_id, name, email, role, is_active, created_at, updated_at`,
      [input.name, input.email, passwordHash, input.role, input.organization_id ?? null]
    );
    return result.rows[0];
  }

  async touchLastLogin(userId: string) {
    await this.pool.query("UPDATE users SET last_login_at = now() WHERE id = $1", [userId]);
  }
}
