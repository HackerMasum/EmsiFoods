import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { handleApiError } from "@/lib/api-error";
import { profileService } from "@/modules/profile/profile.service";
import type { UpdateProfileInput } from "@/modules/profile/profile.types";

// GET /api/profile
// Authenticated user -> own profile
export async function GET(request: NextRequest) {
  try {
    const user = requireAuth(request);

    const profile =
      await profileService.getProfile(user.id);

    return NextResponse.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    return handleApiError(
      error,
      "Failed to fetch profile"
    );
  }
}

// PATCH /api/profile
// Authenticated user -> update own profile
export async function PATCH(request: NextRequest) {
  try {
    const user = requireAuth(request);

    const body =
      (await request.json()) as UpdateProfileInput;

    const profile =
      await profileService.updateProfile(
        user.id,
        body
      );

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      data: profile,
    });
  } catch (error) {
    return handleApiError(
      error,
      "Failed to update profile"
    );
  }
}