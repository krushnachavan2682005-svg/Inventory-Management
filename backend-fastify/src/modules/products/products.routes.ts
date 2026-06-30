import type { FastifyInstance } from "fastify";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/role.middleware.js";
import * as controller from "./products.controller.js";

export async function productRoutes(app: FastifyInstance) {
  app.addHook("preHandler", requireAuth);
  app.addHook("preHandler", requireRole("SHOPKEEPER"));

  app.get("/", { schema: { tags: ["Products"], summary: "List shop products", security: [{ bearerAuth: [] }] } }, controller.list);
  app.post("/", { schema: { tags: ["Products"], summary: "Create product", security: [{ bearerAuth: [] }] } }, controller.create);
  app.get("/:id", { schema: { tags: ["Products"], summary: "Get product", security: [{ bearerAuth: [] }] } }, controller.get);
  app.patch("/:id", { schema: { tags: ["Products"], summary: "Update product", security: [{ bearerAuth: [] }] } }, controller.update);
  app.delete("/:id", { schema: { tags: ["Products"], summary: "Delete product", security: [{ bearerAuth: [] }] } }, controller.remove);
}
