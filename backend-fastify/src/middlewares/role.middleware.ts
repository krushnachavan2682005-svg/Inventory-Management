import type { FastifyReply, FastifyRequest } from "fastify";
import { AppError } from "../shared/errors/app-error.js";
import type { Role } from "../shared/types/index.js";

export function requireRole(...roles: Role[]) {
  return async (request: FastifyRequest, _reply: FastifyReply) => {
    if (!request.authUser) {
      throw AppError.unauthorized();
    }

    if (!roles.includes(request.authUser.role)) {
      throw AppError.forbidden("Role does not have access to this route");
    }
  };
}
