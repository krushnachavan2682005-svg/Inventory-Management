import type { FastifyInstance } from "fastify";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/role.middleware.js";
import * as controller from "./sales.controller.js";

export async function salesRoutes(app: FastifyInstance) {
  app.addHook("preHandler", requireAuth);
  app.addHook("preHandler", requireRole("SHOPKEEPER"));
  app.post("/", { schema: { tags: ["Sales POS"], summary: "Create POS sale transaction", security: [{ bearerAuth: [] }] } }, controller.create);
  app.get("/", { schema: { tags: ["Sales POS"], summary: "List sales", security: [{ bearerAuth: [] }] } }, controller.list);
  app.get("/:id", { schema: { tags: ["Sales POS"], summary: "Get sale", security: [{ bearerAuth: [] }] } }, controller.get);
  app.post("/:id/return", { schema: { tags: ["Sales POS"], summary: "Create sale return placeholder", security: [{ bearerAuth: [] }] } }, controller.returnSale);
}
