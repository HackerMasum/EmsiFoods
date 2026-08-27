import bcrypt from "bcryptjs";
import { authRepository } from "./auth.repository";
import type {
  AuthUser,
  LoginInput,
  RegisterInput,
} from "./auth.types";

const SALT_ROUNDS = 12;

export const authService = {
  async register(data: RegisterInput): Promise<AuthUser> {
    const email = data.email.trim().toLowerCase();

    if (!email || !data.password) {
      throw new Error("Email and password are required");
    }

    if (data.password.length < 8) {
      throw new Error(
        "Password must be at least 8 characters long"
      );
    }

    const existingUser =
      await authRepository.findUserByEmail(email);

    if (existingUser) {
      throw new Error(
        "A user with this email already exists"
      );
    }

    const hashedPassword = await bcrypt.hash(
      data.password,
      SALT_ROUNDS
    );

    const user = await authRepository.createUser({
      name: data.name?.trim() || undefined,
      email,
      password: hashedPassword,
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  },

  async login(data: LoginInput): Promise<AuthUser> {
    const email = data.email.trim().toLowerCase();

    if (!email || !data.password) {
      throw new Error("Email and password are required");
    }

    const user =
      await authRepository.findUserByEmail(email);

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const passwordMatches = await bcrypt.compare(
      data.password,
      user.password
    );

    if (!passwordMatches) {
      throw new Error("Invalid email or password");
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  },
};