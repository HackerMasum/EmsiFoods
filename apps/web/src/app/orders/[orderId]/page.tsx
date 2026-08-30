"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  getCustomerOrderById,
} from "@/features/customer-orders/customer-order.api";

import type {
  CustomerOrder,
} from "@/features/customer-orders/customer-order.types";

import {
  OrderDetails,
} from "@/features/customer-orders/components/order-details";

export default function OrderDetailsPage() {
  const params = useParams();

  const orderId =
    typeof params.orderId === "string"
      ? params.orderId
      : "";

  const [order, setOrder] =
    useState<CustomerOrder | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const fetchOrder = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token =
        localStorage.getItem("token");

      if (!token) {
        throw new Error(
          "You must be logged in to view this order"
        );
      }

      const orderData =
        await getCustomerOrderById(
          orderId,
          token
        );

      setOrder(orderData);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load order"
      );
    } finally {
      setIsLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    if (!orderId) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      void fetchOrder();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [orderId, fetchOrder]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="animate-pulse rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="h-5 w-32 rounded bg-gray-200" />

            <div className="mt-5 h-10 w-72 max-w-full rounded bg-gray-200" />

            <div className="mt-4 h-4 w-48 rounded bg-gray-100" />

            <div className="mt-8 space-y-4">
              <div className="h-20 rounded-xl bg-gray-100" />
              <div className="h-20 rounded-xl bg-gray-100" />
              <div className="h-20 rounded-xl bg-gray-100" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-xl font-bold text-red-600">
              !
            </div>

            <h1 className="mt-5 text-xl font-bold text-red-950">
              Unable to load order
            </h1>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-red-700">
              {error}
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  void fetchOrder();
                }}
                className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/25 active:scale-[0.98]"
              >
                Try again
              </button>

              <Link
                href="/orders"
                className="rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:border-gray-400 hover:bg-gray-50"
              >
                Back to orders
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-xl font-bold text-gray-500">
              ?
            </div>

            <h1 className="mt-5 text-xl font-bold text-gray-950">
              Order not found
            </h1>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              The order you are looking for does not
              exist or is no longer available.
            </p>

            <Link
              href="/orders"
              className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/25 active:scale-[0.98]"
            >
              Back to orders
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Link
              href="/orders"
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-blue-600"
            >
              <span aria-hidden="true">←</span>
              Back to orders
            </Link>

            <div className="mt-5">
              <p className="text-sm font-semibold text-blue-600">
                CUSTOMER ORDER
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
                Order Details
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500 sm:text-base">
                Track your order progress and view complete
                delivery and payment information.
              </p>
            </div>
          </div>

          <Link
            href={`/invoices/${order.id}`}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/25 active:scale-[0.98]"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 2h8l4 4v16H6V2Z"
              />

              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14 2v5h5"
              />

              <path
                strokeLinecap="round"
                d="M9 13h6M9 17h6"
              />
            </svg>

            View Invoice
          </Link>
        </div>

        <OrderDetails order={order} />
      </div>
    </main>
  );
}