import type { Customer, InventoryMovement, Product, Sale, Shop, Supplier } from "../types";

export const shops: Shop[] = [
  { id: "shop-1", name: "Krushna Smart Mart", ownerName: "Krushna Patil", email: "owner@smartmart.in", phone: "+91 98765 43210", businessType: "General Retail", city: "Pune", gstin: "27ABCDE1234F1Z5", status: "active", plan: "Pro", createdAt: "2026-01-12", monthlySales: 685000 },
  { id: "shop-2", name: "Metro Electronics", ownerName: "Yash Chavan", email: "hello@metroelectro.in", phone: "+91 98222 00110", businessType: "Electronics", city: "Mumbai", status: "trial", plan: "Growth", createdAt: "2026-04-18", monthlySales: 412000 },
  { id: "shop-3", name: "Sai Stationery Hub", ownerName: "Arjun Patil", email: "sales@saistationery.in", phone: "+91 90000 11223", businessType: "Stationery", city: "Nashik", status: "paused", plan: "Starter", createdAt: "2025-11-04", monthlySales: 126000 }
];

export const products: Product[] = [
  { id: "p-1", shopId: "shop-1", name: "USB Cable Type-C", sku: "USB-TC-01", barcode: "89010012001", category: "Electronics", purchasePrice: 90, sellingPrice: 149, stock: 240, lowStockThreshold: 30, taxRate: 18 },
  { id: "p-2", shopId: "shop-1", name: "Bluetooth Speaker", sku: "AUD-BS-11", barcode: "89010012002", category: "Electronics", purchasePrice: 980, sellingPrice: 1499, stock: 8, lowStockThreshold: 12, taxRate: 18 },
  { id: "p-3", shopId: "shop-1", name: "A5 Notebook Pack", sku: "STAT-NB-05", barcode: "89010012003", category: "Stationery", purchasePrice: 42, sellingPrice: 65, stock: 120, lowStockThreshold: 35, taxRate: 12 },
  { id: "p-4", shopId: "shop-1", name: "LED TV 42 inch", sku: "TV-LED-42", barcode: "89010012004", category: "Electronics", purchasePrice: 18500, sellingPrice: 24900, stock: 0, lowStockThreshold: 3, taxRate: 18 },
  { id: "p-5", shopId: "shop-1", name: "Steel Lunch Box", sku: "HOME-LB-02", barcode: "89010012005", category: "Home", purchasePrice: 220, sellingPrice: 349, stock: 54, lowStockThreshold: 15, taxRate: 12 }
];

export const customers: Customer[] = [
  { id: "c-1", shopId: "shop-1", name: "Rohit Sharma", phone: "+91 90888 11111", totalPurchases: 52400, creditDue: 1200, lastVisit: "2026-06-19" },
  { id: "c-2", shopId: "shop-1", name: "Priya Deshmukh", phone: "+91 90777 22222", totalPurchases: 18800, creditDue: 0, lastVisit: "2026-06-18" },
  { id: "c-3", shopId: "shop-1", name: "Sameer Khan", phone: "+91 90666 33333", totalPurchases: 32600, creditDue: 4500, lastVisit: "2026-06-15" }
];

export const suppliers: Supplier[] = [
  { id: "s-1", shopId: "shop-1", name: "Prime Electronics Wholesale", contact: "+91 80000 10001", productsSupplied: 42, pendingAmount: 28400, leadTimeDays: 3 },
  { id: "s-2", shopId: "shop-1", name: "Maharashtra Stationery Depot", contact: "+91 80000 10002", productsSupplied: 19, pendingAmount: 6200, leadTimeDays: 2 },
  { id: "s-3", shopId: "shop-1", name: "Home Utility Traders", contact: "+91 80000 10003", productsSupplied: 27, pendingAmount: 0, leadTimeDays: 5 }
];

export const sales: Sale[] = [
  { id: "sale-1", invoiceNo: "INV-1045", shopId: "shop-1", customerName: "Rohit Sharma", amount: 2900, paymentMode: "UPI", status: "Paid", date: "2026-06-21" },
  { id: "sale-2", invoiceNo: "INV-1044", shopId: "shop-1", customerName: "Walk-in Customer", amount: 850, paymentMode: "Cash", status: "Paid", date: "2026-06-21" },
  { id: "sale-3", invoiceNo: "INV-1043", shopId: "shop-1", customerName: "Sameer Khan", amount: 4500, paymentMode: "Credit", status: "Credit", date: "2026-06-20" }
];

export const inventoryMovements: InventoryMovement[] = [
  { id: "m-1", productId: "p-2", type: "sale", qty: -2, note: "Sold via POS invoice INV-1045", date: "2026-06-21" },
  { id: "m-2", productId: "p-1", type: "purchase", qty: 120, note: "Supplier stock received", date: "2026-06-20" },
  { id: "m-3", productId: "p-4", type: "sale", qty: -1, note: "Last unit sold, reorder suggested", date: "2026-06-19" }
];

export const aiModules = [
  "Smart Reorder Suggestions",
  "Demand Forecasting",
  "Dead Stock Detector",
  "Profit Leakage Alerts",
  "Customer Intelligence",
  "Invoice OCR",
  "Business Copilot"
];
