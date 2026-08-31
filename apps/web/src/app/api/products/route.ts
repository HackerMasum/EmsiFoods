import { NextRequest, NextResponse } from "next/server";
import { productService } from "@/modules/products/product.service";
import {
  AuthenticationError,
  AuthorizationError,
  requireAdmin,
} from "@/lib/auth";

// GET /api/products
// Public: anyone can browse products
export async function GET() {
  try {
    const products =
      await productService.getAllProducts();

    return NextResponse.json({
      success: true,
      data: products,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch products",
      },
      { status: 500 }
    );
  }
}

// POST /api/products
// ADMIN only
export async function POST(
  request: NextRequest
) {
  try {
    requireAdmin(request);

    const body = await request.json();

    const product =
      await productService.createProduct(body);

    return NextResponse.json(
      {
        success: true,
        message:
          "Product created successfully",
        data: product,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        { status: 401 }
      );
    }

    if (error instanceof AuthorizationError) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        { status: 403 }
      );
    }

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