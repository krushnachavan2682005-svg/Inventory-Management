import type { FastifyInstance } from "fastify";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/role.middleware.js";
import * as controller from "./customers.controller.js";

export async function customerRoutes(app: FastifyInstance) {
  app.addHook("preHandler", requireAuth);
  app.addHook("preHandler", requireRole("SHOPKEEPER"));
  app.get("/", { schema: { tags: ["Customers"], summary: "List customers", security: [{ bearerAuth: [] }] } }, controller.list);
  app.post("/", { schema: { tags: ["Customers"], summary: "Create customer", security: [{ bearerAuth: [] }] } }, controller.create);
  app.get("/:id", { schema: { tags: ["Customers"], summary: "Get customer", security: [{ bearerAuth: [] }] } }, controller.get);
  app.patch("/:id", { schema: { tags: ["Customers"], summary: "Update customer", security: [{ bearerAuth: [] }] } }, controller.update);
  app.delete("/:id", { schema: { tags: ["Customers"], summary: "Delete customer", security: [{ bearerAuth: [] }] } }, controller.remove);
}
