```ts
import { NextRequest, NextResponse } from "next/server";
import { orderService } from "@/modules/orders/order.service";
import type { OrderStatus } from "@/modules/orders/order.types";

type RouteContext = {
  params: Promise<{
    orderId: string;
  }>;
};

// GET /api/orders/:orderId
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { orderId } = await context.params;

    const order = await orderService.getOrderById(orderId);

    return NextResponse.json({
      success: true,
      data: order,
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
      { status: 404 }
    );
  }
}

// PATCH /api/orders/:orderId
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { orderId } = await context.params;

    const body = (await request.json()) as {
      status?: OrderStatus;
    };

    if (!body.status) {
      return NextResponse.json(
        {
          success: false,
          message: "Order status is required",
        },
        { status: 400 }
      );
    }

    const order = await orderService.updateOrderStatus(
      orderId,
      body.status
    );

    return NextResponse.json({
      success: true,
      message: "Order status updated successfully",
      data: order,
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
```
