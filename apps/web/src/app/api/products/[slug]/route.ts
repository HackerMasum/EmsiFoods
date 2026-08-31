import { NextRequest, NextResponse } from "next/server";
import { productService } from "@/modules/products/product.service";
import {
  AuthenticationError,
  AuthorizationError,
  requireAdmin,
} from "@/lib/auth";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

// GET /api/products/[slug]
// Public: anyone can view a product
export async function GET(
  _request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { slug } = await params;

    const product =
      await productService.getProductBySlug(slug);

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Product not found";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 404 }
    );
  }
}

// PATCH /api/products/[slug]
// ADMIN only
export async function PATCH(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    requireAdmin(request);

    const { slug } = await params;
    const body = await request.json();

    const product =
      await productService.updateProduct(
        slug,
        body
      );

    return NextResponse.json({
      success: true,
      message:
        "Product updated successfully",
      data: product,
    });
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

// DELETE /api/products/[slug]
// ADMIN only
export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    requireAdmin(request);

    const { slug } = await params;

    await productService.deleteProduct(slug);

    return NextResponse.json({
      success: true,
      message:
        "Product deleted successfully",
    });
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