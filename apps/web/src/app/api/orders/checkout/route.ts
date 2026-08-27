import { NextRequest, NextResponse } from "next/server";
import { orderService } from "@/modules/orders/order.service";
import { requireAuth } from "@/lib/auth";
import { handleApiError } from "@/lib/api-error";
import type { CheckoutInput } from "@/modules/orders/order.types";

// POST /api/orders/checkout
export async function POST(request: NextRequest) {
  try {
    const user = requireAuth(request);

    const body =
      (await request.json()) as Omit<
        CheckoutInput,
        "userId"
      >;

    const {
      customerName,
      phone,
      address,
      couponCode,
      paymentMethod,
    } = body;

    if (!customerName || !phone || !address) {
      return NextResponse.json(
        {
          success: false,
          message:
            "customerName, phone and address are required",
        },
        { status: 400 }
      );
    }

    const order = await orderService.checkout({
      userId: user.id,
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
    return handleApiError(error);
  }
}