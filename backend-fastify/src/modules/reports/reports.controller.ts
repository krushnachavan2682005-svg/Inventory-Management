import type { FastifyRequest } from "fastify";
import { requireTenant } from "../../middlewares/tenant.middleware.js";
import { success } from "../../shared/utils/formatters.js";
import { ReportsService } from "./reports.service.js";

export async function dashboard(request: FastifyRequest) { return success(await new ReportsService(request.server.pg).dashboard(requireTenant(request))); }
export async function salesSummary(request: FastifyRequest) { return success(await new ReportsService(request.server.pg).salesSummary(requireTenant(request))); }
export async function inventoryHealth(request: FastifyRequest) { return success(await new ReportsService(request.server.pg).inventoryHealth(requireTenant(request))); }
export async function topProducts(request: FastifyRequest) { return success(await new ReportsService(request.server.pg).topProducts(requireTenant(request))); }
export async function paymentBreakdown(request: FastifyRequest) { return success(await new ReportsService(request.server.pg).paymentBreakdown(requireTenant(request))); }
