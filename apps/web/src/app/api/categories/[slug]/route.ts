import { NextRequest, NextResponse } from "next/server";
import { categoryService } from "@/modules/categories/category.service";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

// GET /api/categories/[slug]
export async function GET(
  _request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { slug } = await params;

    const category = await categoryService.getCategoryBySlug(slug);

    return NextResponse.json({
      success: true,
      data: category,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 404 }
    );
  }
}

// PATCH /api/categories/[slug]
export async function PATCH(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { slug } = await params;
    const body = await request.json();

    const category = await categoryService.updateCategory(slug, body);

    return NextResponse.json({
      success: true,
      message: "Category updated successfully",
      data: category,
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

// DELETE /api/categories/[slug]
export async function DELETE(
  _request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { slug } = await params;

    await categoryService.deleteCategory(slug);

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 404 }
    );
  }
}