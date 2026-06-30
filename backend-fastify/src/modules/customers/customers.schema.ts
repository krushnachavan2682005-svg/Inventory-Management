import { z } from "zod";

export const createCustomerSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(6),
  email: z.string().email().optional(),
  credit_due: z.coerce.number().nonnegative().default(0)
});

export const updateCustomerSchema = createCustomerSchema.partial();
export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;
