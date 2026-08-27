import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/modules/auth/auth.service";
import type { LoginInput } from "@/modules/auth/auth.types";
import { generateToken } from "@/lib/jwt";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as LoginInput;

    const user = await authService.login(body);

    const token = generateToken(user);

    return NextResponse.json({
      success: true,
      message: "Login successful",
      data: {
        user,
        token,
      },
    });
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
      { status: 401 }
    );
  }
}