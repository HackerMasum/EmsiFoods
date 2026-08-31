import { NextRequest, NextResponse } from "next/server";
import { cartService } from "@/modules/cart/cart.service";
import { requireAuth } from "@/lib/auth";
import { handleApiError } from "@/lib/api-error";

// GET /api/cart
// Authenticated user -> own cart
export async function GET(request: NextRequest) {
  try {
    const user = requireAuth(request);

    const cart = await cartService.getCart(user.id);

    return NextResponse.json({
      success: true,
      data: cart,
    });
  } catch (error) {
    return handleApiError(
      error,
      "Failed to fetch cart"
    );
  }
}