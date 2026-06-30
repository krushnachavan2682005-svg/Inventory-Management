import { z } from "zod";

export const createShopSchema = z.object({
  shop_name: z.string().min(2),
  owner_name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6),
  business_type: z.string().min(2),
  city: z.string().min(2),
  gstin: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "TRIAL", "SUSPENDED"]).default("TRIAL"),
  plan: z.string().default("STARTER")
});

export const updateShopSchema = createShopSchema.partial();
export const updateShopStatusSchema = z.object({ status: z.enum(["ACTIVE", "INACTIVE", "TRIAL", "SUSPENDED"]) });

export type CreateShopInput = z.infer<typeof createShopSchema>;
export type UpdateShopInput = z.infer<typeof updateShopSchema>;
