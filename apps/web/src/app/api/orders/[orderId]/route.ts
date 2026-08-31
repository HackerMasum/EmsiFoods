import { NextRequest, NextResponse } from "next/server";
import { orderService } from "@/modules/orders/order.service";
import type { UpdateOrderStatusInput } from "@/modules/orders/order.types";
import {
  AuthorizationError,
  requireAdmin,
  requireAuth,
} from "@/lib/auth";
import { handleApiError } from "@/lib/api-error";

type RouteContext = {
  params: Promise<{
    orderId: string;
  }>;
};

// GET /api/orders/[orderId]
// Customer -> own order
// ADMIN -> any order
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const user = requireAuth(request);
    const { orderId } = await context.params;

    const order =
      await orderService.getOrderById(orderId);

    if (
      user.role !== "ADMIN" &&
      order.userId !== user.id
    ) {
      throw new AuthorizationError(
        "You are not authorized to view this order"
      );
    }

    return NextResponse.json({
      success: true,
      data: order,
    });
  } catch (error) {
    return handleApiError(
      error,
      "Failed to fetch order"
    );
  }
}

// PATCH /api/orders/[orderId]
// ADMIN only -> update order status
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    requireAdmin(request);

    const { orderId } = await context.params;

    const body =
      (await request.json()) as UpdateOrderStatusInput;

    if (!body.status) {
      return NextResponse.json(
        {
          success: false,
          message: "Order status is required",
        },
        { status: 400 }
      );
    }

    const order =
      await orderService.updateOrderStatus(
        orderId,
        body.status
      );

    return NextResponse.json({
      success: true,
      message:
        "Order status updated successfully",
      data: order,
    });
  } catch (error) {
    return handleApiError(
      error,
      "Failed to update order status"
    );
  }
}