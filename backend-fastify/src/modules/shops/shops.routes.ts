import type { FastifyInstance } from "fastify";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/role.middleware.js";
import * as controller from "./shops.controller.js";

export async function shopRoutes(app: FastifyInstance) {
  app.addHook("preHandler", requireAuth);
  app.addHook("preHandler", requireRole("ADMIN"));

  app.get("/", { schema: { tags: ["Admin Shops"], summary: "List all shops", security: [{ bearerAuth: [] }] } }, controller.list);
  app.post("/", { schema: { tags: ["Admin Shops"], summary: "Create shop", security: [{ bearerAuth: [] }] } }, controller.create);
  app.get("/:id", { schema: { tags: ["Admin Shops"], summary: "Get shop", security: [{ bearerAuth: [] }] } }, controller.get);
  app.patch("/:id", { schema: { tags: ["Admin Shops"], summary: "Update shop", security: [{ bearerAuth: [] }] } }, controller.update);
  app.patch("/:id/status", { schema: { tags: ["Admin Shops"], summary: "Update shop status", security: [{ bearerAuth: [] }] } }, controller.updateStatus);
}
