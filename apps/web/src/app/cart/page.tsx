"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

type CartItem = {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    image: string | null;
    isActive: boolean;
  };
};

type Cart = {
  id: string;
  items: CartItem[];
};

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingProductId, setUpdatingProductId] =
    useState<string | null>(null);

  const fetchCart = useCallback(async () => {
    try {
      setIsLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        window.location.href = "/login";
        return;
      }

      const response = await fetch("/api/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to load cart"
        );
      }

      setCart(result.data);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchCart();
  }, [fetchCart]);

  async function updateQuantity(
    productId: string,
    quantity: number
  ) {
    if (quantity <= 0) {
      return;
    }

    try {
      setUpdatingProductId(productId);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `/api/cart/items/${productId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ quantity }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to update cart"
        );
      }

      setCart(result.data);
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Failed to update cart"
      );
    } finally {
      setUpdatingProductId(null);
    }
  }

  async function removeItem(productId: string) {
    try {
      setUpdatingProductId(productId);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `/api/cart/items/${productId}`,
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
          result.message || "Failed to remove product"
        );
      }

      setCart(result.data);
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Failed to remove product"
      );
    } finally {
      setUpdatingProductId(null);
    }
  }

  const subtotal =
    cart?.items.reduce(
      (total, item) =>
        total +
        Number(item.product.price) * item.quantity,
      0
    ) ?? 0;

  const totalItems =
    cart?.items.reduce(
      (total, item) => total + item.quantity,
      0
    ) ?? 0;

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto flex max-w-7xl justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </main>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-16">
        <div className="mx-auto max-w-lg rounded-3xl bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">
            <ShoppingBag className="h-10 w-10 text-blue-600" />
          </div>

          <h1 className="mt-6 text-2xl font-bold text-slate-950">
            Your cart is empty
          </h1>

          <p className="mt-3 text-slate-500">
            Looks like you haven't added any delicious
            products yet.
          </p>

          <Link
            href="/"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Link>

          <h1 className="mt-4 text-3xl font-bold text-slate-950 sm:text-4xl">
            Shopping Cart
          </h1>

          <p className="mt-2 text-slate-500">
            {totalItems} item{totalItems !== 1 ? "s" : ""} in
            your cart
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <section className="space-y-4">
            {cart.items.map((item) => {
              const isUpdating =
                updatingProductId === item.product.id;

              return (
                <article
                  key={item.id}
                  className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5"
                >
                  <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-blue-50 text-4xl">
                    {item.product.image ? (
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      "🍯"
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between gap-3">
                      <div>
                        <Link
                          href={`/products/${item.product.slug}`}
                          className="font-bold text-slate-900 transition hover:text-blue-600"
                        >
                          {item.product.name}
                        </Link>

                        <p className="mt-1 text-sm text-slate-500">
                          ৳{" "}
                          {Number(
                            item.product.price
                          ).toLocaleString()}{" "}
                          each
                        </p>
                      </div>

                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() =>
                          void removeItem(
                            item.product.id
                          )
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="mt-5 flex items-end justify-between gap-4">
                      <div className="flex items-center rounded-xl border border-slate-200">
                        <button
                          type="button"
                          disabled={
                            isUpdating ||
                            item.quantity <= 1
                          }
                          onClick={() =>
                            void updateQuantity(
                              item.product.id,
                              item.quantity - 1
                            )
                          }
                          className="flex h-9 w-9 items-center justify-center transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Minus className="h-4 w-4" />
                        </button>

                        <span className="flex h-9 w-10 items-center justify-center text-sm font-semibold">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() =>
                            void updateQuantity(
                              item.product.id,
                              item.quantity + 1
                            )
                          }
                          className="flex h-9 w-9 items-center justify-center transition hover:bg-slate-50 disabled:opacity-40"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      <p className="text-lg font-bold text-slate-900">
                        ৳{" "}
                        {(
                          Number(item.product.price) *
                          item.quantity
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>

          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950">
              Order Summary
            </h2>

            <div className="mt-6 space-y-4 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>
                  ৳ {subtotal.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Delivery</span>
                <span>Calculated at checkout</span>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <div className="flex justify-between text-lg font-bold text-slate-950">
                  <span>Total</span>
                  <span>
                    ৳ {subtotal.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <Link
              href="/checkout"
              className="mt-6 flex w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white transition hover:bg-blue-700"
            >
              Proceed to Checkout
            </Link>

            <p className="mt-4 text-center text-xs leading-5 text-slate-400">
              Secure checkout. Payment options will be
              available on the next step.
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}