"use client";

import { useState } from "react";
import { Check, Loader2, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

type AddToCartButtonProps = {
  productId: string;
  disabled?: boolean;
};

export function AddToCartButton({
  productId,
  disabled = false,
}: AddToCartButtonProps) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleAddToCart() {
    if (disabled || isLoading) {
      return;
    }

    try {
      setIsLoading(true);
      setMessage(null);
      setIsSuccess(false);

      const token = localStorage.getItem("token");

      if (!token) {
        setMessage("Please login to add products to your cart.");

        setTimeout(() => {
          router.push("/login");
        }, 800);

        return;
      }

      const response = await fetch("/api/cart/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId,
          quantity: 1,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to add product to cart."
        );
      }

      setIsSuccess(true);
      setMessage("Added to cart successfully!");

      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      setIsSuccess(false);

      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-4 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Adding to Cart...
          </>
        ) : isSuccess ? (
          <>
            <Check className="h-5 w-5" />
            Added to Cart
          </>
        ) : (
          <>
            <ShoppingCart className="h-5 w-5" />
            Add to Cart
          </>
        )}
      </button>

      {message && (
        <div
          role="status"
          aria-live="polite"
          className={`rounded-lg px-3 py-2 text-center text-sm font-medium ${
            isSuccess
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      {isSuccess && (
        <button
          type="button"
          onClick={() => router.push("/cart")}
          className="w-full text-center text-sm font-semibold text-blue-600 transition hover:text-blue-700 hover:underline"
        >
          View Cart →
        </button>
      )}
    </div>
  );
}