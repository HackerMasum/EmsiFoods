import { NextRequest, NextResponse } from "next/server";
import { invoiceService } from "@/modules/invoices/invoice.service";
import { invoiceRepository } from "@/modules/invoices/invoice.repository";
import { requireAuth } from "@/lib/auth";
import { handleApiError } from "@/lib/api-error";

type RouteContext = {
  params: Promise<{
    orderId: string;
  }>;
};

// GET /api/invoices/[orderId]
// CUSTOMER -> own invoice only
// WORKER / ADMIN -> any invoice
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const user = requireAuth(request);

    const { orderId } = await context.params;

    const order =
      await invoiceRepository.findOrderForInvoice(
        orderId
      );

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message: "Order not found",
        },
        { status: 404 }
      );
    }

    // Customers can only access their own invoice
    if (
      user.role === "CUSTOMER" &&
      order.userId !== user.id
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You are not authorized to view this invoice",
        },
        { status: 403 }
      );
    }

    const invoice =
      await invoiceService.getInvoiceByOrderId(
        orderId
      );

    return NextResponse.json({
      success: true,
      data: invoice,
    });
  } catch (error) {
    return handleApiError(
      error,
      "Failed to fetch invoice"
    );
  }
}