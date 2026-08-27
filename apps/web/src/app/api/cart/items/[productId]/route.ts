import { NextRequest, NextResponse } from "next/server";
import { cartService } from "@/modules/cart/cart.service";
import type { UpdateCartItemInput } from "@/modules/cart/cart.types";
import { requireAuth } from "@/lib/auth";

type RouteContext = {
  params: Promise<{
    productId: string;
  }>;
};

// PATCH /api/cart/items/[productId]
export async function PATCH(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const user = requireAuth(request);
    const { productId } = await params;

    const body = (await request.json()) as UpdateCartItemInput;

    if (body.quantity === undefined) {
      return NextResponse.json(
        {
          success: false,
          message: "quantity is required",
        },
        { status: 400 }
      );
    }

    const cart = await cartService.updateItem(
      user.id,
      productId,
      {
        quantity: body.quantity,
      }
    );

    return NextResponse.json({
      success: true,
      message: "Cart item updated successfully",
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

// DELETE /api/cart/items/[productId]
export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const user = requireAuth(request);
    const { productId } = await params;

    const cart = await cartService.removeItem(
      user.id,
      productId
    );

    return NextResponse.json({
      success: true,
      message: "Product removed from cart successfully",
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