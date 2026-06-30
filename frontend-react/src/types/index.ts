export type Role = "admin" | "shopkeeper";
export type ShopStatus = "active" | "trial" | "paused";
export type PaymentMode = "Cash" | "UPI" | "Card" | "Credit";
export type ProductCategory = "Electronics" | "Grocery" | "Stationery" | "Home" | "Health" | "Sports";

export interface User {
  id: string;
  name: string;
  role: Role;
  shopId?: string;
}

export interface Shop {
  id: string;
  name: string;
  ownerName: string;
  email: string;
  phone: string;
  businessType: string;
  city: string;
  gstin?: string;
  status: ShopStatus;
  plan: "Starter" | "Growth" | "Pro";
  createdAt: string;
  monthlySales: number;
}

export interface Product {
  id: string;
  shopId: string;
  name: string;
  sku: string;
  barcode: string;
  category: ProductCategory;
  purchasePrice: number;
  sellingPrice: number;
  stock: number;
  lowStockThreshold: number;
  taxRate: number;
}

export interface InventoryMovement {
  id: string;
  productId: string;
  type: "sale" | "purchase" | "adjustment";
  qty: number;
  note: string;
  date: string;
}

export interface Customer {
  id: string;
  shopId: string;
  name: string;
  phone: string;
  totalPurchases: number;
  creditDue: number;
  lastVisit: string;
}

export interface Supplier {
  id: string;
  shopId: string;
  name: string;
  contact: string;
  productsSupplied: number;
  pendingAmount: number;
  leadTimeDays: number;
}

export interface Sale {
  id: string;
  invoiceNo: string;
  shopId: string;
  customerName: string;
  amount: number;
  paymentMode: PaymentMode;
  status: "Paid" | "Credit" | "Refunded";
  date: string;
}
