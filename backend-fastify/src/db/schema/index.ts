import {
  boolean,
  index,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["ADMIN", "SHOPKEEPER", "CASHIER", "MANAGER", "INVENTORY_STAFF", "ACCOUNTANT"]);
export const shopStatusEnum = pgEnum("shop_status", ["ACTIVE", "INACTIVE", "TRIAL", "SUSPENDED"]);
export const productStatusEnum = pgEnum("product_status", ["ACTIVE", "INACTIVE", "ARCHIVED"]);
export const movementTypeEnum = pgEnum("movement_type", ["SALE", "PURCHASE", "RETURN", "DAMAGE", "ADJUSTMENT", "TRANSFER_IN", "TRANSFER_OUT"]);
export const paymentModeEnum = pgEnum("payment_mode", ["CASH", "UPI", "CARD", "CREDIT"]);
export const paymentStatusEnum = pgEnum("payment_status", ["PAID", "PARTIAL", "CREDIT", "REFUNDED"]);
export const insightStatusEnum = pgEnum("insight_status", ["AI_READY", "COMING_SOON"]);

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true })
};

export const organizations = pgTable("organizations", {
  id: uuid("id").defaultRandom().primaryKey(),
  shopName: text("shop_name").notNull(),
  ownerName: text("owner_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  businessType: text("business_type").notNull(),
  city: text("city").notNull(),
  gstin: text("gstin"),
  status: shopStatusEnum("status").notNull().default("TRIAL"),
  plan: text("plan").notNull().default("STARTER"),
  ...timestamps
}, (table) => ({
  emailIdx: uniqueIndex("organizations_email_idx").on(table.email),
  statusIdx: index("organizations_status_idx").on(table.status)
}));

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").references(() => organizations.id, { onDelete: "set null" }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  passwordHash: text("password_hash").notNull(),
  role: roleEnum("role").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
  ...timestamps
}, (table) => ({
  emailIdx: uniqueIndex("users_email_idx").on(table.email),
  orgIdx: index("users_organization_idx").on(table.organizationId)
}));

export const productCategories = pgTable("product_categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  ...timestamps
}, (table) => ({
  orgNameIdx: uniqueIndex("product_categories_org_name_idx").on(table.organizationId, table.name)
}));

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  categoryId: uuid("category_id").references(() => productCategories.id, { onDelete: "set null" }),
  name: text("name").notNull(),
  sku: text("sku").notNull(),
  barcode: text("barcode"),
  purchasePrice: numeric("purchase_price", { precision: 12, scale: 2 }).notNull(),
  sellingPrice: numeric("selling_price", { precision: 12, scale: 2 }).notNull(),
  mrp: numeric("mrp", { precision: 12, scale: 2 }).notNull(),
  taxRate: numeric("tax_rate", { precision: 5, scale: 2 }).notNull().default("0"),
  lowStockThreshold: integer("low_stock_threshold").notNull().default(0),
  unit: text("unit").notNull().default("pcs"),
  status: productStatusEnum("status").notNull().default("ACTIVE"),
  ...timestamps
}, (table) => ({
  orgSkuIdx: uniqueIndex("products_org_sku_idx").on(table.organizationId, table.sku),
  orgBarcodeIdx: index("products_org_barcode_idx").on(table.organizationId, table.barcode)
}));

export const customers = pgTable("customers", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  totalPurchases: numeric("total_purchases", { precision: 12, scale: 2 }).notNull().default("0"),
  creditDue: numeric("credit_due", { precision: 12, scale: 2 }).notNull().default("0"),
  lastVisitAt: timestamp("last_visit_at", { withTimezone: true }),
  ...timestamps
}, (table) => ({
  orgPhoneIdx: uniqueIndex("customers_org_phone_idx").on(table.organizationId, table.phone)
}));

export const suppliers = pgTable("suppliers", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  contactName: text("contact_name"),
  phone: text("phone").notNull(),
  email: text("email"),
  productsSupplied: integer("products_supplied").notNull().default(0),
  pendingAmount: numeric("pending_amount", { precision: 12, scale: 2 }).notNull().default("0"),
  leadTimeDays: integer("lead_time_days").notNull().default(0),
  ...timestamps
});

