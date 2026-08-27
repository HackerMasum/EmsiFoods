import { NextRequest } from "next/server";
import { verifyToken, type JwtPayload } from "./jwt";

export class AuthenticationError extends Error {
  constructor(message = "Authentication required") {
    super(message);
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends Error {
  constructor(message = "You are not authorized to perform this action") {
    super(message);
    this.name = "AuthorizationError";
  }
}

export function requireAuth(request: NextRequest): JwtPayload {
  const authorization = request.headers.get("authorization");

  if (!authorization) {
    throw new AuthenticationError(
      "Authorization header is required"
    );
  }

  const [type, token] = authorization.split(" ");

  if (type !== "Bearer" || !token) {
    throw new AuthenticationError(
      "Invalid authorization format"
    );
  }

  try {
    return verifyToken(token);
  } catch {
    throw new AuthenticationError(
      "Invalid or expired token"
    );
  }
}