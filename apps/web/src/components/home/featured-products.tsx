"use client";

import Link from "next/link";
import {
  ArrowRight,
  Check,
  Loader2,
  ShoppingCart,
  Star,
} from "lucide-react";
import { useEffect, useState } from "react";

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
  };
};

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [addingProductId, setAddingProductId] =
    useState<string | null>(null);

  const [addedProductId, setAddedProductId] =
    useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("/api/products");
        const result = await response.json();

        if (result.success) {
          setProducts(
            result.data
              .filter(
                (product: Product) =>
                  product.isActive
              )
              .slice(0, 6)
          );
        }
      } catch (error) {
        console.error(
          "Failed to fetch products:",
          error
        );
      } finally {
        setIsLoading(false);
      }
    }

    void fetchProducts();
  }, []);

  async function handleAddToCart(
    productId: string
  ) {
    try {
      setAddingProductId(productId);
      setAddedProductId(null);

      const token =
        localStorage.getItem("token");

      if (!token) {
        alert(
          "Please login first to add products to your cart."
        );

        window.location.href = "/login";
        return;
      }

      const response = await fetch(
        "/api/cart/items",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            productId,
            quantity: 1,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to add product to cart"
        );
      }

      setAddedProductId(productId);

      window.setTimeout(() => {
        setAddedProductId(null);
      }, 2000);
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setAddingProductId(null);
    }
  }

  return (
    <section className="bg-slate-50 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Fresh & Authentic
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Featured Products
            </h2>

            <p className="mt-4 max-w-2xl text-slate-600">
              Discover our most loved homemade foods and
              authentic Bangladeshi specialties.
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
          >
            View all products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map(
              (item) => (
                <div
                  key={item}
                  className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white"
                >
                  <div className="h-52 bg-slate-200" />

                  <div className="space-y-4 p-6">
                    <div className="h-4 w-24 rounded bg-slate-200" />
                    <div className="h-6 w-3/4 rounded bg-slate-200" />
                    <div className="h-4 w-full rounded bg-slate-100" />
                    <div className="h-10 rounded-xl bg-slate-200" />
                  </div>
                </div>
              )
            )}
          </div>
        ) : products.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
              <ShoppingCart className="h-8 w-8 text-blue-600" />
            </div>

            <h3 className="mt-5 text-xl font-bold text-slate-900">
              Products coming soon
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              We are preparing delicious products for you.
              Please check back soon.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => {
              const isAdding =
                addingProductId === product.id;

              const isAdded =
                addedProductId === product.id;

              return (
                <article
                  key={product.id}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <Link
                    href={`/products/${product.slug}`}
                    className="block"
                  >
                    <div className="flex h-52 items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100 text-6xl">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        "🍯"
                      )}
                    </div>
                  </Link>

                  <div className="p-6">
                    {product.category && (
                      <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                        {product.category.name}
                      </p>
                    )}

                    <Link
                      href={`/products/${product.slug}`}
                    >
                      <h3 className="mt-2 text-xl font-bold text-slate-900 transition group-hover:text-blue-600">
                        {product.name}
                      </h3>
                    </Link>

                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">
                      {product.description ||
                        "Authentic homemade food prepared with care."}
                    </p>

                    <div className="mt-5 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-400">
                          Price
                        </p>

                        <p className="text-xl font-bold text-slate-900">
                          ৳{" "}
                          {Number(
                            product.price
                          ).toLocaleString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="text-sm font-semibold">
                          Popular
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={isAdding}
                      onClick={() =>
                        void handleAddToCart(
                          product.id
                        )
                      }
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70 active:scale-[0.98]"
                    >
                      {isAdding ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Adding...
                        </>
                      ) : isAdded ? (
                        <>
                          <Check className="h-4 w-4" />
                          Added to Cart
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="h-4 w-4" />
                          Add to Cart
                        </>
                      )}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}