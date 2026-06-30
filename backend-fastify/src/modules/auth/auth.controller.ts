import type { FastifyReply, FastifyRequest } from "fastify";
import { success } from "../../shared/utils/formatters.js";
import { AuthService } from "./auth.service.js";
import { loginSchema, registerSchema } from "./auth.schema.js";

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const data = await new AuthService(request.server).register(registerSchema.parse(request.body));
  return reply.status(201).send(success(data));
}

export async function login(request: FastifyRequest) {
  const data = await new AuthService(request.server).login(loginSchema.parse(request.body));
  return success(data);
}

export async function me(request: FastifyRequest) {
  const data = await new AuthService(request.server).me(request.authUser!.id);
  return success(data);
}