export const sales = pgTable("sales", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  customerId: uuid("customer_id").references(() => customers.id, { onDelete: "set null" }),
  invoiceNumber: text("invoice_number").notNull(),
  subtotal: numeric("subtotal", { precision: 12, scale: 2 }).notNull(),
  discountTotal: numeric("discount_total", { precision: 12, scale: 2 }).notNull().default("0"),
  taxTotal: numeric("tax_total", { precision: 12, scale: 2 }).notNull().default("0"),
  totalAmount: numeric("total_amount", { precision: 12, scale: 2 }).notNull(),
  status: paymentStatusEnum("status").notNull().default("PAID"),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  ...timestamps
}, (table) => ({
  orgInvoiceIdx: uniqueIndex("sales_org_invoice_idx").on(table.organizationId, table.invoiceNumber)
}));

export const saleItems = pgTable("sale_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  saleId: uuid("sale_id").notNull().references(() => sales.id, { onDelete: "cascade" }),
  productId: uuid("product_id").notNull().references(() => products.id),
  quantity: integer("quantity").notNull(),
  unitPrice: numeric("unit_price", { precision: 12, scale: 2 }).notNull(),
  discount: numeric("discount", { precision: 12, scale: 2 }).notNull().default("0"),
  taxAmount: numeric("tax_amount", { precision: 12, scale: 2 }).notNull().default("0"),
  lineTotal: numeric("line_total", { precision: 12, scale: 2 }).notNull(),
  ...timestamps
});

export const invoices = pgTable("invoices", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  saleId: uuid("sale_id").notNull().references(() => sales.id, { onDelete: "cascade" }),
  invoiceNumber: text("invoice_number").notNull(),
  issuedAt: timestamp("issued_at", { withTimezone: true }).notNull().defaultNow(),
  pdfUrl: text("pdf_url"),
  ...timestamps
});

export const payments = pgTable("payments", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  saleId: uuid("sale_id").notNull().references(() => sales.id, { onDelete: "cascade" }),
  paymentMode: paymentModeEnum("payment_mode").notNull(),
  amountPaid: numeric("amount_paid", { precision: 12, scale: 2 }).notNull(),
  status: paymentStatusEnum("status").notNull(),
  paidAt: timestamp("paid_at", { withTimezone: true }).notNull().defaultNow(),
  ...timestamps
});

export const inventoryBalances = pgTable("inventory_balances", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  availableQuantity: integer("available_quantity").notNull().default(0),
  reservedQuantity: integer("reserved_quantity").notNull().default(0),
  ...timestamps
}, (table) => ({
  orgProductIdx: uniqueIndex("inventory_balances_org_product_idx").on(table.organizationId, table.productId)
}));

export const inventoryMovements = pgTable("inventory_movements", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  movementType: movementTypeEnum("movement_type").notNull(),
  quantity: integer("quantity").notNull(),
  previousQuantity: integer("previous_quantity").notNull(),
  newQuantity: integer("new_quantity").notNull(),
  referenceType: text("reference_type"),
  referenceId: uuid("reference_id"),
  reason: text("reason"),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});

export const stockAdjustments = pgTable("stock_adjustments", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  productId: uuid("product_id").notNull().references(() => products.id),
  quantityDelta: integer("quantity_delta").notNull(),
  reason: text("reason").notNull(),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  ...timestamps
});

export const purchaseOrders = pgTable("purchase_orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  supplierId: uuid("supplier_id").references(() => suppliers.id, { onDelete: "set null" }),
  status: text("status").notNull().default("DRAFT"),
  expectedAt: timestamp("expected_at", { withTimezone: true }),
  totalAmount: numeric("total_amount", { precision: 12, scale: 2 }).notNull().default("0"),
  ...timestamps
});

export const purchaseOrderItems = pgTable("purchase_order_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  purchaseOrderId: uuid("purchase_order_id").notNull().references(() => purchaseOrders.id, { onDelete: "cascade" }),
  productId: uuid("product_id").notNull().references(() => products.id),
  quantity: integer("quantity").notNull(),
  unitCost: numeric("unit_cost", { precision: 12, scale: 2 }).notNull(),
  ...timestamps
});

export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").references(() => organizations.id, { onDelete: "cascade" }),
  actorUserId: uuid("actor_user_id").references(() => users.id, { onDelete: "set null" }),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: uuid("entity_id"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});

export const aiInsights = pgTable("ai_insights", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  moduleKey: text("module_key").notNull(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  status: insightStatusEnum("status").notNull().default("COMING_SOON"),
  payload: jsonb("payload"),
  ...timestamps
});
