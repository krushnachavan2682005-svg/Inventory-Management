import type { FastifyInstance } from "fastify";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/role.middleware.js";
import * as controller from "./reports.controller.js";

export async function reportsRoutes(app: FastifyInstance) {
  app.addHook("preHandler", requireAuth);
  app.addHook("preHandler", requireRole("SHOPKEEPER"));
  app.get("/dashboard", { schema: { tags: ["Reports"], summary: "Shop dashboard report", security: [{ bearerAuth: [] }] } }, controller.dashboard);
  app.get("/sales-summary", { schema: { tags: ["Reports"], summary: "Sales summary", security: [{ bearerAuth: [] }] } }, controller.salesSummary);
  app.get("/inventory-health", { schema: { tags: ["Reports"], summary: "Inventory health", security: [{ bearerAuth: [] }] } }, controller.inventoryHealth);
  app.get("/top-products", { schema: { tags: ["Reports"], summary: "Top products", security: [{ bearerAuth: [] }] } }, controller.topProducts);
  app.get("/payment-breakdown", { schema: { tags: ["Reports"], summary: "Payment mode breakdown", security: [{ bearerAuth: [] }] } }, controller.paymentBreakdown);
}
