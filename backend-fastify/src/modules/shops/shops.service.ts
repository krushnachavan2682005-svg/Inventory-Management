import type { Pool } from "pg";
import { AppError } from "../../shared/errors/app-error.js";
import type { CreateShopInput, UpdateShopInput } from "./shops.schema.js";
import { ShopsRepository } from "./shops.repository.js";

export class ShopsService {
  private readonly repository: ShopsRepository;

  constructor(pool: Pool) {
    this.repository = new ShopsRepository(pool);
  }

  list() {
    return this.repository.list();
  }

  async get(id: string) {
    const shop = await this.repository.findById(id);
    if (!shop) throw AppError.notFound("Shop not found");
    return shop;
  }

  create(input: CreateShopInput) {
    return this.repository.create(input);
  }

  async update(id: string, input: UpdateShopInput) {
    const shop = await this.repository.update(id, input);
    if (!shop) throw AppError.notFound("Shop not found");
    return shop;
  }

  async updateStatus(id: string, status: string) {
    const shop = await this.repository.updateStatus(id, status);
    if (!shop) throw AppError.notFound("Shop not found");
    return shop;
  }
}
