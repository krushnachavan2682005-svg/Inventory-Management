import type { Role } from "../types/index.js";

export interface JwtClaims {
  user_id: string;
  email: string;
  role: Role;
  organization_id: string | null;
}
