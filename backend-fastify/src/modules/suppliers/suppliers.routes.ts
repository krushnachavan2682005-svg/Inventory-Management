import type { FastifyInstance } from "fastify";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/role.middleware.js";
import * as controller from "./suppliers.controller.js";

export async function supplierRoutes(app: FastifyInstance) {
  app.addHook("preHandler", requireAuth);
  app.addHook("preHandler", requireRole("SHOPKEEPER"));
  app.get("/", { schema: { tags: ["Suppliers"], summary: "List suppliers", security: [{ bearerAuth: [] }] } }, controller.list);
  app.post("/", { schema: { tags: ["Suppliers"], summary: "Create supplier", security: [{ bearerAuth: [] }] } }, controller.create);
  app.get("/:id", { schema: { tags: ["Suppliers"], summary: "Get supplier", security: [{ bearerAuth: [] }] } }, controller.get);
  app.patch("/:id", { schema: { tags: ["Suppliers"], summary: "Update supplier", security: [{ bearerAuth: [] }] } }, controller.update);
  app.delete("/:id", { schema: { tags: ["Suppliers"], summary: "Delete supplier", security: [{ bearerAuth: [] }] } }, controller.remove);
}
