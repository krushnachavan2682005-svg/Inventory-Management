import type { FastifyInstance } from "fastify";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/role.middleware.js";
import * as controller from "./inventory.controller.js";

export async function inventoryRoutes(app: FastifyInstance) {
  app.addHook("preHandler", requireAuth);
  app.addHook("preHandler", requireRole("SHOPKEEPER"));
  app.get("/balances", { schema: { tags: ["Inventory"], summary: "Current inventory balances", security: [{ bearerAuth: [] }] } }, controller.balances);
  app.get("/movements", { schema: { tags: ["Inventory"], summary: "Inventory movement ledger", security: [{ bearerAuth: [] }] } }, controller.movements);
  app.post("/adjustments", { schema: { tags: ["Inventory"], summary: "Create stock adjustment", security: [{ bearerAuth: [] }] } }, controller.adjust);
  app.get("/low-stock", { schema: { tags: ["Inventory"], summary: "Low stock products", security: [{ bearerAuth: [] }] } }, controller.lowStock);
  app.get("/dead-stock-placeholder", { schema: { tags: ["Inventory"], summary: "Dead stock placeholder", security: [{ bearerAuth: [] }] } }, controller.deadStock);
}
