import { NextRequest, NextResponse } from "next/server";

import {
  AuthorizationError,
  requireAuth,
} from "@/lib/auth";

import { handleApiError } from "@/lib/api-error";

import { orderService } from "@/modules/orders/order.service";

type RouteContext = {
  params: Promise<{
    orderId: string;
  }>;
};

// POST /api/orders/[orderId]/cancel
// Customer can cancel their own eligible order
export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const user = requireAuth(request);

    const { orderId } = await context.params;

    const body = await request.json();

    const reason =
      typeof body.reason === "string"
        ? body.reason.trim()
        : "";

    if (!reason) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please provide a cancellation reason",
        },
        {
          status: 400,
        }
      );
    }

    const order =
      await orderService.getOrderById(orderId);

    // Only the order owner can cancel the order
    if (order.userId !== user.id) {
      throw new AuthorizationError(
        "You are not authorized to cancel this order"
      );
    }

    const cancelledOrder =
      await orderService.cancelOrder(
        orderId,
        reason
      );

    return NextResponse.json({
      success: true,
      message:
        "Order cancelled successfully",
      data: cancelledOrder,
    });
  } catch (error) {
    return handleApiError(
      error,
      "Failed to cancel order"
    );
  }
}