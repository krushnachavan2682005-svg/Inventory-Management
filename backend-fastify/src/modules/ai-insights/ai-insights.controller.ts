import type { FastifyRequest } from "fastify";
import { requireTenant } from "../../middlewares/tenant.middleware.js";
import { success } from "../../shared/utils/formatters.js";
import { AiInsightsService } from "./ai-insights.service.js";

export async function list(request: FastifyRequest) { return success(await new AiInsightsService(request.server.pg).list(requireTenant(request))); }
export async function reorder(request: FastifyRequest) { requireTenant(request); return success(new AiInsightsService(request.server.pg).one("reorder-suggestions")); }
export async function forecast(request: FastifyRequest) { requireTenant(request); return success(new AiInsightsService(request.server.pg).one("demand-forecast")); }
export async function deadStock(request: FastifyRequest) { requireTenant(request); return success(new AiInsightsService(request.server.pg).one("dead-stock")); }
export async function profitLeakage(request: FastifyRequest) { requireTenant(request); return success(new AiInsightsService(request.server.pg).one("profit-leakage")); }
