import { NextResponse } from "next/server";
import {
  AuthenticationError,
  AuthorizationError,
} from "./auth";

export function handleApiError(
  error: unknown,
  fallbackMessage = "Something went wrong"
) {
  const message =
    error instanceof Error
      ? error.message
      : fallbackMessage;

  if (error instanceof AuthenticationError) {
    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 401 }
    );
  }

  if (error instanceof AuthorizationError) {
    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 403 }
    );
  }

  if (message === "Order not found") {
    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 404 }
    );
  }

  return NextResponse.json(
    {
      success: false,
      message,
    },
    { status: 400 }
  );
}