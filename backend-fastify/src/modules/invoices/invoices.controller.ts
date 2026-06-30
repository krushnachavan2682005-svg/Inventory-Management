import type { FastifyRequest } from "fastify";
import { z } from "zod";
import { requireTenant } from "../../middlewares/tenant.middleware.js";
import { success } from "../../shared/utils/formatters.js";
import { InvoicesService } from "./invoices.service.js";

const paramsSchema = z.object({ id: z.string().uuid() });
export async function list(request: FastifyRequest) { return success(await new InvoicesService(request.server.pg).list(requireTenant(request))); }
export async function get(request: FastifyRequest) { const { id } = paramsSchema.parse(request.params); return success(await new InvoicesService(request.server.pg).get(requireTenant(request), id)); }
