import { z } from "zod";

export const stockAdjustmentSchema = z.object({
  product_id: z.string().uuid(),
  quantity_delta: z.coerce.number().int(),
  reason: z.string().min(3)
});

export type StockAdjustmentInput = z.infer<typeof stockAdjustmentSchema>;
