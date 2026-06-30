import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { requireTenant } from "../../middlewares/tenant.middleware.js";
import { success } from "../../shared/utils/formatters.js";
import { createSaleSchema } from "./sales.schema.js";
import { SalesService } from "./sales.service.js";

const paramsSchema = z.object({ id: z.string().uuid() });
export async function list(request: FastifyRequest) { return success(await new SalesService(request.server.pg).list(requireTenant(request))); }
export async function create(request: FastifyRequest, reply: FastifyReply) { const data = await new SalesService(request.server.pg).create(requireTenant(request), request.authUser!.id, createSaleSchema.parse(request.body)); return reply.status(201).send(success(data)); }
export async function get(request: FastifyRequest) { const { id } = paramsSchema.parse(request.params); return success(await new SalesService(request.server.pg).get(requireTenant(request), id)); }
export async function returnSale(request: FastifyRequest) { const { id } = paramsSchema.parse(request.params); return success(await new SalesService(request.server.pg).returnSale(requireTenant(request), id)); }
