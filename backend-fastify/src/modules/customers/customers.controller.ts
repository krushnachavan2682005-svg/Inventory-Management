import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { requireTenant } from "../../middlewares/tenant.middleware.js";
import { success } from "../../shared/utils/formatters.js";
import { createCustomerSchema, updateCustomerSchema } from "./customers.schema.js";
import { CustomersService } from "./customers.service.js";

const paramsSchema = z.object({ id: z.string().uuid() });

export async function list(request: FastifyRequest) { return success(await new CustomersService(request.server.pg).list(requireTenant(request))); }
export async function create(request: FastifyRequest, reply: FastifyReply) { const data = await new CustomersService(request.server.pg).create(requireTenant(request), createCustomerSchema.parse(request.body)); return reply.status(201).send(success(data)); }
export async function get(request: FastifyRequest) { const { id } = paramsSchema.parse(request.params); return success(await new CustomersService(request.server.pg).get(requireTenant(request), id)); }
export async function update(request: FastifyRequest) { const { id } = paramsSchema.parse(request.params); return success(await new CustomersService(request.server.pg).update(requireTenant(request), id, updateCustomerSchema.parse(request.body))); }
export async function remove(request: FastifyRequest) { const { id } = paramsSchema.parse(request.params); return success(await new CustomersService(request.server.pg).remove(requireTenant(request), id)); }
