import type { FastifyInstance } from "fastify";
import { AppError } from "../../shared/errors/app-error.js";
import { ErrorCodes } from "../../shared/errors/error-codes.js";
import { hashPassword, verifyPassword } from "../../shared/utils/password.js";
import type { LoginInput, RegisterInput } from "./auth.schema.js";
import { AuthRepository } from "./auth.repository.js";

function publicUser(user: Record<string, unknown>) {
  return {
    id: user.id,
    organization_id: user.organization_id,
    name: user.name,
    email: user.email,
    role: user.role,
    is_active: user.is_active,
    created_at: user.created_at,
    updated_at: user.updated_at
  };
}

export class AuthService {
  private readonly repository: AuthRepository;

  constructor(private readonly app: FastifyInstance) {
    this.repository = new AuthRepository(app.pg);
  }

  async register(input: RegisterInput) {
    const existing = await this.repository.findUserByEmail(input.email);
    if (existing) {
      throw new AppError(ErrorCodes.DUPLICATE_RESOURCE, "Email is already registered", 409);
    }

    if (input.role === "SHOPKEEPER" && !input.organization_id) {
      throw new AppError(ErrorCodes.BUSINESS_RULE_ERROR, "Shopkeeper registration requires organization_id", 400);
    }

    const passwordHash = await hashPassword(input.password);
    const user = await this.repository.createUser(input, passwordHash);
    return publicUser(user);
  }

  async login(input: LoginInput) {
    const user = await this.repository.findUserByEmail(input.email);
    if (!user || !user.is_active) {
      throw AppError.unauthorized("Invalid credentials");
    }

    const passwordOk = await verifyPassword(input.password, user.password_hash);
    if (!passwordOk) {
      throw AppError.unauthorized("Invalid credentials");
    }

    await this.repository.touchLastLogin(user.id);

    const accessToken = await this.app.jwt.sign({
      user_id: user.id,
      email: user.email,
      role: user.role,
      organization_id: user.organization_id
    });

    return {
      accessToken,
      user: publicUser(user),
      role: user.role,
      organization: {
        id: user.organization_id
      }
    };
  }

  async me(userId: string) {
    const user = await this.repository.findUserById(userId);
    if (!user) {
      throw AppError.notFound("User not found");
    }
    return publicUser(user);
  }
}
