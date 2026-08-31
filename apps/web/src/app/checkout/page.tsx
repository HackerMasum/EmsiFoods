"use client";

import Link from "next/link";
import {
  ArrowLeft,
  CreditCard,
  Loader2,
  MapPin,
  ShoppingBag,
  Truck,
  User,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { parsePhoneNumberFromString } from "libphonenumber-js";

type CartItem = {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    image: string | null;
  };
};

type Cart = {
  id: string;
  items: CartItem[];
};

function validatePhoneNumber(phone: string): string | null {
  const trimmedPhone = phone.trim();

  if (!trimmedPhone) {
    return "Phone number is required.";
  }

  if (!trimmedPhone.startsWith("+")) {
    return "Please include your country code. Example: +8801712345678";
  }

  const phoneNumber = parsePhoneNumberFromString(trimmedPhone);

  if (!phoneNumber || !phoneNumber.isValid()) {
    return "Please enter a valid international phone number.";
  }

  return null;
}

export default function CheckoutPage() {
  const router = useRouter();

  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] =
    useState("CASH_ON_DELIVERY");

  const fetchCart = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
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
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load checkout"
      );
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void fetchCart();
  }, [fetchCart]);

  function handlePhoneChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const value = event.target.value;

    // Allow only + and numbers
    const sanitizedValue = value.replace(/[^\d+]/g, "");

    // Prevent multiple + signs
    const normalizedValue =
      sanitizedValue.startsWith("+")
        ? `+${sanitizedValue.slice(1).replace(/\+/g, "")}`
        : sanitizedValue.replace(/\+/g, "");

    setPhone(normalizedValue);

    if (phoneError) {
      setPhoneError(null);
    }
  }

  function handlePhoneBlur() {
    if (!phone.trim()) {
      return;
    }

    const validationError = validatePhoneNumber(phone);

    setPhoneError(validationError);
  }

  async function handleCheckout(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const validationError = validatePhoneNumber(phone);

    if (validationError) {
      setPhoneError(validationError);
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      const phoneNumber =
        parsePhoneNumberFromString(phone.trim());

      const normalizedPhone =
        phoneNumber?.number || phone.trim();

      const response = await fetch(
        "/api/orders/checkout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            customerName: customerName.trim(),
            phone: normalizedPhone,
            address: address.trim(),
            paymentMethod,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to place order"
        );
      }

      router.push(`/orders/${result.data.id}`);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to place order"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const subtotal =
    cart?.items.reduce(
      (total, item) =>
        total +
        Number(item.product.price) * item.quantity,
      0
    ) ?? 0;

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-16">
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
          <ShoppingBag className="mx-auto h-12 w-12 text-blue-600" />

          <h1 className="mt-5 text-2xl font-bold text-slate-950">
            Your cart is empty
          </h1>

          <p className="mt-3 text-slate-500">
            Add some products before proceeding to checkout.
          </p>

          <Link
            href="/"
            className="mt-6 inline-flex rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Cart
        </Link>

        <div className="mt-6">
          <h1 className="text-3xl font-bold text-slate-950 sm:text-4xl">
            Checkout
          </h1>

          <p className="mt-2 text-slate-500">
            Complete your delivery information and place your order.
          </p>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
          <form
            onSubmit={handleCheckout}
            className="space-y-6"
          >
            {/* Customer Information */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-blue-50 p-3">
                  <User className="h-5 w-5 text-blue-600" />
                </div>

                <div>
                  <h2 className="font-bold text-slate-950">
                    Customer Information
                  </h2>

                  <p className="text-sm text-slate-500">
                    Tell us who will receive the order.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-5">
                <div>
                  <label className="text-sm font-semibold text-slate-700">
                    Full Name
                  </label>

                  <input
                    required
                    value={customerName}
                    onChange={(event) =>
                      setCustomerName(event.target.value)
                    }
                    placeholder="Enter your full name"
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700">
                    Phone Number
                  </label>

                  <input
                    required
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={phone}
                    onChange={handlePhoneChange}
                    onBlur={handlePhoneBlur}
                    placeholder="+8801712345678"
                    className={`mt-2 w-full rounded-xl border px-4 py-3 outline-none transition focus:ring-4 ${
                      phoneError
                        ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                        : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
                    }`}
                  />

                  {phoneError ? (
                    <p className="mt-2 text-sm text-red-600">
                      {phoneError}
                    </p>
                  ) : (
                    <p className="mt-2 text-xs text-slate-500">
                      Enter your phone number with country code.
                      Example: +8801712345678
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Delivery Address */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-blue-50 p-3">
                  <MapPin className="h-5 w-5 text-blue-600" />
                </div>

                <div>
                  <h2 className="font-bold text-slate-950">
                    Delivery Address
                  </h2>

                  <p className="text-sm text-slate-500">
                    Where should we deliver your order?
                  </p>
                </div>
              </div>

              <textarea
                required
                rows={4}
                value={address}
                onChange={(event) =>
                  setAddress(event.target.value)
                }
                placeholder="House, road, area, district..."
                className="mt-6 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </section>

            {/* Payment Method */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-blue-50 p-3">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                </div>

                <div>
                  <h2 className="font-bold text-slate-950">
                    Payment Method
                  </h2>

                  <p className="text-sm text-slate-500">
                    Choose how you want to pay.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-3">
                <label className="flex cursor-pointer items-center gap-4 rounded-xl border border-blue-200 bg-blue-50 p-4">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="CASH_ON_DELIVERY"
                    checked={
                      paymentMethod ===
                      "CASH_ON_DELIVERY"
                    }
                    onChange={(event) =>
                      setPaymentMethod(event.target.value)
                    }
                  />

                  <Truck className="h-5 w-5 text-blue-600" />

                  <div>
                    <p className="font-semibold text-slate-900">
                      Cash on Delivery
                    </p>

                    <p className="text-sm text-slate-500">
                      Pay when your order arrives.
                    </p>
                  </div>
                </label>

                <label className="flex cursor-pointer items-center gap-4 rounded-xl border border-slate-200 p-4 opacity-60">
                  <input
                    type="radio"
                    disabled
                  />

                  <CreditCard className="h-5 w-5 text-slate-500" />

                  <div>
                    <p className="font-semibold text-slate-900">
                      Online Payment
                    </p>

                    <p className="text-sm text-slate-500">
                      Coming soon.
                    </p>
                  </div>
                </label>
              </div>
            </section>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-4 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Placing Order...
                </>
              ) : (
                "Place Order"
              )}
            </button>
          </form>

          {/* Order Summary */}
          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
            <h2 className="text-xl font-bold text-slate-950">
              Order Summary
            </h2>

            <div className="mt-6 space-y-4">
              {cart.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between gap-4 text-sm"
                >
                  <div>
                    <p className="font-medium text-slate-800">
                      {item.product.name}
                    </p>

                    <p className="mt-1 text-slate-500">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <p className="font-semibold text-slate-900">
                    ৳{" "}
                    {(
                      Number(item.product.price) *
                      item.quantity
                    ).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-slate-200 pt-5">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>

                <span>
                  ৳ {subtotal.toLocaleString()}
                </span>
              </div>

              <div className="mt-4 flex justify-between text-lg font-bold text-slate-950">
                <span>Total</span>

                <span>
                  ৳ {subtotal.toLocaleString()}
                </span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}