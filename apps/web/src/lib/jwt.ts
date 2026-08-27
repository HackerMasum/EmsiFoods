import jwt, { type JwtPayload as JsonWebTokenPayload } from "jsonwebtoken";
import type { AuthUser } from "@/modules/auth/auth.types";

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  return secret;
}

const JWT_EXPIRES_IN = "7d";

export type JwtPayload = {
  id: string;
  email: string;
  role: AuthUser["role"];
};

export function generateToken(user: AuthUser): string {
  const secret = getJwtSecret();

  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    secret,
    {
      expiresIn: JWT_EXPIRES_IN,
    }
  );
}

export function verifyToken(token: string): JwtPayload {
  const secret = getJwtSecret();

  const decoded = jwt.verify(token, secret);

  if (
    typeof decoded === "string" ||
    !decoded ||
    !("id" in decoded) ||
    !("email" in decoded) ||
    !("role" in decoded)
  ) {
    throw new Error("Invalid token payload");
  }

  const payload = decoded as JsonWebTokenPayload;

  return {
    id: String(payload.id),
    email: String(payload.email),
    role: payload.role as AuthUser["role"],
  };
}