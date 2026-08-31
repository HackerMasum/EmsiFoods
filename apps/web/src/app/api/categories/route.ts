import { NextRequest, NextResponse } from "next/server";
import { categoryService } from "@/modules/categories/category.service";
import {
  AuthenticationError,
  AuthorizationError,
  requireAdmin,
} from "@/lib/auth";

// GET /api/categories
// Public: anyone can view categories
export async function GET() {
  try {
    const categories =
      await categoryService.getAllCategories();

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error(
      "Failed to fetch categories:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch categories",
      },
      { status: 500 }
    );
  }
}

// POST /api/categories
// ADMIN only
export async function POST(
  request: NextRequest
) {
  try {
    requireAdmin(request);

    const body = await request.json();

    const category =
      await categoryService.createCategory(body);

    return NextResponse.json(
      {
        success: true,
        message:
          "Category created successfully",
        data: category,
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

    console.error(
      "Failed to create category:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to create category",
      },
      { status: 400 }
    );
  }
}