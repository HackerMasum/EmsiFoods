import { NextRequest, NextResponse } from "next/server";
import { storeSettingsService } from "@/modules/store-settings/store-settings.service";
import { requireAdmin } from "@/lib/auth";
import { handleApiError } from "@/lib/api-error";
import type { UpdateStoreSettingsInput } from "@/modules/store-settings/store-settings.types";

// GET /api/settings
// Public: Anyone can view store settings
export async function GET() {
  try {
    const settings =
      await storeSettingsService.getStoreSettings();

    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    return handleApiError(
      error,
      "Failed to fetch store settings"
    );
  }
}

// PATCH /api/settings
// ADMIN only
export async function PATCH(
  request: NextRequest
) {
  try {
    requireAdmin(request);

    const body =
      (await request.json()) as UpdateStoreSettingsInput;

    const settings =
      await storeSettingsService.updateStoreSettings(
        body
      );

    return NextResponse.json({
      success: true,
      message:
        "Store settings updated successfully",
      data: settings,
    });
  } catch (error) {
    return handleApiError(
      error,
      "Failed to update store settings"
    );
  }
}