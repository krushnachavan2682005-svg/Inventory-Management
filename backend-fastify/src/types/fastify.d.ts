import type { Pool } from "pg";
import type { AuthUser } from "../shared/types/index.js";

declare module "fastify" {
  interface FastifyInstance {
    pg: Pool;
  }

  interface FastifyRequest {
    authUser?: AuthUser;
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: {
      user_id: string;
      email: string;
      role: AuthUser["role"];
      organization_id: string | null;
    };
    user: {
      user_id: string;
      email: string;
      role: AuthUser["role"];
      organization_id: string | null;
    };
  }
}
