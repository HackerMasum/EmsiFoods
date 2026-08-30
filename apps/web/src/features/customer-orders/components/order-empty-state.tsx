"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  PackageOpen,
  SearchX,
  ShoppingBag,
} from "lucide-react";

type OrderEmptyStateProps = {
  totalOrders: number;
  onClearFilters: () => void;
};

export function OrderEmptyState({
  totalOrders,
  onClearFilters,
}: OrderEmptyStateProps) {
  const hasOrders = totalOrders > 0;

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 16,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.4,
      }}
      className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm sm:px-10"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-100/60 blur-3xl" />

        <div className="absolute bottom-0 right-0 h-40 w-40 translate-x-1/3 translate-y-1/3 rounded-full bg-indigo-100/50 blur-3xl" />
      </div>

      <div className="relative mx-auto flex max-w-md flex-col items-center">
        <div className="relative">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-50 text-blue-600 shadow-sm ring-1 ring-blue-100">
            {hasOrders ? (
              <SearchX className="h-10 w-10" />
            ) : (
              <PackageOpen className="h-10 w-10" />
            )}
          </div>

          <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-xl border border-white bg-gray-950 text-white shadow-lg">
            <ShoppingBag className="h-4 w-4" />
          </div>
        </div>

        <h2 className="mt-7 text-2xl font-bold tracking-tight text-gray-950">
          {hasOrders
            ? "No matching orders"
            : "No orders yet"}
        </h2>

        <p className="mt-3 text-sm leading-6 text-gray-500 sm:text-base">
          {hasOrders
            ? "No orders match your current filters. Try adjusting or clearing your filters to see more orders."
            : "You haven't placed any orders yet. Explore our products and place your first order today."}
        </p>

        {hasOrders ? (
          <button
            type="button"
            onClick={onClearFilters}
            className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition duration-200 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/25 active:scale-[0.98]"
          >
            Clear filters

            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        ) : (
          <Link
            href="/"
            className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition duration-200 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/25 active:scale-[0.98]"
          >
            Start shopping

            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        )}
      </div>
    </motion.div>
  );
}