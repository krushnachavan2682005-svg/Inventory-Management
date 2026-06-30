import { z } from "zod";

export const createSaleSchema = z.object({
  customer_id: z.string().uuid().optional(),
  items: z.array(z.object({
    product_id: z.string().uuid(),
    quantity: z.coerce.number().int().positive(),
    unit_price: z.coerce.number().nonnegative(),
    discount: z.coerce.number().nonnegative().default(0)
  })).min(1),
  payment_mode: z.enum(["CASH", "UPI", "CARD", "CREDIT"]),
  amount_paid: z.coerce.number().nonnegative(),
  discount_total: z.coerce.number().nonnegative().default(0),
  tax_total: z.coerce.number().nonnegative().default(0)
});

export type CreateSaleInput = z.infer<typeof createSaleSchema>;
