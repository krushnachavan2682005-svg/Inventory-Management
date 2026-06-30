import type { FastifyInstance } from "fastify";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/role.middleware.js";
import * as controller from "./ai-insights.controller.js";

export async function aiInsightsRoutes(app: FastifyInstance) {
  app.addHook("preHandler", requireAuth);
  app.addHook("preHandler", requireRole("SHOPKEEPER"));
  app.get("/", { schema: { tags: ["AI Insights"], summary: "List AI-ready insight modules", security: [{ bearerAuth: [] }] } }, controller.list);
  app.get("/reorder-suggestions", { schema: { tags: ["AI Insights"], summary: "Reorder suggestions placeholder", security: [{ bearerAuth: [] }] } }, controller.reorder);
  app.get("/demand-forecast", { schema: { tags: ["AI Insights"], summary: "Demand forecast placeholder", security: [{ bearerAuth: [] }] } }, controller.forecast);
  app.get("/dead-stock", { schema: { tags: ["AI Insights"], summary: "Dead stock placeholder", security: [{ bearerAuth: [] }] } }, controller.deadStock);
  app.get("/profit-leakage", { schema: { tags: ["AI Insights"], summary: "Profit leakage placeholder", security: [{ bearerAuth: [] }] } }, controller.profitLeakage);
}
