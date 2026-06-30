import type { FastifyInstance } from "fastify";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/role.middleware.js";
import * as controller from "./admin.controller.js";

export async function adminRoutes(app: FastifyInstance) {
  app.addHook("preHandler", requireAuth);
  app.addHook("preHandler", requireRole("ADMIN"));

  app.get("/dashboard", { schema: { tags: ["Admin"], summary: "Platform dashboard", security: [{ bearerAuth: [] }] } }, controller.dashboard);
  app.get("/analytics", { schema: { tags: ["Admin"], summary: "Platform analytics", security: [{ bearerAuth: [] }] } }, controller.analytics);
}
