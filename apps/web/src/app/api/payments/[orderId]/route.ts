import { NextRequest, NextResponse } from "next/server";
import { paymentService } from "@/modules/payments/payment.service";
import type {
  PaymentStatus,
  UpdatePaymentStatusInput,
} from "@/modules/payments/payment.types";
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

// GET /api/payments/[orderId]
// CUSTOMER -> own payment
// ADMIN -> any payment
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const user = requireAuth(request);

    const { orderId } = await context.params;

    const payment =
      await paymentService.getPaymentByOrderId(orderId);

    // Non-admin users can only view payments
    // that belong to their own orders.
    if (
      user.role !== "ADMIN" &&
      payment.order.userId !== user.id
    ) {
      throw new AuthorizationError(
        "You are not authorized to view this payment"
      );
    }

    return NextResponse.json({
      success: true,
      data: payment,
    });
  } catch (error) {
    return handleApiError(
      error,
      "Failed to fetch payment"
    );
  }
}

// PATCH /api/payments/[orderId]
// Only ADMIN can update payment status
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    requireAdmin(request);

    const { orderId } = await context.params;

    const body =
      (await request.json()) as UpdatePaymentStatusInput;

    if (!body.status) {
      return NextResponse.json(
        {
          success: false,
          message: "Payment status is required",
        },
        { status: 400 }
      );
    }

    const payment =
      await paymentService.updatePaymentStatus(
        orderId,
        body.status as PaymentStatus,
        body.transactionId
      );

    return NextResponse.json({
      success: true,
      message:
        "Payment status updated successfully",
      data: payment,
    });
  } catch (error) {
    return handleApiError(
      error,
      "Failed to update payment status"
    );
  }
}