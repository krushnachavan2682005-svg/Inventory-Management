import type { FastifyRequest } from "fastify";
import { AppError } from "../shared/errors/app-error.js";
import { ErrorCodes } from "../shared/errors/error-codes.js";

export function getTenantId(request: FastifyRequest) {
  if (!request.authUser) {
    throw AppError.unauthorized();
  }

  if (request.authUser.role === "ADMIN") {
    return null;
  }

  if (!request.authUser.organizationId) {
    throw new AppError(ErrorCodes.TENANT_ACCESS_DENIED, "Shopkeeper account has no organization context", 403);
  }

  return request.authUser.organizationId;
}

export function requireTenant(request: FastifyRequest) {
  const tenantId = getTenantId(request);
  if (!tenantId) {
    throw new AppError(ErrorCodes.TENANT_ACCESS_DENIED, "This route requires a shop organization context", 403);
  }
  return tenantId;
}
