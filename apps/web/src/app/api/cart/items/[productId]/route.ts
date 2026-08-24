import { NextRequest, NextResponse } from "next/server";
import { cartService } from "@/modules/cart/cart.service";
import type { UpdateCartItemInput } from "@/modules/cart/cart.types";

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
    const { productId } = await params;
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
      userId,
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
    const { productId } = await params;
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

    const cart = await cartService.removeItem(
      userId,
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