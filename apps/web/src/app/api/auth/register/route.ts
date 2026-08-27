import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/modules/auth/auth.service";
import type { RegisterInput } from "@/modules/auth/auth.types";
import { generateToken } from "@/lib/jwt";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as RegisterInput;

    const user = await authService.register(body);

    const token = generateToken(user);

    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully",
        data: {
          user,
          token,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Something went wrong";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 400 }
    );
  }
}