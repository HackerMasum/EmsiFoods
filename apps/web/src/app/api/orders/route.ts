import { NextRequest, NextResponse } from "next/server";
import { orderService } from "@/modules/orders/order.service";
import { requireAuth } from "@/lib/auth";
import { handleApiError } from "@/lib/api-error";
import type {
  CheckoutInput,
  GetOrdersQuery,
  OrderStatus,
} from "@/modules/orders/order.types";

const VALID_ORDER_STATUSES: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

function parsePositiveInteger(
  value: string | null,
  defaultValue: number,
  maxValue: number
) {
  if (!value) {
    return defaultValue;
  }

  const number = Number(value);

  if (
    !Number.isInteger(number) ||
    number < 1
  ) {
    throw new Error(
      "Pagination values must be positive integers"
    );
  }

  return Math.min(number, maxValue);
}

// GET /api/orders
// CUSTOMER / WORKER -> own orders
// ADMIN -> all orders with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const user = requireAuth(request);

    // Non-admin users can only see their own orders
    if (user.role !== "ADMIN") {
      const orders =
        await orderService.getOrdersByUserId(user.id);

      return NextResponse.json({
        success: true,
        data: orders,
      });
    }

    // ADMIN can see all orders
    const { searchParams } = new URL(request.url);

    const page = parsePositiveInteger(
      searchParams.get("page"),
      1,
      100000
    );

    const limit = parsePositiveInteger(
      searchParams.get("limit"),
      10,
      100
    );

    const statusParam =
      searchParams.get("status");

    if (
      statusParam &&
      !VALID_ORDER_STATUSES.includes(
        statusParam as OrderStatus
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid order status",
        },
        { status: 400 }
      );
    }

    const search = searchParams
      .get("search")
      ?.trim();

    const query: GetOrdersQuery = {
      page,
      limit,
      ...(statusParam
        ? {
            status:
              statusParam as OrderStatus,
          }
        : {}),
      ...(search ? { search } : {}),
    };

    const result =
      await orderService.getAllOrders(query);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    return handleApiError(
      error,
      "Failed to fetch orders"
    );
  }
}

// POST /api/orders
// Checkout for the currently authenticated user
export async function POST(request: NextRequest) {
  try {
    const user = requireAuth(request);

    const body =
      (await request.json()) as Omit<
        CheckoutInput,
        "userId"
      >;

    if (
      !body.customerName ||
      !body.phone ||
      !body.address
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "customerName, phone and address are required",
        },
        { status: 400 }
      );
    }

    const order =
      await orderService.checkout({
        ...body,
        userId: user.id,
      });

    return NextResponse.json(
      {
        success: true,
        message:
          "Order created successfully",
        data: order,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(
      error,
      "Failed to create order"
    );
  }
}