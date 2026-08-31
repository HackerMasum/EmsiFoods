"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  AlertTriangle,
  Loader2,
  X,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  cancelCustomerOrder,
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

  const [showCancelModal, setShowCancelModal] =
    useState(false);

  const [isCancelling, setIsCancelling] =
    useState(false);

  const [cancelError, setCancelError] =
    useState<string | null>(null);

  const [cancelSuccess, setCancelSuccess] =
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

  const handleCancelOrder = async () => {
    try {
      setIsCancelling(true);
      setCancelError(null);

      const token =
        localStorage.getItem("token");

      if (!token) {
        throw new Error(
          "You must be logged in to cancel this order"
        );
      }

      const cancelledOrder =
        await cancelCustomerOrder(
          orderId,
          token
        );

      setOrder(cancelledOrder);

      setShowCancelModal(false);

      setCancelSuccess(
        "Your order has been cancelled successfully."
      );
    } catch (error) {
      setCancelError(
        error instanceof Error
          ? error.message
          : "Failed to cancel order"
      );
    } finally {
      setIsCancelling(false);
    }
  };

  const canCancelOrder =
    order?.status === "PENDING" ||
    order?.status === "CONFIRMED";

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
                className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
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
              className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white"
            >
              Back to orders
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
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

            <div className="flex flex-wrap gap-3">
              <Link
                href={`/invoices/${order.id}`}
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
              >
                View Invoice
              </Link>

              {canCancelOrder && (
                <button
                  type="button"
                  onClick={() => {
                    setCancelError(null);
                    setShowCancelModal(true);
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                >
                  <X className="h-4 w-4" />
                  Cancel Order
                </button>
              )}
            </div>
          </div>

          {cancelSuccess && (
            <div className="rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-medium text-green-700">
              {cancelSuccess}
            </div>
          )}

          <OrderDetails order={order} />
        </div>
      </main>

      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <AlertTriangle className="h-6 w-6" />
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!isCancelling) {
                    setShowCancelModal(false);
                  }
                }}
                className="rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <h2 className="mt-5 text-xl font-bold text-gray-950">
              Cancel this order?
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Are you sure you want to cancel order{" "}
              <span className="font-semibold text-gray-900">
                {order.orderNumber}
              </span>
              ? This action cannot be undone.
            </p>

            {cancelError && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {cancelError}
              </div>
            )}

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={isCancelling}
                onClick={() => {
                  setShowCancelModal(false);
                }}
                className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Keep Order
              </button>

              <button
                type="button"
                disabled={isCancelling}
                onClick={() => {
                  void handleCancelOrder();
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isCancelling && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}

                {isCancelling
                  ? "Cancelling..."
                  : "Yes, Cancel Order"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}