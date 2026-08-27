import { NextRequest, NextResponse } from "next/server";
import { cartService } from "@/modules/cart/cart.service";
import type { AddCartItemInput } from "@/modules/cart/cart.types";
import { requireAuth } from "@/lib/auth";

// POST /api/cart/items
export async function POST(request: NextRequest) {
  try {
    const user = requireAuth(request);

    const body = (await request.json()) as AddCartItemInput;

    const { productId, quantity } = body;

    if (!productId || quantity === undefined) {
      return NextResponse.json(
        {
          success: false,
          message: "productId and quantity are required",
        },
        { status: 400 }
      );
    }

    const cart = await cartService.addItem({
      userId: user.id,
      productId,
      quantity,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Product added to cart successfully",
        data: cart,
      },
      { status: 201 }
    );
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