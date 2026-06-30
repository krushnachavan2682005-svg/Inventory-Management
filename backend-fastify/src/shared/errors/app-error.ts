import { ErrorCodes, type ErrorCode } from "./error-codes.js";

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly details?: unknown;

  constructor(code: ErrorCode, message: string, statusCode = 400, details?: unknown) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }

  static notFound(message = "Resource not found") {
    return new AppError(ErrorCodes.RESOURCE_NOT_FOUND, message, 404);
  }

  static unauthorized(message = "Authentication required") {
    return new AppError(ErrorCodes.AUTHENTICATION_ERROR, message, 401);
  }

  static forbidden(message = "You are not allowed to access this resource") {
    return new AppError(ErrorCodes.AUTHORIZATION_ERROR, message, 403);
  }
}
