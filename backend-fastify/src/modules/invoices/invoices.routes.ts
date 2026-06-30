import type { FastifyInstance } from "fastify";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/role.middleware.js";
import * as controller from "./invoices.controller.js";

export async function invoiceRoutes(app: FastifyInstance) {
  app.addHook("preHandler", requireAuth);
  app.addHook("preHandler", requireRole("SHOPKEEPER"));
  app.get("/", { schema: { tags: ["Invoices"], summary: "List invoices", security: [{ bearerAuth: [] }] } }, controller.list);
  app.get("/:id", { schema: { tags: ["Invoices"], summary: "Get invoice", security: [{ bearerAuth: [] }] } }, controller.get);
}
