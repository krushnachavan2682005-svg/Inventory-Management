import type { Pool } from "pg";
import { AppError } from "../../shared/errors/app-error.js";
import type { CreateSupplierInput, UpdateSupplierInput } from "./suppliers.schema.js";
import { SuppliersRepository } from "./suppliers.repository.js";

export class SuppliersService {
  private readonly repository: SuppliersRepository;
  constructor(pool: Pool) { this.repository = new SuppliersRepository(pool); }
  list(org: string) { return this.repository.list(org); }
  async get(org: string, id: string) { const row = await this.repository.findById(org, id); if (!row) throw AppError.notFound("Supplier not found"); return row; }
  create(org: string, input: CreateSupplierInput) { return this.repository.create(org, input); }
  async update(org: string, id: string, input: UpdateSupplierInput) { const row = await this.repository.update(org, id, input); if (!row) throw AppError.notFound("Supplier not found"); return row; }
  async remove(org: string, id: string) { if (!(await this.repository.remove(org, id))) throw AppError.notFound("Supplier not found"); return { id }; }
}
