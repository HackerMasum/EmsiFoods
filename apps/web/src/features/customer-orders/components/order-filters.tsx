"use client";

import {
  ArrowDownUp,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import type {
  CustomerOrderStatus,
} from "../customer-order.types";

export type OrderSortOption =
  | "newest"
  | "oldest"
  | "highest"
  | "lowest";

type OrderFiltersProps = {
  searchQuery: string;
  selectedStatus: CustomerOrderStatus | "ALL";
  sortBy: OrderSortOption;
  onSearchChange: (value: string) => void;
  onStatusChange: (
    status: CustomerOrderStatus | "ALL"
  ) => void;
  onSortChange: (
    sort: OrderSortOption
  ) => void;
  onClearFilters: () => void;
};

const statusFilters: {
  label: string;
  value: CustomerOrderStatus | "ALL";
}[] = [
  {
    label: "All",
    value: "ALL",
  },
  {
    label: "Pending",
    value: "PENDING",
  },
  {
    label: "Confirmed",
    value: "CONFIRMED",
  },
  {
    label: "Processing",
    value: "PROCESSING",
  },
  {
    label: "Shipped",
    value: "SHIPPED",
  },
  {
    label: "Delivered",
    value: "DELIVERED",
  },
  {
    label: "Cancelled",
    value: "CANCELLED",
  },
];

export function OrderFilters({
  searchQuery,
  selectedStatus,
  sortBy,
  onSearchChange,
  onStatusChange,
  onSortChange,
  onClearFilters,
}: OrderFiltersProps) {
  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedStatus !== "ALL" ||
    sortBy !== "newest";

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-4">
        {/* Top controls */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              value={searchQuery}
              onChange={(event) =>
                onSearchChange(event.target.value)
              }
              placeholder="Search by order number..."
              className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
            />
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
              <ArrowDownUp className="h-4 w-4" />
              <span className="hidden sm:inline">
                Sort
              </span>
            </div>

            <select
              value={sortBy}
              onChange={(event) =>
                onSortChange(
                  event.target
                    .value as OrderSortOption
                )
              }
              className="h-11 rounded-xl border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 outline-none transition hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            >
              <option value="newest">
                Newest first
              </option>

              <option value="oldest">
                Oldest first
              </option>

              <option value="highest">
                Highest amount
              </option>

              <option value="lowest">
                Lowest amount
              </option>
            </select>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={onClearFilters}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-gray-200 px-3 text-sm font-medium text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                title="Clear filters"
              >
                <X className="h-4 w-4" />

                <span className="hidden sm:inline">
                  Clear
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Status filters */}
        <div className="flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
            <SlidersHorizontal className="h-4 w-4" />
            Status
          </div>

          <div className="flex flex-wrap gap-2">
            {statusFilters.map((filter) => {
              const isActive =
                selectedStatus === filter.value;

              return (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() =>
                    onStatusChange(filter.value)
                  }
                  className={[
                    "rounded-full px-3.5 py-2 text-xs font-semibold transition sm:text-sm",
                    isActive
                      ? "bg-blue-600 text-white shadow-sm shadow-blue-500/25"
                      : "bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-700",
                  ].join(" ")}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}