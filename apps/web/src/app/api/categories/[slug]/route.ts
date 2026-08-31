import { NextRequest, NextResponse } from "next/server";
import { categoryService } from "@/modules/categories/category.service";
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

// GET /api/categories/[slug]
// Public: anyone can view a category
export async function GET(
  _request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { slug } = await params;

    const category =
      await categoryService.getCategoryBySlug(slug);

    return NextResponse.json({
      success: true,
      data: category,
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

// PATCH /api/categories/[slug]
// ADMIN only
export async function PATCH(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    requireAdmin(request);

    const { slug } = await params;
    const body = await request.json();

    const category =
      await categoryService.updateCategory(
        slug,
        body
      );

    return NextResponse.json({
      success: true,
      message:
        "Category updated successfully",
      data: category,
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

// DELETE /api/categories/[slug]
// ADMIN only
export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    requireAdmin(request);

    const { slug } = await params;

    await categoryService.deleteCategory(slug);

    return NextResponse.json({
      success: true,
      message:
        "Category deleted successfully",
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