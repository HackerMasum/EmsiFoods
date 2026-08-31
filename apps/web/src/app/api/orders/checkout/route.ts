import { NextRequest, NextResponse } from "next/server";
import { isValidPhoneNumber } from "libphonenumber-js";

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

    const normalizedPhone = phone.trim();

    if (!normalizedPhone.startsWith("+")) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please enter a phone number with an international country code.",
        },
        { status: 400 }
      );
    }

    if (!isValidPhoneNumber(normalizedPhone)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please enter a valid international phone number.",
        },
        { status: 400 }
      );
    }

    const order = await orderService.checkout({
      userId: user.id,
      customerName: customerName.trim(),
      phone: normalizedPhone,
      address: address.trim(),
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