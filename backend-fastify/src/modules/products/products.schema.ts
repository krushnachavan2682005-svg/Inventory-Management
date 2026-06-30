import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(2),
  sku: z.string().min(2),
  barcode: z.string().optional(),
  category_id: z.string().uuid().optional(),
  purchase_price: z.coerce.number().nonnegative(),
  selling_price: z.coerce.number().nonnegative(),
  mrp: z.coerce.number().nonnegative(),
  tax_rate: z.coerce.number().min(0).max(100).default(0),
  low_stock_threshold: z.coerce.number().int().nonnegative().default(0),
  unit: z.string().default("pcs"),
  status: z.enum(["ACTIVE", "INACTIVE", "ARCHIVED"]).default("ACTIVE"),
  opening_stock: z.coerce.number().int().nonnegative().default(0)
});

export const updateProductSchema = createProductSchema.omit({ opening_stock: true }).partial();
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
