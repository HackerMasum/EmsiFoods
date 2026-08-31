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

    const order =
      await orderService.getOrderById(orderId);

    // Only the order owner can cancel the order
    if (order.userId !== user.id) {
      throw new AuthorizationError(
        "You are not authorized to cancel this order"
      );
    }

    // Customers can only cancel orders that have not
    // entered processing or shipping.
    if (
      order.status !== "PENDING" &&
      order.status !== "CONFIRMED"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This order can no longer be cancelled",
        },
        {
          status: 400,
        }
      );
    }

    const cancelledOrder =
      await orderService.updateOrderStatus(
        orderId,
        "CANCELLED"
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