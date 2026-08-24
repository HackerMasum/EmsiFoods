import { NextRequest, NextResponse } from "next/server";
import { orderService } from "@/modules/orders/order.service";
import type { CheckoutInput } from "@/modules/orders/order.types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "User ID is required",
        },
        {
          status: 400,
        }
      );
    }

    const orders =
      await orderService.getOrdersByUserId(userId);

    return NextResponse.json(
      {
        success: true,
        data: orders,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to fetch orders";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body =
      (await request.json()) as CheckoutInput;

    const order =
      await orderService.checkout(body);

    return NextResponse.json(
      {
        success: true,
        message: "Order created successfully",
        data: order,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to create order";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      {
        status: 400,
      }
    );
  }
}