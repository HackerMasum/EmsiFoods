import { NextRequest, NextResponse } from "next/server";
import { cartService } from "@/modules/cart/cart.service";

// GET /api/cart?userId=USER_ID
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "userId is required",
        },
        { status: 400 }
      );
    }

    const cart = await cartService.getCart(userId);

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
      { status: 400 }
    );
  }
}