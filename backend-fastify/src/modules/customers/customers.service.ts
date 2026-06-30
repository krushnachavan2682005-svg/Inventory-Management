import type { Pool } from "pg";
import { AppError } from "../../shared/errors/app-error.js";
import type { CreateCustomerInput, UpdateCustomerInput } from "./customers.schema.js";
import { CustomersRepository } from "./customers.repository.js";

export class CustomersService {
  private readonly repository: CustomersRepository;
  constructor(pool: Pool) { this.repository = new CustomersRepository(pool); }
  list(org: string) { return this.repository.list(org); }
  async get(org: string, id: string) { const row = await this.repository.findById(org, id); if (!row) throw AppError.notFound("Customer not found"); return row; }
  create(org: string, input: CreateCustomerInput) { return this.repository.create(org, input); }
  async update(org: string, id: string, input: UpdateCustomerInput) { const row = await this.repository.update(org, id, input); if (!row) throw AppError.notFound("Customer not found"); return row; }
  async remove(org: string, id: string) { if (!(await this.repository.remove(org, id))) throw AppError.notFound("Customer not found"); return { id }; }
}
