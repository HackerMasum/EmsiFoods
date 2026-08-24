import { NextRequest, NextResponse } from "next/server";
import { cartService } from "@/modules/cart/cart.service";
import type { AddCartItemInput } from "@/modules/cart/cart.types";

// POST /api/cart/items
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as AddCartItemInput;

    const { userId, productId, quantity } = body;

    if (!userId || !productId || quantity === undefined) {
      return NextResponse.json(
        {
          success: false,
          message: "userId, productId and quantity are required",
        },
        { status: 400 }
      );
    }

    const cart = await cartService.addItem({
      userId,
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