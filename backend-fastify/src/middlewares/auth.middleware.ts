import type { FastifyReply, FastifyRequest } from "fastify";
import { AppError } from "../shared/errors/app-error.js";
import type { AuthUser } from "../shared/types/index.js";

export async function requireAuth(request: FastifyRequest, _reply: FastifyReply) {
  try {
    const decoded = await request.jwtVerify<{ user_id: string; email: string; role: AuthUser["role"]; organization_id: string | null; }>();
    request.authUser = {
      id: decoded.user_id,
      email: decoded.email,
      role: decoded.role,
      organizationId: decoded.organization_id
    };
  } catch {
    throw AppError.unauthorized("Invalid or missing access token");
  }
}


