import { NextRequest, NextResponse } from "next/server";
import { productService } from "@/modules/products/product.service";

// GET /api/products
export async function GET() {
  try {
    const products = await productService.getAllProducts();

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
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const product = await productService.createProduct(body);

    return NextResponse.json(
      {
        success: true,
        message: "Product created successfully",
        data: product,
      },
      { status: 201 }
    );
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