"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Loader2,
  PackageOpen,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Tag,
} from "lucide-react";

type Category = {
  id: string;
  name: string;
  slug: string;
};

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: string | number;
  stock: number;
  image: string | null;
  isActive: boolean;
  categoryId: string;
  category: Category;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      try {
        setIsLoading(true);
        setMessage("");

        const response = await fetch("/api/products");
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Failed to load products"
          );
        }

        setProducts(result.data || []);
      } catch (error) {
        setMessage(
          error instanceof Error
            ? error.message
            : "Failed to load products"
        );
      } finally {
        setIsLoading(false);
      }
    }

    void fetchProducts();
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = new Map<string, Category>();

    products.forEach((product) => {
      if (product.category) {
        uniqueCategories.set(
          product.category.id,
          product.category
        );
      }
    });

    return Array.from(uniqueCategories.values());
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        product.description
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        product.category.name
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" ||
        product.category.slug === selectedCategory;

      return (
        matchesSearch &&
        matchesCategory &&
        product.isActive
      );
    });
  }, [products, search, selectedCategory]);

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                <ShoppingBag className="h-3.5 w-3.5" />
                FRESH & QUALITY PRODUCTS
              </div>

              <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                Fresh groceries,
                <span className="block text-emerald-600">
                  delivered to your door.
                </span>
              </h1>

              <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">
                Discover fresh fruits, vegetables, meat, fish,
                dairy, bakery items and everyday essentials from
                EmsiFoods.
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-6 py-5">
              <p className="text-sm font-medium text-emerald-700">
                Available Products
              </p>

              <p className="mt-1 text-3xl font-bold text-emerald-900">
                {products.length}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search products..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                <SlidersHorizontal className="h-4 w-4" />
                Category
              </div>

              <select
                value={selectedCategory}
                onChange={(event) =>
                  setSelectedCategory(event.target.value)
                }
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10"
              >
                <option value="all">
                  All Categories
                </option>

                {categories.map((category) => (
                  <option
                    key={category.id}
                    value={category.slug}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Result Info */}
        <div className="mt-8 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Our Products
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Showing {filteredProducts.length} product
              {filteredProducts.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Error */}
        {message && (
          <div className="mt-6 rounded-xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-700">
            {message}
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="flex min-h-96 items-center justify-center">
            <div className="text-center">
              <Loader2 className="mx-auto h-9 w-9 animate-spin text-emerald-600" />

              <p className="mt-4 text-sm text-slate-500">
                Loading fresh products...
              </p>
            </div>
          </div>
        )}

        {/* Empty */}
        {!isLoading &&
          !message &&
          filteredProducts.length === 0 && (
            <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                <PackageOpen className="h-8 w-8 text-slate-400" />
              </div>

              <h3 className="mt-5 text-xl font-bold text-slate-900">
                No products found
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Try changing your search or selecting another
                category.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("all");
                }}
                className="mt-6 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Reset Filters
              </button>
            </div>
          )}

        {/* Product Grid */}
        {!isLoading && filteredProducts.length > 0 && (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <article
                key={product.id}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Image */}
                <Link
                  href={`/products/${product.slug}`}
                  className="relative block aspect-square overflow-hidden bg-slate-100"
                >
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <PackageOpen className="h-14 w-14 text-slate-300" />
                    </div>
                  )}

                  {product.stock <= 0 && (
                    <span className="absolute left-3 top-3 rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">
                      Out of Stock
                    </span>
                  )}

                  {product.stock > 0 && product.stock <= 5 && (
                    <span className="absolute left-3 top-3 rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-white">
                      Only {product.stock} left
                    </span>
                  )}
                </Link>

                {/* Content */}
                <div className="p-5">
                  <Link
                    href={`/categories/${product.category.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-emerald-600 transition hover:text-emerald-700"
                  >
                    <Tag className="h-3.5 w-3.5" />
                    {product.category.name}
                  </Link>

                  <Link href={`/products/${product.slug}`}>
                    <h3 className="mt-3 line-clamp-1 text-lg font-bold text-slate-900 transition group-hover:text-emerald-600">
                      {product.name}
                    </h3>
                  </Link>

                  <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-slate-500">
                    {product.description ||
                      "Fresh quality product from EmsiFoods."}
                  </p>

                  <div className="mt-5 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs text-slate-400">
                        Price
                      </p>

                      <p className="mt-1 text-xl font-bold text-slate-950">
                        ৳{Number(product.price).toLocaleString("en-BD")}
                      </p>
                    </div>

                    <Link
                      href={`/products/${product.slug}`}
                      className="inline-flex items-center gap-1 rounded-xl bg-slate-900 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600"
                    >
                      View
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>

                  <div className="mt-4 border-t border-slate-100 pt-3">
                    <span
                      className={`text-xs font-medium ${
                        product.stock > 0
                          ? "text-emerald-600"
                          : "text-red-500"
                      }`}
                    >
                      {product.stock > 0
                        ? `${product.stock} items available`
                        : "Currently unavailable"}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}