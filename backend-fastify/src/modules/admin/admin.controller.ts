import type { FastifyRequest } from "fastify";
import { success } from "../../shared/utils/formatters.js";
import { AdminService } from "./admin.service.js";

export async function dashboard(request: FastifyRequest) {
  return success(await new AdminService(request.server.pg).dashboard());
}

export async function analytics(request: FastifyRequest) {
  return success(await new AdminService(request.server.pg).analytics());
}
