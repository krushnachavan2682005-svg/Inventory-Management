import jwt from "@fastify/jwt";
import fp from "fastify-plugin";
import { env } from "../config/env.js";

export const authPlugin = fp(async (fastify) => {
  await fastify.register(jwt, {
    secret: env.JWT_SECRET,
    sign: {
      expiresIn: env.JWT_EXPIRES_IN
    }
  });
});
