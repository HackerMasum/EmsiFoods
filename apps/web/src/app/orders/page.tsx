"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  ReceiptText,
  RefreshCw,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getCustomerOrders,
} from "@/features/customer-orders/customer-order.api";

import type {
  CustomerOrder,
  CustomerOrderStatus,
} from "@/features/customer-orders/customer-order.types";

import {
  OrderFilters,
  type OrderSortOption,
} from "@/features/customer-orders/components/order-filters";

import {
  OrderHistory,
} from "@/features/customer-orders/components/order-history";

import {
  OrderStats,
} from "@/features/customer-orders/components/order-stats";

export default function OrdersPage() {
  const [orders, setOrders] =
    useState<CustomerOrder[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [searchQuery, setSearchQuery] =
    useState("");

  const [selectedStatus, setSelectedStatus] =
    useState<CustomerOrderStatus | "ALL">(
      "ALL"
    );

  const [sortBy, setSortBy] =
    useState<OrderSortOption>("newest");

  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token =
        localStorage.getItem("token");

      if (!token) {
        throw new Error(
          "You must be logged in to view your orders."
        );
      }

      const orderData =
        await getCustomerOrders(token);

      setOrders(orderData);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load orders."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchOrders();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [fetchOrders]);

  const filteredOrders = useMemo(() => {
    let result = [...orders];

    const normalizedSearch =
      searchQuery.trim().toLowerCase();

    if (normalizedSearch) {
      result = result.filter((order) =>
        order.orderNumber
          .toLowerCase()
          .includes(normalizedSearch)
      );
    }

    if (selectedStatus !== "ALL") {
      result = result.filter(
        (order) =>
          order.status === selectedStatus
      );
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return (
            new Date(a.createdAt).getTime() -
            new Date(b.createdAt).getTime()
          );

        case "highest":
          return (
            Number(b.total) -
            Number(a.total)
          );

        case "lowest":
          return (
            Number(a.total) -
            Number(b.total)
          );

        case "newest":
        default:
          return (
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
          );
      }
    });

    return result;
  }, [
    orders,
    searchQuery,
    selectedStatus,
    sortBy,
  ]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedStatus("ALL");
    setSortBy("newest");
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="animate-pulse">
            <div className="h-8 w-48 rounded-lg bg-gray-200" />

            <div className="mt-3 h-4 w-72 rounded bg-gray-200" />

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-32 rounded-2xl border border-gray-100 bg-white"
                />
              ))}
            </div>

            <div className="mt-8 h-32 rounded-2xl border border-gray-100 bg-white" />

            <div className="mt-6 space-y-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-gray-100 bg-white p-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex gap-4">
                      <div className="h-12 w-12 rounded-xl bg-gray-100" />

                      <div>
                        <div className="h-5 w-40 rounded bg-gray-200" />

                        <div className="mt-3 h-4 w-56 rounded bg-gray-100" />
                      </div>
                    </div>

                    <div className="h-8 w-24 rounded-full bg-gray-100" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-lg flex-col items-center rounded-3xl border border-red-100 bg-white p-10 text-center shadow-sm">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <AlertCircle className="h-7 w-7" />
          </div>

          <h1 className="mt-5 text-xl font-bold text-gray-950">
            Unable to load orders
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            {error}
          </p>

          <button
            type="button"
            onClick={() => {
              void fetchOrders();
            }}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gray-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 active:scale-[0.98]"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{
            opacity: 0,
            y: 12,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.4,
          }}
          className="mb-10"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-gray-950"
          >
            <ArrowLeft className="h-4 w-4" />
            Continue shopping
          </Link>

          <div className="mt-5 flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/20">
              <ReceiptText className="h-6 w-6" />
            </div>

            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
                My Orders
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500 sm:text-base">
                Track your orders, check delivery progress,
                and view your purchase history.
              </p>
            </div>
          </div>
        </motion.div>

        <div className="space-y-8">
          {/* Order statistics */}
          <OrderStats orders={orders} />

          {/* Search, filters and sorting */}
          <OrderFilters
            searchQuery={searchQuery}
            selectedStatus={selectedStatus}
            sortBy={sortBy}
            onSearchChange={setSearchQuery}
            onStatusChange={setSelectedStatus}
            onSortChange={setSortBy}
            onClearFilters={clearFilters}
          />

          {/* Result count */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {filteredOrders.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900">
                {orders.length}
              </span>{" "}
              orders
            </p>

            {(searchQuery ||
              selectedStatus !== "ALL" ||
              sortBy !== "newest") && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-sm font-semibold text-blue-600 transition hover:text-blue-700"
              >
                Reset filters
              </button>
            )}
          </div>

          {/* Orders */}
          <OrderHistory
            orders={filteredOrders}
            totalOrders={orders.length}
            onClearFilters={clearFilters}
          />
        </div>
      </div>
    </main>
  );
}