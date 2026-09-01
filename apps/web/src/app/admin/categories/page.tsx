"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Edit3,
  FolderOpen,
  ImageIcon,
  Loader2,
  Plus,
  Search,
  Tag,
  Trash2,
} from "lucide-react";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  isActive: boolean;
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deletingSlug, setDeletingSlug] = useState("");
  const [message, setMessage] = useState("");

  async function fetchCategories() {
    try {
      setIsLoading(true);

      const response = await fetch("/api/categories");
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to load categories"
        );
      }

      setCategories(result.data || []);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to load categories"
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void fetchCategories();
  }, []);

  async function handleDelete(category: Category) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${category.name}"?`
    );

    if (!confirmed) return;

    const token = localStorage.getItem("token");

    if (!token) {
      setMessage(
        "Authentication token not found. Please login again."
      );
      return;
    }

    try {
      setDeletingSlug(category.slug);
      setMessage("");

      const response = await fetch(
        `/api/categories/${category.slug}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to delete category"
        );
      }

      setCategories((current) =>
        current.filter(
          (item) => item.id !== category.id
        )
      );

      setMessage("Category deleted successfully.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to delete category"
      );
    } finally {
      setDeletingSlug("");
    }
  }

  const filteredCategories = categories.filter(
    (category) =>
      category.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      category.slug
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen p-6 lg:p-10">
      {/* Header */}
      <div className="fade-in flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600">
            <Tag className="h-3.5 w-3.5" />
            CATEGORY MANAGEMENT
          </div>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Categories
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
            Organize your EmsiFoods products into categories
            for easier browsing and management.
          </p>
        </div>

        <Link
          href="/admin/categories/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:-translate-y-0.5 hover:shadow-xl"
        >
          <Plus className="h-4 w-4" />
          Add Category
        </Link>
      </div>

      {/* Search */}
      <div className="slide-up mt-8 rounded-2xl border border-white/70 bg-white/80 p-5 shadow-sm backdrop-blur-xl">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

          <input
            type="search"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search categories..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
          />
        </div>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`mt-6 rounded-xl border px-4 py-3 text-sm font-medium ${
            message.includes("successfully")
              ? "border-green-100 bg-green-50 text-green-700"
              : "border-red-100 bg-red-50 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      {/* Categories */}
      <div className="mt-6">
        {isLoading ? (
          <div className="flex min-h-80 items-center justify-center">
            <div className="text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600" />

              <p className="mt-4 text-sm text-slate-500">
                Loading categories...
              </p>
            </div>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="slide-up rounded-2xl border border-dashed border-blue-200 bg-white/70 px-6 py-20 text-center shadow-sm backdrop-blur-xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
              <FolderOpen className="h-8 w-8 text-blue-600" />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              {search
                ? "No categories found"
                : "No categories yet"}
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              {search
                ? "Try searching with a different category name."
                : "Create your first category to organize your EmsiFoods products."}
            </p>

            {!search && (
              <Link
                href="/admin/categories/new"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                Create First Category
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredCategories.map((category) => (
              <article
                key={category.id}
                className="card-hover group overflow-hidden rounded-2xl border border-white/70 bg-white/80 shadow-sm backdrop-blur-xl"
              >
                {/* Image */}
                <div className="relative flex h-44 items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 to-sky-50">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <ImageIcon className="h-12 w-12 text-blue-300" />
                  )}

                  <span
                    className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${
                      category.isActive
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {category.isActive
                      ? "Active"
                      : "Inactive"}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-blue-600">
                        <Tag className="h-3.5 w-3.5" />
                        CATEGORY
                      </div>

                      <h2 className="mt-3 text-lg font-bold text-slate-900">
                        {category.name}
                      </h2>
                    </div>

                    <Link
                      href={`/categories/${category.slug}`}
                      target="_blank"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition hover:bg-blue-600 hover:text-white"
                      title="View Category"
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </div>

                  <p className="mt-3 line-clamp-2 min-h-10 text-sm leading-5 text-slate-500">
                    {category.description ||
                      "No description available."}
                  </p>

                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                    <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
                      /{category.slug}
                    </span>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/categories/${category.slug}/edit`}
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition hover:bg-blue-600 hover:text-white"
                        title="Edit Category"
                      >
                        <Edit3 className="h-4 w-4" />
                      </Link>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(category)
                        }
                        disabled={
                          deletingSlug === category.slug
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600 transition hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                        title="Delete Category"
                      >
                        {deletingSlug === category.slug ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}