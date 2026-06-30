import type { FastifyReply, FastifyRequest } from "fastify";
import { requireTenant } from "../../middlewares/tenant.middleware.js";
import { success } from "../../shared/utils/formatters.js";
import { stockAdjustmentSchema } from "./inventory.schema.js";
import { InventoryService } from "./inventory.service.js";

export async function balances(request: FastifyRequest) { return success(await new InventoryService(request.server.pg).balances(requireTenant(request))); }
export async function movements(request: FastifyRequest) { return success(await new InventoryService(request.server.pg).movements(requireTenant(request))); }
export async function lowStock(request: FastifyRequest) { return success(await new InventoryService(request.server.pg).lowStock(requireTenant(request))); }
export async function deadStock(request: FastifyRequest) { return success(new InventoryService(request.server.pg).deadStockPlaceholder()); }
export async function adjust(request: FastifyRequest, reply: FastifyReply) {
  const data = await new InventoryService(request.server.pg).adjust(requireTenant(request), request.authUser!.id, stockAdjustmentSchema.parse(request.body));
  return reply.status(201).send(success(data));
}
