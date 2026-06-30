export type Role = "ADMIN" | "SHOPKEEPER" | "CASHIER" | "MANAGER" | "INVENTORY_STAFF" | "ACCOUNTANT";
export type ShopStatus = "ACTIVE" | "INACTIVE" | "TRIAL" | "SUSPENDED";
export type PaymentMode = "CASH" | "UPI" | "CARD" | "CREDIT";
export type MovementType = "SALE" | "PURCHASE" | "RETURN" | "DAMAGE" | "ADJUSTMENT" | "TRANSFER_IN" | "TRANSFER_OUT";

export interface AuthUser {
  id: string;
  email: string;
  role: Role;
  organizationId: string | null;
}
