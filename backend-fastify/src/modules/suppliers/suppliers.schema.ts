import { z } from "zod";

export const createSupplierSchema = z.object({
  name: z.string().min(2),
  contact_name: z.string().optional(),
  phone: z.string().min(6),
  email: z.string().email().optional(),
  products_supplied: z.coerce.number().int().nonnegative().default(0),
  pending_amount: z.coerce.number().nonnegative().default(0),
  lead_time_days: z.coerce.number().int().nonnegative().default(0)
});

export const updateSupplierSchema = createSupplierSchema.partial();
export type CreateSupplierInput = z.infer<typeof createSupplierSchema>;
export type UpdateSupplierInput = z.infer<typeof updateSupplierSchema>;
