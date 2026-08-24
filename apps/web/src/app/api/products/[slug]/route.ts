import { NextRequest, NextResponse } from "next/server";
import { productService } from "@/modules/products/product.service";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

// GET /api/products/[slug]
export async function GET(
  _request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { slug } = await params;

    const product = await productService.getProductBySlug(slug);

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Product not found";

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
export async function PATCH(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { slug } = await params;
    const body = await request.json();

    const product = await productService.updateProduct(slug, body);

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";

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
export async function DELETE(
  _request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { slug } = await params;

    await productService.deleteProduct(slug);

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 400 }
    );
  }
}