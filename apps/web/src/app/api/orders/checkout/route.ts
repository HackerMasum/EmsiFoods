import { NextRequest, NextResponse } from "next/server";
import { orderService } from "@/modules/orders/order.service";
import type { CheckoutInput } from "@/modules/orders/order.types";

// POST /api/orders/checkout
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CheckoutInput;

    const {
      userId,
      customerName,
      phone,
      address,
      couponCode,
      paymentMethod,
    } = body;

    if (!userId || !customerName || !phone || !address) {
      return NextResponse.json(
        {
          success: false,
          message:
            "userId, customerName, phone and address are required",
        },
        { status: 400 }
      );
    }

    const order = await orderService.checkout({
      userId,
      customerName,
      phone,
      address,
      couponCode,
      paymentMethod,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Order placed successfully",
        data: order,
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