import type { Pool } from "pg";
import { AppError } from "../../shared/errors/app-error.js";
import type { CreateProductInput, UpdateProductInput } from "./products.schema.js";
import { ProductsRepository } from "./products.repository.js";

export class ProductsService {
  private readonly repository: ProductsRepository;

  constructor(pool: Pool) {
    this.repository = new ProductsRepository(pool);
  }

  list(organizationId: string) {
    return this.repository.list(organizationId);
  }

  async get(organizationId: string, id: string) {
    const product = await this.repository.findById(organizationId, id);
    if (!product) throw AppError.notFound("Product not found");
    return product;
  }

  create(organizationId: string, input: CreateProductInput, userId: string) {
    return this.repository.create(organizationId, input, userId);
  }

  async update(organizationId: string, id: string, input: UpdateProductInput) {
    const product = await this.repository.update(organizationId, id, input);
    if (!product) throw AppError.notFound("Product not found");
    return product;
  }

  async remove(organizationId: string, id: string) {
    const removed = await this.repository.softDelete(organizationId, id);
    if (!removed) throw AppError.notFound("Product not found");
    return { id };
  }
}
