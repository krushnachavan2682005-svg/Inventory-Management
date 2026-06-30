import fp from "fastify-plugin";
import { ZodError } from "zod";
import { AppError } from "../shared/errors/app-error.js";
import { ErrorCodes } from "../shared/errors/error-codes.js";

export const errorHandlerPlugin = fp(async (fastify) => {
  fastify.setErrorHandler((error, request, reply) => {
    request.log.error(error);

    if (error instanceof ZodError) {
      return reply.status(400).send({
        success: false,
        error: {
          code: ErrorCodes.VALIDATION_ERROR,
          message: "Validation failed",
          details: error.flatten()
        }
      });
    }

    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        success: false,
        error: {
          code: error.code,
          message: error instanceof Error ? error.message : "Validation failed",
          details: error.details ?? {}
        }
      });
    }

    if (typeof error === "object" && error !== null && "validation" in error) {
      return reply.status(400).send({
        success: false,
        error: {
          code: ErrorCodes.VALIDATION_ERROR,
          message: error instanceof Error ? error.message : "Validation failed",
          details: {}
        }
      });
    }

    return reply.status(500).send({
      success: false,
      error: {
        code: ErrorCodes.INTERNAL_SERVER_ERROR,
        message: "Internal server error",
        details: {}
      }
    });
  });
});

