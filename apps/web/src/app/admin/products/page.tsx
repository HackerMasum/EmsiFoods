"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Box,
  Loader2,
  Package,
  Pencil,
  Plus,
  Search,
  Tag,
} from "lucide-react";

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  image: string | null;
  isActive: boolean;
  category?: {
    name: string;
    slug: string;
  } | null;
};

export default function AdminProductsPage() {
  const [products, setProducts] =
    useState<Product[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response =
          await fetch("/api/products");

        const result =
          await response.json();

        if (
          response.ok &&
          result.success
        ) {
          setProducts(result.data || []);
        }
      } catch (error) {
        console.error(
          "Failed to load products:",
          error
        );
      } finally {
        setIsLoading(false);
      }
    }

    void fetchProducts();
  }, []);

  const filteredProducts =
    products.filter((product) =>
      product.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  return (
    <div className="min-h-screen p-6 lg:p-10">
      {/* Header */}
      <div className="fade-in flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600">
            <Package className="h-3.5 w-3.5" />
            PRODUCT MANAGEMENT
          </div>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Products
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
            Manage your EmsiFoods product catalog,
            pricing and availability.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:-translate-y-0.5 hover:shadow-xl"
        >
          <Plus className="h-4 w-4" />
          Add Product
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
            placeholder="Search products..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
          />
        </div>
      </div>

      {/* Products */}
      <div className="mt-6">
        {isLoading ? (
          <div className="flex min-h-80 items-center justify-center">
            <div className="text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600" />

              <p className="mt-4 text-sm text-slate-500">
                Loading products...
              </p>
            </div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="slide-up rounded-2xl border border-dashed border-blue-200 bg-white/70 px-6 py-20 text-center shadow-sm backdrop-blur-xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
              <Box className="h-8 w-8 text-blue-600" />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              {search
                ? "No products found"
                : "No products yet"}
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              {search
                ? "Try searching with a different product name."
                : "Start building your EmsiFoods catalog by adding your first delicious product."}
            </p>

            {!search && (
              <Link
                href="/admin/products/new"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                Add Your First Product
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => (
              <article
                key={product.id}
                className="card-hover group overflow-hidden rounded-2xl border border-white/70 bg-white/80 shadow-sm backdrop-blur-xl"
              >
                {/* Image */}
                <div className="relative flex h-48 items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 to-sky-50">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <Package className="h-14 w-14 text-blue-300" />
                  )}

                  <span
                    className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${
                      product.isActive
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {product.isActive
                      ? "Active"
                      : "Inactive"}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5">
                  {product.category && (
                    <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-blue-600">
                      <Tag className="h-3.5 w-3.5" />
                      {product.category.name}
                    </div>
                  )}

                  <h2 className="mt-3 text-lg font-bold text-slate-900">
                    {product.name}
                  </h2>

                  <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-slate-500">
                    {product.description ||
                      "No description available."}
                  </p>

                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                    {/* Price */}
                    <div>
                      <p className="text-xs text-slate-400">
                        Price
                      </p>

                      <p className="mt-1 text-xl font-bold text-slate-900">
                        ৳{" "}
                        {Number(
                          product.price
                        ).toLocaleString()}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/products/${product.slug}/edit`}
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 transition hover:bg-amber-500 hover:text-white"
                        title="Edit Product"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>

                      <Link
                        href={`/products/${product.slug}`}
                        target="_blank"
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition hover:bg-blue-600 hover:text-white"
                        title="View Product"
                      >
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
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