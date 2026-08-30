import { NextResponse } from "next/server";
import { invoiceService } from "@/modules/invoices/invoice.service";

type RouteContext = {
  params: Promise<{
    orderId: string;
  }>;
};

// Public invoice verification endpoint
export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const { orderId } = await context.params;

    const invoice =
      await invoiceService.getInvoiceByOrderId(orderId);

    if (!invoice) {
      return NextResponse.json(
        {
          success: false,
          message: "Invoice not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      data: invoice,
    });
  } catch (error) {
    console.error("Invoice verification error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to verify invoice",
      },
      {
        status: 500,
      }
    );
  }
}