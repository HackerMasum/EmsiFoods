import { NextRequest, NextResponse } from "next/server";
import { cartService } from "@/modules/cart/cart.service";
import { requireAuth } from "@/lib/auth";

// GET /api/cart
export async function GET(request: NextRequest) {
  try {
    const user = requireAuth(request);

    const cart = await cartService.getCart(user.id);

    return NextResponse.json({
      success: true,
      data: cart,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 401 }
    );
  }
}