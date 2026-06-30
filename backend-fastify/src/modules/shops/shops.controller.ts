import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { success } from "../../shared/utils/formatters.js";
import { createShopSchema, updateShopSchema, updateShopStatusSchema } from "./shops.schema.js";
import { ShopsService } from "./shops.service.js";

const paramsSchema = z.object({ id: z.string().uuid() });

export async function list(request: FastifyRequest) {
  return success(await new ShopsService(request.server.pg).list());
}

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const data = await new ShopsService(request.server.pg).create(createShopSchema.parse(request.body));
  return reply.status(201).send(success(data));
}

export async function get(request: FastifyRequest) {
  const { id } = paramsSchema.parse(request.params);
  return success(await new ShopsService(request.server.pg).get(id));
}

export async function update(request: FastifyRequest) {
  const { id } = paramsSchema.parse(request.params);
  return success(await new ShopsService(request.server.pg).update(id, updateShopSchema.parse(request.body)));
}

export async function updateStatus(request: FastifyRequest) {
  const { id } = paramsSchema.parse(request.params);
  const { status } = updateShopStatusSchema.parse(request.body);
  return success(await new ShopsService(request.server.pg).updateStatus(id, status));
}
