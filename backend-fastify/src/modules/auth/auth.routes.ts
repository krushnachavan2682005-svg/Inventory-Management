import type { FastifyInstance } from "fastify";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import * as controller from "./auth.controller.js";

export async function authRoutes(app: FastifyInstance) {
  app.post("/register", { schema: { tags: ["Auth"], summary: "Register admin or shopkeeper user" } }, controller.register);
  app.post("/login", { schema: { tags: ["Auth"], summary: "Login and receive JWT access token" } }, controller.login);
  app.get("/me", { preHandler: [requireAuth], schema: { tags: ["Auth"], summary: "Get authenticated user", security: [{ bearerAuth: [] }] } }, controller.me);
}
