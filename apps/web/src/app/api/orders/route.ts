import { NextRequest, NextResponse } from "next/server";
import { orderService } from "@/modules/orders/order.service";

// GET /api/orders
// GET /api/orders?userId=xxx
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const userId = searchParams.get("userId") || undefined;

    const orders = await orderService.getOrders(userId);

    return NextResponse.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Something went wrong";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 400 }
    );
  }
}